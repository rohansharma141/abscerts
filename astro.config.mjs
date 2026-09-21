// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.abscerts.com',
  integrations: [
    // /case-studies stays out of the sitemap (and is noindex) until the first real case study
    // is published (content review, B1-23).
    sitemap({ filter: (page) => page !== 'https://www.abscerts.com/case-studies/' }),
    mdx(),
  ]
});