export type ResearchTopic = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  question: string;
  methods: string[];
  evidence: string;
};
export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  interests: string;
  bio: string;
  initials: string;
  photo?: string;
  skills: string[];
  projects: string[];
  education?: string;
  experience?: string[];
  contact?: string;
  links?: string[];
  resume?: string;
};
export type Advisor = { name: string; role: string; focus: string; photo: string };
export type Photo = { src: string; thumbnail: string; alt: string };
export type Poster = {
  label: string;
  title: string;
  preview: string;
  full: string;
  pdf?: string;
  alt: string;
  width: number;
  height: number;
  archived?: boolean;
};
export type Sponsor = { src: string; alt: string; width: number; height: number; group: "academic" | "mit" };
type OnboardingStep = { step: string; title: string; description: string };
export type YearContent = {
  year: string;
  // Optional: overrides the shared description for this year.
  description?: { title?: string; paragraphs?: string[] };
  semester: {
    title: string;
    problem: string[];
    criteria: string[];
    objectiveTitle: string;
    objective: string;
    experience: string;
    questionsTitle: string;
    questions: { group: string; title: string; question: string }[];
  };
  topics: ResearchTopic[];
  team: { note: string; fullTimeLabel: string; fullTimeNote: string; onboardingLabel: string; onboardingNote: string; onboarding?: OnboardingStep[] };
  members: TeamMember[];
  conference: { title: string; subtitle: string; groupPhoto: Photo; photos: Photo[] } | null;
  posters: Poster[];
  advisors: Advisor[];
  sponsors: Sponsor[];
};
export const content = {
  brand: "PandaHat",
  subbrand: "ADVERSARIAL",
  descriptionTitle: "Understanding machine learning. Empowering students.",
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
  team: {
    eyebrow: "THE PEOPLE BEHIND THE QUESTIONS",
    heading: "Different perspectives.\nShared curiosity.",
    intro:
      "A collaborative space for people who like to look a little closer. Bringing together interests in machine learning, security, and the stories hidden inside digital media.",
    title: "Meet the minds behind the work.",
    outro: "Good research starts\nwith a little curiosity.",
    onboarding: [
      { step: "01", title: "Orient", description: "Learn the research questions, tools, expectations, and shared vocabulary." },
      { step: "02", title: "Observe", description: "Read the work, reproduce a small result, and learn to document the path." },
      { step: "03", title: "Contribute", description: "Join a focused track with a mentor and make a visible first contribution." },
      { step: "04", title: "Lead", description: "Shape a question, communicate evidence, and help the next member start." },
    ],
  },
  notFound: {
    eyebrow: "404 / SIGNAL NOT FOUND",
    heading: "A little off the grid.",
    intro: "This page doesn’t exist. Let’s get you back to the research.",
  },
};
const topics2026: ResearchTopic[] = [
  {
    id: "01",
    slug: "digital-watermarking",
    title: "Digital watermarking",
    subtitle: "A signature beneath the pixels.",
    description:
      "Exploring how invisible signals can establish media provenance—and what happens to those signals when images are transformed.",
    tags: ["PROVENANCE", "ROBUSTNESS"],
    question: "Can an invisible signal survive the transformations that change an image?",
    methods: ["Encode and decode tests", "Compression and resize sweeps", "Bit accuracy and imperceptibility"],
    evidence: "Compare the recovered signal and image quality after each defined manipulation.",
  },
  {
    id: "02",
    slug: "deepfake-analysis",
    title: "Deepfake analysis",
    subtitle: "Finding what doesn’t quite belong.",
    description:
      "Investigating the subtle patterns in synthetic images, and asking where detection works, where it fails, and why.",
    tags: ["SYNTHETIC MEDIA", "DETECTION"],
    question: "What clues remain when a model tries to recognize a synthetic image?",
    methods: ["Paired real/fake evaluation", "Detector precision and recall", "Failure-case review"],
    evidence: "Keep confidence, false positives, and dataset limits attached to each finding.",
  },
  {
    id: "03",
    slug: "media-authenticity",
    title: "Media authenticity",
    subtitle: "Connecting the evidence.",
    description:
      "Considering how provenance and detection can work together to communicate uncertainty about the origins of digital media.",
    tags: ["TRUST", "EVALUATION"],
    question: "How can provenance and detection work together to communicate uncertainty?",
    methods: ["Evidence mapping", "Signal comparison", "Human-readable reporting"],
    evidence: "Connect model output, provenance signals, and limitations into a traceable brief.",
  },
];
const advisors2026: Advisor[] = [
  { name: "Dr. Nayda Santiago", role: "Research advisor", focus: "Digital media, machine learning, and research direction", photo: "/images/professors/nayda-santiago.webp" },
  { name: "Dr. Alcibiades Bustillo", role: "Research advisor", focus: "Computer science mentorship and experimental context", photo: "/images/professors/alcibiades-bustillo.webp" },
];
const memberSlug = (name: string) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const memberSlot = (name: string, role: string, initials: string, profile: Partial<TeamMember> = {}): TeamMember => ({
  slug: memberSlug(name), name, role, initials,
  bio: "Biography to be added.",
  interests: "Research interests to be confirmed",
  skills: ["Research methods", "Documentation"],
  projects: ["Project details to be added"],
  ...profile,
});
const resumeProfiles: Record<string, Partial<TeamMember>> = {
  "Emmanuel Lopez": {"name": "Emmanuel López", "bio": "Computer Science student researching adversarial machine learning, satellite-image classification, and deepfake detection while building data-structure-driven applications.", "interests": "Adversarial machine learning, computer vision, deepfake detection, data structures", "skills": ["C++", "Python", "HTML", "PyTorch", "scikit-learn", "Albumentations", "NumPy", "Matplotlib", "Git/GitHub", "Jupyter Notebook", "CUDA"], "projects": ["Sentinel-2 vegetation CNN pipeline", "Smart Academic Task Planner", "Shopping Cart System", "Electra electric vehicle project"], "education": "B.S. Computer Science, UPRM · Expected May 2028", "experience": ["PandaHat Adversarial · Undergraduate Researcher (Spring 2026–Present)"], "contact": "emmanuel.lopez17@upr.edu", "links": ["github.com/Emmanuel-Lopez-UPRM"]},
  "Jorge Luna": { photo: "/images/members/jorge-luna.webp","name": "Jorge Luna", "bio": "Computer Science and Engineering student and PandaHat project manager working on machine learning, digital watermarking, robotics, and containerized software systems.", "interests": "Machine learning, intelligent systems, DevOps, digital watermarking, robotics", "skills": ["Python", "C", "C++", "C#", "Java", "SQL", "Docker", "Kubernetes", "OpenShift", "PyTorch", "Git/GitHub", "FlutterFlow", "Supabase"], "projects": ["MCP library management server and client", "Semantic document matching", "AON robotics navigation and sensor fusion", "Smart LiveStock", "AI pronunciation coach"], "education": "B.S. Computer Science and Engineering, UPRM · Expected May 2028", "experience": ["Lockheed Martin · A/AI Machine Learning Intern (May–Aug 2026)", "PandaHat Adversarial · Project Manager", "AON Robotics Team · Programmer"], "contact": "jorge.luna1@upr.edu", "links": ["linkedin.com/in/jorge-l-luna-pagán/"]},
  "Kelvin Soto": {"name": "Kelvin Soto", "bio": "Computer Engineering student with a minor in Astrophysics and Astronomy, building programming and hands-on circuit analysis skills.", "interests": "Computer engineering, circuit analysis, astrophysics, astronomy", "skills": ["C", "C++", "VS Code", "TinkerCAD", "AutoCAD", "Microsoft Office", "Breadboards", "Digital multimeters", "DC power supplies"], "projects": ["AC and DC circuit construction, testing, and measurement · UPRM laboratory"], "education": "B.S. Computer Engineering, UPRM · 2024–2029 · Minor in Astrophysics and Astronomy", "experience": ["UPRM · Electric Systems Analysis Laboratory (Jan–May 2026)", "National Society of Leadership and Success · Inductee", "ColorStack UPRM · Member"], "contact": "kelvin.soto6@upr.edu", "links": []},
  "Frances Sola": {"name": "Frances Solá", "bio": "Computer Engineering student developing Python desktop applications and simulation tools, with interests in software engineering, machine learning, and cybersecurity research.", "interests": "Software engineering, machine learning, cybersecurity research", "skills": ["Python", "C", "C++", "Bash", "Linux (RHEL 9, Ubuntu)", "PyQt6", "Tkinter", "Git/GitHub", "PyCharm", "VS Code", "PyInstaller", "CompTIA Security+ ce"], "projects": ["FALCON-UI · Python/PyQt6 interface for simulation and emulation resource management"], "education": "B.S. Computer Engineering, UPRM · Expected May 2030", "experience": ["NAWCAD · Computer Engineering Intern (Jun–Aug 2026)", "NBN23 · Game Operations & Digital Scoring Assistant (Sep 2024–Apr 2026)"], "contact": "frasola0@gmail.com", "links": ["linkedin.com/in/frances-solá-lópez-258bb6408"]},
  "Kevin Beltran": { name: "Kevin Beltrán", bio: "Software Engineering student focused on full-stack development, scalable systems, Agile delivery, and aerospace technology.", interests: "Full-stack software, aerospace technology, Agile/Scrum, AI-assisted engineering", skills: ["Python", "C++", "Java", "Git/GitHub", "Docker", "Streamlit", "HTML", "CSS", "SQL", "Ignition", "MCP", "Unit testing"], projects: ["WebFit full-stack fitness application", "Online Store backend", "L3Harris Hack the Horizon MCP server"], education: "B.S. Software Engineering, UPRM · Expected May 2029", experience: ["Collins Aerospace · Digital Technology Intern", "UPRM · Student Orientation Leader", "UPRM · Advanced Programming Mentor", "CodePath Tech Exchange"], contact: "beltrank59@gmail.com", links: ["github.com/KevinSBeltran", "linkedin.com/in/kevin-s-beltran-pena-in"] },
  "Sorimerlin Santos": { photo: "/images/members/sorimerlin-santos.webp", name: "Sorimerlin Santos", bio: "Computer Science and Engineering student and software engineering co-op building production systems, scheduling tools, and reliable data workflows.", interests: "Full-stack engineering, capacity-aware systems, testing, product development", skills: ["C#", "Java", "Python", "C++", "ASP.NET Core", "EF Core", "Blazor", "SignalR", "SQL Server", "xUnit", "Testcontainers"], projects: ["Capacity-aware production scheduling", "ACCESS facility management", "LECTAS cycle-time analysis", "UPRM eRide reservation system"], education: "B.S. Computer Science and Engineering, UPRM · Expected 2028", experience: ["ABB · Software Engineering Co-op", "IEEE Computer Science Society · Product Manager", "UPRM Competitive Programming Team"], contact: "sorimerlin.santos@upr.edu", links: ["github.com/sorimerlinsantos", "linkedin.com/in/sorimerlin-santos"] },
  "Aliek Betancourt": { photo: "/images/members/aliek-betancourt.webp", name: "Aliek Betancourt", bio: "Computer Engineering student building a foundation in programming, engineering, project coordination, and collaborative problem solving.", interests: "Computer engineering, programming, continuous learning, teamwork", skills: ["Basic Python", "Arduino", "Google Workspace", "Microsoft Office 365", "Trello", "ClickUp", "Canva"], projects: ["Arduino traffic light and proximity-sensor system"], education: "B.S. Computer Engineering, UPRM · 2026–Present", experience: ["CECIA UPR Bayamón · Member", "Sociedad Nacional de Honor · Treasurer", "Campamento Del Carmen · Camp Counselor"], contact: "aliek.betancourt@upr.edu", links: ["linkedin.com/in/aliek-betancourt"] },
  "Joshua Rivera": { photo: "/images/members/joshua-rivera.webp", bio: "Software Engineering student and PandaHat co-project manager working across reproducible machine learning experiments and student research coordination.", interests: "Machine learning, software engineering, computer vision, adversarial research", skills: ["Python", "C++", "Java", "PyTorch", "scikit-learn", "FastAPI", "Git/GitHub"], projects: ["Vegetation Classification CNN", "Mimi's Garden leaf condition classifier", "PandaHat watermarking research"], education: "B.S. Software Engineering, UPRM · Expected 2029", experience: ["PandaHat Adversarial · Co-Project Manager / Research Member", "Business Computer POS · Software Development Intern", "Loxodon-1 · Avionics Division"], contact: "joshua.rivera46@upr.edu", links: ["github.com/Joshua-Rivera", "swejoshua.com"] },
  "Gian Miranda": { photo: "/images/members/gian-miranda.webp", bio: "Computer Science and Engineering student and PandaHat project lead focused on building reliable software and machine learning systems.", interests: "Software engineering, mobile development, full-stack systems, AI/ML", skills: ["Python", "C++", "Java", "Dart", "Flutter", "Firebase", "PyTorch", "Git/GitHub"], projects: ["MiUni tournament management system", "Pet Finder app", "Evelyn Sweet ordering platform"], education: "B.S. Computer Science and Engineering, UPRM · Expected 2029", experience: ["PandaHat Adversarial · Machine Learning Research", "FT Innovations · Software Developer", "NOVA UPRM · Power & Electrical Systems"], contact: "gian.miranda1@upr.edu", links: ["github.com/Gian-MR", "swegian.com"] },
  "Daniel Reyes": { photo: "/images/members/daniel-reyes.webp", bio: "Computer Science and Engineering student researching neural-network robustness while building telemetry and educational systems.", interests: "Adversarial machine learning, CNN robustness, telemetry, robotics", skills: ["Python", "C++", "Java", "PyTorch", "FastAPI", "Docker", "Google Cloud", "Git"], projects: ["Study Sync", "Solar vehicle telemetry", "PandaHat CNN robustness research"], education: "B.S. Computer Science and Engineering, UPRM · Expected 2028", experience: ["PandaHat Adversarial · Undergraduate Researcher", "Solar Engineering Research and Racing Team · Telemetry Engineer", "CAHSI-UPRM · Vice President"], contact: "danireyesnegron@gmail.com", links: ["github.com/daniProCode", "linkedin.com/in/daniel-e-reyes-negron-97b483332"] },
  "Joshua Roman": { photo: "/images/members/joshua-roman.webp", bio: "Software Engineering student developing object-oriented systems and learning-path research skills through PandaHat.", interests: "Software engineering, machine learning, algorithms, mobile development", skills: ["Python", "C++", "Java", "Swift", "PyTorch", "scikit-learn", "Git/GitHub"], projects: ["Vegetation health estimation", "Parking Lot Reservation System", "Full Stack Grade Tracking App"], education: "B.S. Software Engineering, UPRM · Expected 2028", experience: ["PandaHat Adversarial · Learning Path", "Advanced Programming Laboratory · Mentor"], contact: "joshua.roman4@upr.edu", links: [] },
  "Héctor López": { bio: "Software Engineering student with a strong foundation in programming, mathematics, and collaborative problem solving.", interests: "Software development, computer science, mathematics, web programming", skills: ["C", "C++", "Python", "HTML", "CSS", "JavaScript", "SQL"], projects: ["Minesweeper-Raylib", "Wordle web API and interface modes"], education: "B.S. Software Engineering, UPRM · Expected 2030", experience: ["National Honor Society · Volunteer", "AIC Science Club · President"], contact: "hectorglc7@gmail.com", links: ["github.com/Hector-G-Lopez"] },
  "Ian Figueroa": { bio: "Software Engineering student building high-performance systems, analytics platforms, and evaluation tooling.", interests: "Systems engineering, concurrency, networking, full-stack development, machine learning", skills: ["C++", "Python", "TypeScript", "Rust", "React", "FastAPI", "WebSockets", "Docker"], projects: ["Titan low-latency streaming engine", "Options Risk Engine", "FinLLM RAG evaluation system"], education: "B.S. Software Engineering, UPRM · Expected 2030", experience: ["Intro to Programming · Student Mentor"], contact: "ian.figueroa6@upr.edu", links: ["github.com/ianfigueroa", "linkedin.com/in/ian-figueroa1"] },
  "Fernando Velez": { bio: "Early-career software engineering student with a foundation in C, Python, IT support, leadership, and bilingual collaboration.", interests: "Programming, IT support, problem solving, leadership", skills: ["C", "Python", "IT support", "Microsoft Office", "Bilingual communication"], projects: ["CS50 programming coursework", "IT inventory and device support"], education: "B.S. Software Engineering pathway · Colegio de La Salle graduate 2026", experience: ["César Castillo LLC · IT Assistant Intern", "La Salle Chapter · President"], contact: "fevf88@gmail.com", links: [] },
  "Jayden Sanchez": { bio: "Software Engineering undergraduate combining project management, C++ instruction, web development, and robotics systems.", interests: "Software engineering, project management, web development, robotics", skills: ["Python", "C++", "Java", "React", "HTML", "CSS", "Git/GitHub"], projects: ["Esports organizer React app", "Supercell Invaders", "Bank Account Simulator"], education: "B.S. Software Engineering, UPRM · Expected 2028", experience: ["Advanced Programming · Teaching Assistant", "Loxodon-1 · Avionics Systems"], contact: "jayden.sanchez@upr.edu", links: ["github.com/sanchezjayden"] },
  "Ian Banks": { bio: "Software Engineering student focused on object-oriented programming, game systems, troubleshooting, and collaborative development.", interests: "C++, Python, game systems, software design, problem solving", skills: ["Python", "C++", "Git/GitHub", "Linux", "Bash", "OOP", "Recursion"], projects: ["Tanks Game", "Pacman", "Balatro clone"], education: "B.S. Software Engineering, UPRM · Expected 2030", experience: ["Independent car wash · Owner/operator", "Municipality of Guayama · Office Assistant"], contact: "ian.banks@upr.edu", links: [] },
  "Adríana Vega": { photo: "/images/members/adriana-vega.webp", bio: "First-year Software Engineering student exploring web development, robotics, artificial intelligence, and human-computer interaction.", interests: "AI/ML, computer vision, software development, mobile and web development, HCI", skills: ["HTML", "CSS", "JavaScript", "C++", "Arduino", "Figma", "VS Code"], projects: ["Personal portfolio website", "BlueBot autonomous robot"], education: "B.S. Software Engineering, UPRM · Expected 2031", experience: [], contact: "adriana.vega10@upr.edu", links: [] },
  "Jerremy Aponte": { bio: "Computer Science and Engineering student building Python and C++ game systems with object-oriented design.", interests: "Object-oriented programming, game development, algorithms, software engineering", skills: ["Python", "C++", "Git/GitHub", "OOP", "Microsoft Office"], projects: ["Balatro card game clone", "Pacman arcade simulation"], education: "B.S. Computer Science and Engineering, UPRM · 2025–Present", experience: ["Republic American · Newspaper Distribution and Customer Service Assistant"], contact: "Jerremy.Aponte@upr.edu", links: [] },
  "Josue López": { photo: "/images/members/josue-lopez.webp", bio: "Computer Engineering student blending hardware and software through AI agents, web resources, and engineering systems.", interests: "AI engineering, web development, aerospace, hardware/software integration", skills: ["C", "C++", "Python", "HTML", "CSS", "Docker", "REST APIs", "MCP", "Grafana"], projects: ["Discord bot for incoming students", "Guía Prepística orientation resource", "RBNI trolley REST API"], education: "B.S. Computer Engineering, UPRM · Expected 2029", experience: ["Collins Aerospace · AI Engineer Intern", "Team-Made · Student Counselor Group Leader"], contact: "josue.lopez18@upr.edu", links: ["linkedin.com/in/josue-c-lopez-irizarry", "github.com/josuelopez18"] },
  "Kiara Jimenez": { bio: "Software Engineering student building playable systems and data-structure-driven applications in Python, C++, and Java.", interests: "Software engineering, algorithms, game development, data structures", skills: ["Python", "Java", "C++", "Pygame", "GitHub", "PyCharm", "VS Code"], projects: ["Tetris game", "Minecraft-inspired interface", "Parking Reservation Management System"], education: "B.S. Software Engineering, UPRM", experience: [], contact: "kiara.jimenez2@uprm.edu", links: [] },
  "Daniel Muñoz": { photo: "/images/members/daniel-munoz.webp", bio: "Software Engineering student with experience in programming mentorship, electronics, robotics, automation, and student leadership.", interests: "Robotics, automation, electronics, web development, cybersecurity", skills: ["C++", "Python", "HTML", "CSS", "Arduino", "PLC systems", "Robotics"], projects: ["RBNI university trolley REST API", "FRAS school safety system"], education: "B.S. Software Engineering, UPRM · Expected 2030", experience: ["CIIC3015 · Mentor", "ColorStack UPRM · Representative", "SkillsUSA · Regional Vice President"], contact: "daniel.munoz13@upr.edu", links: ["linkedin.com/in/daniel-f-munoz"] },
};
const members2026: TeamMember[] = [
  memberSlot("Jorge Luna", "PM", "JL", resumeProfiles["Jorge Luna"]),
  memberSlot("Joshua Rivera", "Co-PM", "JR", resumeProfiles["Joshua Rivera"]),
  memberSlot("Gian Miranda", "TL · Team Leader", "GM", resumeProfiles["Gian Miranda"]),
  memberSlot("Daniel Reyes", "TL · Team Leader", "DR", resumeProfiles["Daniel Reyes"]),
  memberSlot("Revel Velazquez", "TL · Team Leader", "RV", { photo: "/images/members/revel-velazquez.webp" }),
  memberSlot("Joshua Roman", "TL · Team Leader", "JR", resumeProfiles["Joshua Roman"]),
  memberSlot("Emmanuel Lopez", "TL · Team Leader", "EL", resumeProfiles["Emmanuel Lopez"]),
  memberSlot("Sorimerlin Santos", "Learning path member", "SS", resumeProfiles["Sorimerlin Santos"]),
  memberSlot("Aliek Betancourt", "Learning path member", "AB", resumeProfiles["Aliek Betancourt"]),
  memberSlot("Héctor López", "Learning path member", "HL", resumeProfiles["Héctor López"]),
  memberSlot("Kelvin Soto", "Learning path member", "KS", resumeProfiles["Kelvin Soto"]),
  memberSlot("Ian Figueroa", "Learning path member", "IF", resumeProfiles["Ian Figueroa"]),
  memberSlot("Fernando Velez", "Learning path member", "FV", resumeProfiles["Fernando Velez"]),
  memberSlot("Jayden Sanchez", "Learning path member", "JS", resumeProfiles["Jayden Sanchez"]),
  memberSlot("Frances Sola", "Learning path member", "FS", resumeProfiles["Frances Sola"]),
  memberSlot("Ian Banks", "Learning path member", "IB", resumeProfiles["Ian Banks"]),
  memberSlot("Adríana Vega", "Learning path member", "AV", resumeProfiles["Adríana Vega"]),
  memberSlot("Jerremy Aponte", "Learning path member", "JA", resumeProfiles["Jerremy Aponte"]),
  memberSlot("Josue López", "Learning path member", "JL", resumeProfiles["Josue López"]),
  memberSlot("Kiara Jimenez", "Learning path member", "KJ", resumeProfiles["Kiara Jimenez"]),
  memberSlot("Daniel Muñoz", "Learning path member", "DM", resumeProfiles["Daniel Muñoz"]),
  memberSlot("Kevin Beltran", "Learning path member", "KB", { photo: "/images/members/kevin-beltran.webp" }),
];
// Names/order: presentation slide 1. Roles: user confirmed the first three as PMs,
// with the remaining nine as members. Do not reuse later 2026 resume details.
const members2025: TeamMember[] = [
  ["Edwin Almodovar", "EA"],
  ["Jan Rivera", "JR"],
  ["Angel Fernández", "AF"],
  ["Gian Miranda", "GM"],
  ["Diego Rios", "DR"],
  ["Angel Perez", "AP"],
  ["Jorge Luna", "JL"],
  ["Joshua Rivera", "JR"],
  ["Joshua Román", "JR"],
  ["Emmanuel Lopez", "EL"],
  ["Daniel Reyes", "DR"],
  ["Revel Velazquez", "RV"],
].map(([name, initials], index) => memberSlot(name, index < 3 ? "PM" : "Member", initials, {
  photo: members2026.find(member => member.slug === memberSlug(name))?.photo,
  bio: "Listed as a student in the 2025 research presentation. Individual biography not provided.",
  interests: "Individual research interests not provided in the presentation.",
  skills: ["Individual skills and tools not provided in the presentation."],
  projects: ["Individual project assignments not provided in the presentation."],
  education: "Education details not provided in the presentation.",
}));
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

const conferencePhotos2026: Photo[] = [
  "Team member speaking during the presentation",
  "Research presentation at the lectern",
  "PandaHat team together at the conference",
  "Team discussion with a presenter holding a microphone",
  "Team member sharing remarks with the audience",
  "Research discussion during the team presentation",
  "Team presenting and answering questions",
  "Closing remarks during the presentation",
  "Team member presenting alongside fellow researchers",
  "PandaHat members and advisor gathered around a table",
  "Wide view of the PandaHat research presentation",
  "Team member addressing the conference audience",
  "PandaHat group gathered with advisors at the conference",
].map((description, index) => ({
  src: `/images/conference/spring-iap-2026-${String(index + 1).padStart(2, "0")}.webp`,
  thumbnail: `/images/conference/spring-iap-2026-${String(index + 1).padStart(2, "0")}-thumb.webp`,
  alt: `${description} · Spring IAP, May 2026, Mayagüez`,
}));

const sponsors2026: Sponsor[] = [
  { src: "/images/sponsors/iap-transparent.webp", alt: "IAP", width: 1774, height: 887, group: "academic" },
  { src: "/images/sponsors/uprm-transparent.webp", alt: "Universidad de Puerto Rico Recinto Universitario de Mayagüez", width: 1254, height: 1254, group: "academic" },
  { src: "/images/sponsors/cps-iot-transparent.webp", alt: "CPS IoT Laboratory", width: 1173, height: 1341, group: "academic" },
  { src: "/images/sponsors/mit-lincoln-transparent.webp", alt: "MIT Lincoln Laboratory", width: 1942, height: 809, group: "mit" },
];

// Newest year first. The first entry is the default view; add past years below it.
export const years: YearContent[] = [
  {
    year: "2026",
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
      objectiveTitle: "Compare techniques. Build stronger defenses.",
      objective: "The objective of the project is to conduct a thorough comparison of existing digital watermarking techniques for media authentication and to identify promising areas of research for developing more robust and secure watermarking systems.",
      experience: "The students will gain practical experience in experimental research, algorithm implementation, scientific analysis, and research communication, and will have the opportunity to participate in conference presentations and publish their research.",
      questionsTitle: "Three main research questions",
      questions: [
        { group: "GROUP A", title: "Robustness", question: "Does the watermark survive?" },
        { group: "GROUP B", title: "Detection", question: "Does it affect the detector?" },
        { group: "GROUP C", title: "Localization", question: "Where was the media altered?" },
      ],
    },
    topics: topics2026,
    team: {
      note: "Our current cohort includes 7 full-time researchers and 15 new members moving through the learning path.",
      fullTimeLabel: "07 / FULL-TIME RESEARCHERS",
      fullTimeNote: "Seven full-time researchers anchor the active questions, mentoring, and project continuity.",
      onboardingLabel: "15 / LEARNING PATH MEMBERS",
      onboardingNote: "Fifteen new members move through a shared learning path from orientation to independent contribution.",
    },
    members: members2026,
    conference: { title: "Spring IAP 2026", subtitle: "May 2026 · Mayagüez", groupPhoto: conferencePhotos2026[2], photos: conferencePhotos2026 },
    posters: [
      {
        label: "CURRENT RESEARCH / FALL 2026",
        title: "Digital Watermarking for Deepfake Detection, Authentication, and Localization",
        preview: "/images/posters/pandahat-fall-2026-preview.webp",
        full: "/images/posters/pandahat-fall-2026.webp",
        pdf: "/images/posters/pandahat-fall-2026.pdf",
        alt: "Fall 2026 PandaHat poster: Digital Watermarking for Deepfake Detection, Authentication, and Localization. Research on watermark robustness, face-swap resilience, and manipulation localization.",
        width: 2400,
        height: 3600,
      },
      {
        label: "ARCHIVE / 2023",
        title: "Recreating Adversarial Attacks in Multimodal Architecture",
        preview: "/images/posters/pandahat-2023-preview.webp",
        full: "/images/posters/pandahat-2023.webp",
        alt: "2023 PandaHat poster: Recreating Adversarial Attacks in Multimodal Architecture. Sections include introduction, problem and hypothesis, objectives, methodology, results, and timeline.",
        width: 1666,
        height: 2500,
        archived: true,
      },
    ],
    advisors: advisors2026,
    sponsors: sponsors2026,
  },
  {
    // Source: supplied presentation; slide mapping and unresolved details in docs/2025-content-sources.md.
    year: "2025",
    semester: {
      title: "Can LoRA reduce training energy while preserving accuracy and robustness?",
      problem: [
        "Deep learning models are increasingly used in real-world applications, but improving their robustness through adversarial training can increase training cost. The research examined whether Low-Rank Adaptation could reduce energy consumption while maintaining model performance.",
        "LoRA freezes the original model weights and trains low-rank adapter matrices instead of updating every weight. The project compared full fine-tuning with adapters applied to the last layers, depth layers, and all layers. Robustness needed to be evaluated separately because lower training energy does not guarantee reliable predictions under attack.",
      ],
      criteria: [
        "Model accuracy, precision, recall, and F1-score relative to full fine-tuning.",
        "Total training energy consumption and CO₂-equivalent emissions per epoch.",
        "Adversarial robustness: FGSM accuracy in the fine-tuning experiments, with PGD also included in the research objectives and student learning path.",
        "The stated success criterion: roughly the same predictive performance as full fine-tuning, with less energy consumption.",
      ],
      objectiveTitle: "Compare fine-tuning. Measure energy and robustness.",
      objective: "Compare full fine-tuning and LoRA fine-tuning, measure energy use, CO₂-equivalent emissions, and model performance, and evaluate reliability under FGSM and PGD adversarial attacks.",
      experience: "Students learned core machine learning concepts, built a vegetation classification model, implemented adversarial techniques, and developed training pipelines in PyTorch. The learning-path results reported clean-model accuracy of 0.871 and average F1-score of 0.834; data poisoning reduced them to 0.365 and 0.248, while the PGD attack model scored 0.000 on both metrics. Students identified understanding deep learning architectures, debugging pipelines, and balancing robustness, performance, and efficiency as challenges.",
      questionsTitle: "Research question and evaluation objectives",
      questions: [
        { group: "RESEARCH QUESTION", title: "LoRA", question: "Can LoRA reduce training energy consumption while preserving accuracy and robustness?" },
        { group: "EVALUATION OBJECTIVES", title: "Energy efficiency", question: "Compare full fine-tuning and LoRA using energy consumption, CO₂-equivalent emissions, predictive performance, and adversarial reliability." },
      ],
    },
    topics: [
      {
        id: "01",
        slug: "lora-fine-tuning",
        title: "LoRA fine-tuning",
        subtitle: "Train adapters. Evaluate robustness.",
        description: "Compare full fine-tuning with LoRA Last Layers, LoRA Depth Layers, and LoRA All on ConvNeXt-L using the Recyclable and Household Waste Classification Dataset. LoRA freezes the main weights and trains low-rank matrices. The FGSM results show that the energy-efficient standard-training configuration did not achieve the highest adversarial accuracy.",
        tags: ["LORA", "FINE-TUNING"],
        question: "Can LoRA reduce training energy consumption while preserving accuracy and robustness?",
        methods: [
          "Full fine-tuning versus last-layer, depth-layer, and all-layer LoRA adapters",
          "ConvNeXt-L on the Recyclable and Household Waste Classification Dataset",
          "Fixed training settings on Windows 11 with an RTX 5080",
          "FGSM evaluation, with accuracy and energy reported for adversarial training",
        ],
        evidence: "Slide 11 reports highest FGSM accuracy and total adversarial-training energy: full fine-tuning, 73.47% and 406 Wh; LoRA Last Layers, 70.6% and 453 Wh; LoRA Depth Layers, 72.70% and 456 Wh; LoRA All, 72.53% and 538 Wh. The respective CO₂eq emissions per epoch were 20.99 g, 25.64 g, 25.81 g, and 30.46 g. Full fine-tuning had the highest FGSM accuracy and the lowest energy consumption in this table. The presentation identifies improving LoRA robustness and testing other architectures, datasets, and hardware as future work.",
      },
      {
        id: "02",
        slug: "energy-efficient-ml",
        title: "Energy-efficient ML",
        subtitle: "Measure the cost of training.",
        description: "Measure training energy and CO₂-equivalent emissions alongside model performance. In the standard-training results, LoRA Last Layers used the least energy while reaching accuracy close to full fine-tuning. This reduction did not extend to the adversarial-training results, where every LoRA configuration used more energy than full fine-tuning.",
        tags: ["ENERGY", "EFFICIENCY"],
        question: "Can LoRA reduce training energy consumption while preserving accuracy and robustness?",
        methods: [
          "CodeCarbon tracking of energy consumption and CO₂-equivalent emissions",
          "Standard and adversarial training compared separately",
          "Highest accuracy, total energy in Wh, and CO₂eq in grams per epoch",
          "All configurations trained on the same computer with fixed settings",
        ],
        evidence: "Slide 10 reports standard-training results as highest accuracy, total energy, and CO₂eq per epoch: full fine-tuning, 89.6%, 394 Wh, and 13.36 g; LoRA Last Layers, 88.7%, 148 Wh, and 5.02 g; LoRA Depth Layers, 84.6%, 330 Wh, and 11.19 g; LoRA All, 86.6%, 398 Wh, and 13.49 g. LoRA Last Layers had the lowest standard-training energy consumption. Future work includes model optimization and compression beyond LoRA, as well as testing other architectures, real-world datasets, and hardware.",
      },
    ],
    team: {
      note: "The 2025 team includes 12 students: three project managers and nine members.",
      fullTimeLabel: "03 / PROJECT MANAGERS",
      fullTimeNote: "Edwin Almodovar, Jan Rivera, and Angel Fernández served as project managers.",
      onboardingLabel: "09 / MEMBERS",
      onboardingNote: "The other nine students listed in the presentation were team members.",
      onboarding: [
        { step: "01", title: "Prepare data", description: "Pre-process the dataset." },
        { step: "02", title: "Build SVM & MLP", description: "Develop support vector machine and multilayer perceptron models." },
        { step: "03", title: "Develop a CNN", description: "Develop a convolutional neural network." },
        { step: "04–05", title: "Optimize and test", description: "Apply data augmentation and CNN optimization, then explore adversarial attacks and defenses." },
      ],
    },
    members: members2025,
    conference: null,
    posters: [],
    advisors: [
      { name: "Dr. Nayda Santiago", role: "Research advisor", focus: "Electrical and Computer Engineering (ECE)", photo: "/images/professors/nayda-santiago.webp" },
      { name: "Dr. Alcibiades Bustillo", role: "Research advisor", focus: "Mathematics Department", photo: "/images/professors/alcibiades-bustillo.webp" },
    ],
    sponsors: sponsors2026,
  },
];
export const latestYear = years[0].year;
