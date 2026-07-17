# Tier-3 Image Spec — for Ojas

**Goal:** Replace the remaining Unsplash images that are *actually visible* on the site.
Only **13 images** render anywhere (as few as **~10** with reuse). The other 66 service
covers never appear on any page — **leave them untouched**, they cost nothing.

## Why only 13?
The `image:` field on a service page only ever renders inside the **"Related certifications"**
strip, which is hardcoded to show the same 3–4 services site-wide (see
`src/layouts/ServiceDetailLayout.astro:18-20`). A service's cover image is **never shown on
its own detail page**, and the category tile grid uses **icons**, not photos. So 66 of the 70
service images are dead weight and can stay as-is.

## Brand / style (applies to every image)
- Palette: navy `#081F4D` + mint/teal `#34E0C4`; match the existing hero/category set.
- **Prefer no human faces** (per latest client direction). Some faces are acceptable where
  natural, but default to people-free, object/environment-led shots.
- Save all files to `public/images/`. Then update the `image:` value noted in each row.
- Keep the existing `alt` / `imageAlt` text unless a swap makes it inaccurate.

---

## A. Service "Related certifications" cards — 4 images
The only service covers that render. Recommended size **800×600 (4:3)**.

| Save as | Update file (`image:` field) | Depicts | Alt to keep |
|---|---|---|---|
| `service-agile-coaching.jpg` | `src/content/services/agile-coaching.md` | Agile delivery / kanban board | Agile coaching with a delivery team |
| `service-cmmi-dev.jpg` | `src/content/services/cmmi-dev.md` | Process-maturity / software workflow | CMMi for Development process maturity improvement |
| `service-haccp.jpg` | `src/content/services/haccp.md` | Food safety / clean production line | HACCP food safety hazard analysis certification |
| `service-iso-9001.jpg` | `src/content/services/iso-9001.md` | Quality docs / audit paperwork | ISO 9001 quality management system documentation review |

## B. Home-page featured cards — 6 images
In `src/pages/index.astro`, the `serviceHighlights` array (~lines 16–21). Size **800×600**.

| Card | Depicts | Alt to keep |
|---|---|---|
| ISO management systems | QMS documentation | ISO 9001 quality management system documentation |
| Cyber security & SOC 2 | Infosec / SOC 2 | SOC 2 cyber security and information security audit |
| CMMI appraisals | CMMI / software team | CMMI appraisal for IT services and software development |
| Data analytics | Dashboards / analytics | Data analytics dashboard for compliance reporting |
| Agile transformation | Agile workshop | Agile transformation team workshop and training |
| Third-party inspection | Factory / supplier inspection | Third-party factory inspection and supplier audit |

> **Reuse tip — saves 3 generations:** three home cards overlap with section A.
> Point both at the same file instead of generating twice:
> - *ISO management systems* → reuse `service-iso-9001.jpg`
> - *CMMI appraisals* → reuse `service-cmmi-dev.jpg`
> - *Agile transformation* → reuse `service-agile-coaching.jpg`
>
> That leaves **only 3 new home-card images** (Cyber security, Data analytics, Third-party inspection)
> and **~10 unique images total**.

## C. Three one-off photos
| Save as | Update file | Size | Depicts |
|---|---|---|---|
| `home-testimonial-steelbird.jpg` | `src/pages/index.astro:465` | 800×1000 (portrait) | Client / helmet manufacturing or office |
| `contact-team.jpg` | `src/pages/contact.astro:71` | 800×600 | Team consultation |
| `section-bg.jpg` | `src/styles/global.css:1361` | ~1280 wide, subtle | Muted abstract / office backdrop |

---

## Summary
- **Unique images to generate:** 13, or **~10** using the reuse tips above.
- **Do NOT touch** the 66 hidden service covers — they never render.
- **After these land (Rohan will do this):** remove the now-unused
  `preconnect` to unsplash in `src/layouts/BaseLayout.astro:143` — nothing will load from
  Unsplash anymore.

## How to verify you got them all
The 66 hidden service covers never render, so they never reach `dist/` — only the
13 visible images (and the `preconnect` line) do. From `abscerts/`, after wiring:

```bash
npm run build
grep -rn "unsplash" dist/ | grep -v "preconnect"
```

This should return **0 matches** once all 13 are replaced. (The `preconnect` line is the
only expected leftover, and Rohan removes that afterwards.)
