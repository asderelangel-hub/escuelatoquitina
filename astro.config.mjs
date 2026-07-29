// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// `base` y `site` se sobrescriben por env para el build de demo en subruta.
const base = process.env.PUBLIC_BASE_PATH || '/';
const site = process.env.PUBLIC_SITE_URL || 'https://escuelatoqui.cl';

// Prefija imágenes/links absolutos DENTRO del Markdown (fotos que el CMS mete
// en el cuerpo) cuando el sitio corre bajo subruta (demo /clientes/...).
function rehypeBasePaths() {
  const prefix = base.replace(/\/$/, '');
  if (!prefix) return () => () => {};
  const walk = (node) => {
    if (node.type === 'element' && node.properties) {
      const p = node.properties;
      if (node.tagName === 'img' && typeof p.src === 'string' && p.src.startsWith('/') && !p.src.startsWith('//')) p.src = prefix + p.src;
      if (node.tagName === 'a' && typeof p.href === 'string' && p.href.startsWith('/') && !p.href.startsWith('//')) p.href = prefix + p.href;
    }
    (node.children || []).forEach(walk);
  };
  return () => (tree) => { walk(tree); };
}

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'auto',
    assets: 'assets',
  },
  markdown: {
    rehypePlugins: [rehypeBasePaths()],
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
