#!/bin/sh

DOMAIN="${1:-siaspri.com}"

echo "Generating self-signed SSL certificate for ${DOMAIN}..."

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$(dirname "$0")/ssl/origin.key" \
    -out "$(dirname "$0")/ssl/origin.pem" \
    -subj "/C=ID/ST=Jakarta/L=Jakarta/O=${DOMAIN}/CN=${DOMAIN}" \
    -addext "subjectAltName=DNS:${DOMAIN},DNS:www.${DOMAIN}"

echo "Done. Certificate generated for ${DOMAIN}"
echo "  pem: docker/nginx/ssl/origin.pem"
echo "  key: docker/nginx/ssl/origin.key"
