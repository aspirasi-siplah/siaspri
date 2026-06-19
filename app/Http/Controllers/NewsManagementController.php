<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class NewsManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('news-management/IndexNewsManagement', [
            'news' => News::query()
                ->latest()
                ->paginate(10)
                ->through(fn($item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'slug' => $item->slug,
                    'thumbnail' => $item->thumbnail,
                    'status' => $item->status,
                    'published_at' => $item->published_at?->format('d M Y'),
                    'created_at' => $item->created_at ? $item->created_at->format('d M Y') : null,
                ]),
        ]);
    }

    public function show($id)
    {
        $news = News::findOrFail($id);

        if (!$news) {
            return redirect()->route('news-management.index')
                ->with('error', 'Berita tidak ditemukan');
        }

        return Inertia::render(
            'news-management/NewsManagementShow',
            [
                'news' => [
                    'id' => $news->id,
                    'title' => $news->title,
                    'slug' => $news->slug,
                    'thumbnail' => $news->thumbnail,
                    'excerpt' => $news->excerpt,
                    'content' => $news->content,
                    'status' => $news->status,
                    'published_at' => $news->published_at?->format('d F Y H:i'),
                    'created_at' => $news->created_at->format('d F Y H:i'),
                    'updated_at' => $news->updated_at->format('d F Y H:i'),
                    'author' => [
                        'id' => $news->creator?->id,
                        'name' => $news->creator?->name,
                        'email' => $news->creator?->email,
                    ],
                    'documents' => $news->documents->map(fn($document) => [
                        'id' => $document->id,
                        'name' => $document->name,
                        'file_name' => $document->file_name,
                        'file_path' => $document->file_path,
                    ]),
                ],
            ]
        );
    }

    public function create()
    {
        return Inertia::render('news-management/NewsManagementFormPage');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'thumbnail' => 'nullable|image|max:2048',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
            'documents' => 'nullable|array',
            'documents.*.name' => 'nullable|string',
            'documents.*.file' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
        ], [
            'title.required' => 'Judul berita harus diisi',
            'content.required' => 'Isi berita harus diisi',
            'status.required' => 'Status berita harus diisi',
            'status.in' => 'Status berita harus "draft" atau "published"',
            'thumbnail.image' => 'Thumbnail harus berupa gambar',
            'thumbnail.max' => 'Thumbnail maksimal berukuran 2MB',
            'documents.*.file.image' => 'Dokumen harus berupa gambar',
            'documents.*.file.mimes' => 'Dokumen harus berupa .jpeg, .png, .jpg, atau .webp',
            'documents.*.file.max' => 'Dokumen maksimal berukuran 2MB',
            'documents.*.name.string' => 'Nama dokumen harus berupa string',
        ]);

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] =
                $request->file('thumbnail')->store('news', 'public');
        }

        $validated['created_by'] = Auth::id();

        if ($validated['status'] === News::STATUS_PUBLISHED) {
            $validated['published_at'] = now();
        }

        DB::transaction(function () use ($validated, $request) {

            $news = News::create([
                'title' => $validated['title'],
                'slug' => News::generateUniqueSlug($validated['title']),
                'thumbnail' => $validated['thumbnail'] ?? null,
                'excerpt' => $validated['excerpt'] ?? null,
                'content' => $validated['content'],
                'status' => $validated['status'],
                'published_at' => $validated['published_at'] ?? null,
                'created_by' => $validated['created_by'],
            ]);

            if ($request->filled('documents')) {
                foreach ($request->documents as $document) {
                    $file = $document['file'];
                    $path = $file->store(
                        'news/gallery',
                        'public'
                    );
                    $news->documents()->create([
                        'name' => $document['name'] ?? null,
                        'file_name' => $file->getClientOriginalName(),
                        'file_path' => $path,
                    ]);
                }
            }
        });

        return redirect()->route('news-management.index')
            ->with('success', 'Berita berhasil dibuat');
    }

    public function edit($id)
    {
        $news = News::findOrFail($id);

        if (!$news) {
            return redirect()->route('news-management.index')
                ->with('error', 'Berita tidak ditemukan');
        }

        return Inertia::render(
            'news-management/NewsManagementFormPage',
            [
                'news' => [
                    'id' => $news->id,
                    'title' => $news->title,
                    'excerpt' => $news->excerpt,
                    'content' => $news->content,
                    'status' => $news->status,
                    'thumbnail' => $news->thumbnail,
                    'documents' => $news
                        ->documents
                        ->map(fn($doc) => [
                            'id' => $doc->id,
                            'name' => $doc->name,
                            'file_name' => $doc->file_name,
                            'file_path' => $doc->file_path
                        ]),
                ],
            ]
        );
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'thumbnail' => 'nullable|image|max:2048',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
            'documents' => 'nullable|array',
            'documents.*.name' => 'nullable|string',
            'documents.*.file' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
            'deleted_documents' => 'nullable|array',
            'deleted_documents.*' => 'integer|exists:news_documents,id',
        ], [
            'title.required' => 'Judul berita harus diisi',
            'content.required' => 'Isi berita harus diisi',
            'status.required' => 'Status berita harus diisi',
            'status.in' => 'Status berita harus "draft" atau "published"',
            'thumbnail.image' => 'Thumbnail harus berupa gambar',
            'thumbnail.max' => 'Thumbnail maksimal berukuran 2MB',
            'documents.*.file.image' => 'Dokumen harus berupa gambar',
            'documents.*.file.mimes' => 'Dokumen harus berupa .jpeg, .png, .jpg, atau .webp',
            'documents.*.file.max' => 'Dokumen maksimal berukuran 2MB',
        ]);

        $news = News::findOrFail($id);

        if (!$news) {
            return redirect()->route('news-management.index')
                ->with('error', 'Berita tidak ditemukan');
        }

        DB::transaction(function () use ($request, $validated, $news) {
            $publishedAt = $news->published_at;

            if ($validated['status'] === News::STATUS_PUBLISHED && !$news->published_at) {
                $publishedAt = now();
            }

            if ($validated['status'] === News::STATUS_DRAFT) {
                $publishedAt = null;
            }

            $news->update([
                'title' => $validated['title'],
                'slug' => $news->title !== $validated['title']
                    ? News::generateUniqueSlug(
                        $validated['title']
                    )
                    : $news->slug,
                'excerpt' => $validated['excerpt'] ?? null,
                'content' => $validated['content'],
                'status' => $validated['status'],
                'published_at' => $publishedAt,
            ]);

            if ($request->hasFile('thumbnail')) {
                if ($news->thumbnail) {
                    Storage::disk('public')
                        ->delete($news->thumbnail);
                }
                $thumbnail = $request
                    ->file('thumbnail')
                    ->store('news', 'public');

                $news->update([
                    'thumbnail' => $thumbnail,
                ]);
            }

            if (!empty($validated['deleted_documents'])) {
                $documents = $news
                    ->documents()
                    ->whereIn('id', $validated['deleted_documents'])
                    ->get();

                foreach ($documents as $document) {
                    Storage::disk('public')->delete($document->file_path);
                    $document->delete();
                }
            }

            if ($request->filled('documents')) {
                foreach ($request->documents as $document) {
                    $file = $document['file'];
                    $path = $file->store('news/gallery', 'public');

                    $news->documents()->create([
                        'name' => $document['name'] ?? null,
                        'file_name' => $file->getClientOriginalName(),
                        'file_path' => $path,
                    ]);
                }
            }
        });

        return redirect()->route('news-management.index')->with(
            'success',
            'Berita berhasil diperbarui'
        );
    }

    public function destroy($id)
    {
        $news = News::findOrFail($id);

        if (!$news) {
            return redirect()->route('news-management.index')
                ->with('error', 'Berita tidak ditemukan');
        }

        if ($news->thumbnail) {
            Storage::disk('public')
                ->delete($news->thumbnail);
        }

        foreach ($news->documents as $document) {
            Storage::disk('public')->delete($document->file_path);
            $document->delete();
        }

        $news->delete();
        return redirect()->route('news-management.index')->with(
            'success',
            'Berita berhasil dihapus'
        );
    }
}
