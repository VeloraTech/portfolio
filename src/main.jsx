import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowUpRight, FileText, Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, OrbitControls } from '@react-three/drei';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

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
  { label: 'GitHub', href: 'https://github.com/VeloraTech' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/coach-logic-804600366/' },
  { label: 'X', href: 'https://x.com/RyanDan934' },
  { label: 'Instagram', href: 'https://www.instagram.com/tech.velora' },
  { label: 'Email', href: 'mailto:alpheausdalighton@gmail.com' },
];
const assetConfig = {
  profilePhoto: { available: true, path: 'assets/profile-photo.jpg' },
  resume: { available: true, path: 'assets/Alpheaus-Daniel-Code-Quality-Engineer-CV.pdf' },
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
  const [reduced, setReduced] = useState(false);
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
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const scramble = () => {
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
    const particles = Array.from({ length: 26 }, (_, index) => ({ x: -100, y: -100, size: index % 6 === 0 ? 2.4 : 1.25, lag: .07 + (index % 7) * .014, alpha: .12 + (index % 4) * .035 }));
    let raf = 0;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      el.width = window.innerWidth * ratio;
      el.height = window.innerHeight * ratio;
      el.style.width = `${window.innerWidth}px`;
      el.style.height = `${window.innerHeight}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const move = (event) => { pointer.tx = event.clientX; pointer.ty = event.clientY; };
    const render = () => {
      pointer.vx += (pointer.tx - pointer.x) * .09;
      pointer.vy += (pointer.ty - pointer.y) * .09;
      pointer.vx *= .72;
      pointer.vy *= .72;
      pointer.x += pointer.vx;
      pointer.y += pointer.vy;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach((particle, index) => {
        const lead = particles[index - 1] || pointer;
        particle.x += (lead.x - particle.x) * particle.lag;
        particle.y += (lead.y - particle.y) * particle.lag;
        ctx.beginPath();
        ctx.fillStyle = `rgba(113, 131, 104, ${particle.alpha * Math.min(1, Math.hypot(pointer.vx, pointer.vy) / 7 + .2)})`;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(render);
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', move); };
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
  useLayoutEffect(() => {
    if (!scope.current || reduced) return undefined;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((element) => gsap.fromTo(element, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 84%', once: true } }));
      gsap.utils.toArray('[data-parallax]').forEach((element) => gsap.to(element, { yPercent: -12, ease: 'none', scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: true } }));
      gsap.utils.toArray('[data-line]').forEach((element) => gsap.fromTo(element, { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 1, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 85%', once: true } }));
      const hero = scope.current.querySelector('.hero-scene');
      if (hero) {
        const timeline = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: '+=1150', scrub: 1.1 } });
        timeline.to('.hero-copy', { y: -145, opacity: .16, ease: 'none' }, 0)
          .to('.hero-stage--front', { scale: 1.46, rotateZ: 5, xPercent: 9, yPercent: 10, ease: 'none' }, 0)
          .to('.hero-depth--mid', { xPercent: 14, yPercent: -12, scale: 1.18, ease: 'none' }, 0)
          .to('.hero-depth--back', { xPercent: -8, yPercent: 10, scale: 1.08, ease: 'none' }, 0)
          .to('.hero-annotations', { yPercent: -28, opacity: .35, ease: 'none' }, 0)
          .to('.hero-foot', { y: 40, opacity: 0, ease: 'none' }, 0);
      }
    }, scope);
    return () => ctx.revert();
  }, [reduced]);
  return <div ref={scope}>{children}</div>;
}

function AxisPoint({ position, label, detail, color }) {
  const [hovered, setHovered] = useState(false);
  return <group position={position} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
    <mesh scale={hovered ? 1.45 : 1}><sphereGeometry args={[.09, 18, 18]}/><meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? .8 : .18} roughness={.28}/></mesh>
    <Html distanceFactor={7} position={[.13, .13, 0]} style={{ pointerEvents: 'none' }}><span className={`scene-tooltip ${hovered ? 'is-visible' : ''}`}><b>{label}</b><small>{detail}</small></span></Html>
  </group>;
}

function SceneRig() {
  const rig = useRef(null);
  useFrame((state, delta) => {
    if (!rig.current) return;
    const scroll = Math.min(window.scrollY, 1200);
    rig.current.rotation.y += delta * .12;
    rig.current.rotation.y += scroll * .000012;
    rig.current.rotation.x = Math.sin(state.clock.elapsedTime * .4) * .06 + state.pointer.y * .08;
    rig.current.rotation.z = state.pointer.x * .035;
  });
  return <group ref={rig} rotation={[.2, -.38, .08]}>
    <Float speed={1.2} rotationIntensity={.18} floatIntensity={.45}>
      <mesh castShadow><icosahedronGeometry args={[.9, 2]}/><meshStandardMaterial color="#d7d0c0" roughness={.26} metalness={.05} emissive="#718368" emissiveIntensity={.12}/></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.12, .012, 8, 64]}/><meshBasicMaterial color="#aa6a4d" transparent opacity={.8}/></mesh>
      <mesh rotation={[0, Math.PI / 2, .42]}><torusGeometry args={[1.34, .008, 8, 64]}/><meshBasicMaterial color="#aaa0c6" transparent opacity={.75}/></mesh>
    </Float>
    <mesh rotation={[0, 0, Math.PI / 2]} position={[1.2, 0, 0]}><cylinderGeometry args={[.008, .008, 2.8, 8]}/><meshBasicMaterial color="#718368"/></mesh>
    <mesh rotation={[0, 0, Math.PI / 2]} position={[-1.2, 0, 0]}><cylinderGeometry args={[.008, .008, 2.8, 8]}/><meshBasicMaterial color="#718368"/></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 1.2, 0]}><cylinderGeometry args={[.008, .008, 2.8, 8]}/><meshBasicMaterial color="#aa6a4d"/></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}><cylinderGeometry args={[.008, .008, 2.8, 8]}/><meshBasicMaterial color="#aa6a4d"/></mesh>
    <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0, 1.2]}><cylinderGeometry args={[.008, .008, 2.8, 8]}/><meshBasicMaterial color="#aaa0c6"/></mesh>
    <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0, -1.2]}><cylinderGeometry args={[.008, .008, 2.8, 8]}/><meshBasicMaterial color="#aaa0c6"/></mesh>
    {axisPoints.map((point) => <AxisPoint key={point.label} {...point}/>) }
  </group>;
}

function ThreeScene() {
  return <Canvas className="three-canvas" dpr={[1, 1.5]} camera={{ position: [3.6, 2.7, 5.1], fov: 42 }} gl={{ antialias: true, alpha: true }}>
    <ambientLight intensity={1.5}/><directionalLight position={[4, 5, 4]} intensity={2.8} color="#fffaf0"/><pointLight position={[-4, -2, 2]} intensity={6} distance={8} color="#718368"/><pointLight position={[3, 0, -2]} intensity={4} distance={7} color="#aa6a4d"/>
    <SceneRig/><OrbitControls enablePan={false} enableZoom={false} enableRotate={false}/>
  </Canvas>;
}

class SceneErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function SceneAnnotations() {
  const [active, setActive] = useState('BUILD');
  return <div className="hero-annotations" aria-label="Interactive axis points">
    {axisPoints.map((point) => <button key={point.label} type="button" className={active === point.label ? 'is-active' : ''} onFocus={() => setActive(point.label)} onMouseEnter={() => setActive(point.label)} onClick={() => setActive(point.label)}><span>{point.label}</span><small>{point.detail}</small></button>)}
    <p>Focus a point to inspect the practice.</p>
  </div>;
}

function HeroFallback() {
  return <div className="scene-fallback" aria-hidden="true"><div className="fallback-core">CL</div><i className="fallback-axis fallback-axis--x"/><i className="fallback-axis fallback-axis--y"/><i className="fallback-orbit fallback-orbit--one"/><i className="fallback-orbit fallback-orbit--two"/><b className="fallback-point fallback-point--one">BUILD</b><b className="fallback-point fallback-point--two">BREAK</b><b className="fallback-point fallback-point--three">LEARN</b><b className="fallback-point fallback-point--four">REBUILD</b></div>;
}

function HeroScene() {
  return <section className="hero-scene" aria-labelledby="hero-title"><div className="hero-depth hero-depth--back"/><div className="hero-depth hero-depth--mid"/><div className="hero-grid"><div className="hero-copy"><p className="eyebrow">Computer engineering student · technical mentor · toolmaker</p><h1 id="hero-title" className="hero-title" data-reveal>I build clarity into <em><ScrambleText>complex systems.</ScrambleText></em></h1><p className="hero-lede" data-reveal>I investigate how software holds together, then turn that understanding into useful products, developer tools, and interfaces people can actually use.</p><div className="hero-actions" data-reveal><Button to="/work">Enter selected work</Button><TransitionLink to="/about" className="text-link">Read the short version <ArrowUpRight size={15}/></TransitionLink></div></div><div className="hero-stage hero-stage--front"><HeroFallback/><SceneErrorBoundary fallback={<HeroFallback/>}><ThreeScene/></SceneErrorBoundary><SceneAnnotations/><span className="hero-stage__label hero-stage__label--top">01 / INTERACTIVE AXIS</span><span className="hero-stage__label hero-stage__label--bottom">Hover / focus the points</span></div></div><div className="hero-foot"><span>Scroll to move through the practice</span><span>INDEX / 00</span></div></section>;
}

function CinematicPin() {
  const scope = useRef(null);
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    if (!scope.current || reduced) return undefined;
    const ctx = gsap.context(() => {
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
    return () => ctx.revert();
  }, [reduced]);
  return <section ref={scope} className="cinematic-section" aria-label="Build, break, learn, rebuild story"><div className="cinematic-stage"><div className="pin-bg"/><div className="pin-mid"/><div className="pin-orbit"/><div className="pin-word-wrap"><span className="eyebrow eyebrow--light">SCROLL / INTERPRET / REBUILD</span><h2 className="pin-word">The system<br/><em>moves.</em></h2></div><div className="pin-card"><span>AXIS / 04</span><b>REBUILD</b><small>change the relationship, not just the color</small></div><p className="pin-route">A pinned scene that travels from abstraction to a readable next move.</p></div></section>;
}

function FlowTimeline() {
  const rail = useRef(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => { if (!rail.current) return; const rect = rail.current.getBoundingClientRect(); setProgress(Math.min(1, Math.max(0, (window.innerHeight * .76 - rect.top) / Math.max(1, rect.height)))); };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  return <div className="experience-map" ref={rail}><div className="experience-map__legend"><span>2023 → MAY 2026</span><b>40 months / proportional dated span</b></div><div className="timeline-curve"><svg viewBox="0 0 760 720" role="img" aria-label="S-shaped experience timeline from 2023 to May 2026"><path className="experience-map__tube" d="M112 50 C650 46 674 160 576 214 C444 286 166 230 130 340 C92 456 304 508 618 458 C706 444 700 584 510 680" pathLength="1"/><path className="experience-map__liquid" d="M112 50 C650 46 674 160 576 214 C444 286 166 230 130 340 C92 456 304 508 618 458 C706 444 700 584 510 680" pathLength="1" style={{ strokeDashoffset: 1 - progress }}/><circle className="experience-map__marker" cx="112" cy="50" r="10"/><circle className="experience-map__marker" cx="510" cy="680" r="10"/></svg><span className="curve-date curve-date--start">2023</span><span className="curve-date curve-date--end">MAY 2026</span></div><article className="experience-card experience-card--academy"><span>DATED SPAN / 40 MONTHS</span><h3>LogicLabs Academy</h3><p>Founded and led a developer education initiative that served more than 200 students before closing around May 2026.</p></article><article className="experience-card experience-card--axial"><span>UNDATED ENGAGEMENT</span><h3>Axial Systems</h3><p>Lead Developer work on landing-page interfaces, animation, scroll interactions, and visual craft. No start/end date is claimed.</p></article><article className="experience-card experience-card--tools"><span>ONGOING PRACTICE</span><h3>AgentTrace · NativeRelay · Cleaner</h3><p>Current tool-building directions in observability, normalized telemetry, and safer code-cleaning workflows.</p></article></div>;
}

function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [location.pathname]);
  return <header className="site-header"><TransitionLink to="/" className="wordmark"><span className="wordmark__glyph">CL</span><span>COACH<br/><b>LOGIC</b></span></TransitionLink><nav className="desktop-nav" aria-label="Primary navigation">{navLinks.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => isActive ? 'is-active' : ''}>{label}</NavLink>)}</nav><span className="availability"><i/>Available for thoughtful work</span><button className="menu-button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={20}/> : <Menu size={20}/>}</button>{open && <nav className="mobile-nav" aria-label="Mobile navigation">{navLinks.map(([to, label], index) => <TransitionLink key={to} to={to}>{label}<span>{String(index + 1).padStart(2, '0')}</span></TransitionLink>)}</nav>}</header>;
}

function SocialLinks({ compact = false }) {
  return <div className={`social-links ${compact ? 'social-links--compact' : ''}`} aria-label="Social profiles">{socialLinks.map((link) => <a key={link.label} href={link.href} target={link.href.startsWith('mailto:') ? undefined : '_blank'} rel={link.href.startsWith('mailto:') ? undefined : 'noreferrer'} aria-label={`Open ${link.label}`}><span>{link.label}</span><ArrowUpRight size={14}/></a>)}</div>;
}

function ResumeAction() {
  return assetConfig.resume.available ? <a className="resume-action" href={assetConfig.resume.path} download="Alpheaus-Daniel-Code-Quality-Engineer-CV.pdf"><FileText size={15}/> Download Resume <ArrowUpRight size={14}/></a> : <span className="resume-action resume-action--pending" role="status"><FileText size={15}/> Download Resume <small>PDF pending upload</small></span>;
}

function Footer() {
  return <footer className="site-footer"><svg className="footer-wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0 50 C160 6 270 80 430 42 S720 4 890 42 S1180 80 1440 28 V80 H0 Z"/></svg><div className="footer-top"><div><p className="eyebrow eyebrow--light">Coach Logic / 2026</p><p className="footer-note">A developer portfolio built around useful systems, honest evidence, and a little spatial thinking.</p><ResumeAction/></div><TransitionLink to="/contact" className="footer-cta">Start a thoughtful conversation <ArrowUpRight size={28}/></TransitionLink></div><div className="footer-grid"><div><span>EXPLORE</span><TransitionLink to="/work">Selected work <ArrowUpRight size={14}/></TransitionLink><TransitionLink to="/engineering">Engineering notes <ArrowUpRight size={14}/></TransitionLink></div><div><span>CONNECT</span><SocialLinks compact/></div><div><span>STATUS</span><p>Available for thoughtful product, tool, and interface work.</p></div></div><div className="footer-bottom"><span>Build. Break. Learn. Rebuild.</span><span>Made with React / Three / GSAP</span></div></footer>;
}

function Layout({ children }) {
  const location = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); requestAnimationFrame(() => ScrollTrigger.refresh()); }, [location.pathname]);
  return <><a className="skip-link" href="#main-content">Skip to content</a><Splash/><CursorField/><ScrollProgress/><Header/><MotionPage><div id="main-content">{children}</div></MotionPage><Footer/></>;
}

function Eyebrow({ children, light = false }) { return <p className={`eyebrow ${light ? 'eyebrow--light' : ''}`} data-reveal>{children}</p>; }
function Button({ to, children }) { return <TransitionLink to={to} className="button button--dark">{children}<ArrowUpRight size={15}/></TransitionLink>; }
function External({ href, children, className = '' }) { return <a href={href} target="_blank" rel="noreferrer" className={`text-link ${className}`}>{children}<ArrowUpRight size={15}/></a>; }
function Tags({ items }) { return <div className="tags">{items.map((item) => <span key={item}>{item}</span>)}</div>; }

function LiveSurface({ project, large = false }) {
  const [loaded, setLoaded] = useState(false);
  return <div className={`product-surface ${large ? 'product-surface--large' : ''}`} data-parallax><div className="product-surface__bar"><span>LIVE PRODUCT SURFACE</span><span>{project.status}</span></div><div className="product-surface__viewport"><iframe title={`${project.name} live preview`} src={project.href} loading="lazy" onLoad={() => setLoaded(true)} sandbox="allow-scripts allow-same-origin allow-forms allow-popups"/><div className={`surface-fallback ${loaded ? 'is-loaded' : ''}`}><span>{project.name}</span><small>Preview frame / use the live link to inspect the full product</small></div></div><div className="product-surface__foot"><span>{project.evidence}</span><External href={project.href}>Open live surface</External></div></div>;
}

function TerminalSurface({ project }) {
  return <div className="product-surface product-surface--terminal" data-parallax><div className="product-surface__bar"><span>REPOSITORY SURFACE</span><span>{project.status}</span></div><div className="terminal-preview"><span>$ inspect --project {project.name}</span><b>{project.type}</b><p>{project.description}</p><span className="terminal-line">process.tree / event.timeline / source.protected</span><span className="terminal-cursor" aria-hidden="true">▋</span></div><div className="product-surface__foot"><span>{project.evidence}</span><External href={project.href}>Open repository</External></div></div>;
}

function ProjectVisual({ project, large = false }) { return project.href.includes('github.com') ? <TerminalSurface project={project}/> : <LiveSurface project={project} large={large}/>; }

function Home() {
  const process = [['01', 'Build', 'Make a useful first shape.'], ['02', 'Break', 'Test the assumption.'], ['03', 'Learn', 'Keep the signal.'], ['04', 'Rebuild', 'Return with a clearer structure.']];
  const featured = ['mouaec', 'telica', 'agenttrace'];
  return <main className="home"><HeroScene/><CinematicPin/><section className="philosophy-scene"><div className="section-grid"><div><Eyebrow>01 / Philosophy</Eyebrow><h2 className="display-title" data-reveal>Make the first useful <em>shape.</em></h2></div><p className="section-intro" data-reveal>Build, break, learn, rebuild. The loop is not a slogan; it is the way a system becomes understandable.</p></div><div className="process-rail" data-reveal>{process.map(([number, name, copy]) => <div className={`process-step process-step--${number}`} key={name}><span>{number}</span><strong><ScrambleText>{name}</ScrambleText></strong><p>{copy}</p></div>)}</div></section><section className="featured-scene"><div className="section-grid"><div><Eyebrow>02 / Selected work</Eyebrow><h2 className="display-title" data-reveal>Small projects.<br/><em>Real reasons.</em></h2></div><p className="section-intro" data-reveal>Preview the product surface. Open a study when you want the problem, decisions, current status, and verified destination.</p></div><div className="featured-project" data-reveal><ProjectVisual project={projects.aster} large/><div className="featured-project__copy"><span className="eyebrow">01 / Technology intelligence platform</span><h3><ScrambleText>Aster</ScrambleText></h3><p>Explore what technologies do, compare their tradeoffs, and understand how the ecosystem connects.</p><Tags items={projects.aster.stack.slice(0, 4)}/><TransitionLink to="/work/aster" className="text-link">Open the Aster study <ArrowUpRight size={15}/></TransitionLink></div></div><div className="mini-work-grid">{featured.map((slug, index) => <TransitionLink key={slug} to={`/work/${slug}`} className="mini-work-card" data-reveal><span className="eyebrow">0{index + 2} / {projects[slug].type}</span><h3><ScrambleText>{projects[slug].name}</ScrambleText></h3><p>{projects[slug].description}</p><span className="mini-work-card__arrow"><ArrowUpRight size={17}/></span></TransitionLink>)}</div></section><section className="timeline-scene"><div className="section-grid"><div><Eyebrow light>03 / Practice timeline</Eyebrow><h2 className="display-title display-title--light" data-reveal>Keep the work<br/><em>close to reality.</em></h2></div><p className="section-intro section-intro--light" data-reveal>Mentorship, interface craft, and developer tools share the same test: does the system help someone make a better next move?</p></div><FlowTimeline/></section></main>;
}

function Work() {
  const groups = [['Developer tools & observability', ['agenttrace', 'nativerelay', 'cleaner']], ['Web applications & platforms', ['aster', 'mouaec']], ['Websites & registration', ['telica', 'axial']]];
  return <main className="route-page"><div className="route-heading"><div><Eyebrow>04 / Selected work · Project index</Eyebrow><h1 className="display-title" data-reveal>Work with<br/><em>a reason.</em></h1></div><p className="section-intro" data-reveal>Concise surfaces first. Open a study when you want the problem, decisions, current status, and verified destination.</p></div><div className="work-groups">{groups.map(([group, slugs]) => <section className="work-group" key={group}><div className="work-group__head"><Eyebrow>{group}</Eyebrow><span>{slugs.length} {slugs.length === 1 ? 'project' : 'projects'}</span></div><div className="work-list">{slugs.map((slug, index) => { const project = projects[slug]; return <article className="work-row" key={slug} data-reveal><TransitionLink to={`/work/${slug}`} className="work-row__visual" style={{ viewTransitionName: `project-${slug}` }}><ProjectVisual project={project}/></TransitionLink><div className="work-row__copy"><div className="work-meta"><span>{project.type}</span><span>{project.status}</span></div><h2><ScrambleText>{project.name}</ScrambleText></h2><p>{project.description}</p><Tags items={project.stack.slice(0, 4)}/><div className="work-row__links"><TransitionLink to={`/work/${slug}`} className="text-link">Read project study <ArrowUpRight size={15}/></TransitionLink><External href={project.href}>{project.href.includes('github.com') ? 'Open repository' : 'Open live website'}</External>{project.repo && <External href={project.repo}>Open repository</External>}</div></div></article>; })}</div></section>)}</div></main>;
}

function Metrics({ active, setActive }) {
  const data = [{ label: 'Explore', value: '01', title: 'A surface for curiosity', copy: 'The implemented exploration surface turns a broad technology question into a browsable starting point.' }, { label: 'Profiles', value: '02', title: 'Context before comparison', copy: 'Individual technology profiles gather the useful identity of a tool before asking visitors to choose.' }, { label: 'Compare', value: '03', title: 'Tradeoffs in view', copy: 'Comparison is a core implemented flow, giving a visitor a deliberate way to weigh options.' }, { label: 'Ecosystem', value: '04', title: 'The surrounding system', copy: 'Ecosystem information connects a technology to the larger set of tools around it.' }];
  return <div className="metrics-module"><div className="metrics-tabs" role="tablist" aria-label="Aster surfaces">{data.map((item, index) => <button key={item.label} type="button" role="tab" aria-selected={active === index} className={active === index ? 'is-active' : ''} onClick={() => setActive(index)}><span>{item.value}</span>{item.label}</button>)}</div><div className="metric-detail"><div className="metric-orbit"><span>{data[active].value}</span><i/><i/><i/></div><div><span className="eyebrow">Implemented surface / {data[active].value}</span><h3>{data[active].title}</h3><p>{data[active].copy}</p></div></div></div>;
}

function AsterStudy() {
  const [active, setActive] = useState(0);
  return <main className="aster-study"><section className="study-hero"><div className="study-hero__top"><TransitionLink to="/work" className="eyebrow">← Work index</TransitionLink><span className="eyebrow">Live / evolving</span></div><div className="study-hero__grid"><div><span className="eyebrow">Project study / 01</span><h1 className="study-title" data-reveal>Aster</h1><p className="study-type" data-reveal>Technology intelligence platform</p><p className="study-lede" data-reveal>Make the shifting technology landscape easier to explore, compare, and place in context.</p><div className="study-actions" data-reveal><External href={projects.aster.href}>Open live Aster</External><External href={projects.aster.repo}>Inspect GitHub repository</External></div></div><div className="study-hero__artifact" style={{ viewTransitionName: 'project-aster' }}><ProjectVisual project={projects.aster} large/></div></div></section><section className="study-section study-section--paper"><div className="study-section__intro"><span className="eyebrow">01 / Interface anatomy</span><h2 className="display-title" data-reveal>Four implemented<br/><em>surfaces.</em></h2><p className="section-intro" data-reveal>These are not invented dashboard metrics. They are the product surfaces described by the current build and used to explain its information architecture.</p></div><Metrics active={active} setActive={setActive}/></section><section className="study-section study-section--ink"><div className="study-section__intro"><span className="eyebrow eyebrow--light">02 / System decisions</span><h2 className="display-title display-title--light" data-reveal>Structure before<br/><em>noise.</em></h2><p className="section-intro section-intro--light" data-reveal>Aster is a full-stack system: React, TypeScript, Vite, Express, PostgreSQL, and Supabase. A Supabase Edge Function for current technology updates and further interface optimization remain in progress.</p></div><div className="aster-architecture" data-reveal><div className="architecture-node architecture-node--input">Visitor question<small>intent / curiosity</small></div><div className="architecture-line"/><div className="architecture-node architecture-node--core">Aster surface<small>explore / profile / compare</small></div><div className="architecture-line"/><div className="architecture-node architecture-node--data">Supabase + PostgreSQL<small>structured technology context</small></div></div><div className="study-notes"><article><span>DECISION 01</span><h3>Explore first.</h3><p>The entry point should help someone form a question before forcing a choice.</p></article><article><span>DECISION 02</span><h3>Compare deliberately.</h3><p>Comparison belongs after context, not as a decorative table at the end.</p></article><article><span>STATUS</span><h3>Still evolving.</h3><p>The update function and further interface optimization remain in progress.</p></article></div></section><section className="study-section study-section--paper"><div className="study-section__intro"><span className="eyebrow">03 / Evidence</span><h2 className="display-title" data-reveal>Original artifacts,<br/><em>verified links.</em></h2><p className="section-intro" data-reveal>The preview above is a live surface when embedding is available, with a clear fallback label when it is not. Use the links to inspect the deployed product and repository directly.</p></div><div className="artifact-grid"><div className="artifact-card" data-reveal><span>LIVE SURFACE</span><h3>Inspect the real product.</h3><p>Open Aster in a new tab to see the current deployed interface.</p><External href={projects.aster.href}>Open aster-nine-liard.vercel.app</External></div><div className="artifact-card artifact-card--lilac" data-reveal><span>CODE SURFACE</span><h3>Inspect the real repository.</h3><p>Read the implementation and current project state on GitHub.</p><External href={projects.aster.repo}>Open VeloraTech/Aster</External></div><div className="artifact-card artifact-card--line" data-reveal><span>WHAT IS NEXT</span><h3>Current updater path.</h3><p>The current-technology update function and further interface optimization are still work in progress.</p></div></div></section><section className="next-study"><span className="eyebrow">Next study</span><TransitionLink to="/work/mouaec"><span>MOUAEC</span><ArrowUpRight size={20}/></TransitionLink></section></main>;
}

function Engineering() { return <main className="route-page route-page--paper"><div className="route-heading"><div><Eyebrow>05 / Engineering · The systems room</Eyebrow><h1 className="display-title" data-reveal>Make the<br/><em>invisible legible.</em></h1></div><p className="section-intro" data-reveal>Observability, architecture, debugging, and the small choices that make software easier to trust.</p></div><div className="engineering-grid">{[['AgentTrace', 'See the process, not just the result.', '/work/agenttrace'], ['NativeRelay', 'Normalize the signal.', '/work/nativerelay'], ['Cleaner', 'Protect the source.', '/work/cleaner']].map(([title, copy, to], index) => <TransitionLink to={to} className="engineering-card" key={title} data-reveal><span>0{index + 1} / SYSTEMS</span><h2>{title}</h2><p>{copy}</p><b>Explore <ArrowUpRight size={15}/></b></TransitionLink>)}</div></main>; }
function About() { return <main className="route-page"><div className="route-heading"><div><Eyebrow>06 / About · The short version</Eyebrow><h1 className="display-title" data-reveal>Build close<br/>to the <em>question.</em></h1></div><p className="section-intro" data-reveal>I’m a software developer and Computer Engineering student who enjoys understanding how systems work beneath the surface. I build web applications and developer tools, investigate implementation failures, and experiment with ideas that make software easier to understand and maintain. My approach is practical: build something real, test its assumptions, find what breaks, and improve it through what I learn.</p></div><div className="about-profile" data-reveal><div className="profile-photo-slot">{assetConfig.profilePhoto.available ? <img src={assetConfig.profilePhoto.path} alt="Coach Logic"/> : <><span>PROFILE PHOTO</span><small>Upload your actual photo to<br/><code>public/assets/profile-photo.jpg</code></small></>}</div><div><p className="eyebrow">A practical systems practice</p><p className="profile-note">This frame is intentionally reserved for the supplied portrait. No generated or stock image is used.</p><ResumeAction/><SocialLinks/></div></div><div className="about-rows">{[['2023 — MAY 2026', 'LogicLabs Academy', 'Founded and led a software-learning initiative that served more than 200 students before closing around May 2026.'], ['CONCEPT / UNFINISHED', 'Campus-Link', 'An educational web-app concept coordinated with interns; proposed academic books, lecture and calendar updates, convocation preparation, document organization, and missing-graduation-document detection. It is not presented as a completed product.'], ['JANUARY 2026 — PRESENT', 'Axial Systems', 'Lead Developer on a live landing page built with HTML, CSS, JavaScript, GSAP, and ScrollTrigger. The broader Axial Systems work remains in development.']].map(([meta, title, copy]) => <article data-reveal key={title}><span>{meta}</span><div><h2>{title}</h2><p>{copy}</p></div></article>)}</div></main>; }
function Contact() { return <main className="contact-page"><div><Eyebrow light>07 / Contact · Make the next thing clearer</Eyebrow><h1 className="contact-title" data-reveal>Have a system<br/>worth <em>shaping?</em></h1><p className="contact-lede" data-reveal>I’m interested in thoughtful product work, developer tools, and collaborations where the details do real work.</p></div><div className="contact-grid" data-reveal><div><span>CONNECT</span><SocialLinks/></div><div><span>RESUME</span><p>The final PDF will be available here after upload and deployment verification.</p><ResumeAction/></div><div><span>AXIAL SYSTEMS</span><p>Live landing page; broader work remains in development.</p><External href={projects.axial.href}>Open live website</External><External href={projects.axial.repo}>Open repository</External></div></div></main>; }
function NotFound() { return <main className="route-page"><Eyebrow>404 / Not found</Eyebrow><h1 className="display-title">This path<br/><em>doesn’t hold.</em></h1><Button to="/">Return home</Button></main>; }
function ProductDetail({ project, slug }) { const facts = { mouaec: ['Voting that stays auditable', '30-second count refreshes, approved administrator corrections, allowlisted administrator email, frontend checks, and Supabase RLS.', 'Delivered university exercise'], telica: ['A registration flow with a real handoff', 'A focused cohort application path with Web3Forms email notifications and a live registration surface.', 'Live concept'], agenttrace: ['Observe the agent, not an imagined interior', 'Process observability, concurrent agents, process trees, snapshots, watch modes, supervised runs, and event timelines.', 'Repository direction'], nativerelay: ['Normalize native signals', 'A local-first exploration of normalized process and file observations. Implemented and planned capabilities remain distinct.', 'Repository exploration'], cleaner: ['Protect the original by default', 'A local-first code-cleaning CLI that simplifies cleaning workflows and keeps cleaned output separate from the source.', 'Repository / building'] }[slug] || ['A product surface worth inspecting', project.description, project.status]; return <main className="product-study"><section className="product-study__hero"><div className="study-hero__top"><TransitionLink to="/work" className="eyebrow">← Work index</TransitionLink><span className="eyebrow">{project.status}</span></div><div className="product-study__intro"><div><span className="eyebrow">Project study / {slug}</span><h1 className="study-title">{project.name}</h1><p className="study-type">{project.type}</p><p className="study-lede">{project.description}</p><div className="study-actions"><External href={project.href}>{project.href.includes('github') ? 'Open GitHub repository' : 'Open live product'}</External>{project.repo && <External href={project.repo}>Open GitHub repository</External>}</div></div><ProjectVisual project={project} large/></div></section><section className="product-study__body"><div className="product-statement"><span className="eyebrow">Product language / 01</span><h2>{facts[0]}</h2><p>{facts[1]}</p></div><div className="product-facts"><article><span>STATE</span><b>{facts[2]}</b></article><article><span>STACK</span><Tags items={project.stack}/></article><article><span>READ NEXT</span><p>Open the live surface or repository, then return to the work index for the next product.</p></article></div></section></main>; }
function App() { return <Layout><Routes><Route path="/" element={<Home/>}/><Route path="/work" element={<Work/>}/><Route path="/work/aster" element={<AsterStudy/>}/><Route path="/work/:slug" element={<ProductDetailRoute/>}/><Route path="/engineering" element={<Engineering/>}/><Route path="/about" element={<About/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<NotFound/>}/></Routes></Layout>; }
function ProductDetailRoute() { const { slug } = useParams(); const project = projects[slug]; return project ? <ProductDetail project={project} slug={slug}/> : <NotFound/>; }

createRoot(document.getElementById('root')).render(<BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}><App/></BrowserRouter>);
