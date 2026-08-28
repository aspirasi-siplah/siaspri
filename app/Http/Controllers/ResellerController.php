<?php

namespace App\Http\Controllers;

use App\Models\Reseller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ResellerController extends Controller
{
    public function show(Request $request, string $referenceCode): Response
    {
        $reseller = Reseller::query()
            ->with(['principal' => fn ($query) => $query->select(['id', 'name'])])
            ->where('reference_code', $referenceCode)
            ->firstOrFail();

        return Inertia::render('resellers/show-landing', [
            'reseller' => [
                'id' => $reseller->id,
                'name' => $reseller->name,
                'npwp_number' => $reseller->npwp_number,
                'document_number' => $reseller->document_number,
                'reference_code' => $reseller->reference_code,
                'reference_link' => $reseller->reference_link,
                'principal_name' => $reseller->principal?->name,
                'principal_link' => $reseller->principal_id
                    ? route('principals.show', $reseller->principal_id)
                    : null,
            ],
        ]);
    }
}
