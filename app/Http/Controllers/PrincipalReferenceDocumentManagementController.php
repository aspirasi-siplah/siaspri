<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePrincipalReferenceDocumentRequest;
use App\Http\Requests\UpdatePrincipalReferenceDocumentRequest;
use App\Models\PrincipalReferenceDocument;
use Inertia\Inertia;

class PrincipalReferenceDocumentManagementController extends Controller
{
    public function index()
    {
        $documents = PrincipalReferenceDocument::query()
            ->latest()
            ->paginate(10)
            ->through(function (PrincipalReferenceDocument $document) {
                return [
                    'id' => $document->id,
                    'reference_id' => $document->reference_id,
                    'reference_link' => $document->reference_link,
                    'principal_name' => $document->principal_name,
                    'document_number' => $document->document_number,
                    'program_name' => $document->program_name,
                    'category_name' => $document->category_name,
                    'status' => $document->status,
                    'expired_date' => $document->expired_date->format('Y-m-d'),
                    'created_at' => $document->created_at->translatedFormat('d M Y H:i'),
                ];
            });

        return Inertia::render(
            'reference-documents/index-reference-document',
            [
                'documents' => $documents,
            ]
        );
    }

    public function store(StorePrincipalReferenceDocumentRequest $request)
    {
        $validated = $request->validated();
        $validated['reference_id'] = PrincipalReferenceDocument::generateReferenceId($validated['program_name']);

        PrincipalReferenceDocument::create($validated);

        return redirect()->back()->with(
            'success',
            'Reference Document berhasil ditambahkan.'
        );
    }

    public function update(UpdatePrincipalReferenceDocumentRequest $request, $id)
    {
        $document = PrincipalReferenceDocument::findOrFail($id);

        $document->update($request->validated());

        return redirect()->back()->with(
            'success',
            'Reference Document berhasil diperbarui.'
        );
    }

    public function destroy($id)
    {
        $document = PrincipalReferenceDocument::findOrFail($id);

        $document->delete();

        return redirect()->back()->with(
            'success',
            'Reference Document berhasil dihapus.'
        );
    }
}
