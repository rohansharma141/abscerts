import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// NOTE (Phase 2): the brief's Section 5 defines these collections with the legacy
// `type: 'content'` API. Astro 6 removed that API, so each collection now uses the
// `glob()` loader and this file lives at src/content.config.ts. The Zod schemas
// below are copied verbatim from the brief — only the collection wrapper changed.

// NOTE (Phase 4a): `category` changed from the Phase-2 enum to a free string (it now
// holds a category *slug*, e.g. "cyber-security"). Added categoryName / governingBody /
// accreditation and seo.keywords per migration brief Section 5. The old
// `startingPriceGBP` is dropped (was unused; consistent with the no-pricing rule).
const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),        // shorter <title> for SEO (falls back to title)                          // "ISO 27001 — Information Security Management"
    shortName: z.string(),                      // "ISO 27001"
    description: z.string(),                    // 1-2 sentence summary (meta + tile)
    icon: z.string(),                           // Tabler icon class, e.g. "ti-lock"
    tags: z.array(z.string()),                  // ["ISO 27001", "ISMS", "Information Security"]
    image: z.string(),                          // "/images/services/iso-27001.jpg"
    imageAlt: z.string(),
    category: z.string(),                       // slug of the parent category (e.g. "cyber-security")
    categoryName: z.string(),                   // display name (e.g. "Cyber Security") — for breadcrumb
    order: z.number(),                          // sort order within category
    timelineWeeks: z.string().optional(),       // "10-14"
    governingBody: z.string().optional(),       // "ISO", "AICPA", "PCI Security Standards Council"
    accreditation: z.string().optional(),       // "IAS/IAF" — used for credibility chips
    featured: z.boolean().default(false),       // shown on home page services section
    // Optional Q&A used to emit FAQPage JSON-LD (Phase 4c). Mirrors the "Common
    // questions" section in the body so search engines get structured FAQ data.
    faqs: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    }).optional(),
  }),
});

const categories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/categories' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),        // shorter <title> for SEO (falls back to title)                          // "Cyber Security"
    shortName: z.string(),                      // "Cyber Security" (for nav/menu)
    description: z.string(),                    // hero sub (1-2 sentences)
    icon: z.string(),                           // Tabler icon
    image: z.string(),                          // hero/OG image (placeholder for now)
    imageAlt: z.string(),
    order: z.number(),                          // mega-menu order (1-10)
    column: z.number().min(1).max(5),           // mega-menu column (1-5)
    row: z.number().min(1).max(2),              // mega-menu row (1-2)
    educationalContent: z.string().optional(),  // 300-500 word intro — can also be the .md body (Phase 4b)
    industries: z.array(z.string()).optional(), // industry slugs relevant to this category
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional(),
    }).optional(),
  }),
});

const industries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/industries' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),        // shorter <title> for SEO (falls back to title)                          // "Technology & SaaS"
    shortName: z.string().optional(),           // for cards
    description: z.string(),                     // short — used on cards and the hero line
    seoDescription: z.string().optional(),      // longer 120-160 char meta description (falls back to description)
    image: z.string(),
    imageAlt: z.string(),
    standards: z.array(z.string()),             // ["ISO 27001", "SOC 2", "GDPR"] — headline pills
    services: z.array(z.string()).optional(),   // service slugs relevant to this sector — clickable cert list
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
    seoTitle: z.string().optional(),        // shorter <title> for SEO (falls back to title)
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

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),        // shorter <title> for SEO (falls back to title)
    client: z.string(),               // real client name, or "Anonymised — <sector> company"
    industry: z.string(),
    standards: z.array(z.string()),   // e.g. ["ISO 27001", "ISO 9001"]
    summary: z.string(),
    image: z.string(),
    imageAlt: z.string(),
    order: z.number().default(0),
    featured: z.boolean().default(false),
    draft: z.boolean().default(true), // stays out of the build until a real, approved study sets draft:false
  }),
});

export const collections = { services, categories, industries, testimonials, resources, caseStudies };
