<?php

namespace App\Jobs;

use App\Imports\ResellersImport;
use App\Models\Reseller;
use App\Models\ResellerImport as ResellerImportModel;
use FilesystemIterator;
use Illuminate\Contracts\Queue\ShouldBeUniqueUntilProcessing;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use Symfony\Component\HttpFoundation\File\File;
use ZipArchive;

class ProcessResellersImport implements ShouldBeUniqueUntilProcessing, ShouldQueue
{
    use Queueable;

    /**
     * Unique job key for the import record to prevent duplicate processing.
     */
    public function uniqueId(): string
    {
        return 'reseller-import-'.$this->import->id;
    }

    /**
     * @param  string  $excelPath  Temporary path (relative to the configured disk) of the uploaded Excel file.
     * @param  string|null  $zipPath  Temporary path (relative to the configured disk) of the uploaded ZIP file.
     */
    public function __construct(
        public ResellerImportModel $import,
        public string $excelPath,
        public ?string $zipPath = null,
        public string $disk = 'local',
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $excel = Storage::disk($this->disk)->path($this->excelPath);
        $zip = $this->zipPath !== null ? Storage::disk($this->disk)->path($this->zipPath) : null;

        $import = new ResellersImport($this->import->principal_id);
        Excel::import($import, $excel);

        $documentSkipReasons = $this->attachResellerDocuments($import->getDocumentFiles(), $zip);

        $issues = collect($import->getImportIssues())
            ->merge($documentSkipReasons)
            ->values()
            ->all();

        $this->import->update([
            'status' => 'completed',
            'result' => [
                'imported' => $import->importedCount,
                'failures' => $issues,
            ],
        ]);

        $this->cleanup();
    }

    /**
     * @param  array<string, string>  $documentFiles
     * @return array<int, array{row: int, attribute: string, errors: string[]}>
     */
    private function attachResellerDocuments(array $documentFiles, ?string $zipPath): array
    {
        if ($documentFiles === [] || $zipPath === null) {
            return $documentFiles === [] && $zipPath !== null
                ? [['row' => 0, 'attribute' => 'document_zip', 'errors' => ['File ZIP diunggah, tetapi tidak ada kolom document_file di file Excel.']]]
                : [];
        }

        if (pathinfo($zipPath, PATHINFO_EXTENSION) !== 'zip') {
            return [['row' => 0, 'attribute' => 'document_zip', 'errors' => ['File dokumen harus berformat .zip.']]];
        }

        $zip = new ZipArchive;
        $open = $zip->open($zipPath);

        if ($open !== true) {
            return [['row' => 0, 'attribute' => 'document_zip', 'errors' => ['File ZIP tidak dapat dibuka.']]];
        }

        $extractPath = $this->extractZip($zip);
        $zip->close();

        if ($extractPath === null) {
            return [['row' => 0, 'attribute' => 'document_zip', 'errors' => ['File ZIP tidak dapat diekstrak.']]];
        }

        try {
            $storedFiles = $this->distributeFiles($extractPath, array_map(fn (string $f) => strtolower(trim($f)), $documentFiles));

            $skipReasons = [];

            foreach ($documentFiles as $referenceCode => $fileName) {
                $reseller = Reseller::query()->where('reference_code', $referenceCode)->first();

                if ($reseller === null) {
                    continue;
                }

                $storedPath = $storedFiles[strtolower(trim($fileName))] ?? null;

                if ($storedPath === null) {
                    $skipReasons[] = $this->documentSkipReason("File '$fileName' tidak ditemukan di dalam ZIP.", $fileName);

                    continue;
                }

                $reseller->update(['document_path' => $storedPath]);
            }

            return $skipReasons;
        } finally {
            $this->deleteDirectory($extractPath);
        }
    }

    private function extractZip(ZipArchive $zip): ?string
    {
        $extractPath = tempnam(sys_get_temp_dir(), 'rzip_');
        if ($extractPath === false) {
            return null;
        }

        unlink($extractPath);
        mkdir($extractPath);

        $zip->extractTo($extractPath);

        return $extractPath;
    }

    private function deleteDirectory(string $path): void
    {
        if (! is_dir($path)) {
            return;
        }

        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS),
            RecursiveIteratorIterator::CHILD_FIRST
        );

        foreach ($iterator as $item) {
            $item->isDir() && ! $item->isLink()
                ? rmdir($item->getRealPath())
                : unlink($item->getRealPath());
        }

        rmdir($path);
    }

    private function distributeFiles(string $extractPath, array $documentFiles): array
    {
        $storedFiles = [];

        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($extractPath, FilesystemIterator::SKIP_DOTS)
        );

        foreach ($iterator as $file) {
            if ($file->isDir()) {
                continue;
            }

            $basename = strtolower(trim($file->getFilename()));

            if (! in_array($basename, $documentFiles, true) || isset($storedFiles[$basename])) {
                continue;
            }

            $realPath = $file->getRealPath();
            $extension = strtolower(pathinfo($realPath, PATHINFO_EXTENSION));
            $storedFiles[$basename] = Storage::disk('public')->putFileAs('resellers', new File($realPath), Str::random(40).'.'.$extension);
        }

        return $storedFiles;
    }

    /**
     * @return array{row: int, attribute: string, errors: string[]}
     */
    private function documentSkipReason(string $message, string $fileName): array
    {
        return [
            'row' => 0,
            'attribute' => 'document_file',
            'errors' => [$message],
        ];
    }

    private function cleanup(): void
    {
        foreach (array_filter([$this->excelPath, $this->zipPath]) as $file) {
            Storage::disk($this->disk)->delete($file);
        }
    }

    public function failed(\Throwable $exception): void
    {
        $this->import->update([
            'status' => 'failed',
            'result' => [
                'imported' => 0,
                'failures' => [
                    ['row' => 0, 'attribute' => 'file', 'errors' => ['Terjadi kesalahan saat memproses import.']],
                ],
            ],
        ]);

        $this->cleanup();
    }
}
