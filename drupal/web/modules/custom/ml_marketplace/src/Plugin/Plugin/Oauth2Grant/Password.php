<?php

namespace Drupal\ml_marketplace\Plugin\Oauth2Grant;

use Drupal\consumers\Entity\Consumer;
use Drupal\simple_oauth\Plugin\Oauth2GrantBase;
use League\OAuth2\Server\Grant\PasswordGrant;
use League\OAuth2\Server\Grant\GrantTypeInterface;

/**
 * The password grant plugin.
 *
 * @Oauth2Grant(
 *   id = "password",
 *   label = @Translation("Password")
 * )
 */
class Password extends Oauth2GrantBase {

  /**
   * {@inheritdoc}
   */
  public function getGrantType(Consumer $client): GrantTypeInterface {
    $user_repo = \Drupal::service('ml_marketplace.repositories.user');
    $refresh_repo = \Drupal::service('simple_oauth.repositories.refresh_token');

    $grant = new PasswordGrant($user_repo, $refresh_repo);
    $grant->setRefreshTokenTTL(new \DateInterval('P1M'));

    return $grant;
  }

}
