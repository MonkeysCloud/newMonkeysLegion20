<?php

/**
 * @file
 * Drupal 11 settings for MonkeysLegion v2.0 Info Site.
 *
 * Docker-aware configuration reading from environment variables.
 */

// Database connection via environment variables (Docker / Cloud SQL).
$db_host = getenv('DRUPAL_DB_HOST') ?: 'mysql';
$databases['default']['default'] = [
  'database' => getenv('DRUPAL_DB_NAME') ?: 'drupal',
  'username' => getenv('DRUPAL_DB_USER') ?: 'drupal',
  'password' => getenv('DRUPAL_DB_PASSWORD') ?: '',
  'driver' => 'mysql',
  'prefix' => '',
  'collation' => 'utf8mb4_general_ci',
];

// Cloud SQL uses Unix socket; local Docker uses TCP host.
if (str_starts_with($db_host, '/cloudsql/')) {
  $databases['default']['default']['host'] = 'localhost';
  $databases['default']['default']['pdo'] = [
    \PDO::MYSQL_ATTR_SSL_CA => '',
  ];
  $databases['default']['default']['unix_socket'] = $db_host;
} else {
  $databases['default']['default']['host'] = $db_host;
  $databases['default']['default']['port'] = getenv('DRUPAL_DB_PORT') ?: '3306';
}

// Hash salt — MUST be set in production.
$settings['hash_salt'] = getenv('DRUPAL_HASH_SALT') ?: 'change-me-to-a-random-string';

// Config sync directory.
$settings['config_sync_directory'] = '../config/sync';

// Trusted host patterns (adjust for production).
$settings['trusted_host_patterns'] = [
  '^localhost$',
  '^cms\.localhost$',
  '^nginx$',
  '^drupal$',
  '^ml-drupal$',
  '^127\.0\.0\.1$',
  '^monkeyslegion\.com$',
  '^cms\.monkeyslegion\.com$',
  '^www\.monkeyslegion\.com$',
  '^ml-cms-.+\.run\.app$',
  '^ml-frontend-.+\.run\.app$',
];

// File system paths.
$settings['file_public_path'] = 'sites/default/files';
$settings['file_private_path'] = '../private';
$settings['file_temp_path'] = '/tmp';

// Performance settings.
$config['system.performance']['css']['preprocess'] = TRUE;
$config['system.performance']['js']['preprocess'] = TRUE;
$config['system.performance']['cache']['page']['max_age'] = 900;

// CORS configuration for headless/decoupled usage.
$settings['cors.config'] = [
  'enabled' => TRUE,
  'allowedHeaders' => [
    'x-csrf-token',
    'authorization',
    'content-type',
    'accept',
    'origin',
    'x-requested-with',
    'access-control-allow-origin',
  ],
  'allowedMethods' => ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  'allowedOrigins' => [
    'http://localhost:3000',
    'http://localhost',
    'http://cms.localhost',
    'https://monkeyslegion.com',
    'https://cms.monkeyslegion.com',
    'https://www.monkeyslegion.com',
  ],
  'allowedOriginsPatterns' => ['/localhost:\d+/', '/\.run\.app$/'],
  'exposedHeaders' => TRUE,
  'maxAge' => 1000,
  'supportsCredentials' => TRUE,
];

// JSON:API configuration.
$config['jsonapi.settings']['read_only'] = FALSE;

// Local development settings override.
if (file_exists($app_root . '/' . $site_path . '/settings.local.php')) {
  include $app_root . '/' . $site_path . '/settings.local.php';
}
