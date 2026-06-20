// Mock data for the user dashboard. Backend-ready: replace these with API calls later.

export const MOCK_USER = {
  name: "Aarav Sharma",
  email: "aarav.sharma@bharatskillz.in",
  phone: "+91 98765 43210",
  avatarInitials: "AS",
  bio: "Aspiring full-stack engineer building products that matter. Currently learning AI & ML.",
  skills: ["React", "TypeScript", "Node.js", "Python", "SQL"],
  education: "B.Tech Computer Science, IIT Roorkee (2024)",
  social: {
    linkedin: "https://linkedin.com/in/aaravsharma",
    github: "https://github.com/aaravsharma",
    twitter: "https://twitter.com/aaravsharma",
  },
  joined: "Jan 2025",
};

export type CourseProgress = {
  slug: string;
  title: string;
  instructor: string;
  thumbnail: string;
  progress: number; // 0-100
  nextLesson: string;
  totalLessons: number;
  completedLessons: number;
};

export const MOCK_ENROLLED_COURSES: CourseProgress[] = [
  {
    slug: "full-stack-web-development",
    title: "Full Stack Web Development",
    instructor: "Ankit Sharma",
    thumbnail: "🌐",
    progress: 68,
    nextLesson: "Auth & Sessions with JWT",
    totalLessons: 184,
    completedLessons: 125,
  },
  {
    slug: "ai-ml-bootcamp",
    title: "AI & Machine Learning Bootcamp",
    instructor: "Rohan Verma",
    thumbnail: "🤖",
    progress: 32,
    nextLesson: "Attention Mechanisms in Transformers",
    totalLessons: 124,
    completedLessons: 40,
  },
  {
    slug: "data-science-with-python",
    title: "Data Science with Python",
    instructor: "Dr. Priya Menon",
    thumbnail: "📊",
    progress: 100,
    nextLesson: "Course completed",
    totalLessons: 156,
    completedLessons: 156,
  },
  {
    slug: "ui-ux-design",
    title: "UI / UX Product Design",
    instructor: "Meera Joshi",
    thumbnail: "🎨",
    progress: 14,
    nextLesson: "Auto-layout Foundations",
    totalLessons: 88,
    completedLessons: 12,
  },
];

export type InternshipApplication = {
  id: string;
  role: string;
  company: string;
  status: "Applied" | "Shortlisted" | "Interview" | "Selected" | "Rejected";
  appliedOn: string;
  location: string;
  stipend: string;
};

export const MOCK_APPLIED_INTERNSHIPS: InternshipApplication[] = [
  {
    id: "a1",
    role: "Frontend Developer Intern",
    company: "Razorpay",
    status: "Interview",
    appliedOn: "May 28, 2026",
    location: "Bengaluru · Hybrid",
    stipend: "₹35,000/mo",
  },
  {
    id: "a2",
    role: "AI / ML Intern",
    company: "Microsoft",
    status: "Shortlisted",
    appliedOn: "Jun 04, 2026",
    location: "Hyderabad · Hybrid",
    stipend: "₹55,000/mo",
  },
  {
    id: "a3",
    role: "Product Design Intern",
    company: "Swiggy",
    status: "Applied",
    appliedOn: "Jun 11, 2026",
    location: "Remote",
    stipend: "₹30,000/mo",
  },
  {
    id: "a4",
    role: "Data Science Intern",
    company: "Flipkart",
    status: "Selected",
    appliedOn: "Apr 22, 2026",
    location: "Bengaluru · On-site",
    stipend: "₹40,000/mo",
  },
];

export const MOCK_CERTIFICATES = [
  {
    id: "c1",
    title: "Data Science with Python — Professional",
    issuedOn: "Mar 12, 2026",
    credentialId: "BSZ-DS-2026-00482",
    color: "from-emerald-400/30 to-teal-400/30",
  },
  {
    id: "c2",
    title: "Frontend Foundations",
    issuedOn: "Feb 02, 2026",
    credentialId: "BSZ-FE-2026-00193",
    color: "from-amber-400/30 to-orange-400/30",
  },
  {
    id: "c3",
    title: "SQL for Analysts",
    issuedOn: "Dec 18, 2025",
    credentialId: "BSZ-SQL-2025-01210",
    color: "from-sky-400/30 to-indigo-400/30",
  },
];

export const MOCK_NOTIFICATIONS = [
  { id: "n1", type: "course", title: "New module unlocked", body: "Module 7 of Full Stack is now available.", time: "2h ago", unread: true },
  { id: "n2", type: "internship", title: "Razorpay scheduled an interview", body: "Your interview is on Jun 22, 4:00 PM.", time: "5h ago", unread: true },
  { id: "n3", type: "achievement", title: "Badge earned: Consistent Learner", body: "You completed 7 days of learning in a row.", time: "1d ago", unread: false },
  { id: "n4", type: "course", title: "Mentor session reminder", body: "Live doubt session at 7 PM today.", time: "1d ago", unread: false },
  { id: "n5", type: "internship", title: "Microsoft shortlisted you", body: "You've been shortlisted for the AI/ML Intern role.", time: "3d ago", unread: false },
];

export const MOCK_ACTIVITY = [
  { id: "act1", text: "Completed lesson 'JWT Refresh Tokens' in Full Stack Web Development", time: "2h ago" },
  { id: "act2", text: "Submitted assignment for AI & ML Bootcamp", time: "Yesterday" },
  { id: "act3", text: "Earned certificate: Data Science with Python", time: "Mar 12" },
  { id: "act4", text: "Applied to Frontend Developer Intern at Razorpay", time: "Apr 18" },
];

// Weekly learning hours for the Progress chart
export const MOCK_WEEKLY_HOURS = [
  { day: "Mon", hours: 1.5 },
  { day: "Tue", hours: 2.4 },
  { day: "Wed", hours: 3.1 },
  { day: "Thu", hours: 1.8 },
  { day: "Fri", hours: 2.9 },
  { day: "Sat", hours: 4.2 },
  { day: "Sun", hours: 3.6 },
];
