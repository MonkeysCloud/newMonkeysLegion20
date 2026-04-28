export const dynamic = 'force-dynamic';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/Footer';
import CanvasBlock from '../components/CanvasBlock';
import { FeaturesContent } from '../design-features/page';
import { getCanvasLayout, getMenu } from '@/lib/drupal';

export const metadata = {
  title: 'Features — Every Capability Deep Dive',
  description: 'Nineteen capabilities. One composer install. Explore every feature of the MonkeysLegion PHP 8.4 framework.',
  openGraph: {
    title: 'MonkeysLegion Features — Every Capability Deep Dive',
    description: 'Attribute routing, compiled DI, JWT auth, validation, queues, telemetry, OpenAPI, Apex AI — 19 features in one framework.',
    url: '/features',
  },
  twitter: { card: 'summary_large_image' as const },
  alternates: { canonical: '/features' },
};

export default async function FeaturesPage() {
  const [layout, menuItems] = await Promise.all([
    getCanvasLayout('/features'),
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
  return <FeaturesContent menuItems={menuItems} />;
}
