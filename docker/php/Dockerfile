FROM node:22-alpine AS build

WORKDIR /build

ARG VITE_GA_ID
ENV VITE_GA_ID=${VITE_GA_ID}

COPY package.json pnpm-lock.yaml .npmrc ./

RUN corepack enable && corepack prepare pnpm@10.20.0 --activate && pnpm install --frozen-lockfile

COPY . .
ENV WAYFINDER_COMMAND=true
RUN pnpm run build

FROM php:8.4-fpm AS vendor

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    curl \
    libpq-dev \
    libzip-dev \
    zip \
    && docker-php-ext-install pdo pdo_pgsql

RUN pecl install redis \
    && docker-php-ext-enable redis

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install \
    --no-dev \
    --prefer-source \
    --no-interaction \
    --optimize-autoloader \
    --classmap-authoritative

RUN rm -rf /var/www/bootstrap/cache/*.php \
    && php -r 'file_put_contents("/var/www/.env", "APP_KEY=base64:".base64_encode(random_bytes(32))."\nAPP_ENV=production\n");' \
    && php artisan wayfinder:generate --with-form --no-interaction \
    && rm /var/www/.env

FROM php:8.4-fpm

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    curl \
    libpq-dev \
    libzip-dev \
    zip \
    && docker-php-ext-install pdo pdo_pgsql

RUN pecl install redis \
    && docker-php-ext-enable redis

COPY docker/php/php.ini /usr/local/etc/php/conf.d/custom.ini

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . /var/www

COPY --from=vendor /var/www/vendor /var/www/vendor
COPY --from=vendor /var/www/resources/js/routes /var/www/resources/js/routes
COPY --from=vendor /var/www/resources/js/actions /var/www/resources/js/actions
COPY --from=vendor /var/www/resources/js/wayfinder /var/www/resources/js/wayfinder
COPY --from=build /build/public/build /var/www/public/build
RUN cp -r /var/www/public /opt/public

RUN composer install \
    --no-dev \
    --prefer-source \
    --no-interaction \
    --optimize-autoloader \
    --classmap-authoritative

RUN mkdir -p /usr/local/etc/app \
    && php -r 'file_put_contents("/usr/local/etc/app/default.env", "APP_KEY=base64:".base64_encode(random_bytes(32)).PHP_EOL);'

COPY docker/php/docker-entrypoint.sh /usr/local/bin/
COPY docker/php/docker-bootstrap.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh /usr/local/bin/docker-bootstrap.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]
