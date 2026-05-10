export type PostBodyBlock =
  | { type: "p"; text: string }
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "h4"; text: string }
  | { type: "h5"; text: string }
  | { type: "h6"; text: string };

// `body` is a jsonb column. New posts store the rendered HTML as a JSON
// string (e.g. "<p>...</p>"). Legacy posts store an array of typed blocks.
// The reader and edit form both branch on the runtime type.
export type Post = {
  slug: string;
  date: string;
  read_time: string;
  lang: string;
  tag: string;
  title: string;
  excerpt: string;
  body?: PostBodyBlock[] | string | null;
  cover?: string | null;
  featured?: boolean | null;
};

export type ProjectStatus = "ship" | "wip" | "idea";

export type Project = {
  slug: string;
  glyph: string;
  title: string;
  description: string;
  status: ProjectStatus;
  status_label: string;
  stack: string[];
  year: string;
  href: string;
  long: string;
  cover?: string | null;
  cta_label?: string | null;
  cta_href?: string | null;
  audience?: string | null;
  sort_order?: number | null;
  featured?: boolean | null;
};

export type CommunityStatus = "published" | "draft" | "archived";

export type Community = {
  slug: string;
  name: string;
  subtitle: string;
  price: string;
  currency: string;
  cover?: string | null;
  description: string;
  audience: string;
  highlights: string[];
  includes: string[];
  faq: { q: string; a: string }[];
  join_instructions: string;
  cta_label: string;
  sort_order: number;
  featured: boolean;
  status: CommunityStatus;
  created_at?: string;
};

export type CourseStatus = "coming_soon" | "available" | "archived";

export type Course = {
  slug: string;
  title: string;
  subtitle: string;
  cover?: string | null;
  description: string;
  price: string;
  status: CourseStatus;
  external_url: string;
  cta_label: string;
  sort_order: number;
  featured: boolean;
  created_at?: string;
};

export type Social = {
  label: string;
  handle: string;
  href: string;
};

export type Site = {
  name: string;
  displayName: string;
  brandName: string;
  tagline: string;
  location: string;
  xHandle: string;
  xUrl: string;
  xFollowers: string;
  wechatName: string;
  wechatQr: string;
  wechatMaterial: string;
  domain: string;
  socials: Social[];
  now: { status: string; text: string };
};

export type AboutSection = {
  heading: string;
  paragraphs: string[];
};

export type TimelineEntry = {
  year: string;
  what: string;
  detail: string;
};

export type About = {
  sections: AboutSection[];
  timeline: TimelineEntry[];
};

export type HomeSettings = {
  kicker: string;
  title: string;
  titleAccent: string;
  lede: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  socialsTitle: string;
  showSocials: boolean;
  showCommunities: boolean;
  showPosts: boolean;
  showProjects: boolean;
  showCourses: boolean;
};

export type SiteSettings = {
  site: Site;
  about: About;
  home: HomeSettings;
};
