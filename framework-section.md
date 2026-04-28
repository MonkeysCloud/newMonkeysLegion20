# Framework Section — MonkeysLegion v2

## The framework

MonkeysLegion v2 is an attribute-first PHP framework built around **PHP 8.4+**, **strict types**, and a **compiled dependency injection container**. The goal is simple: give teams a modern full-stack framework without the runtime weight, configuration sprawl, or package archaeology that often comes with older ecosystems.

At the GitHub repo level, the framework presents itself as a **high-performance, attribute-first PHP 8.4+ framework for modern web applications and APIs**, with v2 centered on **property hooks**, **attribute discovery**, **MLC configuration**, a **compiled DI container**, a **PSR-15 middleware pipeline**, and **26 integrated packages** under one ecosystem. The same repo also positions MonkeysLegion around PSR compliance, modular packaging, built-in auth, database tools, templates, telemetry, queues, files, OpenAPI, and security middleware. citeturn626723view0

The **MonkeysLegion-Skeleton** repository is the production-ready starter that wires those pieces into a runnable application. It exposes the typical project layout — `app/`, `config/`, `public/`, `resources/`, `storage/`, `tests/`, and `var/` — and highlights the first-run developer experience around `composer create-project`, `php ml key:generate`, and `composer serve`. It also documents the package ecosystem directly inside the starter, making the skeleton both the install path and the reference implementation for how the framework is meant to be used in practice. citeturn759354view1turn626723view1

## What defines MonkeysLegion v2

MonkeysLegion v2 is not positioned as a minimal micro-framework and not as a legacy enterprise stack either. It is better described as a **modern PHP application platform** with these core traits:

- **PHP 8.4 as the baseline** — property hooks and strict typing are first-class design inputs, not future compatibility goals. citeturn626723view0
- **Attribute-first architecture** — routes, validation, providers, listeners, and commands live next to the code they control instead of being spread across route files, YAML, or large registration layers. citeturn626723view0turn626723view1turn4file12
- **Compiled container and compiled config** — production builds reduce runtime reflection and parsing overhead. citeturn626723view0turn4file8
- **PSR-aligned internals** — PSR-7, 11, 14, 15, 16, and 17 are part of the public positioning of the framework, which makes replacement and modular adoption easier. citeturn626723view0turn4file0
- **Integrated security and auth** — JWT, OAuth2, TOTP 2FA, RBAC, rate limiting, security headers, CSRF, trusted proxies, and request IDs are part of the platform story, not scattered across unrelated packages. citeturn626723view0turn4file15turn4file13
- **AI-native direction** — Apex is not marketed as a thin wrapper but as a full orchestration layer with multi-provider routing, schemas, pipelines, crews, guardrails, budgeting, and MCP support. citeturn4file7turn4file17turn4file18

## Architecture at a glance

A MonkeysLegion application starts from the skeleton and is organized for convention-based discovery:

```text
my-app/
├─ app/
│  ├─ Controller/
│  ├─ Dto/
│  ├─ Entity/
│  └─ Auth/
├─ config/
│  ├─ app.php
│  ├─ database.php
│  └─ *.mlc
├─ public/
├─ resources/
│  └─ views/
├─ var/
│  ├─ cache/
│  └─ migrations/
├─ storage/
├─ tests/
└─ bin/
```

This structure reflects the framework’s main workflow: controllers and DTOs are discovered automatically, configuration lives in `.mlc` and application definitions, templates live under `resources/views`, migrations are generated into `var/migrations`, and runtime artifacts compile into cache directories for speed. citeturn626723view1

A typical HTTP request flows through a **PSR-15 middleware pipeline** before reaching the router and controller. The framework repo highlights a standard sequence that includes security headers, trusted proxy handling, request IDs, CORS, rate limiting, maintenance mode, sessions, CSRF, authentication, then routing and response emission. That is a strong signal that MonkeysLegion sees middleware as the main composition layer of the runtime, not just a bolt-on edge feature. citeturn759354view0

## The package ecosystem

MonkeysLegion is a **meta-package** plus a set of independently versioned subpackages. In the v2 launch material, the ecosystem is presented as **26 packages pinned to v2.0+**, with the framework package serving as the umbrella and the skeleton serving as the recommended starting point. citeturn626723view0turn4file2

### 1. Core runtime and configuration

These packages establish the base runtime and boot process:

- **`monkeyslegion`** — the meta-package that installs the full framework stack from one dependency. citeturn626723view1
- **`monkeyslegion-core`** — shared utilities, collections, string/array helpers, env readers, base exceptions, and low-level contracts used across the ecosystem. citeturn4file8
- **`monkeyslegion-di`** — the PSR-11 container, with autowiring in development and a compiled static container in production. Provider discovery and compile-time optimization are major selling points here. citeturn626723view0turn4file8
- **`monkeyslegion-mlc`** — the typed configuration system and parser behind `.mlc` files, with environment interpolation, nesting, arrays, and cache-friendly loading. citeturn626723view1
- **`monkeyslegion-cli`** — the command kernel that powers `php ml`, scaffolding, diagnostics, caching, and operational tooling. The v2 docs consistently position the CLI as part of the core developer experience. citeturn626723view0turn4file2
- **`monkeyslegion-dev-server`** — local development server support for first-run setup and local serving. citeturn626723view0

### 2. HTTP, routing, and presentation

These packages define the request/response layer and how applications expose web or API endpoints:

- **`monkeyslegion-http`** — the PSR-7, PSR-15, and PSR-17 HTTP layer, plus security-oriented middleware. The repo and package material tie this package closely to the OWASP headers, CORS, CSRF, request IDs, maintenance mode, and trusted proxy story. citeturn626723view0turn626723view1
- **`monkeyslegion-router`** — attribute-based routing with auto-discovery, route groups, named routes, constraints, middleware support, and route caching. The feature docs strongly emphasize “routing without route files” as part of the framework identity. citeturn626723view1turn4file12
- **`monkeyslegion-template`** — the MLView template engine, positioned as a lightweight compiled-to-PHP view layer with layouts, sections, stacks, directives, and cacheable output. citeturn626723view0turn4file9
- **`monkeyslegion-openapi`** — automatic OpenAPI v3 documentation generated from route metadata and attributes, which makes the API story much stronger out of the box. citeturn626723view0turn4file2

### 3. Data layer and persistence

The data stack is modular rather than monolithic. MonkeysLegion separates connections, SQL composition, entity metadata, and migrations into focused packages:

- **`monkeyslegion-database`** — PDO connection management, transactions, and multi-database support. citeturn626723view0
- **`monkeyslegion-query`** — the fluent query builder, responsible for driver-aware SQL composition and a lighter-weight data access layer than a traditional full ORM. citeturn626723view0turn4file13
- **`monkeyslegion-entity`** — attribute-defined entities with metadata extraction and POPO-style modeling rather than heavy proxy-based entities. citeturn626723view0turn4file13
- **`monkeyslegion-migration`** — schema diffing, generated migrations, reversible runs, and environment-aware execution. citeturn626723view0turn4file15

This separation matters because MonkeysLegion is not trying to be Doctrine. The package design suggests a deliberate preference for faster, simpler, more explicit persistence tooling rather than a giant ORM abstraction layer. The comparison material says that clearly: the QueryBuilder + Entity model is lighter and faster, but it is not a full Doctrine replacement for highly complex domain models. citeturn4file16

### 4. Authentication, validation, and security

This is one of the strongest parts of the package story because the framework treats security features as first-party infrastructure:

- **`monkeyslegion-auth`** — a broad auth subsystem that includes JWT access/refresh tokens, OAuth2 providers, TOTP 2FA, API keys, password reset, email verification, RBAC, policies, rate limiting, token blacklisting, remember-me, and Argon2id hashing. citeturn626723view0turn4file15
- **`monkeyslegion-validation`** — attribute-based validation with immutable DTO binding, constructor-time validation, and automatic 422 responses for invalid input. citeturn626723view0turn4file13
- **`monkeyslegion-session`** — session management with CSRF support and request-flow integration. citeturn626723view0

Taken together, these packages make MonkeysLegion look opinionated in a useful way: it wants the default application to be safer and more complete on day one than a “core only” framework install. That pattern also shows up in the comparisons, where MonkeysLegion is repeatedly framed as shipping JWT, OAuth2, 2FA, security headers, and OpenAPI first-party rather than via multiple add-ons. citeturn4file5turn4file16

### 5. Background work, messaging, and operations

MonkeysLegion includes first-party tooling for application operations beyond the request/response loop:

- **`monkeyslegion-events`** — PSR-14 event dispatcher with listener discovery. citeturn626723view0
- **`monkeyslegion-queue`** — background jobs, workers, retries, and delayed execution. citeturn626723view0
- **`monkeyslegion-schedule`** — fluent cron-style scheduling in PHP with overlap protection, server coordination, hooks, and `php ml schedule:run`. citeturn4file6
- **`monkeyslegion-mail`** — SMTP and API-based mail delivery with mailables, queue support, attachments, and DKIM signing. citeturn626723view0turn4file6
- **`monkeyslegion-logger`** — PSR-3 logging with rotating handlers. citeturn626723view0
- **`monkeyslegion-telemetry`** — observability package for metrics, distributed tracing, structured logs, and exporters such as Prometheus and OTLP. citeturn626723view0turn4file10

This operational layer is important because it shows MonkeysLegion is not only a code framework. It is trying to be production-credible with queues, scheduling, metrics, tracing, mail delivery, and correlated logging all under the same ecosystem. citeturn4file10

### 6. Caching, files, and internationalization

These packages cover common app infrastructure that teams otherwise often source from external libraries:

- **`monkeyslegion-cache`** — PSR-16 caching across Redis, file, Memcached, and array stores, with a unified API. citeturn626723view0turn4file9
- **`monkeyslegion-files`** — unified file storage, image processing, and garbage collection support across local and cloud backends. citeturn626723view0turn4file10
- **`monkeyslegion-i18n`** — file and database translation loaders, pluralization, locale management, scanning, export, and translator-oriented workflows. citeturn626723view0turn4file10

### 7. Apex: the AI orchestration layer

The standout subpackage in the ecosystem is **`monkeyslegion-apex`**. MonkeysLegion and its v2 launch material position Apex as the framework’s most distinctive differentiator: a first-party AI orchestration engine built into the ecosystem rather than a separate, thin integration story. citeturn626723view0turn4file7

Apex is described across the repo-backed materials as providing:

- **Multi-provider model abstraction** across Anthropic, OpenAI, Google, Vertex AI, and Ollama. citeturn4file18
- **Structured output schemas** for type-safe extraction into PHP objects. citeturn4file18
- **Tool calling with attributes** so PHP methods can become AI-callable tools. citeturn4file18
- **Declarative pipelines** for generation, summarization, translation, conditional branching, looping, parallelism, and transformation. citeturn4file17
- **Multi-agent crews** in sequential, parallel, hierarchical, and conversational modes. citeturn4file17
- **Guardrails** for prompt injection, PII, toxicity, truncation, and retry behavior. citeturn4file17
- **Routing, fallback, and budgeting** for choosing models intelligently and managing spend. citeturn4file7
- **MCP server + client support**, which gives the package a broader orchestration profile than a normal provider wrapper. citeturn4file0turn4file7

From a positioning standpoint, Apex is what makes MonkeysLegion feel like a 2026 framework instead of just a faster PHP stack. It is the clearest signal that the ecosystem is being built not only for CRUD apps and APIs, but also for AI-native products, internal assistants, orchestration workflows, and model-powered services. citeturn4file1turn4file7

## Why the package structure matters

Researching the framework repo, the skeleton repo, and the package materials together shows a clear philosophy:

1. **Use packages as product boundaries.** The ecosystem is not hiding everything inside one opaque core. Each capability has a package identity and its own scope.
2. **Keep the framework integrated at the experience layer.** Even though the packages are separate, the docs and skeleton treat them as one coherent platform.
3. **Lean into modern PHP instead of backward compatibility.** Property hooks, attributes, readonly DTOs, compiled DI, and strict types are not optional extras; they shape the framework’s personality. citeturn626723view0turn4file13
4. **Treat security and AI as first-class platform concerns.** Auth/security is deep and broad, while Apex gives the ecosystem a category-defining story that most PHP frameworks do not have. citeturn4file15turn4file7

## Recommended summary block for the site

If you want a compact framework section for a landing page or docs homepage, this version is the cleanest:

> **MonkeysLegion v2 is a modular PHP 8.4 framework built around attributes, strict types, compiled infrastructure, and first-party platform capabilities.** It combines a PSR-aligned HTTP stack, compiled DI, typed validation, auth and security primitives, database tooling, queues, telemetry, file management, OpenAPI generation, and a unique AI orchestration engine — all delivered through a 26-package ecosystem and a production-ready starter skeleton. citeturn626723view0turn626723view1turn4file2turn4file7

## Suggested section title options

- **Framework Overview**
- **Inside MonkeysLegion v2**
- **The Framework, Rebuilt for PHP 8.4**
- **A Modern PHP Platform, Not Just a Framework**
- **MonkeysLegion v2 and Its Package Ecosystem**
