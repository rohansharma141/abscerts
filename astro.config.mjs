// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.abscerts.com',
  // Build each page as a file (about.html, services/iso-9001.html), which Cloudflare Pages serves at the
  // no-slash URL (/about) — the form the canonicals, og:url and internal links use (content review, N23).
  // With the default directory format (about/index.html) Pages served /about/ and 308-redirected /about.
  build: { format: 'file' },
  integrations: [
    // /case-studies stays out of the sitemap (and is noindex) until the first real case study
    // is published (content review, B1-23).
    sitemap({ filter: (page) => !/^https:\/\/www\.abscerts\.com\/case-studies\/?$/.test(page) }),
    mdx(),
  ]
});