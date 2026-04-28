export const dynamic = 'force-dynamic';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/Footer';
import CanvasBlock from '../components/CanvasBlock';
import { CompareSymfonyContent } from '../design-compare-symfony/page';
import { getCanvasLayout, getMenu } from '@/lib/drupal';

export const metadata = {
  title: 'MonkeysLegion vs Symfony — Framework Comparison',
  description: 'A transparent, data-driven comparison between MonkeysLegion and Symfony. Performance benchmarks, architecture, and migration paths.',
  openGraph: {
    title: 'MonkeysLegion vs Symfony — Side-by-Side Comparison',
    description: 'Compiled DI, attribute-first routing, built-in AI — how MonkeysLegion reimagines enterprise PHP.',
    url: '/compare-symfony',
  },
  twitter: { card: 'summary_large_image' as const },
  alternates: { canonical: '/compare-symfony' },
};

export default async function CompareSymfonyPage() {
  const [layout, menuItems] = await Promise.all([
    getCanvasLayout('/compare-symfony'),
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

  return <CompareSymfonyContent menuItems={menuItems} />;
}
