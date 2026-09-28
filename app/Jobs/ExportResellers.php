<?php

namespace App\Jobs;

use App\Exports\ResellersExport;
use App\Models\Reseller;
use App\Models\ResellerExport;
use Illuminate\Contracts\Queue\ShouldBeUniqueUntilProcessing;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class ExportResellers implements ShouldBeUniqueUntilProcessing, ShouldQueue
{
    use Queueable;

    /**
     * Unique job key per user so a second click does not queue a duplicate export.
     */
    public function uniqueId(): string
    {
        return 'reseller-export-'.$this->export->user_id;
    }

    public function __construct(public ResellerExport $export) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->cleanupPreviousFiles();

        $fileName = 'resellers-'.now()->format('Ymd-His').'.xlsx';
        $filePath = 'reseller-exports/'.$fileName;

        Excel::store(new ResellersExport, $filePath, 'local');

        $this->export->update([
            'status' => 'completed',
            'file_path' => $filePath,
            'file_name' => $fileName,
            'total' => Reseller::query()->whereHas('principal')->count(),
        ]);
    }

    public function failed(\Throwable $exception): void
    {
        $this->export->update([
            'status' => 'failed',
        ]);
    }

    /**
     * Remove generated files of the previous exports so the disk does not fill up.
     */
    private function cleanupPreviousFiles(): void
    {
        ResellerExport::query()
            ->forUser($this->export->user)
            ->whereKeyNot($this->export->getKey())
            ->whereNotNull('file_path')
            ->get()
            ->each(function (ResellerExport $export) {
                Storage::disk('local')->delete($export->file_path);

                $export->update([
                    'file_path' => null,
                    'file_name' => null,
                ]);
            });
    }
}
