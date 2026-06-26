#!/bin/sh

set -eu

CONFIG_NAME="${NGINX_CONFIG:-production}"
TEMPLATE_PATH="/opt/nginx/templates/${CONFIG_NAME}.conf"

if [ ! -f "${TEMPLATE_PATH}" ]; then
    echo "Unknown Nginx config profile: ${CONFIG_NAME}" >&2
    exit 1
fi

export APP_DOMAIN="${APP_DOMAIN:-localhost}"
export APP_FPM_HOST="${APP_FPM_HOST:-app:9000}"

envsubst '${APP_DOMAIN} ${APP_FPM_HOST}' < "${TEMPLATE_PATH}" > /etc/nginx/conf.d/default.conf
