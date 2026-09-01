<?php

namespace App\Http\Controllers;

use App\Enums\TemplateDocumentType;
use App\Models\Principal;
use App\Models\Reseller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;

class PrincipalController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('principals/index-landing', [
            'principals' => Principal::query()->withCount(['resellers', 'documents'])
                ->when($request->string('search')->value(), fn ($query, $search) => $query->where('name', 'ILIKE', '%'.$search.'%'))
                ->latest()->paginate(12)->withQueryString(),
            'template_documents' => $this->templateDocuments(),
        ]);
    }

    public function show(Request $request, Principal $principal): Response
    {
        $resellers = Reseller::query()
            ->where('principal_id', $principal->id)
            ->when($request->string('search')->value(), fn ($query, $search) => $query->searchByName($search))
            ->latest('id')
            ->select(['id', 'name', 'document_number', 'reference_code'])
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('principals/show-landing', [
            'principal' => [
                'id' => $principal->id,
                'name' => $principal->name,
                'notes' => $principal->notes,
                'resellers_total' => (int) $principal->resellers()->count(),
                'resellers' => [
                    'data' => collect($resellers->items())->map(fn (Reseller $reseller) => [
                        'id' => $reseller->id,
                        'name' => $reseller->name,
                        'document_number' => $reseller->document_number,
                        'reference_code' => $reseller->reference_code,
                        'reference_link' => $reseller->reference_link,
                    ])->values()->all(),
                    'current_page' => $resellers->currentPage(),
                    'last_page' => $resellers->lastPage(),
                    'total' => $resellers->total(),
                    'per_page' => $resellers->perPage(),
                    'next_page_url' => $resellers->nextPageUrl(),
                    'prev_page_url' => $resellers->previousPageUrl(),
                ],
            ],
        ]);
    }

    private function templateDocuments(): array
    {
        $jsonPath = storage_path('app/template-documents.json');

        if (! File::exists($jsonPath)) {
            return [];
        }

        $documents = json_decode(File::get($jsonPath), true) ?? [];

        return collect($documents)->map(function (array $document) {
            $type = TemplateDocumentType::tryFrom($document['label']);

            return [
                'id' => $document['id'],
                'label' => $type?->label() ?? $document['label'],
                'file_name' => $document['file_name'],
                'file_path' => $document['file_path'],
                'updated_at' => $document['updated_at'],
            ];
        })->values()->all();
    }
}
