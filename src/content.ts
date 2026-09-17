export type ResearchTopic = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
};
export type TeamMember = {
  name: string;
  role: string;
  interests: string;
  bio: string;
  initials: string;
};
export const content = {
  brand: "PandaHat",
  subbrand: "ADVERSARIAL",
  notice:
    "An early look at our lab. Research descriptions and team profiles are illustrative placeholders.",
  home: {
    eyebrow: "AT THE INTERSECTION OF AI & TRUST",
    heading: ["Seeing isn’t", "believing.", "Not anymore."],
    description:
      "Exploring trust in synthetic media. We study the signals that distinguish what’s real, what’s generated, and what’s hidden in between.",
    aboutTitle:
      "When anything can be generated,\nhow do we know what to trust?",
    about:
      "PandaHat Adversarial is a space for asking difficult questions about AI-generated media. We explore how digital watermarks and deepfake analysis can help us understand the origins of the images we see.",
    focusTitle: "Looking beneath the surface.",
  },
  research: {
    eyebrow: "OUR RESEARCH",
    heading: "A closer look.\nA better question.",
    intro:
      "Investigating the boundary between authentic and synthetic. This semester, we’re exploring the traces AI leaves behind—and how those traces hold up under pressure.",
    aboutTitle: "Understanding media.\nQuestioning its origins.",
    about:
      "Our research brings together curiosity about machine learning, image processing, and digital provenance. We’re interested in how media can carry evidence of its origin, and how that evidence changes when an image is edited or generated.",
    focusTitle: "Three lenses. One question of trust.",
    methodologyTitle: "Curiosity, with a method.",
    steps: [
      {
        title: "Investigate",
        description:
          "Start with the literature, examine assumptions, and shape a question worth asking.",
      },
      {
        title: "Experiment",
        description:
          "Build small, reproducible experiments to explore signals and their limitations.",
      },
      {
        title: "Evaluate",
        description:
          "Compare observations, document uncertainty, and use what we learn to ask better questions.",
      },
    ],
  },
  team: {
    eyebrow: "THE PEOPLE BEHIND THE QUESTIONS",
    heading: "Different perspectives.\nShared curiosity.",
    intro:
      "A collaborative space for people who like to look a little closer. Bringing together interests in machine learning, security, and the stories hidden inside digital media.",
    title: "Meet the minds behind the work.",
    note: "23 roles: 1 PM, 1 Co-PM, 5 Team Leaders, and 16 regular members. Names and bios are placeholders.",
    outro: "Good research starts\nwith a little curiosity.",
  },
  footer: {
    tagline: "Question the image. Explore the signal.",
    note: "A research portfolio in progress.",
  },
  notFound: {
    eyebrow: "404 / SIGNAL NOT FOUND",
    heading: "A little off the grid.",
    intro: "This page doesn’t exist. Let’s get you back to the research.",
  },
};
export const topics: ResearchTopic[] = [
  {
    id: "01",
    title: "Digital watermarking",
    subtitle: "A signature beneath the pixels.",
    description:
      "Exploring how invisible signals can establish media provenance—and what happens to those signals when images are transformed.",
    tags: ["PROVENANCE", "ROBUSTNESS"],
  },
  {
    id: "02",
    title: "Deepfake analysis",
    subtitle: "Finding what doesn’t quite belong.",
    description:
      "Investigating the subtle patterns in synthetic images, and asking where detection works, where it fails, and why.",
    tags: ["SYNTHETIC MEDIA", "DETECTION"],
  },
  {
    id: "03",
    title: "Media authenticity",
    subtitle: "Connecting the evidence.",
    description:
      "Considering how provenance and detection can work together to communicate uncertainty about the origins of digital media.",
    tags: ["TRUST", "EVALUATION"],
  },
];
const memberSlot = (name: string, role: string, initials: string): TeamMember => ({
  name, role, initials,
  bio: "Member name and biography to be added.",
  interests: "Research interests to be confirmed",
});
export const members: TeamMember[] = [
  memberSlot("Project Manager", "PM", "PM"),
  memberSlot("Co-Project Manager", "Co-PM", "CO"),
  ...Array.from({ length: 5 }, (_, i) => memberSlot(`Team Leader ${i + 1}`, "TL · Team Leader", `T${i + 1}`)),
  ...Array.from({ length: 16 }, (_, i) => memberSlot(`Member ${String(i + 1).padStart(2, "0")}`, "Regular member", String(i + 1).padStart(2, "0"))),
];
export const metadata: Record<string, { title: string; description: string }> =
  {
    "/": {
      title: "PandaHat Adversarial — Exploring trust in synthetic media",
      description: content.home.description,
    },
    "/research": {
      title: "Research — PandaHat Adversarial",
      description: content.research.intro,
    },
    "/team": {
      title: "Team — PandaHat Adversarial",
      description: content.team.intro,
    },
  };
