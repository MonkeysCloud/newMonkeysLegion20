<?php

/**
 * @file
 * Setup script for Simple OAuth consumer entity.
 *
 * Run: docker exec ml-drupal drush php:script modules/custom/ml_marketplace/setup_oauth.php
 * Or:  cd drupal && php web/modules/custom/ml_marketplace/setup_oauth.php
 */

use Drupal\consumers\Entity\Consumer;

// Check if the consumer already exists
$consumers = \Drupal::entityTypeManager()
  ->getStorage('consumer')
  ->loadByProperties(['client_id' => 'monkeyslegion-nextjs']);

if (!empty($consumers)) {
  echo "Consumer 'monkeyslegion-nextjs' already exists.\n";
  return;
}

// Create the OAuth consumer
$consumer = Consumer::create([
  'label' => 'MonkeysLegion Next.js Frontend',
  'client_id' => 'monkeyslegion-nextjs',
  'secret' => 'client-secret-change-me', // Match .env DRUPAL_CLIENT_SECRET
  'is_default' => TRUE,
  'confidential' => TRUE,
  'third_party' => FALSE,
  'grant_types' => [
    'password',
    'refresh_token',
  ],
  'scopes' => [],
  'redirect' => 'http://localhost:3000',
]);
$consumer->save();

echo "Created Simple OAuth consumer: monkeyslegion-nextjs (ID: {$consumer->id()})\n";
echo "Don't forget to generate OAuth keys: drush simple-oauth:generate-keys ../private/oauth\n";
