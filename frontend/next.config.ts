import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cms.monkeyslegion.com' },
      { protocol: 'https', hostname: '**.run.app' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: 'nginx' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/jsonapi/:path*',
        destination: `${process.env.DRUPAL_BASE_URL || process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://nginx'}/jsonapi/:path*`,
      },
    ];
  },
};

export default nextConfig;
