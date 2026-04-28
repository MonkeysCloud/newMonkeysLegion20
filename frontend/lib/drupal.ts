/**
 * Drupal JSON:API client for the MonkeysLegion v2.0 site.
 *
 * All content is fetched from Drupal. When Drupal is unavailable,
 * fallback data is returned to allow the site to render in dev mode.
 */

import type {
  SectionData,
  FeatureTileData,
  BenchmarkData,
  SecurityFeatureData,
  PackageData,
  BlogPostData,
  BlogCategoryData,
  DocPageData,
  SearchResponse,
  SearchResult,
  TileGroup,
  DrupalNode,
  JsonApiResponse,
  CanvasLayout,
  MarketplacePackage,
  MarketplaceResponse,
  MarketplaceFilters,
  PackageCategory,
  UserProfile,
} from './types';

/** Convert a Drupal body field to HTML — handles both HTML and Markdown formats */
function resolveBodyHtml(body: any): string {
  if (!body) return '';
  const format = body.format || 'full_html';
  const raw = String(body.value || '');
  const processed = String(body.processed || '');
  if (format === 'markdown' && raw) {
    // Send raw markdown to the client, where react-markdown will render it safely.
    return raw;
  }
  return processed || raw;
}

const DRUPAL_BASE_URL = process.env.DRUPAL_BASE_URL || process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || 'http://nginx';

/* ============================================================================
   Core fetch helper
   ============================================================================ */

async function drupalFetch<T = unknown>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const url = `${DRUPAL_BASE_URL}/${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        ...options?.headers,
      },
      cache: 'no-store', // Disable cache in dev to avoid stale data
    });

    if (!response.ok) {
      console.error(`[drupalFetch] ${response.status} for ${url}`);
      return null;
    }
    return response.json();
  } catch (err) {
    console.error(`[drupalFetch] Error fetching ${endpoint}:`, err);
    return null;
  }
}

/** Safely coerce data.data to an array of DrupalNode.
 *  Handles both nested { attributes: {...} } and flat format where fields are at top level. */
function toNodeArray(data: JsonApiResponse | null): DrupalNode[] {
  if (!data || !Array.isArray(data.data)) return [];
  return (data.data as any[]).map((item) => {
    // If the item already has an 'attributes' sub-object, use as-is
    if (item.attributes && typeof item.attributes === 'object' && !Array.isArray(item.attributes)) {
      return item as DrupalNode;
    }
    // Flat format: all fields are at top level. Extract known keys and wrap the rest as attributes.
    const { id, type, relationships, links, meta, ...rest } = item;
    return { id, type, attributes: rest, relationships } as DrupalNode;
  });
}

/* ============================================================================
   Canvas Layout
   ============================================================================ */

export async function getCanvasLayout(path: string): Promise<CanvasLayout | null> {
  try {
    const url = `${DRUPAL_BASE_URL}/api/canvas-layout-by-path?path=${encodeURIComponent(path)}`;
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

/* ============================================================================
   Menu
   ============================================================================ */

export async function getMenu(menuName: string = 'main') {
  const res = await fetch(`${DRUPAL_BASE_URL}/api/menu/${menuName}`, { cache: 'no-store' });
  if (!res.ok) {
    console.error(`Failed to fetch menu ${menuName}`);
    return [];
  }
  return res.json();
}

/* ============================================================================
   Sections — Legacy managed homepage sections
   ============================================================================ */

export async function getSections(): Promise<SectionData[]> {
  const data = await drupalFetch<JsonApiResponse>('jsonapi/node/section?sort=field_sort_order');
  return toNodeArray(data).map((node) => {
    const a = node.attributes || ({} as Record<string, unknown>);
    return {
      id: node.id,
      type: (a.field_section_type as string) || 'hero',
      title: (a.title as string) || '',
      subtitle: (a.field_subtitle as string) || undefined,
      body: (a.body as { value?: string })?.value || undefined,
      data: a.field_data ? JSON.parse(a.field_data as string) : undefined,
      sortOrder: (a.field_sort_order as number) || 0,
      backgroundStyle: (a.field_background_style as string) || 'default',
    } as SectionData;
  });
}

/* ============================================================================
   Feature Tiles
   ============================================================================ */

export async function getFeatureTiles(group?: TileGroup): Promise<FeatureTileData[]> {
  const filter = group ? `&filter[field_section_group]=${group}` : '';
  const data = await drupalFetch<JsonApiResponse>(
    `jsonapi/node/feature_tile?sort=field_sort_order${filter}`
  );
  return toNodeArray(data).map((node) => {
    const a = node.attributes || ({} as Record<string, unknown>);
    return {
      id: node.id,
      icon: (a.field_icon as string) || '📦',
      title: (a.title as string) || '',
      description: ((a.field_description as { value?: string })?.value || a.field_description as string) || '',
      sortOrder: (a.field_sort_order as number) || 0,
      sectionGroup: (a.field_section_group as TileGroup) || 'features_grid',
    };
  });
}

/* ============================================================================
   Benchmarks
   ============================================================================ */

export async function getBenchmarks(): Promise<BenchmarkData[]> {
  const data = await drupalFetch<JsonApiResponse>('jsonapi/node/benchmark_entry?sort=field_sort_order');
  return toNodeArray(data).map((node) => {
    const a = node.attributes || ({} as Record<string, unknown>);
    return {
      id: node.id,
      operation: (a.title as string) || '',
      mlValue: (a.field_ml_value as number) || 0,
      mlSuffix: (a.field_ml_suffix as string) || '',
      vsLaravel: (a.field_vs_laravel as string) || '',
      vsSymfony: (a.field_vs_symfony as string) || '',
      sortOrder: (a.field_sort_order as number) || 0,
    };
  });
}

/* ============================================================================
   Security Features
   ============================================================================ */

export async function getSecurityFeatures(): Promise<SecurityFeatureData[]> {
  const data = await drupalFetch<JsonApiResponse>('jsonapi/node/security_feature?sort=field_sort_order');
  return toNodeArray(data).map((node) => {
    const a = node.attributes || ({} as Record<string, unknown>);
    return {
      id: node.id,
      feature: (a.title as string) || '',
      mlStatus: (a.field_ml_status as string) || 'yes',
      laravelStatus: (a.field_laravel_status as string) || 'no',
      symfonyStatus: (a.field_symfony_status as string) || 'no',
      laravelNote: (a.field_laravel_note as string) || '',
      symfonyNote: (a.field_symfony_note as string) || '',
      sortOrder: (a.field_sort_order as number) || 0,
    } as SecurityFeatureData;
  });
}

/* ============================================================================
   Package Info
   ============================================================================ */

export async function getPackages(): Promise<PackageData[]> {
  const data = await drupalFetch<JsonApiResponse>('jsonapi/node/package_info?sort=field_sort_order');
  return toNodeArray(data).map((node) => {
    const a = node.attributes || ({} as Record<string, unknown>);
    return {
      id: node.id,
      name: (a.title as string) || '',
      version: (a.field_version as string) || '',
      purpose: (a.field_purpose as string) || '',
      githubUrl: (a.field_github_url as string) || '',
      sortOrder: (a.field_sort_order as number) || 0,
    };
  });
}

/* ============================================================================
   Blog
   ============================================================================ */

/** Build a blog URL from Drupal's path alias, or fall back to date-based pattern. */
export function blogUrl(created: string, slug: string, alias?: string | null): string {
  // If Drupal provides a path alias (from Pathauto), use it directly
  if (alias) {
    // alias is like "/blog/2026/04/my-slug" — strip leading /blog if present
    // since we prefix /blog in Next.js routing
    if (alias.startsWith('/blog/')) return alias;
    if (alias.startsWith('/')) return `/blog${alias}`;
    return `/blog/${alias}`;
  }
  // Fallback: date-based URL matching Drupal's html_month format
  if (!created) return `/blog/${slug}`;
  const d = new Date(created);
  const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  return `/blog/${ym}/${slug}`;
}

/** Extract image URL from JSON:API data — handles both flat (inline) and standard (included) formats */
function resolveImageUrl(data: any, node: any): string | undefined {
  const a = node.attributes || node;

  // 1. Flat format: field_image is embedded inline with uri
  const inlineImage = (a as any).field_image;
  if (inlineImage && typeof inlineImage === 'object') {
    const uri = inlineImage.uri?.url || inlineImage.uri?.value;
    if (uri && typeof uri === 'string') {
      // Fix mangled paths from JSON:API (sometimes includes /jsonapi/node/ prefix)
      const cleanUri = uri.replace(/^\/jsonapi\/node\//, '/');
      // Prepend CMS base URL for relative paths so images load from Drupal
      if (cleanUri.startsWith('/')) return `${DRUPAL_BASE_URL}${cleanUri}`;
      if (cleanUri.startsWith('http')) return cleanUri;
      return `${DRUPAL_BASE_URL}/${cleanUri}`;
    }
  }

  // 2. Standard format: look in relationships + included
  const imageRel = node.relationships?.field_image?.data;
  if (!imageRel || !data?.included) return undefined;
  const imageId = Array.isArray(imageRel) ? imageRel[0]?.id : imageRel.id;
  if (!imageId) return undefined;
  const fileEntity = (data.included as any[]).find((i: any) => i.id === imageId);
  if (!fileEntity) return undefined;
  const attrs = fileEntity.attributes || fileEntity;
  const uri = attrs.uri?.url || attrs.url;
  if (!uri) return undefined;
  // Prepend CMS base URL for relative paths
  if (uri.startsWith('/')) return `${DRUPAL_BASE_URL}${uri}`;
  if (uri.startsWith('http')) return uri;
  return `${DRUPAL_BASE_URL}/${uri}`;
}

/** Extract tag names from inline field_tags (flat JSON:API format) or included data */
function extractTags(a: Record<string, unknown>): string[] {
  const tags = (a as any).field_tags;
  if (Array.isArray(tags)) {
    return tags.map((t: any) => t.name || t.attributes?.name).filter(Boolean) as string[];
  }
  return [];
}

export async function getBlogPosts(
  page = 0,
  category?: string,
  pageSize = 12
): Promise<{ posts: BlogPostData[]; total: number }> {
  const offset = page * pageSize;
  const catFilter = category ? `&filter[field_tags.name]=${encodeURIComponent(category)}` : '';
  const data = await drupalFetch<JsonApiResponse>(
    `jsonapi/node/blog?sort=-created&page[limit]=${pageSize}&page[offset]=${offset}${catFilter}&include=field_tags,field_image`
  );
  const nodes = toNodeArray(data);
  const posts = nodes.map((node) => {
    const a = node.attributes || ({} as Record<string, unknown>);
    return {
      id: node.id,
      slug: (a as any).field_slug || node.id,
      pathAlias: (a as any).path?.alias || undefined,
      title: (a.title as string) || '',
      summary: stripHtml(((a as any).field_summary as any)?.processed || ((a as any).field_summary as any)?.value || '', 300),
      body: resolveBodyHtml(a.body),
      bodyFormat: String((a.body as any)?.format || 'full_html'),
      featuredImage: resolveImageUrl(data, node),
      category: extractTags(a)[0] || '',
      tags: extractTags(a),
      author: ((a as any).field_author as string) || 'MonkeysCloud',
      readTime: 5,
      created: (a.created as string) || '',
      changed: (a.changed as string) || '',
    } as BlogPostData;
  });

  return { posts, total: data?.meta?.count || posts.length };
}

export async function getBlogPost(slug: string): Promise<BlogPostData | null> {
  // Load all blog posts and match by field_slug or path alias (last segment)
  // Note: filter[field_slug] is not supported by Drupal's JSON:API for this content type
  const data = await drupalFetch<JsonApiResponse>(
    `jsonapi/node/blog?include=field_tags,field_image`
  );
  let nodes = toNodeArray(data);
  nodes = nodes.filter((n) => {
    const a = (n.attributes || n) as any;
    // Match by field_slug
    if (a.field_slug === slug) return true;
    // Match by last segment of path alias
    const alias: string = a.path?.alias || '';
    const lastSegment = alias.split('/').pop() || '';
    return lastSegment === slug;
  });

  if (nodes.length === 0) return null;

  const node = nodes[0];
  const a = node.attributes || ({} as Record<string, unknown>);
  return {
    id: node.id,
    slug: (a as any).field_slug || slug,
    pathAlias: (a as any).path?.alias || undefined,
    title: (a.title as string) || '',
    summary: stripHtml(((a as any).field_summary as any)?.processed || ((a as any).field_summary as any)?.value || '', 300),
    body: resolveBodyHtml(a.body),
    bodyFormat: String((a.body as any)?.format || 'full_html'),
    featuredImage: resolveImageUrl(data, node),
    category: extractTags(a)[0] || '',
    tags: extractTags(a),
    author: ((a as any).field_author as string) || 'MonkeysCloud',
    readTime: 5,
    created: (a.created as string) || '',
    changed: (a.changed as string) || '',
  };
}

export async function getBlogCategories(): Promise<BlogCategoryData[]> {
  const data = await drupalFetch<JsonApiResponse>('jsonapi/taxonomy_term/tags?sort=weight');
  return toNodeArray(data).map((term) => {
    const a = term.attributes;
    return {
      id: term.id,
      name: (a.name as string) || '',
      slug: (a.name as string || '').toLowerCase().replace(/\s+/g, '-'),
    };
  });
}

/* ============================================================================
   News
   ============================================================================ */

export interface NewsPostData {
  id: string;
  slug: string;
  pathAlias?: string;
  title: string;
  summary: string;
  body: string;
  bodyFormat?: string;
  featuredImage?: string;
  author: string;
  created: string;
  changed: string;
}

/** Build a news URL from Drupal's path alias or slug. */
export function newsUrl(created: string, slug: string, alias?: string | null): string {
  if (alias) {
    if (alias.startsWith('/news/')) return alias;
    if (alias.startsWith('/')) return `/news${alias}`;
    return `/news/${alias}`;
  }
  if (!created) return `/news/${slug}`;
  const d = new Date(created);
  const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  return `/news/${ym}/${slug}`;
}

export async function getNewsPosts(
  page = 0,
  pageSize = 20
): Promise<{ posts: NewsPostData[]; total: number }> {
  const offset = page * pageSize;
  const data = await drupalFetch<JsonApiResponse>(
    `jsonapi/node/news?sort=-created&page[limit]=${pageSize}&page[offset]=${offset}&include=field_image`
  );
  const nodes = toNodeArray(data);
  const posts = nodes.map((node) => {
    const a = node.attributes || ({} as Record<string, unknown>);
    return {
      id: node.id,
      slug: (a as any).field_slug || node.id,
      pathAlias: (a as any).path?.alias || undefined,
      title: (a.title as string) || '',
      summary: stripHtml(((a as any).field_summary as any)?.processed || ((a as any).field_summary as any)?.value || '', 300),
      body: resolveBodyHtml(a.body),
      bodyFormat: String((a.body as any)?.format || 'full_html'),
      featuredImage: resolveImageUrl(data, node),
      author: ((a as any).field_author as string) || 'MonkeysCloud',
      created: (a.created as string) || '',
      changed: (a.changed as string) || '',
    } as NewsPostData;
  });

  return { posts, total: data?.meta?.count || posts.length };
}

export async function getNewsPost(slug: string): Promise<NewsPostData | null> {
  const data = await drupalFetch<JsonApiResponse>(
    `jsonapi/node/news?include=field_image`
  );
  let nodes = toNodeArray(data);
  nodes = nodes.filter((n) => {
    const a = (n.attributes || n) as any;
    if (a.field_slug === slug) return true;
    const alias: string = a.path?.alias || '';
    const lastSegment = alias.split('/').pop() || '';
    return lastSegment === slug;
  });

  if (nodes.length === 0) return null;

  const node = nodes[0];
  const a = node.attributes || ({} as Record<string, unknown>);
  return {
    id: node.id,
    slug: (a as any).field_slug || slug,
    pathAlias: (a as any).path?.alias || undefined,
    title: (a.title as string) || '',
    summary: stripHtml(((a as any).field_summary as any)?.processed || ((a as any).field_summary as any)?.value || '', 300),
    body: resolveBodyHtml(a.body),
    bodyFormat: String((a.body as any)?.format || 'full_html'),
    featuredImage: resolveImageUrl(data, node),
    author: ((a as any).field_author as string) || 'MonkeysCloud',
    created: (a.created as string) || '',
    changed: (a.changed as string) || '',
  };
}

/* ============================================================================
   Documentation (versioned)
   ============================================================================ */

export interface DocPage {
  id: string;
  title: string;
  slug: string;
  body: string;
  bodyFormat?: string;
  weight: number;
  package?: string;
  version: string;
  category?: { id: string; name: string };
  group?: { id: string; name: string };
}

/** Fetch all doc pages for a given version (for sidebar navigation) */
/**
 * Package slug → category mapping.
 * Mirrors the same categorisation used on the /packages page so docs and
 * packages stay in sync without manual Drupal taxonomy tagging.
 */
const packageCategoryMap: Record<string, string> = {
  core: 'Foundation',
  di: 'Foundation',
  mlc: 'Foundation',
  monkeyslegion: 'Foundation',
  http: 'HTTP & Routing',
  router: 'HTTP & Routing',
  database: 'Data Layer',
  query: 'Data Layer',
  entity: 'Data Layer',
  migration: 'Data Layer',
  auth: 'Auth & Security',
  validation: 'Auth & Security',
  session: 'Auth & Security',
  template: 'Rendering',
  cache: 'Infrastructure',
  events: 'Infrastructure',
  queue: 'Infrastructure',
  schedule: 'Infrastructure',
  sockets: 'Infrastructure',
  logger: 'Operations',
  telemetry: 'Operations',
  files: 'Operations',
  mail: 'Operations',
  i18n: 'Operations',
  openapi: 'Operations',
  cli: 'Tooling',
  'dev-server': 'Tooling',
  devtools: 'Tooling',
  apex: 'AI (Apex)',
};

/**
 * Infer the doc group + category from the slug path structure when the
 * Drupal taxonomy fields are not set.  Slug patterns:
 *   package/<name> → group "Packages", category from packageCategoryMap
 *   api/*          → group "API Reference"
 *   guides/*       → group "Guides"
 *   getting-started, deployment, etc. → group "Getting Started"
 */
function inferGroupAndCategory(
  slug: string,
  existingGroup: DocPage['group'],
  existingCategory: DocPage['category'],
): { group: DocPage['group']; category: DocPage['category'] } {
  // If both already set in Drupal, honour them
  if (existingGroup && existingCategory) return { group: existingGroup, category: existingCategory };

  const parts = slug.split('/');
  const prefix = parts[0]; // "package", "api", "guides", etc.
  const name = parts.slice(1).join('/'); // e.g. "core", "dev-server"

  let group = existingGroup;
  let category = existingCategory;

  if (prefix === 'package' && name) {
    if (!group) group = { id: 'inferred-packages', name: 'Packages' };
    if (!category) {
      const catName = packageCategoryMap[name] || 'General';
      category = { id: `inferred-cat-${catName}`, name: catName };
    }
  } else if (prefix === 'api') {
    if (!group) group = { id: 'inferred-api', name: 'API Reference' };
    if (!category) category = { id: 'inferred-cat-api', name: 'API Reference' };
  } else if (prefix === 'guides' || prefix === 'guide') {
    if (!group) group = { id: 'inferred-guides', name: 'Guides' };
    if (!category) category = { id: 'inferred-cat-guides', name: 'Guides' };
  } else {
    // Top-level: getting-started, deployment, etc.
    if (!group) group = { id: 'inferred-getting-started', name: 'Getting Started' };
    if (!category) category = { id: 'inferred-cat-getting-started', name: 'Getting Started' };
  }

  return { group, category };
}

export async function getDocPages(version: string = '2.0'): Promise<DocPage[]> {
  // Drupal 11 flat JSON:API doesn't support sort/include on custom fields,
  // so we fetch nodes + categories + groups separately and join client-side
  const [data, catData, groupData] = await Promise.all([
    drupalFetch<JsonApiResponse>(`jsonapi/node/documentation`),
    drupalFetch<JsonApiResponse>(`jsonapi/taxonomy_term/doc_category`),
    drupalFetch<JsonApiResponse>(`jsonapi/taxonomy_term/doc_group`),
  ]);
  if (!data || !Array.isArray(data.data)) return [];

  // Build UUID → name maps
  const catMap = new Map<string, string>();
  if (catData && Array.isArray(catData.data)) {
    for (const term of catData.data as any[]) {
      const t: any = term.attributes || term;
      catMap.set(term.id, String(t.name || ''));
    }
  }
  const groupMap = new Map<string, string>();
  if (groupData && Array.isArray(groupData.data)) {
    for (const term of groupData.data as any[]) {
      const t: any = term.attributes || term;
      groupMap.set(term.id, String(t.name || ''));
    }
  }

  return (data.data as DrupalNode[])
    .map((node) => {
      const a: any = node.attributes || node;
      // Drupal 11 flat mode: entity references are at root, not under relationships
      const catRef = (node.relationships as any)?.field_doc_category?.data
        || (node as any).field_doc_category;
      const catId = catRef?.id;
      const grpRef = (node.relationships as any)?.field_doc_group?.data
        || (node as any).field_doc_group;
      const grpId = grpRef?.id;
      // Use field_slug if available, otherwise extract from path alias (strip /docs/ prefix)
      const pathAlias: string = a.path?.alias || '';
      const aliasSlug = pathAlias.replace(/^\/docs\//, '');
      const slug = String(a.field_slug || aliasSlug || node.id);

      // Resolve Drupal taxonomy references (when set)
      const drupalCategory = catId && catMap.has(catId)
        ? { id: catId, name: catMap.get(catId)! }
        : undefined;
      const drupalGroup = grpId && groupMap.has(grpId)
        ? { id: grpId, name: groupMap.get(grpId)! }
        : undefined;

      // Auto-infer group + category from slug when not set in Drupal
      const { group, category } = inferGroupAndCategory(slug, drupalGroup, drupalCategory);

      return {
        id: node.id,
        title: String(a.title || ''),
        slug,
        body: resolveBodyHtml(a.body),
        bodyFormat: String(a.body?.format || 'full_html'),
        weight: Number(a.field_weight || 0),
        package: a.field_package ? String(a.field_package) : undefined,
        version: String(a.field_doc_version || '2.0'),
        category,
        group,
      };
    })
    .sort((a, b) => a.weight - b.weight);
}

/** Fetch a single doc page by slug — returns the highest version and all available versions */
export async function getDocPage(
  slug: string,
  requestedVersion?: string
): Promise<{ doc: DocPage; availableVersions: string[] } | null> {
  const all = await getDocPages();
  // Find all docs with this slug (different versions)
  const matches = all.filter((d) => d.slug === slug);
  if (matches.length === 0) return null;

  // Collect available versions (sorted descending)
  const availableVersions = [...new Set(matches.map((d) => d.version))]
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

  // Pick the requested version, or the highest
  const targetVersion = requestedVersion || availableVersions[0];
  const doc = matches.find((d) => d.version === targetVersion) || matches[0];

  return { doc, availableVersions };
}

/** Fetch distinct doc versions available */
export async function getDocVersions(): Promise<string[]> {
  const data = await drupalFetch<JsonApiResponse>('jsonapi/node/documentation?fields[node--documentation]=field_doc_version');
  if (!data || !Array.isArray(data.data)) return ['2.0'];
  const versions = [...new Set((data.data as DrupalNode[]).map((n) => { const a = (n.attributes || n) as any; return a?.field_doc_version || '2.0'; }))];
  return versions.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
}

/** Fetch sidebar docs for a specific version (or all if no version specified) */
export async function getDocSidebar(version?: string): Promise<DocPage[]> {
  const all = await getDocPages();
  if (!version) return all;

  // For versioned sidebar: for each slug, pick the requested version (or highest)
  const slugMap = new Map<string, DocPage>();
  for (const doc of all) {
    if (doc.version !== version) continue;
    slugMap.set(doc.slug, doc);
  }
  // Fill in any slugs not covered by the requested version (use highest)
  const highestMap = new Map<string, DocPage>();
  for (const doc of all) {
    const existing = highestMap.get(doc.slug);
    if (!existing || doc.version.localeCompare(existing.version, undefined, { numeric: true }) > 0) {
      highestMap.set(doc.slug, doc);
    }
  }
  // Merge: prefer version-specific, fallback to highest
  for (const [slug, doc] of highestMap) {
    if (!slugMap.has(slug)) slugMap.set(slug, doc);
  }
  return [...slugMap.values()].sort((a, b) => a.weight - b.weight);
}

/* ============================================================================
   Package list — driven by Doc Group = "Packages" taxonomy
   ============================================================================ */

export interface PackageInfo {
  name: string;        // composer package name (field_package)
  title: string;       // human title
  version: string;     // field_doc_version
  category: string;    // from doc_category taxonomy
  docsSlug: string;    // slug for /docs/... link
  weight: number;
}

/** Icon map keyed by category name */
export const packageCategoryIcons: Record<string, string> = {
  Foundation: '🏗️',
  'HTTP & Routing': '🌐',
  'Data Layer': '🗄️',
  'Auth & Security': '🔐',
  'Templates & Assets': '📝',
  Rendering: '📝',
  Infrastructure: '⚡',
  'Background & Events': '⚡',
  Operations: '📊',
  Packages: '📦',
  Tooling: '🔧',
  'AI (Apex)': '🧠',
};

/** Color map keyed by category name */
export const packageCategoryColors: Record<string, string> = {
  Foundation: '#8b5cf6',
  'HTTP & Routing': '#3b82f6',
  'Data Layer': '#06b6d4',
  'Auth & Security': '#10b981',
  'Templates & Assets': '#f59e0b',
  Rendering: '#f59e0b',
  Infrastructure: '#ec4899',
  'Background & Events': '#ec4899',
  Operations: '#f97316',
  Packages: '#6366f1',
  Tooling: '#6b7280',
  'AI (Apex)': '#a855f7',
};

/**
 * Fetch all packages from doc nodes tagged with Doc Group = "Packages".
 * Returns structured data for the /packages listing page.
 */
export async function getPackageList(): Promise<PackageInfo[]> {
  const all = await getDocPages();
  return all
    .filter((doc) => doc.group?.name === 'Packages' && doc.package)
    .map((doc) => ({
      name: doc.package!,
      title: doc.title,
      version: doc.version,
      category: doc.category?.name || 'General',
      docsSlug: doc.slug,
      weight: doc.weight,
    }));
}

/* ============================================================================
   Search — Drupal Search API with JSON:API fallback
   ============================================================================ */

/** Helper: strip HTML and truncate */
function stripHtml(html: string, maxLen = 180): string {
  const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text;
}

/** Determine content type from Search API node type string */
function resolveContentType(typeStr: string): SearchResult['type'] {
  if (typeStr.includes('documentation')) return 'documentation';
  if (typeStr.includes('blog')) return 'blog';
  if (typeStr.includes('news')) return 'news';
  if (typeStr.includes('event')) return 'event';
  return 'documentation';
}

/** Build URL from content type and slug/id */
function resolveUrl(type: SearchResult['type'], slug: string, id: string, created?: string, alias?: string | null): string {
  const s = slug || id;
  switch (type) {
    case 'documentation': {
      // If alias starts with /docs/, use it directly (strip leading /)
      if (alias && alias.startsWith('/docs/')) return alias;
      return `/docs/${s}`;
    }
    case 'blog': return blogUrl(created || '', s, alias);
    case 'news': return `/news/${s}`;
    case 'event': return `/events/${s}`;
    default: return `/${s}`;
  }
}

/** Primary: Search via Drupal Search API index (fulltext) */
async function searchViaSearchApi(query: string, page: number, pageSize: number): Promise<SearchResponse> {
  const q = encodeURIComponent(query.trim());
  const data = await drupalFetch<JsonApiResponse>(
    `jsonapi/index/content_search?filter[fulltext]=${q}&page[limit]=${pageSize}&page[offset]=${page * pageSize}`
  );

  if (!data || !Array.isArray(data.data) || data.data.length === 0) {
    return { results: [], total: 0, page, pageSize };
  }

  // jsonapi_search_api returns flat items (fields at top level, not under attributes)
  const results: SearchResult[] = (data.data as any[]).map((item) => {
    const type = resolveContentType(item.type || '');
    const slug = item.field_slug || '';
    const body = item.body?.processed || item.body?.value || '';
    const summary = item.field_summary?.value || item.field_summary?.processed || '';
    return {
      id: item.id,
      type,
      title: item.title || '',
      excerpt: stripHtml(summary || body),
      url: resolveUrl(type, slug, item.id, item.created, item.path?.alias),
      category: undefined,
      version: type === 'documentation' ? (item.field_doc_version || '2.0') : undefined,
      date: item.created || item.field_event_date?.value || undefined,
    };
  });

  return { results, total: (data as any)?.meta?.count || results.length, page, pageSize };
}

/** Fallback: search via JSON:API CONTAINS filter across all content types */
async function searchViaJsonApi(query: string, page: number, pageSize: number): Promise<SearchResponse> {
  const q = encodeURIComponent(query.trim());

  const [docsData, blogData, newsData, eventData, packagesRes, usersRes] = await Promise.all([
    drupalFetch<JsonApiResponse>(
      `jsonapi/node/documentation?filter[title][operator]=CONTAINS&filter[title][value]=${q}&sort=-changed&page[limit]=10&include=field_doc_category`
    ),
    drupalFetch<JsonApiResponse>(
      `jsonapi/node/blog?filter[title][operator]=CONTAINS&filter[title][value]=${q}&sort=-created&page[limit]=10`
    ),
    drupalFetch<JsonApiResponse>(
      `jsonapi/node/news?filter[title][operator]=CONTAINS&filter[title][value]=${q}&sort=-created&page[limit]=10`
    ),
    drupalFetch<JsonApiResponse>(
      `jsonapi/node/event?filter[title][operator]=CONTAINS&filter[title][value]=${q}&sort=-created&page[limit]=10`
    ),
    // Marketplace packages search
    drupalFetch<{ packages: Array<{ id: string; slug: string; title: string; summary: string; version: string; icon: string; stars: number; downloads: number; category?: { name: string } }> }>(
      `api/marketplace/packages?search=${q}`
    ),
    // Users search
    drupalFetch<{ users: Array<{ uid: number; uuid: string; name: string; slug: string; avatarUrl: string; bio: string }> }>(
      `api/search-users?q=${q}`
    ),
  ]);

  const results: SearchResult[] = [];
  const docsIncluded = (docsData as any)?.included || [];

  for (const node of toNodeArray(docsData)) {
    const a = node.attributes || (node as any);
    const catId = (node.relationships as any)?.field_doc_category?.data?.id;
    const catTerm = docsIncluded.find((i: any) => i.id === catId);
    const docAlias: string = (a as any).path?.alias || '';
    const docAliasSlug = docAlias.replace(/^\/docs\//, '');
    results.push({
      id: node.id, type: 'documentation',
      title: (a.title as string) || '',
      excerpt: stripHtml((a.body as any)?.processed || (a.body as any)?.value || ''),
      url: docAlias.startsWith('/docs/') ? docAlias : `/docs/${(a as any).field_slug || docAliasSlug || node.id}`,
      category: catTerm?.attributes?.name || undefined,
      version: (a as any).field_doc_version || '2.0',
    });
  }
  for (const node of toNodeArray(blogData)) {
    const a = node.attributes || (node as any);
    const created = (a.created as string) || '';
    const bSlug = (a as any).field_slug || node.id;
    const bAlias = (a as any).path?.alias || undefined;
    results.push({
      id: node.id, type: 'blog',
      title: (a.title as string) || '',
      excerpt: stripHtml((a as any).field_summary?.value || (a.body as any)?.processed || ''),
      url: blogUrl(created, bSlug, bAlias),
      date: created || undefined,
    });
  }
  for (const node of toNodeArray(newsData)) {
    const a = node.attributes || (node as any);
    results.push({
      id: node.id, type: 'news',
      title: (a.title as string) || '',
      excerpt: stripHtml((a as any).field_summary?.value || (a.body as any)?.processed || ''),
      url: `/news/${(a as any).field_slug || node.id}`,
      date: (a.created as string) || undefined,
    });
  }
  for (const node of toNodeArray(eventData)) {
    const a = node.attributes || (node as any);
    results.push({
      id: node.id, type: 'event',
      title: (a.title as string) || '',
      excerpt: stripHtml((a as any).field_summary?.value || (a.body as any)?.processed || ''),
      url: `/events/${(a as any).field_slug || node.id}`,
      date: (a as any).field_event_date?.value || undefined,
    });
  }

  // Marketplace packages
  if (packagesRes && Array.isArray(packagesRes.packages)) {
    for (const pkg of packagesRes.packages) {
      results.push({
        id: String(pkg.id), type: 'package',
        title: pkg.title,
        excerpt: pkg.summary || '',
        url: `/marketplace/${pkg.slug}`,
        version: pkg.version,
        category: pkg.category?.name,
      });
    }
  }

  // Users
  if (usersRes && Array.isArray(usersRes.users)) {
    for (const u of usersRes.users) {
      results.push({
        id: String(u.uid), type: 'user',
        title: u.name,
        excerpt: u.bio || '',
        url: `/u/${u.slug}`,
        avatarUrl: u.avatarUrl || undefined,
      });
    }
  }

  // Sort by relevance
  const lowerQ = query.toLowerCase();
  results.sort((a, b) => {
    const aScore = a.title.toLowerCase() === lowerQ ? 0 : a.title.toLowerCase().startsWith(lowerQ) ? 1 : 2;
    const bScore = b.title.toLowerCase() === lowerQ ? 0 : b.title.toLowerCase().startsWith(lowerQ) ? 1 : 2;
    return aScore - bScore;
  });

  const start = page * pageSize;
  return { results: results.slice(start, start + pageSize), total: results.length, page, pageSize };
}

/** Main search: uses Search API, falls back to JSON:API CONTAINS */
export async function search(query: string, page = 0, pageSize = 20): Promise<SearchResponse> {
  if (!query.trim()) return { results: [], total: 0, page, pageSize };

  // Primary: Drupal Search API fulltext
  try {
    const apiResult = await searchViaSearchApi(query, page, pageSize);
    if (apiResult.total > 0) return apiResult;
  } catch {
    // Search API unavailable — fall through
  }

  // Fallback: JSON:API CONTAINS filter
  return searchViaJsonApi(query, page, pageSize);
}


/* ============================================================================
   Events API
   ============================================================================ */

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  body: string;
  summary: string;
  startDate: string;
  endDate?: string;
  location: string;
  eventUrl?: string;
  imageUrl?: string;
}

export async function getEvents(filter?: 'upcoming' | 'past'): Promise<EventItem[]> {
  let endpoint = 'jsonapi/node/event?sort=field_event_date&include=field_image';
  if (filter === 'upcoming') {
    endpoint += `&filter[field_event_date][condition][path]=field_event_date&filter[field_event_date][condition][operator]=%3E%3D&filter[field_event_date][condition][value]=${new Date().toISOString().split('T')[0]}`;
  } else if (filter === 'past') {
    endpoint += `&filter[field_event_date][condition][path]=field_event_date&filter[field_event_date][condition][operator]=%3C&filter[field_event_date][condition][value]=${new Date().toISOString().split('T')[0]}`;
  }

  const data = await drupalFetch<JsonApiResponse>(endpoint);
  if (!data || !Array.isArray(data.data)) return [];

  const included = (data as any).included || [];
  return (data.data as DrupalNode[]).map((node) => {
    const imgId = (node.relationships as any)?.field_image?.data?.id;
    const imgEntity = included.find((i: any) => i.id === imgId);
    return {
      id: node.id,
      title: (node.attributes?.title as string) || '',
      slug: (node.attributes as any)?.field_slug || '',
      body: (node.attributes?.body as any)?.processed || (node.attributes?.body as any)?.value || '',
      summary: (node.attributes as any)?.field_summary?.value || '',
      startDate: (node.attributes as any)?.field_event_date?.value || '',
      endDate: (node.attributes as any)?.field_event_date?.end_value || undefined,
      location: (node.attributes as any)?.field_location || '',
      eventUrl: (node.attributes as any)?.field_event_url?.uri || undefined,
      imageUrl: imgEntity?.attributes?.field_media_image?.uri?.url || undefined,
    };
  });
}

export async function getEvent(slug: string): Promise<EventItem | null> {
  const data = await drupalFetch<JsonApiResponse>(`jsonapi/node/event?include=field_image`);
  if (!data || !Array.isArray(data.data)) return null;

  const included = (data as any).included || [];
  const nodes = (data.data as DrupalNode[]).filter((n) => {
    const a = (n.attributes || n) as any;
    if (a.field_slug === slug) return true;
    const alias: string = a.path?.alias || '';
    const lastSegment = alias.split('/').pop() || '';
    return lastSegment === slug;
  });

  if (nodes.length === 0) return null;
  const node = nodes[0];
  const imgId = (node.relationships as any)?.field_image?.data?.id;
  const imgEntity = included.find((i: any) => i.id === imgId);

  return {
    id: node.id,
    title: (node.attributes?.title as string) || '',
    slug: (node.attributes as any)?.field_slug || slug,
    body: (node.attributes?.body as any)?.processed || (node.attributes?.body as any)?.value || '',
    summary: (node.attributes as any)?.field_summary?.value || '',
    startDate: (node.attributes as any)?.field_event_date?.value || '',
    endDate: (node.attributes as any)?.field_event_date?.end_value || undefined,
    location: (node.attributes as any)?.field_location || '',
    eventUrl: (node.attributes as any)?.field_event_url?.uri || undefined,
    imageUrl: imgEntity?.attributes?.field_media_image?.uri?.url || undefined,
  };
}

export { DRUPAL_BASE_URL };

/* ============================================================================
   Marketplace — Package listing, detail, publishing, starring
   ============================================================================ */

export async function getMarketplacePackages(
  filters: MarketplaceFilters = {},
): Promise<MarketplaceResponse> {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.category) params.set('category', filters.category);
  if (filters.license) params.set('license', filters.license);
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.page !== undefined) params.set('page', String(filters.page));

  try {
    const url = `${DRUPAL_BASE_URL}/api/marketplace/packages?${params.toString()}`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) return { packages: [], total: 0, page: 0, pageSize: 12 };
    return res.json();
  } catch {
    return { packages: [], total: 0, page: 0, pageSize: 12 };
  }
}

export async function getMarketplacePackage(
  slug: string,
): Promise<MarketplacePackage | null> {
  try {
    const url = `${DRUPAL_BASE_URL}/api/marketplace/packages/${encodeURIComponent(slug)}`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getPackageCategories(): Promise<PackageCategory[]> {
  try {
    const url = `${DRUPAL_BASE_URL}/api/marketplace/categories`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.categories || [];
  } catch {
    return [];
  }
}

export async function getUserProfile(
  username: string,
): Promise<UserProfile | null> {
  try {
    const url = `${DRUPAL_BASE_URL}/api/marketplace/profile/${encodeURIComponent(username)}`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

