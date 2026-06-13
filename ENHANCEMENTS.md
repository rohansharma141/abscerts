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

- `/verify` page UI + Cloudflare KV namespace seeding (original Phase 4, parked).
- Resources / blog migration (Phase 5).
- Phase 4f: About / Privacy / Process pages (real content from the live site).
