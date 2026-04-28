<?php
use Drupal\canvas\Entity\CanvasPage;

$page = CanvasPage::load(1);
if (!$page) {
    echo "No canvas page 1\n";
    exit;
}
$layout = $page->getLayout();
$json = json_encode($layout, JSON_PRETTY_PRINT);
echo "Layout: " . substr($json, 0, 500) . "...\n";
