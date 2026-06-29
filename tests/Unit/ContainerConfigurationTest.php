<?php

test('docker compose uses checked-in defaults instead of requiring a local env file', function () {
    $compose = file_get_contents(dirname(__DIR__, 2) . '/docker-compose.yml');

    expect($compose)
        ->toContain("- .env\n")
        ->toContain('condition: service_completed_successfully')
        ->toContain('docker-bootstrap.sh')
        ->toContain('storage_data:/var/www/storage')
        ->toContain('./docker/nginx/ssl:/etc/nginx/ssl:ro')
        ->toContain('127.0.0.1:${POSTGRES_PORT:-5433}:5432')
        ->toContain('VITE_GA_ID: ${VITE_GA_ID:-}')
        ->not->toContain("nginx_ssl:\n");
});

test('docker defaults are production ready for first boot', function () {
    $environmentDefaults = file_get_contents(dirname(__DIR__, 2) . '/.env.example');

    expect($environmentDefaults)
        ->toContain('APP_ENV=production')
        ->toContain('APP_DEBUG=false')
        ->toContain('APP_URL=https://localhost')
        ->toContain('QUEUE_CONNECTION=redis')
        ->toContain('CACHE_STORE=redis')
        ->toContain('REDIS_HOST=redis')
        ->toContain('NGINX_CONFIG=production')
        ->toContain('APP_DOMAIN=localhost')
        ->toContain('VITE_GA_ID=');
});

test('container bootstrap scripts automate first-run tasks', function () {
    $projectRoot = dirname(__DIR__, 2);
    $dockerIgnore = file_get_contents($projectRoot . '/.dockerignore');
    $bootstrapScript = file_get_contents($projectRoot . '/docker/php/docker-bootstrap.sh');
    $entrypointScript = file_get_contents($projectRoot . '/docker/php/docker-entrypoint.sh');
    $dockerfile = file_get_contents($projectRoot . '/docker/php/Dockerfile');

    expect($bootstrapScript)
        ->toContain('php artisan migrate --force --no-interaction')
        ->toContain('php artisan storage:link --force');

    expect($entrypointScript)
        ->toContain('chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache')
        ->toContain('php artisan config:cache');

    expect($dockerfile)
        ->toContain('ARG VITE_GA_ID')
        ->toContain('ENV VITE_GA_ID=${VITE_GA_ID}')
        ->toContain('--prefer-source')
        ->toContain('--no-interaction');

    expect($dockerIgnore)
        ->toContain('public/build')
        ->toContain('public/hot');
});
