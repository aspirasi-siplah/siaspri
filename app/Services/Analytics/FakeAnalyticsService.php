<?php

namespace App\Services\Analytics;

class FakeAnalyticsService
implements AnalyticsServiceInterface
{
    public function getDashboardStats(): array
    {
        return [
            'totalVisitors' => 1248,
            'todayVisitors' => 42,
            'pageViews' => 5632,
            'totalArticlesViews' => 2381,
        ];
    }

    public function getVisitorsChart(
        int $days = 30
    ): array {
        $data = [];

        for ($i = $days - 1; $i >= 0; $i--) {
            $data[] = [
                'date' => now()
                    ->subDays($i)
                    ->format('Y-m-d'),

                'visitors' => rand(10, 150),
            ];
        }

        return $data;
    }

    public function getTopPages(
        int $limit = 5
    ): array {
        return [
            [
                'page' => '/news/pelatihan-umkm',
                'views' => 1200,
            ],
            [
                'page' => '/news/bantuan-sosial',
                'views' => 980,
            ],
            [
                'page' => '/blacklist',
                'views' => 745,
            ],
        ];
    }

    public function isConnected(): bool
    {
        return false;
    }
}
