<?php

namespace App\Http\Controllers;

use App\Models\Principal;
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

    public function show(Principal $principal): Response
    {
        $principal->load([
            'resellers' => fn ($query) => $query->select([
                'id',
                'principal_id',
                'name',
                'document_number',
                'reference_code',
            ]),
        ]);

        return Inertia::render('principals/show-landing', [
            'principal' => [
                'id' => $principal->id,
                'name' => $principal->name,
                'notes' => $principal->notes,
                'resellers' => $principal->resellers->map(fn ($reseller) => [
                    'id' => $reseller->id,
                    'name' => $reseller->name,
                    'document_number' => $reseller->document_number,
                    'reference_code' => $reseller->reference_code,
                    'reference_link' => $reseller->reference_link,
                ])->values()->all(),
            ],
        ]);
    }
}
