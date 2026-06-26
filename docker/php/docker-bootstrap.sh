#!/bin/sh

set -eu

if [ -z "${APP_KEY:-}" ] && [ -f /usr/local/etc/app/default.env ]; then
    # shellcheck disable=SC1091
    . /usr/local/etc/app/default.env
    export APP_KEY
fi

mkdir -p /var/www/public /var/www/storage/app/public /var/www/bootstrap/cache

if [ -d /opt/public ]; then
    echo "Populating public volume..."
    cp -r /opt/public/. /var/www/public/
fi

chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

echo "Running database migrations..."
php artisan migrate --force --no-interaction

echo "Creating storage symlink..."
php artisan storage:link --force
