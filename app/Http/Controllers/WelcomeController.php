<?php

namespace App\Http\Controllers;

use App\Models\BlacklistMerchant;
use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        return Inertia::render('welcome', [
            'latestNews' => News::latest()->limit(3)->get(),
            'stats' => [
                'totalNews' => News::where('status', News::STATUS_PUBLISHED)->count(),
                'totalBlacklistMerchant' => BlacklistMerchant::where('status', BlacklistMerchant::STATUS_ACTIVE)->count(),
            ],
        ]);
    }
}
