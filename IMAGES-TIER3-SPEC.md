# Tier-3 Image Spec — for Ojas

> ## ✅ STATUS: COMPLETE — no action needed
> Ojas delivered all 10 images below (commit `66517de`). The site now loads **zero**
> images from Unsplash.
>
> ### ⚠️ Correction to this spec (the "only 13 images" claim was wrong)
> This spec originally said only 4 of the 70 service covers were visible. **That was an
> analysis error.** `src/layouts/ServiceDetailLayout.astro:83` renders
> `<img src={d.image} …>` as a full **1200×900 eager hero on every service detail page** —
> so all 70 service covers *are* visible, one per page. (The original check missed that
> line because it filtered out anything matching `imageAlt`, and that line contains both.)
>
> **Resolved without generating 66 more images:** each remaining service now points at its
> own **category image** (`/images/cat-<category>.jpg`, already localised in Tier-1), so every
> service page shows a coherent on-brand hero. If a bespoke per-service image is ever wanted,
> just swap that one `image:` value — no other change needed.

**Original goal:** Replace the remaining Unsplash images that are *actually visible* on the site.

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
