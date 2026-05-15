<?php

declare(strict_types=1);

namespace Drupal\ml_marketplace\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\file\Entity\File;
use Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Marketplace REST controller for packages, categories, stars, and profiles.
 */
class MarketplaceController extends ControllerBase {

  private const HEADERS = ['Access-Control-Allow-Origin' => '*'];
  private const PAGE_SIZE = 12;

  /* =========================================================================
     Public: List published packages
     ========================================================================= */

  public function listPackages(Request $request): JsonResponse {
    $query = $this->entityTypeManager()->getStorage('node')->getQuery()
      ->condition('type', 'marketplace_package')
      ->condition('status', 1)
      ->accessCheck(TRUE);

    // --- Filters ---
    $category = $request->query->get('category');
    if ($category) {
      // Find term by name
      $terms = $this->entityTypeManager()->getStorage('taxonomy_term')->loadByProperties([
        'vid' => 'package_category',
        'name' => $category,
      ]);
      if (!empty($terms)) {
        $term = reset($terms);
        $query->condition('field_package_category', $term->id());
      }
    }

    $search = $request->query->get('search');
    if ($search) {
      $group = $query->orConditionGroup()
        ->condition('title', '%' . $search . '%', 'LIKE')
        ->condition('field_summary', '%' . $search . '%', 'LIKE');
      $query->condition($group);
    }

    $license = $request->query->get('license');
    if ($license) {
      $query->condition('field_license', $license);
    }

    // --- Sorting ---
    $sort = $request->query->get('sort', 'newest');
    switch ($sort) {
      case 'downloads':
        $query->sort('field_downloads', 'DESC');
        break;
      case 'stars':
        $query->sort('field_stars', 'DESC');
        break;
      case 'alpha':
        $query->sort('title', 'ASC');
        break;
      case 'newest':
      default:
        $query->sort('created', 'DESC');
        break;
    }

    // --- Pagination ---
    $page = max(0, (int) $request->query->get('page', '0'));
    $countQuery = clone $query;
    $total = $countQuery->count()->execute();

    $query->range($page * self::PAGE_SIZE, self::PAGE_SIZE);
    $nids = $query->execute();
    $nodes = Node::loadMultiple($nids);

    $packages = [];
    foreach ($nodes as $node) {
      $packages[] = $this->serializePackage($node);
    }

    return new JsonResponse([
      'packages' => $packages,
      'total' => (int) $total,
      'page' => $page,
      'pageSize' => self::PAGE_SIZE,
    ], 200, self::HEADERS);
  }

  /* =========================================================================
     Public: Single package by slug
     ========================================================================= */

  public function getPackage(string $slug): JsonResponse {
    $db = \Drupal::database();
    $nids = [];
    if ($db->schema()->tableExists('node__field_slug')) {
      $nids = $db->select('node__field_slug', 'fs')
        ->fields('fs', ['entity_id'])
        ->condition('fs.field_slug_value', $slug)
        ->condition('fs.bundle', 'marketplace_package')
        ->execute()
        ->fetchCol();
    }

    $nodes = [];
    if (!empty($nids)) {
      $loaded = Node::loadMultiple($nids);
      $nodes = array_filter($loaded, fn($n) => $n->isPublished());
    }

    if (empty($nodes)) {
      return new JsonResponse(['error' => 'Package not found'], 404, self::HEADERS);
    }

    $node = reset($nodes);

    // Increment download/view count
    $current = (int) $node->get('field_downloads')->value;
    $node->set('field_downloads', $current + 1);
    $node->save();

    $data = $this->serializePackage($node, TRUE);

    // Fetch related packages from the same category
    $catId = $node->get('field_package_category')->target_id;
    if ($catId) {
      $relatedNids = $this->entityTypeManager()->getStorage('node')->getQuery()
        ->condition('type', 'marketplace_package')
        ->condition('status', 1)
        ->condition('field_package_category', $catId)
        ->condition('nid', $node->id(), '<>')
        ->sort('field_stars', 'DESC')
        ->range(0, 4)
        ->accessCheck(TRUE)
        ->execute();
      $relatedNodes = Node::loadMultiple($relatedNids);
      $data['related'] = [];
      foreach ($relatedNodes as $rn) {
        $data['related'][] = $this->serializePackage($rn);
      }
    }

    return new JsonResponse($data, 200, self::HEADERS);
  }

  /* =========================================================================
     Public: List categories
     ========================================================================= */

  public function listCategories(): JsonResponse {
    $terms = $this->entityTypeManager()->getStorage('taxonomy_term')->loadByProperties([
      'vid' => 'package_category',
    ]);

    $categories = [];
    foreach ($terms as $term) {
      // Count packages in this category
      $count = $this->entityTypeManager()->getStorage('node')->getQuery()
        ->condition('type', 'marketplace_package')
        ->condition('status', 1)
        ->condition('field_package_category', $term->id())
        ->accessCheck(TRUE)
        ->count()
        ->execute();

      $categories[] = [
        'id' => $term->id(),
        'name' => $term->getName(),
        'slug' => strtolower(str_replace(' ', '-', $term->getName())),
        'count' => (int) $count,
      ];
    }

    // Sort by name
    usort($categories, fn($a, $b) => strcmp($a['name'], $b['name']));

    return new JsonResponse(['categories' => $categories], 200, self::HEADERS);
  }

  /* =========================================================================
     Authenticated: Create package
     ========================================================================= */

  public function createPackage(Request $request): JsonResponse {
    $user = $this->currentUser();
    if ($user->isAnonymous()) {
      return new JsonResponse(['error' => 'Authentication required'], 401, self::HEADERS);
    }

    // Ensure field definitions are fresh (Cloud Run containers may have stale cache)
    \Drupal::service('entity_field.manager')->clearCachedFieldDefinitions();

    $body = json_decode($request->getContent(), TRUE);
    if (empty($body)) {
      return new JsonResponse(['error' => 'Invalid JSON body'], 400, self::HEADERS);
    }

    // --- Validation ---
    $errors = [];
    $title = trim($body['title'] ?? '');
    if (strlen($title) < 2) {
      $errors[] = 'Package name must be at least 2 characters.';
    }

    $description = trim($body['description'] ?? '');
    if (strlen($description) < 10) {
      $errors[] = 'Description must be at least 10 characters.';
    }

    $version = trim($body['version'] ?? '');
    if (empty($version)) {
      $errors[] = 'Version is required.';
    }

    if (!empty($errors)) {
      return new JsonResponse(['errors' => $errors], 422, self::HEADERS);
    }

    // Generate slug
    $slug = $body['slug'] ?? $this->generateSlug($title);

    try {
      // Check slug uniqueness using direct DB query
      // (Entity query cache for new fields can be stale on ephemeral Cloud Run instances)
      $db = \Drupal::database();
      $table = 'node__field_slug';
      if ($db->schema()->tableExists($table)) {
        $existingCount = $db->select($table, 'fs')
          ->condition('fs.field_slug_value', $slug)
          ->countQuery()
          ->execute()
          ->fetchField();
        if ((int) $existingCount > 0) {
          $slug .= '-' . time();
        }
      }

      // Resolve category
      $categoryId = NULL;
      $categoryName = trim($body['category'] ?? '');
      if (!empty($categoryName)) {
        $terms = $this->entityTypeManager()->getStorage('taxonomy_term')->loadByProperties([
          'vid' => 'package_category',
          'name' => $categoryName,
        ]);
        if (!empty($terms)) {
          $term = reset($terms);
          $categoryId = $term->id();
        }
        else {
          $newTerm = Term::create([
            'vid' => 'package_category',
            'name' => $categoryName,
          ]);
          $newTerm->save();
          $categoryId = $newTerm->id();
        }
      }

      $fields = [
        'type' => 'marketplace_package',
        'title' => $title,
        'uid' => $user->id(),
        'status' => 1,
        'body' => [
          'value' => $description,
          'format' => 'full_html',
        ],
        'field_summary' => $body['summary'] ?? '',
        'field_version' => $version,
        'field_slug' => $slug,
        'field_repo_url' => $body['repo_url'] ?? '',
        'field_docs_url' => $body['docs_url'] ?? '',
        'field_install_command' => $body['install_command'] ?? '',
        'field_composer_install' => $body['composer_install'] ?? '',
        'field_license' => $body['license'] ?? 'MIT',
        'field_icon' => $body['icon'] ?? '📦',
        'field_downloads' => 0,
        'field_stars' => 0,
        'field_starred_by' => '',
      ];

      if ($categoryId) {
        $fields['field_package_category'] = ['target_id' => $categoryId];
      }

      // Attach logo file if provided
      $logoFid = $body['logo_fid'] ?? NULL;
      if ($logoFid) {
        $fields['field_logo'] = ['target_id' => (int) $logoFid];
      }

      // Attach screenshot files if provided
      $screenshotFids = $body['screenshot_fids'] ?? [];
      if (!empty($screenshotFids) && is_array($screenshotFids)) {
        $fidsArr = [];
        foreach ($screenshotFids as $fid) {
          $fidsArr[] = ['target_id' => (int) $fid];
        }
        $fields['field_screenshots'] = $fidsArr;
      }

      $node = Node::create($fields);
      $node->save();

      return new JsonResponse([
        'message' => 'Package published successfully.',
        'package' => $this->serializePackage($node),
      ], 201, self::HEADERS);
    }
    catch (\Exception $e) {
      \Drupal::logger('ml_marketplace')->error('Package creation failed: @msg', ['@msg' => $e->getMessage()]);
      return new JsonResponse(['errors' => [$e->getMessage()]], 500, self::HEADERS);
    }
  }

  /* =========================================================================
     Authenticated: Update an existing package
     ========================================================================= */

  public function updatePackage(string $slug, Request $request): JsonResponse {
    $user = $this->currentUser();
    if ($user->isAnonymous()) {
      return new JsonResponse(['error' => 'Authentication required'], 401, self::HEADERS);
    }

    // Ensure field definitions are fresh
    \Drupal::service('entity_field.manager')->clearCachedFieldDefinitions();

    // Load the package by slug using direct DB query
    $db = \Drupal::database();
    $nids = [];
    if ($db->schema()->tableExists('node__field_slug')) {
      $nids = $db->select('node__field_slug', 'fs')
        ->fields('fs', ['entity_id'])
        ->condition('fs.field_slug_value', $slug)
        ->condition('fs.bundle', 'marketplace_package')
        ->execute()
        ->fetchCol();
    }

    if (empty($nids)) {
      return new JsonResponse(['error' => 'Package not found'], 404, self::HEADERS);
    }

    $node = Node::load(reset($nids));
    if (!$node) {
      return new JsonResponse(['error' => 'Package not found'], 404, self::HEADERS);
    }

    // Only the author can update
    if ((int) $node->getOwnerId() !== (int) $user->id()) {
      return new JsonResponse(['error' => 'You can only edit your own packages'], 403, self::HEADERS);
    }

    $body = json_decode($request->getContent(), TRUE);
    if (empty($body)) {
      return new JsonResponse(['error' => 'Invalid JSON body'], 400, self::HEADERS);
    }

    try {
      // Updatable text fields
      $textFields = [
        'title' => 'title',
        'summary' => 'field_summary',
        'version' => 'field_version',
        'repo_url' => 'field_repo_url',
        'docs_url' => 'field_docs_url',
        'install_command' => 'field_install_command',
        'composer_install' => 'field_composer_install',
        'license' => 'field_license',
        'icon' => 'field_icon',
      ];

      foreach ($textFields as $bodyKey => $fieldName) {
        if (isset($body[$bodyKey])) {
          if ($bodyKey === 'title') {
            $node->setTitle(trim($body[$bodyKey]));
          } else {
            $node->set($fieldName, trim($body[$bodyKey]));
          }
        }
      }

      // Update description (body field)
      if (isset($body['description'])) {
        if ($node->hasField('body')) {
          $node->set('body', [
            'value' => $body['description'],
            'format' => 'full_html',
          ]);
        }
      }

      // Update category
      if (isset($body['category'])) {
        $categoryName = trim($body['category']);
        if (!empty($categoryName)) {
          $terms = $this->entityTypeManager()->getStorage('taxonomy_term')->loadByProperties([
            'vid' => 'package_category',
            'name' => $categoryName,
          ]);
          if (!empty($terms)) {
            $term = reset($terms);
            $node->set('field_package_category', ['target_id' => $term->id()]);
          } else {
            $newTerm = Term::create([
              'vid' => 'package_category',
              'name' => $categoryName,
            ]);
            $newTerm->save();
            $node->set('field_package_category', ['target_id' => $newTerm->id()]);
          }
        }
      }

      // Update logo if provided
      if (isset($body['logo_fid']) && $body['logo_fid']) {
        $node->set('field_logo', ['target_id' => (int) $body['logo_fid']]);
      }

      // Update screenshots if provided
      if (isset($body['screenshot_fids']) && is_array($body['screenshot_fids'])) {
        $fidsArr = [];
        foreach ($body['screenshot_fids'] as $fid) {
          $fidsArr[] = ['target_id' => (int) $fid];
        }
        $node->set('field_screenshots', $fidsArr);
      }

      $node->save();

      return new JsonResponse([
        'message' => 'Package updated successfully.',
        'package' => $this->serializePackage($node, TRUE),
      ], 200, self::HEADERS);
    }
    catch (\Exception $e) {
      \Drupal::logger('ml_marketplace')->error('Package update failed: @msg', ['@msg' => $e->getMessage()]);
      return new JsonResponse(['errors' => [$e->getMessage()]], 500, self::HEADERS);
    }
  }

  public function starPackage(string $slug): JsonResponse {
    $user = $this->currentUser();
    if ($user->isAnonymous()) {
      return new JsonResponse(['error' => 'Authentication required'], 401, self::HEADERS);
    }

    $db = \Drupal::database();
    $nids = [];
    if ($db->schema()->tableExists('node__field_slug')) {
      $nids = $db->select('node__field_slug', 'fs')
        ->fields('fs', ['entity_id'])
        ->condition('fs.field_slug_value', $slug)
        ->condition('fs.bundle', 'marketplace_package')
        ->execute()
        ->fetchCol();
    }

    $nodes = [];
    if (!empty($nids)) {
      $loaded = Node::loadMultiple($nids);
      $nodes = array_filter($loaded, fn($n) => $n->isPublished());
    }

    if (empty($nodes)) {
      return new JsonResponse(['error' => 'Package not found'], 404, self::HEADERS);
    }

    $node = reset($nodes);
    $uid = $user->id();

    // starred_by stores comma-separated UIDs
    $starredBy = $node->get('field_starred_by')->value ?? '';
    $starredList = array_filter(explode(',', $starredBy));

    $starred = in_array((string) $uid, $starredList);

    if ($starred) {
      // Unstar
      $starredList = array_diff($starredList, [(string) $uid]);
    }
    else {
      // Star
      $starredList[] = (string) $uid;
    }

    $node->set('field_starred_by', implode(',', $starredList));
    $node->set('field_stars', count($starredList));
    $node->save();

    return new JsonResponse([
      'starred' => !$starred,
      'stars' => count($starredList),
    ], 200, self::HEADERS);
  }

  /* =========================================================================
     Authenticated: Current user's packages
     ========================================================================= */

  public function userPackages(): JsonResponse {
    $user = $this->currentUser();
    if ($user->isAnonymous()) {
      return new JsonResponse(['error' => 'Authentication required'], 401, self::HEADERS);
    }

    $nids = $this->entityTypeManager()->getStorage('node')->getQuery()
      ->condition('type', 'marketplace_package')
      ->condition('uid', $user->id())
      ->sort('created', 'DESC')
      ->accessCheck(TRUE)
      ->execute();

    $nodes = Node::loadMultiple($nids);
    $packages = [];
    foreach ($nodes as $node) {
      $pkg = $this->serializePackage($node);
      $pkg['status'] = $node->isPublished() ? 'published' : 'draft';
      $packages[] = $pkg;
    }

    return new JsonResponse(['packages' => $packages], 200, self::HEADERS);
  }

  /* =========================================================================
     Public: User profile
     ========================================================================= */

  public function userProfile(string $username): JsonResponse {
    $account = user_load_by_name($username);
    if (!$account) {
      return new JsonResponse(['error' => 'User not found'], 404, self::HEADERS);
    }

    // Count published packages
    $nids = $this->entityTypeManager()->getStorage('node')->getQuery()
      ->condition('type', 'marketplace_package')
      ->condition('uid', $account->id())
      ->condition('status', 1)
      ->sort('created', 'DESC')
      ->accessCheck(TRUE)
      ->execute();

    $nodes = Node::loadMultiple($nids);
    $packages = [];
    foreach ($nodes as $node) {
      $packages[] = $this->serializePackage($node);
    }

    // Total stars across all packages
    $totalStars = array_sum(array_map(fn($p) => $p['stars'], $packages));

    return new JsonResponse([
      'user' => [
        'name' => $account->getAccountName(),
        'joined' => date('c', (int) $account->getCreatedTime()),
        'packageCount' => count($packages),
        'totalStars' => $totalStars,
      ],
      'packages' => $packages,
    ], 200, self::HEADERS);
  }

  /* =========================================================================
     Authenticated: Create category
     ========================================================================= */

  public function createCategory(Request $request): JsonResponse {
    $user = $this->currentUser();
    if ($user->isAnonymous()) {
      return new JsonResponse(['error' => 'Authentication required'], 401, self::HEADERS);
    }

    $body = json_decode($request->getContent(), TRUE);
    $name = trim($body['name'] ?? '');

    if (strlen($name) < 2) {
      return new JsonResponse(['errors' => ['Category name must be at least 2 characters.']], 422, self::HEADERS);
    }

    // Check if already exists
    $existing = $this->entityTypeManager()->getStorage('taxonomy_term')->loadByProperties([
      'vid' => 'package_category',
      'name' => $name,
    ]);
    if (!empty($existing)) {
      $term = reset($existing);
      return new JsonResponse([
        'category' => [
          'id' => $term->id(),
          'name' => $term->getName(),
          'slug' => strtolower(str_replace(' ', '-', $term->getName())),
        ],
      ], 200, self::HEADERS);
    }

    $term = Term::create([
      'vid' => 'package_category',
      'name' => $name,
    ]);
    $term->save();

    return new JsonResponse([
      'category' => [
        'id' => $term->id(),
        'name' => $term->getName(),
        'slug' => strtolower(str_replace(' ', '-', $term->getName())),
      ],
    ], 201, self::HEADERS);
  }

  /* =========================================================================
     Helpers
     ========================================================================= */

  /**
   * Serialize a marketplace_package node to a clean JSON array.
   */
  private function serializePackage(Node $node, bool $full = FALSE): array {
    $author = $node->getOwner();

    $data = [
      'id' => $node->id(),
      'slug' => $node->get('field_slug')->value ?? '',
      'title' => $node->getTitle(),
      'summary' => $node->get('field_summary')->value ?? '',
      'version' => $node->get('field_version')->value ?? '',
      'icon' => $node->get('field_icon')->value ?? '📦',
      'license' => $node->get('field_license')->value ?? '',
      'repoUrl' => $node->get('field_repo_url')->value ?? '',
      'docsUrl' => $node->get('field_docs_url')->value ?? '',
      'installCommand' => $node->get('field_install_command')->value ?? '',
      'composerInstall' => $node->get('field_composer_install')->value ?? '',
      'downloads' => (int) ($node->get('field_downloads')->value ?? 0),
      'stars' => (int) ($node->get('field_stars')->value ?? 0),
      'author' => [
        'name' => $author ? $author->getAccountName() : 'Unknown',
        'uid' => $author ? (int) $author->id() : 0,
      ],
      'created' => date('c', (int) $node->getCreatedTime()),
      'changed' => date('c', (int) $node->getChangedTime()),
    ];

    // Category
    $catRef = $node->get('field_package_category')->entity;
    if ($catRef) {
      $data['category'] = [
        'id' => $catRef->id(),
        'name' => $catRef->getName(),
        'slug' => strtolower(str_replace(' ', '-', $catRef->getName())),
      ];
    }

    // Logo URL
    $data['logoUrl'] = '';
    try {
      if ($node->hasField('field_logo') && !$node->get('field_logo')->isEmpty()) {
        $logoFile = $node->get('field_logo')->entity;
        if ($logoFile) {
          $data['logoUrl'] = \Drupal::service('file_url_generator')->generateAbsoluteString($logoFile->getFileUri());
        }
      }
    } catch (\Exception $e) {}

    // Screenshot / gallery images
    $data['images'] = [];
    try {
      if ($node->hasField('field_screenshots') && !$node->get('field_screenshots')->isEmpty()) {
        foreach ($node->get('field_screenshots') as $item) {
          $file = $item->entity;
          if ($file) {
            $data['images'][] = \Drupal::service('file_url_generator')->generateAbsoluteString($file->getFileUri());
          }
        }
      }
    } catch (\Exception $e) {}

    // Body / description — always include
    $data['description'] = '';
    try {
      if ($node->hasField('body') && !$node->get('body')->isEmpty()) {
        $data['description'] = $node->get('body')->processed ?? $node->get('body')->value ?? '';
      }
    } catch (\InvalidArgumentException $e) {
      // Field does not exist on this entity bundle
    }

    return $data;
  }

  /**
   * Generate a URL-safe slug from a title.
   */
  private function generateSlug(string $title): string {
    $slug = strtolower(trim($title));
    $slug = preg_replace('/[^a-z0-9\-]/', '-', $slug);
    $slug = preg_replace('/-+/', '-', $slug);
    return trim($slug, '-');
  }

  /* =========================================================================
     File Upload
     ========================================================================= */

  /**
   * Upload a file and return its fid and URL.
   */
  public function uploadFile(Request $request): JsonResponse {
    $user = $this->currentUser();
    if ($user->isAnonymous()) {
      return new JsonResponse(['error' => 'Authentication required'], 401, self::HEADERS);
    }

    $content = $request->getContent();
    if (empty($content)) {
      return new JsonResponse(['error' => 'No file data received.'], 400, self::HEADERS);
    }

    // Get filename from Content-Disposition header or X-Filename
    $filename = $request->headers->get('X-Filename', '');
    if (empty($filename)) {
      $disposition = $request->headers->get('Content-Disposition', '');
      if (preg_match('/filename="?([^"]+)"?/', $disposition, $m)) {
        $filename = $m[1];
      }
    }
    if (empty($filename)) {
      $filename = 'upload-' . time() . '.png';
    }

    // Sanitize filename
    $filename = preg_replace('/[^a-zA-Z0-9._-]/', '_', $filename);

    try {
      $directory = 'public://marketplace';
      /** @var \Drupal\Core\File\FileSystemInterface $fileSystem */
      $fileSystem = \Drupal::service('file_system');
      $fileSystem->prepareDirectory($directory, $fileSystem::CREATE_DIRECTORY | $fileSystem::MODIFY_PERMISSIONS);

      $destination = $directory . '/' . $filename;
      $uri = $fileSystem->saveData($content, $destination, $fileSystem::EXISTS_RENAME);

      $file = File::create([
        'uri' => $uri,
        'uid' => $user->id(),
        'status' => 1,
        'filename' => $filename,
      ]);
      $file->save();

      $url = \Drupal::service('file_url_generator')->generateAbsoluteString($uri);

      return new JsonResponse([
        'fid' => (int) $file->id(),
        'url' => $url,
        'filename' => $file->getFilename(),
      ], 201, self::HEADERS);
    }
    catch (\Exception $e) {
      \Drupal::logger('ml_marketplace')->error('File upload failed: @msg', ['@msg' => $e->getMessage()]);
      return new JsonResponse(['error' => 'File upload failed.'], 500, self::HEADERS);
    }
  }

}
