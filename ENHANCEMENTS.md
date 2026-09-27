# ABS Website — Enhancements & Suggestions Backlog

Running list of usability / attractiveness / polish ideas surfaced during the build.
These are **not bugs** — the site is correct and shippable without them. They are
opportunities to improve UX, conversion and visual richness, parked here so they're
not lost. Nothing here is actioned without the stakeholder's say-so.

> Convention: when a usability idea comes up mid-build that we decide *not* to do
> right now, add it here rather than acting on it unprompted. Tick items as they ship.

---

## UX / usability enhancements (nice-to-have)

- [ ] **Flexible tile/detail meta line for non-certification services.**
  The service tile and the detail "what you'll get" strip currently hardcode the word
  "weeks" after `timelineWeeks` (`{timelineWeeks} weeks`). That fits ISO/audit pages
  but not training (days), inspection (per-engagement) or CMMi (months). For Phase 4e-1
  we **omitted** `timelineWeeks` on those pages, so their tiles show no duration line.
  *Enhancement:* a small component tweak so the field renders flexibly — e.g. show the
  string as-is ("5 days", "Per engagement"), or add an optional `timelineUnit` /
  `timelineLabel` field — letting training show "5 days", inspection "Per engagement",
  and appraisals a month range. Touches `ServiceTile.astro` + `ServiceDetailLayout.astro`.
  (Deferred in 4e-1 because that session was content-only / no component changes.)

- [ ] **Replace placeholder stock imagery with real ABS photography.**
  Category hero images and service images currently use curated Unsplash URLs as
  placeholders. Swap for real ABS audit/sector/team photos before launch. Category
  heroes read the `image` field in `src/content/categories/*.md`; if real files are
  supplied, drop them into `public/images/categories/` and point the `image` fields back
  at local paths. (The brief lists "real images per service" as a parked non-goal.)

---

- [ ] **Optional in-content cross-links to /about and /process.** Phase 4f wired both
  pages into the header nav, footer and mobile drawer (fully discoverable). As optional
  polish, the home page's "Why us" block could link to `/about` and its Process section
  to `/process`, and service-detail pages that discuss timeline could link to `/process`.
  Deferred to avoid editing the locked v7 home page unprompted.

## Parked — pending direction (client froze "ABS is a consulting firm", 2026-06-15)

- [ ] **Positioning content pass (parked).** The site is written as an accredited *certification
  body*; the client froze positioning as a **consulting firm**. Reframe to **lead with
  consulting/advisory** while keeping certification as a real service. ~15 spots to fix — the
  outright contradictions first: the **10 category "How we work"** lines that say *"we don't sell
  consultancy alongside our audits (ISO/IEC 17021-1 impartiality)"*, the **footer tagline**
  ("Independent certification body serving…"), **About** (accreditation/Why-ABS), **home**
  hero + "Why ABS", and the **Organization schema `description`**. Keep the IAS/IAF facts (live
  site = source of truth). See [[open-stakeholder-questions]].
- [ ] **Impartiality statement (parked).** Client earlier asked for one, but a cert-body
  impartiality clause conflicts with the consulting positioning. Decide: drop it, replace with a
  general "objectivity & independence" note, or clarify with the client.

## Pre-launch must-do (placeholders that must be resolved before going live)

- [x] **Replace or remove placeholder testimonials.** Done: the three v7-mockup placeholders
  were replaced by real client quotes (RDM Traders, SteelBird Helmets, ThoughtSol Infotech).
  Their wording is being settled with ABS separately.

- [x] **Confirm stakeholder accreditation answers (gates real content):** Settled in the
  September 2026 content review: the site describes ABS as a consulting firm, and certification,
  CMMI appraisals and PCI QSA assessments as carried out by independent bodies. Originally:
  PCI DSS QSA status, CMMI Institute Lead Appraiser status, and which personnel
  certification schemes ABS actually offers. These unblock the parked PCI DSS / CMMi
  service-body rewrites and the Personnel Certifications depth, and are prerequisites
  for Phase 4e-2 (Industry & Food certs accreditation framing).

- [x] **Wire the FSSC 22000 cross-link.** Done in Phase 4e-2 — `iso-22000.md` now links
  to both FSSC 22000 and HACCP; the TODO marker is removed.

---

## Deferred / parked (tracked elsewhere, listed for completeness)

- **Verify feature — parked (Phase 4g).** All user-visible verify references were removed
  from the public site (hero slide, nav, footer, home section, in-body links, contact card).
  The backend is intact for future reintroduction: `functions/api/verify.ts` and the
  `CERTIFICATES` KV binding in `wrangler.toml` remain. To revive: rebuild a `/verify` page,
  seed a KV namespace, and re-add the nav/footer/home entry points.
- **Category-page "Industries we serve" section** — deferred feature stub marked in
  `CategoryLandingLayout.astro` (TODO comment). Optional future enhancement. (The category
  FAQ stub was built in Sep 2026: ISO Certifications, Cyber Security and CMMI carry four
  Q&As each, with FAQPage schema.)
- `cmmi.md` service file is orphaned (no route — `/services/cmmi` is the category page; the
  4e-1 self-slug filter drops its tile). Body isn't user-visible; frontmatter feeds related
  strips. Fine as-is; only matters if a dedicated CMMI overview route is ever wanted.
- Resources / blog migration (Phase 5).

---

## Search and AI visibility — post-launch

Assessed 25 Sep 2026 against both Google and AI search (AI Overviews, ChatGPT, Perplexity,
Copilot). Parked here by Rohan: "after ABS answers, add to enhancements." Nothing below is
built. Full assessment and reasoning: `feedback/phase3-decisions-2026-09.md` §15.

**Already in place — don't rebuild it.** Static HTML that needs no JavaScript to read (most AI
crawlers don't run it); mobile performance 91; one canonical address per page; sitemap;
`robots.txt` allowing everything except `/api/`; Organization + WebSite schema site-wide;
Service + OfferCatalog + BreadcrumbList on every service page; FAQPage on 79 pages, with the
machine-readable copy identical to the visible answer; BlogPosting with dates; question-shaped
headings and short paragraphs.

**The biggest factor is not on this list:** none of it earns anything until the site is live on
abscerts.com. The test site is deliberately `noindex`.

- [ ] **S1 — A direct-answer block at the top of each service page** (1–2 h). What the standard
  is, who needs it, what ABS does versus the certification body — built from facts already in
  the front matter, no new claims. Pages currently open with why the standard matters, which is
  not what an AI assistant quotes. Highest-value content change for AI search.
- [ ] **S2 — "Last updated" dates on pages, and `lastmod` in the sitemap** (0.5 h). Only blog
  posts carry `dateModified` today. Freshness counts for both Google and AI answers.
- [ ] **S3 — Named expert authors** (0.5 h once ABS answers). Posts are credited to the
  organisation; a named consultant with credentials carries more weight. Needs ABS: decisions
  doc §13 D15.
- [ ] **S4 — More long-tail question content.** Nine blog posts today. New posts were already
  deferred to after go-live with ABS.

**Outside the code (Rohan / ABS, at or after launch)**
- Submit the sitemap to **Bing Webmaster Tools** as well as Google Search Console: ChatGPT and
  Copilot lean on Bing's index.
- Check **Cloudflare's AI crawler setting**. Cloudflare can block AI bots by default on some
  plans; if GPTBot, ClaudeBot or PerplexityBot are blocked, none of the above matters.
- A **Google Business Profile** for the New Delhi address — confirms ABS as a real entity, which
  helps AI answers as well as local search.
- Backlinks and brand mentions are ABS's to drive; not a website job.
- The experience signals already on ABS's list matter more than any markup: case studies,
  testimonials, real photography.

**Deliberately not doing**
- `llms.txt` — talked about, but no major AI provider has committed to reading it.
- HowTo schema — Google dropped HowTo results in 2023.
- Don't expect Google rich snippets from FAQPage schema: since 2023 those show only for
  government and health sites. We keep FAQ schema because AI assistants read it.
