#!/bin/sh

chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

if [ -d /opt/public ] && [ ! -f /var/www/public/index.php ]; then
    echo "Populating public volume..."
    cp -r /opt/public/. /var/www/public/
fi

if [ "${APP_ENV}" = "production" ] || [ "${APP_ENV}" = "staging" ]; then
    echo "Caching config, routes, and views..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

exec "$@"
