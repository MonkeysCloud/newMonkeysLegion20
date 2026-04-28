<?php

namespace Drupal\ml_marketplace\Repositories;

use Drupal\user\Entity\User;
use League\OAuth2\Server\Entities\ClientEntityInterface;
use League\OAuth2\Server\Entities\UserEntityInterface;
use League\OAuth2\Server\Repositories\UserRepositoryInterface;

/**
 * Implements the UserRepositoryInterface for the OAuth Password Grant.
 */
class UserRepository implements UserRepositoryInterface {

  /**
   * {@inheritdoc}
   */
  public function getUserEntityByUserCredentials(
    $username,
    $password,
    $grantType,
    ClientEntityInterface $clientEntity,
  ): ?UserEntityInterface {
    // Load user by name or email.
    $users = \Drupal::entityTypeManager()
      ->getStorage('user')
      ->loadByProperties(['name' => $username]);

    if (empty($users)) {
      $users = \Drupal::entityTypeManager()
        ->getStorage('user')
        ->loadByProperties(['mail' => $username]);
    }

    if (empty($users)) {
      return NULL;
    }

    /** @var \Drupal\user\Entity\User $user */
    $user = reset($users);

    // Verify the password.
    /** @var \Drupal\Core\Password\PasswordInterface $password_hasher */
    $password_hasher = \Drupal::service('password');
    if (!$password_hasher->check($password, $user->getPassword())) {
      return NULL;
    }

    // Check that the user is active.
    if (!$user->isActive()) {
      return NULL;
    }

    return new UserEntity($user->id());
  }

}
