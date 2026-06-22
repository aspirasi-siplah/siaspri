<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Services\Analytics\AnalyticsServiceInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke(AnalyticsServiceInterface $analytics) {
        return Inertia::render('dashboard',
            [
                'analytics' => [
                    'stats' => $analytics->getDashboardStats(),
                    'chart' => $analytics->getVisitorsChart(),
                    'topPages' => $analytics->getTopPages(),
                ],

                'newsCount' => News::count(),
            ]
        );
    }
}
