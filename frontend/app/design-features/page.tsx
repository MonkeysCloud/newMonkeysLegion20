'use client';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/Footer';
import PageHero from '../components/docs/PageHero';
import CodeBlock from '../components/docs/CodeBlock';
import { AnimatedSection, BenchmarkRow } from '../components/ui';
import Benchmarks from '../components/Benchmarks';
import { fallbackBenchmarks } from '@/lib/fallback-data';
import { designMenu } from '../config/designMenu';
import type { MenuItem } from '../components/layout/Navbar';

export function FeaturesContent({ menuItems }: { menuItems: MenuItem[] }) {
  return <FeaturesPageInner menuItems={menuItems} />;
}

const features = [
  {
    category: 'HTTP & Routing',
    color: '#8b5cf6',
    items: [
      { icon: '🧭', title: 'Attribute Routing', tag: 'monkeyslegion-router@2.1', desc: 'Define routes where your handlers live — as PHP 8 attributes. Auto-discovered, compiled once, zero runtime regex matching.', code: `#[Route('/api/users', name: 'users')]\nfinal class UserController\n{\n    #[Get('/{id:\\\\d+}', name: 'show', tags: ['Users'])]\n    public function show(int \$id): ResponseInterface { }\n}` },
      { icon: '🛡️', title: 'Security Middleware', tag: 'monkeyslegion-http@2.0', desc: 'OWASP headers, CORS, CSRF, rate limiting, trusted proxy — all PSR-15, all enabled by default. Not "secure once you install five packages."', code: `// Default stack: SecurityHeaders → TrustedProxy\n//   → RequestId → CORS → RateLimit\n//   → Session → CSRF → Auth → Router` },
    ],
  },
  {
    category: 'Auth & Security',
    color: '#10b981',
    items: [
      { icon: '🔐', title: 'Authentication Suite', tag: 'monkeyslegion-auth@2.1', desc: 'The entire authentication lifecycle. In one package. JWT, OAuth2, TOTP 2FA, API keys, RBAC, policies, Argon2id — not as separate add-ons.', code: `$result = $authService->login([\n    'email'    => 'user@example.com',\n    'password' => 'secret',\n]);\n\nif ($result->requires2FA) {\n    return json_response(['challenge' => $result->challengeToken]);\n}\n$tokens = $result->getTokens();` },
      { icon: '✅', title: 'Validation & DTOs', tag: 'monkeyslegion-validation@2.0', desc: 'Type-safe requests. Zero boilerplate. Annotate DTO properties with validation attributes. Invalid input never reaches your controller.', code: `final readonly class CreateUserRequest\n{\n    public function __construct(\n        #[Assert\\NotBlank, Assert\\Email]\n        public string $email,\n        #[Assert\\Length(min: 8, max: 64)]\n        public string $password,\n    ) {}\n}` },
    ],
  },
  {
    category: 'Data Layer',
    color: '#3b82f6',
    items: [
      { icon: '🗄️', title: 'Database & QueryBuilder', tag: 'monkeyslegion-database@2.0', desc: 'PDO, but modern. A connection manager, fluent builder, and entity scanner. No ORM magic, no hydration tax, no Doctrine proxies.', code: `$users = $qb->select(['id', 'name', 'email'])\n    ->from('users')\n    ->where('status', '=', 'active')\n    ->orderBy('created_at', 'DESC')\n    ->limit(10)\n    ->get();` },
      { icon: '📋', title: 'Compiled DI Container', tag: 'monkeyslegion-di@2.0', desc: 'Zero runtime reflection. In production. Autowiring in dev, compiled static PHP array in production. One command flips the switch.', code: `#[Provider(priority: 10, context: 'http')]\n#[BootAfter(DatabaseProvider::class)]\nfinal class PaymentProvider extends AbstractServiceProvider\n{\n    public function getDefinitions(): array { ... }\n}` },
    ],
  },
  {
    category: 'Templates & Assets',
    color: '#f59e0b',
    items: [
      { icon: '📝', title: 'Template Engine (MLView)', tag: 'monkeyslegion-template@2.0', desc: 'Familiar syntax. Compiled output. No surprises. Directives, layouts, inheritance — compiled to optimized PHP.', code: `@extends('layouts.app')\n\n@section('content')\n    <h1>{{ $user->name }}</h1>\n    @foreach($posts as $post)\n        <article>{{ $post->title }}</article>\n    @endforeach\n@endsection` },
      { icon: '📁', title: 'File Management', tag: 'monkeyslegion-files@2.0', desc: 'Uploads, storage, and image processing. Unified. Local, S3, GCS through one interface. Garbage collection included.', code: `$path = $files->store($upload, 'avatars', disk: 's3');\n$thumb = $images->process($path, [\n    'resize' => [150, 150],\n    'format' => 'webp',\n]);\nreturn $files->url($path);` },
    ],
  },
  {
    category: 'Background & Events',
    color: '#06b6d4',
    items: [
      { icon: '📡', title: 'Events (PSR-14)', tag: 'monkeyslegion-events@2.0', desc: 'Attribute-discovered listeners, priority ordering, wildcard subscriptions, queueable listeners.', code: `#[Listener(event: UserRegistered::class, priority: 10)]\nfinal class SendWelcomeEmail\n{\n    public function __invoke(UserRegistered $event): void\n    {\n        $this->mail->send($event->email, 'welcome');\n    }\n}` },
      { icon: '⚙️', title: 'Queue System', tag: 'monkeyslegion-queue@1.2', desc: 'Redis, database, or array drivers. Retry with exponential backoff, timeouts, batching, middleware.', code: `$this->queue->push(new SendEmailJob($user->id, 'welcome'));\n$this->queue->later(3600, new SendEmailJob($user->id, 'tips'));\n\n# php ml queue:work --tries=3 --timeout=60` },
    ],
  },
  {
    category: 'Operations & Observability',
    color: '#ec4899',
    items: [
      { icon: '📊', title: 'Telemetry & Observability', tag: 'monkeyslegion-telemetry@2.0', desc: 'Prometheus metrics, distributed tracing (Jaeger/Tempo), structured logs — all wired by default.', code: `$span = $this->tracer->startSpan('order.place');\n$this->metrics->counter('orders_placed_total')->inc();\n$this->metrics->histogram('order_amount_usd')->observe($total);` },
      { icon: '📖', title: 'OpenAPI v3', tag: 'monkeyslegion-openapi@1.0', desc: 'Routes + DTOs + return types = your API spec. No hand-maintained YAML, no doc rot.', code: `#[Get('/', name: 'users.index',\n    summary: 'List all users',\n    tags: ['Users', 'API'],\n)]\npublic function index(ListUsersQuery $query): UserCollection { }` },
      { icon: '⌨️', title: 'CLI Framework', tag: 'monkeyslegion-cli@2.0', desc: '17+ scaffolders, DB migrations, queue workers, schedule runner, interactive REPL — one binary.', code: `php ml make:controller User\nphp ml make:entity User\nphp ml migrate\nphp ml queue:work\nphp ml tinker` },
      { icon: '💬', title: 'I18n', tag: 'monkeyslegion-i18n@2.1', desc: 'File + database loaders, ICU-style plurals, nested keys, locale detection middleware.', code: `echo $t->trans('messages.greeting', ['name' => 'John']);\n// "Hello, John!"\necho $t->choice('messages.items', 5);\n// "5 items"` },
      { icon: '📧', title: 'Mail', tag: 'monkeyslegion-mail@1.1', desc: 'SMTP + API transports, DKIM signing, template-backed mailables, queueable delivery.', code: `$mailer->to($user->email)->send(new WelcomeMail($user));\n$mailer->to($user->email)->queue(new WelcomeMail($user));` },
      { icon: '💾', title: 'Cache (PSR-16)', tag: 'monkeyslegion-cache@2.0', desc: 'Redis, file, Memcached, array. Tagging, locking, stampede protection, multi-store.', code: `$result = $cache->remember('expensive', 3600,\n    fn() => computeExpensive());\n$cache->tags(['products'])->flush();` },
    ],
  },
];

function FeaturesPageInner({ menuItems }: { menuItems: MenuItem[] }) {
  return (
    <>
      <Navbar menuItems={menuItems} />
      <main>
        <PageHero
          eyebrow="monkeyslegion@2.0 · PHP 8.4+ · PSR-compliant"
          title="Every feature."
          titleGradient="Deep dive."
          subtitle="Nineteen capabilities. One composer install. Attribute routing, compiled DI, authentication, validation, caching, events, queues, mail, telemetry, OpenAPI, CLI — everything an app needs, nothing it doesn't."
        />

        {features.map((group, gi) => (
          <section key={gi} className="section" style={{ background: gi % 2 === 0 ? 'var(--color-bg)' : 'var(--color-bg-alt)' }}>
            <div className="container">
              <AnimatedSection>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                  <div style={{ width: 4, height: 28, borderRadius: 2, background: group.color }} />
                  <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0 }}>{group.category}</h2>
                </div>
              </AnimatedSection>
              <div style={{ display: 'grid', gridTemplateColumns: group.items.length > 2 ? 'repeat(auto-fit, minmax(340px, 1fr))' : 'repeat(2, 1fr)', gap: 'var(--space-5)' }}>
                {group.items.map((item, idx) => (
                  <AnimatedSection key={idx} delay={idx * 0.08}>
                    <div className="glass-card" style={{ padding: 'var(--space-6)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: 0 }}>{item.title}</h3>
                        </div>
                        <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-code)', color: 'var(--color-text-muted)', padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'var(--color-surface)' }}>{item.tag}</span>
                      </div>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', marginBottom: 'var(--space-4)', flex: '0 0 auto' }}>{item.desc}</p>
                      <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                        <CodeBlock language="php" code={item.code} />
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* ── Benchmarks ── */}
        <Benchmarks>
          {fallbackBenchmarks.map((bench) => (
            <BenchmarkRow
              key={bench.id}
              operation={bench.operation}
              mlValue={bench.mlValue}
              mlSuffix={bench.mlSuffix}
              vsLaravel={bench.vsLaravel}
              vsSymfony={bench.vsSymfony}
            />
          ))}
        </Benchmarks>

        {/* ── CTA ── */}
        <section className="section" style={{ textAlign: 'center', background: 'linear-gradient(180deg, var(--color-bg) 0%, hsl(250, 30%, 10%) 100%)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title">Ready to <span className="text-gradient">start?</span></h2>
              <p className="section-subtitle" style={{ margin: '0 auto var(--space-6)' }}>Every feature above ships as one <code style={{ background: 'var(--color-surface)', padding: '0.15em 0.4em', borderRadius: '4px' }}>composer create-project</code> command.</p>
              <div className="terminal" style={{ maxWidth: 550, margin: '0 auto var(--space-8)', textAlign: 'left' }}>
                <div className="terminal-header"><div className="terminal-dot terminal-dot-red" /><div className="terminal-dot terminal-dot-yellow" /><div className="terminal-dot terminal-dot-green" /></div>
                <div className="terminal-body"><div className="terminal-line"><span className="terminal-prompt">$</span><span className="terminal-command">composer create-project monkeyscloud/monkeyslegion-skeleton my-app</span></div></div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/" className="btn btn-primary btn-lg">Framework home →</a>
                <a href="/packages" className="btn btn-secondary btn-lg">Browse packages →</a>
                <a href="/apex" className="btn btn-secondary btn-lg">Apex AI →</a>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer menuItems={menuItems} />
    </>
  );
}

export default function DesignFeaturesPage() {
  return <FeaturesPageInner menuItems={designMenu} />;
}
