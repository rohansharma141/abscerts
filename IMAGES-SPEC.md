# ABS Website — Image Specification (for generating brand images)

Every image on the site is currently a tasteful **stock placeholder**. This document lists
the image "slots", their sizes, and a ready-to-use **generation prompt** for each, so you can
create branded replacements (Gemini / Claude / etc.) and hand them back.

## How to use this
1. Generate each image at the **size** given (or larger, same aspect ratio).
2. Keep a **consistent look** across all of them — see "House style" below.
3. Send the files back (or drop them into `public/images/…` using the filenames suggested) and
   we'll wire them in. Photographs → `.jpg` (quality ~80); logos/marks → `.png`/`.svg`.

## House style (apply to every image)
- **Positioning: a consulting & advisory firm** — images should feel like *advisors working
  with clients*, not stock "handshake" clichés.
- Professional, modern, warm. Real-feeling people and workplaces.
- A subtle nod to the brand palette (deep navy `#081F4D`, mint accent `#34E0C4`) where natural.
- Indian context is welcome (ABS is India-based, serves global) — mix of Indian and
  international settings.
- Avoid text baked into the image, obvious AI artifacts, and generic "corporate stock" feel.

---

## Tier 1 — highest impact (do these first)

### Home hero carousel — 3 images · **1920×1080** (16:9) · landscape
These are the first thing visitors see (and drive page-speed, so keep files lean).
- `hero-1.jpg` — *"Two consultants reviewing documents with a client team around a modern
  meeting table, natural light, focused and collaborative."*
- `hero-2.jpg` — *"A close, calm shot of a professional presenting a fixed-price proposal /
  report on a laptop to a client, modern office."*
- `hero-3.jpg` — *"An advisor and a client walking a factory / office floor together,
  clipboard in hand, discussing operations."*

### Industry banners — 4 images · **800×600** (4:3)
Used on the industry pages (`/industries/…`).
- `industry-saas.jpg` — *"Software / SaaS team at work in a bright tech office, screens with
  dashboards, collaborative."*
- `industry-manufacturing.jpg` — *"Clean modern manufacturing floor with staff in PPE and a
  quality inspector reviewing a checklist."*
- `industry-healthcare.jpg` — *"Healthcare / medical-device setting — clinicians or lab staff,
  clean and professional."*
- `industry-finance.jpg` — *"Financial-services / fintech office, professionals reviewing data
  securely."*

### Category banners — 10 images · **640×480** (4:3)
Small framed image beside each category page hero (`/services/<category>`).
- `cat-iso-certifications.jpg` — audit / quality documentation review
- `cat-cyber-security.jpg` — security operations / analyst at screens
- `cat-industry-food-certifications.jpg` — food production line / quality check
- `cat-cmmi.jpg` — software / process-improvement team
- `cat-data-analytics.jpg` — analysts with dashboards and data
- `cat-agile-transformation.jpg` — agile team workshop, sticky notes / board
- `cat-management-system-training.jpg` — a trainer leading a classroom / workshop
- `cat-personnel-certifications.jpg` — a professional being assessed / certified
- `cat-hr-services.jpg` — HR / people team in discussion
- `cat-third-party-inspection.jpg` — inspector checking goods at a factory / warehouse

### About & Process heroes — 2 images · **800×600** (4:3)
- `about.jpg` — *"The ABS team / advisors — approachable, credible, in a real workspace."*
- `process.jpg` — *"An advisor and client mapping out a plan on a whiteboard / screen."*

### Testimonials — client photos or logos
The three real testimonials (SteelBird Helmets, RDM Traders, Thoughtsol Infotech) currently
use a generic image. Ideally replace with **client logos** (with permission) or a neutral
industry image per client. Feature image slot: **800×1000** (4:5, portrait).

---

## Tier 2 — nice to have

- **Service page images (~75)** — each service page has a hero image. These can simply
  **reuse the matching category banner** (above), so no separate generation is needed unless
  you want unique ones. Size **1200×~675**.
- **Blog post covers (10)** — **1200×600** (2:1). Topic-matched (ISO 27001, SOC 2, VAPT,
  phishing, NABH, AI/ISO 42001, etc.).
- **Contact region cards (4)** — **600×375** — UK, Europe, Middle East, North America scenes.
- **Home "why us" + "process" section images** — **800×1000** and **900×1125**.
- **Downloadable-guide covers** — optional thumbnails for the 5 resource PDFs.

## Already handled (no action needed unless rebranding)
- **Logo** — your real logo (`cropped-ABS-Transparent-New.png`) is now wired into the header
  and footer.
- **OG / social-share image** (`og-image.jpg`) and **favicon** — branded placeholders exist;
  replace only if you want a different social card.

---

## Client logos ("Trusted by")
Separate from the above: to switch on the home-page "Trusted by" strip, send the **logos of
clients who have given written permission** (SVG or transparent PNG preferred). We'll add them
to `public/images/clients/` and the strip will appear automatically.
