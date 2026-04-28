#!/usr/bin/env bash
set -e

# Start Nginx in background
nginx &

# Determine if we're using Cloud SQL unix socket or TCP
DB_HOST="${DRUPAL_DB_HOST}"
if [[ "$DB_HOST" == /cloudsql/* ]]; then
    echo "→ Using Cloud SQL Unix socket: $DB_HOST"
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

# Fix permissions for all writable directories
mkdir -p /var/www/html/web/sites/default/files/php/twig /var/www/html/private /tmp
chown -R www-data:www-data /var/www/html/web/sites/default/files /var/www/html/private /tmp 2>/dev/null || true
chmod -R 775 /var/www/html/web/sites/default/files /var/www/html/private 2>/dev/null || true

# Start PHP-FPM in the background FIRST so the container can serve traffic immediately
echo "→ Starting PHP-FPM..."
php-fpm &
FPM_PID=$!

# Give FPM a moment to bind to port 9000
sleep 2

# Run drush in the background so it doesn't block the container
(
    echo "→ Running DB updates..."
    timeout 60s vendor/bin/drush updatedb -y 2>&1 || echo "→ Drush updatedb failed or timed out"
    echo "→ Rebuilding cache..."
    timeout 60s vendor/bin/drush cr 2>&1 || echo "→ Drush cr failed or timed out"
    echo "→ Drush tasks complete."
) &

# Wait for PHP-FPM (the main process) — if it dies, the container exits
wait $FPM_PID
