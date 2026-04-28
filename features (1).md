# Feature Deep-Dive Pages

> **Route pattern.** Each `#` H1 section below is a separate page. Suggested paths shown next to each heading.

---

# Attribute Routing
`/features/routing`

### Eyebrow
`monkeyslegion-router@2.1` · PSR-15 compatible

### H1
**Routing without route files.**

### Lede
Define routes where your handlers live — as PHP 8 attributes on controller methods. MonkeysLegion's router discovers them automatically, compiles them once, and serves them with zero runtime regex matching.

### Code

```php
<?php
declare(strict_types=1);

namespace App\Controller;

use MonkeysLegion\Router\Attribute\{Route, Get, Post, Put, Delete};
use Psr\Http\Message\ResponseInterface;

#[Route('/api/users', name: 'users')]
final class UserController
{
    #[Get('/', name: 'index', tags: ['Users'])]
    public function index(): ResponseInterface
    {
        return json_response(['users' => User::all()]);
    }

    #[Get('/{id:\d+}', name: 'show')]
    public function show(int $id): ResponseInterface
    {
        return json_response(['user' => User::find($id)]);
    }

    #[Post('/', name: 'create', middleware: [AuthMiddleware::class])]
    public function create(CreateUserRequest $request): ResponseInterface
    {
        // DTO is auto-validated — invalid input returns 422
        return json_response(['created' => true], 201);
    }

    #[Put('/{id:\d+}', name: 'update')]
    public function update(int $id, UpdateUserRequest $request): ResponseInterface
    {
        return json_response(['updated' => true]);
    }

    #[Delete('/{id:\d+}', name: 'delete', middleware: [AdminMiddleware::class])]
    public function delete(int $id): ResponseInterface
    {
        return json_response(null, 204);
    }
}
```

### What makes it different

- **Auto-discovery.** Drop controllers in `app/Controller/` — the router finds them. No registration step, no `routes/web.php`.
- **Compiled once.** Route tables are compiled to PHP arrays at cache time. Production matches run in O(1) lookup, not regex iteration.
- **Constraint-aware.** `{id:\d+}`, `{slug:[a-z-]+}`, custom constraint classes — all validated before the handler runs.
- **Middleware-aware.** Attach middleware per route, per group, or per controller. Middleware runs in PSR-15 pipeline order.
- **Tag-aware.** Routes tagged with `tags: ['Users']` automatically flow into OpenAPI v3 generation.

### Also included

Named routes with URL generation · Route groups with shared prefixes and middleware · Typed parameter binding (`int $id` just works) · Method override middleware · Route caching CLI (`php ml route:list`, `php ml route:cache`) · Imperative fallback via `$router->add()`.

### Next
`Read the docs →` `/docs/routing`  ·  `View package →` https://github.com/MonkeysCloud/MonkeysLegion-Router

---

# Authentication Suite
`/features/auth`

### Eyebrow
`monkeyslegion-auth@2.1` · Argon2id · JWT · OAuth2 · TOTP 2FA

### H1
**The entire authentication lifecycle. In one package.**

### Lede
JWT, OAuth2, two-factor, password reset, API keys, RBAC, policies, rate limiting, token blacklisting, remember-me. Not as separate add-ons — as one integrated subsystem with consistent APIs, tested together, versioned together.

### Code

```php
use MonkeysLegion\Auth\Service\AuthService;
use MonkeysLegion\Auth\Middleware\AuthenticationMiddleware;

// Login — returns token pair, handles 2FA challenge, enforces rate limit
$result = $authService->login([
    'email'    => 'user@example.com',
    'password' => 'secret',
]);

if ($result->requires2FA) {
    return response()->json([
        'requires_2fa' => true,
        'challenge'    => $result->challengeToken,
    ]);
}

$tokens = $result->getTokens();
// $tokens['access_token']  — short-lived JWT
// $tokens['refresh_token'] — long-lived rotation token

// Protect routes declaratively
#[Route('/admin', middleware: [AuthenticationMiddleware::class])]
final class AdminController { /* ... */ }

// Two-factor setup
use MonkeysLegion\Auth\TwoFactor\TotpProvider;
use MonkeysLegion\Auth\Service\TwoFactorService;

$twoFactor = new TwoFactorService(new TotpProvider(), issuer: 'YourApp');
$setup     = $twoFactor->generateSetup($user->email);
// Returns: secret, qr_code (base64 PNG), uri, recovery_codes[]

$twoFactor->enable($setup['secret'], $userProvidedCode, $user->id);
```

### What makes it different

- **Argon2id by default.** Memory cost 65536, time cost 4 — tuned for 2026 threat models, not 2015. Laravel still defaults to bcrypt.
- **JWT access + refresh with rotation.** Access tokens are short-lived; refresh tokens rotate on every use. Token blacklisting for revocation.
- **TOTP 2FA built-in.** QR code generation, recovery codes, and challenge flow — no `scheb/2fa-bundle` or `laravel/fortify` required.
- **OAuth2 providers.** Google and GitHub ship as first-class — no Socialite, no KnpUOAuth2ClientBundle.
- **Policies + RBAC.** Both authorization models in one package. Attribute-declared, compiled once.
- **Rate limiting + lockout.** Login throttling with per-IP and per-account lockout, configurable in `auth.mlc`.

### Configuration

```
auth {
    default_guard = "jwt"
    jwt_secret    = "${env.JWT_SECRET}"
    access_ttl    = 1800     # 30 minutes
    refresh_ttl   = 604800   # 7 days

    password {
        algorithm   = "argon2id"
        memory_cost = 65536
        time_cost   = 4
    }

    rate_limit {
        max_attempts    = 60
        lockout_seconds = 60
    }
}
```

### Next
`Read the docs →` `/docs/auth`  ·  `View package →` https://github.com/MonkeysCloud/MonkeysLegion-Auth

---

# Database Layer
`/features/database`

### Eyebrow
`monkeyslegion-database@2.0` · `monkeyslegion-query@2.0` · `monkeyslegion-entity@2.0`

### H1
**PDO, but modern.**

### Lede
A connection manager, fluent query builder, and entity scanner that work together without ORM magic. Entities are POPOs — no Doctrine proxies, no Eloquent `__get()` chains, no hydration tax on every fetch.

### Code

```php
use MonkeysLegion\Query\Query\QueryBuilder;

$qb = $container->get(QueryBuilder::class);

// Select with where + orderBy + limit
$users = $qb->select(['id', 'name', 'email'])
    ->from('users')
    ->where('status', '=', 'active')
    ->orderBy('created_at', 'DESC')
    ->limit(10)
    ->get();

// Joins
$posts = $qb->select(['posts.*', 'users.name AS author'])
    ->from('posts')
    ->join('users', 'posts.user_id', '=', 'users.id')
    ->where('posts.published', '=', 1)
    ->get();

// Aggregations
$count = $qb->from('orders')->where('status', '=', 'paid')->count();
$total = $qb->from('orders')->where('status', '=', 'paid')->sum('amount');

// Transactions
$connection->transaction(function () use ($qb): void {
    $qb->insert('orders', ['total' => 100, 'user_id' => 42]);
    $qb->update('inventory')->where('sku', '=', 'X-1')->set(['stock' => 'stock - 1']);
});

// Entities — just PHP objects
use MonkeysLegion\Entity\Attributes\{Entity, Id, Field};

#[Entity(table: 'users')]
final class User
{
    #[Id(strategy: 'auto')]
    public int $id;

    #[Field(type: 'string', length: 120)]
    public string $email;

    #[Field(type: 'datetime', default: 'now')]
    public \DateTimeImmutable $createdAt;
}
```

### What makes it different

- **POPO entities.** No proxies, no `__get`/`__set` interception. Access is native PHP property access at engine speed.
- **Compiled grammar.** The query builder compiles to driver-specific SQL once per build, not on every operation.
- **Multi-database.** MySQL, MariaDB, PostgreSQL, SQLite — same API, same entity definitions.
- **Attribute-declared schema.** Entity attributes are the single source of truth. Migrations are generated by diffing them against the live schema.
- **Transactions as closures.** Automatic rollback on exception, nested via savepoints.

### Related features
`Migrations →` `/features/migrations`  ·  `Entity scanner →` `/features/entities`

---

# Validation & DTO Binding
`/features/validation`

### Eyebrow
`monkeyslegion-validation@2.0` · Attribute-driven

### H1
**Type-safe requests. Zero boilerplate.**

### Lede
Define a request DTO. Annotate its properties with validation attributes. Use it as a controller argument. The framework does the rest — parse the body, validate every field, return a structured 422 on failure, inject the DTO on success.

### Code

```php
use MonkeysLegion\Validation\Attributes as Assert;

final readonly class CreateUserRequest
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Email]
        public string $email,

        #[Assert\NotBlank]
        #[Assert\Length(min: 8, max: 64)]
        public string $password,

        #[Assert\Range(min: 0, max: 120)]
        public int $age,

        #[Assert\Url]
        public string $website,

        #[Assert\UuidV4]
        public string $referralId,
    ) {}
}

#[Post('/users')]
public function create(CreateUserRequest $request): ResponseInterface
{
    // $request is fully validated + type-safe here
    // Invalid input never reaches this line
    $user = User::register($request->email, $request->password);
    return json_response(['id' => $user->id], 201);
}
```

### Error response (automatic)

```json
{
    "errors": [
        { "field": "email",    "message": "Value must be a valid e-mail." },
        { "field": "password", "message": "Length constraint violated." }
    ]
}
```

### What makes it different

- **Immutable by design.** `readonly` DTOs — can't be mutated after validation. No more "did something upstream change my request?" bugs.
- **Constructor-based.** Validation runs as part of instantiation. Invalid DTOs can't exist.
- **No controller boilerplate.** No `$request->validate()` calls, no `FormRequest::authorize()`. The type signature *is* the contract.
- **Deep validation.** Nested DTOs, array validation with `#[ArrayOf]`, conditional rules with `#[When]`.

### Built-in validators

`NotBlank` · `Email` · `Length(min, max)` · `Range(min, max)` · `Url` · `UuidV4` · `Regex` · `In` · `NotIn` · `Date` · `DateFormat` · `Unique` · `Exists` · `Required` · `Nullable` · plus custom `#[Assert\Custom]` for ad-hoc rules.

### Next
`Read the docs →` `/docs/validation`  ·  `View package →` https://github.com/MonkeysCloud/MonkeysLegion-Validation

---

# Compiled DI Container
`/features/di`

### Eyebrow
`monkeyslegion-di@2.0` · PSR-11 compliant

### H1
**Zero runtime reflection. In production.**

### Lede
Development builds resolve services reflectively — convenient. Production builds compile the entire container to a PHP array written atomically to disk — fast. One command flips the switch.

### Code

```php
// Development — autowiring via reflection
use MonkeysLegion\DI\ContainerBuilder;

$builder = new ContainerBuilder();
$builder->addDefinitions([
    PaymentGateway::class => fn($c) => new StripeGateway(
        apiKey: $_ENV['STRIPE_API_KEY'],
    ),
    // Interfaces auto-bound to implementations via constructor hints
]);

$container = $builder->build();
$service = $container->get(UserService::class);
```

```bash
# Production — compile the container
php ml config:cache

# Clear when definitions change
php ml config:clear
```

### What the compiler does

- **Resolves all definitions at build time.** No reflection at runtime.
- **Writes an atomic PHP file.** `var/cache/container.compiled.php` — a single lookup array.
- **Pre-resolves constructor dependencies.** Factory closures become direct instantiation statements.
- **Detects circular dependencies** at compile time, not at 3am on Saturday.
- **Auto-invalidates** when definitions change in dev (timestamp check) and is frozen in production.

### Service providers with attributes

```php
use MonkeysLegion\Config\Providers\AbstractServiceProvider;
use MonkeysLegion\Framework\Attributes\{Provider, BootAfter};

#[Provider(priority: 10, context: 'http')]
#[BootAfter(DatabaseProvider::class)]
final class PaymentProvider extends AbstractServiceProvider
{
    public function getDefinitions(): array
    {
        return [
            PaymentGateway::class => fn($c) => new StripeGateway(
                apiKey: $_ENV['STRIPE_API_KEY'],
            ),
        ];
    }
}
```

### What makes it different

- **Attribute-based discovery.** Drop providers in `app/Provider/` — they're found automatically.
- **Context-aware.** `context: 'http'` providers load only for HTTP requests; `'cli'` only for CLI commands. Boot faster by loading less.
- **Priority + BootAfter.** Explicit ordering for providers with dependencies between them.
- **Benchmark-grade performance.** Compiled containers resolve services in ~100ns — effectively free.

### Next
`Read the docs →` `/docs/di`  ·  `View package →` https://github.com/MonkeysCloud/MonkeysLegion-Di

---

# Template Engine
`/features/templates`

### Eyebrow
`monkeyslegion-template@2.0` · Custom engine · Compiled to PHP

### H1
**Familiar syntax. Compiled output. No surprises.**

### Lede
MLView is a lightweight template engine that compiles to optimized PHP. Familiar directives, layouts, inheritance, partials, caching — without Blade's framework lock-in or Twig's compilation overhead.

### Code

```html
<!-- resources/views/layouts/app.html -->
<!DOCTYPE html>
<html lang="{{ $locale ?? 'en' }}">
<head>
    <title>@yield('title', 'MonkeysLegion')</title>
    @stack('styles')
</head>
<body>
    <nav>@include('partials.nav')</nav>

    <main>@yield('content')</main>

    @stack('scripts')
</body>
</html>
```

```html
<!-- resources/views/users/show.html -->
@extends('layouts.app')

@section('title', $user->name)

@section('content')
    <h1>{{ $user->name }}</h1>

    @if($posts)
        <ul class="posts">
            @foreach($posts as $post)
                <li>
                    <a href="/posts/{{ $post->slug }}">{{ $post->title }}</a>
                    <time>{{ $post->createdAt->format('M j, Y') }}</time>
                </li>
            @endforeach
        </ul>
    @else
        <p>No posts yet.</p>
    @endif

    @auth
        <a href="/posts/new">Write a post</a>
    @endauth
@endsection

@push('scripts')
    <script src="/js/posts.js"></script>
@endpush
```

```php
// In the controller
use MonkeysLegion\Template\Renderer;

public function show(int $id, Renderer $renderer): ResponseInterface
{
    return $renderer->render('users.show', [
        'user'  => User::find($id),
        'posts' => Post::byUser($id),
    ]);
}
```

### What makes it different

- **Compiled to plain PHP.** First render compiles to `var/cache/views/*.php` — subsequent renders are just `require` calls.
- **Auto-escaped by default.** `{{ $var }}` escapes HTML; use `{!! $html !!}` explicitly for raw output.
- **Inheritance + stacks.** `@extends`, `@section`, `@yield`, `@stack`/`@push` — layouts compose without duplication.
- **Custom directives.** `@auth`, `@can`, `@env`, or register your own in `TemplateProvider`.
- **Zero JIT overhead.** Compiled templates run through OPcache like any other PHP file.

### Built-in directives

`@if` · `@elseif` · `@else` · `@foreach` · `@for` · `@while` · `@switch`/`@case` · `@include` · `@includeIf` · `@extends` · `@section`/`@yield`/`@endsection` · `@stack`/`@push` · `@auth`/`@guest` · `@can` · `@env` · `@csrf` · `@method` · `@dump` · `@json`.

### Next
`Read the docs →` `/docs/templates`  ·  `View package →` https://github.com/MonkeysCloud/MonkeysLegion-Template

---

# Cache
`/features/cache`

### Eyebrow
`monkeyslegion-cache@2.0` · PSR-16 · Redis · File · Memcached · Array

### H1
**One cache API. Four backends. Swap with one config line.**

### Lede
PSR-16 SimpleCache compliance across Redis, file, Memcached, and in-memory stores. Your application code doesn't know which one is behind the interface — change backends in config, redeploy, done.

### Code

```php
use Psr\SimpleCache\CacheInterface;

final class ProductService
{
    public function __construct(private CacheInterface $cache) {}

    public function find(int $id): ?Product
    {
        // set + get with TTL
        $cached = $this->cache->get("product:{$id}");
        if ($cached !== null) {
            return $cached;
        }

        $product = Product::find($id);
        $this->cache->set("product:{$id}", $product, ttl: 3600);
        return $product;
    }

    public function invalidate(int $id): void
    {
        $this->cache->delete("product:{$id}");
    }
}

// Multi-operations
$this->cache->setMultiple([
    'product:1' => $p1,
    'product:2' => $p2,
    'product:3' => $p3,
], ttl: 3600);

$products = $this->cache->getMultiple(['product:1', 'product:2', 'product:3']);
```

### Configuration

```
cache {
    default = "redis"

    stores {
        file {
            driver = "file"
            path   = "${env.APP_STORAGE}/cache"
        }

        redis {
            driver = "redis"
            host   = "${env.REDIS_HOST}"
            port   = 6379
            prefix = "app:cache:"
        }

        memcached {
            driver  = "memcached"
            servers = [["127.0.0.1", 11211]]
        }

        array {
            driver = "array"  # request-scoped, in-memory
        }
    }
}
```

### What makes it different

- **True PSR-16.** Not a wrapper around a different interface — implements `Psr\SimpleCache\CacheInterface` directly.
- **Tagging support.** Invalidate groups of keys at once via `$cache->invalidateTag('product')`.
- **Lock primitive.** `$cache->lock('resource', ttl: 10)` for distributed mutex patterns.
- **Stampede protection.** `$cache->remember($key, $ttl, $callback)` with automatic lock to prevent dog-piling on cache miss.
- **Multiple stores simultaneously.** Cache session data in Redis and page fragments in file — route by key prefix.

### Next
`Read the docs →` `/docs/cache`  ·  `View package →` https://github.com/MonkeysCloud/MonkeysLegion-Cache

---

# Events
`/features/events`

### Eyebrow
`monkeyslegion-events@2.0` · PSR-14 event dispatcher

### H1
**Decouple features. Listen anywhere.**

### Lede
A PSR-14 event dispatcher with listener auto-discovery. Define an event as a readonly class. Register listeners via attribute or provider. Dispatch from anywhere. Listeners run in declared priority order, synchronously by default, queued when marked `ShouldQueue`.

### Code

```php
// Define the event
final readonly class UserRegistered
{
    public function __construct(
        public int $userId,
        public string $email,
        public \DateTimeImmutable $at,
    ) {}
}

// Listener — auto-discovered via attribute
use MonkeysLegion\Events\Attribute\Listener;

#[Listener(event: UserRegistered::class, priority: 10)]
final class SendWelcomeEmail
{
    public function __construct(private MailService $mail) {}

    public function __invoke(UserRegistered $event): void
    {
        $this->mail->send($event->email, 'welcome');
    }
}

// Queued listener — runs in a background worker
#[Listener(event: UserRegistered::class)]
final class GenerateDefaultAvatar implements ShouldQueue
{
    public function __invoke(UserRegistered $event): void
    {
        // Heavy work — runs via monkeyslegion-queue
    }
}

// Dispatch from anywhere
use Psr\EventDispatcher\EventDispatcherInterface;

final class RegistrationService
{
    public function __construct(private EventDispatcherInterface $dispatcher) {}

    public function register(string $email, string $password): User
    {
        $user = User::create($email, $password);

        $this->dispatcher->dispatch(new UserRegistered(
            userId: $user->id,
            email:  $email,
            at:     new \DateTimeImmutable(),
        ));

        return $user;
    }
}
```

### What makes it different

- **PSR-14 all the way.** Use any PSR-14-compatible listener library or stop using MonkeysLegion's — the interface is the contract.
- **Attribute auto-discovery.** Drop listeners in `app/Listener/` — no registration code.
- **Priority ordering.** `priority: 10` runs before `priority: 1`. Same-priority listeners run in discovery order.
- **Queueable listeners.** Mark with `ShouldQueue` — the dispatcher pushes to the queue instead of running inline.
- **Stoppable events.** Implement `StoppableEventInterface` — any listener can halt propagation.
- **Wildcard listeners.** Subscribe to `user.*` to catch `user.registered`, `user.login`, `user.deleted` with one listener.

### CLI
```bash
php ml make:event UserRegistered
php ml make:listener SendWelcomeEmail --event=UserRegistered
php ml event:list
```

### Next
`Read the docs →` `/docs/events`  ·  `View package →` https://github.com/MonkeysCloud/MonkeysLegion-Events

---

# Queue System
`/features/queue`

### Eyebrow
`monkeyslegion-queue@1.2` · Redis / Database / Array drivers

### H1
**Background jobs. With retry, timeout, and batching.**

### Lede
Dispatch jobs. Process them in worker processes. Retry on failure with exponential backoff. Batch related jobs for atomic all-or-nothing execution. Monitor via CLI. Nothing new to learn — same patterns you know from Laravel, with cleaner PSR-aligned APIs.

### Code

```php
use MonkeysLegion\Queue\Contracts\QueueInterface;

// Define a job
final class SendEmailJob
{
    public function __construct(
        public readonly int $userId,
        public readonly string $template,
    ) {}

    public function handle(MailService $mail, UserRepository $users): void
    {
        $user = $users->find($this->userId);
        $mail->send($user->email, $this->template);
    }
}

// Dispatch
final class RegistrationController
{
    public function __construct(private QueueInterface $queue) {}

    public function register(CreateUserRequest $request): ResponseInterface
    {
        $user = User::register($request->email, $request->password);

        // Fire-and-forget
        $this->queue->push(new SendEmailJob($user->id, 'welcome'));

        // Delayed
        $this->queue->later(3600, new SendEmailJob($user->id, 'day-one-tips'));

        return json_response(['id' => $user->id], 201);
    }
}
```

```bash
# Start a worker
php ml queue:work --tries=3 --timeout=60

# Process a specific queue
php ml queue:work --queue=emails,default

# Monitor status
php ml queue:monitor
```

### What makes it different

- **Retry with exponential backoff.** Declare `tries` and `backoff` on the job class. Failed jobs land in a `failed_jobs` table for inspection.
- **Timeout enforcement.** Jobs that exceed their timeout are killed and retried. No runaway workers.
- **Batching.** Dispatch 1000 jobs as one batch, then handle completion and failure atomically.
- **Middleware.** Wrap jobs with middleware — rate limit per key, prevent concurrent duplicates, log timing.
- **Multiple drivers.** Redis for throughput, database for durability, array for tests.

### Configuration

```
queue {
    default = "redis"

    connections {
        redis {
            driver = "redis"
            queue  = "default"
            retry_after = 90
        }
        database {
            driver = "database"
            table  = "jobs"
            failed_table = "failed_jobs"
        }
    }

    worker {
        sleep       = 3
        max_tries   = 3
        timeout     = 60
        memory_mb   = 128
    }
}
```

### Next
`Read the docs →` `/docs/queue`  ·  `View package →` https://github.com/MonkeysCloud/MonkeysLegion-Queue

---

# File Management
`/features/files`

### Eyebrow
`monkeyslegion-files@2.0` · Local · S3 · GCS · Image processing

### H1
**Uploads, storage, and image processing. Unified.**

### Lede
Store files on local disk, S3, or Google Cloud Storage through a single interface. Process images — resize, convert, crop, optimize — via a fluent API. Garbage-collect orphaned uploads automatically.

### Code

```php
use MonkeysLegion\Files\FilesManager;
use MonkeysLegion\Files\Image\ImageProcessor;

final class AvatarController
{
    public function __construct(
        private FilesManager $files,
        private ImageProcessor $images,
    ) {}

    public function upload(ServerRequestInterface $request): ResponseInterface
    {
        $upload = $request->getUploadedFiles()['avatar']
            ?? throw new HttpException(400, 'Missing avatar file');

        // Store the upload — returns the storage path
        $path = $this->files->store($upload, directory: 'avatars', disk: 's3');

        // Generate thumbnail
        $thumb = $this->images->process($path, [
            'resize' => [150, 150],
            'crop'   => 'center',
            'format' => 'webp',
            'quality' => 85,
        ]);

        return json_response([
            'path'      => $path,
            'thumbnail' => $thumb,
            'url'       => $this->files->url($path),
        ]);
    }
}
```

### Configuration

```
files {
    default = "s3"

    disks {
        local {
            driver = "local"
            root   = "${env.APP_STORAGE}/files"
            url    = "${env.APP_URL}/storage"
        }

        s3 {
            driver   = "s3"
            bucket   = "${env.S3_BUCKET}"
            region   = "${env.S3_REGION}"
            key      = "${env.S3_KEY}"
            secret   = "${env.S3_SECRET}"
        }

        gcs {
            driver     = "gcs"
            bucket     = "${env.GCS_BUCKET}"
            project_id = "${env.GCS_PROJECT}"
        }
    }

    gc {
        enabled  = true
        lifetime = 86400  # orphan files older than 24h
    }
}
```

### What makes it different

- **Unified interface.** `$files->store()`, `$files->get()`, `$files->delete()`, `$files->url()` — same API across local, S3, GCS.
- **Streaming uploads.** Large files stream to storage; no RAM spikes on 500MB uploads.
- **Image processing built-in.** No `intervention/image` or `imagine` dependency.
- **Garbage collection.** Orphaned uploads (files not referenced after upload) are swept by a scheduled task.
- **Signed URLs.** `$files->signedUrl($path, ttl: 3600)` for time-limited private access.

### Next
`Read the docs →` `/docs/files`  ·  `View package →` https://github.com/MonkeysCloud/MonkeysLegion-Files

---

# I18n
`/features/i18n`

### Eyebrow
`monkeyslegion-i18n@2.1` · File + database loaders · ICU-style plurals

### H1
**Multi-language. Multi-loader. Multi-format.**

### Lede
Load translations from JSON/YAML files, a database, or both simultaneously. Support pluralization, interpolation, gender forms, and nested namespaces. Swap locale per-request via middleware or explicitly.

### Code

```php
// resources/lang/en/messages.json
{
    "welcome":  "Welcome!",
    "greeting": "Hello, :name!",
    "items":    "{0} No items|{1} One item|[2,*] :count items",
    "cart": {
        "empty":    "Your cart is empty",
        "checkout": "Checkout (:count items)"
    }
}

// Use anywhere
use MonkeysLegion\I18n\Translator;

$t = $container->get(Translator::class);

echo $t->trans('messages.welcome');
// "Welcome!"

echo $t->trans('messages.greeting', ['name' => 'John']);
// "Hello, John!"

echo $t->choice('messages.items', 5);
// "5 items"

echo $t->trans('messages.cart.checkout', ['count' => 3]);
// "Checkout (3 items)"

// Switch locale
$t->setLocale('es');
echo $t->trans('messages.welcome');
// "¡Bienvenido!"

// Helper functions (when monkeyslegion-cli is loaded)
echo __('messages.welcome');
echo trans_choice('messages.items', 10);
echo lang();         // current locale
lang('fr');          // set locale
```

### Database loader

```php
use MonkeysLegion\I18n\Loader\DatabaseLoader;

// translations table: locale, namespace, key, value
$translator->addLoader(new DatabaseLoader($connection));

// Now editable via admin UI, live without redeployment
```

### What makes it different

- **Cascade loaders.** File loader for developer-owned strings + database loader for admin-editable content — merged transparently.
- **Proper pluralization.** ICU-style `{0} None|{1} One|[2,*] Many` with range notation.
- **Nested keys.** Group related strings under namespaces (`cart.empty`, `cart.checkout`) without flat-key pollution.
- **Locale detection middleware.** Auto-switches locale from `Accept-Language` header or subdomain/path segment.
- **Missing-key logging.** Keys that aren't translated are logged — ship-ready for translator handoff.

### CLI

```bash
php ml i18n:scan                # find used trans() keys in code
php ml i18n:missing              # list keys missing per locale
php ml i18n:export --format=csv  # export for translation
```

### Next
`Read the docs →` `/docs/i18n`  ·  `View package →` https://github.com/MonkeysCloud/MonkeysLegion-I18n

---

# Mail
`/features/mail`

### Eyebrow
`monkeyslegion-mail@1.1` · SMTP · API transports · DKIM signing

### H1
**Email. Without the third-party bundle.**

### Lede
SMTP and API transports built in. DKIM signing. Template-backed mailables. Queueable delivery. Attachments, inline images, reply-to, CC, BCC. Everything the average app needs without pulling in Symfony Mailer + a handful of bundles.

### Code

```php
// Generate a mailable
php ml make:mail WelcomeMail

// app/Mail/WelcomeMail.php
use MonkeysLegion\Mail\Mailable;

final class WelcomeMail extends Mailable
{
    public function __construct(public readonly User $user) {}

    public function build(): self
    {
        return $this
            ->subject("Welcome, {$this->user->name}!")
            ->view('emails.welcome', ['user' => $this->user])
            ->attach('/tmp/welcome-guide.pdf', as: 'guide.pdf')
            ->tag('welcome-flow');
    }
}

// Send
use MonkeysLegion\Mail\MailerInterface;

$mailer->to($user->email)->send(new WelcomeMail($user));

// Queue instead of sending inline
$mailer->to($user->email)->queue(new WelcomeMail($user));

// Send later
$mailer->to($user->email)->later(3600, new WelcomeMail($user));
```

### Configuration

```
mail {
    default = "smtp"

    transports {
        smtp {
            driver   = "smtp"
            host     = "${env.MAIL_HOST}"
            port     = 587
            username = "${env.MAIL_USERNAME}"
            password = "${env.MAIL_PASSWORD}"
            encryption = "tls"
        }

        mailgun {
            driver = "mailgun"
            domain = "${env.MAILGUN_DOMAIN}"
            secret = "${env.MAILGUN_SECRET}"
        }

        postmark {
            driver = "postmark"
            token  = "${env.POSTMARK_TOKEN}"
        }
    }

    from {
        address = "noreply@example.com"
        name    = "Example App"
    }

    dkim {
        enabled    = true
        domain     = "example.com"
        selector   = "mail"
        privateKey = "${env.DKIM_PRIVATE_KEY_PATH}"
    }
}
```

### What makes it different

- **DKIM signing included.** Generate keys with `php ml make:dkim-pkey` and configure once — emails are signed automatically.
- **Template-backed.** Mailables render via the MLView template engine — share layout with your web pages.
- **Queue-integrated.** `->queue()` and `->later()` route through `monkeyslegion-queue` out of the box.
- **Transport-agnostic.** Swap SMTP for Mailgun, Postmark, SES — one config line.
- **Preview mode.** `MAIL_TRANSPORT=log` dumps emails to `var/logs/mail.log` during development.

### Next
`Read the docs →` `/docs/mail`  ·  `View package →` https://github.com/MonkeysCloud/MonkeysLegion-Mail

---

# Telemetry & Observability
`/features/telemetry`

### Eyebrow
`monkeyslegion-telemetry@2.0` · Metrics · Tracing · Structured logging

### H1
**OpenTelemetry-compatible. Production-grade.**

### Lede
Counters, histograms, and gauges for Prometheus. Distributed tracing spans that export to Jaeger, Tempo, or any OTLP endpoint. Structured logs with request correlation IDs. All wired through the default middleware pipeline — you get observability by default, not as a bolt-on.

### Code

```php
use MonkeysLegion\Telemetry\Metrics\MetricsInterface;
use MonkeysLegion\Telemetry\Tracing\TracerInterface;

final class OrderService
{
    public function __construct(
        private MetricsInterface $metrics,
        private TracerInterface $tracer,
        private LoggerInterface $logger,
    ) {}

    public function place(Cart $cart): Order
    {
        $span = $this->tracer->startSpan('order.place', [
            'cart.id'    => $cart->id,
            'cart.items' => count($cart->items),
        ]);

        try {
            $this->metrics->counter('orders_placed_total')->inc();
            $this->metrics->histogram('order_amount_usd')->observe($cart->total);

            $order = Order::fromCart($cart);
            $order->save();

            $this->logger->info('Order placed', [
                'order_id' => $order->id,
                'amount'   => $order->total,
            ]);

            $span->setAttribute('order.id', $order->id);
            return $order;
        } catch (\Throwable $e) {
            $span->recordException($e);
            $this->metrics->counter('orders_failed_total')->inc();
            throw $e;
        } finally {
            $span->end();
        }
    }
}
```

### What's automatic

- **Request correlation IDs.** Every request gets a unique ID in the `X-Request-Id` response header and every log line.
- **HTTP metrics.** `http_requests_total`, `http_request_duration_ms`, `http_responses_by_status` — exported automatically.
- **Database metrics.** Query counts, latency histograms, connection pool stats — no manual instrumentation.
- **Error rate tracking.** Uncaught exceptions increment `errors_total{class="..."}` with exception class labels.

### Exporters

- **Prometheus** — scrape endpoint exposed at `/metrics` via `PrometheusMiddleware`.
- **OTLP** — gRPC or HTTP endpoint for Jaeger, Tempo, Honeycomb, Grafana.
- **StatsD** — metrics as UDP packets for Datadog, StatsD daemons.
- **Console** — pretty-print in development for local debugging.

### Configuration

```
telemetry {
    metrics {
        driver = "prometheus"
        namespace = "myapp"
    }

    tracing {
        enabled = true
        service_name = "myapp"
        exporter = "otlp"
        endpoint = "${env.OTLP_ENDPOINT}"
        sample_rate = 0.1  # 10% sampling in production
    }

    logging {
        format = "json"
        channel = "app"
    }
}
```

### Next
`Read the docs →` `/docs/telemetry`  ·  `View package →` https://github.com/MonkeysCloud/MonkeysLegion-Telemetry

---

# OpenAPI v3
`/features/openapi`

### Eyebrow
`monkeyslegion-openapi@1.0` · Auto-generated · Swagger UI ready

### H1
**Your routes. Your docs. One source of truth.**

### Lede
Route attributes, DTO attributes, and controller return types describe your API. The OpenAPI generator reads them and emits a valid OpenAPI v3 spec — no hand-maintained YAML, no doc rot, no parallel truth.

### Code

```php
use MonkeysLegion\Router\Attribute\{Route, Post, Get};

#[Route('/api/users', name: 'users')]
final class UserController
{
    #[Get(
        '/',
        name: 'users.index',
        summary: 'List all users',
        description: 'Returns a paginated list of users with optional filters',
        tags: ['Users', 'API'],
        meta: ['version' => '2.0'],
    )]
    public function index(ListUsersQuery $query): UserCollection
    {
        return new UserCollection(User::paginate($query->page, $query->perPage));
    }

    #[Post(
        '/',
        summary: 'Create a user',
        tags: ['Users'],
    )]
    public function create(CreateUserRequest $request): UserResource
    {
        $user = User::register($request->email, $request->password);
        return new UserResource($user);
    }
}

// DTOs describe request and response schemas
final readonly class CreateUserRequest
{
    public function __construct(
        #[Assert\Email]   public string $email,
        #[Assert\Length(min: 8)] public string $password,
    ) {}
}
```

### Generate the spec

```bash
# Export to stdout
php ml openapi:export

# Write to file
php ml openapi:export --output=public/openapi.json

# Serve at a route
php ml openapi:export --output=public/openapi.json --format=yaml
```

### What makes it different

- **Routes, DTOs, and return types are the spec.** No docblocks to maintain, no separate YAML file to sync.
- **Tags feed grouping.** Routes tagged with `['Users']` appear under "Users" in Swagger UI.
- **Validation rules feed schemas.** `#[Assert\Email]` becomes `"format": "email"`. `#[Constrain(min: 0, max: 100)]` becomes `"minimum": 0, "maximum": 100`.
- **Response schemas from return types.** Typed responses (`UserResource`, `UserCollection`) become OpenAPI response schemas automatically.
- **Swagger UI middleware.** Serve `/api/docs` with one line in your middleware pipeline — Swagger UI served from the package, no CDN dependency.

### Example output snippet

```yaml
paths:
    /api/users:
        post:
            summary: Create a user
            tags: [Users]
            requestBody:
                required: true
                content:
                    application/json:
                        schema:
                            type: object
                            required: [email, password]
                            properties:
                                email:    { type: string, format: email }
                                password: { type: string, minLength: 8 }
            responses:
                '201':
                    description: User created
                    content:
                        application/json:
                            schema: { $ref: '#/components/schemas/UserResource' }
```

### Next
`Read the docs →` `/docs/openapi`  ·  `View package →` https://github.com/MonkeysCloud/MonkeysLegion-Openapi

---

# CLI
`/features/cli`

### Eyebrow
`monkeyslegion-cli@2.0` · Attribute-discovered commands · 17+ scaffolders

### H1
**The `ml` binary. Your framework's other interface.**

### Lede
A reflection-driven CLI kernel that discovers commands via `#[Command]` attributes. 17+ `make:*` scaffolders, DB migrations, queue workers, schedule runner, interactive REPL, cache management, route listing — all through one binary.

### Code

```php
// app/Cli/Command/HelloCommand.php
namespace App\Cli\Command;

use MonkeysLegion\Cli\Console\Attributes\Command as CommandAttr;
use MonkeysLegion\Cli\Console\Command;

#[CommandAttr('demo:hello', 'Print a greeting')]
final class HelloCommand extends Command
{
    protected function handle(): int
    {
        $name = $this->argument(0) ?? 'world';
        $loud = $this->hasOption('loud');

        $message = $loud
            ? strtoupper("Hello, {$name}!")
            : "Hello, {$name}!";

        $this->info($message);
        return self::SUCCESS;
    }
}
```

```bash
php ml demo:hello            # → Hello, world!
php ml demo:hello Yorch       # → Hello, Yorch!
php ml demo:hello Yorch --loud # → HELLO, YORCH!
```

### What ships

**Scaffolding (17 commands)**
```bash
php ml make:controller User
php ml make:entity User
php ml make:middleware Auth
php ml make:dto CreateUserRequest
php ml make:event UserRegistered
php ml make:listener SendWelcomeEmail
php ml make:policy UserPolicy
php ml make:job SendEmailJob
php ml make:service PaymentService
php ml make:command SyncData
php ml make:test UserServiceTest
php ml make:factory UserFactory
php ml make:seeder UserSeeder
php ml make:enum UserRole
php ml make:observer UserObserver
php ml make:resource UserResource
php ml make:mail WelcomeMail
```

**Database**
```bash
php ml db:create
php ml make:migration
php ml migrate
php ml rollback
php ml db:seed
```

**Operations**
```bash
php ml config:cache       # compile DI + config for production
php ml config:clear       # clear compiled cache
php ml cache:clear        # clear application cache
php ml route:list         # show all registered routes
php ml queue:work         # start a queue worker
php ml schedule:run       # run scheduled tasks (invoke via cron)
php ml openapi:export     # export OpenAPI spec
php ml tinker             # interactive REPL with app context
php ml down / up          # maintenance mode
php ml about              # framework diagnostics
```

### Command API

```php
$this->argument(0);                    // positional arg
$this->option('output');               // --output=value
$this->hasOption('force');             // --force (boolean)
$this->allOptions();                   // all flags as array
$this->ask('Enter name');              // readline prompt
$this->confirm('Continue?');           // y/n prompt
$this->info('Green message');          // colored output
$this->line('Neutral message');
$this->error('Red error', code: 1);    // to STDERR
```

### Next
`Read the docs →` `/docs/cli`  ·  `View package →` https://github.com/MonkeysCloud/MonkeysLegion-Cli

---

# Security Middleware
`/features/security`

### Eyebrow
`monkeyslegion-http@2.0` · OWASP defaults · CSRF · CORS · Rate limit

### H1
**Secure by default. Not "secure once you install five packages."**

### Lede
OWASP security headers, CORS, CSRF, rate limiting, trusted proxy handling, request ID correlation, and maintenance mode all ship as PSR-15 middleware — enabled by default in the standard pipeline. No bundles to install. No configuration files to write. No CVE archaeology during audits.

### The default pipeline

```
┌─────────────────────────────────────────────────┐
│  ServerRequest::fromGlobals()                   │
├─────────────────────────────────────────────────┤
│  1. SecurityHeadersMiddleware  (OWASP)          │
│  2. TrustedProxyMiddleware                      │
│  3. RequestIdMiddleware        (correlation)    │
│  4. CorsMiddleware                              │
│  5. RateLimitMiddleware                         │
│  6. MaintenanceModeMiddleware                   │
│  7. SessionMiddleware                           │
│  8. VerifyCsrfToken                             │
│  9. AuthenticationMiddleware                    │
│  10. Router → Controller → Response             │
└─────────────────────────────────────────────────┘
```

### Headers set automatically

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; ...
X-Request-Id: 01J8X...  (correlation ID)
```

### Rate limiting

```php
// Global rate limit via config
middleware {
    rate_limit {
        driver       = "cache"
        max_attempts = 60
        decay_seconds = 60
    }
}

// Per-route rate limit via attribute (v2.1)
#[Post('/api/login', middleware: [RateLimitMiddleware::class . ':5,60'])]
public function login(LoginRequest $request): ResponseInterface { /* ... */ }
```

### CSRF protection

```html
<!-- In your template -->
<form method="POST" action="/users">
    @csrf
    <!-- generates: <input type="hidden" name="_token" value="..."> -->
    ...
</form>
```

Token auto-validated by `VerifyCsrfToken` middleware. Exempt routes via configuration — GET/HEAD/OPTIONS are exempt by default, plus any route you add to the exempt list.

### Maintenance mode

```bash
php ml down --retry=600 --secret=bypass123 --message="Upgrading..."
# Site returns 503 Service Unavailable with Retry-After: 600
# Bypass: ?secret=bypass123 or IP in whitelist

php ml up
# Site resumes normal operation
```

### Trusted proxies

```
http {
    trusted_proxies = ["10.0.0.0/8", "172.16.0.0/12"]
    trusted_headers = ["X-Forwarded-For", "X-Forwarded-Proto", "X-Forwarded-Host"]
}
```

Prevents `X-Forwarded-For` spoofing by only honoring proxy headers from configured IP ranges.

### What makes it different

- **All first-party.** Nothing to pin to someone else's release cycle.
- **Tested as a unit.** The whole middleware stack is verified together in CI.
- **Zero CVE archaeology.** Security-critical features are versioned with the framework — one CHANGELOG, one release train.

### Next
`Read the docs →` `/docs/security`  ·  `View package →` https://github.com/MonkeysCloud/MonkeysLegion-Http
