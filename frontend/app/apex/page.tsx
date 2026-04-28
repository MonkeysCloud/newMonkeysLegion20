export const dynamic = 'force-dynamic';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/Footer';
import CanvasBlock from '../components/CanvasBlock';
import { ApexContent } from '../design-apex/page';
import { getCanvasLayout, getMenu } from '@/lib/drupal';

export const metadata = {
  title: 'Apex AI — Native Intelligence Layer',
  description: 'Apex embeds multi-provider AI into your PHP stack — GPT-4, Claude, Gemini — with streaming, embeddings, RAG, and a unified API.',
  openGraph: {
    title: 'Apex AI — Built-in AI Orchestration for PHP',
    description: 'Multi-provider routing, structured output, tool calling, pipelines, crews, guardrails, MCP — the AI engine no other PHP framework has.',
    url: '/apex',
  },
  twitter: { card: 'summary_large_image' as const },
  alternates: { canonical: '/apex' },
};

export default async function ApexPage() {
  const [layout, menuItems] = await Promise.all([
    getCanvasLayout('/apex'),
    getMenu('main'),
  ]);

  if (layout) {
    return (
      <>
        <Navbar menuItems={menuItems} />
        <main>
          {layout.sections.map((section) => (
            <CanvasBlock key={section.id} section={section} />
          ))}
        </main>
        <Footer menuItems={menuItems} />
      </>
    );
  }

  return <ApexContent menuItems={menuItems} />;
}
