export const dynamic = 'force-dynamic';

import MarketplaceClient from './MarketplaceClient';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/Footer';
import { getMarketplacePackages, getPackageCategories, getMenu } from '@/lib/drupal';

export const metadata = {
  title: 'Marketplace — Discover Packages',
  description: 'Browse, search, and discover MonkeysLegion packages. Find tools for HTTP, routing, AI, database, and more.',
};

export default async function MarketplacePage() {
  const [data, categories, menuItems] = await Promise.all([
    getMarketplacePackages(),
    getPackageCategories(),
    getMenu('main'),
  ]);

  return (
    <>
      <Navbar menuItems={menuItems} />
      <MarketplaceClient
        initialPackages={data.packages}
        initialTotal={data.total}
        categories={categories}
      />
      <Footer menuItems={menuItems} />
    </>
  );
}
