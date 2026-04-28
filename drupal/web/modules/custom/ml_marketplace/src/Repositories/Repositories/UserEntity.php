<?php

namespace Drupal\ml_marketplace\Repositories;

use League\OAuth2\Server\Entities\UserEntityInterface;

/**
 * Simple user entity for OAuth.
 */
class UserEntity implements UserEntityInterface {

  /**
   * The user identifier (Drupal UID).
   */
  protected string $identifier;

  public function __construct(string|int $identifier) {
    $this->identifier = (string) $identifier;
  }

  /**
   * {@inheritdoc}
   */
  public function getIdentifier(): string {
    return $this->identifier;
  }

}
