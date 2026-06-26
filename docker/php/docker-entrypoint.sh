#!/bin/sh

set -eu

if [ -z "${APP_KEY:-}" ] && [ -f /usr/local/etc/app/default.env ]; then
    # shellcheck disable=SC1091
    . /usr/local/etc/app/default.env
    export APP_KEY
fi

mkdir -p /var/www/public /var/www/storage/app/public /var/www/bootstrap/cache

chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

if [ -d /opt/public ]; then
    echo "Populating public volume..."
    cp -r /opt/public/. /var/www/public/
fi

if [ "${APP_ENV:-production}" = "production" ] || [ "${APP_ENV:-production}" = "staging" ]; then
    echo "Refreshing Laravel caches..."
    php artisan optimize:clear
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

exec "$@"
