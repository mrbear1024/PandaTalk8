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
  body: PostBodyBlock[] | string | null;
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
};

export type Social = {
  label: string;
  handle: string;
  href: string;
};

export type Site = {
  name: string;
  tagline: string;
  location: string;
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
