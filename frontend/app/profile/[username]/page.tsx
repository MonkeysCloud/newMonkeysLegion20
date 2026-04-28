import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/Footer';
import PackageCard from '../../components/marketplace/PackageCard';
import { getUserProfile, getMenu } from '@/lib/drupal';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  const profile = await getUserProfile(username);
  if (!profile) return { title: 'User Not Found' };
  return {
    title: `${profile.user.name} — Profile`,
    description: `${profile.user.name} has published ${profile.user.packageCount} packages on the MonkeysLegion marketplace.`,
  };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const [profile, menuItems] = await Promise.all([
    getUserProfile(username),
    getMenu('main'),
  ]);

  if (!profile) notFound();

  return (
    <>
      <Navbar menuItems={menuItems} />
      <main className="profile-page">
        <div className="container">
          <div className="profile-header">
            <div className="profile-avatar">
              {profile.user.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h1>{profile.user.name}</h1>
              <div className="profile-meta">
                <span>📦 {profile.user.packageCount} packages</span>
                <span>⭐ {profile.user.totalStars} stars</span>
                <span>📅 Joined {new Date(profile.user.joined).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <section>
            <h2 className="section-title" style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-6)' }}>
              Published Packages
            </h2>

            {profile.packages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h2>No packages yet</h2>
                <p>This user hasn&apos;t published any packages.</p>
              </div>
            ) : (
              <div className="packages-grid">
                {profile.packages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer menuItems={menuItems} />
    </>
  );
}
