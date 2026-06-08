# ABS Certifications & Advisory — website

Astro site deployed to Cloudflare Pages. The four contact/quote/newsletter/verify
endpoints are **Cloudflare Pages Functions** in [`functions/api/`](functions/api/).

## Forms & email (important)

The forms submit to Pages Functions that relay email via [Resend](https://resend.com).
**Forms work locally with `npm run preview` but require a real `RESEND_API_KEY` and a
verified Resend sending domain to actually deliver email.** With the placeholder key in
`.dev.vars`, submissions reach the function and validate correctly but fail at the
email-send step (HTTP 500) — that's expected until real secrets are set in the
Cloudflare dashboard (Pages → Settings → Environment variables).

## Local development

```sh
npm run dev      # Astro dev server (UI only — does NOT run the Pages Functions)
npm run build    # build to dist/
npm run preview  # wrangler: serves dist/ AND runs functions/ + KV binding locally
npm run deploy   # build + wrangler pages deploy
```

Local secrets live in a gitignored `.dev.vars` (see `.env.example` for the variable list).

---

<details>
<summary>Astro starter notes</summary>

```sh
npm create astro@latest -- --template minimal
```
</details>

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
