import Navbar from '../components/layout/Navbar';
import Footer from '../components/Footer';
import { getMenu } from '@/lib/drupal';

export default async function DocuLayout({ children }: { children: React.ReactNode }) {
  const menuItems = await getMenu('main');

  return (
    <>
      <Navbar menuItems={menuItems} />
      {children}
      <Footer menuItems={menuItems} />
    </>
  );
}
