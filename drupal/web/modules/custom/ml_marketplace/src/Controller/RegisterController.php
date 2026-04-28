<?php

declare(strict_types=1);

namespace Drupal\ml_marketplace\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Handles user registration, profile, and settings.
 */
class RegisterController extends ControllerBase {

  /**
   * List of simple string user fields to read/write.
   */
  private const USER_STRING_FIELDS = [
    'field_display_name'   => 'displayName',
    'field_username_slug'  => 'slug',
    'field_bio'            => 'bio',
    'field_website'        => 'website',
    'field_avatar_url'     => 'avatarUrl',
    'field_banner_url'     => 'bannerUrl',
    'field_social_github'  => 'github',
    'field_social_twitter' => 'twitter',
    'field_social_linkedin'=> 'linkedin',
    'field_social_discord' => 'discord',
  ];

  /**
   * Extract all profile fields from a user entity.
   */
  private function extractUserProfile(\Drupal\user\Entity\User $account): array {
    $data = [];
    foreach (self::USER_STRING_FIELDS as $field => $key) {
      $data[$key] = '';
      if ($account->hasField($field) && !$account->get($field)->isEmpty()) {
        $data[$key] = $account->get($field)->value;
      }
    }
    return $data;
  }

  /**
   * Registers a new user account.
   */
  public function register(Request $request): JsonResponse {
    $headers = ['Access-Control-Allow-Origin' => '*'];

    $body = json_decode($request->getContent(), TRUE);
    if (empty($body)) {
      return new JsonResponse(['error' => 'Invalid JSON body'], 400, $headers);
    }

    $name = trim($body['name'] ?? '');
    $mail = trim($body['mail'] ?? '');
    $pass = $body['pass'] ?? '';

    $errors = [];
    if (strlen($name) < 2) {
      $errors[] = 'Display name must be at least 2 characters.';
    }
    if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
      $errors[] = 'Invalid email address.';
    }
    if (strlen($pass) < 8) {
      $errors[] = 'Password must be at least 8 characters.';
    }
    if (!empty($errors)) {
      return new JsonResponse(['errors' => $errors], 422, $headers);
    }

    $existingMail = user_load_by_mail($mail);
    if ($existingMail) {
      return new JsonResponse(['errors' => ['Email is already registered.']], 409, $headers);
    }

    try {
      $user = \Drupal\user\Entity\User::create([
        'name' => $mail,
        'mail' => $mail,
        'pass' => $pass,
        'status' => 1,
        'init' => $mail,
      ]);

      if ($user->hasField('field_display_name')) {
        $user->set('field_display_name', $name);
      }

      $roleStorage = $this->entityTypeManager()->getStorage('user_role');
      if ($roleStorage->load('marketplace_publisher')) {
        $user->addRole('marketplace_publisher');
      }

      $user->save();

      return new JsonResponse([
        'message' => 'Account created successfully.',
        'user' => [
          'uid' => (int) $user->id(),
          'name' => $name ?: $mail,
          'mail' => $user->getEmail(),
          'uuid' => $user->uuid(),
        ],
      ], 201, $headers);
    }
    catch (\Exception $e) {
      \Drupal::logger('ml_marketplace')->error('Registration failed: @msg', ['@msg' => $e->getMessage()]);
      return new JsonResponse(['errors' => ['Registration failed. Please try again.']], 500, $headers);
    }
  }

  /**
   * Returns current authenticated user info.
   */
  public function me(): JsonResponse {
    $headers = ['Access-Control-Allow-Origin' => '*'];
    $user = $this->currentUser();

    if ($user->isAnonymous()) {
      return new JsonResponse(['error' => 'Not authenticated'], 401, $headers);
    }

    /** @var \Drupal\user\Entity\User $account */
    $account = \Drupal\user\Entity\User::load($user->id());
    $profile = $this->extractUserProfile($account);

    $slug = $profile['slug'];

    return new JsonResponse(array_merge([
      'uid' => (int) $account->id(),
      'uuid' => $account->uuid(),
      'name' => $profile['displayName'] ?: $account->getAccountName(),
      'mail' => $account->getEmail(),
      'roles' => $account->getRoles(TRUE),
      'created' => date('c', (int) $account->getCreatedTime()),
      'profileUrl' => $slug ? "/u/{$slug}" : '/u/' . $account->uuid(),
    ], $profile), 200, $headers);
  }

  /**
   * Updates user settings.
   */
  public function updateSettings(Request $request): JsonResponse {
    $headers = ['Access-Control-Allow-Origin' => '*'];
    $user = $this->currentUser();

    if ($user->isAnonymous()) {
      return new JsonResponse(['error' => 'Not authenticated'], 401, $headers);
    }

    /** @var \Drupal\user\Entity\User $account */
    $account = \Drupal\user\Entity\User::load($user->id());
    $body = json_decode($request->getContent(), TRUE);

    if (empty($body)) {
      return new JsonResponse(['error' => 'Invalid JSON body'], 400, $headers);
    }

    $errors = [];

    // Update display name
    if (isset($body['displayName'])) {
      $val = trim($body['displayName']);
      if (strlen($val) < 2) {
        $errors[] = 'Display name must be at least 2 characters.';
      } elseif ($account->hasField('field_display_name')) {
        $account->set('field_display_name', $val);
      }
    }

    // Update username slug
    if (isset($body['slug'])) {
      $slug = trim($body['slug']);
      if ($slug !== '') {
        if (!preg_match('/^[a-z0-9][a-z0-9\-]{1,38}[a-z0-9]$/', $slug)) {
          $errors[] = 'Username must be 3-40 chars: lowercase letters, numbers, dashes.';
        } else {
          $existing = $this->entityTypeManager()
            ->getStorage('user')
            ->loadByProperties(['field_username_slug' => $slug]);
          $existingUser = reset($existing);
          if ($existingUser && (int) $existingUser->id() !== (int) $account->id()) {
            $errors[] = 'This username is already taken.';
          } elseif ($account->hasField('field_username_slug')) {
            $account->set('field_username_slug', $slug);
          }
        }
      } elseif ($account->hasField('field_username_slug')) {
        $account->set('field_username_slug', '');
      }
    }

    // Update simple text fields
    $textFields = [
      'bio'      => ['field' => 'field_bio', 'maxLen' => 500],
      'website'  => ['field' => 'field_website', 'maxLen' => 255],
      'avatarUrl'  => ['field' => 'field_avatar_url', 'maxLen' => 500],
      'bannerUrl'  => ['field' => 'field_banner_url', 'maxLen' => 500],
      'github'   => ['field' => 'field_social_github', 'maxLen' => 255],
      'twitter'  => ['field' => 'field_social_twitter', 'maxLen' => 255],
      'linkedin' => ['field' => 'field_social_linkedin', 'maxLen' => 255],
      'discord'  => ['field' => 'field_social_discord', 'maxLen' => 255],
    ];

    foreach ($textFields as $bodyKey => $cfg) {
      if (isset($body[$bodyKey]) && $account->hasField($cfg['field'])) {
        $account->set($cfg['field'], substr(trim($body[$bodyKey]), 0, $cfg['maxLen']));
      }
    }

    // Update password
    if (!empty($body['newPassword'])) {
      $currentPassword = $body['currentPassword'] ?? '';
      /** @var \Drupal\Core\Password\PasswordInterface $password_hasher */
      $password_hasher = \Drupal::service('password');
      if (!$password_hasher->check($currentPassword, $account->getPassword())) {
        $errors[] = 'Current password is incorrect.';
      } elseif (strlen($body['newPassword']) < 8) {
        $errors[] = 'New password must be at least 8 characters.';
      } else {
        $account->setPassword($body['newPassword']);
      }
    }

    if (!empty($errors)) {
      return new JsonResponse(['errors' => $errors], 422, $headers);
    }

    try {
      $account->save();
      return new JsonResponse(['message' => 'Settings updated successfully.'], 200, $headers);
    }
    catch (\Exception $e) {
      \Drupal::logger('ml_marketplace')->error('Settings update failed: @msg', ['@msg' => $e->getMessage()]);
      return new JsonResponse(['errors' => ['Failed to save settings.']], 500, $headers);
    }
  }

  /**
   * Public profile — resolves by UUID or username slug.
   */
  public function publicProfile(string $identifier): JsonResponse {
    $headers = ['Access-Control-Allow-Origin' => '*'];
    $userStorage = $this->entityTypeManager()->getStorage('user');

    $account = NULL;

    $results = $userStorage->loadByProperties(['uuid' => $identifier]);
    if (!empty($results)) {
      $account = reset($results);
    }

    if (!$account) {
      $results = $userStorage->loadByProperties(['field_username_slug' => $identifier]);
      if (!empty($results)) {
        $account = reset($results);
      }
    }

    if (!$account || !$account->isActive()) {
      return new JsonResponse(['error' => 'User not found.'], 404, $headers);
    }

    $profile = $this->extractUserProfile($account);

    // Fetch user's packages
    $query = \Drupal::entityQuery('node')
      ->condition('type', 'marketplace_package')
      ->condition('uid', $account->id())
      ->condition('status', 1)
      ->sort('created', 'DESC')
      ->accessCheck(FALSE);
    $nids = $query->execute();

    $packages = [];
    $totalStars = 0;
    if (!empty($nids)) {
      $nodes = \Drupal::entityTypeManager()->getStorage('node')->loadMultiple($nids);

      foreach ($nodes as $node) {
        $stars = (int) ($node->hasField('field_stars') ? $node->get('field_stars')->value : 0);
        $totalStars += $stars;
        $packages[] = [
          'id' => $node->id(),
          'title' => $node->getTitle(),
          'slug' => $node->hasField('field_slug') ? $node->get('field_slug')->value : '',
          'summary' => $node->hasField('field_summary') ? $node->get('field_summary')->value : '',
          'version' => $node->hasField('field_version') ? $node->get('field_version')->value : '',
          'icon' => $node->hasField('field_icon') ? $node->get('field_icon')->value : '',
          'stars' => $stars,
          'downloads' => (int) ($node->hasField('field_downloads') ? $node->get('field_downloads')->value : 0),
          'created' => date('c', (int) $node->getCreatedTime()),
        ];
      }
    }

    return new JsonResponse([
      'user' => array_merge([
        'uid' => (int) $account->id(),
        'uuid' => $account->uuid(),
        'name' => $profile['displayName'] ?: ($profile['slug'] ?: 'User'),
        'packageCount' => count($packages),
        'totalStars' => $totalStars,
        'joined' => date('c', (int) $account->getCreatedTime()),
      ], $profile),
      'packages' => $packages,
    ], 200, $headers);
  }

  /**
   * Sends a password reset email.
   */
  public function forgotPassword(Request $request): JsonResponse {
    $headers = ['Access-Control-Allow-Origin' => '*'];
    $body = json_decode($request->getContent(), TRUE);
    $mail = trim($body['mail'] ?? '');

    if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
      return new JsonResponse(['errors' => ['Invalid email address.']], 422, $headers);
    }

    $users = $this->entityTypeManager()->getStorage('user')->loadByProperties(['mail' => $mail]);

    if (!empty($users)) {
      $account = reset($users);
      if ($account->isActive()) {
        _user_mail_notify('password_reset', $account);
        \Drupal::logger('ml_marketplace')->notice('Password reset sent to @mail', ['@mail' => $mail]);
      }
    }

    return new JsonResponse([
      'message' => 'If an account with that email exists, a reset link has been sent.',
    ], 200, $headers);
  }

  /**
   * Search users by display name, slug, or email.
   * Returns only public-safe data (never email).
   */
  public function searchUsers(Request $request): JsonResponse {
    $headers = ['Access-Control-Allow-Origin' => '*'];
    $q = trim($request->query->get('q', ''));

    if (strlen($q) < 2) {
      return new JsonResponse(['users' => []], 200, $headers);
    }

    $userStorage = $this->entityTypeManager()->getStorage('user');
    $found = [];

    // Search by display name
    $query1 = $userStorage->getQuery()
      ->condition('status', 1)
      ->condition('field_display_name', '%' . $q . '%', 'LIKE')
      ->range(0, 10)
      ->accessCheck(FALSE);
    $uids1 = $query1->execute();

    // Search by slug
    $query2 = $userStorage->getQuery()
      ->condition('status', 1)
      ->condition('field_username_slug', '%' . $q . '%', 'LIKE')
      ->range(0, 10)
      ->accessCheck(FALSE);
    $uids2 = $query2->execute();

    // Search by email (match but don't expose it)
    $query3 = $userStorage->getQuery()
      ->condition('status', 1)
      ->condition('mail', '%' . $q . '%', 'LIKE')
      ->range(0, 10)
      ->accessCheck(FALSE);
    $uids3 = $query3->execute();

    $allUids = array_unique(array_merge($uids1, $uids2, $uids3));
    // Remove uid=0 (anonymous) and uid=1 (admin) unless they match
    $allUids = array_filter($allUids, fn($uid) => (int)$uid > 0);

    if (!empty($allUids)) {
      $accounts = $userStorage->loadMultiple(array_slice($allUids, 0, 10));
      foreach ($accounts as $account) {
        $profile = $this->extractUserProfile($account);
        $name = $profile['displayName'] ?: ($profile['slug'] ?: 'User');
        $slug = $profile['slug'] ?: $account->uuid();

        $found[] = [
          'uid' => (int) $account->id(),
          'uuid' => $account->uuid(),
          'name' => $name,
          'slug' => $slug,
          'avatarUrl' => $profile['avatarUrl'],
          'bio' => $profile['bio'] ? (strlen($profile['bio']) > 100 ? substr($profile['bio'], 0, 100) . '…' : $profile['bio']) : '',
        ];
      }
    }

    return new JsonResponse(['users' => $found], 200, $headers);
  }

}
