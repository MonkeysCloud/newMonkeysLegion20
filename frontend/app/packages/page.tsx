import Navbar from '../components/layout/Navbar';
import Footer from '../components/Footer';
import CanvasBlock from '../components/CanvasBlock';
import DynamicPackages from './DynamicPackages';
import {
  getCanvasLayout,
  getMenu,
  getPackageList,
} from '@/lib/drupal';

export const metadata = {
  title: 'Packages — MonkeysLegion Composer Packages',
  description:
    'Browse all MonkeysLegion Composer packages. Search, filter by category, and jump directly to documentation.',
  openGraph: {
    title: 'MonkeysLegion Package Ecosystem',
    description:
      'Core, HTTP, routing, auth, database, queue, telemetry, cache, AI orchestration — every package independently versioned.',
    url: '/packages',
  },
  twitter: { card: 'summary_large_image' as const },
  alternates: { canonical: '/packages' },
};

export default async function PackagesPage() {
  const [layout, menuItems, packages] = await Promise.all([
    getCanvasLayout('/packages'),
    getMenu('main'),
    getPackageList(),
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

  return <DynamicPackages menuItems={menuItems} packages={packages} />;
}
