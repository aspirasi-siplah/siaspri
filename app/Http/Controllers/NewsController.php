<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class NewsController extends Controller
{
    public function index()
    {
        $listNews = News::query()
            ->where('status', News::STATUS_PUBLISHED)
            ->latest('published_at')
            ->paginate(9)
            ->through(function (News $news) {
                return [
                    'id' => $news->id,
                    'title' => $news->title,
                    'slug' => $news->slug,
                    'thumbnail' => $news->thumbnail ? Storage::url($news->thumbnail) : null,
                    'excerpt' => $news->excerpt,
                    'published_at' => $news->published_at?->translatedFormat('d F Y'),
                ];
            });

        return Inertia::render(
            'news/IndexNews',
            [
                'listNews' => $listNews,
            ]
        );
    }

    public function show(News $news)
    {
        if ($news->status !== News::STATUS_PUBLISHED) {
            return redirect()->route('news.index')->with('error', 'Berita tidak ditemukan');
        }

        $news->load([ 'documents', 'creator']);

        return Inertia::render(
            'news/ShowNews',
            [
                'news' => [
                    'id' => $news->id,
                    'title' => $news->title,
                    'slug' => $news->slug,
                    'thumbnail' => $news->thumbnail ? Storage::url($news->thumbnail) : null,
                    'excerpt' => $news->excerpt,
                    'content' => $news->content,
                    'published_at' => $news->published_at?->translatedFormat('d F Y'),
                    'author' => $news->creator?->name,
                    'documents' => $news
                        ->documents
                        ->map(fn($document) => [
                            'id' => $document->id,
                            'name' => $document->name,
                            'url' => Storage::url(
                                $document->file_path
                            ),
                        ]),
                ],
            ]
        );
    }
}
