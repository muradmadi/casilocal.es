// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';
import mdx from '@astrojs/mdx';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.casilocal.es',

  // Reverting to default 'ignore' which is most stable for Keystatic
  trailingSlash: 'ignore',

  vite: {
    plugins: [tailwindcss()],
    build: {
      sourcemap: false
    }
  },

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false,
      },
    },
    domains: [],
    remotePatterns: [],
  },

  output: 'static',
  integrations: [
    react(),
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes('/design-system') &&
        !page.includes('/submit/success') &&
        !page.includes('/keystatic'),
    }),
    keystatic(),
  ],
  adapter: vercel(),
});