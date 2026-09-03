<?php

namespace App\Http\Controllers;

use App\Http\Requests\ImportResellersRequest;
use App\Http\Requests\StoreResellerRequest;
use App\Http\Requests\UpdateResellerRequest;
use App\Jobs\ProcessResellersImport;
use App\Models\Principal;
use App\Models\Reseller;
use App\Models\ResellerImport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

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
        $import = ResellerImport::query()
            ->where('principal_id', $principal->id)
            ->latest('id')
            ->first();

        return Inertia::render('principal-management/reseller-import', [
            'principal' => [
                'id' => $principal->id,
                'name' => $principal->name,
            ],
            'activeImport' => $import === null ? null : $this->importPayload($import),
        ]);
    }

    public function importStore(ImportResellersRequest $request, Principal $principal): RedirectResponse
    {
        $directory = 'reseller-imports/'.$this->tempDirectoryKey();

        $excelPath = $request->file('file')->store($directory, 'local');
        $zipPath = $request->hasFile('document_zip')
            ? $request->file('document_zip')->store($directory, 'local')
            : null;

        $import = ResellerImport::create([
            'principal_id' => $principal->id,
            'status' => 'processing',
        ]);

        ProcessResellersImport::dispatch($import, $excelPath, $zipPath);

        return back();
    }

    public function importStatus(Principal $principal, ResellerImport $import): JsonResponse
    {
        abort_unless($import->principal_id === $principal->id, 404);

        return response()->json($this->importPayload($import));
    }

    /**
     * @return array{id: int, status: string, result: array<int, array{row: int, attribute: string, errors: string[]}>|null}
     */
    private function importPayload(ResellerImport $import): array
    {
        return [
            'id' => $import->id,
            'status' => $import->status,
            'result' => $import->status === 'completed' ? $import->result : null,
        ];
    }

    private function tempDirectoryKey(): string
    {
        return date('YmdHis').'_'.Str::random(8);
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
