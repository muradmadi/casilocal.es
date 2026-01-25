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
  site: 'https://casilocal.es',

  // Reverting to default 'ignore' which is most stable for Keystatic
  trailingSlash: 'ignore',

  vite: {
    plugins: [tailwindcss()],
    build: {
      sourcemap: false
    }
  },

  output: 'hybrid',
  integrations: [react(), mdx(), sitemap(), keystatic()],
  adapter: vercel(),
});