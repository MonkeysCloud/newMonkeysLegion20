import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://monkeyslegion.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  /* ── Static pages ── */
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`,                 lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/framework`,        lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/features`,         lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/packages`,         lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/apex`,             lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/docs`,             lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/blog`,             lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/search`,           lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/compare-laravel`,  lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/compare-symfony`,  lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ];

  /* ── Dynamic doc pages from Drupal ── */
  let docPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(
      `${process.env.DRUPAL_BASE_URL || 'http://nginx'}/jsonapi/node/documentation`,
      { headers: { Accept: 'application/vnd.api+json' }, next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const data = await res.json();
      const nodes = Array.isArray(data.data) ? data.data : [];
      docPages = nodes.map((node: any) => {
        const a = node.attributes || node;
        const slug = a.field_slug || node.id;
        return {
          url: `${BASE_URL}/docs/${slug}`,
          lastModified: a.changed || now,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        };
      });
    }
  } catch {
    // Drupal unavailable — skip dynamic pages
  }

  return [...staticPages, ...docPages];
}
