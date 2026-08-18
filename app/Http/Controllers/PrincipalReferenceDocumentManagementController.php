<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePrincipalReferenceDocumentRequest;
use App\Http\Requests\UpdatePrincipalReferenceDocumentRequest;
use App\Models\PrincipalReferenceDocument;
use Illuminate\Support\Facades\Storage;
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
                    'company_name' => $document->company_name,
                    'document_number' => $document->document_number,
                    'file_name' => $document->file_name,
                    'file_path' => $document->file_path ? Storage::url($document->file_path) : null,
                    'program_name' => $document->program_name,
                    'category_name' => $document->category_name,
                    'status' => $document->status,
                    'expired_date' => $document->expired_date ? $document->expired_date->format('Y-m-d') : null,
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
        $validated['reference_id'] = PrincipalReferenceDocument::generateReferenceId(
            $validated['program_name'] ?? 'BP'
        );

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('principal-documents');
            $validated['file_name'] = $request->file('file')->getClientOriginalName();
            $validated['file_path'] = $path;
        }

        PrincipalReferenceDocument::create($validated);

        return redirect()->back()->with(
            'success',
            'Reference Document berhasil ditambahkan.'
        );
    }

    public function update(UpdatePrincipalReferenceDocumentRequest $request, $id)
    {
        $document = PrincipalReferenceDocument::findOrFail($id);

        $validated = $request->validated();

        if ($request->hasFile('file')) {
            if ($document->file_path) {
                Storage::delete($document->file_path);
            }
            $path = $request->file('file')->store('principal-documents');
            $validated['file_name'] = $request->file('file')->getClientOriginalName();
            $validated['file_path'] = $path;
        }

        $document->update($validated);

        return redirect()->back()->with(
            'success',
            'Reference Document berhasil diperbarui.'
        );
    }

    public function destroy($id)
    {
        $document = PrincipalReferenceDocument::findOrFail($id);

        if ($document->file_path) {
            Storage::delete($document->file_path);
        }

        $document->delete();

        return redirect()->back()->with(
            'success',
            'Reference Document berhasil dihapus.'
        );
    }
}
