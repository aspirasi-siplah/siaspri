<?php

test('docker compose uses checked-in defaults instead of requiring a local env file', function () {
    $compose = file_get_contents(dirname(__DIR__, 2).'/docker-compose.yml');

    expect($compose)
        ->toContain('- .env.example')
        ->not->toContain("- .env\n")
        ->toContain('condition: service_completed_successfully')
        ->toContain('docker-bootstrap.sh')
        ->toContain('storage_data:/var/www/storage')
        ->toContain('./docker/nginx/ssl:/etc/nginx/ssl:ro')
        ->not->toContain("nginx_ssl:\n");
});

test('docker defaults are production ready for first boot', function () {
    $environmentDefaults = file_get_contents(dirname(__DIR__, 2).'/.env.example');

    expect($environmentDefaults)
        ->toContain('APP_ENV=production')
        ->toContain('APP_DEBUG=false')
        ->toContain('APP_URL=https://localhost')
        ->toContain('QUEUE_CONNECTION=redis')
        ->toContain('CACHE_STORE=redis')
        ->toContain('REDIS_HOST=redis')
        ->toContain('NGINX_CONFIG=production')
        ->toContain('APP_DOMAIN=localhost');
});

test('container bootstrap scripts automate first-run tasks', function () {
    $projectRoot = dirname(__DIR__, 2);
    $dockerIgnore = file_get_contents($projectRoot.'/.dockerignore');
    $bootstrapScript = file_get_contents($projectRoot.'/docker/php/docker-bootstrap.sh');
    $entrypointScript = file_get_contents($projectRoot.'/docker/php/docker-entrypoint.sh');
    $nginxBootstrap = file_get_contents($projectRoot.'/docker/nginx/docker-entrypoint.d/40-generate-certificate.sh');

    expect($bootstrapScript)
        ->toContain('php artisan migrate --force --no-interaction')
        ->toContain('php artisan storage:link --force');

    expect($entrypointScript)
        ->toContain('chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache')
        ->toContain('php artisan config:cache');

    expect($nginxBootstrap)
        ->toContain('Missing SSL certificate files for production profile.')
        ->toContain('Cloudflare Origin SSL certificates')
        ->toContain('origin.pem')
        ->toContain('origin.key');

    expect($dockerIgnore)
        ->toContain('public/build')
        ->toContain('public/hot');
});
