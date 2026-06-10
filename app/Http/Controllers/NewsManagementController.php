<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

    public function create()
    {
        return Inertia::render('news-management/CreateNewsManagement');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'slug' => 'required|string|unique:news,slug',
            'thumbnail' => 'nullable|image|max:2048',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'status' => 'required|in:draft,published',
        ]);

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] =
                $request->file('thumbnail')->store('news', 'public');
        }

        $validated['created_by'] = Auth::id();

        if ($validated['status'] === News::STATUS_PUBLISHED) {
            $validated['published_at'] = now();
        }

        News::create($validated);

        return redirect()
            ->route('news-management.index')
            ->with(
                'success',
                'Berita berhasil dibuat'
            );
    }
}
