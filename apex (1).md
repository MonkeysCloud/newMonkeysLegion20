# Apex — AI Orchestration Engine

> **Route.** Suggested path: `/apex`

---

## Hero

### Eyebrow
`First in PHP` · `monkeyslegion-apex@1.0.1` · `363 tests · 705 assertions`

### H1
**The first PHP framework with an AI orchestration engine built in.**

### Subhead
Not a wrapper. A complete AI infrastructure layer with multi-provider routing, declarative pipelines, guardrails, agent crews, and cost management. What takes five packages in Python and custom code in Node.js, MonkeysLegion Apex does in one.

### CTAs
`Install →` `composer require monkeyscloud/monkeyslegion-apex`  ·  `View on GitHub →` https://github.com/MonkeysCloud/MonkeysLegion-Apex

---

## The problem Apex solves

Building an AI product in PHP used to mean one of two things: call OpenAI's HTTP API directly and rebuild everything yourself — retries, token counting, cost tracking, PII filtering, fallback providers, tool calling schemas, streaming — or shell out to a Python microservice and pay the latency and operational tax forever.

Apex removes that choice. It's the abstraction layer PHP has been missing — one that treats AI models as first-class infrastructure, not an HTTP endpoint.

---

## The layers

Apex is built as concentric rings. Each layer is useful on its own, and each can be swapped via interface.

```
┌─────────────────────────────────────────────────────────────┐
│  Pipelines · Crews · MCP · HTTP Controllers                 │  ← Orchestration
├─────────────────────────────────────────────────────────────┤
│  Router · Fallback · Middleware · Guardrails · Budget       │  ← Infrastructure
├─────────────────────────────────────────────────────────────┤
│  Memory · Tools · Schemas · Streaming · Embeddings          │  ← Primitives
├─────────────────────────────────────────────────────────────┤
│  Anthropic · OpenAI · Google · Vertex · Ollama · Fake       │  ← Providers
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Provider abstraction

Swap providers without changing a line of application code. All providers implement `ProviderInterface`.

```php
use MonkeysLegion\Apex\AI;
use MonkeysLegion\Apex\Provider\Anthropic\AnthropicProvider;
use MonkeysLegion\Apex\Provider\OpenAI\OpenAIProvider;
use MonkeysLegion\Apex\Provider\Google\GoogleProvider;
use MonkeysLegion\Apex\Provider\Ollama\OllamaProvider;

// Pick one — the rest of your code doesn't change
$provider = new AnthropicProvider(apiKey: $_ENV['ANTHROPIC_API_KEY'], model: 'claude-sonnet-4');
// $provider = new OpenAIProvider(apiKey: $_ENV['OPENAI_API_KEY'], model: 'gpt-4.1');
// $provider = new GoogleProvider(apiKey: $_ENV['GOOGLE_API_KEY'], model: 'gemini-2.5-pro');
// $provider = new OllamaProvider(model: 'llama3', baseUrl: 'http://localhost:11434');

$ai = new AI($provider);
$response = $ai->generate('Explain PHP 8.4 property hooks');
```

**Supported models out of the box:** Claude (Opus 4, Sonnet 4, Haiku 4) · GPT (4.1, 4.1-mini, 4.1-nano, o3, o4-mini) · Gemini (2.5 Pro, 2.5 Flash, via AI Studio or Vertex) · Ollama (any local model).

---

## 2. Structured output with schemas

Extract type-safe PHP objects from LLM responses. No more `json_decode()` + manual validation.

```php
use MonkeysLegion\Apex\Schema\Schema;
use MonkeysLegion\Apex\Schema\Attribute\{Description, Constrain, ArrayOf};

final class SentimentResult extends Schema
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

$result = $ai->extract(SentimentResult::class, 'This product is amazing!');
echo $result->sentiment;   // 'positive'
echo $result->confidence;  // 0.95
```

Nested schemas, automatic retry with validation feedback, and JSON Schema export are all built in.

---

## 3. Tool calling with attributes

Register PHP methods as LLM-callable tools using `#[Tool]` and `#[ToolParam]` attributes. Apex compiles the schema per-provider automatically.

```php
use MonkeysLegion\Apex\Tool\Attribute\{Tool, ToolParam};

final class WeatherTools
{
    #[Tool(name: 'get_weather', description: 'Get current weather for a city')]
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
);
```

For autonomous multi-step agents, use `MultiStepRunner` — the AI decides which tools to call and when to stop.

---

## 4. Declarative pipelines

Compose complex AI workflows as chainable, traceable pipelines.

```php
use MonkeysLegion\Apex\Pipeline\Pipeline;
use MonkeysLegion\Apex\Pipeline\Step\{GenerateStep, SummarizeStep, TranslateStep, GuardStep};

$result = Pipeline::create('research-and-translate')
    ->pipe(new GuardStep($guard, isInput: true))
    ->pipe(new GenerateStep($ai, system: 'Research thoroughly'))
    ->pipe(new SummarizeStep($ai, maxWords: 200))
    ->pipe(new TranslateStep($ai, 'Spanish'))
    ->pipe(new GuardStep($guard, isInput: false))
    ->run('Quantum computing in healthcare');

echo $result->output;        // Final translated & guarded text
echo $result->durationMs;    // Total duration
echo count($result->trace);  // Step-by-step execution trace
```

**Twelve built-in step types:** `Generate`, `Extract`, `Classify`, `Summarize`, `Translate`, `Guard`, `Conditional`, `Loop`, `Parallel`, `Transform`, `HumanInLoop`, `Route`.

**Control flow primitives:** `when()` (conditional branching), `loop()` (retry until quality), `parallel()` (fan-out/fan-in), `transform()` (context mutation).

---

## 5. Multi-agent crews

Orchestrate multiple AI agents in four coordination modes: Sequential, Parallel, Hierarchical, Conversational.

```php
use MonkeysLegion\Apex\Agent\{Agent, Crew};
use MonkeysLegion\Apex\Enum\AgentProcess;

$crew = new Crew('content-team', [
    new Agent('researcher', 'Research the topic with academic rigor.', $ai),
    new Agent('writer',     'Write engaging, clear content based on the research.', $ai),
    new Agent('editor',     'Edit for grammar, clarity, and tone. Output final version.', $ai),
], AgentProcess::Sequential);

$results = $crew->run('Create a blog post on PHP 8.4 property hooks');
// researcher → writer → editor → final output
```

**`AgentBuilder` and `CrewBuilder` fluent APIs.** **`AgentRunner` with lifecycle hooks** (`onStep`, `onHandoff`). **`AgentMemory` for isolated per-agent conversation history** with automatic system prompt injection.

---

## 6. Guardrails engine

Protect inputs and outputs with six composable validators and six action modes.

```php
use MonkeysLegion\Apex\Guard\{Guard, GuardPipeline};
use MonkeysLegion\Apex\Guard\Validator\{
    PIIDetectorValidator,
    PromptInjectionValidator,
    ToxicityValidator,
    WordCountValidator,
};
use MonkeysLegion\Apex\Enum\GuardAction;

$pipeline = GuardPipeline::create()
    ->add(new PromptInjectionValidator(),   GuardAction::Block)     // throw on jailbreak
    ->add(new PIIDetectorValidator(),       GuardAction::Redact)    // mask emails/SSNs/cards
    ->add(new ToxicityValidator(),          GuardAction::Warn)      // log, allow through
    ->add(new WordCountValidator(max: 500), GuardAction::Truncate); // hard cap

$result = $pipeline->run($text);
```

**Validators:** PII detection (email, phone, SSN, credit card) · Prompt injection detection · Toxicity · Regex rules · Word count · Custom callable.

**Actions:** Block · Redact · Warn · Truncate · Replace · Retry.

---

## 7. Smart model router + fallback

Automatically pick the best model per-request based on input complexity. Fall back to other providers when one fails.

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

**Strategies:** `CostOptimized` · `QualityFirst` · `LatencyFirst` · `RoundRobin`.

**Custom routing rules via `RoutingRule` — route by keyword, message count, or any custom condition.**

---

## 8. Cost & budget management

Track every request, aggregate by model or period, and enforce spend limits per scope.

```php
use MonkeysLegion\Apex\Cost\{CostTracker, BudgetManager, CostReport};

$tracker = new CostTracker(new PricingRegistry());
$ai      = new AI($provider, costTracker: $tracker);

// Automatic cost recording on every request
$ai->generate('Hello'); // cost recorded

// Per-scope budgets (user, team, tenant, project)
$budget = new BudgetManager();
$budget->setBudget('tenant:acme', 100.00);
$budget->charge('tenant:acme', 'claude-sonnet-4', $response->usage);

// Reporting
$report = CostReport::generate($tracker->all());
echo "Total: \${$report->summary['total']}";
echo "Requests: {$report->summary['count']}";
foreach ($report->byModel as $model => $data) {
    echo "{$model}: {$data['count']} calls, \${$data['total']}\n";
}
```

**Built-in pricing for 20+ models** — Anthropic, OpenAI, Google, DeepSeek. Register custom models via `PricingRegistry::register()`.

---

## 9. Memory strategies

Six memory backends, each designed for a different context management pattern.

| Strategy | Use case |
|---|---|
| `ConversationMemory` | Full transcript, unbounded |
| `SlidingWindowMemory` | Last N messages or tokens — whichever hits first |
| `SummaryMemory` | Auto-summarize older messages to stay under token limits |
| `VectorMemory` | Retrieve the most relevant past messages via embedding similarity |
| `PersistentMemory` | PSR-16-backed — survives across HTTP requests |
| `AgentMemory` | Isolated per-agent memory with automatic system-prompt injection |

`ContextBuilder` assembles messages from multiple memory sources and arbitrary retrieved documents.

---

## 10. Embeddings & vector search

```php
use MonkeysLegion\Apex\Embedding\{InMemoryStore, Similarity};

$vectors = $ai->embed(['PHP 8.4 Guide', 'Laravel Tips', 'AI in PHP']);

$store = new InMemoryStore();
$store->add('doc-1', $vectors[0]->values, ['title' => 'PHP 8.4 Guide']);
$store->add('doc-2', $vectors[1]->values, ['title' => 'Laravel Tips']);

$query = $ai->embed(['property hooks in PHP'])[0];
$results = $store->search($query->values, topK: 3);
// [['id' => 'doc-1', 'score' => 0.94, 'metadata' => [...]], ...]
```

Cosine, Euclidean, and dot-product similarity functions are included. Plug in any external vector DB by implementing the store interface.

---

## 11. MCP (Model Context Protocol)

Apex ships first-class MCP server and client — the only PHP framework with this today.

```php
use MonkeysLegion\Apex\MCP\{MCPServer, MCPClient};

// Expose your tools to any MCP-aware client (Claude Desktop, IDEs, etc.)
$server = new MCPServer();
$server->tool('search_docs', 'Search internal docs', $schema, fn($args) => searchDocs($args['query']));
$server->resource('config', 'file:///config.json', json_encode($config), 'application/json');

// Or connect to external MCP servers as a client
$client = new MCPClient('http://localhost:8080/mcp');
$tools  = $client->listTools();
$result = $client->callTool('calculate', ['expression' => '2+2']);
```

---

## 12. Middleware stack

Onion-model pipeline for cross-cutting concerns. Eight built-in middlewares.

```php
use MonkeysLegion\Apex\Middleware\MiddlewarePipeline;
use MonkeysLegion\Apex\Middleware\Impl\{
    RateLimitMiddleware, RetryMiddleware, CacheMiddleware,
    InputGuardMiddleware, OutputGuardMiddleware,
    CostBudgetMiddleware, TelemetryMiddleware, FallbackMiddleware,
};

$pipeline = (new MiddlewarePipeline())
    ->push(new RateLimitMiddleware(maxRequests: 60, windowSeconds: 60))
    ->push(new RetryMiddleware(maxRetries: 3, baseDelay: 0.5))
    ->push(new CacheMiddleware($cache, ttl: 3600))
    ->push(new InputGuardMiddleware($guard))
    ->push(new OutputGuardMiddleware($guard))
    ->push(new CostBudgetMiddleware($tracker, maxBudget: 100.0))
    ->push(new TelemetryMiddleware($logger))
    ->push(new FallbackMiddleware($backupProvider));
```

---

## 13. Streaming & SSE

```php
// Iterate chunks
$stream = $ai->stream('Write a short story');
foreach ($stream as $chunk) {
    echo $chunk->delta;
    flush();
}

// Pipe to any writable stream
$ai->stream('Tell me about PHP')->pipe(STDOUT);

// SSE endpoint for web UIs
use MonkeysLegion\Apex\Http\AIStreamResponse;
(new AIStreamResponse($ai->stream($messages)))->send();
```

---

## 14. Testing with FakeProvider

Zero-API-call testing for unit and integration tests.

```php
use MonkeysLegion\Apex\Testing\FakeProvider;
use MonkeysLegion\Apex\Exception\ProviderException;

$fake = FakeProvider::create()
    ->respondWith('First response')
    ->failWith(new ProviderException('Rate limited', 'fake'))
    ->respondWith('Retry success');

$ai = new AI($fake);
$r1 = $ai->generate('Q1'); // 'First response'

// Call inspection
echo $fake->calledTimes();      // 1
$fake->lastCall();              // ['messages' => [...], 'options' => [...]]
```

---

## 15. CLI integration

When `monkeyslegion-cli` is installed, Apex registers commands automatically.

```bash
php ml ai:chat                    # Interactive REPL
php ml ai:chat --model=gpt-4.1    # Switch model per-session
php ml ai:costs                   # Cost report
php ml ai:costs --format=json     # Machine-readable export
```

---

## Requirements

- PHP 8.4+
- `ext-curl`, `ext-json`, `ext-mbstring`
- `psr/log` ^3.0, `psr/simple-cache` ^3.0

**Optional:** `monkeyslegion-cli` (CLI commands) · `monkeyslegion-telemetry` (tracing/metrics) · `monkeyslegion-cache` ^2.0 (semantic caching middleware) · `ext-pcntl` + `ext-sockets` (parallel tool execution).

---

## Why this matters

Every `⚠️` or `❌` in the alternatives column is a decision your team has to make: which package, which version, who maintains it, does it still work after the next major release, who reviewed its CVE history.

Apex removes those decisions from your backlog by shipping the primitives first-party — one package, one version, one test suite, one team behind it.

---

## Links

- **GitHub:** https://github.com/MonkeysCloud/MonkeysLegion-Apex
- **Packagist:** https://packagist.org/packages/monkeyscloud/monkeyslegion-apex
- **Framework home:** https://monkeyslegion.com
