/**
 * Fallback data for when Drupal is not available.
 * This allows the site to render in development mode without a running Drupal instance.
 * When Drupal is connected, this data is ignored — all content comes from the CMS.
 */

import type {
  FeatureTileData,
  BenchmarkData,
  SecurityFeatureData,
  PackageData,
  HeroData,
  PillarData,
  CodeTabData,
  CliGridData,
  RoadmapData,
  QuickStartStep,
  RequirementData,
  ArchitectureLine,
  CommunityLink,
  TestingData,
} from './types';

/* ============================================================================
   Hero
   ============================================================================ */

export const fallbackHero: HeroData = {
  title: 'The attribute-first PHP framework built for PHP 8.4.',
  subtitle: 'MonkeysLegion is a modular, PSR-compliant framework that leverages PHP 8.4 property hooks, a compiled DI container, and 26 focused packages to deliver the speed of a micro-framework with the batteries of a full-stack one — without runtime magic.',
  versionBadge: 'v2.0 — Available now',
  primaryCtaText: 'Get started →',
  primaryCtaUrl: '#quickstart',
  secondaryCtaText: 'View on GitHub',
  secondaryCtaUrl: 'https://github.com/MonkeysCloud/MonkeysLegion',
  badges: [
    'PHP 8.4+ native property hooks',
    'PSR-7 / 11 / 14 / 15 / 16 / 17',
    '182 tests / 440 assertions',
    'MIT licensed',
    '26 packages',
    '🤖 AI Orchestration Engine',
  ],
  terminalCommands: [
    { text: 'composer create-project monkeyscloud/monkeyslegion-skeleton my-app' },
    { text: 'cd my-app' },
    { text: 'php ml key:generate' },
    { text: 'composer serve' },
    { text: '# → http://127.0.0.1:8000', isComment: true },
  ],
};

/* ============================================================================
   What's New tiles
   ============================================================================ */

export const fallbackWhatsNewTiles: FeatureTileData[] = [
  { id: '1', icon: '⚡', title: 'PHP 8.4 Property Hooks', description: 'Native getters/setters as engine hooks — not reflection, not magic methods. Validation and formatting run at C speed.', sortOrder: 0, sectionGroup: 'whats_new' },
  { id: '2', icon: '🎯', title: 'Attribute-First Architecture', description: "Routes, validation rules, service providers, and CLI commands are discovered via PHP 8 attributes. No giant route files, no YAML config graveyards.", sortOrder: 1, sectionGroup: 'whats_new' },
  { id: '3', icon: '📦', title: 'Compiled DI Container', description: 'Production builds compile definitions to a PHP array written atomically to disk. Zero runtime reflection on the hot path.', sortOrder: 2, sectionGroup: 'whats_new' },
  { id: '4', icon: '⚙️', title: 'MLC Configuration', description: 'A clean, typed config format with environment interpolation, cascading (.env → .env.local → .env.{APP_ENV}), and compiled production caching.', sortOrder: 3, sectionGroup: 'whats_new' },
  { id: '5', icon: '🛡️', title: 'PSR-15 Security Pipeline', description: 'OWASP security headers, CORS, rate limiting, CSRF, trusted proxies, and request IDs — all as standard middleware, on by default.', sortOrder: 4, sectionGroup: 'whats_new' },
  { id: '6', icon: '🤖', title: 'Apex — Built-in AI Orchestration', description: 'Not a wrapper. A complete AI infrastructure layer with multi-provider routing, declarative pipelines, guardrails, agent crews, and cost management.', sortOrder: 5, sectionGroup: 'whats_new' },
];

/* ============================================================================
   Pillars
   ============================================================================ */

export const fallbackPillars: PillarData[] = [
  { icon: '⚡', title: 'Fast', subtitle: 'Measured in millions of ops per second.', description: "Zero-magic architecture means entities, DTOs, and enums are plain PHP objects. No Doctrine proxies, no Eloquent __get() chains, no framework metaclass layer." },
  { icon: '🔐', title: 'Secure', subtitle: 'Defaults that would take weeks to bolt on elsewhere.', description: 'Argon2id password hashing, built-in TOTP 2FA, JWT with rotation and blacklisting, rate limiting per route, OWASP headers middleware, CSRF, trusted-proxy awareness, and maintenance mode with IP/secret bypass.' },
  { icon: '🧩', title: 'Modular', subtitle: '26 packages. Use all of them, or use two.', description: "Every capability lives in its own Composer package with its own semver. The meta-package wires them together, but you can swap any of them for your own implementation via the PSR contract." },
];

/* ============================================================================
   Benchmarks
   ============================================================================ */

export const fallbackBenchmarks: BenchmarkData[] = [
  { id: '1', operation: 'Entity creation', mlValue: 6.3, mlSuffix: 'M', vsLaravel: '~140× faster', vsSymfony: '~114× faster', sortOrder: 0 },
  { id: '2', operation: 'DTO construction', mlValue: 10.9, mlSuffix: 'M', vsLaravel: '~60× faster', vsSymfony: '~54× faster', sortOrder: 1 },
  { id: '3', operation: 'Resource serialization', mlValue: 43.8, mlSuffix: 'K', vsLaravel: '~5.5× faster', vsSymfony: '~3.6× faster', sortOrder: 2 },
  { id: '4', operation: 'Enum operations', mlValue: 8.7, mlSuffix: 'M', vsLaravel: '~25× faster', vsSymfony: '~22× faster', sortOrder: 3 },
  { id: '5', operation: 'Property hooks (email)', mlValue: 11.1, mlSuffix: 'M', vsLaravel: 'N/A', vsSymfony: 'N/A', sortOrder: 4 },
  { id: '6', operation: 'Computed properties', mlValue: 41, mlSuffix: 'M', vsLaravel: 'N/A', vsSymfony: 'N/A', sortOrder: 5 },
  { id: '7', operation: 'Peak memory (cold boot)', mlValue: 4, mlSuffix: ' MB', vsLaravel: '≈ 22 MB', vsSymfony: '≈ 14 MB', sortOrder: 6 },
];

/* ============================================================================
   Security Features
   ============================================================================ */

export const fallbackSecurityFeatures: SecurityFeatureData[] = [
  { id: '1', feature: 'Password hashing: Argon2id default', mlStatus: 'yes', laravelStatus: 'partial', symfonyStatus: 'partial', laravelNote: 'bcrypt default', symfonyNote: 'Configurable', sortOrder: 0 },
  { id: '2', feature: 'JWT authentication', mlStatus: 'yes', laravelStatus: 'no', symfonyStatus: 'no', laravelNote: 'Requires Sanctum/Passport', symfonyNote: 'Requires LexikJWT', sortOrder: 1 },
  { id: '3', feature: 'OAuth2 (Google, GitHub)', mlStatus: 'yes', laravelStatus: 'no', symfonyStatus: 'no', laravelNote: 'Requires Socialite', symfonyNote: 'Requires KnpUOAuth2', sortOrder: 2 },
  { id: '4', feature: 'TOTP 2FA with QR generation', mlStatus: 'yes', laravelStatus: 'no', symfonyStatus: 'no', laravelNote: 'Requires Fortify + pkg', symfonyNote: 'Requires scheb/2fa', sortOrder: 3 },
  { id: '5', feature: 'API keys + rotation', mlStatus: 'yes', laravelStatus: 'partial', symfonyStatus: 'no', laravelNote: 'Partial via Sanctum', symfonyNote: 'Not core', sortOrder: 4 },
  { id: '6', feature: 'RBAC + Policy system', mlStatus: 'yes', laravelStatus: 'yes', symfonyStatus: 'yes', laravelNote: 'Policies', symfonyNote: 'Voters', sortOrder: 5 },
  { id: '7', feature: 'Token blacklisting', mlStatus: 'yes', laravelStatus: 'no', symfonyStatus: 'no', laravelNote: '3rd party', symfonyNote: '3rd party', sortOrder: 6 },
  { id: '8', feature: 'Rate limiting (per route)', mlStatus: 'yes', laravelStatus: 'partial', symfonyStatus: 'partial', laravelNote: 'throttle (opt-in)', symfonyNote: 'Manual wiring', sortOrder: 7 },
  { id: '9', feature: 'OWASP security headers', mlStatus: 'yes', laravelStatus: 'no', symfonyStatus: 'partial', laravelNote: 'Requires package', symfonyNote: 'NelmioSecurityBundle', sortOrder: 8 },
  { id: '10', feature: 'CORS', mlStatus: 'yes', laravelStatus: 'partial', symfonyStatus: 'partial', laravelNote: 'Fruitcake/CORS pkg', symfonyNote: 'NelmioCorsBundle', sortOrder: 9 },
  { id: '11', feature: 'CSRF', mlStatus: 'yes', laravelStatus: 'yes', symfonyStatus: 'yes', laravelNote: '', symfonyNote: '', sortOrder: 10 },
  { id: '12', feature: 'Trusted proxy handling', mlStatus: 'yes', laravelStatus: 'yes', symfonyStatus: 'yes', laravelNote: '', symfonyNote: '', sortOrder: 11 },
  { id: '13', feature: 'Request ID correlation', mlStatus: 'yes', laravelStatus: 'no', symfonyStatus: 'no', laravelNote: 'Manual', symfonyNote: 'Manual', sortOrder: 12 },
  { id: '14', feature: 'Maintenance mode w/ bypass', mlStatus: 'yes', laravelStatus: 'yes', symfonyStatus: 'no', laravelNote: '', symfonyNote: 'Not core', sortOrder: 13 },
  { id: '15', feature: 'Compiled container (no reflection)', mlStatus: 'yes', laravelStatus: 'partial', symfonyStatus: 'yes', laravelNote: 'Partial cache', symfonyNote: '', sortOrder: 14 },
  { id: '16', feature: 'Remember-me with rotation', mlStatus: 'yes', laravelStatus: 'partial', symfonyStatus: 'partial', laravelNote: 'Basic', symfonyNote: 'Basic', sortOrder: 15 },
];

/* ============================================================================
   Packages
   ============================================================================ */

export const fallbackPackages: PackageData[] = [
  { id: '1', name: 'monkeyslegion-core', version: '^2.0', purpose: 'Core utilities, helpers, and base contracts shared by all packages.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-Core', sortOrder: 0 },
  { id: '2', name: 'monkeyslegion-di', version: '^2.0', purpose: 'PSR-11 dependency injection container with compiled production cache.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-DI', sortOrder: 1 },
  { id: '3', name: 'monkeyslegion-http', version: '^2.0', purpose: 'PSR-7, PSR-15, PSR-17 HTTP layer with OWASP security middleware.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-HTTP', sortOrder: 2 },
  { id: '4', name: 'monkeyslegion-router', version: '^2.1', purpose: 'Attribute-based router with auto-discovery, constraints, and caching.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-Router', sortOrder: 3 },
  { id: '5', name: 'monkeyslegion-database', version: '^2.0', purpose: 'Connection manager, PDO abstraction, transactions across MySQL/Postgres/SQLite.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-Database', sortOrder: 4 },
  { id: '6', name: 'monkeyslegion-query', version: '^2.0', purpose: 'Fluent QueryBuilder with grammar compilation and micro-ORM features.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-Query', sortOrder: 5 },
  { id: '7', name: 'monkeyslegion-entity', version: '^2.0', purpose: 'Entity scanner and metadata extraction via attributes.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-Entity', sortOrder: 6 },
  { id: '8', name: 'monkeyslegion-migration', version: '^2.0', purpose: 'Database migration generator and runner with rollback.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-Migration', sortOrder: 7 },
  { id: '9', name: 'monkeyslegion-auth', version: '^2.1', purpose: 'JWT, OAuth2, 2FA, session guards, Argon2id hashing, RBAC, policies.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-Auth', sortOrder: 8 },
  { id: '10', name: 'monkeyslegion-validation', version: '^2.0', purpose: 'Attribute-based validation with automatic DTO binding.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-Validation', sortOrder: 9 },
  { id: '11', name: 'monkeyslegion-cache', version: '^2.0', purpose: 'PSR-16 cache with Redis, file, Memcached, and in-memory stores.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-Cache', sortOrder: 10 },
  { id: '12', name: 'monkeyslegion-session', version: '^2.0', purpose: 'Session manager with CSRF middleware and flash data.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-Session', sortOrder: 11 },
  { id: '13', name: 'monkeyslegion-template', version: '^2.0', purpose: 'MLView template engine with caching, layouts, and directives.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-Template', sortOrder: 12 },
  { id: '14', name: 'monkeyslegion-events', version: '^2.0', purpose: 'PSR-14 event dispatcher with listener auto-discovery.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-Events', sortOrder: 13 },
  { id: '15', name: 'monkeyslegion-logger', version: '^2.0', purpose: 'PSR-3 logger built on Monolog with rotating file handlers.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-Logger', sortOrder: 14 },
  { id: '16', name: 'monkeyslegion-queue', version: '^1.2', purpose: 'Queue factory, workers, and job dispatching with retry.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-Queue', sortOrder: 15 },
  { id: '17', name: 'monkeyslegion-schedule', version: '^1.1', purpose: 'Task scheduler with cron expression support.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-Schedule', sortOrder: 16 },
  { id: '18', name: 'monkeyslegion-mail', version: '^1.1', purpose: 'SMTP and API-based email with DKIM signing.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-Mail', sortOrder: 17 },
  { id: '19', name: 'monkeyslegion-i18n', version: '^2.1', purpose: 'Internationalization with pluralization and locale management.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-I18n', sortOrder: 18 },
  { id: '20', name: 'monkeyslegion-telemetry', version: '^2.0', purpose: 'OpenTelemetry metrics, distributed tracing, request middleware.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-Telemetry', sortOrder: 19 },
  { id: '21', name: 'monkeyslegion-files', version: '^2.0', purpose: 'File storage (local/S3/GCS), image processing, garbage collection.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-Files', sortOrder: 20 },
  { id: '22', name: 'monkeyslegion-mlc', version: '^3.2', purpose: 'MLC configuration parser with env interpolation.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-MLC', sortOrder: 21 },
  { id: '23', name: 'monkeyslegion-cli', version: '^2.0', purpose: 'CLI kernel with attribute-discovered commands and rich output.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-CLI', sortOrder: 22 },
  { id: '24', name: 'monkeyslegion-apex', version: '^1.0', purpose: 'AI orchestration engine. Multi-provider, pipelines, guardrails, crews, smart router, MCP.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-Apex', sortOrder: 23 },
  { id: '25', name: 'monkeyslegion-openapi', version: '^1.0', purpose: 'Auto-generated OpenAPI v3 documentation from route attributes.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-OpenAPI', sortOrder: 24 },
  { id: '26', name: 'monkeyslegion-dev-server', version: '^1.0', purpose: 'Built-in development server with hot-reload support.', githubUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-Dev-Server', sortOrder: 25 },
];

/* ============================================================================
   Features Grid tiles
   ============================================================================ */

export const fallbackFeaturesGrid: FeatureTileData[] = [
  { id: 'fg1', icon: '🎯', title: 'PSR Compliant', description: 'PSR-7, 11, 14, 15, 16, 17', sortOrder: 0, sectionGroup: 'features_grid' },
  { id: 'fg2', icon: '🔐', title: 'Auth Suite', description: 'JWT, OAuth2, 2FA, RBAC, API keys, remember-me', sortOrder: 1, sectionGroup: 'features_grid' },
  { id: 'fg3', icon: '🗄️', title: 'Database Layer', description: 'QueryBuilder, migrations, entity scanner', sortOrder: 2, sectionGroup: 'features_grid' },
  { id: 'fg4', icon: '🎨', title: 'Template Engine', description: 'Custom engine with caching and layouts', sortOrder: 3, sectionGroup: 'features_grid' },
  { id: 'fg5', icon: '🌐', title: 'Attribute Routing', description: 'Auto-discovered, grouped, middleware-aware', sortOrder: 4, sectionGroup: 'features_grid' },
  { id: 'fg6', icon: '⚡', title: 'Compiled DI', description: 'PSR-11 container with zero-overhead builds', sortOrder: 5, sectionGroup: 'features_grid' },
  { id: 'fg7', icon: '📝', title: 'Validation', description: 'Attribute-based with automatic DTO binding', sortOrder: 6, sectionGroup: 'features_grid' },
  { id: 'fg8', icon: '🌍', title: 'I18n', description: 'File + database loaders, pluralization', sortOrder: 7, sectionGroup: 'features_grid' },
  { id: 'fg9', icon: '📧', title: 'Mail', description: 'SMTP and API delivery with DKIM', sortOrder: 8, sectionGroup: 'features_grid' },
  { id: 'fg10', icon: '📊', title: 'Telemetry', description: 'OpenTelemetry metrics, tracing, structured logs', sortOrder: 9, sectionGroup: 'features_grid' },
  { id: 'fg11', icon: '🎪', title: 'Events', description: 'PSR-14 dispatcher with auto-discovery', sortOrder: 10, sectionGroup: 'features_grid' },
  { id: 'fg12', icon: '💾', title: 'Cache', description: 'Redis, file, in-memory (PSR-16)', sortOrder: 11, sectionGroup: 'features_grid' },
  { id: 'fg13', icon: '📨', title: 'Queue System', description: 'Background workers with retry and timeout', sortOrder: 12, sectionGroup: 'features_grid' },
  { id: 'fg14', icon: '📁', title: 'File Management', description: 'Unified storage, image processing, GC', sortOrder: 13, sectionGroup: 'features_grid' },
  { id: 'fg15', icon: '📚', title: 'OpenAPI v3', description: 'Auto-generated from route attributes', sortOrder: 14, sectionGroup: 'features_grid' },
  { id: 'fg16', icon: '🤖', title: 'Apex AI', description: '4 providers, pipelines, guardrails, crews', sortOrder: 15, sectionGroup: 'features_grid' },
  { id: 'fg17', icon: '🔄', title: 'CLI Kernel', description: "17+ make:* scaffolders", sortOrder: 16, sectionGroup: 'features_grid' },
  { id: 'fg18', icon: '🛡️', title: 'Security Middleware', description: 'OWASP, CORS, rate limit, CSRF, maintenance', sortOrder: 17, sectionGroup: 'features_grid' },
];

/* ============================================================================
   Apex tiles
   ============================================================================ */

export const fallbackApexMainTiles: FeatureTileData[] = [
  { id: 'am1', icon: '🔀', title: 'Multi-provider routing', description: 'Anthropic · OpenAI · Google (AI Studio + Vertex) · Ollama — same API, zero code change.', sortOrder: 0, sectionGroup: 'apex_main' },
  { id: 'am2', icon: '🧩', title: 'Declarative pipelines', description: 'pipe() · when() · loop() · parallel() · transform() — composable workflows with trace and timing.', sortOrder: 1, sectionGroup: 'apex_main' },
  { id: 'am3', icon: '👥', title: 'Multi-agent crews', description: 'Sequential, Parallel, Hierarchical, Conversational — with lifecycle hooks and handoff tracking.', sortOrder: 2, sectionGroup: 'apex_main' },
  { id: 'am4', icon: '🛡️', title: 'Guardrails engine', description: 'PII detection, prompt-injection defense, toxicity, regex, word count — with Block / Redact / Warn actions.', sortOrder: 3, sectionGroup: 'apex_main' },
  { id: 'am5', icon: '📐', title: 'Structured output', description: 'Schema-based extraction to type-safe PHP classes with retries and JSON Schema generation.', sortOrder: 4, sectionGroup: 'apex_main' },
  { id: 'am6', icon: '🎯', title: 'Smart model router', description: 'CostOptimized · QualityFirst · LatencyFirst · RoundRobin strategies for tiered routing.', sortOrder: 5, sectionGroup: 'apex_main' },
  { id: 'am7', icon: '💰', title: 'Cost management', description: 'Per-request tracking, pricing registry for 20+ models, budget enforcement, scoped reports.', sortOrder: 6, sectionGroup: 'apex_main' },
  { id: 'am8', icon: '🔌', title: 'MCP server + client', description: 'First-class Model Context Protocol support — serve tools and resources, or consume them.', sortOrder: 7, sectionGroup: 'apex_main' },
];

export const fallbackApexSecondaryTiles: FeatureTileData[] = [
  { id: 'as1', icon: '🔁', title: 'Fallback chains', description: 'Ordered provider failover for high availability.', sortOrder: 0, sectionGroup: 'apex_secondary' },
  { id: 'as2', icon: '🌊', title: 'Streaming (SSE)', description: 'Token streaming, pipe-to-stream, SSE endpoints.', sortOrder: 1, sectionGroup: 'apex_secondary' },
  { id: 'as3', icon: '🧠', title: 'Six memory strategies', description: 'Conversation · Sliding · Summary · Vector · Persistent · Per-agent.', sortOrder: 2, sectionGroup: 'apex_secondary' },
  { id: 'as4', icon: '🔧', title: 'Tool calling', description: '#[Tool] + #[ToolParam] attributes, multi-step autonomous loops.', sortOrder: 3, sectionGroup: 'apex_secondary' },
];

/* ============================================================================
   Audience tiles
   ============================================================================ */

export const fallbackAudienceTiles: FeatureTileData[] = [
  { id: 'au1', icon: '🤖', title: 'AI-native products', description: 'Apex gives you multi-provider routing, pipelines, guardrails, agent crews, and cost management as one Composer package.', sortOrder: 0, sectionGroup: 'audience' },
  { id: 'au2', icon: '🚀', title: 'API-first startups', description: 'Attribute routing + DTO validation + OpenAPI auto-gen + JWT = full REST API in a day.', sortOrder: 1, sectionGroup: 'audience' },
  { id: 'au3', icon: '⚡', title: 'High-throughput services', description: '6× the HTTP req/s of Laravel at 18% the boot memory — measurable infrastructure savings at scale.', sortOrder: 2, sectionGroup: 'audience' },
  { id: 'au4', icon: '🔒', title: 'Enterprise / compliance', description: 'Argon2id, OWASP headers, token blacklisting, PII redaction guardrails, trusted-proxy middleware — all first-party.', sortOrder: 3, sectionGroup: 'audience' },
  { id: 'au5', icon: '💎', title: 'Modern PHP shops', description: 'PHP 8.4 property hooks, strict types across all 26 packages, attribute-first everything — no more legacy __get() magic.', sortOrder: 4, sectionGroup: 'audience' },
];

/* ============================================================================
   Code Showcase
   ============================================================================ */

export const fallbackCodeTabs: CodeTabData[] = [
  {
    label: 'Routing', language: 'php',
    code: `<?php\ndeclare(strict_types=1);\n\nnamespace App\\\\Controller;\n\nuse MonkeysLegion\\\\Router\\\\Attribute\\\\{Route, Get, Post, Delete};\nuse Psr\\\\Http\\\\Message\\\\ResponseInterface;\n\n#[Route('/api/users', name: 'users')]\nfinal class UserController\n{\n    #[Get('/', name: 'index', tags: ['Users'])]\n    public function index(): ResponseInterface\n    {\n        return json_response(['users' => []]);\n    }\n}`,
    description: 'No route file. No registration step. Controllers under app/Controller are discovered automatically.',
  },
  {
    label: 'Validation', language: 'php',
    code: `<?php\ndeclare(strict_types=1);\n\nnamespace App\\\\Dto;\n\nuse MonkeysLegion\\\\Validation\\\\Attributes as Assert;\n\nfinal readonly class CreateUserRequest\n{\n    public function __construct(\n        #[Assert\\\\NotBlank, Assert\\\\Email]\n        public string $email,\n\n        #[Assert\\\\NotBlank, Assert\\\\Length(min: 8, max: 64)]\n        public string $password,\n    ) {}\n}`,
    description: 'Type-safe, immutable, and validated before it ever reaches your controller.',
  },
  {
    label: 'Auth', language: 'php',
    code: `use MonkeysLegion\\\\Auth\\\\Service\\\\AuthService;\n\n$result = $authService->login([\n    'email'    => 'user@example.com',\n    'password' => 'secret',\n]);\n\nif ($result->requires2FA) {\n    return response()->json([\n        'requires_2fa' => true,\n        'challenge'    => $result->challengeToken,\n    ]);\n}\n\n$tokens = $result->getTokens();`,
    description: 'Full authentication lifecycle in six lines.',
  },
  {
    label: 'Apex AI', language: 'php',
    code: `use MonkeysLegion\\\\Apex\\\\AI;\nuse MonkeysLegion\\\\Apex\\\\Pipeline\\\\Pipeline;\nuse MonkeysLegion\\\\Apex\\\\Pipeline\\\\Step\\\\{GenerateStep, SummarizeStep, TranslateStep, GuardStep};\n\n$result = Pipeline::create('research-pipeline')\n    ->pipe(new GuardStep($guard, isInput: true))\n    ->pipe(new GenerateStep($ai, system: 'Research this topic.'))\n    ->pipe(new SummarizeStep($ai, maxWords: 200))\n    ->pipe(new TranslateStep($ai, 'Spanish'))\n    ->pipe(new GuardStep($guard, isInput: false))\n    ->run('Quantum computing in healthcare');\n\necho $result->output;`,
    description: 'Five steps. One fluent call. Guardrails, timing, and trace built in.',
  },
];

/* ============================================================================
   CLI Grid
   ============================================================================ */

export const fallbackCliGrid: CliGridData = {
  scaffolding: ['php ml make:controller User', 'php ml make:entity User', 'php ml make:middleware Auth', 'php ml make:dto CreateUserRequest', 'php ml make:event UserRegistered', 'php ml make:listener SendWelcomeEmail', 'php ml make:policy UserPolicy', 'php ml make:job SendEmailJob', 'php ml make:service PaymentService', 'php ml make:command SyncData', 'php ml make:test UserServiceTest', 'php ml make:factory UserFactory', 'php ml make:seeder UserSeeder', 'php ml make:enum UserRole', 'php ml make:observer UserObserver', 'php ml make:resource UserResource', 'php ml make:mail WelcomeMail'],
  database: ['php ml make:migration', 'php ml migrate', 'php ml rollback', 'php ml db:create', 'php ml db:seed'],
  operations: ['php ml config:cache', 'php ml config:clear', 'php ml cache:clear', 'php ml route:list', 'php ml queue:work', 'php ml schedule:run', 'php ml openapi:export', 'php ml tinker', 'php ml down / php ml up', 'php ml about', 'php ml ai:chat', 'php ml ai:costs'],
};

/* ============================================================================
   Architecture Lines
   ============================================================================ */

export const fallbackPipelineSteps: ArchitectureLine[] = [
  { label: 'ServerRequest::fromGlobals()', indent: 0, color: 'var(--color-secondary)' },
  { label: 'CoreRequestHandler (PSR-15)', indent: 0, color: 'var(--color-primary-light)' },
  { label: '├── SecurityHeadersMiddleware', indent: 1, color: 'var(--color-text-secondary)' },
  { label: '├── TrustedProxyMiddleware', indent: 1, color: 'var(--color-text-secondary)' },
  { label: '├── RequestIdMiddleware', indent: 1, color: 'var(--color-text-secondary)' },
  { label: '├── CorsMiddleware', indent: 1, color: 'var(--color-text-secondary)' },
  { label: '├── RateLimitMiddleware', indent: 1, color: 'var(--color-text-secondary)' },
  { label: '├── MaintenanceModeMiddleware', indent: 1, color: 'var(--color-text-secondary)' },
  { label: '├── SessionMiddleware', indent: 1, color: 'var(--color-text-secondary)' },
  { label: '├── VerifyCsrfToken', indent: 1, color: 'var(--color-text-secondary)' },
  { label: '├── AuthenticationMiddleware', indent: 1, color: 'var(--color-text-secondary)' },
  { label: '└── Router → Controller → Response', indent: 1, color: 'var(--color-accent-orange)' },
  { label: 'SapiEmitter → Client', indent: 0, color: 'var(--color-secondary)' },
];

export const fallbackBootSteps: ArchitectureLine[] = [
  { label: 'public/index.php', indent: 0, color: 'var(--color-secondary)' },
  { label: '└── bootstrap/app.php', indent: 1, color: 'var(--color-text-secondary)' },
  { label: '└── Application::create(basePath)', indent: 2, color: 'var(--color-primary-light)' },
  { label: '├── ENV cascade: .env → .env.local → .env.{APP_ENV}', indent: 3, color: 'var(--color-text-secondary)' },
  { label: '├── MLC config: config/*.mlc → compiled in production', indent: 3, color: 'var(--color-text-secondary)' },
  { label: '├── Service Providers: 19 auto-discovered', indent: 3, color: 'var(--color-text-secondary)' },
  { label: '├── SAPI detection: HTTP → Kernel | CLI → CliKernel', indent: 3, color: 'var(--color-text-secondary)' },
  { label: '└── run()', indent: 3, color: 'var(--color-accent-orange)' },
];

/* ============================================================================
   Quick Start
   ============================================================================ */

export const fallbackQuickStartSteps: QuickStartStep[] = [
  { num: '01', title: 'Install', commands: ['composer create-project monkeyscloud/monkeyslegion-skeleton my-app', 'cd my-app'] },
  { num: '02', title: 'Configure', commands: ['cp .env.example .env', 'php ml key:generate'] },
  { num: '03', title: 'Serve', commands: ['composer serve', '# → http://127.0.0.1:8000'] },
];

export const fallbackRequirements: RequirementData[] = [
  { name: 'PHP', version: '8.4+ (property hooks required)' },
  { name: 'Composer', version: '2.x' },
  { name: 'Database', version: 'MySQL / MariaDB / PostgreSQL / SQLite' },
  { name: 'Redis (optional)', version: '6.x+ for caching, queues, rate limiting' },
];

/* ============================================================================
   Roadmap
   ============================================================================ */

export const fallbackRoadmap: RoadmapData = {
  shipped: ['PHP 8.4 property hooks & attribute-first architecture', '26-package ecosystem pinned to v2.0+', 'MLC configuration with env cascading and production compilation', 'Compiled DI container with atomic cache writes', 'PSR-15 middleware pipeline with OWASP security headers', 'Auth suite: JWT, OAuth2, 2FA, RBAC, remember-me, blacklisting', 'Apex AI orchestration: multi-provider, pipelines, guardrails, crews, MCP', 'OpenAPI v3 auto-generation', '17 make:* scaffolders', '182 tests / 440 assertions'],
  coming: ['Notifications package (email, SMS, Slack, push)', 'WebSocket server with real-time broadcasting', 'Per-route rate limiting via attributes', 'API resource transformers and pagination helpers', 'Model factories for testing'],
  vision: ['GraphQL support with attribute-based schema', 'Admin panel generator (CRUD scaffolding)', 'Fibers-based async HTTP client', 'Native Swoole / FrankenPHP runtime support', 'Plugin marketplace'],
};

/* ============================================================================
   Community
   ============================================================================ */

export const fallbackCommunityLinks: CommunityLink[] = [
  { icon: '📦', label: 'Framework GitHub', url: 'https://github.com/MonkeysCloud/MonkeysLegion' },
  { icon: '🧱', label: 'Skeleton', url: 'https://github.com/MonkeysCloud/MonkeysLegion-Skeleton' },
  { icon: '🤖', label: 'Apex (AI Orchestration)', url: 'https://github.com/MonkeysCloud/MonkeysLegion-Apex' },
  { icon: '📚', label: 'Documentation', url: 'https://monkeyslegion.com/docs' },
  { icon: '💬', label: 'Discussions', url: 'https://github.com/MonkeysCloud/MonkeysLegion/discussions' },
];

/* ============================================================================
   Testing & Production
   ============================================================================ */

export const fallbackTesting: TestingData = {
  testSuites: [
    'Compiled container cache (14 tests)',
    'Attribute discovery and provider scanning (11 tests)',
    'Maintenance mode middleware (7 tests)',
    'MLC config loading and provider definitions (94+ tests)',
    'Application boot lifecycle (13 tests)',
    'Exception handling (10 tests)',
    'Database user provider (15 tests)',
    'PHPStan Level 9 static analysis across all source files',
  ],
  productionChecklist: `# Compile DI container\nphp ml config:cache\n\n# Recommended php.ini\nopcache.enable=1\nopcache.validate_timestamps=0\nopcache.jit=1255\nopcache.jit_buffer_size=128M`,
};
