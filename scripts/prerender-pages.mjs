import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createServer } from 'vite';
import { getRouteSeo, routeMetadata } from '../src/seo.js';

const dist = resolve(process.argv[2] || 'dist');
const prefix = process.env.GITHUB_ACTIONS ? '/portfolio' : '';
const vite = await createServer({
  configFile: resolve('vite.config.js'),
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
});

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function injectRoot(html, markup) {
  if (html.includes('<!--app-html-->')) return html.replace('<!--app-html-->', markup);
  if (html.includes('<div id="root"></div>')) return html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
  throw new Error('Expected the app-html marker or an empty #root in the built HTML.');
}

async function renderAt(route) {
  const { App } = await vite.ssrLoadModule('/src/main.jsx');
  const entry = `${prefix}${route === '/' ? '/' : route}`;
  const tree = createElement(MemoryRouter, {
    basename: prefix || '/',
    initialEntries: [entry],
  }, createElement(App));
  return renderToString(tree);
}

function setMeta(html, kind, key, value) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const tagName = kind === 'rel' ? 'link' : 'meta';
  const pattern = new RegExp(`<${tagName}\\b(?=[^>]*\\b${kind}="${escapedKey}")[^>]*>`, 'i');
  const match = html.match(pattern);
  if (!match) return html;
  const contentPattern = new RegExp(`\\b${kind === 'rel' ? 'href' : 'content'}="[^"]*"`, 'i');
  const nextTag = match[0].replace(contentPattern, `${kind === 'rel' ? 'href' : 'content'}="${escapeHtml(value)}"`);
  return html.replace(match[0], nextTag);
}

try {
  for (const route of Object.keys(routeMetadata)) {
    const file = resolve(dist, route === '/' ? 'index.html' : `${route.slice(1)}/index.html`);
    const source = await readFile(file, 'utf8');
    const markup = await renderAt(route);
    await writeFile(file, injectRoot(source, markup));
  }

  const notFoundFile = resolve(dist, '404.html');
  let notFoundHtml = await readFile(notFoundFile, 'utf8');
  const notFoundMarkup = await renderAt('/__portfolio_not_found__');
  notFoundHtml = injectRoot(notFoundHtml, notFoundMarkup);
  const notFound = getRouteSeo('/__portfolio_not_found__');
  notFoundHtml = notFoundHtml.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(notFound.title)}</title>`);
  notFoundHtml = setMeta(notFoundHtml, 'name', 'description', notFound.description);
  notFoundHtml = setMeta(notFoundHtml, 'name', 'robots', 'noindex,follow');
  notFoundHtml = setMeta(notFoundHtml, 'property', 'og:title', notFound.title);
  notFoundHtml = setMeta(notFoundHtml, 'property', 'og:description', notFound.description);
  notFoundHtml = setMeta(notFoundHtml, 'name', 'twitter:title', notFound.title);
  notFoundHtml = setMeta(notFoundHtml, 'name', 'twitter:description', notFound.description);
  notFoundHtml = notFoundHtml.replace(/<link\b(?=[^>]*\brel="canonical")[^>]*>/i, '');
  notFoundHtml = notFoundHtml.replace(/<meta\b(?=[^>]*\bproperty="og:url")[^>]*>/i, '');
  notFoundHtml = notFoundHtml.replace(/<script\b(?=[^>]*\bid="route-schema")[^>]*>[\s\S]*?<\/script>/i, '');
  await writeFile(notFoundFile, notFoundHtml);
  console.log(`Prerendered ${Object.keys(routeMetadata).length} public routes and an explicit noindex 404.`);
} finally {
  await vite.close();
}
