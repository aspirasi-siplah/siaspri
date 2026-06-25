<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNewsRequest;
use App\Http\Requests\UpdateNewsRequest;
use App\Models\Category;
use App\Models\News;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class NewsManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('news-management/index-news-management', [
            'news' => News::query()
                ->latest()
                ->paginate(10)
                ->through(fn ($item) => [
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
        $news = News::select('id', 'title', 'slug', 'thumbnail', 'excerpt', 'content', 'status', 'published_at', 'created_at', 'updated_at')->with(['documents:id,news_id,name,file_name,file_path', 'categories:id,name'])->findOrFail($id);

        return Inertia::render(
            'news-management/news-management-show',
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
                    'documents' => $news->documents->toArray(),
                    'categories' => $news->categories->toArray(),
                ],
            ]
        );
    }

    public function create()
    {
        $categories = Category::select('id', 'name')->get()->toArray();

        return Inertia::render('news-management/news-management-form-page', [
            'categories' => $categories,
        ]);
    }

    public function store(StoreNewsRequest $request)
    {
        $validated = $request->validated();

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('news', 'public');
        }

        $validated['created_by'] = Auth::id();
        if ($validated['status'] === News::STATUS_PUBLISHED) {
            $validated['published_at'] = now();
        }

        DB::transaction(function () use ($validated, $request) {

            $news = News::create([
                'title' => $validated['title'],
                'slug' => Str::slug($validated['title']).'-'.Str::random(5),
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

            $news->categories()->sync($validated['category_ids']);
        });

        return redirect()->route('news-management.index')
            ->with('success', 'Berita berhasil dibuat');
    }

    public function edit($id)
    {
        $news = News::select('id', 'title', 'excerpt', 'content', 'status', 'thumbnail')->with(['documents:id,news_id,name,file_name,file_path', 'categories:id,name'])->findOrFail($id);
        $categories = Category::select('id', 'name')->get()->toArray();

        return Inertia::render(
            'news-management/news-management-form-page',
            [
                'news' => [
                    'id' => $news->id,
                    'title' => $news->title,
                    'excerpt' => $news->excerpt,
                    'content' => $news->content,
                    'status' => $news->status,
                    'thumbnail' => $news->thumbnail,
                    'documents' => $news->documents->toArray(),
                    'category_ids' => $news->categories ? $news->categories->map(fn ($category) => $category->id)->toArray() : [],
                ],
                'categories' => $categories,
            ]
        );
    }

    public function update(UpdateNewsRequest $request, $id)
    {
        $validated = $request->validated();

        $news = News::findOrFail($id);

        DB::transaction(function () use ($request, $validated, $news) {
            $publishedAt = $news->published_at;

            if ($validated['status'] === News::STATUS_PUBLISHED && ! $news->published_at) {
                $publishedAt = now();
            }

            if ($validated['status'] === News::STATUS_DRAFT) {
                $publishedAt = null;
            }

            $news->update([
                'title' => $validated['title'],
                'slug' => $news->title !== $validated['title'] ? Str::slug($validated['title']).'-'.Str::random(5) : $news->slug,
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

            if (! empty($validated['deleted_documents'])) {
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

            $news->categories()->sync($validated['category_ids']);
        });

        return redirect()->route('news-management.index')->with(
            'success',
            'Berita berhasil diperbarui'
        );
    }

    public function destroy($id)
    {
        $news = News::findOrFail($id);

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
