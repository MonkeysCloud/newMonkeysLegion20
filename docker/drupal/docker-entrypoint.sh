#!/bin/bash
set -e

echo "============================================="
echo " MonkeysLegion v2.0 — Drupal Setup"
echo "============================================="

cd /var/www/html

# Install Composer dependencies if vendor is missing
if [ ! -d "vendor" ]; then
    echo "→ Installing Composer dependencies..."
    composer install --no-interaction --optimize-autoloader
fi

# Wait for MySQL to be ready (with timeout and multiple resolution methods)
echo "→ Waiting for MySQL at ${DRUPAL_DB_HOST:-mysql}:${DRUPAL_DB_PORT:-3306}..."
MAX_TRIES=60
COUNT=0
until php -r "
    \$h = '${DRUPAL_DB_HOST:-mysql}';
    \$p = (int)'${DRUPAL_DB_PORT:-3306}';
    \$u = '${DRUPAL_DB_USER:-drupal}';
    \$pw = '${DRUPAL_DB_PASSWORD:-drupal}';
    try {
        new PDO(\"mysql:host=\$h;port=\$p\", \$u, \$pw, [PDO::ATTR_TIMEOUT => 3]);
        echo 'OK';
        exit(0);
    } catch (Exception \$e) {
        echo \$e->getMessage();
        exit(1);
    }
" 2>/dev/null; do
    COUNT=$((COUNT + 1))
    if [ "$COUNT" -ge "$MAX_TRIES" ]; then
        echo "→ ERROR: MySQL not reachable after $MAX_TRIES attempts. Starting PHP-FPM anyway."
        break
    fi
    echo "   Attempt $COUNT/$MAX_TRIES — retrying in 3s..."
    sleep 3
done
echo "→ MySQL is ready!"

# Check if Drupal is installed
if ! vendor/bin/drush status --field=bootstrap 2>/dev/null | grep -q "Successful"; then
    echo "→ Installing Drupal..."
    vendor/bin/drush site:install standard \
        --db-url="mysql://${DRUPAL_DB_USER}:${DRUPAL_DB_PASSWORD}@${DRUPAL_DB_HOST}:${DRUPAL_DB_PORT}/${DRUPAL_DB_NAME}" \
        --account-name=admin \
        --account-pass=admin \
        --site-name="MonkeysLegion v2.0" \
        --site-mail="admin@monkeyslegion.com" \
        --no-interaction \
        -y || echo "Drupal may already be installed."

    # Enable required modules
    echo "→ Enabling modules..."
    vendor/bin/drush en -y \
        jsonapi \
        serialization \
        basic_auth \
        canvas \
        next \
        simple_oauth \
        decoupled_router \
        jsonapi_extras \
        metatag \
        metatag_open_graph \
        metatag_twitter_cards \
        schema_metatag \
        simple_sitemap \
        pathauto \
        redirect \
        google_tag \
        admin_toolbar \
        admin_toolbar_tools \
        token \
        subrequests \
        search_api \
        search_api_db \
        jsonapi_search_api \
        paragraphs \
        entity_reference_revisions \
        jsonapi_include \
        media \
        media_library \
        file \
        image \
        focal_point \
        media_library_form_element \
        media_entity_download \
        2>/dev/null || echo "Some modules may not be available yet."

    # Import content types from config
    echo "→ Importing content type configurations..."
    if [ -d "/var/www/html/config/content-types" ]; then
        for conf in /var/www/html/config/content-types/*.yml; do
            vendor/bin/drush config:import --source=/var/www/html/config/content-types --partial -y 2>/dev/null || true
            break
        done
    fi

    # Clear caches
    vendor/bin/drush cr

    echo "→ Drupal installation complete!"
    echo "   CMS Admin: http://cms.localhost"
    echo "   Login:     http://cms.localhost/user/login"
    echo "   User: admin / Pass: admin"
fi

# Set permissions
chown -R www-data:www-data /var/www/html/web/sites/default/files 2>/dev/null || true

echo "→ Starting PHP-FPM..."
exec php-fpm
