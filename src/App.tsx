import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, MotionConfig, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Menu,
  X,
  Plus,
} from "lucide-react";
import {
  content,
  topics,
  members,
  type TeamMember,
} from "./content";
import { PandaMark, TopicGraphic } from "./Graphics";
import "./App.css";
import StackSpread from "./components/ui/stack-spread";
const SECTIONS = [
  ["#description", "Description"],
  ["#problem-statement", "Problem statement"],
  ["#objective", "Objective"],
  ["#members", "Members"],
  ["#research-posters", "Research posters"],
  ["#professors", "Professors"],
  ["#sponsors", "Sponsors"],
];
function Brand() {
  return (
    <a className="brand" href="#top" aria-label="PandaHat Adversarial home">
      <PandaMark />
      <span>
        {content.brand}
        <small>{content.subbrand}</small>
      </span>
    </a>
  );
}
function Header() {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  return (
    <header className="header">
      <div className="container header-inner">
        <Brand />
        <button
          ref={button}
          className="menu-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-controls="main-navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="main-navigation"
          aria-label="Main navigation"
          className={open ? "navigation is-open" : "navigation"}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              button.current?.focus();
            }
          }}
        >
          {SECTIONS.map(([path, name]) => (
            <a
              key={path}
              href={path}
              onClick={() => setOpen(false)}
            >
              {name}
            </a>
          ))}
        </nav>
        <span className="header-note">
          <i /> INQUIRY IN PROGRESS
        </span>
      </div>
    </header>
  );
}
function Footer() {
  return (
    <footer className="container footer">
      <div className="footer-top">
        <Brand />
        <p>{content.footer.tagline}</p>
        <a href="#top" className="back-top">
          Back to top <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} PandaHat Adversarial</span>
        <nav aria-label="Footer navigation">
          {SECTIONS.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <span>{content.footer.note}</span>
      </div>
    </footer>
  );
}
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}
function SectionHeading({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{label}</p>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
function Notice() {
  return (
    <div className="placeholder-notice">
      <span className="tiny-dot" />
      <p>{content.notice}</p>
      <span className="mono">ITERATION 01</span>
    </div>
  );
}
function Home() {
  return (
    <>
      <StackSpread />
      <Header />
      <section id="description" className="container content-section" aria-labelledby="description-title">
        <Reveal className="about-grid">
          <p className="eyebrow">01 / DESCRIPTION</p>
          <div>
            <h2 id="description-title">Exploring trust in synthetic media.</h2>
            <p className="body-copy">{content.home.about}</p>
            <p className="body-copy">{content.research.about}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#research-posters">Explore the research <ArrowUpRight size={18} /></a>
              <a className="text-link" href="#members">Meet the members <ArrowRight size={17} /></a>
            </div>
          </div>
        </Reveal>
      </section>
      <section id="problem-statement" className="container content-section" aria-labelledby="problem-title">
        <Reveal className="about-grid">
          <p className="eyebrow">02 / PROBLEM STATEMENT</p>
          <div>
            <h2 id="problem-title">{content.home.aboutTitle}</h2>
            <p className="body-copy">AI-generated images make it harder to determine where media comes from and whether it has been altered. Watermarks and detection methods can provide evidence, but that evidence may change when an image is edited, compressed, or deliberately manipulated.</p>
            <p className="body-copy">Our central question is how to evaluate these signals under realistic transformations and communicate their limitations clearly.</p>
          </div>
        </Reveal>
      </section>
      <section id="objective" className="container content-section" aria-labelledby="objective-title">
        <Reveal>
          <p className="eyebrow">03 / OBJECTIVE</p>
          <h2 id="objective-title">Understand the signals. Test their limits.</h2>
          <p className="body-copy objective-copy">Explore the robustness of digital watermarking and deepfake analysis through reproducible experiments, documenting when these approaches succeed, when they fail, and what their results can tell us about media authenticity.</p>
        </Reveal>
        <div className="method-grid">
          {content.research.steps.map((step, index) => (
            <Reveal key={step.title}>
              <span className="method-number mono">0{index + 1}<ArrowRight size={18} /></span>
              <h3>{step.title}</h3><p>{step.description}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
function HorizontalRail({ children, label, className }: {
  children: ReactNode; label: string; className: string;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [edges, setEdges] = useState({ start: true, end: false });
  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const update = () => setEdges({
      start: element.scrollLeft <= 2,
      end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 2,
    });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    update();
    return () => { observer.disconnect(); element.removeEventListener("scroll", update); };
  }, []);
  const move = (direction: number) => {
    const element = rail.current;
    if (!element) return;
    const card = element.firstElementChild as HTMLElement | null;
    element.scrollBy({ left: direction * ((card?.offsetWidth ?? element.clientWidth) + 24), behavior: reduced ? "instant" : "smooth" });
  };
  return (
    <div className={className}>
      <div className="rail-toolbar">
        <span className="mono">SCROLL TO EXPLORE →</span>
        <div className="rail-controls">
          <button aria-label={`Previous ${label.toLowerCase()}`} disabled={edges.start} onClick={() => move(-1)}><ArrowLeft size={18} /></button>
          <button aria-label={`Next ${label.toLowerCase()}`} disabled={edges.end} onClick={() => move(1)}><ArrowRight size={18} /></button>
        </div>
      </div>
      <div ref={rail} className="horizontal-rail" role="region" aria-label={label} tabIndex={0}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1);
          }
        }}>
        {children}
      </div>
    </div>
  );
}
function ResearchPosters() {
  return (
    <section id="research-posters" className="container content-section" aria-label="Research posters">
      <SectionHeading label="05 / RESEARCH POSTERS" title="Our research, at a glance." />
      <p className="section-note">Poster previews will appear here when available. These cards are placeholders for future research posters.</p>
      <HorizontalRail label="Research posters" className="poster-rail">
        {topics.map((topic, index) => (
          <article className="poster-card" key={topic.id} id={`topic-${topic.id}`}>
            <div className="poster-preview" aria-label={`Placeholder for ${topic.title} poster`}>
              <span className="mono">PANDAHAT / RESEARCH {topic.id}</span>
              <h3>{topic.title}</h3>
              <TopicGraphic variant={index % 2} />
              <span className="poster-status">POSTER COMING SOON</span>
            </div>
            <p>{topic.description}</p>
          </article>
        ))}
      </HorizontalRail>
    </section>
  );
}
function Supporters() {
  return (
    <>
      <section id="professors" className="container content-section" aria-label="Professors">
        <SectionHeading label="06 / PROFESSORS" title="Guidance behind the research." />
        <p className="section-note">Faculty mentors and research advisors will be introduced here.</p>
        <div className="support-placeholder"><span className="mono">FACULTY PROFILES</span><h3>Professors to be announced</h3><p>Names, affiliations, and areas of expertise will be added when confirmed.</p></div>
      </section>
      <section id="sponsors" className="container content-section" aria-label="Sponsors">
        <SectionHeading label="07 / SPONSORS" title="Supporting the next question." />
        <p className="section-note">A space to recognize the organizations supporting PandaHat’s research.</p>
        <div className="support-placeholder"><span className="mono">PARTNERS & SUPPORTERS</span><h3>Sponsors to be announced</h3><p>Confirmed sponsor names and logos will appear here.</p></div>
        <Notice />
      </section>
    </>
  );
}
function TeamProfile({ member, index }: { member: TeamMember; index: number }) {
  return (
    <Reveal>
      <article className="team-profile">
        <div
          className={`avatar avatar-${index % 4}`}
          role="img"
          aria-label={`Abstract placeholder avatar for ${member.name}`}
        >
          <div className="avatar-grid" />
          <span className="avatar-shape" />
          <span className="avatar-index mono">MEMBER / {String(index + 1).padStart(2, "0")}</span>
          <span className="avatar-initials">{member.initials}</span>
          <Plus className="avatar-plus" size={18} />
        </div>
        <p className="profile-role mono">{member.role}</p>
        <h3>{member.name}</h3>
        <p className="profile-bio">{member.bio}</p>
        <p className="profile-interests">{member.interests}</p>
      </article>
    </Reveal>
  );
}
function Team() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [travel, setTravel] = useState(0);
  const [fits, setFits] = useState(false);
  const [position, setPosition] = useState(0);
  const pinned = !reduced && fits && travel > 0;

  useEffect(() => {
    const element = rail.current;
    const panel = stage.current;
    if (!element || !panel) return;
    const measure = () => {
      setTravel(Math.max(0, element.scrollWidth - element.clientWidth));
      setFits(panel.scrollHeight <= window.innerHeight);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    observer.observe(panel);
    window.addEventListener("resize", measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const update = () => {
      if (pinned && section.current) {
        element.scrollLeft = Math.max(0, Math.min(travel, -section.current.getBoundingClientRect().top));
      }
      const next = Math.round(element.scrollLeft);
      setPosition(previous => previous === next ? previous : next);
    };
    window.addEventListener("scroll", update, { passive: true });
    element.addEventListener("scroll", update, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", update); element.removeEventListener("scroll", update); };
  }, [pinned, travel]);

  const move = (direction: number) => {
    const element = rail.current;
    if (!element) return;
    const distance = (element.firstElementChild as HTMLElement)?.offsetWidth + 24;
    const target = Math.max(0, Math.min(travel, element.scrollLeft + direction * distance));
    const behavior = reduced ? "instant" : "smooth";
    if (pinned && section.current) {
      window.scrollTo({ top: window.scrollY + section.current.getBoundingClientRect().top + target, behavior });
    } else element.scrollTo({ left: target, behavior });
  };

  return (
    <section ref={section} id="members" className={`members-section${pinned ? " is-pinned" : ""}`} aria-label="Members"
      style={pinned ? { height: `calc(100svh + ${travel}px)` } : undefined}>
      <div ref={stage} className="members-stage container">
        <SectionHeading label="04 / MEMBERS" title={content.team.title} />
        <p className="team-note">{content.team.note}</p>
        <div className="rail-toolbar">
          <span className="mono">{pinned ? "SCROLL DOWN TO MEET THE TEAM →" : "SCROLL TO EXPLORE →"}</span>
          <div className="rail-controls">
            <button aria-label="Previous member profiles" disabled={position <= 2} onClick={() => move(-1)}><ArrowLeft size={18} /></button>
            <button aria-label="Next member profiles" disabled={position >= travel - 2} onClick={() => move(1)}><ArrowRight size={18} /></button>
          </div>
        </div>
        <div ref={rail} className="horizontal-rail members-track" role="region" aria-label="Member profiles" tabIndex={0}
          onKeyDown={event => {
            if (event.target === event.currentTarget && ["ArrowLeft", "ArrowRight"].includes(event.key)) {
              event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1);
            }
          }}>
          {members.map((member, index) => <TeamProfile key={member.name} member={member} index={index} />)}
        </div>
        <div className="members-progress" aria-hidden="true"><span style={{ width: `${travel ? position / travel * 100 : 100}%` }} /></div>
      </div>
    </section>
  );
}
export default function App() {
  useEffect(() => {
    // Existing bookmarks still lead to their section of the single page.
    const legacy = window.location.pathname;
    if (legacy === "/research" || legacy === "/team") {
      const hash = window.location.hash || (legacy === "/team" ? "#members" : "#research-posters");
      history.replaceState(null, "", `/${hash}`);
    }
    const aliases: Record<string, string> = { "#team": "#members", "#research": "#research-posters" };
    if (aliases[window.location.hash]) history.replaceState(null, "", `/${aliases[window.location.hash]}`);
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">Skip to content</a>
      <div id="top" />
      <main id="main" tabIndex={-1}>
        <Home />
        <Team />
        <ResearchPosters />
        <Supporters />
      </main>
      <Footer />
    </MotionConfig>
  );
}
