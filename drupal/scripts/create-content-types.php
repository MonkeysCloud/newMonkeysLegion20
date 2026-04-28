<?php

/**
 * Create MonkeysLegion content types: documentation, blog, news, event.
 * Run via: drush php:script create-content-types.php
 */

use Drupal\node\Entity\NodeType;
use Drupal\field\Entity\FieldStorageConfig;
use Drupal\field\Entity\FieldConfig;
use Drupal\taxonomy\Entity\Vocabulary;
use Drupal\taxonomy\Entity\Term;

/* ─── Helper: create field storage if it doesn't exist ─── */
function ensure_field_storage(string $field_name, string $type, string $entity_type = 'node', array $settings = []): void {
  if (!FieldStorageConfig::loadByName($entity_type, $field_name)) {
    FieldStorageConfig::create([
      'field_name'  => $field_name,
      'entity_type' => $entity_type,
      'type'        => $type,
      'cardinality' => $settings['cardinality'] ?? 1,
      'settings'    => $settings['storage_settings'] ?? [],
    ])->save();
    echo "  ✓ Storage: $field_name ($type)\n";
  }
}

/* ─── Helper: attach field to a bundle ─── */
function ensure_field_instance(string $field_name, string $bundle, string $label, array $settings = []): void {
  if (!FieldConfig::loadByName('node', $bundle, $field_name)) {
    FieldConfig::create([
      'field_name'  => $field_name,
      'entity_type' => 'node',
      'bundle'      => $bundle,
      'label'       => $label,
      'required'    => $settings['required'] ?? FALSE,
      'settings'    => $settings['field_settings'] ?? [],
    ])->save();
    echo "  ✓ Field: $field_name → $bundle\n";
  }
}

/* ─── Helper: create node type ─── */
function ensure_node_type(string $id, string $label, string $description): void {
  if (!NodeType::load($id)) {
    NodeType::create([
      'type'        => $id,
      'name'        => $label,
      'description' => $description,
    ])->save();
    // Enable body field
    if (!FieldConfig::loadByName('node', $id, 'body')) {
      node_add_body_field(NodeType::load($id));
    }
    echo "✓ Content type: $label ($id)\n";
  } else {
    echo "· Content type already exists: $id\n";
  }
}

/* ─── Helper: create vocabulary ─── */
function ensure_vocabulary(string $vid, string $name): void {
  if (!Vocabulary::load($vid)) {
    Vocabulary::create(['vid' => $vid, 'name' => $name])->save();
    echo "✓ Vocabulary: $name ($vid)\n";
  }
}

/* ─── Helper: create term ─── */
function ensure_term(string $vid, string $name, int $weight = 0): void {
  $terms = \Drupal::entityTypeManager()
    ->getStorage('taxonomy_term')
    ->loadByProperties(['vid' => $vid, 'name' => $name]);
  if (empty($terms)) {
    Term::create(['vid' => $vid, 'name' => $name, 'weight' => $weight])->save();
    echo "  ✓ Term: $name\n";
  }
}

echo "\n═══ Creating Taxonomies ═══\n";

ensure_vocabulary('doc_category', 'Documentation Category');
$doc_categories = [
  'Getting Started', 'HTTP & Routing', 'Auth & Security', 'Data Layer',
  'Templates & Assets', 'Background & Events', 'Operations', 'AI (Apex)', 'Tooling',
];
foreach ($doc_categories as $i => $cat) {
  ensure_term('doc_category', $cat, $i);
}

ensure_vocabulary('tags', 'Tags');
$tags = ['PHP 8.4', 'Framework', 'AI', 'Performance', 'Security', 'Tutorial', 'Release', 'Community'];
foreach ($tags as $i => $tag) {
  ensure_term('tags', $tag, $i);
}

echo "\n═══ Creating Shared Field Storage ═══\n";

ensure_field_storage('field_slug', 'string');
ensure_field_storage('field_summary', 'text_long');
ensure_field_storage('field_image', 'entity_reference', 'node', [
  'storage_settings' => ['target_type' => 'media'],
]);
ensure_field_storage('field_weight', 'integer');
ensure_field_storage('field_package', 'string');
ensure_field_storage('field_doc_version', 'string');
ensure_field_storage('field_doc_category', 'entity_reference', 'node', [
  'storage_settings' => ['target_type' => 'taxonomy_term'],
]);
ensure_field_storage('field_author', 'string');
ensure_field_storage('field_tags', 'entity_reference', 'node', [
  'cardinality' => -1,
  'storage_settings' => ['target_type' => 'taxonomy_term'],
]);
ensure_field_storage('field_event_date', 'daterange');
ensure_field_storage('field_location', 'string');
ensure_field_storage('field_event_url', 'link');

echo "\n═══ Creating Content Type: documentation ═══\n";

ensure_node_type('documentation', 'Documentation', 'Versioned documentation pages for the framework.');
ensure_field_instance('field_slug', 'documentation', 'Slug', ['required' => TRUE]);
ensure_field_instance('field_weight', 'documentation', 'Sidebar Weight');
ensure_field_instance('field_package', 'documentation', 'Package Reference');
ensure_field_instance('field_doc_version', 'documentation', 'Version');
ensure_field_instance('field_doc_category', 'documentation', 'Category', [
  'field_settings' => ['handler' => 'default', 'handler_settings' => ['target_bundles' => ['doc_category' => 'doc_category']]],
]);

echo "\n═══ Creating Content Type: blog ═══\n";

ensure_node_type('blog', 'Blog Post', 'Blog posts with rich content.');
ensure_field_instance('field_slug', 'blog', 'Slug', ['required' => TRUE]);
ensure_field_instance('field_summary', 'blog', 'Summary');
ensure_field_instance('field_image', 'blog', 'Featured Image');
ensure_field_instance('field_author', 'blog', 'Author');
ensure_field_instance('field_tags', 'blog', 'Tags', [
  'field_settings' => ['handler' => 'default', 'handler_settings' => ['target_bundles' => ['tags' => 'tags']]],
]);

echo "\n═══ Creating Content Type: news ═══\n";

ensure_node_type('news', 'News', 'News and announcements.');
ensure_field_instance('field_slug', 'news', 'Slug', ['required' => TRUE]);
ensure_field_instance('field_summary', 'news', 'Summary');
ensure_field_instance('field_image', 'news', 'Featured Image');

echo "\n═══ Creating Content Type: event ═══\n";

ensure_node_type('event', 'Event', 'Events, meetups, and conferences.');
ensure_field_instance('field_slug', 'event', 'Slug', ['required' => TRUE]);
ensure_field_instance('field_summary', 'event', 'Summary');
ensure_field_instance('field_image', 'event', 'Featured Image');
ensure_field_instance('field_event_date', 'event', 'Event Date', ['required' => TRUE]);
ensure_field_instance('field_location', 'event', 'Location');
ensure_field_instance('field_event_url', 'event', 'Event URL');

echo "\n═══ All content types created! ═══\n\n";
