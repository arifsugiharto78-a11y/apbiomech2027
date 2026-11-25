import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import conference from './src/data/conference.json' with { type: 'json' };
const previewOrigin = conference.githubPreviewUrl ? new URL(conference.githubPreviewUrl).origin : 'https://USERNAME.github.io';

export default defineConfig({
  site: process.env.SITE_URL || previewOrigin,
  base: process.env.BASE_PATH || '/apbiomech2027/',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !/\/404(?:\.html|\/)?$/.test(page) })],
  vite: { plugins: [tailwindcss()] },
  devToolbar: { enabled: false }
});
