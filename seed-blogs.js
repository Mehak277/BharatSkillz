import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import * as dotenv from 'dotenv';
dotenv.config();

const config = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(config);
const db = getFirestore(app);

const demoBlogs = [
  {
    title: "How to Land Your First Tech Internship in 2026",
    slug: "land-first-tech-internship-2026",
    description: "A comprehensive guide to preparing your resume, building a portfolio, and acing the technical interview for your first software engineering internship.",
    content: "## The Changing Landscape of Tech Hiring\n\nGetting a tech internship in 2024 is different from just a few years ago. Companies are looking for hands-on experience, demonstrated through projects, rather than just theoretical knowledge.\n\n### Build a Standout Portfolio\n\nYour portfolio is your most important asset. Include at least three solid projects that solve real problems. Don't just build another to-do list app; build something that you actually use.\n\n- Deploy your projects so they are live\n- Write clear READMEs for your GitHub repositories\n- Include links to the live demos on your resume\n\n### Tailor Your Resume\n\nKeep your resume to one page. Highlight your technical skills, projects, and any relevant coursework. Use strong action verbs and quantify your achievements where possible.\n\n## Acing the Interview\n\nPrepare for both behavioral and technical questions. Practice algorithmic problems, but also be ready to discuss your projects in depth. Understand the trade-offs you made and what you would do differently.",
    category: "Career Guide",
    readTime: "6 min read",
    tags: ["Internship", "Career", "Tech"],
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
    authorName: "Priya Sharma",
    authorImage: "https://ui-avatars.com/api/?name=Priya+Sharma&background=random",
    metaTitle: "How to Land Your First Tech Internship in 2024",
    date: "Jun 15, 2024",
  },
  {
    title: "Mastering React in 30 Days: A Roadmap",
    slug: "mastering-react-30-days",
    description: "Follow this structured 30-day roadmap to go from a React beginner to building complex, state-driven web applications.",
    content: "## Why React?\n\nReact continues to be the dominant frontend library in the industry. Its component-based architecture makes it easy to build reusable UI elements.\n\n### Week 1: The Basics\n\nFocus on understanding components, JSX, and props. Build simple static components to get comfortable with the syntax.\n\n- Learn JSX syntax and how it differs from HTML\n- Understand how to pass data via props\n- Build a simple static profile card component\n\n### Week 2: State and Hooks\n\nDive into `useState` and `useEffect`. State is how your application remembers information, and effects let you synchronize with external systems.\n\n- Master the useState hook for local component state\n- Learn how to fetch data using useEffect\n- Build a counter and a simple to-do list\n\n## Building Real Projects\n\nThe best way to learn is by doing. In the final two weeks, focus on building at least two complete applications, such as a weather dashboard and an e-commerce product page.",
    category: "Tutorial",
    readTime: "8 min read",
    tags: ["React", "Web Dev", "Roadmap"],
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80",
    authorName: "Rahul Verma",
    authorImage: "https://ui-avatars.com/api/?name=Rahul+Verma&background=random",
    metaTitle: "Mastering React in 30 Days",
    date: "Jun 20, 2026",
  }
];

async function seed() {
  for (const blog of demoBlogs) {
    try {
      await addDoc(collection(db, "blogs"), {
        ...blog,
        createdAt: serverTimestamp(),
      });
      console.log("Added blog:", blog.title);
    } catch (e) {
      console.error("Error adding blog:", e);
    }
  }
  process.exit(0);
}

seed();
