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
  descriptionParagraphs: [
    "Machine Learning (ML) models are nowadays more accessible than ever in today’s technological landscape, bringing a new era of possibilities, opportunities, and difficulties. Nevertheless, these models are susceptible to cyber-attacks.",
    "Machine Learning models are vulnerable to Adversarial attacks, in which the algorithm of a model can be affected by an attacker with the desire to cause the model to behave contrary to expected, i.e. causing the model to misclassify a certain image when it correctly classified it previously.",
    "The goal of Pandahat Adversarial is to teach and empower students in the complexities of Machine Learning, as a response to the dynamically changing technological landscape. Additionally, our objective is for these students to use that empowerment and knowledge in ML to actively participate in the construction and understanding of adversarial attacks within complicated models and data, in addition to enabling them to fight against adversarial attacks by developing, or improving existing defenses.",
  ],
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
  semester: {
    title: "How resilient are digital watermarks?",
    problem: [
      "As the technology of generative artificial intelligence (AI) keeps developing, images, audio, and video produced by AI are becoming more and more difficult to tell apart from genuine media. When used by people with bad intentions, such capabilities can be used to carry out misinformation campaigns, damage public trust, and allow cyberbullying, fraud, identity deception, and other kinds of digital abuse. The problems involved show an increasing demand for reliable methods to verify the authenticity and integrity of digital media.",
      "Digital watermarking is one of the more promising methods available for authenticating media. It achieves this by embedding invisible information into digital content, enabling detection of any unauthorized changes while preserving visual quality. Yet even though many watermarking algorithms have been proposed over the last few decades, their resistance to modern AI-based manipulations, image editing tools, and adversarial attacks has not been thoroughly assessed.",
      "The research project will involve a systematic assessment of various digital watermarking techniques, covering both conventional signal-processing methods and more recent learning-based methods, across a wide range of realistic image manipulations and adversarial attacks. Students will implement the watermarking algorithms, test them, and compare them using standard image datasets and evaluation metrics.",
    ],
    criteria: [
      "Resistance to common image manipulations and modifications produced by AI.",
      "Imperceptibility of the embedded watermark.",
      "Detection accuracy and reliability.",
      "Computational efficiency.",
      "Resilience to adversarial attacks.",
    ],
    objective: "The objective of the project is to conduct a thorough comparison of existing digital watermarking techniques for media authentication and to identify promising areas of research for developing more robust and secure watermarking systems.",
    experience: "The students will gain practical experience in experimental research, algorithm implementation, scientific analysis, and research communication, and will have the opportunity to participate in conference presentations and publish their research.",
    questions: [
      { group: "GROUP A", title: "Robustness", question: "Does the watermark survive?" },
      { group: "GROUP B", title: "Detection", question: "Does it affect the detector?" },
      { group: "GROUP C", title: "Localization", question: "Where was the media altered?" },
    ],
  },
  team: {
    eyebrow: "THE PEOPLE BEHIND THE QUESTIONS",
    heading: "Different perspectives.\nShared curiosity.",
    intro:
      "A collaborative space for people who like to look a little closer. Bringing together interests in machine learning, security, and the stories hidden inside digital media.",
    title: "Meet the minds behind the work.",
    note: "Our team includes 1 PM, 1 Co-PM, 5 Team Leaders, and 16 members.",
    outro: "Good research starts\nwith a little curiosity.",
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
  bio: "Biography to be added.",
  interests: "Research interests to be confirmed",
});
export const members: TeamMember[] = [
  memberSlot("Jorge Luna", "PM", "JL"),
  memberSlot("Joshua Rivera", "Co-PM", "JR"),
  memberSlot("Gian Miranda", "TL · Team Leader", "GM"),
  memberSlot("Daniel Reyes", "TL · Team Leader", "DR"),
  memberSlot("Revel Velazquez", "TL · Team Leader", "RV"),
  memberSlot("Joshua Roman", "TL · Team Leader", "JR"),
  memberSlot("Emmanuel Lopez", "TL · Team Leader", "EL"),
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
