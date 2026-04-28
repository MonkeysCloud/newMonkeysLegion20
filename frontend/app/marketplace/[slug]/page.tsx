import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/Footer';
import PackageDetailClient from './PackageDetailClient';
import { getMarketplacePackage, getMenu } from '@/lib/drupal';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const pkg = await getMarketplacePackage(slug);
  if (!pkg) return { title: 'Package Not Found' };
  return {
    title: `${pkg.title} — Marketplace`,
    description: pkg.summary,
  };
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  const [pkg, menuItems] = await Promise.all([
    getMarketplacePackage(slug),
    getMenu('main'),
  ]);

  if (!pkg) notFound();

  return (
    <>
      <Navbar menuItems={menuItems} />
      <main className="pkg-detail">
        <div className="container">
          <PackageDetailClient pkg={pkg} />
        </div>
      </main>
      <Footer menuItems={menuItems} />
    </>
  );
}
