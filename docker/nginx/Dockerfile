FROM nginx:1.29-alpine

COPY docker/nginx/default.conf /opt/nginx/templates/default.conf
COPY docker/nginx/production.conf /opt/nginx/templates/production.conf
COPY docker/nginx/docker-entrypoint.d/20-render-config.sh /docker-entrypoint.d/20-render-config.sh
COPY docker/nginx/docker-entrypoint.d/40-generate-certificate.sh /docker-entrypoint.d/40-generate-certificate.sh

RUN chmod +x /docker-entrypoint.d/20-render-config.sh /docker-entrypoint.d/40-generate-certificate.sh \
    && mkdir -p /etc/nginx/ssl
