export type Track = {
  slug: string;
  title: string;
  emoji: string;
  tone: "mint" | "peach" | "lavender" | "gold";
  duration: string;
  averagePackage: string;
  milestones: string[];
};

export const TRACKS: Track[] = [
  { slug: "ai-engineer", title: "AI Engineer", emoji: "🤖", tone: "mint",
    duration: "9 months", averagePackage: "₹14 LPA",
    milestones: ["Python & ML", "Deep Learning", "LLMs & RAG", "MLOps", "Capstone & Placement"] },
  { slug: "full-stack", title: "Full Stack Developer", emoji: "💻", tone: "lavender",
    duration: "8 months", averagePackage: "₹12 LPA",
    milestones: ["Web fundamentals", "React & Next.js", "Node & DB", "System design", "Capstone & Placement"] },
  { slug: "data-science", title: "Data Scientist", emoji: "📊", tone: "peach",
    duration: "8 months", averagePackage: "₹13 LPA",
    milestones: ["Python & SQL", "Statistics", "ML & DL", "Business cases", "Capstone & Placement"] },
  { slug: "cyber-security", title: "Cyber Security Analyst", emoji: "🛡️", tone: "gold",
    duration: "7 months", averagePackage: "₹11 LPA",
    milestones: ["Networking", "Web pentesting", "SOC tools", "Cloud security", "Capstone & Placement"] },
  { slug: "digital-marketing", title: "Digital Marketing Lead", emoji: "📈", tone: "mint",
    duration: "6 months", averagePackage: "₹9 LPA",
    milestones: ["SEO", "Performance Ads", "Content & Social", "Analytics", "Capstone & Placement"] },
];
