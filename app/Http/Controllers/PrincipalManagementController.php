<?php

namespace App\Http\Controllers;

use App\Enums\PrincipalDocumentType;
use App\Http\Requests\StorePrincipalRequest;
use App\Http\Requests\UpdatePrincipalRequest;
use App\Models\Principal;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PrincipalManagementController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('principal-management/index', [
            'principals' => Principal::query()->withCount(['resellers', 'documents'])->latest()->paginate(10)->through(fn (Principal $principal) => [
                'id' => $principal->id,
                'name' => $principal->name,
                'notes' => $principal->notes,
                'npwp_number' => $principal->npwp_number,
                'nib' => $principal->nib,
                'resellers_count' => $principal->resellers_count,
                'documents_count' => $principal->documents_count,
                'created_at' => $principal->created_at?->translatedFormat('d M Y H:i'),
            ]),
        ]);
    }

    public function show(Principal $principal): Response
    {
        $principal->load('resellers', 'documents');

        return Inertia::render('principal-management/show', [
            'principal' => $this->payload($principal),
            'document_types' => PrincipalDocumentType::cases(),
        ]);
    }

    public function store(StorePrincipalRequest $request): RedirectResponse
    {
        Principal::create($request->validated());

        return back()->with('success', 'Principal berhasil ditambahkan.');
    }

    public function update(UpdatePrincipalRequest $request, Principal $principal): RedirectResponse
    {
        $principal->update($request->validated());

        return back()->with('success', 'Principal berhasil diperbarui.');
    }

    public function destroy(Principal $principal): RedirectResponse
    {
        $principal->delete();

        return back()->with('success', 'Principal berhasil dihapus.');
    }

    public function payload(Principal $principal): array
    {
        return [
            'id' => $principal->id,
            'name' => $principal->name,
            'notes' => $principal->notes,
            'npwp_number' => $principal->npwp_number,
            'nib' => $principal->nib,
            'resellers' => $principal->resellers->map(fn ($reseller) => [
                'id' => $reseller->id,
                'name' => $reseller->name,
                'npwp_number' => $reseller->npwp_number,
                'document_number' => $reseller->document_number,
                'document_path' => $reseller->document_path ? asset('storage/'.$reseller->document_path) : null,
                'reference_code' => $reseller->reference_code,
                'reference_link' => $reseller->reference_link,
            ])->values()->all(),
            'documents' => $principal->documents->map(fn ($document) => [
                'id' => $document->id,
                'name' => $document->name,
                'path' => asset('storage/'.$document->path),
            ])->values()->all(),
        ];
    }
}
