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

- [ ] **Replace or remove placeholder testimonials.** The 3 testimonial entries
  (Sarah Henderson, Ahmed Khalifa, Mark Reynolds) are v7-mockup placeholders, each with
  a TODO comment. They must be replaced with real, permissioned testimonials or removed
  — do not present them as real endorsements.

- [ ] **Confirm stakeholder accreditation answers (gates real content):**
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
- **Category-page "Industries we serve" + "Category FAQ" sections** — deferred feature stubs
  marked in `CategoryLandingLayout.astro` (TODO comments). Optional future enhancement.
- `cmmi.md` service file is orphaned (no route — `/services/cmmi` is the category page; the
  4e-1 self-slug filter drops its tile). Body isn't user-visible; frontmatter feeds related
  strips. Fine as-is; only matters if a dedicated CMMI overview route is ever wanted.
- Resources / blog migration (Phase 5).
