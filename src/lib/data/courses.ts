import classroomCoding from "@/assets/people/classroom-coding.jpg";
import workshopWhiteboard from "@/assets/people/workshop-whiteboard.jpg";
import dataPresentation from "@/assets/people/data-presentation.jpg";
import mlDiscussion from "@/assets/people/ml-discussion.jpg";
import socTeam from "@/assets/people/soc-team.jpg";
import ideasBoard from "@/assets/people/ideas-board.jpg";
import mentor1on1 from "@/assets/people/mentor-1on1.jpg";
import cafeMentor from "@/assets/people/cafe-mentor.jpg";
import studentLaptop from "@/assets/people/student-laptop.jpg";

export const LEARN_IMAGES = {
  softwareDev: classroomCoding,
  dataAnalyst: dataPresentation,
  aiEngineers: socTeam,
  interviewPrep: mentor1on1,
  studentsLearning: studentLaptop,
  onlineClasses: workshopWhiteboard,
  teamWorkshop: ideasBoard,
  mentoring: cafeMentor,
  mlDiscussion: mlDiscussion,
};

export type Course = {
  slug: string;
  title: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  lessons: number;
  rating: number;
  students: number;
  price: number;
  originalPrice: number;
  certificate: boolean;
  tone: "mint" | "peach" | "lavender" | "gold";
  emoji: string;
  image: string;
  short: string;
  long: string;
  outcomes: string[];
  syllabus: { title: string; topics: string[] }[];
  instructor: { name: string; role: string; company: string };
};

export const COURSES: Course[] = [
  {
    slug: "full-stack-web-development",
    image: LEARN_IMAGES.softwareDev,
    title: "Full Stack Web Development",
    category: "Development",
    level: "Intermediate",
    duration: "6 months",
    lessons: 184,
    rating: 4.8,
    students: 12400,
    price: 14999,
    originalPrice: 29999,
    certificate: true,
    tone: "mint",
    emoji: "💻",
    short: "Build production-grade web apps with React, Node.js, MongoDB and deployment.",
    long: "A hands-on, project-led bootcamp covering modern frontend, backend, databases and deployment. Build a portfolio of 5 production projects and ship them to real users.",
    outcomes: [
      "Build and deploy full-stack apps end-to-end",
      "Master React, Next.js, Node.js, Express and MongoDB",
      "Crack frontend & backend interviews at top product companies",
      "Earn an industry-recognized certificate",
    ],
    syllabus: [
      { title: "Foundations", topics: ["HTML, CSS, Tailwind", "Modern JavaScript", "Git & GitHub"] },
      { title: "Frontend", topics: ["React fundamentals", "Hooks & state", "Next.js & TanStack Router"] },
      { title: "Backend", topics: ["Node.js & Express", "REST & GraphQL APIs", "Auth & sessions"] },
      { title: "Database & Deploy", topics: ["MongoDB & Postgres", "CI/CD", "AWS / Vercel deployment"] },
    ],
    instructor: { name: "Ankit Sharma", role: "Senior Engineer", company: "ex-Flipkart" },
  },
  {
    slug: "data-science-with-python",
    image: LEARN_IMAGES.dataAnalyst,
    title: "Data Science with Python",
    category: "Data",
    level: "Intermediate",
    duration: "5 months",
    lessons: 156,
    rating: 4.9,
    students: 9800,
    price: 17999,
    originalPrice: 34999,
    certificate: true,
    tone: "lavender",
    emoji: "📊",
    short: "Master Python, statistics, ML and real-world data projects with industry datasets.",
    long: "Hands-on data science program covering Python, statistics, SQL, machine learning and deployment. Work on 8+ real-world case studies and build a strong analytics portfolio.",
    outcomes: [
      "Analyze and visualize data confidently",
      "Build ML models for classification & regression",
      "Deploy models with Streamlit & FastAPI",
      "Land roles as Data Analyst / Data Scientist",
    ],
    syllabus: [
      { title: "Python & Stats", topics: ["NumPy & Pandas", "Descriptive statistics", "Hypothesis testing"] },
      { title: "Machine Learning", topics: ["Regression & classification", "Trees & ensembles", "Model evaluation"] },
      { title: "Deep Learning", topics: ["Neural networks", "TensorFlow basics", "Computer vision"] },
      { title: "Projects", topics: ["Telecom churn", "Sales forecasting", "Recommender system"] },
    ],
    instructor: { name: "Dr. Priya Menon", role: "Lead Data Scientist", company: "ex-Microsoft" },
  },
  {
    slug: "ai-ml-bootcamp",
    image: LEARN_IMAGES.mlDiscussion,
    title: "AI & Machine Learning Bootcamp",
    category: "AI",
    level: "Advanced",
    duration: "4 months",
    lessons: 124,
    rating: 4.9,
    students: 7200,
    price: 19999,
    originalPrice: 39999,
    certificate: true,
    tone: "peach",
    emoji: "🤖",
    short: "Build LLM-powered apps with Python, PyTorch, Transformers and RAG pipelines.",
    long: "An advanced AI/ML program focused on production GenAI: build chatbots, RAG systems, fine-tune models and ship LLM features end-to-end.",
    outcomes: [
      "Build LLM-powered products with RAG",
      "Fine-tune open-source models on custom data",
      "Deploy AI APIs to production",
      "Crack AI Engineer / ML Engineer interviews",
    ],
    syllabus: [
      { title: "ML Foundations", topics: ["Linear algebra refresher", "Optimization", "PyTorch basics"] },
      { title: "Deep Learning", topics: ["CNNs & RNNs", "Transformers", "Attention mechanisms"] },
      { title: "GenAI", topics: ["LLMs & prompts", "RAG with vector DBs", "Fine-tuning"] },
      { title: "Productionizing AI", topics: ["FastAPI serving", "Evals & guardrails", "Cost & latency"] },
    ],
    instructor: { name: "Rohan Verma", role: "AI Lead", company: "ex-Google" },
  },
  {
    slug: "digital-marketing-pro",
    image: LEARN_IMAGES.onlineClasses,
    title: "Digital Marketing Pro",
    category: "Marketing",
    level: "Beginner",
    duration: "3 months",
    lessons: 96,
    rating: 4.7,
    students: 15400,
    price: 9999,
    originalPrice: 19999,
    certificate: true,
    tone: "gold",
    emoji: "📈",
    short: "SEO, performance marketing, social, content and analytics — with live campaigns.",
    long: "Run real ad campaigns on Google, Meta and LinkedIn. Learn SEO, content, email and analytics with a brand-first, ROI-driven approach.",
    outcomes: [
      "Run profitable Google & Meta ad campaigns",
      "Rank pages on Google with modern SEO",
      "Build content & social funnels",
      "Get hired as a Digital Marketer / Growth Analyst",
    ],
    syllabus: [
      { title: "SEO", topics: ["On-page & technical SEO", "Keyword research", "Link building"] },
      { title: "Performance Marketing", topics: ["Google Ads", "Meta Ads", "Funnels & CRO"] },
      { title: "Content & Social", topics: ["Content calendars", "Short-form video", "Email marketing"] },
      { title: "Analytics", topics: ["GA4", "Looker Studio", "Attribution"] },
    ],
    instructor: { name: "Sneha Kapoor", role: "Growth Lead", company: "ex-Zomato" },
  },
  {
    slug: "cyber-security-essentials",
    image: LEARN_IMAGES.aiEngineers,
    title: "Cyber Security Essentials",
    category: "Security",
    level: "Intermediate",
    duration: "4 months",
    lessons: 118,
    rating: 4.8,
    students: 6300,
    price: 16999,
    originalPrice: 32999,
    certificate: true,
    tone: "mint",
    emoji: "🛡️",
    short: "Ethical hacking, network security, OWASP Top 10 and SOC analyst skills.",
    long: "A practical security program covering networks, web app pentesting, SOC operations and cloud security — with CTF-style labs.",
    outcomes: [
      "Run penetration tests on web apps",
      "Identify & remediate OWASP Top 10",
      "Operate as an SOC analyst",
      "Prepare for CEH, Security+ exams",
    ],
    syllabus: [
      { title: "Networks", topics: ["TCP/IP", "Firewalls & VPNs", "Network forensics"] },
      { title: "Web Security", topics: ["OWASP Top 10", "Burp Suite", "API security"] },
      { title: "SOC", topics: ["SIEM tools", "Incident response", "Threat hunting"] },
      { title: "Cloud Security", topics: ["AWS IAM", "Secrets management", "Compliance"] },
    ],
    instructor: { name: "Karthik Iyer", role: "Security Architect", company: "ex-Amazon" },
  },
  {
    slug: "ui-ux-design",
    image: LEARN_IMAGES.teamWorkshop,
    title: "UI / UX Product Design",
    category: "Design",
    level: "Beginner",
    duration: "3 months",
    lessons: 88,
    rating: 4.8,
    students: 8200,
    price: 11999,
    originalPrice: 22999,
    certificate: true,
    tone: "lavender",
    emoji: "🎨",
    short: "Figma, design systems, user research and a portfolio of 4 real product case studies.",
    long: "Become a product designer with hands-on Figma, design systems, prototyping and research. Build 4 case studies for your portfolio.",
    outcomes: [
      "Design and prototype real products in Figma",
      "Build & maintain a design system",
      "Run user research and usability tests",
      "Apply for UI/UX Designer roles",
    ],
    syllabus: [
      { title: "Foundations", topics: ["Visual design", "Typography & color", "Layout systems"] },
      { title: "Figma Mastery", topics: ["Components", "Auto-layout", "Variants & tokens"] },
      { title: "UX Research", topics: ["Interviews", "Usability testing", "Synthesis"] },
      { title: "Portfolio", topics: ["Case study writing", "Presentation", "Portfolio review"] },
    ],
    instructor: { name: "Meera Joshi", role: "Principal Designer", company: "ex-Swiggy" },
  },
];

export const getCourseBySlug = (slug: string) =>
  COURSES.find((c) => c.slug === slug);

export const getCourseImage = (slug: string, dbImage?: string) => {
  if (dbImage && !dbImage.includes("unsplash.com")) return dbImage;
  
  const localCourse = COURSES.find((c) => c.slug === slug);
  if (localCourse?.image) return localCourse.image;
  
  const images = Object.values(LEARN_IMAGES);
  const hash = Math.abs(slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0));
  return images[hash % images.length];
};
