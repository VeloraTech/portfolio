import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowUpRight, BriefcaseBusiness, Camera, FileText, GitBranch, Mail, Menu, X } from 'lucide-react';
import { getCanonicalUrl, getRouteSeo, getRouteStructuredData, OG_IMAGE_ALT, OG_IMAGE_URL } from './seo.js';
import './index.css';

const ThreeScene = React.lazy(() => import('./ThreeScene.jsx'));
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const projects = {
  aster: {
    name: 'Aster', type: 'Technology intelligence platform', category: 'Web applications & platforms', status: 'Live / evolving', href: 'https://aster-nine-liard.vercel.app', repo: 'https://github.com/VeloraTech/Aster',
    description: 'A full-stack exploration and comparison product for understanding what technologies do and how they connect.',
    stack: ['React', 'TypeScript', 'Vite', 'Express', 'PostgreSQL', 'Supabase'],
    surfaces: ['Explore technologies', 'Technology profiles', 'Compare options', 'Ecosystem context'],
    evidence: 'Live product + repository',
  },
  mouaec: {
    name: 'MOUAEC', type: 'University voting system', category: 'Web applications & platforms', status: 'Live / delivered', href: 'https://mouaec.vercel.app',
    description: 'A university voting system with 30-second count refreshes, admin correction controls, an approved administrator allowlist, frontend checks, and Supabase Row Level Security.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Supabase', 'RLS'],
    evidence: 'Live product',
  },
  telica: {
    name: 'Telica Digital Concept', type: 'Cohort registration site', category: 'Websites & registration', status: 'Live / concept', href: 'https://telica-new.vercel.app',
    description: 'A technology-skills cohort registration site with an application flow and Web3Forms email notifications.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Web3Forms'],
    evidence: 'Live product',
  },
  agenttrace: {
    name: 'AgentTrace', type: 'Developer tool / CLI', category: 'Developer tools & observability', status: 'Repository / active direction', href: 'https://github.com/VeloraTech/AgentTrace',
    description: 'A process-level observability tool for AI coding agents, focused on concurrent agents, process trees, snapshots, watch modes, supervised runs, and event timelines.',
    stack: ['CLI', 'Process trees', 'Snapshots', 'Watch modes'],
    evidence: 'Repository evidence',
  },
  nativerelay: {
    name: 'NativeRelay', type: 'Local-first telemetry', category: 'Developer tools & observability', status: 'Repository / exploring', href: 'https://github.com/VeloraTech/NativeRelay',
    description: 'A local-first native system telemetry project exploring normalized process and file observations. Implemented and planned capabilities remain distinct.',
    stack: ['Native telemetry', 'Process events', 'File events'],
    evidence: 'Repository evidence',
  },
  cleaner: {
    name: 'Cleaner', type: 'Local-first code-cleaning CLI', category: 'Developer tools & observability', status: 'Repository / building', href: 'https://github.com/VeloraTech/Cleaner',
    description: 'A local-first code-cleaning CLI for JavaScript and Python, oriented around producing cleaned output separately from the source by default.',
    stack: ['JavaScript', 'Python', 'CLI', 'Safe defaults'],
    evidence: 'Repository evidence',
  },
  axial: {
    name: 'Axial Systems', type: 'Landing page / Lead Developer', category: 'Websites & interfaces', status: 'Live / in development', href: 'https://axial-systems.vercel.app/', repo: 'https://github.com/VeloraTech/Axial-Systems',
    description: 'A live landing page built with HTML, CSS, JavaScript, GSAP, and ScrollTrigger. The broader Axial Systems work remains in development.',
    stack: ['HTML', 'CSS', 'JavaScript', 'GSAP', 'ScrollTrigger'],
    evidence: 'Live website + repository',
  },
};

const navLinks = [['/', 'Index'], ['/work', 'Work'], ['/engineering', 'Systems'], ['/about', 'About'], ['/contact', 'Contact']];
const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/VeloraTech', Icon: GitBranch },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alpheaus-daniel-804600366', Icon: BriefcaseBusiness },
  { label: 'X', href: 'https://x.com/RyanDan934', Icon: X },
  { label: 'Instagram', href: 'https://www.instagram.com/tech.velora', Icon: Camera },
  { label: 'Email', href: 'mailto:alpheausdalighton@gmail.com', Icon: Mail },
];
const assetConfig = {
  profilePhoto: { available: true, path: `${import.meta.env.BASE_URL}assets/profile-photo-2963c32f3ff0.webp` },
  resume: { available: true, path: `${import.meta.env.BASE_URL}assets/Alpheaus-Daniel-Code-Quality-Engineer-CV.pdf` },
};
const axisPoints = [
  { label: 'BUILD', detail: 'make a useful first shape', position: [1.55, 0, 0], color: '#718368' },
  { label: 'BREAK', detail: 'test the assumption', position: [-1.55, 0, 0], color: '#aa6a4d' },
  { label: 'LEARN', detail: 'keep the signal', position: [0, 1.55, 0], color: '#aaa0c6' },
  { label: 'REBUILD', detail: 'return with a clearer structure', position: [0, -1.55, 0], color: '#d7cdbb' },
  { label: 'SYSTEM', detail: 'observe the edges', position: [0, 0, 1.55], color: '#3e4840' },
];

function TransitionLink({ to, children, className = '', onClick, ...props }) {
  const navigate = useNavigate();
  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const go = () => navigate(to);
    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(go);
    else go();
  };
  return <Link to={to} className={className} onClick={handleClick} {...props}>{children}</Link>;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, []);
  return reduced;
}

function ScrambleText({ children }) {
  const source = String(children);
  const [text, setText] = useState(source);
  const [active, setActive] = useState(false);
  const timer = useRef(null);
  const reduced = useReducedMotion();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const scramble = () => {
    if (reduced) return;
    if (timer.current) window.clearInterval(timer.current);
    setActive(true);
    let frame = 0;
    const total = Math.max(12, Math.round(source.length * 1.7));
    timer.current = window.setInterval(() => {
      frame += 1;
      const progress = frame / total;
      setText(source.split('').map((char, index) => {
        if (char === ' ' || index < progress * source.length) return char;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      if (frame >= total) {
        window.clearInterval(timer.current);
        timer.current = null;
        setText(source);
        setActive(false);
      }
    }, 40);
  };
  useEffect(() => {
    if (!reduced || !timer.current) return;
    window.clearInterval(timer.current);
    timer.current = null;
    setText(source);
    setActive(false);
  }, [reduced, source]);
  useEffect(() => () => timer.current && window.clearInterval(timer.current), []);
  return <span className={active ? 'scramble-text is-active' : 'scramble-text'} onMouseEnter={scramble} onFocus={scramble} tabIndex="0">{text}</span>;
}

function Splash() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const close = () => setShow(false);
    const timer = window.setTimeout(close, 900);
    window.addEventListener('keydown', (event) => event.key === 'Escape' && close(), { once: true });
    return () => window.clearTimeout(timer);
  }, []);
  if (!show) return null;
  return <div className="splash" role="status" aria-label="Loading Coach Logic"><div className="splash__inner"><div className="splash__mark" aria-hidden="true"><i/><i/><b>CL</b></div><div><span className="splash__word">COACH LOGIC</span><span className="splash__sub">BUILD / BREAK / LEARN / REBUILD</span></div><div className="splash__rule"/><button type="button" className="splash__skip" onClick={() => setShow(false)}>Skip intro <ArrowUpRight size={13}/></button></div></div>;
}

function CursorField() {
  const canvas = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !canvas.current || window.matchMedia('(pointer: coarse)').matches) return undefined;
    const el = canvas.current;
    const ctx = el.getContext('2d');
    const pointer = { x: -100, y: -100, tx: -100, ty: -100, vx: 0, vy: 0 };
    const particles = Array.from({ length: 26 }, (_, index) => ({ x: -100, y: -100, size: index % 6 === 0 ? 2.8 : 1.45, lag: .07 + (index % 7) * .014, alpha: .21 + (index % 4) * .04 }));
    let raf = 0;
    let lastActivity = 0;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      el.width = window.innerWidth * ratio;
      el.height = window.innerHeight * ratio;
      el.style.width = `${window.innerWidth}px`;
      el.style.height = `${window.innerHeight}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      schedule();
    };
    const schedule = () => {
      if (!raf && !document.hidden) raf = requestAnimationFrame(render);
    };
    const move = (event) => {
      pointer.tx = event.clientX;
      pointer.ty = event.clientY;
      lastActivity = performance.now();
      schedule();
    };
    const focus = (event) => {
      const rect = event.target?.getBoundingClientRect?.();
      if (!rect || !rect.width || !rect.height) return;
      pointer.tx = rect.left + rect.width / 2;
      pointer.ty = rect.top + rect.height / 2;
      lastActivity = performance.now();
      schedule();
    };
    const render = (now) => {
      raf = 0;
      const dx = pointer.tx - pointer.x;
      const dy = pointer.ty - pointer.y;
      pointer.vx += dx * .09;
      pointer.vy += dy * .09;
      pointer.vx *= .72;
      pointer.vy *= .72;
      pointer.x += pointer.vx;
      pointer.y += pointer.vy;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const speed = Math.hypot(pointer.vx, pointer.vy);
      const fade = Math.max(0, 1 - (now - lastActivity) / 1200);
      let unsettled = Math.hypot(pointer.tx - pointer.x, pointer.ty - pointer.y) > .3 || speed > .025;
      particles.forEach((particle, index) => {
        const lead = particles[index - 1] || pointer;
        const gapX = lead.x - particle.x;
        const gapY = lead.y - particle.y;
        particle.x += gapX * particle.lag;
        particle.y += gapY * particle.lag;
        if (Math.hypot(gapX, gapY) > .3) unsettled = true;
        ctx.beginPath();
        ctx.fillStyle = `rgba(113, 131, 104, ${particle.alpha * (.18 + Math.min(.82, speed / 7)) * fade})`;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      if (unsettled || fade > 0) schedule();
    };
    const visibility = () => {
      if (document.hidden && raf) { cancelAnimationFrame(raf); raf = 0; }
      else schedule();
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('focusin', focus, true);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('focusin', focus, true);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [reduced]);
  return <canvas className="cursor-field" ref={canvas} aria-hidden="true"/>;
}

function ScrollProgress() {
  const bar = useRef(null);
  useEffect(() => {
    const update = () => { if (bar.current) bar.current.style.transform = `scaleX(${window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)})`; };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  return <div className="scroll-progress" ref={bar} aria-hidden="true"/>;
}

function MotionPage({ children }) {
  const scope = useRef(null);
  const reduced = useReducedMotion();
  const location = useLocation();
  useIsoLayoutEffect(() => {
    let active = true;
    let context;
    if (!scope.current || reduced) return undefined;
    import('./motion.js').then(({ gsap, ScrollTrigger }) => {
      if (!active || !scope.current) return;
      context = gsap.context(() => {
        gsap.utils.toArray('[data-reveal]').forEach((element) => gsap.fromTo(element, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .8, delay: Number(element.dataset.revealOrder || 0) * .11, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 84%', once: true } }));
        gsap.utils.toArray('[data-parallax]').forEach((element) => gsap.to(element, { yPercent: -12, ease: 'none', scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: true } }));
        gsap.utils.toArray('[data-line]').forEach((element) => gsap.fromTo(element, { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 1, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 85%', once: true } }));
        const hero = scope.current.querySelector('.hero-scene');
        if (hero) {
          const timeline = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: '+=1150', scrub: 1.1 } });
          timeline.to('.hero-copy', { y: -145, opacity: .16, ease: 'none' }, 0)
            .to('.hero-stage--front', { scale: 1.08, rotateZ: 2, xPercent: 1, yPercent: 3, ease: 'none' }, 0)
            .to('.hero-depth--mid', { xPercent: 10, yPercent: -8, scale: 1.12, ease: 'none' }, 0)
            .to('.hero-depth--back', { xPercent: -6, yPercent: 8, scale: 1.05, ease: 'none' }, 0)
            .to('.hero-annotations', { yPercent: -10, opacity: .82, ease: 'none' }, 0)
            .to('.hero-foot', { y: 24, opacity: 0, ease: 'none' }, 0);
        }
      }, scope);
      ScrollTrigger.refresh();
    }).catch((error) => console.error('Portfolio motion could not load', error));
    return () => { active = false; context?.revert(); };
  }, [reduced, location.pathname]);
  return <div ref={scope}>{children}</div>;
}

class SceneErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function SceneAnnotations({ axisPoints }) {
  const [active, setActive] = useState('BUILD');
  return <div className="hero-annotations" role="group" aria-label="Interactive axis points">
    {axisPoints.map((point) => <button key={point.label} type="button" aria-pressed={active === point.label} className={active === point.label ? 'is-active' : ''} onFocus={() => setActive(point.label)} onMouseEnter={() => setActive(point.label)} onClick={() => setActive(point.label)}><span>{point.label}</span><small>{point.detail}</small></button>)}
    <p>Focus a point to inspect the practice.</p>
  </div>;
}
function HeroFallback() {
  return <div className="scene-fallback" aria-hidden="true"><div className="fallback-core">CL</div><i className="fallback-axis fallback-axis--x"/><i className="fallback-axis fallback-axis--y"/><i className="fallback-orbit fallback-orbit--one"/><i className="fallback-orbit fallback-orbit--two"/><b className="fallback-point fallback-point--one">BUILD</b><b className="fallback-point fallback-point--two">BREAK</b><b className="fallback-point fallback-point--three">LEARN</b><b className="fallback-point fallback-point--four">REBUILD</b></div>;
}
function HeroScene() {
  const [renderThree, setRenderThree] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) { setRenderThree(false); return undefined; }
    let cancelled = false;
    let idleId;
    let timerId;
    const enable = () => { if (!cancelled) setRenderThree(true); };
    if ('requestIdleCallback' in window) idleId = window.requestIdleCallback(enable, { timeout: 1200 });
    else timerId = window.setTimeout(enable, 650);
    return () => { cancelled = true; if (idleId) window.cancelIdleCallback(idleId); if (timerId) window.clearTimeout(timerId); };
  }, [reduced]);
  return <section className="hero-scene" aria-labelledby="hero-title"><div className="hero-depth hero-depth--back"/><div className="hero-depth hero-depth--mid"/><div className="hero-grid"><div className="hero-copy"><p className="eyebrow">Computer engineering student · technical mentor · toolmaker</p><h1 id="hero-title" className="hero-title" data-reveal>I build clarity into <em><ScrambleText>complex systems.</ScrambleText></em></h1><p className="hero-lede" data-reveal>I investigate how software holds together, then turn that understanding into useful products, developer tools, and interfaces people can actually use.</p><div className="hero-actions" data-reveal><Button to="/work">Enter selected work</Button><TransitionLink to="/about" className="text-link">Read the short version <ArrowUpRight size={15}/></TransitionLink></div></div><div className="hero-stage hero-stage--front">{renderThree ? <SceneErrorBoundary fallback={<HeroFallback/>}><React.Suspense fallback={<HeroFallback/>}><ThreeScene axisPoints={axisPoints}/></React.Suspense></SceneErrorBoundary> : <HeroFallback/>}<SceneAnnotations axisPoints={axisPoints}/><span className="hero-stage__label hero-stage__label--top">01 / INTERACTIVE AXIS</span><span className="hero-stage__label hero-stage__label--bottom">Hover or focus a point</span></div></div><div className="hero-foot"><span>Scroll to explore the work</span><span>INDEX / 00</span></div></section>;
}
function CinematicPin() {
  const scope = useRef(null);
  const reduced = useReducedMotion();
  useIsoLayoutEffect(() => {
    if (!scope.current || reduced) return undefined;
    let active = true;
    let context;
    import('./motion.js').then(({ gsap, ScrollTrigger }) => {
      if (!active || !scope.current) return;
      context = gsap.context(() => {
        const timeline = gsap.timeline({ scrollTrigger: { trigger: scope.current, start: 'top top', end: '+=2200', scrub: 1, pin: true } });
        timeline.fromTo('.pin-bg', { scale: .72, xPercent: -12, opacity: .25 }, { scale: 1.5, xPercent: 10, opacity: 1, duration: 1 })
          .fromTo('.pin-word', { scale: .52, y: 120, rotateX: 58, opacity: 0 }, { scale: 1, y: 0, rotateX: 0, opacity: 1, duration: 1 }, '<')
          .fromTo('.pin-orbit', { rotation: -95, scale: .3 }, { rotation: 38, scale: 1.45, duration: 1 }, '<')
          .fromTo('.pin-mid', { xPercent: 34, yPercent: 14, scale: .68, opacity: .2 }, { xPercent: -18, yPercent: -9, scale: 1.14, opacity: 1, duration: 1 }, '<')
          .fromTo('.pin-card', { xPercent: 125, rotate: 12, opacity: 0 }, { xPercent: 0, rotate: -5, opacity: 1, duration: 1 })
          .to('.pin-word', { scale: 1.3, xPercent: -18, duration: 1 })
          .to('.pin-card', { xPercent: -35, rotate: 9, duration: 1 }, '<')
          .to('.pin-route', { opacity: 1, y: 0, duration: .6 });
      }, scope);
      ScrollTrigger.refresh();
    }).catch((error) => console.error('Portfolio motion could not load', error));
    return () => { active = false; context?.revert(); };
  }, [reduced]);
  return <section ref={scope} className="cinematic-section" aria-label="Build, break, learn, rebuild story"><div className="cinematic-stage"><div className="pin-bg"/><div className="pin-mid"/><div className="pin-orbit"/><div className="pin-word-wrap"><span className="eyebrow eyebrow--light">A PRACTICAL LOOP</span><h2 className="pin-word">Make it<br/><em>understandable.</em></h2></div><div className="pin-card"><span>THE NEXT MOVE</span><b>REBUILD</b><small>use what the investigation reveals</small></div><p className="pin-route">I build, test, investigate, and improve until the next decision is clearer.</p></div></section>;
}

function FlowTimeline() {
  const rail = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      if (!rail.current) return;
      const rect = rail.current.getBoundingClientRect();
      const next = (window.innerHeight * 0.76 - rect.top) / Math.max(1, rect.height);
      setProgress(Math.min(1, Math.max(0, next)));
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className="experience-map">
      <div className="experience-map__legend">
        <span>2023 → PRESENT</span>
        <b>Selected chapters, in sequence</b>
      </div>
      <div className="experience-map__stage" ref={rail}>
        <svg className="timeline-curve" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path className="experience-map__tube" d="M 390 140 C 735 55 825 342 610 450 C 405 555 255 625 390 760" pathLength="1" />
          <path className="experience-map__liquid" d="M 390 140 C 735 55 825 342 610 450 C 405 555 255 625 390 760" pathLength="1" style={{ strokeDashoffset: 1 - progress }} />
          <circle className="experience-map__marker" cx="390" cy="140" r="10" />
          <circle className="experience-map__marker" cx="610" cy="450" r="10" />
          <circle className="experience-map__marker" cx="390" cy="760" r="10" />
        </svg>
        <ol className="experience-map__list">
          <li className="experience-card experience-card--academy">
            <span className="experience-card__date">AUG 2025 — MAY 2026 · CONCLUDED</span>
            <h3>LogicLabs Academy</h3>
            <strong>Building a community around learning by doing.</strong>
            <p>I founded and led a software-learning initiative that brought together more than 200 students around learning, collaboration, and practical development. The initiative concluded in May 2026.</p>
          </li>
          <li className="experience-card experience-card--campus">
            <span className="experience-card__date">CONCEPT · UNFINISHED</span>
            <h3>Campus-Link</h3>
            <strong>An academic companion explored with interns.</strong>
            <p>A proposed web-app concept for academic resources, student updates, convocation preparation, document organization, and missing-graduation-document detection. It was not completed as a finished product.</p>
          </li>
          <li className="experience-card experience-card--axial">
            <span className="experience-card__date">JAN 2026 — PRESENT · LIVE / EVOLVING</span>
            <h3>Axial Systems</h3>
            <strong>A live web experience, with the wider system still evolving.</strong>
            <p>As Lead Developer, I built the landing page with HTML, CSS, JavaScript, GSAP, and ScrollTrigger.</p>
            <div className="experience-actions">
              <External href={projects.axial.href}>Visit Live Site</External>
              <External href={projects.axial.repo}>View Source</External>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}

function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [location.pathname]);
  return <header className="site-header"><TransitionLink to="/" className="wordmark"><span className="wordmark__glyph">CL</span><span>COACH<br/><b>LOGIC</b></span></TransitionLink><nav className="desktop-nav" aria-label="Primary navigation">{navLinks.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => isActive ? 'is-active' : ''}>{label}</NavLink>)}</nav><span className="availability"><i/>Available for thoughtful work</span><button className="menu-button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={20}/> : <Menu size={20}/>}</button>{open && <nav className="mobile-nav" aria-label="Mobile navigation">{navLinks.map(([to, label], index) => <TransitionLink key={to} to={to}>{label}<span>{String(index + 1).padStart(2, '0')}</span></TransitionLink>)}</nav>}</header>;
}

function SocialLinks({ compact = false }) {
  return <div className={`social-links ${compact ? 'social-links--compact' : ''}`} aria-label="Social profiles">{socialLinks.map(({ label, href, Icon }) => <a key={label} href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel={href.startsWith('mailto:') ? undefined : 'noreferrer'} aria-label={label === 'Email' ? 'Email Alpheaus Daniel' : `Open ${label} profile`}><Icon size={14} aria-hidden="true"/><span>{label}</span><ArrowUpRight size={14} aria-hidden="true"/></a>)}</div>;
}
function ResumeAction() {
  return assetConfig.resume.available ? <a className="resume-action" href={assetConfig.resume.path} download="Alpheaus-Daniel-Code-Quality-Engineer-CV.pdf"><FileText size={15}/> Download CV <ArrowUpRight size={14}/></a> : null;
}

function Footer() {
  return <footer className="site-footer"><svg className="footer-wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0 50 C160 6 270 80 430 42 S720 4 890 42 S1180 80 1440 28 V80 H0 Z"/></svg><div className="footer-top"><div><p className="eyebrow eyebrow--light">Coach Logic / 2026</p><p className="footer-note">A developer portfolio built around useful systems, honest evidence, and a little spatial thinking.</p><ResumeAction/></div><TransitionLink to="/contact" className="footer-cta">Start a thoughtful conversation <ArrowUpRight size={28}/></TransitionLink></div><div className="footer-grid"><div><span>EXPLORE</span><TransitionLink to="/work">Selected work <ArrowUpRight size={14}/></TransitionLink><TransitionLink to="/engineering">Engineering notes <ArrowUpRight size={14}/></TransitionLink></div><div><span>CONNECT</span><SocialLinks compact/></div><div><span>STATUS</span><p>Available for thoughtful product, tool, and interface work.</p></div></div><div className="footer-bottom"><span>Build. Break. Learn. Rebuild.</span><span>Made with React / Three / GSAP</span></div></footer>;
}

function Layout({ children }) {
  const location = useLocation();
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    const hash = location.hash;
    const frames = new Set();
    const schedule = (callback) => {
      const frameId = window.requestAnimationFrame(() => { frames.delete(frameId); callback(); });
      frames.add(frameId);
      return frameId;
    };
    const scrollToDestination = () => {
      let target = null;
      if (hash.length > 1) { try { target = document.getElementById(decodeURIComponent(hash.slice(1))); } catch { target = null; } }
      if (target) target.scrollIntoView({ block: 'start', behavior: 'instant' });
      else window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };
    schedule(() => {
      scrollToDestination();
      if (hash) schedule(scrollToDestination);
    });
    const path = location.pathname.replace(/\/+$/, '') || '/';
    const seo = getRouteSeo(path);
    const canonicalUrl = getCanonicalUrl(path);
    document.title = seo.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', seo.description);
    document.querySelector('meta[name="robots"]')?.setAttribute('content', seo.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonicalUrl);
    document.querySelector('meta[property="og:type"]')?.setAttribute('content', seo.type);
    document.querySelector('meta[property="og:site_name"]')?.setAttribute('content', 'Alpheaus Daniel — Developer Portfolio');
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', seo.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', seo.description);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalUrl);
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', OG_IMAGE_URL);
    document.querySelector('meta[property="og:image:alt"]')?.setAttribute('content', OG_IMAGE_ALT);
    document.querySelector('meta[name="twitter:card"]')?.setAttribute('content', 'summary_large_image');
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', seo.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', seo.description);
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', OG_IMAGE_URL);
    document.querySelector('meta[name="twitter:image:alt"]')?.setAttribute('content', OG_IMAGE_ALT);
    const routeSchema = document.getElementById('route-schema');
    if (routeSchema) routeSchema.textContent = JSON.stringify(getRouteStructuredData(path));
    return () => {
      frames.forEach((frameId) => window.cancelAnimationFrame(frameId));
    };
  }, [location.pathname, location.hash]);
  return <><a className="skip-link" href="#main-content">Skip to content</a><Splash/><CursorField/><ScrollProgress/><Header/><MotionPage><div id="main-content">{children}</div></MotionPage><Footer/></>;
}

function Eyebrow({ children, light = false }) { return <p className={`eyebrow ${light ? 'eyebrow--light' : ''}`} data-reveal>{children}</p>; }
function Button({ to, children }) { return <TransitionLink to={to} className="button button--dark">{children}<ArrowUpRight size={15}/></TransitionLink>; }
function External({ href, children, className = '' }) { return <a href={href} target="_blank" rel="noreferrer" className={`text-link ${className}`}>{children}<ArrowUpRight size={15}/></a>; }
function Tags({ items }) { return <div className="tags">{items.map((item) => <span key={item}>{item}</span>)}</div>; }

function LiveSurface({ project, large = false, showLink = true }) {
  const [loaded, setLoaded] = useState(false);
  return <div className={`product-surface ${large ? 'product-surface--large' : ''}`} data-parallax><div className="product-surface__bar"><span>LIVE PRODUCT SURFACE</span><span>{project.status}</span></div><div className="product-surface__viewport"><iframe title={`${project.name} live preview`} src={project.href} loading="lazy" onLoad={() => setLoaded(true)} sandbox="allow-scripts allow-same-origin allow-forms allow-popups"/><div className={`surface-fallback ${loaded ? 'is-loaded' : ''}`}><span>{project.name}</span><small>Open the live site for the complete experience</small></div></div><div className="product-surface__foot"><span>{project.evidence}</span>{showLink && <External href={project.href}>Open live surface</External>}</div></div>;
}

function TerminalSurface({ project, showLink = true }) {
  return <div className="product-surface product-surface--terminal" data-parallax><div className="product-surface__bar"><span>REPOSITORY SURFACE</span><span>{project.status}</span></div><div className="terminal-preview"><span>$ inspect --project {project.name}</span><b>{project.type}</b><p>{project.description}</p><span className="terminal-line">process.tree / event.timeline / source.protected</span><span className="terminal-cursor" aria-hidden="true">▋</span></div><div className="product-surface__foot"><span>{project.evidence}</span>{showLink && <External href={project.href}>Open repository</External>}</div></div>;
}

function ProjectVisual({ project, large = false, showLink = true }) { return project.href.includes('github.com') ? <TerminalSurface project={project} showLink={showLink}/> : <LiveSurface project={project} large={large} showLink={showLink}/>; }

function Home() {
  const process = [['01', 'Build', 'Start with a real problem and make the smallest useful version. Define what the tool should do, build the essential path, and make the result observable enough to test.'], ['02', 'Break', 'Challenge the assumptions behind the implementation. Try invalid inputs, awkward edge cases, unexpected states, and interactions that reveal where the design or logic fails.'], ['03', 'Learn', 'Trace the failure instead of hiding it. Inspect the relevant code, follow the data, compare expected and actual behavior, and identify the underlying cause.'], ['04', 'Rebuild', 'Apply the lesson to the implementation. Correct the root cause, simplify where possible, and verify that the fix works without breaking existing behavior.']];
  const featured = ['mouaec', 'telica', 'agenttrace'];
  return <main className="home"><HeroScene/><CinematicPin/><section className="philosophy-scene"><div className="section-grid"><div><Eyebrow>01 / Philosophy</Eyebrow><h2 className="display-title" data-reveal>Make the first useful <em>shape.</em></h2></div><p className="section-intro" data-reveal>Build, break, learn, rebuild. The loop is not a slogan; it is the way a system becomes understandable.</p></div><div className="process-rail" data-reveal>{process.map(([number, name, copy]) => <div className={`process-step process-step--${number}`} key={name}><span>{number}</span><strong><ScrambleText>{name}</ScrambleText></strong><p>{copy}</p></div>)}</div></section><section className="featured-scene"><div className="section-grid"><div><Eyebrow>02 / Selected work</Eyebrow><h2 className="display-title" data-reveal>Small projects.<br/><em>Real reasons.</em></h2></div><p className="section-intro" data-reveal>Preview the product surface. Open a study when you want the problem, decisions, current status, and verified destination.</p></div><div className="featured-project" data-reveal><ProjectVisual project={projects.aster} large/><div className="featured-project__copy"><span className="eyebrow">01 / Technology intelligence platform</span><h3><ScrambleText>Aster</ScrambleText></h3><p>Explore what technologies do, compare their tradeoffs, and understand how the ecosystem connects.</p><Tags items={projects.aster.stack.slice(0, 4)}/><TransitionLink to="/work/aster" className="text-link">Open the Aster study <ArrowUpRight size={15}/></TransitionLink></div></div><div className="mini-work-grid">{featured.map((slug, index) => <TransitionLink key={slug} to={`/work/${slug}`} className="mini-work-card" data-reveal><span className="eyebrow">0{index + 2} / {projects[slug].type}</span><h3><ScrambleText>{projects[slug].name}</ScrambleText></h3><p>{projects[slug].description}</p><span className="mini-work-card__arrow"><ArrowUpRight size={17}/></span></TransitionLink>)}</div></section><section className="timeline-scene"><div className="section-grid"><div><Eyebrow light>03 / Practice timeline</Eyebrow><h2 className="display-title display-title--light" data-reveal>Keep the work<br/><em>close to reality.</em></h2></div><p className="section-intro section-intro--light" data-reveal>Mentorship, interface craft, and developer tools share the same test: does the system help someone make a better next move?</p></div><FlowTimeline/></section></main>;
}

function Work() {
  const groups = [['Developer tools & observability', ['agenttrace', 'nativerelay', 'cleaner']], ['Web applications & platforms', ['aster', 'mouaec']], ['Websites & registration', ['telica', 'axial']]];
  return <main className="route-page"><div className="route-heading"><div><Eyebrow>04 / Selected work · Project index</Eyebrow><h1 className="display-title" data-reveal>Work with<br/><em>a reason.</em></h1></div><p className="section-intro" data-reveal>I build web applications, practical digital products, and developer tools that solve concrete problems. My work spans frontend experiences, backend APIs, database-backed systems, and the debugging that makes them more dependable. I care about how software behaves after the first successful render: how it handles real interactions, how its parts fit together, and how clearly another developer can understand it.</p></div><div className="work-groups">{groups.map(([group, slugs]) => <section className="work-group" key={group}><div className="work-group__head"><Eyebrow>{group}</Eyebrow><span>{slugs.length} {slugs.length === 1 ? 'project' : 'projects'}</span></div><div className="work-list">{slugs.map((slug, index) => { const project = projects[slug]; return <article className="work-row" key={slug} data-reveal><div className="work-row__visual" style={{ viewTransitionName: `project-${slug}` }}><ProjectVisual project={project} showLink={false}/></div><div className="work-row__copy"><div className="work-meta"><span>{project.type}</span><span>{project.status}</span></div><h2><ScrambleText>{project.name}</ScrambleText></h2><p>{project.description}</p><Tags items={project.stack.slice(0, 4)}/><div className="work-row__links"><TransitionLink to={`/work/${slug}`} className="text-link">Read project study <ArrowUpRight size={15}/></TransitionLink><External href={project.href}>{project.href.includes('github.com') ? 'Open repository' : 'Open live website'}</External>{project.repo && <External href={project.repo}>Open repository</External>}</div></div></article>; })}</div></section>)}</div></main>;
}

function Metrics({ active, setActive }) {
  const data = [
    { label: 'Explore', value: '01', title: 'Search the catalogue', copy: 'The repository describes name and category search, filtering, sorting, and pagination over the technology catalogue.' },
    { label: 'Profiles', value: '02', title: 'Open a technology record', copy: 'A technology route retrieves the selected record together with its use cases and resources.' },
    { label: 'Compare', value: '03', title: 'Compare without ranking', copy: 'The comparison view is designed for two to four selected technologies, presenting their details without an overall score or rank.' },
    { label: 'Ecosystem', value: '04', title: 'Follow typed relationships', copy: 'The API returns incoming and outgoing technology relationships for a connected view of the catalogue.' },
  ];
  return (
    <div className="metrics-module">
      <div className="metrics-tabs" role="tablist" aria-label="Aster repository product surfaces">
        {data.map((item, index) => (
          <button key={item.label} type="button" role="tab" aria-selected={active === index} className={active === index ? 'is-active' : ''} onClick={() => setActive(index)}>
            <span>{item.value}</span>{item.label}
          </button>
        ))}
      </div>
      <div className="metric-detail">
        <div className="metric-orbit"><span>{data[active].value}</span><i/><i/><i/></div>
        <div><span className="eyebrow">Repository surface / {data[active].value}</span><h3>{data[active].title}</h3><p>{data[active].copy}</p></div>
      </div>
    </div>
  );
}

function AsterStudy() {
  const [active, setActive] = useState(0);
  const stack = ['React', 'TypeScript', 'Vite', 'Express', 'PostgreSQL', 'Supabase'];
  return (
    <main className="aster-study">
      <section className="study-hero">
        <div className="study-hero__top">
          <TransitionLink to="/work" className="eyebrow">← Work index</TransitionLink>
          <span className="eyebrow">Live / evolving</span>
        </div>
        <div className="study-hero__grid">
          <div>
            <span className="eyebrow">Project study / 01</span>
            <h1 className="study-title" data-reveal>Aster</h1>
            <p className="study-type">Technology intelligence and discovery</p>
            <p className="study-lede" data-reveal>Aster helps developers understand what technologies do and how they connect. The project is organized around exploring a catalogue, opening technology profiles, comparing options, and following ecosystem relationships.</p>
            <div className="study-actions" data-reveal>
              <External href={projects.aster.href}>Open live Aster</External>
              <External href={projects.aster.repo}>Inspect GitHub repository</External>
            </div>
          </div>
          <div className="study-hero__artifact" style={{ viewTransitionName: 'project-aster' }}>
            <ProjectVisual project={projects.aster} large />
          </div>
        </div>
      </section>

      <section className="study-section study-section--paper">
        <div className="study-section__intro">
          <span className="eyebrow">01 / Project overview</span>
          <h2 className="display-title" data-reveal>Make the technology<br/><em>landscape legible.</em></h2>
          <p className="section-intro" data-reveal>The repository describes Aster as a technology intelligence and discovery platform: a developer should be able to understand what a technology does and see how it connects to other tools.</p>
        </div>
        <div className="study-story-grid">
          <article>
            <span className="eyebrow">The question</span>
            <h3>What does this tool do—and where does it fit?</h3>
            <p>Aster starts from a focused product question rather than a claimed market study. A technology name is only useful when its purpose, use cases, alternatives, and relationships can be understood together.</p>
          </article>
          <article>
            <span className="eyebrow">The approach</span>
            <h3>Move from discovery to context.</h3>
            <p>The repository groups the experience into Explore, technology profiles, Compare, and Ecosystem views. Together they provide routes from the catalogue to a specific tool and its typed relationships.</p>
          </article>
        </div>
      </section>

      <section className="study-section study-section--paper">
        <div className="study-section__intro">
          <span className="eyebrow">02 / Product surfaces</span>
          <h2 className="display-title" data-reveal>Four routes into<br/><em>the catalogue.</em></h2>
          <p className="section-intro" data-reveal>These four surfaces are documented in the current Aster repository. The deployed-site status is recorded separately below.</p>
        </div>
        <Metrics active={active} setActive={setActive} />
      </section>

      <section className="study-section study-section--ink">
        <div className="study-section__intro">
          <span className="eyebrow eyebrow--light">03 / Technical approach</span>
          <h2 className="display-title display-title--light" data-reveal>A client, an API,<br/><em>a catalogue.</em></h2>
          <p className="section-intro section-intro--light" data-reveal>The current repository uses a React, TypeScript, and Vite client with an Express and TypeScript REST API. The API reads catalogue data from PostgreSQL managed by Supabase, using <code>pg</code>.</p>
        </div>
        <div className="aster-architecture" data-reveal>
          <div className="architecture-node architecture-node--input">React + TypeScript + Vite<small>client interface</small></div>
          <div className="architecture-line" />
          <div className="architecture-node architecture-node--core">Express REST API<small>TypeScript / versioned routes</small></div>
          <div className="architecture-line" />
          <div className="architecture-node architecture-node--data">PostgreSQL<small>managed by Supabase / accessed with pg</small></div>
        </div>
        <div className="study-notes aster-api-grid">
          <article><span><code>GET /api/v1/technologies</code></span><h3>Find catalogue entries.</h3><p>The list endpoint supports search, category/type/ecosystem filters, name sorting, and pagination.</p></article>
          <article><span><code>GET /api/v1/technologies/:slug</code></span><h3>Read one profile.</h3><p>A technology record includes its use cases and resources.</p></article>
          <article><span><code>GET /api/v1/technologies/:slug/relationships</code></span><h3>Follow connections.</h3><p>The relationships endpoint returns typed incoming and outgoing links.</p></article>
        </div>
        <div className="aster-stack"><span className="aster-stack__label">STACK</span>{stack.map((item) => <span className="aster-stack__item" key={item}>{item}</span>)}</div>
      </section>

      <section className="study-section study-section--paper">
        <div className="study-section__intro">
          <span className="eyebrow">04 / Current status</span>
          <h2 className="display-title" data-reveal>Source and deployment,<br/><em>kept distinct.</em></h2>
          <p className="section-intro" data-reveal>Repository capability and deployed availability are different checks. This case study keeps both visible instead of presenting a loading surface as a completed result.</p>
        </div>
        <div className="artifact-grid aster-status-grid">
          <article className="artifact-card" data-reveal>
            <span>REPOSITORY / MAIN</span>
            <h3>Four product experiences are documented.</h3>
            <p>The README describes Explore, technology profiles, Compare, and Ecosystem, backed by an Express REST API and Supabase-managed PostgreSQL.</p>
            <External href={projects.aster.repo}>Open the Aster repository</External>
          </article>
          <article className="artifact-card artifact-card--lilac" data-reveal>
            <span>LIVE CHECK / 14 OCT 2026</span>
            <h3>The public exploration is still in progress.</h3>
            <p>The live homepage says the exploration experience is in development. During this check, the deployed Explore route remained on “Loading technologies…”.</p>
            <External href={projects.aster.href}>Open the live product</External>
          </article>
        </div>
      </section>

      <section className="next-study">
        <span className="eyebrow">Next study</span>
        <TransitionLink to="/work/mouaec"><span>MOUAEC</span><ArrowUpRight size={20}/></TransitionLink>
      </section>
    </main>
  );
}

function Engineering() {
  const systems = [
    { name: 'AgentTrace', focus: 'AI coding-agent observability', status: projects.agenttrace.status, href: projects.agenttrace.href, description: "Explores how developers can observe running AI coding-agent processes and inspect process activity through a more unified workflow. Its focus is visibility into agent processes and recorded activity—not claims of access to an agent's private reasoning or every internal action.", problem: 'Agent activity can be difficult to inspect when process state and recorded events are scattered across tools.', approach: 'Follow the running processes and their recorded activity through one inspectable workflow.' },
    { name: 'Cleaner', focus: 'Local-first code cleaning', status: projects.cleaner.status, href: projects.cleaner.href, description: 'Explores how code-cleaning operations can be made more practical and safer to use, with an emphasis on preserving the original source by default and avoiding transformations that remove code still in use.', problem: 'Cleaning code can be risky when a transformation changes the source in place or removes code that is still needed.', approach: 'Keep the workflow local-first and write cleaned output separately from the original source by default.' },
    { name: 'NativeRelay', focus: 'Native system observations', status: projects.nativerelay.status, href: projects.nativerelay.href, description: 'Explores local-first collection and normalization of native system events so that low-level process and file observations can be represented in a consistent, inspectable format.', problem: 'Low-level process and file activity is difficult to compare when observations arrive in different native formats.', approach: 'Explore a consistent, inspectable representation for local process and file observations.' },
  ];
  return <main className="route-page route-page--paper"><div className="route-heading"><div><Eyebrow>05 / Engineering · The systems room</Eyebrow><h1 className="display-title" data-reveal>Make the<br/><em>invisible legible.</em></h1></div><p className="section-intro" data-reveal>I’m interested in the systems behind the code: how tools observe activity, how small implementation decisions affect reliability, and how developers can understand what software is actually doing. My developer-tool experiments explore code cleaning, AI coding-agent visibility, and native system observations. Each project approaches a different part of the problem, with an emphasis on practical insight rather than unnecessary complexity.</p></div><section className="systems-intro" aria-labelledby="systems-intro-title"><span className="eyebrow">One question / Three investigations</span><h2 id="systems-intro-title" className="display-title" data-reveal>Make behavior<br/><em>easier to inspect.</em></h2><p>These projects investigate different ways to make software behavior, code transformations, and system activity easier to inspect.</p></section><div className="systems-studies">{systems.map((system, index) => <article className="systems-study" key={system.name} data-reveal><header className="systems-study__header"><div><span className="eyebrow">0{index + 1} / {system.focus}</span><h2>{system.name}</h2></div><span className="systems-study__status">{system.status}</span></header><div className="systems-study__grid"><div><span>PROBLEM</span><p>{system.problem}</p></div><div><span>APPROACH / PROJECT FOCUS</span><p>{system.description}</p></div><div><span>IMPLEMENTATION DIRECTION</span><p>{system.approach}</p></div></div><External href={system.href}>View {system.name} repository</External></article>)}</div></main>;
}
function About() { const philosophy = [['BUILD', 'Create something testable.', 'Start with a real problem and make the smallest useful version. Define what the tool should do, build the essential path, and make the result observable enough to test.'], ['BREAK', 'Challenge the assumptions.', 'Challenge the assumptions behind the implementation. Try invalid inputs, awkward edge cases, unexpected states, and interactions that reveal where the design or logic fails.'], ['LEARN', 'Find the underlying cause.', 'Trace the failure instead of hiding it. Inspect the relevant code, follow the data, compare expected and actual behavior, and identify the underlying cause.'], ['REBUILD', 'Improve without regressions.', 'Apply the lesson to the implementation. Correct the root cause, simplify where possible, and verify that the fix works without breaking existing behavior.']]; return <main className="about-page"><section className="about-intro route-page"><div className="route-heading"><div><Eyebrow>06 / About · Who I am</Eyebrow><h1 className="display-title" data-reveal>The person<br/>behind the <em>work.</em></h1></div><p className="section-intro" data-reveal>I’m a software developer and Computer Engineering student who enjoys understanding how systems work beneath the surface. I build web applications and developer tools, investigate implementation failures, and experiment with ideas that make software easier to understand and maintain. My approach is practical: build something real, test its assumptions, find what breaks, and improve it through what I learn.</p></div><div className="about-profile" data-reveal><div className="profile-photo-slot" data-photo-missing={assetConfig.profilePhoto.available ? undefined : 'true'}><span className="profile-photo-fallback" aria-hidden="true">Alpheaus Daniel · portrait</span>{assetConfig.profilePhoto.available ? <img src={assetConfig.profilePhoto.path} alt="Alpheaus Daniel" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.parentElement.dataset.photoMissing = 'true'; }}/>: null}</div><div className="about-profile__copy"><p>My projects have taught me that getting something to work is only the beginning. I care about the decisions behind it, how its different parts fit together, how it responds to real use, and whether another developer can understand and maintain it.</p><p>I’ve also spent time teaching and building alongside other learners. Through LogicLabs Academy, I helped create a software-learning community that served more than 200 students. That experience reinforced my belief that learning becomes more valuable when people can build, question, share, and improve things together.</p><ResumeAction/><SocialLinks/></div></div></section><section className="about-thinking"><div className="about-thinking__inner"><div className="about-thinking__heading"><Eyebrow light>How I think</Eyebrow><h2 className="display-title display-title--light" data-reveal>Build.<br/><em>Break. Learn. Rebuild.</em></h2><p>Working across web applications and developer tools means staying close to the evidence: make a useful version, test it honestly, and let the investigation change the next version.</p></div><div className="about-philosophy">{philosophy.map(([label, title, copy], index) => <article className={`about-philosophy__step about-philosophy__step--${index + 1}`} key={label} data-reveal data-reveal-order={index}><span>0{index + 1} / {label}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section><section className="about-history route-page"><div className="route-heading"><div><Eyebrow>03 / Selected chapters</Eyebrow><h2 className="display-title" data-reveal>Where the<br/><em>practice grew.</em></h2></div><p className="section-intro" data-reveal>Teaching, unfinished ideas, and live interface work have each shaped how I make and inspect software.</p></div><FlowTimeline/></section></main>; }
function Contact() { return <main className="contact-page"><div><Eyebrow light>07 / Contact · Make the next thing clearer</Eyebrow><h1 className="contact-title" data-reveal>Have a system<br/>worth <em>shaping?</em></h1><p className="contact-lede" data-reveal>I’m interested in thoughtful product work, developer tools, and collaborations where the details do real work.</p></div><div className="contact-grid" data-reveal><div><span>CONNECT</span><SocialLinks/></div><div><span>RESUME</span><p>A concise record of selected projects, technical decisions, and experience.</p><ResumeAction/></div><div><span>AXIAL SYSTEMS</span><p>Live landing page; broader work remains in development.</p><External href={projects.axial.href}>Open live website</External><External href={projects.axial.repo}>Open repository</External></div></div></main>; }
function NotFound() { return <main className="route-page"><Eyebrow>404 / Not found</Eyebrow><h1 className="display-title">This path<br/><em>doesn’t hold.</em></h1><Button to="/">Return home</Button></main>; }
function ProductDetail({ project, slug }) { const facts = { mouaec: ['Voting that stays auditable', '30-second count refreshes, approved administrator corrections, allowlisted administrator email, frontend checks, and Supabase RLS.', 'Delivered university exercise'], telica: ['A registration flow with a real handoff', 'A focused cohort application path with Web3Forms email notifications and a live registration surface.', 'Live concept'], agenttrace: ['Observe the agent, not an imagined interior', 'Process observability, concurrent agents, process trees, snapshots, watch modes, supervised runs, and event timelines.', 'Repository direction'], nativerelay: ['Normalize native signals', 'A local-first exploration of normalized process and file observations. Implemented and planned capabilities remain distinct.', 'Repository exploration'], cleaner: ['Protect the original by default', 'A local-first code-cleaning CLI that simplifies cleaning workflows and keeps cleaned output separate from the source.', 'Repository / building'] }[slug] || ['A product surface worth inspecting', project.description, project.status]; return <main className="product-study"><section className="product-study__hero"><div className="study-hero__top"><TransitionLink to="/work" className="eyebrow">← Work index</TransitionLink><span className="eyebrow">{project.status}</span></div><div className="product-study__intro"><div><span className="eyebrow">Project study / {slug}</span><h1 className="study-title">{project.name}</h1><p className="study-type">{project.type}</p><p className="study-lede">{project.description}</p><div className="study-actions"><External href={project.href}>{project.href.includes('github') ? 'Open GitHub repository' : 'Open live product'}</External>{project.repo && <External href={project.repo}>Open GitHub repository</External>}</div></div><ProjectVisual project={project} large/></div></section><section className="product-study__body"><div className="product-statement"><span className="eyebrow">Product language / 01</span><h2>{facts[0]}</h2><p>{facts[1]}</p></div><div className="product-facts"><article><span>STATE</span><b>{facts[2]}</b></article><article><span>STACK</span><Tags items={project.stack}/></article><article><span>READ NEXT</span><p>Open the live surface or repository, then return to the work index for the next product.</p></article></div></section></main>; }
export function App() { return <Layout><Routes><Route path="/" element={<Home/>}/><Route path="/work" element={<Work/>}/><Route path="/work/aster" element={<AsterStudy/>}/><Route path="/work/:slug" element={<ProductDetailRoute/>}/><Route path="/engineering" element={<Engineering/>}/><Route path="/about" element={<About/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<NotFound/>}/></Routes></Layout>; }
function ProductDetailRoute() { const { slug } = useParams(); const project = projects[slug]; return project ? <ProductDetail project={project} slug={slug}/> : <NotFound/>; }

const root = typeof document !== 'undefined' ? document.getElementById('root') : null;
if (root) {
  const app = <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}><App/></BrowserRouter>;
  if (root.firstElementChild || root.textContent.trim()) hydrateRoot(root, app);
  else createRoot(root).render(app);
}
