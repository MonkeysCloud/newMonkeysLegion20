# Comparison Pages

> **Route pattern.** Each `#` H1 section below is a separate page. Suggested paths: `/compare/laravel`, `/compare/symfony`.

---

# MonkeysLegion vs Laravel
`/compare/laravel`

### Eyebrow
`Honest comparison` · `Last updated April 2026`

### H1
**Laravel vs MonkeysLegion: when each one wins.**

### Lede
Laravel is the most successful PHP framework of the last decade — Taylor Otwell and the community have built something remarkable. We're not here to pretend otherwise. This page is a direct, fair comparison so you can decide which one fits your project.

---

## Where Laravel wins

Let's start here. Laravel has genuine advantages that MonkeysLegion won't match for years.

- **Ecosystem depth.** Forge, Vapor, Nova, Cashier, Sanctum, Scout, Socialite, Horizon, Telescope, Pulse — Laravel's first-party product suite is in a different weight class.
- **Community size.** More packages on Packagist, more StackOverflow answers, more YouTube tutorials, more jobs on LinkedIn, more paid courses. If you hit a weird problem at 3am, Laravel has more Google results.
- **Hiring pool.** Finding a mid-level Laravel developer is easier than finding a MonkeysLegion developer — and will be for a long time. This is a real consideration for teams.
- **Eloquent.** For all its `__get()` overhead, Eloquent is still one of the most expressive ORMs in any language. Lazy loading, eager loading, relationship graphs, soft deletes, observers — it's mature in a way MonkeysLegion's Query Builder isn't yet.
- **Mature ecosystem patterns.** Scheduler, queues, notifications, broadcasting, events — Laravel has been refining these for a decade. MonkeysLegion covers the same ground, but with fewer edge cases battle-tested in the wild.
- **"Everybody knows it."** If you're hiring a contractor for a two-week spike, you can say "it's Laravel" and they can start Monday.

**If these are your constraints, pick Laravel. Seriously.**

---

## Where MonkeysLegion wins

- **Raw performance.** MonkeysLegion delivers ~6.3M entity creations/sec vs Laravel's ~45K — roughly 140× faster on a micro-benchmark. Full-stack HTTP throughput lands at ~12.5K req/s vs Laravel's ~2.1K. Cold-boot memory is ~4MB vs ~22MB.
- **PHP 8.4 as the baseline.** Property hooks, asymmetric visibility, and strict types are used throughout the framework, not retrofitted. Laravel still supports PHP 8.2+ as its minimum and can't lean on 8.4 features until it drops older versions.
- **Attribute-first, not config-file-heavy.** Routes on methods, validation on DTO properties, providers with `#[Provider]`, CLI commands with `#[Command]`. No `routes/web.php`, no `FormRequest` classes, no service provider boilerplate.
- **Compiled DI container.** Production builds have zero runtime reflection. Laravel's container does partial caching; MonkeysLegion's compiler emits a static PHP array.
- **AI orchestration built in.** Apex ships multi-provider routing, pipelines, crews, guardrails, and MCP as one Composer package. Laravel requires Sanctum + a custom OpenAI wrapper + Guardrails-style packages + a cost tracker + routing logic — none of which is first-party.
- **OWASP security defaults.** Security headers, token blacklisting, Argon2id, trusted proxy middleware — all enabled by default. Laravel requires additional packages (`bepsvpt/secure-headers`) or manual configuration for several of these.

---

## Feature-by-feature

| Capability | MonkeysLegion | Laravel 11 |
|---|---|---|
| PHP minimum | 8.4 | 8.2 |
| Attribute routing | ✅ Core | ⚠️ via `spatie/laravel-route-attributes` |
| DTO validation via attributes | ✅ Core | ⚠️ FormRequests (runtime-based) |
| Compiled DI container | ✅ Production default | ⚠️ Partial cache |
| Argon2id password default | ✅ | ⚠️ bcrypt (Argon2id opt-in) |
| JWT authentication | ✅ Core | ❌ Sanctum / Passport required |
| TOTP 2FA | ✅ Core | ❌ Fortify + package required |
| OAuth2 (Google, GitHub) | ✅ Core | ❌ Socialite required |
| OWASP security headers middleware | ✅ Default | ❌ Third-party package |
| AI orchestration (multi-provider, pipelines, crews) | ✅ Apex (first-party) | ❌ Custom code |
| MCP server + client | ✅ Apex | ❌ Not available |
| OpenAPI v3 auto-generation | ✅ Core | ⚠️ via `knuckleswtf/scribe` or similar |
| CLI scaffolders | ✅ 17 `make:*` | ✅ 20+ `make:*` |
| Queue system | ✅ Core | ✅ Core |
| Scheduler | ✅ Core | ✅ Core |
| Eloquent-style ORM | ⚠️ QueryBuilder + Entity (simpler) | ✅ Eloquent (more features) |
| Ecosystem packages | ~50 (growing) | 10,000+ |
| Community size | Small, early | Massive, mature |

---

## Migrating from Laravel

Most Laravel concepts port cleanly:

| Laravel | MonkeysLegion |
|---|---|
| `routes/web.php` + controller methods | `#[Route]` attributes on controller methods |
| `FormRequest` classes | `readonly` DTOs with `#[Assert\*]` attributes |
| Eloquent models | Entity classes with `#[Entity]`, `#[Field]` attributes + QueryBuilder |
| Service providers | `AbstractServiceProvider` with `#[Provider]` attribute |
| `php artisan` | `php ml` |
| `php artisan make:*` | `php ml make:*` |
| Blade templates | MLView templates (same directive syntax) |
| Middleware | PSR-15 middleware (interface-compatible) |
| Events + listeners | PSR-14 events + attribute-discovered listeners |
| `config/*.php` files | `config/*.mlc` files |
| `.env` | `.env` + cascading variants (`.env.local`, `.env.{APP_ENV}`) |

---

## When to pick which

**Pick Laravel if:**
- You're hiring and need a large talent pool.
- Your product uses Forge, Vapor, Nova, or Cashier.
- You need Eloquent's relationship graph and observer patterns.
- Your team has deep Laravel muscle memory.
- You're building a CRUD SaaS and time-to-market trumps throughput.

**Pick MonkeysLegion if:**
- You're building AI-native products (Apex is the deciding factor).
- HTTP throughput or boot memory matters to your infrastructure budget.
- You want PHP 8.4 features as first-class citizens.
- You want security primitives (JWT, 2FA, OAuth2) in the framework, not as package archaeology.
- You're starting a new service and don't have sunk cost in Laravel patterns.

---

## A note from the maintainers

We built MonkeysLegion because we wanted a modern PHP framework without the accumulated weight of backward compatibility. Laravel is excellent. Symfony is excellent. We're not trying to replace either — we're offering a third option for teams that want attribute-first, PHP-8.4-native, and AI-ready defaults.

If this page convinced you Laravel is the right call, that's a win too. The PHP ecosystem is better when developers pick tools that fit their project instead of the loudest one.

---

# MonkeysLegion vs Symfony
`/compare/symfony`

### Eyebrow
`Honest comparison` · `Last updated April 2026`

### H1
**Symfony vs MonkeysLegion: enterprise maturity vs modern defaults.**

### Lede
Symfony is the PHP framework that enterprise bet on. The Doctrine ORM, the Console component, the Dependency Injection component — these have been refined over a decade and they show up in Drupal, Magento, and Shopware codebases everywhere. This page compares the two directly so you can make an informed choice.

---

## Where Symfony wins

- **Enterprise track record.** Symfony powers Drupal, eZ Platform, Shopware 6, Sylius, and countless in-house ERPs. If "will this still be maintained in 10 years" is a board-level question, Symfony is the safer answer.
- **Doctrine ORM.** More mature than Eloquent or MonkeysLegion Query. Entity manager, unit of work, change tracking, lazy loading, inheritance mapping, query language (DQL). If your domain model is complex, Doctrine has thought about your edge case.
- **Debug toolbar and Profiler.** Symfony's web profiler is unmatched. Request timing, query counts, mailer previews, cache hits — all visible in a sticky panel. MonkeysLegion's telemetry is production-focused; Symfony's profiler is dev-focused and better at that specific job.
- **Bundles ecosystem.** KnpMenu, KnpPaginator, NelmioCors, LexikJWT, VichUploader, SonataAdmin — a deep bench of enterprise-flavored bundles.
- **Stability commitment.** Symfony's LTS releases are supported for 3+ years with security patches. MonkeysLegion doesn't have that track record yet (we're new).
- **Standards conformance.** Symfony is often where PSRs get drafted. The framework is rigorously standards-driven — sometimes to a fault — but that fault is an asset in regulated industries.

**If enterprise stability, Doctrine, or bundle ecosystem are your constraints, pick Symfony.**

---

## Where MonkeysLegion wins

- **Lighter.** Cold-boot memory is ~4MB vs Symfony's ~14MB. Entity creation benchmarks come in ~114× faster on micro-benchmarks (MonkeysLegion entities are POPOs; Doctrine wraps them in reflection-backed proxies).
- **Attribute-native. Not "also supports attributes."** Symfony added attribute support on top of YAML/XML/annotation-based configuration. MonkeysLegion is attribute-first from the ground up — no YAML routing, no annotation fallback, no "three ways to define the same thing."
- **Less ceremony.** Fewer abstraction layers between you and the response. No `AbstractController` hierarchy, no `FormType` builders, no `Configuration` tree classes for config files.
- **PHP 8.4 baseline.** Property hooks used across the framework. Symfony supports PHP 8.2+ and can't commit to 8.4 features as baseline yet.
- **AI orchestration in the box.** Apex is first-party. Symfony requires a custom bundle + an OpenAI wrapper + LexikJWT-style patterns for multi-provider routing.
- **Simpler dev experience.** `composer create-project` to a running app in 90 seconds. Symfony's learning curve is steeper — the service container, bundles, event subscribers, and form types take weeks to fully internalize.

---

## Feature-by-feature

| Capability | MonkeysLegion | Symfony 7 |
|---|---|---|
| PHP minimum | 8.4 | 8.2 |
| Routing | Attribute-first | Attribute or YAML |
| DTO validation | `#[Assert\*]` with DTO binding | Validator component (mature) |
| DI container | Compiled, attribute-discovered | Compiled, YAML/XML/attribute-configured |
| Argon2id password default | ✅ | ⚠️ Configurable (bcrypt default) |
| JWT authentication | ✅ Core | ❌ Requires `LexikJWTAuthenticationBundle` |
| TOTP 2FA | ✅ Core | ❌ Requires `scheb/2fa-bundle` |
| OAuth2 | ✅ Core (Google, GitHub) | ❌ Requires `KnpUOAuth2ClientBundle` |
| OWASP security headers | ✅ Default middleware | ⚠️ `NelmioSecurityBundle` |
| CORS | ✅ Default middleware | ⚠️ `NelmioCorsBundle` |
| Rate limiting | ✅ Default middleware | ⚠️ Requires `RateLimiter` component wiring |
| AI orchestration | ✅ Apex (first-party) | ❌ Not available |
| MCP server + client | ✅ Apex | ❌ Not available |
| OpenAPI v3 | ✅ Core | ⚠️ `NelmioApiDocBundle` |
| Queue system | ✅ Core | ✅ Messenger component |
| Mature ORM | ⚠️ QueryBuilder + Entity | ✅ Doctrine |
| Debug toolbar | ❌ Telemetry-based | ✅ Web Profiler |
| Admin generator | ❌ Not available | ✅ EasyAdmin, Sonata |
| LTS policy | Not yet | ✅ 3-year LTS |

---

## Migrating from Symfony

| Symfony | MonkeysLegion |
|---|---|
| Controller + route attributes | Controller + `#[Route]` attributes (similar) |
| `FormType` classes | `readonly` DTOs with `#[Assert\*]` attributes |
| Doctrine entities | MonkeysLegion entities with `#[Entity]`, `#[Field]` (simpler metadata) |
| `services.yaml` | `#[Provider]`-discovered service providers |
| `config/packages/*.yaml` | `config/*.mlc` files |
| `bin/console` | `php ml` |
| Twig templates | MLView templates (different syntax, `{{ }}` and `@` directives) |
| Event subscribers | `#[Listener]`-discovered PSR-14 listeners |
| Messenger queues | `monkeyslegion-queue` (similar patterns) |
| Validator component | `monkeyslegion-validation` (attribute-based, constructor-time) |
| Security bundle | `monkeyslegion-auth` (JWT + OAuth2 + 2FA included) |

**The Doctrine gap is real.** If your project depends on Doctrine's unit of work, inheritance mapping, or DQL, MonkeysLegion isn't a drop-in. QueryBuilder is lighter and faster but has a smaller feature set.

---

## When to pick which

**Pick Symfony if:**
- You're building enterprise software that needs to run unchanged for a decade.
- Your domain model benefits from Doctrine's full ORM feature set.
- You need the web profiler for complex debugging.
- You're extending Drupal, Shopware, or another Symfony-based platform.
- Your team includes developers who've shipped Symfony for years.

**Pick MonkeysLegion if:**
- You want PHP 8.4 property hooks and strict types as defaults.
- You're building AI-native products (Apex is the deciding factor).
- Boot time and memory matter to your deployment cost.
- You want to skip the multi-year Symfony learning curve for a new team.
- You want security primitives (JWT, 2FA, OAuth2) first-party instead of via bundles.

---

## A note on philosophy

Symfony's design philosophy is **explicit, composable, standards-driven**. Every component works on its own. Configuration is external (YAML/XML/attributes). The DI container is the hub.

MonkeysLegion's design philosophy is **attribute-first, convention over configuration, PHP-native**. Configuration lives next to the code it governs. Providers auto-discover. The framework trusts PHP 8.4's type system instead of layering its own abstractions on top.

Both philosophies are defensible. Which one fits your team is the real question.

---

## Still unsure?

Our rule of thumb: if you're starting a new project in 2026 and your priorities are **modern PHP, AI integration, small deployment footprint, and fast iteration**, try MonkeysLegion. If your priorities are **enterprise maturity, Doctrine, and a battle-tested bundle ecosystem**, stick with Symfony. You can't go wrong either way — they're both excellent.
