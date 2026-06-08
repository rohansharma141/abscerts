import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// NOTE (Phase 2): the brief's Section 5 defines these collections with the legacy
// `type: 'content'` API. Astro 6 removed that API, so each collection now uses the
// `glob()` loader and this file lives at src/content.config.ts. The Zod schemas
// below are copied verbatim from the brief — only the collection wrapper changed.

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),                          // "ISO 27001 — Information Security Management"
    shortName: z.string(),                      // "ISO 27001"
    description: z.string(),                    // 1-line summary for cards and meta description
    icon: z.string(),                           // Tabler icon class, e.g. "ti-lock"
    tags: z.array(z.string()),                  // ["ISO 27001", "ISMS", "Information Security"]
    image: z.string(),                          // "/images/services/iso-27001.jpg"
    imageAlt: z.string(),
    category: z.enum([
      'Most requested',
      'Fast-track',
      'Advisory',
      'Training',
      'Inspections',
      'IT & software',
    ]),
    order: z.number(),                          // for sorting on the index
    timelineWeeks: z.string().optional(),       // "10-14" — used in cards and process callouts
    startingPriceGBP: z.number().optional(),    // for "starts at GBP X" in pricing FAQs
    featured: z.boolean().default(false),       // shown on home page
    seo: z.object({
      title: z.string().optional(),             // overrides default if needed
      description: z.string().optional(),
    }).optional(),
  }),
});

const industries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/industries' }),
  schema: z.object({
    title: z.string(),                          // "Technology & SaaS"
    shortName: z.string().optional(),           // for cards
    description: z.string(),
    image: z.string(),
    imageAlt: z.string(),
    standards: z.array(z.string()),             // ["ISO 27001", "SOC 2", "GDPR"]
    order: z.number(),
    featured: z.boolean().default(false),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: z.object({
    name: z.string(),                           // "Sarah Henderson"
    initials: z.string(),                       // "SH" (for avatar fallback)
    role: z.string(),                           // "CISO"
    company: z.string(),                        // "fintech"
    city: z.string(),                           // "London"
    countryFlag: z.string(),                    // "🇬🇧"
    quote: z.string(),                          // the testimonial body
    image: z.string().optional(),               // photo if real one available
    featured: z.boolean().default(false),       // headline testimonial
    order: z.number(),
  }),
});

const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    author: z.string(),
    image: z.string(),
    imageAlt: z.string(),
    tags: z.array(z.string()),
    readingMinutes: z.number().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { services, industries, testimonials, resources };
