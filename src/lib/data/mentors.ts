export type Mentor = {
  id: string;
  name: string;
  role: string;
  company: string;
  experience: string;
  expertise: string[];
  rating: number;
  sessions: number;
  initials: string;
  tone: "mint" | "peach" | "lavender" | "gold";
};

export const MENTORS: Mentor[] = [
  { id: "m1", name: "Ankit Sharma", role: "Senior Software Engineer", company: "Flipkart",
    experience: "8 yrs", expertise: ["React", "System Design", "DSA"], rating: 4.9, sessions: 320,
    initials: "AS", tone: "mint" },
  { id: "m2", name: "Dr. Priya Menon", role: "Lead Data Scientist", company: "Microsoft",
    experience: "11 yrs", expertise: ["ML", "Python", "Analytics"], rating: 4.9, sessions: 280,
    initials: "PM", tone: "lavender" },
  { id: "m3", name: "Rohan Verma", role: "AI Engineering Lead", company: "Google",
    experience: "9 yrs", expertise: ["LLMs", "PyTorch", "MLOps"], rating: 5.0, sessions: 410,
    initials: "RV", tone: "peach" },
  { id: "m4", name: "Sneha Kapoor", role: "Growth Lead", company: "Zomato",
    experience: "7 yrs", expertise: ["SEO", "Performance", "Content"], rating: 4.8, sessions: 220,
    initials: "SK", tone: "gold" },
  { id: "m5", name: "Karthik Iyer", role: "Security Architect", company: "Amazon",
    experience: "10 yrs", expertise: ["AppSec", "Cloud", "SOC"], rating: 4.9, sessions: 190,
    initials: "KI", tone: "mint" },
  { id: "m6", name: "Meera Joshi", role: "Principal Designer", company: "Swiggy",
    experience: "8 yrs", expertise: ["Figma", "Design Systems", "UX Research"], rating: 4.9, sessions: 260,
    initials: "MJ", tone: "lavender" },
];
