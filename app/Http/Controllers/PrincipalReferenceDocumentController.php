<?php

namespace App\Http\Controllers;

use App\Models\PrincipalReferenceDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PrincipalReferenceDocumentController extends Controller
{
    public function index(Request $request)
    {
        $documents = PrincipalReferenceDocument::query()
            ->latest()
            ->when($request->search, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('reference_id', 'ILIKE', '%'.$search.'%')
                        ->orWhere('principal_name', 'ILIKE', '%'.$search.'%')
                        ->orWhere('company_name', 'ILIKE', '%'.$search.'%')
                        ->orWhere('program_name', 'ILIKE', '%'.$search.'%')
                        ->orWhere('document_number', 'ILIKE', '%'.$search.'%');
                });
            })
            ->paginate(12)
            ->through(function (PrincipalReferenceDocument $document) {
                return [
                    'id' => $document->id,
                    'reference_id' => $document->reference_id,
                    'reference_link' => $document->reference_link,
                    'principal_name' => $document->principal_name,
                    'company_name' => $document->company_name,
                    'document_number' => $document->document_number,
                    'program_name' => $document->program_name,
                    'category_name' => $document->category_name,
                    'file_name' => $document->file_name,
                    'file_path' => $document->file_path ? Storage::url($document->file_path) : null,
                    'status' => $document->status,
                    'expired_date' => $document->expired_date ? $document->expired_date->format('d F Y') : null,
                ];
            });

        return Inertia::render(
            'reference-documents/index',
            [
                'documents' => $documents,
            ]
        );
    }

    public function show($referenceId)
    {
        $document = PrincipalReferenceDocument::query()
            ->where('reference_id', $referenceId)
            ->firstOrFail();

        return Inertia::render(
            'reference-documents/show',
            [
                'document' => $this->documentPayload($document),
            ]
        );
    }

    public function verify($referenceId)
    {
        $document = PrincipalReferenceDocument::query()
            ->where('reference_id', $referenceId)
            ->firstOrFail();

        return Inertia::render(
            'reference-documents/verify',
            [
                'document' => $this->documentPayload($document),
            ]
        );
    }

    private function documentPayload(PrincipalReferenceDocument $document): array
    {
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
            'expired_date' => $document->expired_date ? $document->expired_date->format('d F Y') : null,
            'created_at' => $document->created_at->translatedFormat('d F Y'),
        ];
    }
}
