export const SITE_BASE_URL = 'https://veloratech.github.io/portfolio';
export const SITE_NAME = 'Alpheaus Daniel — Developer Portfolio';
export const PERSON_ID = `${SITE_BASE_URL}/#person`;
export const WEBSITE_ID = `${SITE_BASE_URL}/#website`;
export const OG_IMAGE_URL = `${SITE_BASE_URL}/social-preview-56de2784072b.png`;
export const OG_IMAGE_ALT = 'Coach Logic brand mark beside Alpheaus Daniel’s personal developer portfolio.';
export const AUTHOR_NAME = 'Alpheaus Daniel';

export const routeMetadata = {
  '/': {
    title: 'Alpheaus Daniel — Software Developer & Toolmaker',
    description: 'Personal portfolio of Alpheaus Daniel, a software developer and Computer Engineering student building web applications, developer tools, and practical systems.',
    type: 'website',
    schemaType: 'ProfilePage',
  },
  '/work': {
    title: 'Selected Projects — Alpheaus Daniel',
    description: 'Explore Alpheaus Daniel’s web applications, digital products, and developer tools, with project status, technical context, and verified links.',
    type: 'website',
    schemaType: 'CollectionPage',
  },
  '/engineering': {
    title: 'Developer Tools & Systems — Alpheaus Daniel',
    description: 'Explore projects investigating AI coding-agent process visibility, safer local-first code cleaning, and normalized native system observations.',
    type: 'website',
    schemaType: 'WebPage',
  },
  '/about': {
    title: 'About Alpheaus Daniel — Software Developer',
    description: 'Alpheaus Daniel is a software developer and Computer Engineering student who builds web applications and developer tools through practical investigation.',
    type: 'profile',
    schemaType: 'ProfilePage',
  },
  '/contact': {
    title: 'Contact Alpheaus Daniel — Software Developer',
    description: 'Get in touch with Alpheaus Daniel about thoughtful product work, developer tools, and collaborations. View verified profiles or download the resume.',
    type: 'website',
    schemaType: 'ContactPage',
  },
  '/work/aster': {
    title: 'Aster Technology Discovery — Alpheaus Daniel',
    description: 'Aster explores technology discovery through a catalogue, profiles, comparisons, and ecosystem relationships. Its public deployment remains in development.',
    type: 'article',
    schemaType: 'CreativeWork',
    projectName: 'Aster',
  },
  '/work/mouaec': {
    title: 'MOUAEC Voting System — Alpheaus Daniel',
    description: 'A university voting system with auditable counting, 30-second refreshes, correction controls, and Supabase Row Level Security, built as a university exercise.',
    type: 'article',
    schemaType: 'CreativeWork',
    projectName: 'MOUAEC',
  },
  '/work/telica': {
    title: 'Telica Digital Concept — Alpheaus Daniel',
    description: 'A technology-skills cohort registration concept with an application flow and Web3Forms email notifications, presented with its live registration surface.',
    type: 'article',
    schemaType: 'CreativeWork',
    projectName: 'Telica Digital Concept',
  },
  '/work/axial': {
    title: 'Axial Systems Development — Alpheaus Daniel',
    description: 'A landing page for Axial Systems built with HTML, CSS, JavaScript, GSAP, and ScrollTrigger. The broader system remains in development.',
    type: 'article',
    schemaType: 'CreativeWork',
    projectName: 'Axial Systems',
  },
  '/work/agenttrace': {
    title: 'AgentTrace Observability — Alpheaus Daniel',
    description: 'AgentTrace explores process-level visibility for AI coding agents through process trees, snapshots, watch modes, concurrent processes, and event timelines.',
    type: 'article',
    schemaType: 'CreativeWork',
    projectName: 'AgentTrace',
  },
  '/work/nativerelay': {
    title: 'NativeRelay System Observability — Alpheaus Daniel',
    description: 'NativeRelay explores local-first normalization of native process and file observations, with implemented and planned work clearly distinguished.',
    type: 'article',
    schemaType: 'CreativeWork',
    projectName: 'NativeRelay',
  },
  '/work/cleaner': {
    title: 'Cleaner Code Tool — Alpheaus Daniel',
    description: 'Cleaner is a local-first code-cleaning CLI for JavaScript and Python that aims to preserve original source by writing cleaned output separately by default.',
    type: 'article',
    schemaType: 'CreativeWork',
    projectName: 'Cleaner',
  },
};

export function getRouteSeo(path) {
  const normalized = path.replace(/\/+$/, '') || '/';
  return routeMetadata[normalized] || {
    title: 'Page not found — Alpheaus Daniel',
    description: 'This portfolio page could not be found. Return to the index to explore Alpheaus Daniel’s work.',
    type: 'website',
    schemaType: 'WebPage',
    noindex: true,
  };
}

export function getCanonicalUrl(path) {
  const normalized = path.replace(/\/+$/, '') || '/';
  return `${SITE_BASE_URL}${normalized === '/' ? '/' : `${normalized}/`}`;
}

export function getRouteStructuredData(path) {
  const normalized = path.replace(/\/+$/, '') || '/';
  const seo = getRouteSeo(normalized);
  const url = getCanonicalUrl(normalized);
  const page = {
    '@type': seo.schemaType,
    '@id': `${url}#webpage`,
    url,
    name: seo.title,
    description: seo.description,
    inLanguage: 'en',
    isPartOf: { '@id': WEBSITE_ID },
    primaryImageOfPage: { '@type': 'ImageObject', url: OG_IMAGE_URL },
  };
  if (normalized === '/') page.mainEntity = { '@id': PERSON_ID };
  const graph = [page];
  if (seo.projectName) {
    graph.push({
      '@type': 'CreativeWork',
      '@id': `${url}#project`,
      name: seo.projectName,
      description: seo.description,
      url,
      creator: { '@id': PERSON_ID },
      isPartOf: { '@id': WEBSITE_ID },
    });
    page.mainEntity = { '@id': `${url}#project` };
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
