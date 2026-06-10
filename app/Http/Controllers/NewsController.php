<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsController extends Controller
{
    public function index()
    {
        return Inertia::render('news/IndexNews', [
            'listNews' => News::query()
                ->latest('published_at')
                ->paginate(9),
        ]);
    }

    public function show(News $news)
    {
        return Inertia::render('news/ShowNews', [
            'news' => $news,
        ]);
    }
}
