#!/usr/bin/env bash
set -e

# Start Nginx in background
nginx &

# Determine if we're using Cloud SQL unix socket or TCP
DB_HOST="${DRUPAL_DB_HOST}"
if [[ "$DB_HOST" == /cloudsql/* ]]; then
    echo "→ Using Cloud SQL Unix socket: $DB_HOST"
    # For Unix socket, we test connection differently
    MAX_TRIES=30
    COUNT=0
    until php -r "
        \$socket = '${DB_HOST}';
        \$u = '${DRUPAL_DB_USER}';
        \$pw = '${DRUPAL_DB_PASSWORD}';
        \$db = '${DRUPAL_DB_NAME}';
        try {
            new PDO(\"mysql:unix_socket=\$socket;dbname=\$db\", \$u, \$pw, [PDO::ATTR_TIMEOUT => 3]);
            exit(0);
        } catch (Exception \$e) {
            exit(1);
        }
    " 2>/dev/null; do
        COUNT=$((COUNT + 1))
        [ "$COUNT" -ge "$MAX_TRIES" ] && echo "→ DB timeout, starting anyway" && break
        sleep 2
    done
    echo "→ MySQL ready (Unix socket)"
else
    echo "→ Waiting for MySQL at ${DB_HOST}:${DRUPAL_DB_PORT:-3306}..."
    MAX_TRIES=30
    COUNT=0
    until php -r "
        \$h = '${DB_HOST}';
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
    echo "→ MySQL ready (TCP)"
fi

cd /var/www/html

# Run pending DB updates + cache rebuild (with timeout so it doesn't hang container startup)
echo "→ Running DB updates..."
timeout 30s vendor/bin/drush updatedb -y || echo "→ Drush updatedb failed or timed out"
echo "→ Rebuilding cache..."
timeout 30s vendor/bin/drush cr || echo "→ Drush cr failed or timed out"

# Fix permissions
chown -R www-data:www-data /var/www/html/web/sites/default/files 2>/dev/null || true

echo "→ Starting PHP-FPM..."
exec php-fpm
