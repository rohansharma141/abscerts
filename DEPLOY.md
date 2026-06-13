# Deploying ABS Certifications to Cloudflare Pages

A step-by-step guide to take this repo live on Cloudflare Pages, with working forms.

**What you're deploying:** a static Astro site (`npm run build` → `dist/`) plus Cloudflare
**Pages Functions** in `functions/api/` that power the Request-a-quote, Contact and Newsletter
forms (they send email via [Resend](https://resend.com)). The Verify feature is parked
(its function exists but nothing calls it).

---

## 0. Before you start

You need:
- A **Cloudflare account** with `abscerts.com` added as a zone (so DNS is managed in Cloudflare). If the domain isn't on Cloudflare yet, add it first (Add a site → update the registrar's nameservers).
- Access to the GitHub repo **`rohansharma141/abscerts`** (production branch: `main`).
- A **Resend account** for transactional email (the forms).

---

## 1. Resend — set up email sending (do this first; forms depend on it)

1. Sign in to Resend → **Domains** → **Add Domain** → enter `abscerts.com`.
2. Resend shows DNS records (SPF / DKIM / a return-path CNAME). Add each one in **Cloudflare → DNS** for `abscerts.com`, then click **Verify** in Resend. Wait until the domain shows **Verified**.
3. **API Keys** → **Create API Key** (sending permission). Copy it — this is `RESEND_API_KEY`. You won't see it again.
4. Decide the three addresses the forms use (all on the verified domain for the *from* address):
   - `FROM_EMAIL` — the sender, e.g. `ABS Certifications <noreply@abscerts.com>`
   - `NOTIFICATION_EMAIL` — where **Contact** + **Quote** enquiries land, e.g. `info@abscerts.com`
   - `MARKETING_EMAIL` — where **Newsletter** sign-ups land, e.g. `marketing@abscerts.com`

   (`NOTIFICATION_EMAIL` / `MARKETING_EMAIL` can be any inbox you read — they don't need to be on the abscerts.com domain; only `FROM_EMAIL` must be on the Resend-verified domain.)

> The functions are written to **fail safe**: if `RESEND_API_KEY` is missing or left as `re_placeholder`, the form still returns success to the user but logs a warning and does **not** send. So set a real key before launch.

---

## 2. Handle the KV namespace (one gotcha to clear first)

`functions/api/verify.ts` references a KV namespace called `CERTIFICATES`, and `wrangler.toml`
declares it with a **placeholder id** (`placeholder-id-set-via-dashboard`). Verify is parked, but
that placeholder can cause a Functions binding error on deploy. Pick one:

- **Option A — recommended for launch (parked):** comment out the `[[kv_namespaces]]` block in
  `wrangler.toml` until Verify is revived:
  ```toml
  # [[kv_namespaces]]
  # binding = "CERTIFICATES"
  # id = "placeholder-id-set-via-dashboard"
  ```
- **Option B — create it now:** Cloudflare → **Workers & Pages → KV → Create namespace**
  (e.g. `abscerts-certificates`), copy its ID into `wrangler.toml`'s `id`, **or** bind it in the
  Pages project under *Settings → Functions → KV namespace bindings* as `CERTIFICATES`.

(Ask the dev to make this one-line change before deploying if it isn't already done.)

---

## 3. Create the Pages project

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorise GitHub, choose **`rohansharma141/abscerts`**.
3. **Production branch:** `main`.

---

## 4. Build settings

| Setting | Value |
|---|---|
| Framework preset | **Astro** |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(leave default — the Astro project is at the repo root)* |

**Critical:** add a build-time environment variable so the right Node is used —
`package.json` requires Node **≥ 22.12.0**:

| Variable | Value |
|---|---|
| `NODE_VERSION` | `22.12.0` |

(If the build fails with an engine/Node error, this is almost always the cause.)

---

## 5. Runtime environment variables (for the forms)

In the Pages project → **Settings → Environment variables → Production** (add the same to
**Preview** if you want preview deploys to send email), add:

| Variable | Example value | Notes |
|---|---|---|
| `RESEND_API_KEY` | `re_xxxxxxxx` | **Mark as Secret/encrypted** |
| `FROM_EMAIL` | `ABS Certifications <noreply@abscerts.com>` | must be on the Resend-verified domain |
| `NOTIFICATION_EMAIL` | `info@abscerts.com` | receives Contact + Quote |
| `MARKETING_EMAIL` | `marketing@abscerts.com` | receives Newsletter sign-ups |

After adding/changing variables, **re-deploy** for them to take effect.

---

## 6. First deploy

1. Click **Save and Deploy**. The build runs `npm install` + `npm run build`; it should produce
   **~101 pages** in ~1–2 minutes.
2. You'll get a `https://abscerts.pages.dev` URL (and a per-deploy preview URL).
3. Open it and sanity-check before attaching the real domain.

---

## 7. Custom domain + DNS

The site's canonical URL is **`https://www.abscerts.com`** (set in `astro.config.mjs`), so make
**www** the primary and redirect the apex to it.

1. Pages project → **Custom domains** → **Set up a domain**.
2. Add **`www.abscerts.com`** (primary) and **`abscerts.com`**. Because the zone is on Cloudflare,
   the required CNAME/records are created automatically.
3. Add a **redirect rule** apex → www: Cloudflare → **Rules → Redirect Rules** →
   `abscerts.com/*` → `https://www.abscerts.com/$1` (301). This keeps URLs matching the canonicals
   and the sitemap.
4. Wait for SSL to issue (usually minutes).

---

## 8. Post-deploy verification checklist

- [ ] Homepage loads; header nav, mega-menu (desktop) and hamburger drawer (mobile) all work.
- [ ] A handful of pages render: a category (`/services/iso-certifications`), a service
      (`/services/iso-27001`), an industry (`/industries/healthcare`), `/about`, `/process`,
      `/blog`, a blog post.
- [ ] **Forms (the real test):** submit **Request a quote** and **Contact** with test data →
      success message shows **and** the email arrives at `NOTIFICATION_EMAIL`. Submit the footer
      **newsletter** → arrives at `MARKETING_EMAIL`. (If not: check `RESEND_API_KEY`, that
      `FROM_EMAIL`'s domain is Resend-verified, and the Functions logs in the dashboard.)
- [ ] `/sitemap-index.xml`, `/sitemap-0.xml` and `/robots.txt` resolve.
- [ ] A made-up URL (e.g. `/nope`) returns the 404 page.
- [ ] **Social preview:** paste a URL into the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) or [opengraph.xyz](https://www.opengraph.xyz/) → the OG image appears. *(Currently a placeholder — see pre-launch notes.)*
- [ ] Run **Lighthouse** on the live site (a service page, a blog post, the homepage) — target
      ≥95 Performance / 100 Accessibility / ≥95 Best Practices / 100 SEO.

---

## 9. Ongoing

- **Auto-deploy:** every push to `main` triggers a production deploy; other branches/PRs get
  preview deploys with their own URLs.
- **Rollback:** Pages keeps every deployment — roll back from the **Deployments** tab in one click.
- **Reviving Verify later:** build a `/verify` page, create + bind the `CERTIFICATES` KV namespace
  (un-comment the `wrangler.toml` block / add the dashboard binding), seed certificate records, and
  re-add the nav/footer/home entry points. The function (`functions/api/verify.ts`) is already there.

---

## 10. Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| Build fails with a Node/engine error | `NODE_VERSION` not set to `22.12.0` (step 4). |
| Build fails resolving a KV namespace | The placeholder `[[kv_namespaces]]` id — do step 2. |
| Forms show success but no email arrives | `RESEND_API_KEY` missing/placeholder, or `FROM_EMAIL` domain not verified in Resend. |
| Forms return an error | Check the function's real-time logs: Pages → the deployment → **Functions** logs. |
| OG image missing in social preview | It's a placeholder; replace `public/og-image.jpg` with real artwork, then re-deploy. |
| Pages load but CSS/JS looks off | Hard-refresh; confirm build output dir is `dist`. |

---

## Pre-launch reminders (content, not deployment)

These are tracked in `ENHANCEMENTS.md` and were shared with the client — they don't block deploy:
real photography, real testimonials (3 placeholders on the homepage), a proper legal privacy
policy (the current one is verbatim boilerplate), and confirmation of the migrated PCI/CMMi/
personnel claims and the "1,200+ certificates" stat.
