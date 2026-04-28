export const dynamic = 'force-dynamic';

import Navbar from './components/layout/Navbar';
import Footer from './components/Footer';
import CanvasBlock from './components/CanvasBlock';

import { getCanvasLayout, getMenu } from '@/lib/drupal';



export default async function Home() {
  const [layout, mainMenu] = await Promise.all([
    getCanvasLayout('/'),
    getMenu('main'),
  ]);

  if (!layout) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <h1 className="text-3xl font-bold">Failed to load from CMS</h1>
        <p className="mt-4 opacity-70">Check if Drupal is running and Canvas JSON endpoints are configured.</p>
      </main>
    );
  }

  return (
    <>
      <Navbar menuItems={mainMenu} />
      <main>
        {layout.sections.map((section) => (
          <CanvasBlock key={section.id} section={section} />
        ))}
      </main>
      <Footer menuItems={mainMenu} />
    </>
  );
}
