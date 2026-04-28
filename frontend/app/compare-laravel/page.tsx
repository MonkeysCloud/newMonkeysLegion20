import Navbar from '../components/layout/Navbar';
import Footer from '../components/Footer';
import CanvasBlock from '../components/CanvasBlock';
import { CompareLaravelContent } from '../design-compare-laravel/page';
import { getCanvasLayout, getMenu } from '@/lib/drupal';

export const metadata = {
  title: 'MonkeysLegion vs Laravel — Framework Comparison',
  description: 'A transparent, data-driven comparison between MonkeysLegion and Laravel. Performance benchmarks, architecture, and migration paths.',
  openGraph: {
    title: 'MonkeysLegion vs Laravel — Side-by-Side Comparison',
    description: '6× faster requests, 18% memory usage, built-in AI, compiled DI — see how MonkeysLegion compares to Laravel.',
    url: '/compare-laravel',
  },
  twitter: { card: 'summary_large_image' as const },
  alternates: { canonical: '/compare-laravel' },
};

export default async function CompareLaravelPage() {
  const [layout, menuItems] = await Promise.all([
    getCanvasLayout('/compare-laravel'),
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

  return <CompareLaravelContent menuItems={menuItems} />;
}
