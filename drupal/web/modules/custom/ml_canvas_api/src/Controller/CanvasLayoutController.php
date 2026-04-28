<?php

declare(strict_types=1);

namespace Drupal\ml_canvas_api\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Exposes Canvas page layouts as public JSON for the Next.js frontend.
 */
class CanvasLayoutController extends ControllerBase {

  /**
   * Returns the layout for a specific Canvas page by ID.
   */
  public function getLayout(int $page_id): JsonResponse {
    $storage = $this->entityTypeManager()->getStorage('canvas_page');
    $page = $storage->load($page_id);

    if (!$page) {
      return new JsonResponse(['error' => 'Page not found'], 404);
    }

    $layout = $this->extractLayout($page);

    return new JsonResponse($layout, 200, [
      'Access-Control-Allow-Origin' => '*',
      'Cache-Control' => 'public, max-age=60',
    ]);
  }

  /**
   * Returns a decoupled menu hierarchy.
   */
  public function getMenu(string $menu_name): JsonResponse {
    $menu_tree = \Drupal::menuTree();
    $parameters = new \Drupal\Core\Menu\MenuTreeParameters();
    $parameters->setMaxDepth(4);
    
    $tree = $menu_tree->load($menu_name, $parameters);
    $manipulators = [
      ['callable' => 'menu.default_tree_manipulators:checkAccess'],
      ['callable' => 'menu.default_tree_manipulators:generateIndexAndSort'],
    ];
    $tree = $menu_tree->transform($tree, $manipulators);

    $build_menu = function ($elements) use (&$build_menu) {
      $items = [];
      foreach ($elements as $elem) {
        $link = $elem->link;
        if (!$link->isEnabled()) {
          continue;
        }

        $url = $link->getUrlObject();
        try {
          $path = $url->toString();
        } catch (\Exception $e) {
          $path = $url->getUri();
          // Clean internal:/ scheme if present
          if (strpos($path, 'internal:') === 0) {
            $path = substr($path, 9);
          }
        }
        
        $items[] = [
          'title' => $link->getTitle(),
          'url' => $path,
          'children' => $build_menu($elem->subtree),
        ];
      }
      return $items;
    };

    return new JsonResponse($build_menu($tree), 200, [
      'Access-Control-Allow-Origin' => '*',
      'Cache-Control' => 'public, max-age=60',
    ]);
  }

  /**
   * Returns the layout for a Canvas page by its URL path.
   */
  public function getLayoutByPath(Request $request): JsonResponse {
    $path = $request->query->get('path', '/');
    $storage = $this->entityTypeManager()->getStorage('canvas_page');

    // Find the page by path alias
    $pages = $storage->loadMultiple();
    $matched = NULL;

    foreach ($pages as $page) {
      $pagePath = $page->get('path')->alias ?? $page->toUrl()->toString();
      if ($pagePath === $path || '/page/' . $page->id() === $path) {
        $matched = $page;
        break;
      }
    }

    // If no path match, try the homepage (first published page, or page 1)
    if (!$matched && $path === '/') {
      $matched = $storage->load(1);
    }

    if (!$matched) {
      return new JsonResponse(['error' => 'Page not found for path: ' . $path], 404);
    }

    $layout = $this->extractLayout($matched);

    return new JsonResponse($layout, 200, [
      'Access-Control-Allow-Origin' => '*',
      'Cache-Control' => 'public, max-age=60',
    ]);
  }

  /**
   * Lists all Canvas pages with their metadata.
   */
  public function listPages(): JsonResponse {
    $storage = $this->entityTypeManager()->getStorage('canvas_page');
    $pages = $storage->loadMultiple();
    $result = [];

    foreach ($pages as $page) {
      $result[] = [
        'id' => (int) $page->id(),
        'title' => $page->label(),
        'path' => $page->get('path')->alias ?? '/page/' . $page->id(),
        'status' => $page instanceof \Drupal\Core\Entity\EntityPublishedInterface ? (bool) $page->isPublished() : TRUE,
      ];
    }

    return new JsonResponse(['pages' => $result], 200, [
      'Access-Control-Allow-Origin' => '*',
    ]);
  }

  /**
   * Extracts a clean layout structure from a Canvas page entity.
   */
  private function extractLayout($page): array {
    $components_field = $page->get('components');
    $raw_components = [];

    foreach ($components_field as $item) {
      $values = $item->getValue();
      $raw_components[] = $values;
    }

    // Pass 1: Parse all into a lookup dictionary
    $lookup = [];
    foreach ($raw_components as $item) {
      $componentId = $item['component_id'] ?? $item['target_id'] ?? NULL;
      $props = [];

      // Extract props from the stored unstructured data
      if (isset($item['inputs'])) {
        $props = is_string($item['inputs']) ? json_decode($item['inputs'], TRUE) : $item['inputs'];
      } elseif (isset($item['props'])) {
        $props = is_string($item['props']) ? json_decode($item['props'], TRUE) : $item['props'];
      }

      if ($componentId) {
        $type = $componentId;
        if (str_starts_with($type, 'sdc.monkeyslegion_theme.')) {
          $type = str_replace('sdc.monkeyslegion_theme.', '', $type);
        }

        $uuid = $item['uuid'] ?? uniqid();
        $lookup[$uuid] = [
          'id' => $uuid,
          'type' => $type,
          'componentId' => $componentId,
          'props' => $props ?: new \stdClass(),
          'parent_uuid' => $item['parent_uuid'] ?? NULL,
          'slot' => $item['slot'] ?? NULL,
          'slots' => new \stdClass(),
        ];
      }
    }

    // Pass 2: Assemble the tree using the lookup dictionary
    $sections = [];
    foreach ($lookup as $uuid => &$comp) {
      $parent_uuid = $comp['parent_uuid'];
      if (!empty($parent_uuid) && isset($lookup[$parent_uuid])) {
        $slotName = $comp['slot'] ?? 'content';
        
        // Convert the stdClass to array if it is the first item in this slot
        if ($lookup[$parent_uuid]['slots'] instanceof \stdClass) {
          $lookup[$parent_uuid]['slots'] = [];
        }
        
        if (!isset($lookup[$parent_uuid]['slots'][$slotName])) {
           $lookup[$parent_uuid]['slots'][$slotName] = [];
        }
        
        // Push by reference so deeply nested updates propagate
        $lookup[$parent_uuid]['slots'][$slotName][] = &$lookup[$uuid];
      } else {
        // Root level component
        $sections[] = &$lookup[$uuid];
      }
    }
    
    // Pass 3: Recursively clean up internal structural data dynamically
    $clean_tree = function($node) use (&$clean_tree) {
      unset($node['parent_uuid']);
      unset($node['slot']);
      if (is_array($node['slots'])) {
        foreach ($node['slots'] as $slotName => &$children) {
          foreach ($children as &$child) {
            $child = $clean_tree($child);
          }
        }
      }
      return $node;
    };

    $cleanSections = [];
    foreach ($sections as $section) {
      $cleanSections[] = $clean_tree($section);
    }

    return [
      'page' => [
        'id' => (int) $page->id(),
        'title' => $page->label(),
        'path' => $page->get('path')->alias ?? '/page/' . $page->id(),
        'status' => $page instanceof \Drupal\Core\Entity\EntityPublishedInterface ? (bool) $page->isPublished() : TRUE,
      ],
      'sections' => $cleanSections,
    ];
  }

}
