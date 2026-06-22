<?php

namespace App\Http\Controllers;

use App\Models\News;
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
                    'thumbnail' => $news->thumbnail,
                    'excerpt' => $news->excerpt,
                    'published_at' => $news->published_at?->translatedFormat('d F Y'),
                ];
            });

        return Inertia::render(
            'news/index-news',
            [
                'listNews' => $listNews,
            ]
        );
    }

    public function show(News $news)
    {
        abort_if($news->status !== News::STATUS_PUBLISHED, 404, 'Berita tidak ditemukan');

        $news->load(['documents', 'creator']);

        return Inertia::render(
            'news/show-news',
            [
                'news' => [
                    'id' => $news->id,
                    'title' => $news->title,
                    'slug' => $news->slug,
                    'thumbnail' => $news->thumbnail,
                    'excerpt' => $news->excerpt,
                    'content' => $news->content,
                    'published_at' => $news->published_at?->translatedFormat('d F Y'),
                    'author' => $news->creator?->name,
                    'documents' => $news
                        ->documents
                        ->map(fn($document) => [
                            'id' => $document->id,
                            'name' => $document->name,
                            'url' => $document->file_path,
                        ]),
                ],
            ]
        );
    }
}
