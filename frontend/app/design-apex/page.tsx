'use client';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/Footer';
import PageHero from '../components/docs/PageHero';
import ProseSection from '../components/docs/ProseSection';
import CodeBlock from '../components/docs/CodeBlock';
import FeatureList from '../components/docs/FeatureList';
import LayerDiagram from '../components/docs/LayerDiagram';
import MemoryTable from '../components/docs/MemoryTable';
import { AnimatedSection } from '../components/ui';
import { designMenu } from '../config/designMenu';
import type { MenuItem } from '../components/layout/Navbar';

export function ApexContent({ menuItems }: { menuItems: MenuItem[] }) {
  return <ApexPageInner menuItems={menuItems} />;
}



/* ─── capability cards data ─── */
const capabilities = [
  { icon: '🔌', title: 'Provider Abstraction', desc: 'Swap Claude, GPT, Gemini, or Ollama in one line. All implement ProviderInterface.' },
  { icon: '📐', title: 'Structured Output', desc: 'Extract type-safe PHP objects from LLM responses with Schema attributes.' },
  { icon: '🔧', title: 'Tool Calling', desc: 'Register PHP methods as LLM-callable tools with #[Tool] attributes.' },
  { icon: '🔗', title: 'Declarative Pipelines', desc: 'Compose AI workflows as chainable, traceable steps. 12 built-in types.' },
  { icon: '🤖', title: 'Multi-Agent Crews', desc: 'Orchestrate agents in Sequential, Parallel, Hierarchical, or Conversational mode.' },
  { icon: '🛡️', title: 'Guardrails Engine', desc: '6 composable validators with Block, Redact, Warn, Truncate, Replace, Retry.' },
  { icon: '🧭', title: 'Smart Model Router', desc: 'Auto-pick the best model per-request. 4 strategies + custom routing rules.' },
  { icon: '💰', title: 'Cost & Budget', desc: 'Track every request, aggregate by model, enforce per-scope spend limits.' },
  { icon: '🧠', title: '6 Memory Strategies', desc: 'Conversation, Sliding Window, Summary, Vector, Persistent, Agent Memory.' },
  { icon: '🔍', title: 'Embeddings & Search', desc: 'In-memory vector store with cosine, Euclidean, and dot-product similarity.' },
  { icon: '📡', title: 'MCP Protocol', desc: 'First-class MCP server + client. The only PHP framework with this today.' },
  { icon: '⚡', title: 'Middleware Stack', desc: 'Rate limit, retry, cache, guardrails, cost budget, telemetry, fallback.' },
  { icon: '📺', title: 'Streaming & SSE', desc: 'Real-time chunk iteration and Server-Sent Events for web UIs.' },
  { icon: '🧪', title: 'FakeProvider Testing', desc: 'Zero-API-call testing with queued responses, failures, and call inspection.' },
  { icon: '⌨️', title: 'CLI Integration', desc: 'Interactive REPL, model switching, cost reports — registered automatically.' },
];

function ApexPageInner({ menuItems }: { menuItems: MenuItem[] }) {
  return (
    <>
      <Navbar menuItems={menuItems} />
      <main>
        {/* ══════════════════════════ HERO ══════════════════════════ */}
        <PageHero
          eyebrow="First in PHP · monkeyslegion-apex@1.0.1 · 363 tests · 705 assertions"
          title="The first PHP framework with an AI orchestration engine"
          titleGradient="built in."
          subtitle="Not a wrapper. A complete AI infrastructure layer with multi-provider routing, declarative pipelines, guardrails, agent crews, and cost management. What takes five packages in Python and custom code in Node.js, MonkeysLegion Apex does in one."
        >
          <div className="terminal" style={{ maxWidth: 550, textAlign: 'left' }}>
            <div className="terminal-header"><div className="terminal-dot terminal-dot-red" /><div className="terminal-dot terminal-dot-yellow" /><div className="terminal-dot terminal-dot-green" /></div>
            <div className="terminal-body"><div className="terminal-line"><span className="terminal-prompt">$</span><span className="terminal-command">composer require monkeyscloud/monkeyslegion-apex</span></div></div>
          </div>
          <a href="https://github.com/MonkeysCloud/MonkeysLegion-Apex" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-lg">View on GitHub →</a>
        </PageHero>

        {/* ══════════════════════════ THE PROBLEM ══════════════════════════ */}
        <section className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container" style={{ maxWidth: 800, textAlign: 'center' }}>
            <AnimatedSection>
              <h2 className="section-title">The problem <span className="text-gradient">Apex solves.</span></h2>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>
                Building an AI product in PHP used to mean one of two things: call OpenAI&apos;s HTTP API directly and rebuild everything yourself — retries, token counting, cost tracking, PII filtering, fallback providers, tool calling schemas, streaming — or shell out to a Python microservice and pay the latency and operational tax forever.
              </p>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-4)', fontSize: 'var(--text-base)' }}>
                Apex removes that choice. It&apos;s the abstraction layer PHP has been missing — one that treats AI models as <strong style={{ color: 'var(--color-text)' }}>first-class infrastructure</strong>, not an HTTP endpoint.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* ══════════════════════════ LAYERS DIAGRAM ══════════════════════════ */}
        <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title" style={{ textAlign: 'center' }}>Architecture <span className="text-gradient">layers.</span></h2>
              <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto var(--space-8)' }}>Concentric rings — each layer is useful on its own, each can be swapped via interface.</p>
            </AnimatedSection>
            <LayerDiagram layers={[
              { label: 'Pipelines · Crews · MCP · HTTP Controllers', detail: '← Orchestration', color: '#8b5cf6' },
              { label: 'Router · Fallback · Middleware · Guardrails · Budget', detail: '← Infrastructure', color: '#3b82f6' },
              { label: 'Memory · Tools · Schemas · Streaming · Embeddings', detail: '← Primitives', color: '#06b6d4' },
              { label: 'Anthropic · OpenAI · Google · Vertex · Ollama · Fake', detail: '← Providers', color: '#10b981' },
            ]} />
          </div>
        </section>

        {/* ══════════════════════════ 15 CAPABILITIES GRID ══════════════════════════ */}
        <section className="section">
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title" style={{ textAlign: 'center' }}>Fifteen capabilities. <span className="text-gradient">One package.</span></h2>
              <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto var(--space-10)' }}>Everything an AI-native PHP application needs — first-party, tested together, versioned together.</p>
            </AnimatedSection>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
              {capabilities.map((cap, idx) => (
                <AnimatedSection key={idx} delay={idx * 0.03}>
                  <div className="glass-card" style={{ padding: 'var(--space-5) var(--space-6)', height: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <span style={{ fontSize: '1.5rem' }}>{cap.icon}</span>
                    <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{cap.title}</h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', margin: 0 }}>{cap.desc}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════ MID-PAGE CTA ══════════════════════════ */}
        <section style={{ padding: 'var(--space-12) 0', background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(6,182,212,0.08))', borderTop: '1px solid rgba(139,92,246,0.15)', borderBottom: '1px solid rgba(6,182,212,0.15)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <AnimatedSection>
              <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>Ready to see the code?</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', maxWidth: 500, margin: '0 auto var(--space-6)' }}>Dive into the detailed API for each of the fifteen capabilities below.</p>
              <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="#providers" className="btn btn-primary" style={{ fontSize: 'var(--text-sm)' }}>Explore API ↓</a>
                <a href="https://github.com/MonkeysCloud/MonkeysLegion-Apex" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: 'var(--text-sm)' }}>GitHub →</a>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ══════════════════════════ DEEP DIVE SECTIONS ══════════════════════════ */}

        {/* 1. Providers */}
        <section id="providers" className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-10)', alignItems: 'start' }}>
              <AnimatedSection>
                <div style={{ position: 'sticky', top: 'var(--space-10)' }}>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 600, fontFamily: 'var(--font-code)', background: 'rgba(16,185,129,0.15)', color: 'hsl(160, 80%, 55%)', border: '1px solid rgba(16,185,129,0.25)', marginBottom: 'var(--space-4)' }}>Provider Layer</span>
                  <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>1. Provider <span className="text-gradient">abstraction.</span></h2>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', marginBottom: 'var(--space-6)' }}>
                    Swap providers without changing a line of application code. All providers implement <code style={{ background: 'var(--color-surface)', padding: '0.15em 0.4em', borderRadius: '4px', fontSize: '0.85em' }}>ProviderInterface</code>.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                    {['Claude (Opus 4, Sonnet 4, Haiku 4)', 'GPT (4.1, 4.1-mini, 4.1-nano, o3, o4-mini)', 'Gemini (2.5 Pro, 2.5 Flash, AI Studio + Vertex)', 'Ollama (any local model)'].map((m, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                        <span style={{ color: 'var(--color-success)' }}>✓</span> {m}
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.1}>
                <CodeBlock language="php" header="Provider swap" code={`use MonkeysLegion\\Apex\\AI;
use MonkeysLegion\\Apex\\Provider\\Anthropic\\AnthropicProvider;
use MonkeysLegion\\Apex\\Provider\\OpenAI\\OpenAIProvider;
use MonkeysLegion\\Apex\\Provider\\Google\\GoogleProvider;

// Pick one — the rest of your code doesn't change
$provider = new AnthropicProvider(
    apiKey: $_ENV['ANTHROPIC_API_KEY'],
    model: 'claude-sonnet-4',
);

$ai = new AI($provider);
$response = $ai->generate('Explain PHP 8.4 property hooks');`} />
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* 2. Structured Output */}
        <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-10)', alignItems: 'start' }}>
              <AnimatedSection>
                <CodeBlock language="php" header="Schema extraction" code={`final class SentimentResult extends Schema
{
    public function __construct(
        #[Description('Detected sentiment')]
        #[Constrain(enum: ['positive', 'negative', 'neutral'])]
        public readonly string $sentiment,

        #[Description('Confidence 0–1')]
        #[Constrain(min: 0.0, max: 1.0)]
        public readonly float $confidence,

        #[Description('Key phrases')]
        #[ArrayOf('string')]
        public readonly array $phrases = [],
    ) {}
}

$result = $ai->extract(SentimentResult::class, 'Amazing!');
echo $result->sentiment;   // 'positive'`} />
              </AnimatedSection>
              <AnimatedSection delay={0.1}>
                <div style={{ position: 'sticky', top: 'var(--space-10)' }}>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 600, fontFamily: 'var(--font-code)', background: 'rgba(6,182,212,0.15)', color: 'hsl(190, 90%, 55%)', border: '1px solid rgba(6,182,212,0.25)', marginBottom: 'var(--space-4)' }}>Primitives Layer</span>
                  <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>2. Structured output <span className="text-gradient">with schemas.</span></h2>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', marginBottom: 'var(--space-6)' }}>
                    Extract type-safe PHP objects from LLM responses. No more <code style={{ background: 'var(--color-surface)', padding: '0.15em 0.4em', borderRadius: '4px', fontSize: '0.85em' }}>json_decode()</code> + manual validation. Nested schemas, automatic retry with validation feedback, and JSON Schema export are all built in.
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* 3. Tool Calling */}
        <section className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-10)', alignItems: 'start' }}>
              <AnimatedSection>
                <div style={{ position: 'sticky', top: 'var(--space-10)' }}>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 600, fontFamily: 'var(--font-code)', background: 'rgba(6,182,212,0.15)', color: 'hsl(190, 90%, 55%)', border: '1px solid rgba(6,182,212,0.25)', marginBottom: 'var(--space-4)' }}>Primitives Layer</span>
                  <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>3. Tool calling <span className="text-gradient">with attributes.</span></h2>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)' }}>
                    Register PHP methods as LLM-callable tools using <code style={{ background: 'var(--color-surface)', padding: '0.15em 0.4em', borderRadius: '4px', fontSize: '0.85em' }}>#[Tool]</code> and <code style={{ background: 'var(--color-surface)', padding: '0.15em 0.4em', borderRadius: '4px', fontSize: '0.85em' }}>#[ToolParam]</code> attributes. Apex compiles the schema per-provider automatically. For autonomous multi-step agents, use <code style={{ background: 'var(--color-surface)', padding: '0.15em 0.4em', borderRadius: '4px', fontSize: '0.85em' }}>MultiStepRunner</code>.
                  </p>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.1}>
                <CodeBlock language="php" header="Tool definition" code={`use MonkeysLegion\\Apex\\Tool\\Attribute\\{Tool, ToolParam};

final class WeatherTools
{
    #[Tool(name: 'get_weather', description: 'Get current weather')]
    public function getWeather(
        #[ToolParam(description: 'City name', required: true)]
        string $city,
        #[ToolParam(enum: ['celsius', 'fahrenheit'])]
        string $unit = 'celsius',
    ): array {
        return ['city' => $city, 'temp' => 22, 'unit' => $unit];
    }
}

$response = $ai->generate(
    "What's the weather in Tokyo?",
    options: ['tools' => [new WeatherTools()]],
);`} />
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* 4. Pipelines */}
        <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-10)', alignItems: 'start' }}>
              <AnimatedSection>
                <CodeBlock language="php" header="Pipeline composition" code={`use MonkeysLegion\\Apex\\Pipeline\\Pipeline;
use MonkeysLegion\\Apex\\Pipeline\\Step\\{
    GenerateStep, SummarizeStep, TranslateStep, GuardStep
};

$result = Pipeline::create('research-and-translate')
    ->pipe(new GuardStep($guard, isInput: true))
    ->pipe(new GenerateStep($ai, system: 'Research thoroughly'))
    ->pipe(new SummarizeStep($ai, maxWords: 200))
    ->pipe(new TranslateStep($ai, 'Spanish'))
    ->pipe(new GuardStep($guard, isInput: false))
    ->run('Quantum computing in healthcare');

echo $result->output;        // Final translated result
echo count($result->trace);  // Step-by-step trace`} />
              </AnimatedSection>
              <AnimatedSection delay={0.1}>
                <div style={{ position: 'sticky', top: 'var(--space-10)' }}>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 600, fontFamily: 'var(--font-code)', background: 'rgba(139,92,246,0.15)', color: 'hsl(250, 95%, 75%)', border: '1px solid rgba(139,92,246,0.25)', marginBottom: 'var(--space-4)' }}>Orchestration Layer</span>
                  <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>4. Declarative <span className="text-gradient">pipelines.</span></h2>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', marginBottom: 'var(--space-6)' }}>
                    Compose complex AI workflows as chainable, traceable pipelines. Twelve built-in step types with full control flow.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                    {['Generate', 'Extract', 'Classify', 'Summarize', 'Translate', 'Guard', 'Conditional', 'Loop', 'Parallel', 'Transform', 'HumanInLoop', 'Route'].map((step, i) => (
                      <div key={i} style={{ padding: '0.35rem 0.6rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-code)', color: 'var(--color-text-secondary)' }}>{step}</div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* 5. Crews */}
        <section className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-10)', alignItems: 'start' }}>
              <AnimatedSection>
                <div style={{ position: 'sticky', top: 'var(--space-10)' }}>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 600, fontFamily: 'var(--font-code)', background: 'rgba(139,92,246,0.15)', color: 'hsl(250, 95%, 75%)', border: '1px solid rgba(139,92,246,0.25)', marginBottom: 'var(--space-4)' }}>Orchestration Layer</span>
                  <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>5. Multi-agent <span className="text-gradient">crews.</span></h2>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', marginBottom: 'var(--space-6)' }}>
                    Orchestrate multiple AI agents in four coordination modes.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                    {[{ m: 'Sequential', c: '#10b981' }, { m: 'Parallel', c: '#3b82f6' }, { m: 'Hierarchical', c: '#f59e0b' }, { m: 'Conversational', c: '#8b5cf6' }].map(({ m, c }) => (
                      <span key={m} style={{ padding: '0.4rem 0.8rem', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 600, background: `${c}20`, color: c, border: `1px solid ${c}40` }}>{m}</span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.1}>
                <CodeBlock language="php" header="Agent crew" code={`use MonkeysLegion\\Apex\\Agent\\{Agent, Crew};
use MonkeysLegion\\Apex\\Enum\\AgentProcess;

$crew = new Crew('content-team', [
    new Agent('researcher', 'Research with academic rigor.', $ai),
    new Agent('writer', 'Write engaging, clear content.', $ai),
    new Agent('editor', 'Edit for grammar and tone.', $ai),
], AgentProcess::Sequential);

$results = $crew->run('Blog post on PHP 8.4 property hooks');
// researcher → writer → editor → final output`} />
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* 6. Guardrails */}
        <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-10)', alignItems: 'start' }}>
              <AnimatedSection>
                <CodeBlock language="php" header="Guard pipeline" code={`$pipeline = GuardPipeline::create()
    ->add(new PromptInjectionValidator(), GuardAction::Block)
    ->add(new PIIDetectorValidator(),     GuardAction::Redact)
    ->add(new ToxicityValidator(),        GuardAction::Warn)
    ->add(new WordCountValidator(max: 500), GuardAction::Truncate);

$result = $pipeline->run($text);`} />
              </AnimatedSection>
              <AnimatedSection delay={0.1}>
                <div style={{ position: 'sticky', top: 'var(--space-10)' }}>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 600, fontFamily: 'var(--font-code)', background: 'rgba(59,130,246,0.15)', color: 'hsl(215, 90%, 65%)', border: '1px solid rgba(59,130,246,0.25)', marginBottom: 'var(--space-4)' }}>Infrastructure Layer</span>
                  <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>6. Guardrails <span className="text-gradient">engine.</span></h2>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', marginBottom: 'var(--space-6)' }}>Protect inputs and outputs with six composable validators and six action modes.</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                    {['PII Detection', 'Prompt Injection', 'Toxicity Filter', 'Regex Rules', 'Word Count', 'Custom Callable'].map((v, i) => (
                      <div key={i} style={{ padding: '0.4rem 0.6rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', borderLeft: '2px solid hsl(0, 70%, 60%)' }}>{v}</div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ═══════════ SECOND CTA BREAK ═══════════ */}
        <section style={{ padding: 'var(--space-16) 0', background: 'var(--color-bg)', textAlign: 'center' }}>
          <div className="container">
            <AnimatedSection>
              <div className="glass-card" style={{ padding: 'var(--space-10) var(--space-8)', maxWidth: 700, margin: '0 auto' }}>
                <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>One package. <span className="text-gradient">Zero stitching.</span></h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>Every ⚠️ or ❌ in the alternatives column is a decision your team has to make. Apex removes those decisions from your backlog.</p>
                <div className="terminal" style={{ maxWidth: 500, margin: '0 auto', textAlign: 'left' }}>
                  <div className="terminal-header"><div className="terminal-dot terminal-dot-red" /><div className="terminal-dot terminal-dot-yellow" /><div className="terminal-dot terminal-dot-green" /></div>
                  <div className="terminal-body"><div className="terminal-line"><span className="terminal-prompt">$</span><span className="terminal-command">composer require monkeyscloud/monkeyslegion-apex</span></div></div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* 7. Router + 8. Cost — side by side cards */}
        <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title" style={{ textAlign: 'center' }}>Infrastructure <span className="text-gradient">built in.</span></h2>
            </AnimatedSection>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-8)' }}>
              <AnimatedSection delay={0.1}>
                <div className="glass-card" style={{ padding: 'var(--space-6)', height: '100%' }}>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>🧭 Smart Model Router</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>Auto-pick the best model per-request based on input complexity. Fall back to other providers when one fails.</p>
                  <CodeBlock language="php" code={`$router = ModelRouter::create()
    ->tier('fast',     ['claude-haiku-4', 'gpt-4.1-nano', 'gemini-2.5-flash'])
    ->tier('balanced', ['claude-sonnet-4', 'gpt-4.1', 'gemini-2.5-pro'])
    ->tier('power',    ['claude-opus-4', 'o3'])
    ->strategy(RouterStrategy::CostOptimized);`} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
                    {['CostOptimized', 'QualityFirst', 'LatencyFirst', 'RoundRobin'].map(s => (
                      <span key={s} style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-code)', background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>{s}</span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.2}>
                <div className="glass-card" style={{ padding: 'var(--space-6)', height: '100%' }}>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>💰 Cost & Budget</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>Track every request, aggregate by model or period, and enforce spend limits per scope.</p>
                  <CodeBlock language="php" code={`$tracker = new CostTracker(new PricingRegistry());
$ai = new AI($provider, costTracker: $tracker);

$budget = new BudgetManager();
$budget->setBudget('tenant:acme', 100.00);
$budget->charge('tenant:acme', 'claude-sonnet-4', $usage);

$report = CostReport::generate($tracker->all());`} />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* 9. Memory */}
        <section className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title" style={{ textAlign: 'center' }}>Six memory <span className="text-gradient">strategies.</span></h2>
              <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto var(--space-8)' }}>Each designed for a different context management pattern.</p>
            </AnimatedSection>
            <MemoryTable rows={[
              { strategy: 'ConversationMemory', useCase: 'Full transcript, unbounded' },
              { strategy: 'SlidingWindowMemory', useCase: 'Last N messages or tokens — whichever hits first' },
              { strategy: 'SummaryMemory', useCase: 'Auto-summarize older messages to stay under token limits' },
              { strategy: 'VectorMemory', useCase: 'Retrieve relevant past messages via embedding similarity' },
              { strategy: 'PersistentMemory', useCase: 'PSR-16-backed — survives across HTTP requests' },
              { strategy: 'AgentMemory', useCase: 'Isolated per-agent memory with system-prompt injection' },
            ]} />
          </div>
        </section>

        {/* 10. Embeddings + 11. MCP — side by side */}
        <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
              <AnimatedSection delay={0.1}>
                <div className="glass-card" style={{ padding: 'var(--space-6)', height: '100%' }}>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>🔍 Embeddings & Vector Search</h3>
                  <CodeBlock language="php" code={`$vectors = $ai->embed(['PHP 8.4 Guide', 'AI in PHP']);

$store = new InMemoryStore();
$store->add('doc-1', $vectors[0]->values, ['title' => 'PHP 8.4']);

$query = $ai->embed(['property hooks'])[0];
$results = $store->search($query->values, topK: 3);`} />
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-3)' }}>Cosine, Euclidean, and dot-product similarity. Plug any external vector DB via interface.</p>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.2}>
                <div className="glass-card" style={{ padding: 'var(--space-6)', height: '100%' }}>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>📡 MCP (Model Context Protocol)</h3>
                  <CodeBlock language="php" code={`// Expose tools to Claude Desktop, IDEs, etc.
$server = new MCPServer();
$server->tool('search_docs', 'Search docs', $schema,
    fn($args) => searchDocs($args['query']));

// Connect to external MCP servers
$client = new MCPClient('http://localhost:8080/mcp');
$tools  = $client->listTools();`} />
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-3)' }}>The only PHP framework with first-class MCP server and client.</p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* 12. Middleware */}
        <section className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-10)', alignItems: 'start' }}>
              <AnimatedSection>
                <div>
                  <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: 'var(--text-xs)', fontWeight: 600, fontFamily: 'var(--font-code)', background: 'rgba(59,130,246,0.15)', color: 'hsl(215, 90%, 65%)', border: '1px solid rgba(59,130,246,0.25)', marginBottom: 'var(--space-4)' }}>Infrastructure Layer</span>
                  <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-4)' }}>12. Middleware <span className="text-gradient">stack.</span></h2>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', marginBottom: 'var(--space-4)' }}>Onion-model pipeline for cross-cutting concerns.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {['RateLimit', 'Retry', 'Cache', 'InputGuard', 'OutputGuard', 'CostBudget', 'Telemetry', 'Fallback'].map((mw, i) => (
                      <div key={i} style={{ padding: '0.4rem 0.75rem', background: `rgba(59,130,246,${0.05 + i * 0.02})`, borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-code)', color: 'var(--color-text-secondary)', borderLeft: '3px solid rgba(59,130,246,0.5)' }}>{mw}Middleware</div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.1}>
                <CodeBlock language="php" header="Middleware pipeline" code={`$pipeline = (new MiddlewarePipeline())
    ->push(new RateLimitMiddleware(maxRequests: 60))
    ->push(new RetryMiddleware(maxRetries: 3))
    ->push(new CacheMiddleware($cache, ttl: 3600))
    ->push(new InputGuardMiddleware($guard))
    ->push(new OutputGuardMiddleware($guard))
    ->push(new CostBudgetMiddleware($tracker, maxBudget: 100.0))
    ->push(new TelemetryMiddleware($logger))
    ->push(new FallbackMiddleware($backupProvider));`} />
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* 13. Streaming + 14. Testing + 15. CLI — three cards */}
        <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title" style={{ textAlign: 'center' }}>And <span className="text-gradient">more.</span></h2>
            </AnimatedSection>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-5)', marginTop: 'var(--space-8)' }}>
              <AnimatedSection delay={0.1}>
                <div className="glass-card" style={{ padding: 'var(--space-6)', height: '100%' }}>
                  <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: 'var(--space-3)' }}>📺</span>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Streaming & SSE</h3>
                  <CodeBlock language="php" code={`$stream = $ai->stream('Write a story');
foreach ($stream as $chunk) {
    echo $chunk->delta;
    flush();
}

// SSE for web UIs
(new AIStreamResponse($stream))->send();`} />
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.2}>
                <div className="glass-card" style={{ padding: 'var(--space-6)', height: '100%' }}>
                  <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: 'var(--space-3)' }}>🧪</span>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>FakeProvider Testing</h3>
                  <CodeBlock language="php" code={`$fake = FakeProvider::create()
    ->respondWith('First response')
    ->failWith(new ProviderException('Rate limited'))
    ->respondWith('Retry success');

$ai = new AI($fake);
echo $fake->calledTimes(); // 1`} />
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.3}>
                <div className="glass-card" style={{ padding: 'var(--space-6)', height: '100%' }}>
                  <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: 'var(--space-3)' }}>⌨️</span>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>CLI Integration</h3>
                  <CodeBlock language="bash" code={`php ml ai:chat
php ml ai:chat --model=gpt-4.1
php ml ai:costs
php ml ai:costs --format=json`} />
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-3)' }}>Commands registered automatically when monkeyslegion-cli is installed.</p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* ═══════════ REQUIREMENTS ═══════════ */}
        <section className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container" style={{ maxWidth: 600, textAlign: 'center' }}>
            <AnimatedSection>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-5)' }}>Requirements</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', justifyContent: 'center' }}>
                {['PHP 8.4+', 'ext-curl', 'ext-json', 'ext-mbstring', 'psr/log ^3.0', 'psr/simple-cache ^3.0'].map(r => (
                  <span key={r} style={{ padding: '0.35rem 0.75rem', borderRadius: '999px', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-code)', background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>{r}</span>
                ))}
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>
                <strong>Optional:</strong> monkeyslegion-cli · monkeyslegion-telemetry · monkeyslegion-cache ^2.0 · ext-pcntl + ext-sockets
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* ═══════════ FINAL CTA ═══════════ */}
        <section className="section" style={{ textAlign: 'center', background: 'linear-gradient(180deg, var(--color-bg) 0%, hsl(250, 30%, 10%) 100%)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title">Start building with <span className="text-gradient">Apex.</span></h2>
              <p className="section-subtitle" style={{ margin: '0 auto var(--space-8)' }}>One package, one version, one test suite, one team behind it.</p>
              <div className="terminal" style={{ maxWidth: 550, margin: '0 auto var(--space-8)', textAlign: 'left' }}>
                <div className="terminal-header"><div className="terminal-dot terminal-dot-red" /><div className="terminal-dot terminal-dot-yellow" /><div className="terminal-dot terminal-dot-green" /></div>
                <div className="terminal-body"><div className="terminal-line"><span className="terminal-prompt">$</span><span className="terminal-command">composer require monkeyscloud/monkeyslegion-apex</span></div></div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="https://github.com/MonkeysCloud/MonkeysLegion-Apex" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">Star on GitHub ⭐</a>
                <a href="https://packagist.org/packages/monkeyscloud/monkeyslegion-apex" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-lg">Packagist →</a>
                <a href="/" className="btn btn-secondary btn-lg">Framework home →</a>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer menuItems={menuItems} />
    </>
  );
}

export default function DesignApexPage() {
  return <ApexPageInner menuItems={designMenu} />;
}
