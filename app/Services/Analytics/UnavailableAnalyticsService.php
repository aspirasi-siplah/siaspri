<?php

namespace App\Services\Analytics;

class UnavailableAnalyticsService implements AnalyticsServiceInterface
{
    public function getDashboardStats(): array
    {
        return [
            'totalVisitors' => 0,
            'todayVisitors' => 0,
            'pageViews' => 0,
            'totalArticlesViews' => 0,
        ];
    }

    public function getVisitorsChart(int $days = 30): array
    {
        return [];
    }

    public function getTopPages(int $limit = 5): array
    {
        return [];
    }
}
