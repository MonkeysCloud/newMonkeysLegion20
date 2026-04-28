import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features — Deep Dive | MonkeysLegion',
  description: 'Explore every capability of the MonkeysLegion framework: routing, authentication, database, validation, caching, events, queues, files, and more.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
