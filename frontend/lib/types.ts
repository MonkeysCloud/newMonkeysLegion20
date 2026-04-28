/**
 * TypeScript types for Drupal JSON:API content types.
 * All content is CMS-managed — these types match the Drupal content model.
 */

/* ============================================================================
   JSON:API envelope types
   ============================================================================ */

export interface JsonApiResponse<T = DrupalNode> {
  data: T | T[];
  included?: DrupalNode[];
  links?: {
    self: { href: string };
    next?: { href: string };
  };
  meta?: {
    count?: number;
  };
}

export interface DrupalNode {
  id: string;
  type: string;
  attributes: Record<string, unknown>;
  relationships?: Record<string, DrupalRelationship>;
}

export interface DrupalRelationship {
  data: { id: string; type: string } | { id: string; type: string }[] | null;
}

export interface MetatagValue {
  tag: string;
  attributes: Record<string, string>;
}

/* ============================================================================
   Canvas Layout system
   ============================================================================ */

export interface CanvasSection {
  id: string;
  type: string;
  componentId: string;
  props: Record<string, any>;
  slots?: Record<string, CanvasSection[]>;
}

export interface CanvasLayout {
  page: {
    id: number;
    title: string;
    path: string;
    status: boolean;
  };
  sections: CanvasSection[];
}

/* ============================================================================
   Section system — Canvas-managed sections
   ============================================================================ */

export type SectionType =
  | 'hero'
  | 'whats_new'
  | 'pillars'
  | 'benchmarks'
  | 'security_matrix'
  | 'apex_spotlight'
  | 'features_grid'
  | 'packages_table'
  | 'code_showcase'
  | 'cli_grid'
  | 'architecture'
  | 'quick_start'
  | 'testing'
  | 'audience'
  | 'roadmap'
  | 'community';

export interface SectionData {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  body?: string;
  data?: Record<string, unknown>;
  sortOrder: number;
  backgroundStyle?: 'default' | 'alt' | 'gradient';
}

/* ============================================================================
   Feature Tiles — shared by multiple sections
   ============================================================================ */

export type TileGroup = 'whats_new' | 'features_grid' | 'apex_main' | 'apex_secondary' | 'audience' | 'pillars';

export interface FeatureTileData {
  id: string;
  icon: string;
  title: string;
  description: string;
  sortOrder: number;
  sectionGroup: TileGroup;
}

/* ============================================================================
   Benchmarks
   ============================================================================ */

export interface BenchmarkData {
  id: string;
  operation: string;
  mlValue: number;
  mlSuffix: string;
  vsLaravel: string;
  vsSymfony: string;
  sortOrder: number;
}

/* ============================================================================
   Security Matrix
   ============================================================================ */

export type StatusValue = 'yes' | 'partial' | 'no';

export interface SecurityFeatureData {
  id: string;
  feature: string;
  mlStatus: StatusValue;
  laravelStatus: StatusValue;
  symfonyStatus: StatusValue;
  laravelNote: string;
  symfonyNote: string;
  sortOrder: number;
}

/* ============================================================================
   Package Info
   ============================================================================ */

export interface PackageData {
  id: string;
  name: string;
  version: string;
  purpose: string;
  githubUrl: string;
  sortOrder: number;
}

/* ============================================================================
   Marketplace Package (user-published)
   ============================================================================ */

export interface MarketplacePackage {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description?: string;
  version: string;
  icon: string;
  logoUrl?: string;
  images?: string[];
  license: string;
  repoUrl: string;
  docsUrl: string;
  installCommand: string;
  composerInstall: string;
  downloads: number;
  stars: number;
  category?: PackageCategory;
  author: {
    name: string;
    uid: number;
  };
  status?: 'published' | 'draft';
  related?: MarketplacePackage[];
  created: string;
  changed: string;
}

export interface PackageCategory {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface MarketplaceFilters {
  search?: string;
  category?: string;
  license?: string;
  sort?: 'newest' | 'downloads' | 'stars' | 'alpha';
  page?: number;
}

export interface MarketplaceResponse {
  packages: MarketplacePackage[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UserProfile {
  user: {
    name: string;
    joined: string;
    packageCount: number;
    totalStars: number;
  };
  packages: MarketplacePackage[];
}

/* ============================================================================
   Code Showcase
   ============================================================================ */

export interface CodeTabData {
  label: string;
  language: string;
  code: string;
  description: string;
}

/* ============================================================================
   Blog
   ============================================================================ */

export interface BlogPostData {
  id: string;
  slug: string;
  pathAlias?: string;
  title: string;
  summary: string;
  body: string;
  bodyFormat?: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  author: string;
  readTime: number;
  created: string;
  changed: string;
}

export interface BlogCategoryData {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

/* ============================================================================
   Documentation
   ============================================================================ */

export interface DocPageData {
  id: string;
  slug: string;
  title: string;
  body: string;
  parentId?: string | null;
  sidebarOrder: number;
  category: string;
  children?: DocPageData[];
  created: string;
  changed: string;
}

export interface DocCategoryData {
  id: string;
  name: string;
  slug: string;
}

/* ============================================================================
   Search
   ============================================================================ */

export type SearchContentType = 'documentation' | 'blog' | 'news' | 'event' | 'package' | 'user';

export interface SearchResult {
  id: string;
  type: SearchContentType;
  title: string;
  excerpt: string;
  url: string;
  category?: string;
  version?: string;
  date?: string;
  avatarUrl?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  pageSize: number;
}

/* ============================================================================
   Hero
   ============================================================================ */

export interface HeroData {
  title: string;
  subtitle: string;
  versionBadge: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
  badges: string[];
  terminalCommands: { text: string; isComment?: boolean }[];
}

/* ============================================================================
   Roadmap
   ============================================================================ */

export interface RoadmapData {
  shipped: string[];
  coming: string[];
  vision: string[];
}

/* ============================================================================
   Quick Start
   ============================================================================ */

export interface QuickStartStep {
  num: string;
  title: string;
  commands: string[];
}

export interface RequirementData {
  name: string;
  version: string;
}

/* ============================================================================
   Community
   ============================================================================ */

export interface CommunityLink {
  icon: string;
  label: string;
  url: string;
}

/* ============================================================================
   Architecture
   ============================================================================ */

export interface ArchitectureLine {
  label: string;
  indent: number;
  color?: string;
}

/* ============================================================================
   CLI Grid
   ============================================================================ */

export interface CliGridData {
  scaffolding: string[];
  database: string[];
  operations: string[];
}

/* ============================================================================
   Pillars
   ============================================================================ */

export interface PillarData {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
}

/* ============================================================================
   Testing / Production
   ============================================================================ */

export interface TestingData {
  testSuites: string[];
  productionChecklist: string;
}
