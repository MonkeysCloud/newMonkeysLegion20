import Navbar from '../components/layout/Navbar';
import Hero from '../components/Hero';
import WhatsNew from '../components/WhatsNew';
import { FeatureTile, PillarCard, BenchmarkRow, SecurityRow } from '../components/ui';
import Pillars from '../components/Pillars';
import Benchmarks from '../components/Benchmarks';
import SecurityMatrix from '../components/SecurityMatrix';
import ApexSpotlight from '../components/ApexSpotlight';
import FeaturesGrid from '../components/FeaturesGrid';
import PackagesTable from '../components/PackagesTable';
import CodeShowcase from '../components/CodeShowcase';
import DeveloperExperience, { CliCommandItem } from '../components/DeveloperExperience';
import ArchitectureDiagram from '../components/ArchitectureDiagram';
import QuickStart, { QuickStartStepItem, RequirementRowItem } from '../components/QuickStart';
import TestingProduction, { TestSuiteItem, ProductionCheckItem } from '../components/TestingProduction';
import WhoIsItFor from '../components/WhoIsItFor';
import Roadmap, { RoadmapItem } from '../components/Roadmap';
import Community, { CommunityLinkItem, CtaButtonItem } from '../components/Community';
import Footer from '../components/Footer';

// Use fallback data solely for this static design showcase
import {
  fallbackHero, fallbackWhatsNewTiles, fallbackPillars, fallbackBenchmarks,
  fallbackSecurityFeatures, fallbackPackages, fallbackFeaturesGrid,
  fallbackApexMainTiles, fallbackApexSecondaryTiles, fallbackAudienceTiles,
  fallbackCodeTabs, fallbackCliGrid, fallbackPipelineSteps, fallbackBootSteps,
  fallbackQuickStartSteps, fallbackRequirements, fallbackTesting, fallbackRoadmap,
  fallbackCommunityLinks,
} from '@/lib/fallback-data';

// Static placeholder for a simple menu since this bypasses Drupal API
const staticMenu = [
  { id: '1', title: 'Why', url: '#why' },
  { id: '2', title: 'Features', url: '#features' },
  { id: '3', title: 'Packages', url: '#packages' },
  { id: '4', title: 'Roadmap', url: '#roadmap' },
  { id: '5', title: 'Docs', url: 'https://monkeyslegion.com/docs' }
];

export default function DesignPreviewPage() {
  return (
    <>
      <Navbar menuItems={staticMenu} />
      <main>
        {/* HERO */}
        <Hero data={fallbackHero}>
          <a href="#quickstart" className="btn btn-primary btn-lg animate-pulse-glow">
            Get started →
          </a>
          <a href="https://github.com/MonkeysCloud/MonkeysLegion" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-lg">
            View on GitHub
          </a>
        </Hero>

        {/* WHATS NEW */}
        <WhatsNew title="What's New in v2.0">
          {fallbackWhatsNewTiles.map((tile) => (
            <FeatureTile 
              key={tile.id} 
              icon={tile.icon} 
              title={tile.title} 
              description={tile.description} 
            />
          ))}
        </WhatsNew>

        {/* PILLARS */}
        <Pillars>
          {fallbackPillars.map((pillar, idx) => (
            <PillarCard
              key={idx}
              icon={pillar.icon}
              title={pillar.title}
              subtitle={pillar.subtitle}
              description={pillar.description}
            />
          ))}
        </Pillars>

        {/* BENCHMARKS */}
        <Benchmarks 
          title="Performance" 
          subtitle="Measured in millions of ops per second" 
          test_environment="Test environment: Apple M3 Pro, 18GB RAM. PHP 8.4RC1. Results may vary depending on configuration."
        >
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

        {/* SECURITY MATRIX */}
        <SecurityMatrix 
          title="First-Party Security Default Matrix" 
          subtitle="A transparent comparison of modern security features built into the MonkeysLegion core versus other popular frameworks."
          footer_note="Disclaimer: This matrix outlines first-party features baked into the core/skeleton by default or strongly recommended via core packages. Laravel and Symfony have massive ecosystems where almost anything is possible if properly configured."
        >
          {fallbackSecurityFeatures.map((sec) => (
            <SecurityRow
              key={sec.id}
              feature={sec.feature}
              mlStatus={sec.mlStatus as any}
              laravelStatus={sec.laravelStatus as any}
              laravelNote={sec.laravelNote}
              symfonyStatus={sec.symfonyStatus as any}
              symfonyNote={sec.symfonyNote}
            />
          ))}
        </SecurityMatrix>

        <ApexSpotlight 
          mainTiles={fallbackApexMainTiles.map((t, idx) => (
            <FeatureTile key={t.id} icon={t.icon} title={t.title} description={t.description} delay={idx * 0.06} />
          ))}
          secondaryTiles={fallbackApexSecondaryTiles.map((t, idx) => (
            <FeatureTile key={t.id} icon={t.icon} title={t.title} description={t.description} delay={idx * 0.06} />
          ))}
          comparisonRows={[
            { cap: 'Multi-provider LLM routing', apex: '✅ Core', python: 'litellm', node: 'Manual wrapper', laravel: 'Manual / OpenAI SDK' },
            { cap: 'Declarative pipelines', apex: '✅ Core', python: 'langchain', node: 'langchain-js', laravel: '❌ Custom code' },
            { cap: 'Structured output', apex: '✅ Core', python: 'instructor / pydantic-ai', node: 'zod + custom', laravel: '❌ Custom code' },
            { cap: 'Guardrails (PII, injection)', apex: '✅ Core (6 validators)', python: 'guardrails-ai', node: 'Manual', laravel: 'Manual' },
            { cap: 'Multi-agent orchestration', apex: '✅ Core (4 modes)', python: 'crewai / autogen', node: 'Manual', laravel: '❌ Custom code' },
            { cap: 'Cost tracking + budgets', apex: '✅ Core', python: 'helicone / custom', node: 'helicone / custom', laravel: 'Custom' },
            { cap: 'MCP server + client', apex: '✅ Core', python: 'mcp-python-sdk', node: '@modelcontextprotocol/sdk', laravel: '❌ Not available' },
            { cap: 'Packages required', apex: '1', python: '5–7', node: '4–6', laravel: '3–5 + custom' },
          ].map((row, idx) => (
            <tr key={idx} style={{ fontWeight: row.cap === 'Packages required' ? 700 : 400 }}>
              <td style={{ fontWeight: 500, color: 'var(--color-text)' }}>{row.cap}</td>
              <td style={{ textAlign: 'center', color: 'var(--color-success)' }}>{row.apex}</td>
              <td style={{ color: 'var(--color-text-muted)' }}>{row.python}</td>
              <td style={{ color: 'var(--color-text-muted)' }}>{row.node}</td>
              <td style={{ color: 'var(--color-text-muted)' }}>{row.laravel}</td>
            </tr>
          ))}
        />
        <FeaturesGrid 
          tiles={fallbackFeaturesGrid.map((t, idx) => (
            <FeatureTile key={t.id} icon={t.icon} title={t.title} description={t.description} delay={idx * 0.04} />
          ))} 
        />
        <PackagesTable>
          {fallbackPackages.map((pkg) => (
            <tr key={pkg.id}>
              <td style={{ fontFamily: 'var(--font-code)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-secondary)' }}>{pkg.name}</td>
              <td style={{ textAlign: 'center', fontFamily: 'var(--font-code)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{pkg.version}</td>
              <td style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>{pkg.purpose}</td>
              <td style={{ textAlign: 'center' }}><a href={pkg.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 'var(--text-xs)' }}>GitHub →</a></td>
            </tr>
          ))}
        </PackagesTable>
        <CodeShowcase tabs={fallbackCodeTabs} />
        <DeveloperExperience 
          scaffoldingSlot={fallbackCliGrid.scaffolding.map((cmd, i) => <CliCommandItem key={i} command={cmd} />)}
          databaseSlot={fallbackCliGrid.database.map((cmd, i) => <CliCommandItem key={i} command={cmd} />)}
          operationsSlot={fallbackCliGrid.operations.map((cmd, i) => <CliCommandItem key={i} command={cmd} />)}
        />
        <ArchitectureDiagram pipelineSteps={fallbackPipelineSteps} bootSteps={fallbackBootSteps} />
        <QuickStart
          stepsSlot={fallbackQuickStartSteps.map((step, i) => <QuickStartStepItem key={i} num={step.num} title={step.title} commands={step.commands} />)}
          requirementsSlot={fallbackRequirements.map((r, i) => <RequirementRowItem key={i} name={r.name} version={r.version} />)}
        />
        <TestingProduction
          suitesSlot={fallbackTesting.testSuites.map((s, i) => <TestSuiteItem key={i} label={s} />)}
          checklistSlot={<ProductionCheckItem header="php.ini + deploy" code={fallbackTesting.productionChecklist} />}
        />
        <WhoIsItFor
          tilesSlot={fallbackAudienceTiles.map((t, idx) => (
            <FeatureTile key={t.id} icon={t.icon} title={t.title} description={t.description} delay={idx * 0.08} />
          ))}
        />
        <Roadmap
          shippedSlot={fallbackRoadmap.shipped.map((s, i) => <RoadmapItem key={i} label={s} accentColor="var(--color-success)" />)}
          comingSlot={fallbackRoadmap.coming.map((s, i) => <RoadmapItem key={i} label={s} accentColor="var(--color-warning)" />)}
          visionSlot={fallbackRoadmap.vision.map((s, i) => <RoadmapItem key={i} label={s} accentColor="var(--color-primary-light)" />)}
        />
        <Community
          linksSlot={fallbackCommunityLinks.map((l, i) => <CommunityLinkItem key={i} icon={l.icon} label={l.label} url={l.url} />)}
          buttonsSlot={<>
            <CtaButtonItem label="Star on GitHub ⭐" url="https://github.com/MonkeysCloud/MonkeysLegion" variant="primary" />
            <CtaButtonItem label="Read the docs →" url="/docs" variant="secondary" />
            <CtaButtonItem label="Open an issue" url="https://github.com/MonkeysCloud/MonkeysLegion/issues" variant="secondary" />
          </>}
        />
        
      </main>
      <Footer />
    </>
  );
}
