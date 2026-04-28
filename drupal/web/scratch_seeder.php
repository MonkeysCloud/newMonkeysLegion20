<?php
use Drupal\canvas\Entity\Page;
use Drupal\Component\Serialization\Json;

// The raw data from the user
$rawData = "Password hashing: Argon2id default	✅	⚠️
bcrypt default
⚠️
Configurable
JWT authentication	✅	❌
Requires Sanctum/Passport
❌
Requires LexikJWT
OAuth2 (Google, GitHub)	✅	❌
Requires Socialite
❌
Requires KnpUOAuth2
TOTP 2FA with QR generation	✅	❌
Requires Fortify + pkg
❌
Requires scheb/2fa
API keys + rotation	✅	⚠️
Partial via Sanctum
❌
Not core
RBAC + Policy system	✅	✅
Policies
✅
Voters
Token blacklisting	✅	❌
3rd party
❌
3rd party
Rate limiting (per route)	✅	⚠️
throttle (opt-in)
⚠️
Manual wiring
OWASP security headers	✅	❌
Requires package
⚠️
NelmioSecurityBundle
CORS	✅	⚠️
Fruitcake/CORS pkg
⚠️
NelmioCorsBundle
CSRF	✅	✅	✅
Trusted proxy handling	✅	✅	✅
Request ID correlation	✅	❌
Manual
❌
Manual
Maintenance mode w/ bypass	✅	✅	❌
Not core
Compiled container (no reflection)	✅	⚠️
Partial cache
✅
Remember-me with rotation	✅	⚠️
Basic
⚠️
Basic";

function translateStatus($icon) {
    if (strpos($icon, '✅') !== false) return 'yes';
    if (strpos($icon, '⚠️') !== false) return 'partial';
    return 'no';
}

// Very basic custom parser for the messy tab/newline copy paste
$rows = [];
$lines = explode("\n", $rawData);
$i = 0;
while ($i < count($lines)) {
    $line = trim($lines[$i]);
    if (empty($line)) { $i++; continue; }
    
    // Often format: 
    // Title [tab] Icon [tab] Icon
    if (substr_count($line, "\t") >= 2) {
        $parts = explode("\t", $line);
        $feature = trim($parts[0]);
        $ml = translateStatus($parts[1]);
        $laravel = translateStatus($parts[2]);
        
        $row = [
            'type' => 'sdc.monkeyslegion_theme.security_row',
            'props' => [
                'feature' => $feature,
                'ml_status' => $ml,
                'laravel_status' => $laravel,
                'symfony_status' => 'no', // Fallbacks
                'laravel_note' => '',
                'symfony_note' => ''
            ]
        ];

        // Parse rest of the multiline noise
        $i++;
        while ($i < count($lines)) {
            $next = trim($lines[$i]);
            if (empty($next) || substr_count($next, "\t") >= 2 || strpos($next, '✅') !== false && strlen($next) < 10) {
                 break;
            }
            if (translateStatus($next) != 'no' && strpos($next, '✅') !== false || strpos($next, '⚠️') !== false || strpos($next, '❌') !== false) {
                 // it's an icon only line for symfony/laravel
                 if (empty($row['props']['symfony_status'])) {
                     $row['props']['symfony_status'] = translateStatus($next);
                 }
            } else {
                 if (empty($row['props']['laravel_note'])) {
                     $row['props']['laravel_note'] = $next;
                 } else if (empty($row['props']['symfony_note'])) {
                     $row['props']['symfony_note'] = $next;
                 }
            }
            $i++;
        }
        $rows[] = $row;
    } else {
        // Line format: CSRF ✅ ✅ ✅
        $parts = preg_split('/\s+/', $line);
        if (count($parts) >= 4 && in_array('✅', $parts)) {
            $feature = implode(" ", array_slice($parts, 0, count($parts) - 3));
            $rows[] = [
                'type' => 'sdc.monkeyslegion_theme.security_row',
                'props' => [
                    'feature' => $feature,
                    'ml_status' => translateStatus($parts[count($parts)-3]),
                    'laravel_status' => translateStatus($parts[count($parts)-2]),
                    'symfony_status' => translateStatus($parts[count($parts)-1]),
                    'laravel_note' => '',
                    'symfony_note' => ''
                ]
            ];
        }
        $i++;
    }
}

$page = Page::load(1);
if (!$page) {
    echo "No canvas page 1\n";
    exit;
}

$layoutJson = $page->get('components')->value;
$layout = empty($layoutJson) ? [] : json_decode($layoutJson, TRUE);

// Find the security matrix parent UUID
$parent_uuid = null;
$maxWeight = 0;
foreach ($layout as $item) {
    if (strpos($item['type'], 'security_matrix') !== false) {
        $parent_uuid = $item['uuid'];
    }
    if ($item['weight'] > $maxWeight) {
        $maxWeight = $item['weight'];
    }
}

if (!$parent_uuid) {
    // Inject security matrix if not there
    $parent_uuid = \Drupal::service('uuid')->generate();
    $layout[] = [
        'uuid' => $parent_uuid,
        'type' => 'sdc.monkeyslegion_theme.security_matrix',
        'props' => [
            'title' => 'Secure by default',
            'subtitle' => 'A direct, feature-by-feature comparison',
            'footer_note' => ''
        ],
        'parent_uuid' => null,
        'slot' => 'content',
        'weight' => ++$maxWeight,
    ];
}

// Pre-filter out any old rows child to this matrix to replace them cleanly
$cleanLayout = [];
foreach ($layout as $item) {
    if (($item['parent_uuid'] ?? null) !== $parent_uuid) {
        $cleanLayout[] = $item;
    }
}
$layout = $cleanLayout;

// Append the newly parsed rows
$weight = 0;
foreach ($rows as $row) {
    $rowUuid = \Drupal::service('uuid')->generate();
    $layout[] = [
        'uuid' => $rowUuid,
        'component_id' => $rowUuid, // canvas uses componentId internally 
        'type' => $row['type'],
        'props' => $row['props'],
        'parent_uuid' => $parent_uuid,
        'slot' => 'rows', // SDC dropzone name
        'weight' => $weight++
    ];
}

$page->set('components', json_encode($layout));
$page->save();

echo "Successfully populated " . count($rows) . " security rows into Canvas Page 1!\n";
