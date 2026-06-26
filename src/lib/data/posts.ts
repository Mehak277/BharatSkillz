import resumeAnalysisImg from "@/assets/people/resume-analysis.jpg";
import careerCollageImg from "@/assets/people/career-collage.jpg";
import mlDiscussionImg from "@/assets/people/ml-discussion.jpg";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  tone: "mint" | "peach" | "lavender" | "gold";
  image: string;
};

export const POSTS: Post[] = [
  { slug: "land-first-internship-2026", title: "How to Land Your First Tech Internship in 2026",
    excerpt: "A practical playbook on portfolios, outreach and interviews to land your first paid internship.",
    category: "Career", readTime: "6 min", date: "Jun 10, 2026", tone: "mint", image: careerCollageImg },
  { slug: "ai-skills-in-demand", title: "5 AI Skills Every Engineer Should Learn This Year",
    excerpt: "From prompt engineering to RAG and fine-tuning — the AI skills hiring managers actually look for.",
    category: "AI", readTime: "8 min", date: "Jun 06, 2026", tone: "peach", image: mlDiscussionImg },
  { slug: "resume-that-gets-shortlisted", title: "Writing a Resume That Gets Shortlisted",
    excerpt: "The 1-page resume template our students use to get 3x more callbacks. Free download inside.",
    category: "Placement", readTime: "5 min", date: "Jun 01, 2026", tone: "lavender", image: resumeAnalysisImg },
];
