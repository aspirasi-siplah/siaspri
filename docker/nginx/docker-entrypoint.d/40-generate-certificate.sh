#!/bin/sh

set -eu

if [ "${NGINX_CONFIG:-production}" != "production" ]; then
    exit 0
fi

CERT_DIR="/etc/nginx/ssl"
CERTIFICATE_PATH="${CERT_DIR}/origin.pem"
KEY_PATH="${CERT_DIR}/origin.key"

if [ -f "${CERTIFICATE_PATH}" ] && [ -f "${KEY_PATH}" ]; then
    exit 0
fi

echo "Missing SSL certificate files for production profile." >&2
echo "Expected files:" >&2
echo "  - ${CERTIFICATE_PATH}" >&2
echo "  - ${KEY_PATH}" >&2
echo "Mount your Cloudflare Origin SSL certificates into docker/nginx/ssl on the server before starting the stack." >&2
exit 1
