<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProgramRequest;
use App\Http\Requests\UpdateProgramRequest;
use App\Models\Program;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProgramManagementController extends Controller
{
    public function index(Request $request): Response
    {
        $programs = Program::query()
            ->withCount('principals')
            ->when($request->string('search')->value(), function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'ILIKE', '%'.$search.'%')
                        ->orWhere('code', 'ILIKE', '%'.$search.'%');
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Program $program) => [
                'id' => $program->id,
                'code' => $program->code,
                'name' => $program->name,
                'year' => $program->year,
                'id_fund' => $program->id_fund,
                'principals_count' => $program->principals_count,
                'created_at' => $program->created_at?->translatedFormat('d M Y H:i'),
            ]);

        return Inertia::render('programs-management/index', [
            'programs' => $programs,
        ]);
    }

    public function store(StoreProgramRequest $request): RedirectResponse
    {
        Program::create($request->validated());

        return back()->with('success', 'Program berhasil ditambahkan.');
    }

    public function update(UpdateProgramRequest $request, Program $program): RedirectResponse
    {
        $program->update($request->validated());

        return back()->with('success', 'Program berhasil diperbarui.');
    }

    public function destroy(Program $program): RedirectResponse
    {
        $program->delete();

        return back()->with('success', 'Program berhasil dihapus.');
    }
}
