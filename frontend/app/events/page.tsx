import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/Footer';
import { getEvents, getMenu } from '@/lib/drupal';

export const metadata: Metadata = {
  title: 'Events — MonkeysLegion',
  description:
    'Upcoming and past events, conferences, and meetups from the MonkeysLegion community.',
  openGraph: {
    title: 'MonkeysLegion Events',
    description:
      'Conferences, meetups, and community events from the MonkeysLegion ecosystem.',
    url: '/events',
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/events' },
};

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function EventsPage() {
  const [events, menuItems] = await Promise.all([
    getEvents(),
    getMenu('main'),
  ]);

  // Split into upcoming and past
  const now = new Date();
  const upcoming = events.filter(
    (e) => !e.startDate || new Date(e.startDate) >= now,
  );
  const past = events.filter(
    (e) => e.startDate && new Date(e.startDate) < now,
  );

  return (
    <>
      <Navbar menuItems={menuItems} />
      <main
        style={{
          paddingTop: 'calc(60px + var(--space-16))',
          paddingBottom: 'var(--space-20)',
        }}
      >
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            <div
              className="eyebrow"
              style={{
                margin: '0 auto var(--space-4)',
                justifyContent: 'center',
              }}
            >
              Events
            </div>
            <h1
              style={{
                fontSize: 'var(--text-4xl)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                marginBottom: 'var(--space-4)',
              }}
            >
              Conferences &amp;{' '}
              <span className="text-gradient">Meetups</span>
            </h1>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                maxWidth: 600,
                margin: '0 auto',
                lineHeight: 'var(--line-height-relaxed)',
              }}
            >
              Connect with the MonkeysLegion community. Attend conferences,
              workshops, and meetups around the world.
            </p>
          </div>

          {events.length > 0 ? (
            <>
              {/* Upcoming Events */}
              {upcoming.length > 0 && (
                <section style={{ marginBottom: 'var(--space-16)' }}>
                  <h2
                    style={{
                      fontSize: 'var(--text-2xl)',
                      fontWeight: 800,
                      marginBottom: 'var(--space-6)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-3)',
                    }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: '#10b981',
                        display: 'inline-block',
                        boxShadow: '0 0 8px #10b981',
                      }}
                    />
                    Upcoming
                  </h2>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(380px, 1fr))',
                      gap: 'var(--space-6)',
                    }}
                  >
                    {upcoming.map((event) => (
                      <Link
                        key={event.id}
                        href={`/events/${event.slug}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <article
                          className="glass-card"
                          style={{
                            height: '100%',
                            overflow: 'hidden',
                            transition: 'all var(--transition-base)',
                            borderLeft: '3px solid #10b981',
                          }}
                        >
                          <div style={{ padding: 'var(--space-6)' }}>
                            {/* Date badge */}
                            {event.startDate && (
                              <div
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 'var(--space-2)',
                                  background: 'hsla(160, 60%, 40%, 0.12)',
                                  color: '#10b981',
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: 'var(--radius-full)',
                                  fontSize: 'var(--text-xs)',
                                  fontWeight: 600,
                                  marginBottom: 'var(--space-4)',
                                }}
                              >
                                📅 {formatDate(event.startDate)}
                                {event.endDate &&
                                  ` — ${formatDate(event.endDate)}`}
                              </div>
                            )}

                            <h3
                              style={{
                                fontSize: 'var(--text-xl)',
                                fontWeight: 700,
                                marginBottom: 'var(--space-2)',
                                color: 'var(--color-text)',
                                lineHeight: 'var(--line-height-tight)',
                              }}
                            >
                              {event.title}
                            </h3>

                            {event.location && (
                              <p
                                style={{
                                  fontSize: 'var(--text-sm)',
                                  color: 'var(--color-primary-light)',
                                  marginBottom: 'var(--space-3)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 'var(--space-1)',
                                }}
                              >
                                📍 {event.location}
                              </p>
                            )}

                            <p
                              style={{
                                fontSize: 'var(--text-sm)',
                                color: 'var(--color-text-secondary)',
                                lineHeight: 'var(--line-height-relaxed)',
                                marginBottom: 'var(--space-4)',
                              }}
                            >
                              {event.summary}
                            </p>

                            <div
                              style={{
                                display: 'flex',
                                gap: 'var(--space-3)',
                                alignItems: 'center',
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 'var(--text-xs)',
                                  color: '#10b981',
                                  fontWeight: 600,
                                }}
                              >
                                View details →
                              </span>
                              {event.eventUrl && (
                                <a
                                  href={event.eventUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    fontSize: 'var(--text-xs)',
                                    color: 'var(--color-text-muted)',
                                    textDecoration: 'none',
                                  }}
                                >
                                  External link ↗
                                </a>
                              )}
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Past Events */}
              {past.length > 0 && (
                <section>
                  <h2
                    style={{
                      fontSize: 'var(--text-2xl)',
                      fontWeight: 800,
                      marginBottom: 'var(--space-6)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    Past Events
                  </h2>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(380px, 1fr))',
                      gap: 'var(--space-6)',
                    }}
                  >
                    {past.map((event) => (
                      <Link
                        key={event.id}
                        href={`/events/${event.slug}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <article
                          className="glass-card"
                          style={{
                            height: '100%',
                            overflow: 'hidden',
                            transition: 'all var(--transition-base)',
                            opacity: 0.7,
                          }}
                        >
                          <div style={{ padding: 'var(--space-6)' }}>
                            {event.startDate && (
                              <time
                                dateTime={event.startDate}
                                style={{
                                  fontSize: 'var(--text-xs)',
                                  color: 'var(--color-text-muted)',
                                  display: 'block',
                                  marginBottom: 'var(--space-3)',
                                }}
                              >
                                {formatDate(event.startDate)}
                              </time>
                            )}
                            <h3
                              style={{
                                fontSize: 'var(--text-lg)',
                                fontWeight: 700,
                                marginBottom: 'var(--space-2)',
                                color: 'var(--color-text)',
                              }}
                            >
                              {event.title}
                            </h3>
                            {event.location && (
                              <p
                                style={{
                                  fontSize: 'var(--text-xs)',
                                  color: 'var(--color-text-muted)',
                                }}
                              >
                                📍 {event.location}
                              </p>
                            )}
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          ) : (
            /* Empty state */
            <div
              style={{
                textAlign: 'center',
                padding: 'var(--space-20) 0',
              }}
            >
              <div
                style={{
                  fontSize: '4rem',
                  marginBottom: 'var(--space-6)',
                }}
              >
                🎪
              </div>
              <h2
                style={{
                  fontSize: 'var(--text-2xl)',
                  fontWeight: 700,
                  marginBottom: 'var(--space-4)',
                }}
              >
                Events Coming Soon
              </h2>
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  maxWidth: 500,
                  margin: '0 auto var(--space-8)',
                  lineHeight: 'var(--line-height-relaxed)',
                }}
              >
                We&apos;re planning conferences, workshops, and meetups.
                Check back soon for upcoming events!
              </p>
              <Link href="/" className="btn btn-primary">
                ← Back to home
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer menuItems={menuItems} />
    </>
  );
}
