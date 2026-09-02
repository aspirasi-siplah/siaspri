<?php

namespace App\Http\Controllers;

use App\Http\Requests\ImportResellersRequest;
use App\Http\Requests\StoreResellerRequest;
use App\Http\Requests\UpdateResellerRequest;
use App\Imports\ResellersImport;
use App\Models\Principal;
use App\Models\Reseller;
use FilesystemIterator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use ZipArchive;

class ResellerManagementController extends Controller
{
    public function store(StoreResellerRequest $request, Principal $principal): RedirectResponse
    {
        $data = $request->validated();
        $data['principal_id'] = $principal->id;
        $data['reference_code'] = Reseller::generateReferenceCode($data['name']);
        $data['document_path'] = $request->hasFile('file') ? $request->file('file')->store('resellers') : null;
        unset($data['file']);
        Reseller::create($data);

        return back()->with('success', 'Reseller berhasil ditambahkan.');
    }

    public function update(UpdateResellerRequest $request, Principal $principal, Reseller $reseller): RedirectResponse
    {
        abort_unless($reseller->principal_id === $principal->id, 404);
        $data = $request->validated();
        unset($data['file'], $data['reference_code']);
        if ($request->hasFile('file')) {
            Storage::delete($reseller->document_path);
            $data['document_path'] = $request->file('file')->store('resellers');
        }
        $reseller->update($data);

        return back()->with('success', 'Reseller berhasil diperbarui.');
    }

    public function import(Principal $principal): Response
    {
        return Inertia::render('principal-management/reseller-import', [
            'principal' => [
                'id' => $principal->id,
                'name' => $principal->name,
            ],
            'result' => session('reseller_import_result'),
        ]);
    }

    public function importStore(ImportResellersRequest $request, Principal $principal): RedirectResponse
    {
        $import = new ResellersImport($principal->id);
        Excel::import($import, $request->file('file'));

        $documentSkipReasons = $this->attachResellerDocuments($import->getDocumentFiles(), $request->file('document_zip'));

        $issues = collect($import->getImportIssues())
            ->merge($documentSkipReasons)
            ->values()
            ->all();

        return back()->with('reseller_import_result', [
            'imported' => $import->importedCount,
            'failures' => $issues,
        ]);
    }

    /**
     * @param  array<string, string>  $documentFiles
     * @return array<int, array{row: int, attribute: string, errors: string[]}>
     */
    private function attachResellerDocuments(array $documentFiles, ?UploadedFile $zipFile): array
    {
        if ($documentFiles === [] || $zipFile === null) {
            return $documentFiles === [] && $zipFile !== null
                ? [['row' => 0, 'attribute' => 'document_zip', 'errors' => ['File ZIP diunggah, tetapi tidak ada kolom document_file di file Excel.']]]
                : [];
        }

        if ($zipFile->extension() !== 'zip') {
            return [['row' => 0, 'attribute' => 'document_zip', 'errors' => ['File dokumen harus berformat .zip.']]];
        }

        $zip = new ZipArchive;
        $open = $zip->open($zipFile->getRealPath());

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

    public function importTemplate(Principal $principal): SymfonyResponse
    {
        $path = resource_path('templates/imports/reseller-import-template.xlsx');

        return response()->download($path, 'reseller-import-template.xlsx');
    }

    public function destroy(Principal $principal, Reseller $reseller): RedirectResponse
    {
        abort_unless($reseller->principal_id === $principal->id, 404);
        Storage::delete($reseller->document_path);
        $reseller->delete();

        return back()->with('success', 'Reseller berhasil dihapus.');
    }
}
