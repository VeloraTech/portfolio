import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, OrbitControls, Text } from '@react-three/drei';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

const projects = {
  aster: {
    name: 'Aster', type: 'Technology intelligence platform', status: 'Live / evolving', href: 'https://aster-nine-liard.vercel.app', repo: 'https://github.com/VeloraTech/Aster',
    description: 'A full-stack exploration and comparison product for understanding what technologies do and how they connect.',
    stack: ['React', 'TypeScript', 'Vite', 'Express', 'PostgreSQL', 'Supabase'],
    surfaces: ['Explore technologies', 'Technology profiles', 'Compare options', 'Ecosystem context'],
  },
  mouaec: { name: 'MOUAEC', type: 'University voting system', status: 'Live / delivered', href: 'https://mouaec.vercel.app', description: 'A university voting system with 30-second count refreshes, admin correction controls, and Supabase Row Level Security.', stack: ['HTML', 'CSS', 'JavaScript', 'Supabase'] },
  telica: { name: 'Telica Digital Concept', type: 'Cohort registration site', status: 'Live / concept', href: 'https://telica-new.vercel.app', description: 'A technology-skills cohort registration site with an application flow and Web3Forms email notifications.', stack: ['HTML', 'CSS', 'JavaScript', 'Web3Forms'] },
  agenttrace: { name: 'AgentTrace', type: 'Developer tool / CLI', status: 'Repository / active direction', href: 'https://github.com/VeloraTech/AgentTrace', description: 'A process-level observability tool for AI coding agents, focused on concurrent agents, process trees, snapshots, watch modes, supervised runs, and event timelines.', stack: ['CLI', 'Process trees', 'Snapshots', 'Watch modes'] },
  nativerelay: { name: 'NativeRelay', type: 'Local-first telemetry', status: 'Repository / exploring', href: 'https://github.com/VeloraTech/NativeRelay', description: 'A local-first native system telemetry project exploring normalized process and file observations.', stack: ['Native telemetry', 'Process events', 'File events'] },
  cleaner: { name: 'Cleaner', type: 'Local-first code-cleaning CLI', status: 'Repository / building', href: 'https://github.com/VeloraTech/Cleaner', description: 'A local-first code-cleaning CLI for JavaScript and Python, oriented around producing cleaned output separately.', stack: ['JavaScript', 'Python', 'CLI', 'Safe defaults'] },
};

function TransitionLink({ to, children, className = '', ...props }) {
  const navigate = useNavigate();
  const handleClick = (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const go = () => navigate(to);
    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(go);
    else go();
  };
  return <Link to={to} className={className} onClick={handleClick} {...props}>{children}</Link>;
}

function MotionPage({ children }) {
  const scope = useRef(null);
  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-reveal]', { y: 28, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: scope.current, start: 'top 78%' } });
      gsap.utils.toArray('[data-float]').forEach((element) => gsap.to(element, { yPercent: -18, ease: 'none', scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: true } }));
      gsap.utils.toArray('[data-scale]').forEach((element) => gsap.fromTo(element, { scale: 0.88, rotate: -2 }, { scale: 1, rotate: 0, ease: 'none', scrollTrigger: { trigger: element, start: 'top 90%', end: 'center 45%', scrub: true } }));
      gsap.utils.toArray('[data-line]').forEach((element) => gsap.fromTo(element, { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 80%' } }));
    }, scope);
    return () => ctx.revert();
  }, []);
  return <div ref={scope}>{children}</div>;
}

function ScrollProgress() {
  const bar = useRef(null);
  useEffect(() => {
    const update = () => { if (bar.current) bar.current.style.transform = `scaleX(${window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight)})`; };
    window.addEventListener('scroll', update, { passive: true }); update();
    return () => window.removeEventListener('scroll', update);
  }, []);
  return <div className="scroll-progress" ref={bar} aria-hidden="true" />;
}

function AxisPoint({ position, label, detail, color }) {
  const [hovered, setHovered] = useState(false);
  return <group position={position} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
    <mesh scale={hovered ? 1.35 : 1}><sphereGeometry args={[0.085, 20, 20]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 0.7 : 0.15} /></mesh>
    <Html distanceFactor={8} position={[0.12, 0.12, 0]} style={{ pointerEvents: 'none' }}><span className={`scene-tooltip ${hovered ? 'is-visible' : ''}`}><b>{label}</b><small>{detail}</small></span></Html>
  </group>;
}

function SceneRig() {
  const rig = useRef(null);
  useFrame((state, delta) => {
    if (!rig.current) return;
    rig.current.rotation.y += delta * 0.18;
    rig.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.45) * 0.08;
  });
  return <group ref={rig} rotation={[0.2, -0.4, 0.1]}>
    <Float speed={1.3} rotationIntensity={0.25} floatIntensity={0.55}>
      <mesh castShadow><icosahedronGeometry args={[0.92, 2]} /><meshStandardMaterial color="#e79b91" roughness={0.25} metalness={0.12} emissive="#5f292c" emissiveIntensity={0.16} /></mesh>
      <Text position={[0, 0, 0.96]} fontSize={0.26} color="#f3efe7" anchorX="center" anchorY="middle" font="https://fonts.gstatic.com/s/spacegrotesk/v17/4iCs6KVjbNBYlgoKfw72.woff2">CL</Text>
    </Float>
    <mesh rotation={[0, 0, Math.PI / 2]} position={[1.2, 0, 0]}><cylinderGeometry args={[0.008, 0.008, 2.8, 8]} /><meshBasicMaterial color="#e79b91" /></mesh>
    <mesh rotation={[0, 0, Math.PI / 2]} position={[-1.2, 0, 0]}><cylinderGeometry args={[0.008, 0.008, 2.8, 8]} /><meshBasicMaterial color="#e79b91" /></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 1.2, 0]}><cylinderGeometry args={[0.008, 0.008, 2.8, 8]} /><meshBasicMaterial color="#c9b9d9" /></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}><cylinderGeometry args={[0.008, 0.008, 2.8, 8]} /><meshBasicMaterial color="#c9b9d9" /></mesh>
    <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0, 1.2]}><cylinderGeometry args={[0.008, 0.008, 2.8, 8]} /><meshBasicMaterial color="#8fa9bb" /></mesh>
    <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0, -1.2]}><cylinderGeometry args={[0.008, 0.008, 2.8, 8]} /><meshBasicMaterial color="#8fa9bb" /></mesh>
    <AxisPoint position={[1.5, 0, 0]} label="BUILD" detail="first useful shape" color="#e79b91" />
    <AxisPoint position={[-1.5, 0, 0]} label="BREAK" detail="test the assumption" color="#c9b9d9" />
    <AxisPoint position={[0, 1.5, 0]} label="LEARN" detail="keep the signal" color="#8fa9bb" />
    <AxisPoint position={[0, -1.5, 0]} label="REBUILD" detail="return clearer" color="#f3efe7" />
    <AxisPoint position={[0, 0, 1.5]} label="SYSTEM" detail="observe the edges" color="#e79b91" />
  </group>;
}

function ThreeScene() {
  return <Canvas className="three-canvas" dpr={[1, 1.6]} camera={{ position: [3.7, 2.8, 5.2], fov: 42 }} gl={{ antialias: true, alpha: true }}><ambientLight intensity={1.2} /><directionalLight position={[4, 5, 4]} intensity={3.2} color="#fff1df" /><pointLight position={[-4, -2, 2]} intensity={8} distance={8} color="#c9b9d9" /><SceneRig /><OrbitControls enablePan={false} enableZoom={false} autoRotate={false} /></Canvas>;
}

function ScrambleText({ children }) {
  const source = String(children);
  const [text, setText] = useState(source);
  const [active, setActive] = useState(false);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const scramble = () => {
    setActive(true); let frame = 0; const total = source.length * 2.2;
    const timer = window.setInterval(() => { frame += 1; const progress = frame / total; setText(source.split('').map((char, index) => index < progress * source.length ? char : chars[Math.floor(Math.random() * chars.length)]).join('')); if (frame >= total) { window.clearInterval(timer); setText(source); setActive(false); } }, 38);
  };
  return <span className={active ? 'scramble-text is-active' : 'scramble-text'} onMouseEnter={scramble}>{text}</span>;
}

function CinematicPin() {
  const scope = useRef(null);
  useLayoutEffect(() => { const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; if (reduce) return undefined; const ctx = gsap.context(() => { const timeline = gsap.timeline({ scrollTrigger: { trigger: scope.current, start: 'top top', end: '+=2200', scrub: 1, pin: true } }); timeline.fromTo('.pin-word', { scale: 0.5, y: 100, rotateX: 55, opacity: 0 }, { scale: 1, y: 0, rotateX: 0, opacity: 1, duration: 1 }).fromTo('.pin-orbit', { rotation: -80, scale: .35 }, { rotation: 35, scale: 1.4, duration: 1 }, '<').fromTo('.pin-card', { xPercent: 120, rotate: 12, opacity: 0 }, { xPercent: 0, rotate: -6, opacity: 1, duration: 1 }).to('.pin-word', { scale: 1.3, xPercent: -18, duration: 1 }).to('.pin-card', { xPercent: -35, rotate: 10, duration: 1 }, '<').to('.pin-route', { opacity: 1, y: 0, duration: .6 }); }, scope); return () => ctx.revert(); }, []);
  return <section ref={scope} className="cinematic-section"><div className="cinematic-stage"><div className="pin-orbit"/><div className="pin-word-wrap"><span className="eyebrow eyebrow--light">SCROLL / INTERPRET / REBUILD</span><h2 className="pin-word">The system<br/><em>moves.</em></h2></div><div className="pin-card"><span>AXIS / 04</span><b>REBUILD</b><small>change the relationship, not just the color</small></div><p className="pin-route">A pinned scene that travels from abstraction to a readable next move.</p></div></section>;
}

function Splash() {
  const [show, setShow] = useState(true);
  useEffect(() => { const timer = window.setTimeout(() => setShow(false), 1250); return () => window.clearTimeout(timer); }, []);
  if (!show) return null;
  return <div className="splash" aria-label="Loading Coach Logic"><div className="splash__inner"><div className="splash__rings" aria-hidden="true"><i/><i/><i/><b>CL</b></div><span className="splash__mark">CL</span><span className="splash__word">COACH LOGIC / 2026</span><span className="splash__rule" /></div></div>;
}

function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const links = [['/','Index'], ['/work','Work'], ['/engineering','Systems'], ['/about','About'], ['/contact','Contact']];
  return <header className="site-header"><TransitionLink to="/" className="wordmark"><span className="wordmark__glyph">CL</span><span>COACH<br/><b>LOGIC</b></span></TransitionLink><nav className="desktop-nav">{links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => isActive ? 'is-active' : ''}>{label}</NavLink>)}</nav><span className="availability"><i />Available for thoughtful work</span><button className="menu-button" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /></button>{open && <nav className="mobile-nav">{links.map(([to, label]) => <TransitionLink key={to} to={to} onClick={() => setOpen(false)}>{label}<span>{String(links.findIndex((item) => item[0] === to) + 1).padStart(2, '0')}</span></TransitionLink>)}</nav>}</header>;
}

function Footer() {
  return <footer className="site-footer"><div className="footer-top"><p className="eyebrow">Coach Logic / 2026</p><TransitionLink to="/contact" className="footer-cta">Start a thoughtful conversation <span>↗</span></TransitionLink></div><div className="footer-bottom"><span>Build. Break. Learn. Rebuild.</span><div><a href="https://github.com/VeloraTech" target="_blank" rel="noreferrer">GitHub ↗</a><TransitionLink to="/contact">Contact ↗</TransitionLink></div></div></footer>;
}

function Layout({ children }) { const location = useLocation(); useEffect(() => window.scrollTo({ top: 0, behavior: 'instant' }), [location.pathname]); return <><Splash/><ScrollProgress/><Header/><MotionPage>{children}</MotionPage><Footer/></>; }
function Eyebrow({ children }) { return <p className="eyebrow" data-reveal>{children}</p>; }
function Button({ to, children }) { return <TransitionLink to={to} className="button button--dark">{children}<span>↗</span></TransitionLink>; }
function External({ href, children }) { return <a href={href} target="_blank" rel="noreferrer" className="text-link">{children}<span>↗</span></a>; }
function Tags({ items }) { return <div className="tags">{items.map((item) => <span key={item}>{item}</span>)}</div>; }

function AsterArtifact({ detail = false }) {
  return <div className={`aster-artifact ${detail ? 'aster-artifact--large' : ''}`} data-scale><div className="artifact-toolbar"><span>ASTER / TECHNOLOGY INTELLIGENCE</span><span>LIVE BUILD ↗</span></div><div className="artifact-nav"><b>Explore</b><span>Compare</span><span>Collections</span><span>About</span></div><div className="artifact-body"><div className="artifact-copy"><span className="artifact-label">DISCOVER / 01</span><h3>Find the tools<br/>behind the <em>shift.</em></h3><p>Aster maps technologies, profiles, comparisons, and their surrounding ecosystems.</p><div className="artifact-button">Explore technologies <span>↗</span></div></div><div className="artifact-map"><div className="map-ring map-ring--one"/><div className="map-ring map-ring--two"/><div className="map-node map-node--main">Aster<small>technology</small></div><div className="map-node map-node--one">React</div><div className="map-node map-node--two">Data</div><div className="map-node map-node--three">Compare</div></div></div><div className="artifact-footer"><span>Core surface / exploration</span><span>Scroll to inspect →</span></div></div>;
}

function Home() {
  return <main className="home"><section className="hero-scene"><div className="hero-grid"><div className="hero-copy"><Eyebrow>Computer engineering student · technical mentor · toolmaker</Eyebrow><h1 className="hero-title" data-reveal>I build clarity into <em><ScrambleText>complex systems.</ScrambleText></em></h1><p className="hero-lede" data-reveal>I investigate how software holds together, then turn that understanding into useful products, developer tools, and interfaces people can actually use.</p><div className="hero-actions" data-reveal><Button to="/work">Enter selected work</Button><TransitionLink to="/about" className="text-link">Read the short version <span>↗</span></TransitionLink></div></div><div className="hero-3d-stage" data-float><div className="scene-fallback" aria-hidden="true"><div className="fallback-core">CL</div><i className="fallback-orbit fallback-orbit--one"/><i className="fallback-orbit fallback-orbit--two"/><b className="fallback-point fallback-point--one">BUILD</b><b className="fallback-point fallback-point--two">BREAK</b><b className="fallback-point fallback-point--three">LEARN</b><b className="fallback-point fallback-point--four">REBUILD</b></div><ThreeScene/><span className="orb-note orb-note--one">01 / INTERACTIVE AXIS</span><span className="orb-note orb-note--two">HOVER THE POINTS</span></div></div><div className="hero-foot"><span>Scroll to move through the practice</span><span>INDEX / 00</span></div></section><CinematicPin/><section className="philosophy-scene"><div className="section-grid"><div><Eyebrow>01 / Philosophy</Eyebrow><h2 className="display-title" data-reveal>Make the first useful <em>shape.</em></h2></div><p className="section-intro" data-reveal>Build, break, learn, rebuild. The loop is not a slogan; it is the way a system becomes understandable.</p></div><div className="process-rail" data-reveal>{['Build', 'Break', 'Learn', 'Rebuild'].map((step, index) => <div className={`process-step process-step--${index + 1}`} key={step}><span>0{index + 1}</span><strong><ScrambleText>{step}</ScrambleText></strong><p>{['Make a useful first shape.', 'Test the assumption.', 'Keep the signal.', 'Return with a clearer structure.'][index]}</p></div>)}</div></section><section className="featured-scene"><div className="section-grid"><div><Eyebrow>02 / Selected work</Eyebrow><h2 className="display-title" data-reveal>Small projects.<br/><em>Real reasons.</em></h2></div><p className="section-intro" data-reveal>Preview the surface. Open a study when you want to understand the decisions underneath.</p></div><div className="featured-project" data-reveal><AsterArtifact/><div className="featured-project__copy"><span className="eyebrow">01 / Technology intelligence platform</span><h3><ScrambleText>Aster</ScrambleText></h3><p>Explore what technologies do, compare their tradeoffs, and understand how the ecosystem connects.</p><Tags items={projects.aster.stack.slice(0, 4)} /><TransitionLink to="/work/aster" className="text-link">Open the Aster study <span>↗</span></TransitionLink></div></div><div className="mini-work-grid">{Object.entries(projects).slice(1, 4).map(([slug, project], index) => <TransitionLink key={slug} to={`/work/${slug}`} className="mini-work-card" data-reveal><span className="eyebrow">0{index + 2} / {project.type}</span><h3>{project.name}</h3><p>{project.description}</p><span className="mini-work-card__arrow">↗</span></TransitionLink>)}</div></section><section className="timeline-scene"><div className="section-grid"><div><Eyebrow>03 / Practice timeline</Eyebrow><h2 className="display-title" data-reveal>Keep the work<br/><em>close to reality.</em></h2></div><p className="section-intro" data-reveal>Mentorship, interface craft, and developer tools all share the same test: does the system help someone make a better next move?</p></div><div className="timeline" data-line><div className="timeline-line"/><article data-reveal><span>2023 — MAY 2026</span><h3>LogicLabs Academy</h3><p>Founded and led a developer education initiative that served more than 200 students.</p></article><article data-reveal><span>LEAD DEVELOPER</span><h3>Axial Systems</h3><p>Built landing-page work with HTML, CSS, JavaScript, GSAP, and ScrollTrigger.</p></article><article data-reveal><span>ONGOING / TOOLS</span><h3>AgentTrace · NativeRelay · Cleaner</h3><p>Local-first experiments in observability, native telemetry, and safer code-cleaning workflows.</p></article></div></section></main>;
}

function Work() { return <main className="route-page"><div className="route-heading"><div><Eyebrow>04 / Selected work · Project index</Eyebrow><h1 className="display-title" data-reveal>Work with<br/><em>a reason.</em></h1></div><p className="section-intro" data-reveal>A project index for products, interfaces, and developer tools. The visual language changes with the problem.</p></div><div className="work-list">{Object.entries(projects).map(([slug, project], index) => <article className="work-row" key={slug} data-reveal><TransitionLink to={`/work/${slug}`} className="work-row__visual">{slug === 'aster' ? <AsterArtifact/> : <div className={`abstract-art abstract-art--${index}`}><span>{String(index + 1).padStart(2, '0')}</span><b>{project.name}</b></div>}</TransitionLink><div className="work-row__copy"><div className="work-meta"><span>0{index + 1} / {project.type}</span><span>{project.status}</span></div><h2>{project.name}</h2><p>{project.description}</p><Tags items={project.stack.slice(0, 4)} /><TransitionLink to={`/work/${slug}`} className="text-link">Read project study <span>↗</span></TransitionLink></div></article>)}</div></main>; }

function Metrics({ active, setActive }) {
  const data = [{ label: 'Explore', value: '01', title: 'A surface for curiosity', copy: 'The implemented exploration surface turns a broad technology question into a browsable starting point.' }, { label: 'Profiles', value: '02', title: 'Context before comparison', copy: 'Individual technology profiles gather the useful identity of a tool before asking visitors to choose.' }, { label: 'Compare', value: '03', title: 'Tradeoffs in view', copy: 'Comparison is a core implemented flow, giving a visitor a deliberate way to weigh options.' }, { label: 'Ecosystem', value: '04', title: 'The surrounding system', copy: 'Ecosystem information connects a technology to the larger set of tools around it.' }];
  return <div className="metrics-module"><div className="metrics-tabs">{data.map((item, index) => <button key={item.label} className={active === index ? 'is-active' : ''} onClick={() => setActive(index)}><span>{item.value}</span>{item.label}</button>)}</div><div className="metric-detail"><div className="metric-orbit"><span>{data[active].value}</span><i/><i/><i/></div><div><span className="eyebrow">Implemented surface / {data[active].value}</span><h3>{data[active].title}</h3><p>{data[active].copy}</p></div></div></div>;
}

function AsterStudy() {
  const [active, setActive] = useState(0);
  return <main className="aster-study"><section className="study-hero"><div className="study-hero__top"><TransitionLink to="/work" className="eyebrow">← Work index</TransitionLink><span className="eyebrow">Live / evolving</span></div><div className="study-hero__grid"><div><span className="eyebrow">Project study / 01</span><h1 className="study-title" data-reveal>Aster</h1><p className="study-type" data-reveal>Technology intelligence platform</p><p className="study-lede" data-reveal>Make the shifting technology landscape easier to explore, compare, and place in context.</p><div className="study-actions" data-reveal><External href={projects.aster.href}>Open live Aster</External><External href={projects.aster.repo}>Inspect GitHub repository</External></div></div><div className="study-hero__artifact" style={{ viewTransitionName: 'aster-hero' }}><AsterArtifact detail/></div></div></section><section className="study-section study-section--paper"><div className="study-section__intro"><span className="eyebrow">01 / Interface anatomy</span><h2 className="display-title" data-reveal>Four implemented<br/><em>surfaces.</em></h2><p className="section-intro" data-reveal>These are not invented dashboard metrics. They are the product surfaces described by the current build and used to explain its information architecture.</p></div><Metrics active={active} setActive={setActive}/></section><section className="study-section study-section--dark"><div className="study-section__intro"><span className="eyebrow eyebrow--light">02 / System decisions</span><h2 className="display-title display-title--light" data-reveal>Structure before<br/><em>noise.</em></h2><p className="section-intro section-intro--light" data-reveal>Aster is a full-stack system: React, TypeScript, Vite, Express, PostgreSQL, and Supabase. The updater for current technology data remains in progress.</p></div><div className="aster-architecture" data-reveal><div className="architecture-node architecture-node--input">Visitor question<small>intent / curiosity</small></div><div className="architecture-line"/><div className="architecture-node architecture-node--core">Aster surface<small>explore / profile / compare</small></div><div className="architecture-line"/><div className="architecture-node architecture-node--data">Supabase + PostgreSQL<small>structured technology context</small></div></div><div className="study-notes"><article><span>DECISION 01</span><h3>Explore first.</h3><p>The entry point should help someone form a question before forcing a choice.</p></article><article><span>DECISION 02</span><h3>Compare deliberately.</h3><p>Comparison belongs after context, not as a decorative table at the end.</p></article><article><span>STATUS</span><h3>Still evolving.</h3><p>A Supabase Edge Function for current technology updates and further interface optimization remain in progress.</p></article></div></section><section className="study-section study-section--paper"><div className="study-section__intro"><span className="eyebrow">03 / Design artifacts</span><h2 className="display-title" data-reveal>Original artifacts,<br/><em>verified links.</em></h2><p className="section-intro" data-reveal>The artifact above is an original visual explanation of Aster’s structure—not a fabricated screenshot. Use the links to inspect the live product and repository directly.</p></div><div className="artifact-grid"><div className="artifact-card" data-reveal><span>LIVE SURFACE</span><h3>Inspect the real product.</h3><p>Open Aster in a new tab to see the current deployed interface.</p><External href={projects.aster.href}>Open aster-nine-liard.vercel.app</External></div><div className="artifact-card artifact-card--lilac" data-reveal><span>CODE SURFACE</span><h3>Inspect the real repository.</h3><p>Read the implementation and current project state on GitHub.</p><External href={projects.aster.repo}>Open VeloraTech/Aster</External></div><div className="artifact-card artifact-card--line" data-reveal><span>WHAT IS NEXT</span><h3>Current updater path.</h3><p>The current-technology update function and further interface optimization are still work in progress.</p></div></div></section><section className="next-study"><span className="eyebrow">Next study</span><TransitionLink to="/work/mouaec"><span>MOUAEC</span><b>↗</b></TransitionLink></section></main>;
}

function Engineering() { return <main className="route-page route-page--paper"><div className="route-heading"><div><Eyebrow>05 / Engineering · The systems room</Eyebrow><h1 className="display-title" data-reveal>Make the<br/><em>invisible legible.</em></h1></div><p className="section-intro" data-reveal>Observability, architecture, debugging, and the small choices that make software easier to trust.</p></div><div className="engineering-grid">{[['AgentTrace','See the process, not just the result.','/work/agenttrace'],['NativeRelay','Normalize the signal.','/work/nativerelay'],['Cleaner','Protect the source.','/work/cleaner']].map(([title, copy, to], index) => <TransitionLink to={to} className="engineering-card" key={title} data-reveal><span>0{index + 1} / SYSTEMS</span><h2>{title}</h2><p>{copy}</p><b>Explore ↗</b></TransitionLink>)}</div></main>; }
function About() { return <main className="route-page"><div className="route-heading"><div><Eyebrow>06 / About · The short version</Eyebrow><h1 className="display-title" data-reveal>Build close<br/>to the <em>question.</em></h1></div><p className="section-intro" data-reveal>I’m Coach Logic — a software developer, Computer Engineering student, technical mentor, and builder of developer tools.</p></div><div className="about-rows">{[['2023 — MAY 2026','LogicLabs Academy','Founded and led a software-learning initiative that served more than 200 students.'],['CONCEPT / UNFINISHED','Campus-Link','An educational web-app concept coordinated with interns; not presented as a completed product.'],['LEAD DEVELOPER','Axial Systems','Built landing-page work with HTML, CSS, JavaScript, GSAP, and ScrollTrigger.']].map(([meta, title, copy]) => <article data-reveal key={title}><span>{meta}</span><div><h2>{title}</h2><p>{copy}</p></div></article>)}</div></main>; }
function Contact() { return <main className="contact-page"><div><Eyebrow>07 / Contact · Make the next thing clearer</Eyebrow><h1 className="contact-title" data-reveal>Have a system<br/>worth <em>shaping?</em></h1><p className="contact-lede" data-reveal>I’m interested in thoughtful product work, developer tools, and collaborations where the details do real work.</p></div><div className="contact-grid" data-reveal><div><span>GITHUB</span><External href="https://github.com/VeloraTech">VeloraTech</External></div><div><span>EMAIL</span><p>Direct email to be added when supplied.</p></div><div><span>RÉSUMÉ</span><p>Résumé link to be added when supplied.</p></div></div></main>; }
function NotFound() { return <main className="route-page"><Eyebrow>404 / Not found</Eyebrow><h1 className="display-title">This path<br/><em>doesn’t hold.</em></h1><Button to="/">Return home</Button></main>; }
function App() { return <Layout><Routes><Route path="/" element={<Home/>}/><Route path="/work" element={<Work/>}/><Route path="/work/aster" element={<AsterStudy/>}/><Route path="/work/:slug" element={<Detail/>}/><Route path="/engineering" element={<Engineering/>}/><Route path="/about" element={<About/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<NotFound/>}/></Routes></Layout>; }
function ProductPreview({ project, slug }) {
  const isRepo = project.href.includes('github.com');
  return <div className={`product-preview product-preview--${slug}`}><div className="product-preview__bar"><span>{isRepo ? 'REPOSITORY SURFACE' : 'LIVE PRODUCT SURFACE'}</span><span>{project.status}</span></div>{isRepo ? <div className="terminal-preview"><span>$ observe --project {project.name}</span><b>{project.type}</b><small>{project.description}</small><span className="terminal-cursor">▋</span></div> : <iframe title={`${project.name} live preview`} src={project.href} loading="lazy" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />}</div>;
}

function Detail() {
  const { slug } = useParams(); const project = projects[slug]; if (!project) return <NotFound/>;
  const facts = { mouaec: ['Voting that stays auditable', '30-second count refreshes, approved admin corrections, allowlisted administrator email, frontend checks, and Supabase RLS.', 'Delivered university exercise'], telica: ['A registration flow with a real handoff', 'A focused cohort application path with Web3Forms email notifications and a live registration surface.', 'Live concept'], agenttrace: ['Observe the agent, not an imagined interior', 'Process observability, concurrent agents, process trees, snapshots, watch modes, supervised runs, and event timelines.', 'Repository direction'], nativerelay: ['Normalize native signals', 'A local-first exploration of normalized process and file observations. Implemented and planned capabilities remain distinct.', 'Repository exploration'], cleaner: ['Protect the original by default', 'A local-first code-cleaning CLI that simplifies cleaning workflows and keeps cleaned output separate from the source.', 'Repository / building'] }[slug] || ['A product surface worth inspecting', project.description, project.status];
  return <main className="product-study"><section className="product-study__hero"><div className="study-hero__top"><TransitionLink to="/work" className="eyebrow">← Work index</TransitionLink><span className="eyebrow">{project.status}</span></div><div className="product-study__intro"><div><span className="eyebrow">Project study / {slug}</span><h1 className="study-title">{project.name}</h1><p className="study-type">{project.type}</p><p className="study-lede">{project.description}</p><div className="study-actions"><External href={project.href}>{project.href.includes('github') ? 'Open GitHub repository' : 'Open live product'}</External></div></div><ProductPreview project={project} slug={slug}/></div></section><section className="product-study__body"><div className="product-statement"><span className="eyebrow">Product language / 01</span><h2>{facts[0]}</h2><p>{facts[1]}</p></div><div className="product-facts"><article><span>STATE</span><b>{facts[2]}</b></article><article><span>STACK</span><Tags items={project.stack}/></article><article><span>READ NEXT</span><p>Open the live surface or repository, then return to the work index for the next product.</p></article></div></section></main>;
}
createRoot(document.getElementById('root')).render(<BrowserRouter><App/></BrowserRouter>);
