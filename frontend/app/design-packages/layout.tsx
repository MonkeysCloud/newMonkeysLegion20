import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Packages — All Framework Components | MonkeysLegion',
  description: 'Browse all 19+ MonkeysLegion packages: core, DI, HTTP, router, database, query, entity, migration, auth, validation, cache, session, template, events, logger, queue, files, i18n, mail, telemetry, CLI, and more.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
