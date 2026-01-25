// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

import keystatic from '@keystatic/astro';
import mdx from '@astrojs/mdx';



// https://astro.build/config
export default defineConfig({
  site: 'https://casilocal.es',
  trailingSlash: 'ignore',
  vite: {
    plugins: [tailwindcss()]
  },

  output: 'static',
  integrations: [react(), mdx(), sitemap(), keystatic()],
});