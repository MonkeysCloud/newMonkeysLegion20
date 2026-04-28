import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: [
      'localhost',
      'nginx',
      'monkeyslegion.com',
    ],
  },
  async rewrites() {
    return [
      {
        source: '/jsonapi/:path*',
        destination: `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://nginx'}/jsonapi/:path*`,
      },
    ];
  },
};

export default nextConfig;
