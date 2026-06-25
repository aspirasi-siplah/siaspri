#!/bin/sh

if [ "${APP_ENV}" = "production" ] || [ "${APP_ENV}" = "staging" ]; then
    echo "Caching config, routes, and views..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

exec "$@"
