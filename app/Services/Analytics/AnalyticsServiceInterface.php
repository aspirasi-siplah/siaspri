<?php

namespace App\Services\Analytics;

interface AnalyticsServiceInterface
{
    public function getDashboardStats(): array;

    public function getVisitorsChart(
        int $days = 30
    ): array;

    public function getTopPages(
        int $limit = 5
    ): array;
}
