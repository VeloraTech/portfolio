import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const site = 'https://veloratech.github.io/portfolio';
const routes = [
  ['/', 'Coach Logic — Software Developer & Toolmaker', 'Coach Logic is a software developer and Computer Engineering student building web applications, developer tools, and code-quality experiments.'],
  ['/work', 'Selected Work — Coach Logic', 'Explore Coach Logic’s web applications, developer tools, and interface projects, with clear project status and links to live work and source repositories.'],
  ['/engineering', 'Engineering Notes — Coach Logic', 'Developer tools and engineering work by Coach Logic, spanning observability, telemetry, code quality, architecture, and debugging.'],
  ['/about', 'About Coach Logic — Software Developer', 'Meet Coach Logic, a software developer and Computer Engineering student focused on web applications, backend systems, developer tools, and practical software investigation.'],
  ['/contact', 'Contact Coach Logic', 'Contact Coach Logic about thoughtful product work, developer tools, and collaborations. Find verified social profiles and download the resume.'],
  ['/work/aster', 'Aster — Coach Logic', 'A full-stack technology intelligence platform for exploring technologies, comparing options, and understanding their ecosystem. Live and evolving.'],
  ['/work/mouaec', 'MOUAEC — Coach Logic', 'A university voting system with 30-second count refreshes, administrator correction controls, and Supabase Row Level Security.'],
  ['/work/telica', 'Telica Digital Concept — Coach Logic', 'A technology-skills cohort registration site with an application flow and Web3Forms email notifications.'],
  ['/work/axial', 'Axial Systems — Coach Logic', 'A live landing page built with HTML, CSS, JavaScript, GSAP, and ScrollTrigger; broader work remains in development.'],
  ['/work/agenttrace', 'AgentTrace — Coach Logic', 'A developer tool for process-level observability of AI coding agents, including process trees, snapshots, watch modes, and event timelines.'],
  ['/work/nativerelay', 'NativeRelay — Coach Logic', 'A local-first native telemetry project exploring normalized process and file observations.'],
  ['/work/cleaner', 'Cleaner — Coach Logic', 'A local-first code-cleaning CLI for JavaScript and Python, designed to keep cleaned output separate from source by default.'],
];

const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const root = resolve(process.argv[2] || 'dist');
for (const [route, title, description] of routes) {
  const file = resolve(root, route === '/' ? 'index.html' : `${route.slice(1)}/index.html`);
  let html = await readFile(file, 'utf8');
  const url = `${site}${route === '/' ? '/' : `${route}/`}`;
  const replace = (pattern, value) => {
    if (!pattern.test(html)) throw new Error(`Missing metadata pattern in ${file}: ${pattern}`);
    html = html.replace(pattern, value);
  };
  replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  replace(/(<meta name="description" content=")[^"]*("\s*\/?>)/, `$1${escapeHtml(description)}$2`);
  replace(/(<link rel="canonical" href=")[^"]*("\s*\/?>)/, `$1${url}$2`);
  replace(/(<meta property="og:title" content=")[^"]*("\s*\/?>)/, `$1${escapeHtml(title)}$2`);
  replace(/(<meta property="og:description" content=")[^"]*("\s*\/?>)/, `$1${escapeHtml(description)}$2`);
  replace(/(<meta property="og:url" content=")[^"]*("\s*\/?>)/, `$1${url}$2`);
  replace(/(<meta name="twitter:title" content=")[^"]*("\s*\/?>)/, `$1${escapeHtml(title)}$2`);
  replace(/(<meta name="twitter:description" content=")[^"]*("\s*\/?>)/, `$1${escapeHtml(description)}$2`);
  await writeFile(file, html);
}
console.log(`Injected route metadata into ${routes.length} static Pages documents.`);
