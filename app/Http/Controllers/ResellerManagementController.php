<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreResellerRequest;
use App\Http\Requests\UpdateResellerRequest;
use App\Models\Principal;
use App\Models\Reseller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class ResellerManagementController extends Controller
{
    public function store(StoreResellerRequest $request, Principal $principal): RedirectResponse
    {
        $data = $request->validated();
        $data['principal_id'] = $principal->id;
        $data['reference_code'] = Reseller::generateReferenceCode($data['name']);
        $data['document_path'] = $request->hasFile('file') ? $request->file('file')->store('resellers') : null;
        unset($data['file']);
        Reseller::create($data);

        return back()->with('success', 'Reseller berhasil ditambahkan.');
    }

    public function update(UpdateResellerRequest $request, Principal $principal, Reseller $reseller): RedirectResponse
    {
        abort_unless($reseller->principal_id === $principal->id, 404);
        $data = $request->validated();
        unset($data['file'], $data['reference_code']);
        if ($request->hasFile('file')) {
            Storage::delete($reseller->document_path);
            $data['document_path'] = $request->file('file')->store('resellers');
        }
        $reseller->update($data);

        return back()->with('success', 'Reseller berhasil diperbarui.');
    }

    public function destroy(Principal $principal, Reseller $reseller): RedirectResponse
    {
        abort_unless($reseller->principal_id === $principal->id, 404);
        Storage::delete($reseller->document_path);
        $reseller->delete();

        return back()->with('success', 'Reseller berhasil dihapus.');
    }
}
