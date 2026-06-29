<?php

test('analytics package discovery is disabled for conditional registration', function () {
    $projectRoot = dirname(__DIR__, 2);
    $composer = json_decode(file_get_contents($projectRoot . '/composer.json'), true);

    expect($composer['extra']['laravel']['dont-discover'])
        ->toContain('spatie/laravel-analytics');
});

test('analytics config supports base64 credentials and filesystem fallback', function () {
    $projectRoot = dirname(__DIR__, 2);
    $config = file_get_contents($projectRoot . '/config/analytics.php');
    $environment = file_get_contents($projectRoot . '/.env.example');

    expect($config)
        ->toContain('GOOGLE_ANALYTICS_CREDENTIALS_BASE64')
        ->toContain('GOOGLE_ANALYTICS_CREDENTIALS_PATH')
        ->toContain("storage_path('app/google/analytics-key.json')")
        ->toContain('is_file($analyticsCredentialsPath)');

    expect($environment)
        ->toContain('ANALYTICS_PROPERTY_ID=')
        ->toContain('GOOGLE_ANALYTICS_CREDENTIALS_BASE64=')
        ->toContain('GOOGLE_ANALYTICS_CREDENTIALS_PATH=storage/app/google/analytics-key.json')
        ->toContain('VITE_GA_ID=');
});

test('app service provider falls back to fake analytics when config is incomplete', function () {
    $provider = file_get_contents(dirname(__DIR__, 2) . '/app/Providers/AppServiceProvider.php');

    expect($provider)
        ->toContain('AnalyticsServiceProvider::class')
        ->toContain("app()->environment('local')")
        ->toContain('$this->analyticsIsConfigured()')
        ->toContain('FakeAnalyticsService::class')
        ->toContain('UnavailableAnalyticsService::class')
        ->toContain('GoogleAnalyticsService::class');
});

test('docker compose exposes a file-based analytics credentials path to php containers', function () {
    $compose = file_get_contents(dirname(__DIR__, 2) . '/docker-compose.yml');
    $layout = file_get_contents(dirname(__DIR__, 2) . '/resources/js/layouts/landing-layout.tsx');

    expect($compose)
        ->toContain('./storage/app/google:/var/www/secrets/google:ro')
        ->toContain('GOOGLE_ANALYTICS_CREDENTIALS_PATH: ${GOOGLE_ANALYTICS_CREDENTIALS_PATH:-/var/www/secrets/google/analytics-key.json}')
        ->toContain('VITE_GA_ID: ${VITE_GA_ID:-}');

    expect($layout)
        ->toContain('const gaId = import.meta.env.VITE_GA_ID;')
        ->toContain('{gaId ? (')
        ->toContain("gtag('config', '\${gaId}');");
});
