<?php
// Grant admin all Canvas permissions
$admin_role = \Drupal\user\Entity\Role::load('administrator');
if (!$admin_role) {
  $admin_role = \Drupal\user\Entity\Role::create(['id' => 'administrator', 'label' => 'Administrator']);
}
$perms = [
  'administer components', 'administer code components', 'administer folders',
  'administer patterns', 'administer page template', 'administer content templates',
  'administer brand kit', 'create canvas_page', 'edit canvas_page', 'delete canvas_page',
  'publish auto-saves',
];
foreach ($perms as $p) {
  $admin_role->grantPermission($p);
}
$admin_role->save();
echo "Granted all Canvas permissions to administrator role\n";

// Assign admin role to user 1
$user = \Drupal\user\Entity\User::load(1);
$user->addRole('administrator');
$user->save();
echo "Assigned administrator role to admin user\n";

// Check canvas_page entity
$storage = \Drupal::entityTypeManager()->getStorage('canvas_page');
$pages = $storage->loadMultiple();
echo "Existing Canvas pages: " . count($pages) . "\n";
