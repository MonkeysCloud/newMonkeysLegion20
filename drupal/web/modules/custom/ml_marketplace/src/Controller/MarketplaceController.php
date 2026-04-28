<?php

declare(strict_types=1);

namespace Drupal\ml_marketplace\Controller;

use Drupal\Core\Controller\ControllerBase;
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
    $nodes = $this->entityTypeManager()->getStorage('node')->loadByProperties([
      'type' => 'marketplace_package',
      'field_slug' => $slug,
      'status' => 1,
    ]);

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

    // Check slug uniqueness
    $existing = $this->entityTypeManager()->getStorage('node')->loadByProperties([
      'type' => 'marketplace_package',
      'field_slug' => $slug,
    ]);
    if (!empty($existing)) {
      $slug .= '-' . time();
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
        // Create new category if allowed
        $newTerm = Term::create([
          'vid' => 'package_category',
          'name' => $categoryName,
        ]);
        $newTerm->save();
        $categoryId = $newTerm->id();
      }
    }

    try {
      $fields = [
        'type' => 'marketplace_package',
        'title' => $title,
        'uid' => $user->id(),
        'status' => 1, // Auto-publish
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

      $node = Node::create($fields);
      $node->save();

      return new JsonResponse([
        'message' => 'Package published successfully.',
        'package' => $this->serializePackage($node),
      ], 201, self::HEADERS);
    }
    catch (\Exception $e) {
      \Drupal::logger('ml_marketplace')->error('Package creation failed: @msg', ['@msg' => $e->getMessage()]);
      return new JsonResponse(['errors' => ['Failed to publish package.']], 500, self::HEADERS);
    }
  }

  /* =========================================================================
     Authenticated: Star / unstar a package
     ========================================================================= */

  public function starPackage(string $slug): JsonResponse {
    $user = $this->currentUser();
    if ($user->isAnonymous()) {
      return new JsonResponse(['error' => 'Authentication required'], 401, self::HEADERS);
    }

    $nodes = $this->entityTypeManager()->getStorage('node')->loadByProperties([
      'type' => 'marketplace_package',
      'field_slug' => $slug,
      'status' => 1,
    ]);

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
        'joined' => date('c', $account->getCreatedTime()),
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
      'created' => date('c', $node->getCreatedTime()),
      'changed' => date('c', $node->getChangedTime()),
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

    // Full body only on detail
    if ($full) {
      $data['description'] = $node->get('body')->processed ?? $node->get('body')->value ?? '';
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

}
