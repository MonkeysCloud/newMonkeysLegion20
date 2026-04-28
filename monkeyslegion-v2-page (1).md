# MonkeysLegion v2.0 — Complete Webpage Content

> **Purpose of this document**  
> Production-ready copy + structured content blocks for the MonkeysLegion v2.0 launch page. Sections are ordered to map 1:1 to a landing page layout (hero → proof → features → packages → code → comparisons → docs CTA). Every technical claim is sourced from the `MonkeysLegion` and `MonkeysLegion-Skeleton@2.0` repositories.

---

## 1. HERO SECTION

### Eyebrow
`v2.0 — Available now`

### H1
**The attribute-first PHP framework built for PHP 8.4.**

### Subhead
MonkeysLegion is a modular, PSR-compliant framework that leverages PHP 8.4 property hooks, a compiled DI container, and 26 focused packages to deliver the speed of a micro-framework with the batteries of a full-stack one — without runtime magic. And it's the **first PHP framework with a full AI orchestration engine built in.**

### Primary CTA
`Get started →` → `composer create-project monkeyscloud/monkeyslegion-skeleton my-app`

### Secondary CTA
`View on GitHub` → https://github.com/MonkeysCloud/MonkeysLegion

### Trust badges (row under CTAs)
- **PHP 8.4+** native property hooks
- **PSR-7 / 11 / 14 / 15 / 16 / 17** compliant
- **182 tests / 440 assertions** passing (framework) · **363 tests** (Apex)
- **MIT licensed**
- **26 packages** pinned to v2.0+
- 🤖 **AI Orchestration Engine included** *(first in PHP)*

### Hero terminal block (animated typing, if possible)
```bash
composer create-project monkeyscloud/monkeyslegion-skeleton my-app
cd my-app
php ml key:generate
composer serve
# → http://127.0.0.1:8000
```

---

## 2. "WHAT'S NEW IN v2.0" SECTION

### Section title
**Everything changed. Nothing feels heavy.**

### Intro paragraph
v2.0 is a full architectural pass across the entire ecosystem. Every package is pinned to v2.0+ for API consistency, the DI container compiles to zero-overhead resolution, and PHP 8.4 property hooks replace `__get()` / `__set()` magic across the board. The result is a framework that reads like Symfony, boots like a micro, and ships with more built-ins than Laravel.

### Six-tile feature grid

| # | Tile Title | Tile Copy |
|---|------------|-----------|
| 1 | **PHP 8.4 Property Hooks** | Native getters/setters as engine hooks — not reflection, not magic methods. Validation and formatting run at C speed. |
| 2 | **Attribute-First Architecture** | Routes, validation rules, service providers, and CLI commands are discovered via PHP 8 attributes. No giant route files, no YAML config graveyards. |
| 3 | **Compiled DI Container** | Production builds compile definitions to a PHP array written atomically to disk. Zero runtime reflection on the hot path. |
| 4 | **MLC Configuration** | A clean, typed config format with environment interpolation, cascading (`.env` → `.env.local` → `.env.{APP_ENV}`), and compiled production caching. |
| 5 | **PSR-15 Security Pipeline** | OWASP security headers, CORS, rate limiting, CSRF, trusted proxies, and request IDs — all as standard middleware, on by default. |
| 6 | **Apex — Built-in AI Orchestration** | Not a wrapper. A complete AI infrastructure layer with multi-provider routing (Anthropic, OpenAI, Google, Ollama), declarative pipelines, guardrails, agent crews, and cost management. The first PHP framework to ship this as core. |

---

## 3. PILLAR SECTION — "Why MonkeysLegion"

### Section title
**Three promises. Kept by design.**

### Three-column layout

#### Column 1 — ⚡ Fast
**Measured in millions of ops per second.**  
Zero-magic architecture means entities, DTOs, and enums are plain PHP objects. No Doctrine proxies, no Eloquent `__get()` chains, no framework metaclass layer. We benchmarked the foundations against Laravel and Symfony on identical hardware — the results are below.

#### Column 2 — 🔐 Secure
**Defaults that would take weeks to bolt on elsewhere.**  
Argon2id password hashing, built-in TOTP 2FA, JWT with rotation and blacklisting, rate limiting per route, OWASP headers middleware, CSRF, trusted-proxy awareness, and maintenance mode with IP/secret bypass. Every one of these ships enabled.

#### Column 3 — 🧩 Modular
**26 packages. Use all of them, or use two.**  
Every capability lives in its own Composer package with its own semver. The meta-package wires them together, but you can swap any of them for your own implementation via the PSR contract. No framework lock-in at the code level.

---

## 4. BENCHMARKS SECTION — "Speed Comparison"

### Section title
**Benchmarked, not marketed.**

### Intro paragraph
All numbers below were produced on Apple Silicon (M-series) with PHP 8.5.3, no opcache preloading, warm JIT, identical test harnesses. Comparisons use stock Laravel 11.x and Symfony 7.x with default configurations.

### Primary benchmark table

| Operation | MonkeysLegion Ops/sec | vs Laravel | vs Symfony |
|-----------|----------------------:|:-----------|:-----------|
| Entity creation | **6.3M** | ~140× faster | ~114× faster |
| DTO construction | **10.9M** | ~60× faster | ~54× faster |
| Resource serialization | **43.8K** | ~5.5× faster | ~3.6× faster |
| Enum operations | **8.7M** | ~25× faster | ~22× faster |
| Property hooks (email validation) | **11.1M** | N/A *(PHP 8.4 exclusive)* | N/A *(PHP 8.4 exclusive)* |
| Computed properties | **41M** | N/A *(PHP 8.4 exclusive)* | N/A *(PHP 8.4 exclusive)* |
| Peak memory (cold boot) | **4 MB** | Laravel ≈ 22 MB | Symfony ≈ 14 MB |

### "Why we win" block — 5 bullets

1. **Zero-magic architecture** — Entities, DTOs, and enums are plain PHP objects. No framework metaclass layer, no container resolution on basic operations.
2. **PHP 8.4 property hooks** — Validation and formatting run as native engine hooks, not `__get()` / `__set()` magic method calls.
3. **No ORM hydration overhead** — Entities are POPOs (Plain Old PHP Objects). We don't wrap them in Doctrine or Eloquent proxies nor inspect them with reflection on every access.
4. **Attribute routing** — Compiled once at cache time. No regex matching loops at runtime like most router implementations.
5. **Lean PSR-15 pipeline** — ~12.5K req/s HTTP throughput vs Laravel's ~2.1K req/s in isolated benchmarks — roughly 6× the end-to-end throughput.

### "Where others win" block — a fair section

- **Laravel**: Superior ecosystem (Forge, Vapor, Nova), larger community package index.
- **Symfony**: Battle-tested in enterprise, better profiler/debug toolbar, older and more mature codebase.
- **Both**: More mature ORM with lazy loading, relationship graphs, and long-running query logging.

> *We're not claiming MonkeysLegion replaces them for every use case. We're claiming that when raw throughput, memory, and modern PHP idioms matter, you shouldn't have to pay for 22 MB of boot overhead.*

---

## 5. SECURITY COMPARISON SECTION

### Section title
**Secure by default — not "secure once you install five packages".**

### Intro paragraph
Most framework comparisons focus on speed. We think that's half the picture. Here is a direct, feature-by-feature comparison of what ships *in the box* versus what requires additional packages, configuration, or third-party bundles.

### Security feature matrix

| Security Feature | MonkeysLegion v2.0 | Laravel 11 | Symfony 7 |
|------------------|:------------------:|:----------:|:---------:|
| **Password hashing: Argon2id default** | ✅ Default | ⚠️ bcrypt default (Argon2id opt-in) | ⚠️ Configurable (bcrypt default) |
| **JWT authentication** | ✅ Built-in | ❌ Requires Sanctum/Passport/3rd party | ❌ Requires LexikJWTAuthBundle |
| **OAuth2 (Google, GitHub)** | ✅ Built-in | ❌ Requires Socialite | ❌ Requires KnpUOAuth2ClientBundle |
| **TOTP 2FA with QR generation** | ✅ Built-in | ❌ Requires Fortify + package | ❌ Requires scheb/2fa-bundle |
| **API keys + rotation** | ✅ Built-in | ⚠️ Partial via Sanctum | ❌ Not core |
| **RBAC + Policy system** | ✅ Built-in (attributes) | ✅ Policies (no RBAC tables) | ✅ Voters (custom RBAC required) |
| **Token blacklisting** | ✅ Built-in | ❌ 3rd party | ❌ 3rd party |
| **Rate limiting (per route, per IP)** | ✅ Middleware, default on | ⚠️ `throttle` middleware (opt-in) | ⚠️ Requires RateLimiter component wiring |
| **OWASP security headers** | ✅ Default middleware | ❌ Requires package (e.g. bepsvpt/secure-headers) | ⚠️ NelmioSecurityBundle |
| **CORS** | ✅ Default middleware | ⚠️ Fruitcake/Laravel CORS package | ⚠️ NelmioCorsBundle |
| **CSRF** | ✅ Default middleware | ✅ Default | ✅ Default |
| **Trusted proxy handling** | ✅ Default middleware | ✅ Built-in | ✅ Built-in |
| **Request ID correlation** | ✅ Default middleware | ❌ Manual | ❌ Manual |
| **Maintenance mode with IP/secret bypass** | ✅ Built-in (`ml down` / `ml up`) | ✅ Built-in | ❌ Not core |
| **Attribute-based validation (DTO binding)** | ✅ Built-in | ⚠️ FormRequests (runtime) | ✅ Validator component |
| **No magic methods in entities/DTOs** | ✅ PHP 8.4 property hooks | ❌ Eloquent `__get` / `__set` | ❌ Doctrine reflection proxies |
| **Compiled container (no runtime reflection)** | ✅ Production-compiled | ⚠️ Partial cache | ✅ Compiled |
| **Remember-me tokens with rotation** | ✅ Built-in | ⚠️ Built-in (basic) | ⚠️ Built-in (basic) |

### "Why this matters" callout

> Every `⚠️` or `❌` in Laravel or Symfony is a decision your team has to make: which package, which version, who maintains it, does it still work after the next major release, who reviewed its CVE history. MonkeysLegion removes those decisions from your backlog by shipping the primitives first-party, tested, and versioned alongside the framework core.

### Architectural security advantages — 4 bullets

1. **No runtime reflection for DI** → removes a class of container-injection attack vectors common in frameworks that resolve via `__construct` reflection on every request.
2. **No `__get` / `__set` magic** → eliminates the most common mass-assignment footguns that lead to unintended property overrides.
3. **Strict types enforced everywhere** → `declare(strict_types=1)` is standard across all 26 packages, not optional.
4. **Argon2id by default with tuned parameters** → memory cost 65536, time cost 4 — resistant to GPU and ASIC-based cracking attacks. Bcrypt (Laravel's default) is no longer considered best-in-class for new systems.

---

## 6. APEX SPOTLIGHT — "The AI orchestration engine that ships with the framework"

### Eyebrow
`First in PHP` · `monkeyslegion-apex@1.0.1`

### Section title
**The first PHP framework with an AI orchestration engine built in.**

### Lead paragraph
Not a wrapper. A **complete AI infrastructure layer** with multi-model routing, declarative pipelines, guardrails, and cost optimization. What takes five packages in Python and custom code in Node.js, MonkeysLegion Apex does in one — shipped as a first-party package, versioned with the framework, tested with 363 dedicated tests.

### "Everything in the box" — 8-tile grid

| | | | |
|---|---|---|---|
| 🔀 **Multi-provider routing**<br/>Anthropic · OpenAI · Google (AI Studio + Vertex) · Ollama — same API, zero code change | 🧩 **Declarative pipelines**<br/>`pipe()` · `when()` · `loop()` · `parallel()` · `transform()` — composable workflows with trace and timing | 👥 **Multi-agent crews**<br/>Sequential, Parallel, Hierarchical, Conversational — with lifecycle hooks and handoff tracking | 🛡️ **Guardrails engine**<br/>PII detection, prompt-injection defense, toxicity, regex, word count — with Block / Redact / Warn / Truncate / Replace / Retry actions |
| 📐 **Structured output**<br/>Schema-based extraction to type-safe PHP classes with retries and JSON Schema generation | 🎯 **Smart model router**<br/>Tiered routing with `CostOptimized` · `QualityFirst` · `LatencyFirst` · `RoundRobin` strategies | 💰 **Cost management**<br/>Per-request tracking, pricing registry for 20+ models, budget enforcement, scoped reports | 🔌 **MCP server + client**<br/>First-class Model Context Protocol support — serve tools and resources, or consume them |

### Secondary-tile row (4 more)

| | | | |
|---|---|---|---|
| 🔁 **Fallback chains**<br/>Ordered provider failover for high availability | 🌊 **Streaming (SSE)**<br/>Token streaming, pipe-to-stream, SSE endpoints | 🧠 **Six memory strategies**<br/>Conversation · Sliding window · Summary · Vector · Persistent · Per-agent | 🔧 **Tool calling**<br/>`#[Tool]` + `#[ToolParam]` attributes, multi-step autonomous loops, per-provider schema compilation |

### Proof paragraph
Apex ships with **363 tests across 705 assertions**, covering every layer from DTOs and schemas to guardrails, routing, pipelines, and multi-agent systems. It's already in use powering the AI features of MonkeysCMS, MonkeysWorks, and MonkeysCloud platform internals.

### "What used to take 5 packages" comparison table

This is the section's conversion hook. It's a direct, tool-by-tool mapping of what Apex delivers as one Composer package versus what you would need to assemble elsewhere.

| Capability | MonkeysLegion Apex | Python Stack | Node.js Stack | Laravel Stack |
|------------|:------------------:|---------------|----------------|----------------|
| Multi-provider LLM routing | ✅ Core | `litellm` | Manual wrapper | Manual / OpenAI SDK |
| Declarative pipelines | ✅ Core | `langchain` | `langchain-js` | ❌ Custom code |
| Structured output extraction | ✅ Core (Schema) | `instructor` / `pydantic-ai` | `zod` + custom | ❌ Custom code |
| Guardrails (PII, injection, toxicity) | ✅ Core (6 validators) | `guardrails-ai` | Manual | Manual |
| Multi-agent orchestration | ✅ Core (4 modes) | `crewai` / `autogen` | Manual | ❌ Custom code |
| Smart cost/complexity router | ✅ Core | Custom | Custom | Custom |
| Cost tracking + budgets | ✅ Core | `helicone` / custom | `helicone` / custom | Custom |
| MCP server + client | ✅ Core | `mcp-python-sdk` | `@modelcontextprotocol/sdk` | ❌ Not available |
| Vector memory + similarity search | ✅ Core | `chromadb` / `faiss` | `chroma` | ❌ Third-party |
| Tool calling via attributes | ✅ Core (`#[Tool]`) | Function decorators | Manual JSON schema | Manual |
| Testing with fake provider | ✅ Core (`FakeProvider`) | `pytest-mock` custom | Jest mocks custom | Manual |
| **Packages required** | **1** (`monkeyslegion-apex`) | 5–7 | 4–6 | 3–5 + custom code |

> **The point isn't that Python or Node can't do this — they obviously can. The point is that PHP applications have historically had to route AI features through HTTP API glue and a stack of dependencies. Apex makes PHP a first-class target for building AI-native products.**

### Representative code — Multi-agent crew

```php
use MonkeysLegion\Apex\Agent\{Agent, Crew};
use MonkeysLegion\Apex\Enum\AgentProcess;

$crew = new Crew('content-team', [
    new Agent('researcher', 'Research the topic with academic rigor.', $ai),
    new Agent('writer',     'Write engaging, clear content based on the research.', $ai),
    new Agent('editor',     'Edit for grammar, clarity, and tone. Output final version.', $ai),
], AgentProcess::Sequential);

$results = $crew->run('Create a technical blog post on PHP 8.4 property hooks');
// researcher output → writer → editor → final edited text
```

### Representative code — Smart router + fallback

```php
use MonkeysLegion\Apex\Router\{ModelRouter, FallbackChain};
use MonkeysLegion\Apex\Enum\RouterStrategy;

$router = ModelRouter::create()
    ->tier('fast',     ['claude-haiku-4', 'gpt-4.1-nano', 'gemini-2.5-flash'])
    ->tier('balanced', ['claude-sonnet-4', 'gpt-4.1', 'gemini-2.5-pro'])
    ->tier('power',    ['claude-opus-4', 'o3'])
    ->strategy(RouterStrategy::CostOptimized);

$chain = FallbackChain::create()
    ->add($anthropicProvider, 'claude-sonnet-4')
    ->add($openaiProvider,    'gpt-4.1')
    ->add($googleProvider,    'gemini-2.5-pro')
    ->add($ollamaProvider,    'llama3');
```

### Developer ergonomics callout

Apex integrates with the MonkeysLegion CLI out of the box:

```bash
php ml ai:chat                  # Interactive REPL chat
php ml ai:chat --model=gpt-4.1  # Switch model on the fly
php ml ai:costs                 # Cost report by model and period
php ml ai:costs --format=json   # Machine-readable export
```

### Requirements

- PHP 8.4+ · ext-curl · ext-json · ext-mbstring
- Optional: `monkeyslegion-cli` (for `ai:chat` / `ai:costs`), `monkeyslegion-telemetry` (for distributed tracing), `monkeyslegion-cache` (for semantic caching)

### CTA (section-level)

`Read the Apex docs →` · `View on GitHub →` https://github.com/MonkeysCloud/MonkeysLegion-Apex

---

## 7. FEATURES AT A GLANCE

### Section title
**Nineteen capabilities. One `composer install`.**

### Feature grid (3 × 7 tiles)

| | | |
|---|---|---|
| 🎯 **PSR Compliant**<br/>PSR-7, 11, 14, 15, 16, 17 | 🔐 **Auth Suite**<br/>JWT, OAuth2, 2FA, RBAC, API keys, remember-me | 🗄️ **Database Layer**<br/>QueryBuilder, migrations, entity scanner |
| 🎨 **Template Engine**<br/>Custom engine with caching and layouts | 🌐 **Attribute Routing**<br/>Auto-discovered, grouped, middleware-aware | ⚡ **Compiled DI**<br/>PSR-11 container with zero-overhead builds |
| 📝 **Validation**<br/>Attribute-based with automatic DTO binding | 🌍 **I18n**<br/>File + database loaders, pluralization | 📧 **Mail**<br/>SMTP and API delivery with DKIM |
| 📊 **Telemetry**<br/>OpenTelemetry metrics, tracing, structured logs | 🎪 **Events**<br/>PSR-14 dispatcher with auto-discovery | 💾 **Cache**<br/>Redis, file, in-memory (PSR-16) |
| 📨 **Queue System**<br/>Background workers with retry and timeout | 📁 **File Management**<br/>Unified storage, image processing, GC | 📚 **OpenAPI v3**<br/>Auto-generated from route attributes |
| 🤖 **Apex AI Orchestration**<br/>4 providers, pipelines, guardrails, crews | 🔄 **CLI Kernel**<br/>17+ `make:*` scaffolders | 🛡️ **Security Middleware**<br/>OWASP, CORS, rate limit, CSRF, maintenance |

---

## 8. THE 26 PACKAGES SECTION

### Section title
**The ecosystem.**

### Intro
MonkeysLegion is not a monolith. It's a meta-package that ties 26 independently-versioned Composer packages together. Install the skeleton to get all of them, or `composer require` only the ones you need.

### Full package table (3-column layout)

| Package | Version | Purpose |
|---------|:-------:|---------|
| `monkeyslegion-core` | ^2.0 | Core utilities, helpers, and base contracts shared by all packages. |
| `monkeyslegion-di` | ^2.0 | PSR-11 dependency injection container with compiled production cache. |
| `monkeyslegion-http` | ^2.0 | PSR-7, PSR-15, PSR-17 HTTP layer with OWASP security middleware. |
| `monkeyslegion-router` | ^2.1 | Attribute-based router with auto-discovery, constraints, and caching. |
| `monkeyslegion-database` | ^2.0 | Connection manager, PDO abstraction, transactions across MySQL/Postgres/SQLite. |
| `monkeyslegion-query` | ^2.0 | Fluent QueryBuilder with grammar compilation and micro-ORM features. |
| `monkeyslegion-entity` | ^2.0 | Entity scanner and metadata extraction via attributes. |
| `monkeyslegion-migration` | ^2.0 | Database migration generator and runner with rollback. |
| `monkeyslegion-auth` | ^2.1 | JWT, OAuth2, 2FA, session guards, Argon2id hashing, RBAC, policies. |
| `monkeyslegion-validation` | ^2.0 | Attribute-based validation with automatic DTO binding. |
| `monkeyslegion-cache` | ^2.0 | PSR-16 cache with Redis, file, Memcached, and in-memory stores. |
| `monkeyslegion-session` | ^2.0 | Session manager with CSRF middleware and flash data. |
| `monkeyslegion-template` | ^2.0 | MLView template engine with caching, layouts, and directives. |
| `monkeyslegion-events` | ^2.0 | PSR-14 event dispatcher with listener auto-discovery. |
| `monkeyslegion-logger` | ^2.0 | PSR-3 logger built on Monolog with rotating file handlers. |
| `monkeyslegion-queue` | ^1.2 | Queue factory, workers, and job dispatching with retry. |
| `monkeyslegion-schedule` | ^1.1 | Task scheduler with cron expression support. |
| `monkeyslegion-mail` | ^1.1 | SMTP and API-based email with DKIM signing. |
| `monkeyslegion-i18n` | ^2.1 | Internationalization with pluralization and locale management. |
| `monkeyslegion-telemetry` | ^2.0 | OpenTelemetry metrics, distributed tracing, request middleware. |
| `monkeyslegion-files` | ^2.0 | File storage (local/S3/GCS), image processing, garbage collection. |
| `monkeyslegion-mlc` | ^3.2 | MLC configuration parser with env interpolation. |
| `monkeyslegion-cli` | ^2.0 | CLI kernel with attribute-discovered commands and rich output. |
| `monkeyslegion-apex` | ^1.0 | AI orchestration engine. Multi-provider (Anthropic, OpenAI, Google, Ollama), pipelines, guardrails, crews, smart router, MCP. |
| `monkeyslegion-openapi` | ^1.0 | Auto-generated OpenAPI v3 documentation from route attributes. |
| `monkeyslegion-dev-server` | ^1.0 | Built-in development server with hot-reload support. |

---

## 9. CODE SHOWCASE SECTION

### Section title
**Show, don't tell.**

### Subhead
Four representative patterns that define the v2.0 developer experience. Every snippet below runs in a stock skeleton install with no additional setup.

### Tab 1 — Routing

```php
<?php
declare(strict_types=1);

namespace App\Controller;

use MonkeysLegion\Router\Attribute\{Route, Get, Post, Delete};
use Psr\Http\Message\ResponseInterface;

#[Route('/api/users', name: 'users')]
final class UserController
{
    #[Get('/', name: 'index', tags: ['Users'])]
    public function index(): ResponseInterface
    {
        return json_response(['users' => []]);
    }

    #[Post('/', name: 'create')]
    public function create(CreateUserRequest $request): ResponseInterface
    {
        // DTO is auto-validated via DtoBinder — invalid input returns 422
        return json_response(['created' => true], 201);
    }

    #[Delete('/{id:\d+}', name: 'delete')]
    public function delete(int $id): ResponseInterface
    {
        return json_response(null, 204);
    }
}
```

**No route file. No registration step.** Controllers under `app/Controller` are discovered automatically, compiled into the cached router map, and served with zero runtime regex matching.

### Tab 2 — Validation with DTO binding

```php
<?php
declare(strict_types=1);

namespace App\Dto;

use MonkeysLegion\Validation\Attributes as Assert;

final readonly class CreateUserRequest
{
    public function __construct(
        #[Assert\NotBlank, Assert\Email]
        public string $email,

        #[Assert\NotBlank, Assert\Length(min: 8, max: 64)]
        public string $password,

        #[Assert\Range(min: 0.01, max: 9999.99)]
        public float $credit,
    ) {}
}
```

**Type-safe, immutable, and validated** before it ever reaches your controller. Invalid payloads return a structured 422 response with field-level error messages — no manual error handling required.

### Tab 3 — Authentication

```php
use MonkeysLegion\Auth\Service\AuthService;

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
// $tokens['access_token'], $tokens['refresh_token']
```

**Full authentication lifecycle in six lines.** JWT access/refresh tokens, TOTP 2FA challenge flow, Argon2id verification, rate limiting, and token rotation — all handled by the `Auth` package.

### Tab 4 — AI orchestration with Apex

```php
use MonkeysLegion\Apex\AI;
use MonkeysLegion\Apex\Pipeline\Pipeline;
use MonkeysLegion\Apex\Pipeline\Step\{GenerateStep, SummarizeStep, TranslateStep, GuardStep};
use MonkeysLegion\Apex\Guard\Guard;
use MonkeysLegion\Apex\Guard\Validator\{PIIDetectorValidator, PromptInjectionValidator};

$ai = $container->get(AI::class);

// 1. Build a guard with PII redaction + prompt-injection defense
$guard = Guard::create()
    ->input(new PromptInjectionValidator())
    ->output(new PIIDetectorValidator());

// 2. Compose a declarative pipeline — research → summarize → translate → guard
$result = Pipeline::create('research-pipeline')
    ->pipe(new GuardStep($guard, isInput: true))
    ->pipe(new GenerateStep($ai, system: 'Research this topic rigorously.'))
    ->pipe(new SummarizeStep($ai, maxWords: 200))
    ->pipe(new TranslateStep($ai, 'Spanish'))
    ->pipe(new GuardStep($guard, isInput: false))
    ->run('Quantum computing in healthcare');

echo $result->output;         // Final redacted Spanish summary
echo $result->durationMs;     // Pipeline duration in ms
echo count($result->trace);   // Step-by-step execution trace
```

**Five steps. One fluent call.** What takes LangChain + Guardrails + a cost tracker + manual Python glue code, Apex expresses as a chained pipeline — with trace, timing, and guardrail enforcement built in.

---

## 10. DEVELOPER EXPERIENCE SECTION

### Section title
**Seventeen scaffolders. One CLI.**

### Intro
Every major framework object has a `make:*` command. No YAML, no templates, no copy-paste from docs.

### CLI command grid (3 columns, grouped)

**Scaffolding**
- `php ml make:controller User`
- `php ml make:entity User`
- `php ml make:middleware Auth`
- `php ml make:dto CreateUserRequest`
- `php ml make:event UserRegistered`
- `php ml make:listener SendWelcomeEmail`
- `php ml make:policy UserPolicy`
- `php ml make:job SendEmailJob`
- `php ml make:service PaymentService`
- `php ml make:command SyncData`
- `php ml make:test UserServiceTest`
- `php ml make:factory UserFactory`
- `php ml make:seeder UserSeeder`
- `php ml make:enum UserRole`
- `php ml make:observer UserObserver`
- `php ml make:resource UserResource`
- `php ml make:mail WelcomeMail`

**Database**
- `php ml make:migration`
- `php ml migrate`
- `php ml rollback`
- `php ml db:create`
- `php ml db:seed`

**Operations**
- `php ml config:cache` — Compile container for production
- `php ml config:clear` — Clear compiled container
- `php ml cache:clear` — Clear view cache
- `php ml route:list` — Display all registered routes
- `php ml queue:work` — Start queue worker
- `php ml schedule:run` — Run scheduled tasks
- `php ml openapi:export` — Export OpenAPI v3 spec
- `php ml tinker` — Interactive REPL
- `php ml down` / `php ml up` — Maintenance mode
- `php ml about` — Framework diagnostics

---

## 11. ARCHITECTURE DIAGRAM SECTION

### Section title
**How a request flows.**

### Diagram (reproduce as SVG or monospace block)

```
┌──────────────────────────────────────────────────────┐
│  ServerRequest::fromGlobals()                        │
├──────────────────────────────────────────────────────┤
│  CoreRequestHandler (PSR-15 Pipeline)                │
│    ├── SecurityHeadersMiddleware    (OWASP headers)  │
│    ├── TrustedProxyMiddleware                        │
│    ├── RequestIdMiddleware          (correlation)    │
│    ├── CorsMiddleware                                │
│    ├── RateLimitMiddleware                           │
│    ├── MaintenanceModeMiddleware                     │
│    ├── SessionMiddleware                             │
│    ├── VerifyCsrfToken                               │
│    ├── AuthenticationMiddleware                      │
│    └── Router → Controller → Response                │
├──────────────────────────────────────────────────────┤
│  SapiEmitter → Client                                │
└──────────────────────────────────────────────────────┘
```

### Boot-sequence companion block

```
public/index.php
  └── bootstrap/app.php
        └── Application::create(basePath)
              ├── ENV cascade: .env → .env.local → .env.{APP_ENV}
              ├── MLC config: config/*.mlc → compiled in production
              ├── Service Providers: 19 auto-discovered providers
              ├── SAPI detection: HTTP → Kernel | CLI → CliKernel
              └── run()
```

---

## 12. QUICK START SECTION

### Section title
**From zero to serving traffic in 90 seconds.**

### Three-step block

**Step 1 — Install**
```bash
composer create-project monkeyscloud/monkeyslegion-skeleton my-app
cd my-app
```

**Step 2 — Configure**
```bash
cp .env.example .env
php ml key:generate
```

**Step 3 — Serve**
```bash
composer serve
# → http://127.0.0.1:8000
```

### Requirements block

| Requirement | Version |
|-------------|---------|
| PHP | 8.4+ *(property hooks required)* |
| Composer | 2.x |
| Database | MySQL / MariaDB / PostgreSQL / SQLite |
| Redis *(optional)* | 6.x+ for caching, queues, rate limiting |

---

## 13. TESTING & PRODUCTION SECTION

### Section title
**Tested. Compiled. Ready.**

### Two-column layout

#### Column 1 — Test suite

Every package ships with its own PHPUnit 11 suite. The framework meta-test suite covers 182 tests across 440 assertions including:

- Compiled container cache (14 tests)
- Attribute discovery and provider scanning (11 tests)
- Maintenance mode middleware (7 tests)
- MLC config loading and provider definitions (94+ tests)
- Application boot lifecycle (13 tests)
- Exception handling (10 tests)
- Database user provider (15 tests)
- PHPStan Level 9 static analysis across all source files

```bash
php vendor/bin/phpunit
php vendor/bin/phpunit --testdox
php vendor/bin/phpstan analyse
```

#### Column 2 — Production checklist

```bash
# Compile DI container
php ml config:cache

# Recommended php.ini
opcache.enable=1
opcache.validate_timestamps=0
opcache.jit=1255
opcache.jit_buffer_size=128M
```

The `ConfigLoader` automatically compiles `.mlc` files to PHP arrays in `var/cache/config.compiled.php`. No parsing overhead on subsequent requests.

---

## 14. WHO IS IT FOR

### Section title
**Built for five kinds of teams.**

### Five-tile grid

| Team | Why MonkeysLegion |
|------|-------------------|
| **AI-native products** | Apex gives you multi-provider routing, pipelines, guardrails, agent crews, and cost management as one Composer package. Ship an AI product without assembling LangChain + Guardrails + Instructor + a cost tracker + a router — and without leaving PHP. |
| **API-first startups** | Attribute routing + DTO validation + OpenAPI auto-gen + JWT = full REST API in a day. Swap in Apex and the same API ships AI endpoints with streaming and cost control. |
| **High-throughput services** | 6× the HTTP req/s of Laravel at 18% the boot memory — measurable infrastructure savings at scale. Compiled DI and zero-magic architecture are built for services that serve millions of requests. |
| **Enterprise / compliance-heavy shops** | Argon2id, OWASP headers, token blacklisting, PII redaction guardrails, trusted-proxy middleware — all first-party, all tested, all versioned with the framework. No dependency archaeology during audits. |
| **Modern PHP shops** | PHP 8.4 property hooks, strict types across all 26 packages, attribute-first everything — no more legacy `__get()` magic, no YAML config graveyards, no wiring step between framework releases. |

### "If you're building one of these, Apex was built for you" callout

- **AI-powered SaaS with multi-tenant cost limits** → `BudgetManager::setBudget('tenant:123', $limit)` enforces spend per customer.
- **Content moderation pipelines** → `GuardPipeline` with `PIIDetectorValidator` + `ToxicityValidator` + `Block`/`Redact` actions.
- **Internal research assistants** → Multi-agent `Crew` with `researcher → writer → editor` and vector memory recall.
- **Multi-model cost optimization** → `ModelRouter::strategy(RouterStrategy::CostOptimized)` picks the cheapest model that can handle the complexity class of each prompt.
- **AI-augmented data extraction** → `Schema` + `$ai->extract(Invoice::class, $pdfText)` returns type-safe PHP objects.

---

## 15. ROADMAP SECTION

### Section title
**Where we're going.**

### Three-column timeline

#### ✅ Shipped in v2.0
- PHP 8.4 property hooks & attribute-first architecture
- 26-package ecosystem pinned to v2.0+
- MLC configuration with env cascading and production compilation
- Compiled DI container with atomic cache writes
- PSR-15 middleware pipeline with OWASP security headers
- Auth suite: JWT, OAuth2, 2FA, RBAC, remember-me, blacklisting
- Apex AI orchestration: multi-provider (Anthropic/OpenAI/Google/Ollama), pipelines, guardrails, crews, smart router, MCP
- OpenAPI v3 auto-generation
- 17 `make:*` scaffolders
- Database seeders and factories
- OpenTelemetry-compatible telemetry
- Event broadcasting interface (`ShouldBroadcast`)
- Maintenance mode with IP/secret bypass
- Tinker REPL
- 182 tests / 440 assertions

#### 🔜 Coming in v2.1
- Notifications package (email, SMS, Slack, push)
- WebSocket server with real-time broadcasting driver
- Per-route rate limiting via attributes
- API resource transformers and pagination helpers
- Model factories for testing (`Factory::define()`)

#### 🔮 v3.0 vision
- GraphQL support with attribute-based schema
- Admin panel generator (CRUD scaffolding)
- Fibers-based async HTTP client
- Native Swoole / FrankenPHP runtime support
- Plugin marketplace

---

## 16. COMMUNITY & CTA SECTION

### Section title
**Join the build.**

### Subhead
MonkeysLegion is MIT-licensed and actively developed in the open. We're looking for contributors, issue reporters, and teams shipping real projects with it.

### Five-link block

| Resource | URL |
|----------|-----|
| 📦 **Framework GitHub** | https://github.com/MonkeysCloud/MonkeysLegion |
| 🧱 **Skeleton** | https://github.com/MonkeysCloud/MonkeysLegion-Skeleton |
| 🤖 **Apex (AI Orchestration)** | https://github.com/MonkeysCloud/MonkeysLegion-Apex |
| 📚 **Documentation** | https://monkeyslegion.com/docs |
| 💬 **Discussions** | https://github.com/MonkeysCloud/MonkeysLegion/discussions |

### Final CTA block (large)

**Ready to ship?**  
```bash
composer create-project monkeyscloud/monkeyslegion-skeleton my-app
```

`Star on GitHub ⭐` · `Read the docs →` · `Open an issue`

---

## 17. FOOTER METADATA

- **License**: MIT
- **Created and maintained by**: MonkeysCloud
- **Framework version**: 2.0 · **Apex version**: 1.0.1
- **PHP requirement**: 8.4+
- **Current stats**: 26 packages · 545 total tests (182 framework + 363 Apex) · 1,145 assertions · PSR-7/11/14/15/16/17 compliant

---

## SEO METADATA BLOCK (for `<head>`)

**Page title**  
`MonkeysLegion v2.0 — PHP 8.4 Framework with Built-in AI Orchestration | MonkeysCloud`

**Meta description** (158 chars)  
`The first PHP 8.4 framework with a full AI orchestration engine built in. 26 packages, compiled DI, property hooks. Faster than Laravel and Symfony.`

**OpenGraph title**  
`MonkeysLegion v2.0 — PHP, reimagined for the AI era`

**OpenGraph description**  
`Multi-model routing, pipelines, guardrails, and agent crews in one Composer package. 26 PSR-compliant packages. 6× faster than Laravel at 18% the memory.`

**Twitter / X card**  
- **Card type:** `summary_large_image`  
- **Title:** `MonkeysLegion v2.0 is here`  
- **Description:** `The first PHP framework with AI orchestration built in. Apex ships with multi-provider routing, pipelines, guardrails, and crews — no wrappers required.`

**Suggested keywords**  
`PHP framework, PHP 8.4, property hooks, AI orchestration PHP, LangChain PHP, PHP AI framework, multi-model routing, AI guardrails, attribute routing, MonkeysLegion, Apex AI, Laravel alternative, Symfony alternative, PSR-15, compiled DI, Argon2id, JWT authentication, MCP server PHP`

**Schema.org SoftwareApplication JSON-LD** (drop into `<head>`)
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "MonkeysLegion",
  "softwareVersion": "2.0",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Linux, macOS, Windows (PHP 8.4+)",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "license": "https://opensource.org/licenses/MIT",
  "description": "Attribute-first PHP 8.4 framework with built-in AI orchestration, compiled DI, and 26 PSR-compliant packages.",
  "url": "https://monkeyslegion.com",
  "downloadUrl": "https://github.com/MonkeysCloud/MonkeysLegion-Skeleton"
}
```

---

## NOTES FOR THE IMPLEMENTATION

1. **Comparison tables** — These render best as responsive HTML tables (not images). On mobile they should collapse to stacked cards, one row = one card.
2. **Benchmarks** — Consider animating the ops/sec numbers with a count-up on scroll (`framer-motion` or `react-countup`) — they're your strongest hook.
3. **Apex spotlight (section 6)** — This is the page's *unique* differentiator. Consider a full-bleed dark background or gradient treatment to set it apart visually from the rest of the page. The "What used to take 5 packages" comparison table is the conversion element — give it breathing room.
4. **Code tabs (section 9)** — Use a tabbed component (Routing / Validation / Auth / Apex). Syntax highlighting via `shiki` or `prism-react-renderer`.
5. **Security matrix (section 5)** — Use green ✅, yellow ⚠️, red ❌ icons. This is the section that will convert security-conscious buyers.
6. **Package table (section 8)** — Consider making each row expandable to show a one-paragraph "read more" inline, with a link to the package's GitHub repo.
7. **Hero terminal** — If using a typing animation, cap it at 2.5 seconds total so it doesn't block scroll behavior.
8. **Above-the-fold weight** — Section 1 (hero) + Section 2 (What's New) should fit the viewport on desktop. Everything below is scroll-triggered content.
9. **Apex badge** — Consider surfacing an "AI Orchestration Engine Included" badge in the hero alongside the PSR / PHP 8.4 / 182 tests trust badges. This is the thing no competitor has.
