<?php

namespace App\Services\Analytics;

use Spatie\Analytics\Facades\Analytics;
use Spatie\Analytics\Period;

class GoogleAnalyticsService
implements AnalyticsServiceInterface
{
    public function getDashboardStats(): array
    {
        try {
            $period = Period::days(30);

            $summary = Analytics::fetchTotalVisitorsAndPageViews(
                $period
            );

            $today = Analytics::fetchVisitorsAndPageViews(
                Period::days(1)
            );

            return [
                'totalVisitors' =>collect($summary)->sum('visitors'),
                'todayVisitors' =>collect($today)->sum('activeUsers'),
                'pageViews' =>collect($summary)->sum('pageViews'),
                'totalArticlesViews' =>collect($summary)->sum('pageViews'),
            ];
        } catch (\Throwable $e) {

            report($e);

            return [
                'totalVisitors' => 0,
                'todayVisitors' => 0,
                'pageViews' => 0,
                'totalArticlesViews' => 0,
            ];
        }
    }

    public function getVisitorsChart(
        int $days = 30
    ): array {
        return Analytics::fetchVisitorsAndPageViewsByDate(
            Period::days($days)
        )
            ->map(fn($item) => [
                'date' => $item['date'],
                'visitors' => $item['activeUsers'],
            ])
            ->values()
            ->toArray();
    }

    public function getTopPages(
        int $limit = 5
    ): array {
        return Analytics::fetchMostVisitedPages(
            Period::days(30),
            $limit
        )
            ->map(fn($item) => [
                'page' =>
                $item['pageTitle']
                    ?: $item['fullPageUrl'],

                'views' =>
                $item['screenPageViews'],
            ])
            ->values()
            ->toArray();
    }

    public function isConnected(): bool
    {
        try {

            Analytics::fetchVisitorsAndPageViews(
                Period::days(1)
            );

            return true;
        } catch (\Throwable) {

            return false;
        }
    }
}