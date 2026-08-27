<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePrincipalDocumentRequest;
use App\Http\Requests\UpdatePrincipalDocumentRequest;
use App\Models\Principal;
use App\Models\PrincipalDocument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class PrincipalDocumentManagementController extends Controller
{
    public function store(StorePrincipalDocumentRequest $request, Principal $principal): RedirectResponse
    {
        $data = $request->validated();
        $data['principal_id'] = $principal->id;
        $data['name'] = (string) $data['name'];
        $data['path'] = $request->file('file')->store('principal-documents');
        unset($data['file']);
        PrincipalDocument::create($data);

        return back()->with('success', 'Dokumen Principal berhasil ditambahkan.');
    }

    public function update(UpdatePrincipalDocumentRequest $request, Principal $principal, PrincipalDocument $document): RedirectResponse
    {
        abort_unless($document->principal_id === $principal->id, 404);
        $data = $request->validated();
        $data['name'] = (string) $data['name'];
        unset($data['file']);
        if ($request->hasFile('file')) {
            Storage::delete($document->path);
            $data['path'] = $request->file('file')->store('principal-documents');
        }
        $document->update($data);

        return back()->with('success', 'Dokumen Principal berhasil diperbarui.');
    }

    public function destroy(Principal $principal, PrincipalDocument $document): RedirectResponse
    {
        abort_unless($document->principal_id === $principal->id, 404);
        Storage::delete($document->path);
        $document->delete();

        return back()->with('success', 'Dokumen Principal berhasil dihapus.');
    }
}
