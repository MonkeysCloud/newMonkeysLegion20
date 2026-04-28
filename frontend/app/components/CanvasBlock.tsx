'use client';

/**
 * Shared Canvas Block Renderer — renders SDC components from Canvas JSON.
 *
 * Used by all pages (homepage, features, packages, apex, comparisons)
 * to render dynamic content from Drupal's Canvas editor.
 */

// Homepage components
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

// Documentation page components
import PageHero from '../components/docs/PageHero';
import CodeBlock from '../components/docs/CodeBlock';
import ProseSection from '../components/docs/ProseSection';
import ComparisonTable from '../components/docs/ComparisonTable';
import MigrationTable from '../components/docs/MigrationTable';
import MemoryTable from '../components/docs/MemoryTable';
import LayerDiagram from '../components/docs/LayerDiagram';
import { AnimatedSection } from '../components/ui';

// Fallback data
import {
  fallbackHero, fallbackPillars, fallbackCodeTabs, fallbackCliGrid,
  fallbackPipelineSteps, fallbackBootSteps, fallbackQuickStartSteps,
  fallbackRequirements, fallbackTesting, fallbackRoadmap, fallbackCommunityLinks,
} from '@/lib/fallback-data';

export interface CanvasSection {
  id: string;
  type: string;
  props?: Record<string, any>;
  slots?: Record<string, CanvasSection[]>;
}

/**
 * Recursive Canvas block renderer.
 * Maps section.type to the correct React component,
 * passing props and recursively rendering slot children.
 */
export default function CanvasBlock({ section }: { section: CanvasSection }) {
  const renderSlot = (slotName: string) =>
    section.slots?.[slotName]?.map((child) => (
      <CanvasBlock key={child.id} section={child} />
    ));

  switch (section.type) {
    /* ==================================================================
       HOMEPAGE Components
       ================================================================== */
    case 'hero_section': {
      const actions = renderSlot('actions');
      const props = { ...section.props };
      // Split comma-separated badges string into individual pill items
      if (typeof props.badges === 'string') {
        props.badges = props.badges.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      // Use eyebrow field for the version badge if provided
      if (props.eyebrow) {
        props.versionBadge = props.eyebrow;
      }
      return (
        <Hero key={section.id} data={{ ...fallbackHero, ...props }}>
          {actions}
        </Hero>
      );
    }
    case 'whats_new':
      return (
        <WhatsNew key={section.id} title={section.props?.title} description={section.props?.description}>
          {renderSlot('cards')}
        </WhatsNew>
      );
    case 'feature_card':
      return (
        <FeatureTile
          key={section.id}
          icon={section.props?.icon}
          title={section.props?.title}
          description={section.props?.description}
        />
      );
    case 'pillars':
      return (
        <Pillars key={section.id}>
          {renderSlot('items')}
        </Pillars>
      );
    case 'pillar_card':
      return (
        <PillarCard
          key={section.id}
          icon={section.props?.icon}
          title={section.props?.title}
          subtitle={section.props?.subtitle}
          description={section.props?.description}
        />
      );
    case 'benchmarks':
      return (
        <Benchmarks key={section.id} title={section.props?.title} subtitle={section.props?.subtitle} test_environment={section.props?.test_environment}>
          {renderSlot('rows')}
        </Benchmarks>
      );
    case 'benchmark_row':
      return (
        <BenchmarkRow
          key={section.id}
          operation={section.props?.operation}
          mlValue={section.props?.ml_value}
          mlSuffix={section.props?.ml_suffix}
          vsLaravel={section.props?.vs_laravel}
          vsSymfony={section.props?.vs_symfony}
        />
      );
    case 'security_matrix':
      return (
        <SecurityMatrix key={section.id} title={section.props?.title} subtitle={section.props?.subtitle} footer_note={section.props?.footer_text}>
          {renderSlot('rows')}
        </SecurityMatrix>
      );
    case 'security_row':
      return (
        <SecurityRow
          key={section.id}
          feature={section.props?.feature}
          mlStatus={section.props?.ml_status}
          laravelStatus={section.props?.laravel_status}
          laravelNote={section.props?.laravel_note}
          symfonyStatus={section.props?.symfony_status}
          symfonyNote={section.props?.symfony_note}
        />
      );
    case 'apex_spotlight':
      return (
        <ApexSpotlight
          key={section.id}
          title={section.props?.title}
          subtitle={section.props?.subtitle}
          eyebrow={section.props?.eyebrow}
          proofText={section.props?.proof_text}
          docsUrl={section.props?.docs_url}
          githubUrl={section.props?.github_url}
          mainTiles={renderSlot('main_tiles')}
          secondaryTiles={renderSlot('secondary_tiles')}
          comparisonRows={renderSlot('comparison_rows')}
        />
      );
    case 'apex_comparison_row':
      return (
        <tr key={section.id} style={{ fontWeight: section.props?.capability === 'Packages required' ? 700 : 400 }}>
          <td style={{ fontWeight: 500, color: 'var(--color-text)' }}>{section.props?.capability || ''}</td>
          <td style={{ textAlign: 'center', color: 'var(--color-success)' }}>{section.props?.apex || ''}</td>
          <td style={{ color: 'var(--color-text-muted)' }}>{section.props?.python || ''}</td>
          <td style={{ color: 'var(--color-text-muted)' }}>{section.props?.node || ''}</td>
          <td style={{ color: 'var(--color-text-muted)' }}>{section.props?.laravel || ''}</td>
        </tr>
      );
    case 'feature_grid':
      return (
        <FeaturesGrid
          key={section.id}
          title={section.props?.title}
          tiles={renderSlot('items')}
        />
      );
    case 'packages_table':
      return (
        <PackagesTable key={section.id} title={section.props?.title} subtitle={section.props?.subtitle}>
          {renderSlot('rows')}
        </PackagesTable>
      );
    case 'package_row':
      return (
        <tr key={section.id}>
          <td style={{ fontFamily: 'var(--font-code)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-secondary)' }}>{section.props?.package_name || ''}</td>
          <td style={{ textAlign: 'center', fontFamily: 'var(--font-code)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{section.props?.version || ''}</td>
          <td style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>{section.props?.purpose || ''}</td>
          <td style={{ textAlign: 'center' }}><a href={section.props?.github_url || '#'} target="_blank" rel="noopener noreferrer" style={{ fontSize: 'var(--text-xs)' }}>GitHub →</a></td>
        </tr>
      );
    case 'code_showcase': {
      const mappedTabs = section.slots?.tabs?.map((t) => ({
        label: t.props?.label || '',
        language: t.props?.language || 'php',
        code: t.props?.code || '',
        description: t.props?.description || ''
      })) || fallbackCodeTabs;
      return (
        <CodeShowcase key={section.id} title={section.props?.title} subtitle={section.props?.subtitle} tabs={mappedTabs} />
      );
    }
    case 'cli_grid':
      return (
        <DeveloperExperience
          key={section.id}
          title={section.props?.title}
          subtitle={section.props?.subtitle}
          scaffoldingSlot={renderSlot('scaffolding')}
          databaseSlot={renderSlot('database')}
          operationsSlot={renderSlot('operations')}
        />
      );
    case 'cli_command':
      return <CliCommandItem key={section.id} command={section.props?.command || ''} />;
    case 'architecture':
      return <ArchitectureDiagram key={section.id} title={section.props?.title} subtitle={section.props?.subtitle} pipelineSteps={fallbackPipelineSteps} bootSteps={fallbackBootSteps} />;
    case 'quick_start':
      return (
        <QuickStart
          key={section.id}
          title={section.props?.title}
          subtitle={section.props?.subtitle}
          stepsSlot={renderSlot('steps')}
          requirementsSlot={renderSlot('requirements')}
        />
      );
    case 'quick_start_step': {
      const cmds = section.props?.commands ? section.props.commands.split('\n').map((s: string) => s.trim()).filter(Boolean) : [];
      return <QuickStartStepItem key={section.id} num={section.props?.num || '01'} title={section.props?.title || ''} commands={cmds} />;
    }
    case 'requirement_row':
      return <RequirementRowItem key={section.id} name={section.props?.name || ''} version={section.props?.version || ''} />;
    case 'testing':
      return (
        <TestingProduction
          key={section.id}
          title={section.props?.title}
          subtitle={section.props?.subtitle}
          testDescription={section.props?.test_description}
          suitesSlot={renderSlot('suites')}
          checklistSlot={renderSlot('checklist')}
        />
      );
    case 'test_suite_item':
      return <TestSuiteItem key={section.id} label={section.props?.label || ''} />;
    case 'production_check':
      return <ProductionCheckItem key={section.id} header={section.props?.header || 'php.ini + deploy'} code={section.props?.code || ''} />;
    case 'audience':
      return (
        <WhoIsItFor
          key={section.id}
          title={section.props?.title}
          titleGradient={section.props?.title_gradient}
          subtitle={section.props?.subtitle}
          tilesSlot={renderSlot('tiles')}
        />
      );
    case 'roadmap':
      return (
        <Roadmap
          key={section.id}
          title={section.props?.title}
          titleGradient={section.props?.title_gradient}
          shippedSlot={renderSlot('shipped')}
          comingSlot={renderSlot('coming')}
          visionSlot={renderSlot('vision')}
        />
      );
    case 'roadmap_item':
      return <RoadmapItem key={section.id} label={section.props?.label || ''} />;
    case 'community':
      return (
        <Community
          key={section.id}
          title={section.props?.title}
          titleGradient={section.props?.title_gradient}
          subtitle={section.props?.subtitle}
          ctaHeading={section.props?.cta_heading}
          terminalCommand={section.props?.terminal_command}
          linksSlot={renderSlot('links')}
          buttonsSlot={renderSlot('buttons')}
        />
      );
    case 'community_link':
      return <CommunityLinkItem key={section.id} icon={section.props?.icon || '📦'} label={section.props?.label || ''} url={section.props?.url || '#'} />;
    case 'cta_button':
      return <CtaButtonItem key={section.id} label={section.props?.label || ''} url={section.props?.url || '#'} variant={section.props?.variant || 'primary'} />;
    case 'button': {
      const isPrimary = section.props?.style === 'primary' || section.props?.style === undefined;
      const cn = isPrimary ? "btn btn-primary btn-lg animate-pulse-glow" : "btn btn-secondary btn-lg";
      return (
        <a key={section.id} href={section.props?.url || '#'} target={!isPrimary ? "_blank" : undefined} rel={!isPrimary ? "noopener noreferrer" : undefined} className={cn}>
          {section.props?.text || 'Click Me'}
        </a>
      );
    }

    /* ==================================================================
       DOCUMENTATION Components (shared across features/packages/apex/compare)
       ================================================================== */
    case 'page_hero':
      return (
        <PageHero
          key={section.id}
          eyebrow={section.props?.eyebrow}
          title={section.props?.title}
          titleGradient={section.props?.title_gradient}
          subtitle={section.props?.subtitle}
        >
          {renderSlot('actions')}
        </PageHero>
      );
    case 'prose_section':
      return (
        <ProseSection
          key={section.id}
          title={section.props?.title}
        >
          <div dangerouslySetInnerHTML={{ __html: section.props?.body || '' }} />
        </ProseSection>
      );
    case 'code_block_section':
      return (
        <AnimatedSection key={section.id}>
          <CodeBlock
            language={section.props?.language || 'php'}
            code={section.props?.code || ''}
          />
        </AnimatedSection>
      );
    case 'capability_grid':
      return (
        <section key={section.id} className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title">{section.props?.title} <span className="text-gradient">{section.props?.title_gradient}</span></h2>
            </AnimatedSection>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
              {renderSlot('cards')}
            </div>
          </div>
        </section>
      );
    case 'capability_card':
      return (
        <AnimatedSection key={section.id}>
          <div className="glass-card" style={{ padding: 'var(--space-5)', height: '100%' }}>
            <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: 'var(--space-2)' }}>{section.props?.icon}</span>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>{section.props?.title}</h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0, lineHeight: 'var(--line-height-relaxed)' }}>{section.props?.description}</p>
          </div>
        </AnimatedSection>
      );
    case 'layer_diagram': {
      const layers = section.slots?.layers?.map((l) => ({
        label: l.props?.label || '',
        detail: l.props?.tech || '',
        color: l.props?.color || '#8b5cf6',
      })) || [];
      return (
        <LayerDiagram key={section.id} title={section.props?.title} layers={layers} />
      );
    }
    case 'layer_row':
      return (
        <div key={section.id} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: 'var(--space-3) var(--space-4)',
          background: `${section.props?.color || '#8b5cf6'}08`,
          borderLeft: `3px solid ${section.props?.color || '#8b5cf6'}`,
          borderRadius: 'var(--radius-sm)',
        }}>
          <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{section.props?.label}</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{section.props?.tech}</span>
        </div>
      );
    case 'memory_table': {
      const memRows = section.slots?.rows?.map((r) => ({
        strategy: r.props?.label || '',
        useCase: r.props?.ml_value || '',
      })) || [];
      return (
        <MemoryTable key={section.id} title={section.props?.title} rows={memRows} />
      );
    }
    case 'cta_break':
      return (
        <section key={section.id} className="section" style={{ textAlign: 'center', background: 'linear-gradient(180deg, var(--color-bg) 0%, hsl(250, 30%, 10%) 100%)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title">{section.props?.title} <span className="text-gradient">{section.props?.title_gradient}</span></h2>
              <p className="section-subtitle" style={{ margin: '0 auto var(--space-6)' }}>{section.props?.description || section.props?.subtitle}</p>
              
              {section.props?.show_terminal && section.props?.terminal_command && (
                <div className="terminal" style={{ maxWidth: 550, margin: '0 auto var(--space-8)', textAlign: 'left' }}>
                  <div className="terminal-header"><div className="terminal-dot terminal-dot-red" /><div className="terminal-dot terminal-dot-yellow" /><div className="terminal-dot terminal-dot-green" /></div>
                  <div className="terminal-body"><div className="terminal-line"><span className="terminal-prompt">$</span><span className="terminal-command">{section.props.terminal_command}</span></div></div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
                {renderSlot('actions')}
              </div>
            </AnimatedSection>
          </div>
        </section>
      );
    case 'dual_panel':
      return (
        <section key={section.id} className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
              <div>{renderSlot('left')}</div>
              <div>{renderSlot('right')}</div>
            </div>
          </div>
        </section>
      );
    case 'trio_card_grid':
      return (
        <section key={section.id} className="section" style={{ background: 'var(--color-bg-alt)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title">{section.props?.title} <span className="text-gradient">{section.props?.title_gradient}</span></h2>
            </AnimatedSection>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
              {renderSlot('cards')}
            </div>
          </div>
        </section>
      );
    case 'feature_category': {
      const color = section.props?.color || '#8b5cf6';
      const bg = section.props?.background === 'alt' ? 'var(--color-bg-alt)' : 'var(--color-bg)';
      return (
        <section key={section.id} className="section" style={{ background: bg }}>
          <div className="container">
            <AnimatedSection>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                <div style={{ width: 4, height: 28, borderRadius: 2, background: color }} />
                <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0 }}>{section.props?.category}</h2>
              </div>
            </AnimatedSection>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--space-5)' }}>
              {renderSlot('items')}
            </div>
          </div>
        </section>
      );
    }
    case 'feature_deep_card':
      return (
        <AnimatedSection key={section.id}>
          <div className="glass-card" style={{ padding: 'var(--space-6)', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: '1.3rem' }}>{section.props?.icon}</span>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: 0 }}>{section.props?.title}</h3>
              </div>
              <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-code)', color: 'var(--color-text-muted)', padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'var(--color-surface)' }}>{section.props?.tag}</span>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', marginBottom: 'var(--space-4)', flex: '0 0 auto' }}>{section.props?.description}</p>
            {section.props?.code && (
              <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <CodeBlock language="php" code={section.props.code} />
              </div>
            )}
          </div>
        </AnimatedSection>
      );

    /* ── Traits Section (centered title + subtitle + grid of children) ── */
    case 'traits_section': {
      const bg = section.props?.background === 'alt' ? 'var(--color-bg-alt)' : 'var(--color-bg)';
      const cols = section.props?.columns || '3';
      const minW = cols === '2' ? '400px' : cols === '4' ? '260px' : '320px';
      return (
        <section key={section.id} className="section" style={{ background: bg }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title">
                {section.props?.title}{' '}
                <span className="text-gradient">{section.props?.title_gradient}</span>
              </h2>
              {section.props?.subtitle && (
                <p className="section-subtitle" style={{ margin: '0 auto var(--space-10)' }}>
                  {section.props.subtitle}
                </p>
              )}
            </AnimatedSection>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${minW}, 1fr))`, gap: 'var(--space-5)' }}>
              {renderSlot('items')}
            </div>
          </div>
        </section>
      );
    }

    /* ── Info Card (title + body slot for CKEditor content) ── */
    case 'info_card':
      return (
        <AnimatedSection key={section.id}>
          <div className="glass-card" style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>{section.props?.title}</h3>
            <div className="doc-content" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)' }}>
              {renderSlot('body')}
            </div>
          </div>
        </AnimatedSection>
      );

    /* ── Text Block (HTML content for use inside slots) ── */
    case 'text_block': {
      const content = typeof section.props?.content === 'object' 
        ? section.props.content.value 
        : (section.props?.content || '');
        
      return (
        <div
          key={section.id}
          className="doc-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    /* ── Framework Trait Card ── */
    case 'framework_trait':
      return (
        <AnimatedSection key={section.id}>
          <div className="glass-card" style={{
            padding: 'var(--space-6)',
            height: '100%',
            display: 'flex',
            gap: 'var(--space-4)',
            alignItems: 'flex-start',
          }}>
            <div style={{
              fontSize: '1.8rem',
              flexShrink: 0,
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-md)',
              background: 'hsla(250, 85%, 60%, 0.1)',
            }}>
              {section.props?.icon}
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>{section.props?.title}</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--line-height-relaxed)', margin: 0 }}>{section.props?.description}</p>
            </div>
          </div>
        </AnimatedSection>
      );

    /* ── Package Highlight Row ── */
    case 'package_highlight': {
      const phColor = section.props?.color || '#8b5cf6';
      if (section.props?.variant === 'vertical') {
        return (
          <div key={section.id} className="glass-card" style={{ padding: 'var(--space-5)', borderTop: `3px solid ${phColor}`, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>{section.props?.icon}</div>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>{section.props?.name}</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 'var(--line-height-relaxed)' }}>{section.props?.description}</p>
          </div>
        );
      }
      return (
        <AnimatedSection key={section.id}>
          <div className="glass-card" style={{
            padding: 'var(--space-4) var(--space-5)',
            display: 'flex',
            gap: 'var(--space-3)',
            alignItems: 'center',
            transition: 'border-color var(--transition-base)',
          }}>
            <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{section.props?.icon}</span>
            <div style={{ minWidth: 0 }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, fontFamily: 'var(--font-code)' }}>{section.props?.name}</span>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 'var(--line-height-relaxed)', margin: '0.1rem 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {section.props?.description}
              </p>
            </div>
          </div>
        </AnimatedSection>
      );
    }

    case 'stats_bar':
      return (
        <section key={section.id} style={{ padding: 'var(--space-8) 0', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-10)', flexWrap: 'wrap' }}>
              {(section.props?.items ? JSON.parse(section.props.items) : []).map((stat: { label: string, value: string }, i: number) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }} className="text-gradient">{stat.value}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    case 'package_category_section': {
      const catColor = section.props?.color || '#8b5cf6';
      return (
        <section key={section.id} className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <AnimatedSection>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                <div style={{ width: 4, height: 28, borderRadius: 2, background: catColor }} />
                <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, margin: 0 }}>{section.props?.category}</h2>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', background: 'var(--color-surface)', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
                  {section.props?.count || 0} packages
                </span>
              </div>
            </AnimatedSection>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {renderSlot('packages')}
            </div>
          </div>
        </section>
      );
    }
    case 'package_card': {
      const pkgColor = section.props?.color || '#8b5cf6';
      const bullets = section.props?.bullets ? section.props.bullets.split('|').map((b: string) => b.trim()).filter(Boolean) : [];
      return (
        <AnimatedSection key={section.id}>
          <div
            className="glass-card"
            style={{
              padding: 'var(--space-5) var(--space-6)', display: 'grid',
              gridTemplateColumns: '1fr auto', gap: 'var(--space-4)',
              alignItems: 'start', borderLeft: `3px solid ${pkgColor}`,
              cursor: 'pointer', transition: 'transform 0.2s',
            }}
            onClick={() => { if (section.props?.docs_url) window.location.href = section.props.docs_url; }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.3rem' }}>{section.props?.icon || '📦'}</span>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, fontFamily: 'var(--font-code)', margin: 0 }}>{section.props?.name}</h3>
                <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-code)', color: pkgColor, fontWeight: 600, background: `${pkgColor}15`, padding: '0.15rem 0.5rem', borderRadius: '999px' }}>{section.props?.version}</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', background: 'var(--color-surface)', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>{section.props?.category}</span>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>{section.props?.tagline}</p>
              {bullets.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1) var(--space-4)' }}>
                  {bullets.map((b: string, bi: number) => (
                    <span key={bi} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3em' }}>
                      <span style={{ color: pkgColor, fontSize: '0.5rem' }}>●</span> {b}
                    </span>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', background: 'var(--color-surface)', padding: '0.3rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>{section.props?.install}</code>
                <a href={section.props?.github_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>GitHub →</a>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
              <a href={section.props?.docs_url || '/docs'} onClick={e => e.stopPropagation()} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 40, height: 40, borderRadius: 'var(--radius-lg)',
                background: `${pkgColor}12`, border: `1px solid ${pkgColor}30`,
                color: pkgColor, textDecoration: 'none', fontSize: '1.1rem',
              }}>→</a>
              <span style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Docs</span>
            </div>
          </div>
        </AnimatedSection>
      );
    }

    /* ==================================================================
       PACKAGE PROMO Components
       ================================================================== */
    case 'package_promo_section': {
      return (
        <section key={section.id} className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <AnimatedSection>
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
                <h2 className="section-title">{section.props?.title} <span className="text-gradient">{section.props?.title_gradient}</span></h2>
                <p className="section-subtitle" style={{ margin: '0 auto var(--space-8)' }}>
                  {section.props?.subtitle}
                </p>
                
                {/* Stats Bar */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                  {renderSlot('stats')}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              {/* Highlight Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)', marginBottom: 'var(--space-10)' }}>
                {renderSlot('highlights')}
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <div style={{ textAlign: 'center', padding: 'var(--space-8)', background: 'linear-gradient(180deg, rgba(139,92,246,0.05) 0%, rgba(6,182,212,0.05) 100%)', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(139,92,246,0.1)' }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Get everything with one command</h3>
                <div className="terminal" style={{ maxWidth: 550, margin: '0 auto var(--space-6)', textAlign: 'left' }}>
                  <div className="terminal-header"><div className="terminal-dot terminal-dot-red" /><div className="terminal-dot terminal-dot-yellow" /><div className="terminal-dot terminal-dot-green" /></div>
                  <div className="terminal-body"><div className="terminal-line"><span className="terminal-prompt">$</span><span className="terminal-command">{section.props?.terminal_command}</span></div></div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {renderSlot('actions')}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      );
    }

    case 'stat_item': {
      return (
        <div key={section.id} style={{ textAlign: 'center', background: 'var(--color-surface)', padding: 'var(--space-3) var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', minWidth: 160 }}>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }} className="text-gradient">{section.props?.value}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>{section.props?.label}</div>
        </div>
      );
    }


    /* ==================================================================
       COMPARISON Components
       ================================================================== */
    case 'wins_section':
      return (
        <section key={section.id} className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title">
                {section.props?.title} <span className="text-gradient">{section.props?.title_gradient}</span>
              </h2>
              {section.props?.subtitle && <p className="section-subtitle">{section.props.subtitle}</p>}
            </AnimatedSection>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
              {renderSlot('cards')}
            </div>
          </div>
        </section>
      );
    case 'wins_card':
      return (
        <AnimatedSection key={section.id}>
          <div className="glass-card" style={{
            padding: 'var(--space-5)', borderLeft: `3px solid ${section.props?.accent_color || '#8b5cf6'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <span style={{ fontSize: '1.2rem' }}>{section.props?.icon}</span>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, margin: 0 }}>{section.props?.title}</h3>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0, lineHeight: 'var(--line-height-relaxed)' }}>{section.props?.description}</p>
          </div>
        </AnimatedSection>
      );
    case 'comparison_table_section': {
      const compRows = section.slots?.rows?.map((r) => ({
        capability: r.props?.capability || '',
        values: [r.props?.value_1 || '', r.props?.value_2 || ''],
      })) || [];
      return (
        <ComparisonTable
          key={section.id}
          title={section.props?.title}
          columns={[section.props?.column_1 || 'Column 1', section.props?.column_2 || 'Column 2']}
          rows={compRows}
        />
      );
    }
    case 'migration_table_section': {
      const migRows = section.slots?.rows?.map((r) => ({
        from: r.props?.from_concept || '',
        to: r.props?.to_concept || '',
      })) || [];
      return (
        <MigrationTable
          key={section.id}
          title={section.props?.title}
          fromLabel={section.props?.from_label || 'From'}
          toLabel={section.props?.to_label || 'To'}
          rows={migRows}
        />
      );
    }

    case 'pick_which': {
      const f1Bullets = section.props?.framework_1_bullets?.split('|').map((b: string) => b.trim()).filter(Boolean) || [];
      const f2Bullets = section.props?.framework_2_bullets?.split('|').map((b: string) => b.trim()).filter(Boolean) || [];
      return (
        <section key={section.id} className="section" style={{ background: 'var(--color-bg)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title">{section.props?.title} <span className="text-gradient">{section.props?.title_gradient}</span></h2>
            </AnimatedSection>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', maxWidth: 800, margin: '0 auto' }}>
              <div className="glass-card" style={{ padding: 'var(--space-6)', borderTop: `3px solid ${section.props?.framework_1_color || '#ff4444'}` }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-4)', color: section.props?.framework_1_color }}>Pick {section.props?.framework_1_name} if:</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {f1Bullets.map((b: string, i: number) => (
                    <li key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5em' }}>
                      <span style={{ color: section.props?.framework_1_color }}>→</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass-card" style={{ padding: 'var(--space-6)', borderTop: `3px solid ${section.props?.framework_2_color || '#8b5cf6'}` }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--space-4)', color: section.props?.framework_2_color }}>Pick {section.props?.framework_2_name} if:</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {f2Bullets.map((b: string, i: number) => (
                    <li key={i} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', display: 'flex', gap: '0.5em' }}>
                      <span style={{ color: section.props?.framework_2_color }}>→</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      );
    }
    case 'philosophy_cards':
      return (
        <section key={section.id} className="section" style={{ background: 'var(--color-bg-alt)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title">{section.props?.title} <span className="text-gradient">{section.props?.title_gradient}</span></h2>
            </AnimatedSection>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', maxWidth: 800, margin: '0 auto' }}>
              <div className="glass-card" style={{ padding: 'var(--space-6)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 'var(--space-3)', color: section.props?.framework_1_color }}>{section.props?.framework_1_name}</h4>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--line-height-relaxed)', margin: 0 }}>
                  <strong style={{ color: 'var(--color-text)' }}>{section.props?.framework_1_tagline}</strong> {section.props?.framework_1_body}
                </p>
              </div>
              <div className="glass-card" style={{ padding: 'var(--space-6)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 'var(--space-3)', color: section.props?.framework_2_color }}>{section.props?.framework_2_name}</h4>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 'var(--line-height-relaxed)', margin: 0 }}>
                  <strong style={{ color: 'var(--color-text)' }}>{section.props?.framework_2_tagline}</strong> {section.props?.framework_2_body}
                </p>
              </div>
            </div>
          </div>
        </section>
      );
    case 'still_unsure_cta':
      return (
        <section key={section.id} className="section" style={{ textAlign: 'center', background: 'linear-gradient(180deg, var(--color-bg) 0%, hsl(250, 30%, 10%) 100%)' }}>
          <div className="container">
            <AnimatedSection>
              <h2 className="section-title">{section.props?.title} <span className="text-gradient">{section.props?.title_gradient}</span></h2>
              <p className="section-subtitle" style={{ margin: '0 auto var(--space-6)' }}>{section.props?.body}</p>
              {section.props?.terminal_command && (
                <div className="terminal" style={{ maxWidth: 550, margin: '0 auto var(--space-8)', textAlign: 'left' }}>
                  <div className="terminal-header"><div className="terminal-dot terminal-dot-red" /><div className="terminal-dot terminal-dot-yellow" /><div className="terminal-dot terminal-dot-green" /></div>
                  <div className="terminal-body"><div className="terminal-line"><span className="terminal-prompt">$</span><span className="terminal-command">{section.props.terminal_command}</span></div></div>
                </div>
              )}
              <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
                {renderSlot('actions')}
              </div>
            </AnimatedSection>
          </div>
        </section>
      );

    /* ==================================================================
       FALLBACK
       ================================================================== */
    default:
      console.warn(`[CanvasBlock] Unknown section type: ${section.type}`);
      return null;
  }
}
