import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, MotionConfig, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Menu,
  X,
  Plus,
  Users,
} from "lucide-react";
import {
  content,
  members,
  type TeamMember,
} from "./content";
import { PandaMark } from "./Graphics";
import "./App.css";
import StackSpread from "./components/ui/stack-spread";
import { SpecialText } from "./components/ui/special-text";
import { useCircularGallery } from "./components/ui/use-circular-gallery";
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
        <a href="#top" className="back-top">
          Back to top <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} PandaHat Adversarial</span>
        <nav aria-label="Footer navigation">
          {SECTIONS.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
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
        <h2><SpecialText>{title}</SpecialText></h2>
      </div>
      {children}
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
            <h2 id="description-title"><SpecialText>Understanding machine learning. Empowering students.</SpecialText></h2>
            {content.descriptionParagraphs.map(paragraph => (
              <p className="body-copy" key={paragraph}><SpecialText>{paragraph}</SpecialText></p>
            ))}
          </div>
        </Reveal>
      </section>
      <section id="problem-statement" className="container content-section" aria-labelledby="problem-title">
        <Reveal className="about-grid">
          <p className="eyebrow">02 / PROBLEM STATEMENT</p>
          <div>
            <h2 id="problem-title"><SpecialText>{content.semester.title}</SpecialText></h2>
            {content.semester.problem.map(paragraph => (
              <p className="body-copy" key={paragraph}><SpecialText>{paragraph}</SpecialText></p>
            ))}
            <h3 className="evaluation-title">Performance will be assessed in terms of:</h3>
            <ul className="evaluation-criteria">
              {content.semester.criteria.map(criterion => <li key={criterion}><SpecialText>{criterion}</SpecialText></li>)}
            </ul>
          </div>
        </Reveal>
      </section>
      <section id="objective" className="container content-section" aria-labelledby="objective-title">
        <Reveal>
          <p className="eyebrow">03 / OBJECTIVE</p>
          <h2 id="objective-title"><SpecialText>Compare techniques. Build stronger defenses.</SpecialText></h2>
          <p className="body-copy objective-copy"><SpecialText>{content.semester.objective}</SpecialText></p>
          <p className="body-copy objective-copy"><SpecialText>{content.semester.experience}</SpecialText></p>
        </Reveal>
        <h3 className="research-questions-title">Three main research questions</h3>
        <div className="research-questions">
          {content.semester.questions.map(question => (
            <article className="research-question" key={question.group}>
              <span className="eyebrow">{question.group}</span>
              <h3><SpecialText>{question.title}</SpecialText></h3>
              <p><SpecialText>{question.question}</SpecialText></p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
function ResearchPosters() {
  return (
    <section id="research-posters" className="container content-section" aria-label="Research posters">
      <SectionHeading label="05 / RESEARCH POSTERS" title="Our research, at a glance." />
      <figure className="featured-poster">
        <a href="/images/posters/pandahat-2023.png" target="_blank" rel="noreferrer" aria-label="Open the 2023 PandaHat research poster at full size">
          <img src="/images/posters/pandahat-2023.png" width={1666} height={2500} loading="lazy" alt="2023 PandaHat poster: Recreating Adversarial Attacks in Multimodal Architecture. Sections include introduction, problem and hypothesis, objectives, methodology, results, and timeline." />
        </a>
        <figcaption><span className="eyebrow">PREVIOUS PROJECT / 2023</span><h3>Recreating Adversarial Attacks in Multimodal Architecture</h3><p>Select the poster to view it at full size.</p></figcaption>
      </figure>
    </section>
  );
}
function Supporters() {
  return (
    <>
      <section id="professors" className="container content-section" aria-label="Professors">
        <SectionHeading label="06 / PROFESSORS" title="Guidance behind the research." />
        <p className="section-note"><SpecialText>Meet the professors guiding and supporting our research.</SpecialText></p>
        <div className="professor-grid">
          {[
            { name: "Nayda Santiago", photo: "/images/professors/nayda-santiago.png" },
            { name: "Alcibiades Bustillo", photo: "/images/professors/alcibiades-bustillo.png" },
          ].map(professor => (
            <figure className="professor-card" key={professor.name}>
              <img className="professor-photo professor-portrait" src={professor.photo} alt={professor.name} width={594} height={596} loading="lazy" />
              <figcaption>
                <span className="eyebrow">Professor</span>
                <h3>{professor.name}</h3>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section id="sponsors" className="container content-section" aria-label="Sponsors">
        <SectionHeading label="07 / SPONSORS" title="Supporting the next question." />
        <div className="sponsor-logos">
          <div className="sponsor-logo-card sponsor-academic">
            <img src="/images/sponsors/academic-partners.png" alt="IAP, Universidad de Puerto Rico Recinto Universitario de Mayagüez, and CPS IoT Laboratory" width={1120} height={290} loading="lazy" />
          </div>
          <div className="sponsor-logo-card sponsor-mit">
            <img src="/images/sponsors/mit-lincoln-laboratory-clean.png" alt="MIT Lincoln Laboratory" width={860} height={381} loading="lazy" />
          </div>
        </div>
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
  const [stageOverflow, setStageOverflow] = useState(0);
  const [position, setPosition] = useState(0);
  const pinned = !reduced && travel > 0;
  useCircularGallery(rail, !reduced);
  const drag = useRef<{ x: number; start: number } | null>(null);

  useEffect(() => {
    const element = rail.current;
    const panel = stage.current;
    if (!element || !panel) return;
    const measure = () => {
      setTravel(Math.max(0, element.scrollWidth - element.clientWidth));
      // Taller galleries scroll their heading away before pinning the cards.
      setStageOverflow(Math.max(0, panel.offsetHeight - window.innerHeight));
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
        element.scrollLeft = Math.max(0, Math.min(travel, -section.current.getBoundingClientRect().top - stageOverflow));
      }
      const next = Math.round(element.scrollLeft);
      setPosition(previous => previous === next ? previous : next);
    };
    window.addEventListener("scroll", update, { passive: true });
    element.addEventListener("scroll", update, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", update); element.removeEventListener("scroll", update); };
  }, [pinned, travel, stageOverflow]);

  const move = (direction: number) => {
    const element = rail.current;
    if (!element) return;
    const distance = (element.firstElementChild as HTMLElement)?.offsetWidth + 40;
    const target = Math.max(0, Math.min(travel, element.scrollLeft + direction * distance));
    const behavior = reduced ? "instant" : "smooth";
    if (pinned && section.current) {
      window.scrollTo({ top: window.scrollY + section.current.getBoundingClientRect().top + stageOverflow + target, behavior });
    } else element.scrollTo({ left: target, behavior });
  };

  return (
    <section ref={section} id="members" className={`members-section${pinned ? " is-pinned" : ""}`} aria-label="Members"
      style={pinned ? { height: `calc(100vh + ${stageOverflow + travel}px)` } : undefined}>
      <div ref={stage} className="members-stage container" style={pinned ? { top: -stageOverflow } : undefined}>
        <SectionHeading label="04 / MEMBERS" title={content.team.title} />
        <p className="team-note"><SpecialText>{content.team.note}</SpecialText></p>
        <div className="rail-toolbar">
          <span className="mono">{pinned ? "SCROLL DOWN TO MEET THE TEAM →" : "SCROLL TO EXPLORE →"}</span>
          <div className="rail-controls">
            <button aria-label="Previous member profiles" disabled={position <= 2} onClick={() => move(-1)}><ArrowLeft size={18} /></button>
            <button aria-label="Next member profiles" disabled={position >= travel - 2} onClick={() => move(1)}><ArrowRight size={18} /></button>
          </div>
        </div>
        <div ref={rail} className="horizontal-rail members-track circular-members" role="region" aria-label="Member profiles" tabIndex={0}
          onPointerDown={event => {
            if (event.button !== 0) return;
            drag.current = { x: event.clientX, start: event.currentTarget.scrollLeft };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={event => {
            if (!drag.current || !rail.current) return;
            const left = Math.max(0, Math.min(travel, drag.current.start + drag.current.x - event.clientX));
            if (pinned && section.current) window.scrollTo({ top: window.scrollY + section.current.getBoundingClientRect().top + stageOverflow + left, behavior: "instant" });
            else rail.current.scrollLeft = left;
          }}
          onPointerUp={() => { drag.current = null; }}
          onPointerCancel={() => { drag.current = null; }}
          onLostPointerCapture={() => { drag.current = null; }}
          onKeyDown={event => {
            if (event.target === event.currentTarget && ["ArrowLeft", "ArrowRight"].includes(event.key)) {
              event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1);
            }
          }}>
          {members.map((member, index) => <TeamProfile key={member.name} member={member} index={index} />)}
        </div>
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
    const aliases: Record<string, string> = { "#team": "#members", "#research": "#research-posters", "#topic-01": "#research-posters", "#topic-02": "#research-posters", "#topic-03": "#research-posters" };
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
        <div className="container team-group-section">
          <figure className="team-group-card">
            <div className="team-group-photo" role="img" aria-label="Placeholder for the PandaHat team group photo">
              <Users size={72} strokeWidth={1} aria-hidden="true" />
              <span className="mono">GROUP PHOTO COMING SOON</span>
            </div>
            <figcaption>
              <div><span className="eyebrow">THE PEOPLE BEHIND PANDAHAT</span><h2><SpecialText>One team. Shared curiosity.</SpecialText></h2></div>
            </figcaption>
          </figure>
        </div>
        <ResearchPosters />
        <Supporters />
      </main>
      <Footer />
    </MotionConfig>
  );
}
