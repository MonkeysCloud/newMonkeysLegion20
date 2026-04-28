import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MonkeysLegion vs Laravel — Honest Comparison | MonkeysLegion',
  description: 'Laravel vs MonkeysLegion: when each one wins. A direct, fair comparison so you can decide which framework fits your project.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
