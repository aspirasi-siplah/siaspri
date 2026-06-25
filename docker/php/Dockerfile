FROM node:22-alpine AS build

WORKDIR /build

COPY package.json pnpm-lock.yaml .npmrc ./

RUN corepack enable && corepack prepare pnpm@10.20.0 --activate && pnpm install --frozen-lockfile

COPY . .
ENV WAYFINDER_COMMAND=true
RUN pnpm run build

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

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . /var/www

COPY --from=build /build/public/build /var/www/public/build

RUN composer install --no-dev --optimize-autoloader
