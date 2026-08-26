import { z } from "zod";

// Admin login validation
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});


// Product / Slab validation
export const ProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().optional().nullable(),
  finish: z.string().optional().nullable(),
  finishCategories: z.array(z.string()).default([]),
  thicknessMm: z.array(z.string()).default([]),
  dimensions: z.array(z.string()).default([]),
  format: z.string().optional().nullable(),
  applications: z.array(z.string()).default([]),
  coverImage: z.string().optional().nullable(),
  gallery: z.array(z.string()).default([]),
  isDark: z.boolean().default(false),
  order: z.number().int().default(0),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

// Blog content block schema (paragraph / heading / point / image)
export const BlogContentBlockSchema = z.object({
  type: z.enum(["paragraph", "heading", "point", "image"]),
  text: z.string().optional(),
  title: z.string().optional(),
  src: z.string().optional(),
  alt: z.string().optional(),
});

// Blog / Article validation
export const BlogSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  excerpt: z.string().optional().nullable(),
  author: z.string().default("NOBILITA Editorial Team"),
  authorImage: z.string().optional().nullable(),
  heroImage: z.string().optional().nullable(),
  heroImageAlt: z.string().optional().nullable(),
  tag: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  content: z.array(BlogContentBlockSchema).default([]),
  readTime: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  order: z.number().int().default(0),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

// Global site settings validation
export const SettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required").optional(),
  logoLight: z.string().optional().nullable(),
  logoDark: z.string().optional().nullable(),
  contactEmail: z
    .string()
    .email("Invalid email")
    .optional()
    .nullable()
    .or(z.literal("")),
  contactPhone: z.string().optional().nullable(),
  footerText: z.string().optional().nullable(),
  socialLinks: z
    .object({
      facebook: z.string().optional().nullable(),
      instagram: z.string().optional().nullable(),
      twitter: z.string().optional().nullable(),
      linkedin: z.string().optional().nullable(),
    })
    .default({}),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});
