import { sql } from "drizzle-orm";
import { boolean, date, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  slug: text("slug").primaryKey(),
  date: date("date").notNull(),
  readTime: text("read_time").notNull(),
  lang: text("lang").notNull().default("EN"),
  tag: text("tag").notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  body: jsonb("body").notNull().default(sql`'""'::jsonb`),
  cover: text("cover"),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  slug: text("slug").primaryKey(),
  glyph: text("glyph").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(),
  statusLabel: text("status_label").notNull(),
  stack: text("stack").array().notNull().default(sql`'{}'::text[]`),
  year: text("year").notNull(),
  href: text("href").notNull().default("#"),
  long: text("long").notNull(),
  cover: text("cover"),
  ctaLabel: text("cta_label"),
  ctaHref: text("cta_href"),
  audience: text("audience"),
  sortOrder: integer("sort_order").notNull().default(100),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const communities = pgTable("communities", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  subtitle: text("subtitle").notNull(),
  price: text("price").notNull(),
  currency: text("currency").notNull().default("¥"),
  cover: text("cover"),
  description: text("description").notNull(),
  audience: text("audience").notNull(),
  highlights: text("highlights").array().notNull().default(sql`'{}'::text[]`),
  includes: text("includes").array().notNull().default(sql`'{}'::text[]`),
  faq: jsonb("faq").notNull().default(sql`'[]'::jsonb`),
  joinInstructions: text("join_instructions").notNull(),
  ctaLabel: text("cta_label").notNull().default("查看加入方式"),
  sortOrder: integer("sort_order").notNull().default(100),
  featured: boolean("featured").notNull().default(false),
  status: text("status").notNull().default("published"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const courses = pgTable("courses", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  cover: text("cover"),
  description: text("description").notNull(),
  price: text("price").notNull(),
  status: text("status").notNull().default("coming_soon"),
  externalUrl: text("external_url").notNull().default("#"),
  ctaLabel: text("cta_label").notNull().default("查看课程系统"),
  sortOrder: integer("sort_order").notNull().default(100),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey().default("main"),
  site: jsonb("site").notNull().default(sql`'{}'::jsonb`),
  socials: jsonb("socials").notNull().default(sql`'[]'::jsonb`),
  about: jsonb("about").notNull().default(sql`'{}'::jsonb`),
  home: jsonb("home").notNull().default(sql`'{}'::jsonb`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
