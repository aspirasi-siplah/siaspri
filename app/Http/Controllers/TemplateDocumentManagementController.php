<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TemplateDocumentManagementController extends Controller
{
    private string $jsonPath;

    private string $uploadDir = 'template-documents';

    public function __construct()
    {
        $this->jsonPath = storage_path('app/template-documents.json');
    }

    public function index(): Response
    {
        $documents = collect($this->getDocuments())->map(function (array $document) {
            return array_merge($document, [
                'view_url' => Storage::disk('public')->url($document['file_path']),
            ]);
        })->values()->all();

        return Inertia::render('template-documents/index-template-document', [
            'documents' => $documents,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'label' => 'required|string|max:255',
            'file' => 'required|file|max:10240|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar',
        ], [
            'label.required' => 'Label harus diisi.',
            'label.string' => 'Label harus berupa teks.',
            'label.max' => 'Label maksimal berukuran 255 karakter.',
            'file.required' => 'File harus diupload.',
            'file.file' => 'Harus berupa file.',
            'file.max' => 'Ukuran file maksimal 10MB.',
            'file.mimes' => 'Format file tidak didukung.',
        ]);

        $documents = $this->getDocuments();
        $label = $request->input('label');
        $fileName = $this->generateFileName($label, $request->file('file'));

        $existingIndex = collect($documents)->search(fn ($doc) => $doc['label'] === $label);

        if ($existingIndex !== false) {
            $oldPath = $documents[$existingIndex]['file_path'];
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }

            $path = $this->storeFile($request->file('file'), $fileName);
            $documents[$existingIndex]['file_path'] = $path;
            $documents[$existingIndex]['file_name'] = $fileName;
            $documents[$existingIndex]['updated_at'] = now()->toIso8601String();

            $this->saveDocuments($documents);

            return redirect()->back()->with('success', 'Template dokumen berhasil diperbarui (file diganti).');
        }

        $path = $this->storeFile($request->file('file'), $fileName);

        $documents[] = [
            'id' => (string) Str::uuid(),
            'label' => $label,
            'file_name' => $fileName,
            'file_path' => $path,
            'created_at' => now()->toIso8601String(),
            'updated_at' => now()->toIso8601String(),
        ];

        $this->saveDocuments($documents);

        return redirect()->back()->with('success', 'Template dokumen berhasil ditambahkan.');
    }

    public function update(Request $request, string $id): RedirectResponse
    {
        $request->validate([
            'label' => 'required|string|max:255',
            'file' => 'nullable|file|max:10240|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar',
        ], [
            'label.required' => 'Label harus diisi.',
            'label.string' => 'Label harus berupa teks.',
            'label.max' => 'Label maksimal berukuran 255 karakter.',
            'file.file' => 'Harus berupa file.',
            'file.max' => 'Ukuran file maksimal 10MB.',
            'file.mimes' => 'Format file tidak didukung.',
        ]);

        $documents = $this->getDocuments();
        $index = collect($documents)->search(fn ($doc) => $doc['id'] === $id);

        if ($index === false) {
            return redirect()->back()->with('error', 'Template dokumen tidak ditemukan.');
        }

        $label = $request->input('label');

        if ($request->hasFile('file')) {
            $oldPath = $documents[$index]['file_path'];
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }

            $fileName = $this->generateFileName($label, $request->file('file'));
            $path = $this->storeFile($request->file('file'), $fileName);
            $documents[$index]['file_path'] = $path;
            $documents[$index]['file_name'] = $fileName;
        }

        $documents[$index]['label'] = $label;
        $documents[$index]['updated_at'] = now()->toIso8601String();

        $this->saveDocuments($documents);

        return redirect()->back()->with('success', 'Template dokumen berhasil diperbarui.');
    }

    public function destroy(string $id): RedirectResponse
    {
        $documents = $this->getDocuments();
        $index = collect($documents)->search(fn ($doc) => $doc['id'] === $id);

        if ($index === false) {
            return redirect()->back()->with('error', 'Template dokumen tidak ditemukan.');
        }

        $filePath = $documents[$index]['file_path'];
        if (Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
        }

        unset($documents[$index]);
        $this->saveDocuments(array_values($documents));

        return redirect()->back()->with('success', 'Template dokumen berhasil dihapus.');
    }

    private function getDocuments(): array
    {
        if (! File::exists($this->jsonPath)) {
            return [];
        }

        $content = File::get($this->jsonPath);

        return json_decode($content, true) ?? [];
    }

    private function saveDocuments(array $documents): void
    {
        File::put($this->jsonPath, json_encode($documents, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    private function generateFileName(string $label, UploadedFile $file): string
    {
        return Str::slug($label).'.'.$file->getClientOriginalExtension();
    }

    private function storeFile(UploadedFile $file, string $fileName): string
    {
        return $file->storeAs($this->uploadDir, $fileName, 'public');
    }
}
