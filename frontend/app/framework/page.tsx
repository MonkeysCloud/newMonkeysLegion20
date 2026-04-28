export const dynamic = 'force-dynamic';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/Footer';
import CanvasBlock from '../components/CanvasBlock';
import { FrameworkContent } from '../design-framework/page';
import { getCanvasLayout, getMenu } from '@/lib/drupal';

export const metadata = {
  title: 'Framework — Inside MonkeysLegion v2',
  description: 'MonkeysLegion v2 is a modular PHP 8.4 framework built around attributes, strict types, compiled infrastructure, and 26 integrated packages.',
  openGraph: {
    title: 'Inside MonkeysLegion v2 — A Modern PHP Platform',
    description: 'Attribute-first architecture, compiled DI, PSR-aligned internals, first-party auth, and AI orchestration — 26 packages in one ecosystem.',
    url: '/framework',
  },
  twitter: { card: 'summary_large_image' as const },
  alternates: { canonical: '/framework' },
};

export default async function FrameworkPage() {
  const [layout, menuItems] = await Promise.all([
    getCanvasLayout('/framework'),
    getMenu('main'),
  ]);

  // Dynamic mode: Canvas layout exists in Drupal
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

  // Fallback: static content with Drupal menu
  return <FrameworkContent menuItems={menuItems} />;
}
