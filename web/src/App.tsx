import * as m from "motion/react-m";
import { ResponsiveImage } from "./ResponsiveImage";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
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
  members,
  topics,
  advisors,
  conferencePhotos,
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
  ["#research-endpoints", "Research"],
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
        <SpecialText hoverOnly>{content.brand}</SpecialText>
        <small><SpecialText hoverOnly>{content.subbrand}</SpecialText></small>
      </span>
    </a>
  );
}
function Header() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = SECTIONS.map(([path]) => ({ path, element: document.querySelector(path) }));
    let frame = 0;
    const update = () => {
      frame = 0;
      // Read below the sticky header, including throughout the pinned member gallery.
      const threshold = (header.current?.getBoundingClientRect().bottom ?? 90) + 24;
      const scrollPadding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      let active = "";
      for (const { path, element } of sections) {
        if (!element) continue;
        // Anchor scrolling stops at scroll-padding + scroll-margin, which can
        // be below the header. Include that landing position and pixel rounding.
        const scrollMargin = parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
        if (element.getBoundingClientRect().top <= Math.max(threshold, scrollPadding + scrollMargin) + 1) active = path;
      }
      setActiveSection(active);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  const button = useRef<HTMLButtonElement>(null);
  return (
    <header ref={header} className="header">
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
              className={activeSection === path ? "active" : undefined}
              aria-current={activeSection === path ? "location" : undefined}
              onClick={() => setOpen(false)}
            >
              <SpecialText hoverOnly>{name}</SpecialText>
            </a>
          ))}
        </nav>
        <span className="header-note">
          <i /><SpecialText hoverOnly>INQUIRY IN PROGRESS</SpecialText>
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
        <a href="#top" className="back-top"><SpecialText hoverOnly>Back to top</SpecialText> <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="footer-bottom">
        <span><SpecialText hoverOnly>{`© ${new Date().getFullYear()} PandaHat Adversarial`}</SpecialText></span>
        <nav aria-label="Footer navigation">
          {SECTIONS.map(([href, label]) => <a key={href} href={href}><SpecialText hoverOnly>{label}</SpecialText></a>)}
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
    <m.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : delay }}
    >
      {children}
    </m.div>
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
        <p className="eyebrow"><SpecialText hoverOnly>{label}</SpecialText></p>
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
          <p className="eyebrow"><SpecialText hoverOnly>01 / DESCRIPTION</SpecialText></p>
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
          <p className="eyebrow"><SpecialText hoverOnly>02 / PROBLEM STATEMENT</SpecialText></p>
          <div>
            <h2 id="problem-title"><SpecialText>{content.semester.title}</SpecialText></h2>
            {content.semester.problem.map(paragraph => (
              <p className="body-copy" key={paragraph}><SpecialText>{paragraph}</SpecialText></p>
            ))}
            <h3 className="evaluation-title"><SpecialText hoverOnly>Performance will be assessed in terms of:</SpecialText></h3>
            <ul className="evaluation-criteria">
              {content.semester.criteria.map(criterion => <li key={criterion}><SpecialText>{criterion}</SpecialText></li>)}
            </ul>
          </div>
        </Reveal>
      </section>
      <section id="objective" className="container content-section" aria-labelledby="objective-title">
        <Reveal>
          <p className="eyebrow"><SpecialText hoverOnly>03 / OBJECTIVE</SpecialText></p>
          <h2 id="objective-title"><SpecialText>Compare techniques. Build stronger defenses.</SpecialText></h2>
          <p className="body-copy objective-copy"><SpecialText>{content.semester.objective}</SpecialText></p>
          <p className="body-copy objective-copy"><SpecialText>{content.semester.experience}</SpecialText></p>
        </Reveal>
        <h3 className="research-questions-title"><SpecialText hoverOnly>Three main research questions</SpecialText></h3>
        <div className="research-questions">
          {content.semester.questions.map(question => (
            <article className="research-question" key={question.group}>
              <span className="eyebrow"><SpecialText hoverOnly>{question.group}</SpecialText></span>
              <h3><SpecialText>{question.title}</SpecialText></h3>
              <p><SpecialText>{question.question}</SpecialText></p>
            </article>
          ))}
        </div>
      </section>
      <ResearchEndpoints />
    </>
  );
}
function ResearchEndpoints() {
  return (
    <section id="research-endpoints" className="container content-section endpoint-section" aria-labelledby="endpoints-title">
      <SectionHeading label="04 / RESEARCH" title="Follow a question to its evidence." />
      <p className="section-note" id="endpoints-title"><SpecialText>Each endpoint keeps the question, methods, evidence, and next direction together.</SpecialText></p>
      <div className="endpoint-grid">
        {topics.map(topic => (
          <div className="endpoint-card" id={`research-topic-${topic.slug}`} key={topic.id}>
            <span className="endpoint-number mono"><SpecialText hoverOnly>{topic.id}</SpecialText></span>
            <span className="eyebrow"><SpecialText hoverOnly>{topic.tags.join(" · ")}</SpecialText></span>
            <h3><SpecialText>{topic.title}</SpecialText></h3>
            <p><SpecialText>{topic.question}</SpecialText></p>
          </div>
        ))}
      </div>
      <div className="endpoint-details">
        {topics.map(topic => (
          <article className="endpoint-detail" key={topic.slug} aria-labelledby={`${topic.slug}-title`}>
            <div><p className="eyebrow"><SpecialText hoverOnly>{`ENDPOINT / ${topic.slug}`}</SpecialText></p><h3 id={`${topic.slug}-title`}><SpecialText>{topic.subtitle}</SpecialText></h3><p className="body-copy"><SpecialText>{topic.description}</SpecialText></p></div>
            <div><p className="mono endpoint-label"><SpecialText hoverOnly>METHODS</SpecialText></p><ul>{topic.methods.map(method => <li key={method}><SpecialText>{method}</SpecialText></li>)}</ul><p className="mono endpoint-label"><SpecialText hoverOnly>EVIDENCE TRAIL</SpecialText></p><p className="body-copy"><SpecialText>{topic.evidence}</SpecialText></p></div>
          </article>
        ))}
      </div>
    </section>
  );
}
function ResearchPosters() {
  return (
    <section id="research-posters" className="container content-section" aria-label="Research posters">
      <SectionHeading label="05 / RESEARCH POSTERS" title="Our research, at a glance." />
      <figure className="featured-poster">
        <a href="/images/posters/pandahat-fall-2026.webp" target="_blank" rel="noreferrer" aria-label="Open the Fall 2026 PandaHat research poster at full size">
          <ResponsiveImage sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 912px) calc(100vw - 112px), 800px" src="/images/posters/pandahat-fall-2026-preview.webp" width={2400} height={3600} loading="lazy" alt="Fall 2026 PandaHat poster: Digital Watermarking for Deepfake Detection, Authentication, and Localization. Research on watermark robustness, face-swap resilience, and manipulation localization." />
        </a>
        <figcaption><span className="eyebrow"><SpecialText hoverOnly>CURRENT RESEARCH / FALL 2026</SpecialText></span><h3><SpecialText hoverOnly>Digital Watermarking for Deepfake Detection, Authentication, and Localization</SpecialText></h3><p><SpecialText hoverOnly>Select the poster to view it at full size, or</SpecialText> <a href="/images/posters/pandahat-fall-2026.pdf" target="_blank" rel="noreferrer"><SpecialText hoverOnly>open the original PDF</SpecialText></a><SpecialText hoverOnly>.</SpecialText></p></figcaption>
      </figure>
      <details className="poster-archive">
        <summary><SpecialText hoverOnly>Poster archive</SpecialText> <span className="mono"><SpecialText hoverOnly>2023</SpecialText></span></summary>
        <figure className="archived-poster">
          <a href="/images/posters/pandahat-2023.webp" target="_blank" rel="noreferrer" aria-label="Open the 2023 PandaHat research poster at full size">
            <ResponsiveImage sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 912px) calc(100vw - 112px), 800px" src="/images/posters/pandahat-2023-preview.webp" width={1666} height={2500} loading="lazy" alt="2023 PandaHat poster: Recreating Adversarial Attacks in Multimodal Architecture. Sections include introduction, problem and hypothesis, objectives, methodology, results, and timeline." />
          </a>
          <figcaption><span className="eyebrow"><SpecialText hoverOnly>ARCHIVE / 2023</SpecialText></span><h3><SpecialText hoverOnly>Recreating Adversarial Attacks in Multimodal Architecture</SpecialText></h3><p><SpecialText hoverOnly>Select the poster to view it at full size.</SpecialText></p></figcaption>
        </figure>
      </details>
    </section>
  );
}
function Supporters() {
  return (
    <section id="sponsors" className="container content-section" aria-label="Sponsors">
        <SectionHeading label="07 / SPONSORS" title="Supporting the next question." />
        <div className="sponsor-logos">
          <div className="sponsor-logo-card sponsor-academic">
            <img src="/images/sponsors/iap-transparent.webp" alt="IAP" width={1774} height={887} loading="lazy" decoding="async" />
            <img src="/images/sponsors/uprm-transparent.webp" alt="Universidad de Puerto Rico Recinto Universitario de Mayagüez" width={1254} height={1254} loading="lazy" decoding="async" />
            <img src="/images/sponsors/cps-iot-transparent.webp" alt="CPS IoT Laboratory" width={1173} height={1341} loading="lazy" decoding="async" />
          </div>
          <div className="sponsor-logo-card sponsor-mit">
            <img src="/images/sponsors/mit-lincoln-transparent.webp" alt="MIT Lincoln Laboratory" width={1942} height={809} loading="lazy" decoding="async" />
          </div>
        </div>
    </section>
  );
}
function TeamProfile({ member, index }: { member: TeamMember; index: number }) {
  return (
    <Reveal>
      <article
        className="team-profile profile-card-link"
      >
        <a className="profile-hit-area" href={`#member/${member.slug}`} aria-label={`Open profile for ${member.name}`} onPointerDown={event => event.stopPropagation()} onClick={event => event.stopPropagation()} />
        <div
          className={`avatar avatar-${index % 4}`}
          role="img"
          aria-label={member.photo ? `Portrait of ${member.name}` : `Abstract placeholder avatar for ${member.name}`}
        >
          {member.photo ? <ResponsiveImage sizes="(max-width: 767px) 280px, 360px" className="member-photo" src={member.photo} alt="" loading="lazy" /> : <>
          <div className="avatar-grid" />
          <span className="avatar-shape" />
          <span className="avatar-index mono"><SpecialText hoverOnly>{`MEMBER / ${String(index + 1).padStart(2, "0")}`}</SpecialText></span>
          <span className="avatar-initials"><SpecialText hoverOnly>{member.initials}</SpecialText></span>
          <Plus className="avatar-plus" size={18} />
          </>}
        </div>
        <p className="profile-role mono"><SpecialText hoverOnly>{member.role}</SpecialText></p>
        <h3><a href={`#member/${member.slug}`}><SpecialText hoverOnly>{member.name}</SpecialText></a></h3>
        <p className="profile-bio"><SpecialText hoverOnly>{member.bio}</SpecialText></p>
        <p className="profile-interests"><SpecialText hoverOnly>{member.interests}</SpecialText></p>
      </article>
    </Reveal>
  );
}
function MemberEndpoint({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeButton.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    addEventListener("keydown", handleKeyDown);
    return () => removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
  return <div className="member-endpoint-backdrop" role="presentation">
    <article className="member-endpoint" role="dialog" aria-modal="true" aria-labelledby="member-endpoint-title">
      <button ref={closeButton} className="member-endpoint-close" type="button" onClick={onClose} aria-label="Close member profile"><X size={20} /></button>
      <div className="member-endpoint-top"><span className="eyebrow"><SpecialText hoverOnly>{`MEMBER ENDPOINT / ${member.role}`}</SpecialText></span><span className="mono"><SpecialText hoverOnly>{`PROFILE / ${member.initials}`}</SpecialText></span></div>
      <div className="member-endpoint-heading"><div className="member-endpoint-avatar">{member.photo ? <ResponsiveImage sizes="(max-width: 767px) 76px, 104px" className="member-photo" src={member.photo} alt={`Portrait of ${member.name}`} /> : member.initials}</div><div><h2 id="member-endpoint-title"><SpecialText hoverOnly>{member.name}</SpecialText></h2><p><SpecialText hoverOnly>{member.role}</SpecialText></p></div></div>
      <div className="member-endpoint-grid">
        <section><p className="eyebrow"><SpecialText hoverOnly>BIO</SpecialText></p><p><SpecialText hoverOnly>{member.bio}</SpecialText></p><p className="eyebrow"><SpecialText hoverOnly>EDUCATION</SpecialText></p><p><SpecialText hoverOnly>{member.education ?? "Education details to be added."}</SpecialText></p><p className="eyebrow"><SpecialText hoverOnly>RESEARCH INTERESTS</SpecialText></p><p><SpecialText hoverOnly>{member.interests}</SpecialText></p></section>
        <section><p className="eyebrow"><SpecialText hoverOnly>SKILLS & TOOLS</SpecialText></p><ul>{member.skills.map(skill => <li key={skill}><SpecialText hoverOnly>{skill}</SpecialText></li>)}</ul><p className="eyebrow"><SpecialText hoverOnly>PROJECTS</SpecialText></p><ul>{member.projects.map(project => <li key={project}><SpecialText hoverOnly>{project}</SpecialText></li>)}</ul>{member.experience?.length ? <><p className="eyebrow"><SpecialText hoverOnly>EXPERIENCE</SpecialText></p><ul>{member.experience.map(item => <li key={item}><SpecialText hoverOnly>{item}</SpecialText></li>)}</ul></> : null}</section>
      </div>
      <div className="member-endpoint-actions">{member.resume ? <a className="button button-primary" href={member.resume} target="_blank" rel="noreferrer"><SpecialText hoverOnly>Download resume</SpecialText> <ArrowUpRight size={16} /></a> : <span className="resume-pending mono"><SpecialText hoverOnly>RESUME / PENDING APPROVAL</SpecialText></span>}{member.contact ? <a className="text-link" href={`mailto:${member.contact}`}><SpecialText hoverOnly>Contact member</SpecialText> <ArrowUpRight size={15} /></a> : null}{member.links?.map(link => <a className="text-link" href={link.startsWith("http") ? link : `https://${link}`} target="_blank" rel="noreferrer" key={link}><SpecialText hoverOnly>{link}</SpecialText> <ArrowUpRight size={15} /></a>)}<a className="text-link" href="mailto:pandahat@uprm.edu"><SpecialText hoverOnly>Request profile update</SpecialText> <ArrowUpRight size={15} /></a></div>
    </article>
  </div>;
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

  const move = (direction: number, skip = false) => {
    const element = rail.current;
    if (!element) return;
    const distance = (element.firstElementChild as HTMLElement)?.offsetWidth + 40;
    const target = skip ? (direction < 0 ? 0 : travel) : Math.max(0, Math.min(travel, element.scrollLeft + direction * distance));
    const behavior = reduced ? "instant" : "smooth";
    if (pinned && section.current) {
      window.scrollTo({ top: window.scrollY + section.current.getBoundingClientRect().top + stageOverflow + target, behavior });
    } else element.scrollTo({ left: target, behavior });
  };

  return (
    <>
    <section ref={section} id="members" className={`members-section${pinned ? " is-pinned" : ""}`} aria-label="Members"
      style={pinned ? { height: `calc(100vh + ${stageOverflow + travel}px)` } : undefined}>
      <div ref={stage} className="members-stage container" style={pinned ? { top: -stageOverflow } : undefined}>
        <SectionHeading label="04 / MEMBERS" title={content.team.title} />
        <p className="team-note"><SpecialText>{content.team.note}</SpecialText></p>
        <div className="rail-toolbar">
          <span className="mono"><SpecialText hoverOnly>{pinned ? "SCROLL DOWN TO MEET THE TEAM →" : "SCROLL TO EXPLORE →"}</SpecialText></span>
          <div className="rail-controls">
            <button aria-label="Skip to first member" disabled={position <= 2} onClick={() => move(-1, true)}><ArrowLeft size={18} /></button>
            <button aria-label="Skip to last member" disabled={position >= travel - 2} onClick={() => move(1, true)}><ArrowRight size={18} /></button>
          </div>
        </div>
        <div ref={rail} className="horizontal-rail members-track circular-members" role="region" aria-label="Member profiles" tabIndex={0}
          onPointerDown={event => {
            if ((event.target as Element).closest(".special-text")) return;
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
    </>
  );
}
function CohortAndOnboarding() {
  return <>
    <div className="container cohort-summary">
      <div className="cohort-heading"><p className="eyebrow"><SpecialText hoverOnly>{content.team.fullTimeLabel}</SpecialText></p><p className="team-note"><SpecialText hoverOnly>Seven full-time researchers anchor the active questions, mentoring, and project continuity.</SpecialText></p></div>
      <div className="cohort-heading"><p className="eyebrow"><SpecialText hoverOnly>{content.team.onboardingLabel}</SpecialText></p><p className="team-note"><SpecialText hoverOnly>Fifteen new members move through a shared learning path from orientation to independent contribution.</SpecialText></p></div>
    </div>
    <div className="container onboarding-section" id="onboarding">
      <div className="onboarding-heading"><p className="eyebrow"><SpecialText hoverOnly>LEARNING PATH / ONBOARDING</SpecialText></p><h2><SpecialText>Start curious. Leave capable.</SpecialText></h2></div>
      <div className="onboarding-grid">{content.team.onboarding.map(step => <article key={step.step}><span className="mono"><SpecialText hoverOnly>{step.step}</SpecialText></span><h3><SpecialText hoverOnly>{step.title}</SpecialText></h3><p><SpecialText hoverOnly>{step.description}</SpecialText></p></article>)}</div>
    </div>
  </>;
}
function Advisors() {
  return <section id="professors" className="container content-section advisors-section" aria-label="Research advisors"><SectionHeading label="06 / ADVISORS" title="Guidance behind the questions." /><p className="section-note"><SpecialText>Meet Dr. Nayda Santiago and Dr. Alcibiades Bustillo, the advisors guiding the research group.</SpecialText></p><div className="advisor-grid">{advisors.map(advisor => <article className="advisor-card" key={advisor.name}><ResponsiveImage sizes="(max-width: 767px) 90px, 150px" src={advisor.photo} alt={advisor.name} width={594} height={596} loading="lazy" /><div><p className="eyebrow"><SpecialText hoverOnly>{advisor.role}</SpecialText></p><h3><SpecialText hoverOnly>{advisor.name}</SpecialText></h3><p><SpecialText hoverOnly>{advisor.focus}</SpecialText></p></div></article>)}</div></section>;
}
export default function App() {
  const [profileSlug, setProfileSlug] = useState(() => window.location.hash.startsWith("#member/") ? window.location.hash.slice(8) : "");
  const memberReturnScrollY = useRef(0);
  const activeMember = members.find(member => member.slug === profileSlug);
  const closeMemberEndpoint = () => {
    history.replaceState(null, "", "#members");
    setProfileSlug("");
    const returnScrollY = memberReturnScrollY.current;
    requestAnimationFrame(() => window.scrollTo({ top: returnScrollY, behavior: "instant" }));
  };
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
    const updateProfile = () => {
      const isMemberEndpoint = window.location.hash.startsWith("#member/");
      if (isMemberEndpoint) memberReturnScrollY.current = window.scrollY;
      setProfileSlug(isMemberEndpoint ? window.location.hash.slice(8) : "");
    };
    addEventListener("hashchange", updateProfile);
    if (!hash) return () => removeEventListener("hashchange", updateProfile);
    const frame = requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "instant" });
    });
    return () => { cancelAnimationFrame(frame); removeEventListener("hashchange", updateProfile); };
  }, []);
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main"><SpecialText hoverOnly>Skip to content</SpecialText></a>
      <div id="top" />
      <main id="main" tabIndex={-1}>
        <Home />
        <Team />
        <div className="container team-group-section">
          <figure className="team-group-card">
            <ResponsiveImage sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1352px) calc(100vw - 112px), 1240px" className="team-group-image" src={conferencePhotos[2].src} width={1600} height={1200} loading="lazy" decoding="async" alt={conferencePhotos[2].alt} />
            <figcaption>
              <div><span className="eyebrow"><SpecialText hoverOnly>THE PEOPLE BEHIND PANDAHAT</SpecialText></span><h2><SpecialText>One team. Shared curiosity.</SpecialText></h2><p><SpecialText hoverOnly>Spring IAP · May 2026 · Mayagüez</SpecialText></p></div>
            </figcaption>
          </figure>
          <section className="conference-gallery" aria-labelledby="conference-title">
            <div className="conference-heading"><span className="eyebrow"><SpecialText hoverOnly>FROM THE CONFERENCE</SpecialText></span><h2 id="conference-title"><SpecialText hoverOnly>Spring IAP 2026</SpecialText></h2><p><SpecialText hoverOnly>May 2026 · Mayagüez</SpecialText></p></div>
            <div className="conference-grid">{conferencePhotos.map((photo, index) => <a key={photo.src} href={photo.src} target="_blank" rel="noreferrer" aria-label={`Open conference photo ${index + 1}: ${photo.alt}`}><ResponsiveImage sizes="(max-width: 767px) calc((100vw - 50px) / 2), (max-width: 1352px) calc((100vw - 144px) / 3), 403px" src={photo.thumbnail} alt={photo.alt} loading="lazy" decoding="async" width={640} height={480} /></a>)}</div>
          </section>
        </div>
        <CohortAndOnboarding />
        <ResearchPosters />
        <Advisors />
        <Supporters />
      </main>
      <Footer />
      {activeMember && <MemberEndpoint member={activeMember} onClose={closeMemberEndpoint} />}
    </MotionConfig>
  );
}
