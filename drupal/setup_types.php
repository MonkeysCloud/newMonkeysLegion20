<?php
use Drupal\node\Entity\NodeType;
if (!NodeType::load('landing_page')) {
  $type = NodeType::create(['type' => 'landing_page', 'name' => 'Landing Page']);
  $type->save();
  echo "Created landing_page type\n";
}
