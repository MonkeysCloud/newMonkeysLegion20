import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from './components/auth/AuthProvider';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://monkeyslegion.com'),
  title: {
    default: 'MonkeysLegion v2.0 — PHP 8.4 Framework with Built-in AI Orchestration | MonkeysCloud',
    template: '%s | MonkeysLegion',
  },
  description: 'The first PHP 8.4 framework with a full AI orchestration engine built in. 26 packages, compiled DI, property hooks. Faster than Laravel and Symfony.',
  keywords: 'PHP framework, PHP 8.4, property hooks, AI orchestration PHP, LangChain PHP, PHP AI framework, multi-model routing, AI guardrails, attribute routing, MonkeysLegion, Apex AI, Laravel alternative, Symfony alternative, PSR-15, compiled DI, Argon2id, JWT authentication, MCP server PHP',
  authors: [{ name: 'MonkeysCloud' }],
  creator: 'MonkeysCloud',
  publisher: 'MonkeysCloud',
  openGraph: {
    title: 'MonkeysLegion v2.0 — PHP, reimagined for the AI era',
    description: 'Multi-model routing, pipelines, guardrails, and agent crews in one Composer package. 26 PSR-compliant packages. 6× faster than Laravel at 18% the memory.',
    url: 'https://monkeyslegion.com',
    siteName: 'MonkeysLegion',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MonkeysLegion v2.0 — PHP 8.4 Framework with AI Orchestration',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MonkeysLegion v2.0 is here',
    description: 'The first PHP framework with AI orchestration built in. Apex ships with multi-provider routing, pipelines, guardrails, and crews — no wrappers required.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'MonkeysLegion',
              softwareVersion: '2.0',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Linux, macOS, Windows (PHP 8.4+)',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              license: 'https://opensource.org/licenses/MIT',
              description: 'Attribute-first PHP 8.4 framework with built-in AI orchestration, compiled DI, and 26 PSR-compliant packages.',
              url: 'https://monkeyslegion.com',
              downloadUrl: 'https://github.com/MonkeysCloud/MonkeysLegion-Skeleton',
            }),
          }}
        />
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
