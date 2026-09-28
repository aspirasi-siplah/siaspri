<?php

namespace App\Http\Controllers;

use App\Jobs\ExportResellers;
use App\Models\ResellerExport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ResellerExportController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $export = ResellerExport::create([
            'user_id' => $request->user()->id,
            'status' => 'processing',
        ]);

        ExportResellers::dispatch($export);

        return back()->with('success', 'Data reseller sedang diekspor, mohon tunggu sebentar.');
    }

    public function status(Request $request, ResellerExport $export): JsonResponse
    {
        abort_unless($export->user_id === $request->user()->id, 404);

        return response()->json($export->payload());
    }

    public function download(Request $request, ResellerExport $export): StreamedResponse
    {
        abort_unless($export->user_id === $request->user()->id, 404);
        abort_unless($export->is_completed && $export->file_path !== null, 404);

        return Storage::disk('local')->download($export->file_path, $export->file_name);
    }
}
