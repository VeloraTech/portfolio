import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import {
  OG_IMAGE_ALT,
  OG_IMAGE_URL,
  getCanonicalUrl,
  getRouteSeo,
  getRouteStructuredData,
  routeMetadata,
} from '../src/seo.js';

const root = resolve(process.argv[2] || 'dist');
const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
for (const [route, seo] of Object.entries(routeMetadata)) {
  if (seo.title.length < 30 || seo.title.length > 60) throw new Error(`${route}: title must be 30–60 characters (${seo.title.length})`);
  if (seo.description.length < 50 || seo.description.length > 160) throw new Error(`${route}: description must be 50–160 characters (${seo.description.length})`);
}
await readFile(resolve(root, new URL(OG_IMAGE_URL).pathname.split('/').at(-1)));
const routes = Object.keys(routeMetadata);
const rootHtml = await readFile(resolve(root, 'index.html'), 'utf8');
await writeFile(resolve(root, '404.html'), rootHtml);

function setTagAttribute(html, selectorAttribute, selectorValue, attribute, value) {
  const selector = escapeRegex(selectorValue);
  const tagPattern = new RegExp(`<${selectorAttribute === 'rel' ? 'link' : 'meta'}\\b(?=[^>]*\\b${selectorAttribute}="${selector}")[^>]*>`, 'i');
  const match = html.match(tagPattern);
  if (!match) throw new Error(`Missing <${selectorAttribute}="${selectorValue}"> in generated HTML`);
  const attributePattern = new RegExp(`\\b${attribute}="[^"]*"`, 'i');
  const updatedTag = attributePattern.test(match[0])
    ? match[0].replace(attributePattern, `${attribute}="${escapeHtml(value)}"`)
    : match[0].replace(/\s*\/?>$/, ` ${attribute}="${escapeHtml(value)}"$&`);
  return html.replace(match[0], updatedTag);
}

function setMeta(html, kind, name, content) {
  return setTagAttribute(html, kind, name, 'content', content);
}

for (const route of routes) {
  const file = resolve(root, route === '/' ? 'index.html' : `${route.slice(1)}/index.html`);
  if (route !== '/') {
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, rootHtml);
  }
  let html = await readFile(file, 'utf8');
  const seo = getRouteSeo(route);
  const canonical = getCanonicalUrl(route);
  const title = escapeHtml(seo.title);
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  if (!/<title>[^<]*<\/title>/.test(html)) throw new Error(`Missing title in ${file}`);
  html = setMeta(html, 'name', 'description', seo.description);
  html = setMeta(html, 'name', 'author', 'Alpheaus Daniel');
  html = setMeta(html, 'name', 'robots', 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
  html = setMeta(html, 'property', 'og:type', seo.type);
  html = setMeta(html, 'property', 'og:site_name', 'Alpheaus Daniel — Developer Portfolio');
  html = setMeta(html, 'property', 'og:title', seo.title);
  html = setMeta(html, 'property', 'og:description', seo.description);
  html = setMeta(html, 'property', 'og:url', canonical);
  html = setMeta(html, 'property', 'og:image', OG_IMAGE_URL);
  html = setMeta(html, 'property', 'og:image:alt', OG_IMAGE_ALT);
  html = setMeta(html, 'property', 'og:image:width', '1200');
  html = setMeta(html, 'property', 'og:image:height', '630');
  html = setMeta(html, 'property', 'og:image:type', 'image/png');
  html = setMeta(html, 'name', 'twitter:card', 'summary_large_image');
  html = setMeta(html, 'name', 'twitter:title', seo.title);
  html = setMeta(html, 'name', 'twitter:description', seo.description);
  html = setMeta(html, 'name', 'twitter:image', OG_IMAGE_URL);
  html = setMeta(html, 'name', 'twitter:image:alt', OG_IMAGE_ALT);
  html = setTagAttribute(html, 'rel', 'canonical', 'href', canonical);
  const schema = JSON.stringify(getRouteStructuredData(route)).replaceAll('<', '\\u003c');
  const schemaPattern = /<script\b(?=[^>]*\bid="route-schema")(?=[^>]*\btype="application\/ld\+json")[^>]*>[\s\S]*?<\/script>/i;
  if (!schemaPattern.test(html)) throw new Error(`Missing route-schema script in ${file}`);
  html = html.replace(schemaPattern, `<script type="application/ld+json" id="route-schema">${schema}</script>`);
  await writeFile(file, html);
}

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map((route) => `  <url><loc>${getCanonicalUrl(route)}</loc><changefreq>${route === '/' ? 'weekly' : 'monthly'}</changefreq><priority>${route === '/' ? '1.0' : route.startsWith('/work/') ? '0.7' : '0.8'}</priority></url>`),
  '</urlset>',
  '',
].join('\n');
await writeFile(resolve(root, 'sitemap.xml'), sitemap);
console.log(`Injected route metadata into ${routes.length} static Pages documents and generated sitemap.xml.`);
