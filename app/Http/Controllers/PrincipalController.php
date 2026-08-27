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
        $principal->load('resellers', 'documents');

        return Inertia::render('principals/show-landing', [
            'principal' => app(PrincipalManagementController::class)->payload($principal),
        ]);
    }
}
