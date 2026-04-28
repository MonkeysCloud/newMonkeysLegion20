export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/Footer';
import DocContent from '../../components/DocContent';
import { getEvent, getMenu } from '@/lib/drupal';

interface EventDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: EventDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: 'Not Found | MonkeysLegion Events' };
  return {
    title: `${event.title} | MonkeysLegion Events`,
    description: event.summary,
    openGraph: {
      title: event.title,
      description: event.summary,
      type: 'article',
    },
  };
}

export default async function EventDetailPage({
  params,
}: EventDetailProps) {
  const { slug } = await params;
  const [event, menuItems] = await Promise.all([
    getEvent(slug),
    getMenu('main'),
  ]);
  if (!event) notFound();

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <>
      <Navbar menuItems={menuItems} />
      <main
        style={{
          paddingTop: 'calc(60px + var(--space-16))',
          paddingBottom: 'var(--space-20)',
        }}
      >
        <article className="container" style={{ maxWidth: 780 }}>
          {/* Header */}
          <div style={{ marginBottom: 'var(--space-10)' }}>
            <Link
              href="/events"
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-primary-light)',
                marginBottom: 'var(--space-4)',
                display: 'block',
              }}
            >
              ← Back to Events
            </Link>

            <h1
              style={{
                fontSize: 'var(--text-4xl)',
                fontWeight: 900,
                lineHeight: 'var(--line-height-tight)',
                letterSpacing: '-0.03em',
                marginBottom: 'var(--space-4)',
              }}
            >
              {event.title}
            </h1>

            {/* Meta row */}
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-4)',
                alignItems: 'center',
                flexWrap: 'wrap',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--space-6)',
              }}
            >
              {event.startDate && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--space-1)',
                    background: 'hsla(160, 60%, 40%, 0.12)',
                    color: '#10b981',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 600,
                    fontSize: 'var(--text-xs)',
                  }}
                >
                  📅 {formatDate(event.startDate)}
                  {event.endDate && ` — ${formatDate(event.endDate)}`}
                </span>
              )}
              {event.location && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--space-1)',
                  }}
                >
                  📍 {event.location}
                </span>
              )}
            </div>

            {/* CTA */}
            {event.eventUrl && (
              <a
                href={event.eventUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ marginBottom: 'var(--space-8)', display: 'inline-block' }}
              >
                Register / More Info →
              </a>
            )}
          </div>

          {/* Body */}
          <DocContent
            body={event.body}
            className="prose"
            style={{
              color: 'var(--color-text-secondary)',
              lineHeight: 'var(--line-height-relaxed)',
              fontSize: 'var(--text-base)',
            }}
          />
        </article>
      </main>
      <Footer menuItems={menuItems} />
    </>
  );
}
