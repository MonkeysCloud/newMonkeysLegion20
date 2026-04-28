#!/usr/bin/env bash
set -e

# Start Nginx in background
nginx -g 'daemon off;' &

# Wait for Cloud SQL proxy / DB
echo "→ Waiting for MySQL at ${DRUPAL_DB_HOST}..."
MAX_TRIES=30
COUNT=0
until php -r "
    \$h = '${DRUPAL_DB_HOST}';
    \$p = (int)'${DRUPAL_DB_PORT:-3306}';
    \$u = '${DRUPAL_DB_USER}';
    \$pw = '${DRUPAL_DB_PASSWORD}';
    try {
        new PDO(\"mysql:host=\$h;port=\$p\", \$u, \$pw, [PDO::ATTR_TIMEOUT => 3]);
        exit(0);
    } catch (Exception \$e) {
        exit(1);
    }
" 2>/dev/null; do
    COUNT=$((COUNT + 1))
    [ "$COUNT" -ge "$MAX_TRIES" ] && echo "→ DB timeout, starting anyway" && break
    sleep 2
done
echo "→ MySQL ready"

cd /var/www/html

# Run pending DB updates + cache rebuild
vendor/bin/drush updatedb -y 2>/dev/null || true
vendor/bin/drush cr 2>/dev/null || true

# Fix permissions
chown -R www-data:www-data /var/www/html/web/sites/default/files 2>/dev/null || true

echo "→ Starting PHP-FPM..."
exec php-fpm
