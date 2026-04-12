export interface PlantUnit {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  type: 'reactor' | 'separator' | 'tower' | 'tank' | 'exchanger' | 'compressor';
  color: string;
  glowColor: string;
  position: { x: number; y: number };
  achievements: string[];
  description: string;
  icon: string;
  temperature?: string; // difficulty/intensity metaphor
  pressure?: string; // stakes metaphor
  yield?: string; // outcome metaphor
  projects?: ProjectItem[];
}

export interface ProjectItem {
  name: string;
  emoji: string;
  tech: string[];
  description: string;
  highlights: string[];
  role?: string;
  award?: string;
  link?: string;
}

export interface Reaction {
  from: string;
  to: string;
  equation: string;
  quote: string;
}

export const plantUnits: PlantUnit[] = [
  {
    id: 'class8',
    title: 'Pre-Reaction Vessel',
    subtitle: 'Middle School — Navodaya Vidyalaya',
    period: '~2019',
    type: 'tank',
    color: '#8B7355',
    glowColor: 'rgba(139, 115, 85, 0.5)',
    position: { x: 8, y: 75 },
    icon: '🎖️',
    temperature: '25°C',
    pressure: '1 atm',
    yield: 'Discipline: ∞',
    achievements: [
      'Joined NCC (National Cadet Corps) in Class 8',
      'Navodaya Vidyalaya — Academic foundation',
      'Began 2-year journey toward A Certificate',
      'Developed discipline, teamwork & leadership',
      'Drills, camps, national integration activities',
    ],
    description: 'Every great reaction needs a catalyst. NCC was mine in Class 8 — and Navodaya built my foundation. Marching in formation taught me that excellence is a habit, not an event.',
  },
  {
    id: 'class10',
    title: 'Separation Column A',
    subtitle: 'High School — Navodaya Vidyalaya',
    period: '2022–23',
    type: 'separator',
    color: '#FF6B00',
    glowColor: 'rgba(255, 107, 0, 0.5)',
    position: { x: 22, y: 72 },
    icon: '📐',
    temperature: '35°C',
    pressure: '2.5 atm',
    yield: 'Score: 91%',
    achievements: [
      'Class 10 Boards — 91% from Navodaya Vidyalaya (2022–23)',
      'NCC A Certificate earned (2-year program complete)',
      'Foundation in sciences, mathematics',
      'Character forged in discipline & dedication',
    ],
    description: 'Navodaya didn\'t just teach me science — it taught me character. 91% and an NCC A Certificate: the first real yield of this plant.',
  },
  {
    id: 'class12',
    title: 'High-Pressure Reactor',
    subtitle: 'Senior Secondary — St. Xavier\'s School',
    period: '2024–25',
    type: 'reactor',
    color: '#FF4500',
    glowColor: 'rgba(255, 69, 0, 0.6)',
    position: { x: 38, y: 68 },
    icon: '⚗️',
    temperature: '200°C',
    pressure: '50 atm',
    yield: 'Board: 90%',
    achievements: [
      'Class 12 — 90% from St. Xavier\'s Senior Secondary School (2024–25)',
      'JEE Mains — Qualified',
      'JEE Advanced — Qualified',
      'Relentless preparation: Physics, Chemistry, Math',
      'From Ayodhya to All-India merit',
    ],
    description: 'The highest pressure in the plant. JEE is not just an exam — it\'s a crucible. St. Xavier\'s gave me the rigour. Under 200°C of pressure, raw potential becomes refined purpose.',
  },
  {
    id: 'iit-entry',
    title: 'Feed Stream — IIT Dharwad',
    subtitle: 'Chemical & Biochemical Engineering',
    period: 'Aug 2025',
    type: 'compressor',
    color: '#FFB700',
    glowColor: 'rgba(255, 183, 0, 0.5)',
    position: { x: 54, y: 62 },
    icon: '🏛️',
    temperature: '30°C',
    pressure: '10 atm',
    yield: 'Rank: JEE Advanced',
    achievements: [
      'Admitted to IIT Dharwad — Chemical & Biochemical Engineering',
      'Cleared JEE Mains + JEE Advanced',
      'First IITian from family',
      'Joined August 2025 — Batch 2025',
      'Ayodhya to Karnataka — new latitude, same fire',
    ],
    description: 'JEE Mains → JEE Advanced → IIT Dharwad. The feed stream entering the main plant. Joined August 2025 — Chemical & Biochemical Engineering, because I want to build things that matter at a molecular level.',
  },
  {
    id: 'sem1',
    title: 'Distillation Tower α',
    subtitle: 'Semester 1 — First Wins',
    period: 'Aug–Dec 2025',
    type: 'tower',
    color: '#00D4AA',
    glowColor: 'rgba(0, 212, 170, 0.5)',
    position: { x: 67, y: 55 },
    icon: '🏆',
    temperature: '80°C',
    pressure: '15 atm',
    yield: 'CGPA: 8+',
    achievements: [
      'Aug 2025 – Dec 8, 2025 (Semester 1)',
      'CGPA: 8+ — Strong academic foundation',
      'SleeplessCodingSaga 3.0 — Team Leader',
      '1st Rank — Junior Category',
      'First hackathon, first podium, first taste of building',
      'Fell in love with coding under pressure',
    ],
    description: 'Semester 1 was about proving I belonged. Led a team through SleeplessCodingSaga 3.0, stayed up all night, and came out #1 in the junior category. CGPA 8+. The distillation was working.',
    projects: [
      {
        name: 'Indian Recipe Finder',
        emoji: '🍽️',
        tech: ['HTML', 'JavaScript', 'CSS', 'LocalStorage'],
        description: 'Beginner-friendly web project connecting people across India through traditional, local, and easy-to-make recipes.',
        highlights: [
          'Search recipes by name, city/region, ingredients, Veg/Non-Veg',
          'Upload your own recipe with full details',
          'LocalStorage-based persistence — no backend needed',
          'Community feedback / comment section',
          'Pure HTML + Vanilla JS — zero dependencies',
        ],
      },
      {
        name: 'ConvexTube — Smarter YouTube Productivity',
        emoji: '🧠',
        tech: ['JavaScript', 'HTML5', 'CSS3', 'Chrome Extensions MV3'],
        description: 'Chrome extension designed to boost learner focus and productivity on YouTube.',
        highlights: [
          'FocusTube Notes — timestamped in-video notes per video',
          'Auto-redirect to noted timestamps with real-time reminders',
          'Smart Filter — blur/hide distracting thumbnails by keyword',
          'Focus Timer overlay — pause, resume, reset on video page',
          'Draggable, resizable in-page notes box',
          'Dark/Light theme that matches YouTube\'s system theme',
        ],
        award: '1st Rank Junior Category — SleeplessCodingSaga 3.0',
      },
    ],
  },
  {
    id: 'sem2',
    title: 'Multi-Effect Evaporator β',
    subtitle: 'Semester 2 — The Expansion',
    period: 'Jan 2026–Present',
    type: 'exchanger',
    color: '#FF6B00',
    glowColor: 'rgba(255, 107, 0, 0.6)',
    position: { x: 80, y: 45 },
    icon: '🚀',
    temperature: '120°C',
    pressure: '25 atm',
    yield: 'CGPA: 8+, 6+ Events',
    achievements: [
      'Jan 5, 2026 – Present (Semester 2)',
      'NSS — National Service Scheme (joined)',
      'Nasiko AI Hackathon — HARI built',
      'Parsec @ IIT Dharwad: Singularity Hackathon',
      'Parsec @ IIT Dharwad: DevHack',
      'Veni Vidi Vici — Cybersecurity Deep Dive',
      'BitHunt — DSA + QR Code Treasure Hunt',
      'Coding Club — Web Dev Wing',
      'Building: Institute Wellness App + Election Website',
      'Vibe-a-thon 2026 — This very moment',
    ],
    description: 'Semester 2 is where the plant went multi-effect. AI hackathons, cybersecurity, DSA treasure hunts, NSS, and now building the very portfolio you\'re looking at. The reactions are still happening — April 2026.',
    projects: [
      {
        name: 'AcadMitra — Academic Command Center',
        emoji: '🎓',
        tech: ['HTML5', 'CSS3', 'Vanilla JS', 'LocalStorage', 'Google Fonts'],
        description: 'Comprehensive Academic Operating System centralizing a student\'s entire academic life into one dashboard.',
        highlights: [
          'GPA Strategizer Engine with feasibility analysis',
          'Calendar with conflict detection (one-time & recurring)',
          'Career Alignment & Electives recommendation engine',
          'Health & Wellness tracker (water, sleep, mood)',
          'Finance manager with expense tracking',
          '6 themes: Avengers (J.A.R.V.I.S.), Hogwarts, Jujutsu High, Minecraft, One Piece, Standard',
          'AI assistant with 12+ tool recommendations',
          'Focus Mode overlay with timer',
          'Faculty directory & collaboration tools',
        ],
        award: 'Team CodeDevz — DevHack @ Parsec IIT Dharwad',
      },
      {
        name: 'pRthivIkRmiH — Smart Precision Agriculture',
        emoji: '🌾',
        tech: ['Python 3.10+', 'Pathway', 'Chart.js', 'Tailwind', 'IoT', 'Twilio API'],
        description: 'Real-time IoT monitoring system bridging Technology and Agriculture for a Sustainable Future.',
        highlights: [
          'Live Dashboard: Real-time visualization for Soil Moisture, Temp, & NPK levels',
          'Smart Irrigation: Analyzes moisture vs. rain probability to suggest actions',
          'Pest Risk Assessment: Predicts outbreaks based on temp and humidity',
          'Streaming Pipeline: High-throughput Data Processing via Pathway',
          'Demo Simulator: Generates realistic environmental fluctuations for testing',
          'WhatsApp/SMS Alert System: Twilio API integration for farmers',
        ],
        award: 'Singularity Hackathon @ Parsec IIT Dharwad (Team CodeDevz)',
      },
      {
        name: 'HARI — HRFlow AI Agent',
        emoji: '🤖',
        tech: ['Python', 'FastAPI', 'OpenAI GPT-4o', 'A2A Protocol', 'Docker', 'Kong', 'Redis', 'MongoDB'],
        description: 'Intelligent HR Assistant agent built on Nasiko\'s multi-agent A2A protocol infrastructure.',
        highlights: [
          'Smart Resume Screener — scores & recommends candidates',
          'Interview Scheduler — drafts professional invite emails',
          'Onboarding Checklist Generator for new hires',
          'HR Helpdesk Bot — answers policy questions on leaves, WFH, salary',
          'Built on A2A (Agent-to-Agent) JSONRPC protocol',
          'Fully Dockerized — docker-compose up --build',
        ],
        award: 'Nasiko AI Hackathon — Team asur.ai',
        link: 'https://github.com/sundram-yadav/HARI-hrflow-ai',
      },
      {
        name: 'Election Website',
        emoji: '🗳️',
        tech: ['React', 'MongoDB', 'Google Sheets API', 'TailwindCSS'],
        description: 'Collaborative project with teammates — contributed significantly to data layer and UI.',
        highlights: [
          'Migrated entire database from JSON to MongoDB',
          'Built voting logic & candidate data pipeline from Google Sheets',
          'Added IIT Dharwad main building photo as hero background',
          'Implemented React scroll-based animations & theme system',
          'UI improvements across multiple pages',
        ],
        role: 'Contributor (private repo)',
      },
      {
        name: 'Institute Wellness App',
        emoji: '💚',
        tech: ['React', 'Node.js', 'MongoDB', 'Express', 'MERN Stack'],
        description: 'Ongoing project under senior guidance — learning full MERN stack through real contribution.',
        highlights: [
          'Improved UI significantly across multiple views',
          'Added innovative wellness tracking features',
          'Understanding MERN stack patterns under mentorship',
          'Currently ongoing — active development',
        ],
        role: 'Active Contributor (ongoing)',
      },
    ],
  },
];

export const reactions: Reaction[] = [
  {
    from: 'class8',
    to: 'class10',
    equation: 'Discipline + Time → A Certificate + 91%',
    quote: 'Two years of marching at Navodaya taught me: you don\'t rise to your goals, you fall to your systems.',
  },
  {
    from: 'class10',
    to: 'class12',
    equation: 'Curiosity + JEE Motivation → ΔH = -∞ (Exothermic)',
    quote: 'I didn\'t prepare for JEE. JEE prepared me for everything else.',
  },
  {
    from: 'class12',
    to: 'iit-entry',
    equation: 'Effort^2 + Ayodhya Pride → IIT Rank',
    quote: 'From the land of Ram, to the halls of IIT. Every city has its own kind of temple.',
  },
  {
    from: 'iit-entry',
    to: 'sem1',
    equation: 'New Environment + Hunger → CGPA 8+ + Rank 1',
    quote: 'Home was Ayodhya. Now home is wherever the code compiles.',
  },
  {
    from: 'sem1',
    to: 'sem2',
    equation: '1st Win + Confidence → ∑(Hackathons) → Growth',
    quote: 'One win doesn\'t make a career. But it makes you believe in the next one.',
  },
];
