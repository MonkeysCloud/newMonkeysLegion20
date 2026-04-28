import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MonkeysLegion vs Symfony — Honest Comparison | MonkeysLegion',
  description: 'Symfony vs MonkeysLegion: enterprise maturity vs modern defaults. A direct comparison to make an informed choice.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
