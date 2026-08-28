<?php

namespace App\Http\Controllers;

use App\Models\Principal;
use App\Models\Reseller;
use Illuminate\Http\Request;
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
}
