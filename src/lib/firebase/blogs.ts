import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import { getFirebaseFirestore } from "./config";

export interface BlogDoc {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  readTime: string;
  tags: string[];
  image: string;
  authorName: string;
  authorImage: string;
  metaTitle: string;
  date: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

function snapToDoc(docSnap: DocumentData & { id: string }): BlogDoc {
  const d = docSnap.data();
  return {
    id: docSnap.id,
    title: d.title ?? "",
    slug: d.slug ?? "",
    description: d.description ?? "",
    content: d.content ?? "",
    category: d.category ?? "General",
    readTime: d.readTime ?? "5 min read",
    tags: Array.isArray(d.tags) ? d.tags : (d.tag ? [d.tag] : []),
    image: d.image ?? "",
    authorName: d.authorName ?? d.author ?? "BharatSkillz Editor",
    authorImage: d.authorImage ?? "https://ui-avatars.com/api/?name=Admin&background=random",
    metaTitle: d.metaTitle ?? d.title ?? "",
    date: d.date ?? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

export function useBlogs() {
  const [blogs, setBlogs] = useState<BlogDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let db: ReturnType<typeof getFirebaseFirestore>;
    try {
      db = getFirebaseFirestore();
    } catch (err) {
      setError("Firebase not configured");
      setLoading(false);
      return;
    }

    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot) => {
        const docs = snapshot.docs.map((d) =>
          snapToDoc(d as unknown as DocumentData & { id: string })
        );
        setBlogs(docs);
        setLoading(false);
      },
      (err) => {
        console.error("Blogs snapshot error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { blogs, loading, error };
}

type BlogInput = Omit<BlogDoc, "id" | "createdAt" | "updatedAt">;

export async function addBlog(data: BlogInput): Promise<string> {
  const db = getFirebaseFirestore();
  const ref = await addDoc(collection(db, "blogs"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateBlog(id: string, data: Partial<BlogInput>): Promise<void> {
  const db = getFirebaseFirestore();
  await updateDoc(doc(db, "blogs", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBlog(id: string): Promise<void> {
  const db = getFirebaseFirestore();
  await deleteDoc(doc(db, "blogs", id));
}

export async function seedBlogs() {
  const sampleBlogs: BlogInput[] = [
    {
      title: "Mastering the SDE Intern Interview: What Top Companies Look For",
      slug: "mastering-sde-intern-interview",
      description: "A comprehensive guide on cracking software engineering intern interviews at top-tier tech companies. Learn the patterns, not just the code.",
      content: "The software engineering internship interview process can seem daunting, but it follows a predictable pattern. Companies like Google, Microsoft, and Razorpay are looking for specific signals during your interview.\n\n## 1. Data Structures & Algorithms\nIt's not just about solving the problem; it's about *how* you solve it. Always start by communicating your thought process. Use the **BRUTE FORCE** approach first, then optimize.\n\n### Common Patterns to Master\n- Sliding Window\n- Two Pointers\n- Depth-First Search (DFS) & Breadth-First Search (BFS)\n- Dynamic Programming\n\n## 2. System Design (for Interns?)\nWhile full system design isn't expected, interviewers love interns who think about **edge cases**, **scalability**, and **database choices**. If you're asked to build a URL shortener, think about collisions and storage constraints.\n\n## 3. The Behavioral Round\nNever underestimate the behavioral round. Use the **STAR method** (Situation, Task, Action, Result) to structure your answers. Emphasize teamwork, conflict resolution, and a willingness to learn.\n\nCracking the SDE interview is a marathon, not a sprint. Practice consistently on platforms like LeetCode and focus on understanding the underlying patterns.",
      category: "Career Advice",
      readTime: "7 min read",
      tags: ["Interview Prep", "SDE", "Career"],
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=3540&auto=format&fit=crop",
      authorName: "Anjali Verma",
      authorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      metaTitle: "Mastering the SDE Intern Interview | BharatSkillz",
      date: "Jun 20, 2026"
    },
    {
      title: "The Ultimate Guide to React 19: Compiler and Server Components",
      slug: "ultimate-guide-react-19",
      description: "React 19 brings monumental changes to the ecosystem, focusing on performance and developer experience without manual memoization.",
      content: "React 19 has officially launched, and it completely changes the way we write React applications. By removing the need for manual performance optimizations, developers can focus on building features rather than tracking dependencies.\n\n## The React Compiler is Here\nFor years, we've relied on `useMemo` and `useCallback` to prevent unnecessary re-renders. The new React Compiler automatically optimizes your component renders under the hood. \n\n### What this means for you:\n- **Cleaner Code**: No more dependency arrays to debug.\n- **Faster Apps**: Automatic granular reactivity.\n- **Less Boilerplate**: Just write standard JavaScript functions.\n\n## Server Components (RSC) Mature\nServer components are now a stable part of the React ecosystem. They allow you to write components that run exclusively on the server, resulting in zero-bundle-size React components that fetch data securely.\n\nIf you haven't started migrating your codebase yet, now is the perfect time to explore frameworks like Next.js 15 or React Router 7 that fully support these features.",
      category: "Web Development",
      readTime: "6 min read",
      tags: ["React", "Frontend", "JavaScript"],
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=3540&auto=format&fit=crop",
      authorName: "Priya Patel",
      authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
      metaTitle: "Ultimate Guide to React 19 | BharatSkillz",
      date: "Jun 15, 2026"
    },
    {
      title: "Why Rust is Taking Over Systems Programming in 2026",
      slug: "rust-taking-over-systems-2026",
      description: "An overview of how Rust provides memory safety without garbage collection and why enterprises are rapidly adopting it.",
      content: "For decades, C and C++ ruled systems programming. Today, Rust is rapidly becoming the language of choice for critical infrastructure, cloud services, and even operating systems.\n\n## The Borrow Checker\nRust's unique ownership model and borrow checker ensure memory safety at compile time. This eliminates entire classes of bugs—like null pointer dereferences, use-after-free, and data races—that plague C/C++ applications.\n\n## Performance Without Compromise\nBecause Rust doesn't use a garbage collector, its performance is comparable to C/C++. It provides high-level ergonomic abstractions with zero cost. You get the safety of Python with the speed of C.\n\n### Industry Adoption\nFrom the Linux kernel integrating Rust code to AWS rewriting core infrastructure in it, Rust is proving that you don't have to sacrifice safety for speed. If you are a backend developer looking to level up, learning Rust should be your top priority this year.",
      category: "Programming Languages",
      readTime: "8 min read",
      tags: ["Rust", "Systems", "Performance"],
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=3540&auto=format&fit=crop",
      authorName: "Rahul Desai",
      authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
      metaTitle: "Why Rust is Taking Over Systems | BharatSkillz",
      date: "Jun 10, 2026"
    },
    {
      title: "Building Scalable APIs with Node.js and Express",
      slug: "scalable-apis-nodejs-express",
      description: "Best practices for structuring, securing, and scaling your Node.js backend applications in production.",
      content: "Node.js remains a powerhouse for backend development. However, building an API that scales to millions of users requires more than just calling `app.listen()`. Here is how to ensure your Express APIs scale beautifully.\n\n## 1. Modular Architecture\nAvoid monolithic files. Separate your routes, controllers, and services. \n- **Controllers** handle HTTP requests and responses.\n- **Services** contain your core business logic.\n- **Data Access Layer** interacts with your database.\nThis makes your codebase maintainable and highly testable.\n\n## 2. Asynchronous Error Handling\nNever let a rejected promise crash your server. Use modern `async/await` syntax wrapped in a global error handler middleware. \n\n## 3. Rate Limiting and Security\nImplement tools like `helmet` for secure HTTP headers, `cors` for safe cross-origin requests, and `express-rate-limit` to prevent brute-force attacks and abuse.\n\nBy strictly adhering to these core principles, your Node APIs will be resilient enough to handle massive traffic spikes.",
      category: "Backend",
      readTime: "6 min read",
      tags: ["Node.js", "API", "Backend"],
      image: "https://images.unsplash.com/photo-1627398246734-d08b730119ed?q=80&w=3540&auto=format&fit=crop",
      authorName: "Vikram Singh",
      authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      metaTitle: "Scalable APIs with Node.js | BharatSkillz",
      date: "Jun 05, 2026"
    },
    {
      title: "CSS Grid vs Flexbox: The Ultimate Layout Guide",
      slug: "css-grid-vs-flexbox-guide",
      description: "Stop guessing. Learn exactly when to use CSS Grid and when to use Flexbox for building responsive, modern web layouts.",
      content: "Even in 2026, the debate continues: Should I use Grid or Flexbox? The answer is simple: **you need to master both**.\n\n## Flexbox: The One-Dimensional Champion\nUse Flexbox when you have items that need to be laid out in a single row or a single column. It excels at:\n- Aligning items perfectly in the center.\n- Distributing space dynamically (using `flex-grow` and `flex-shrink`).\n- Building components like navigation bars, button groups, and card content.\n\n## CSS Grid: The Two-Dimensional Powerhouse\nUse Grid when you need to define both rows and columns simultaneously. It is the perfect tool for:\n- Overall page layouts (header, sidebar, main content, footer).\n- Complex image galleries.\n- Dashboard structures.\n\n### The Golden Rule\n**Grid is for layout (the big picture), Flexbox is for alignment (the small details).** Stop trying to force Flexbox to build complex grid systems, and stop using Grid just to center a single button.",
      category: "Design",
      readTime: "5 min read",
      tags: ["CSS", "Design", "Frontend"],
      image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=3540&auto=format&fit=crop",
      authorName: "Neha Gupta",
      authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
      metaTitle: "CSS Grid vs Flexbox | BharatSkillz",
      date: "May 28, 2026"
    },
    {
      title: "The Rise of AI-Assisted Coding: Navigating the New Normal",
      slug: "rise-of-ai-assisted-coding",
      description: "How artificial intelligence is reshaping the way developers write, test, and deploy code, and how to adapt your skills.",
      content: "Artificial Intelligence has evolved from being just a buzzword to a foundational tool in modern software development. If you aren't using an AI coding assistant today, you are working at a significant disadvantage.\n\n## The Shift in Developer Roles\nDevelopers now use AI pair programmers that can anticipate needs, write boilerplate, and suggest complex architectural patterns. This doesn't replace the developer; rather, it elevates them from a mere \"coder\" to a **system architect**.\n\n### Key Benefits of AI Assistance\n- **Speed**: Prototyping and scaffolding are exponentially faster.\n- **Quality**: AI tools catch bugs, security vulnerabilities, and edge cases before code is even committed.\n- **Learning**: Junior developers can ask their IDE for explanations of complex codebases, acting as an always-available senior mentor.\n\n## What You Need to Focus On\nSince AI can write the code, your value as an engineer shifts to **problem-solving**, **system design**, and **understanding business requirements**. Embracing AI is no longer optional—it's a requirement to stay competitive in the tech industry.",
      category: "Tech Trends",
      readTime: "6 min read",
      tags: ["AI", "Software Engineering", "Future"],
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=3465&auto=format&fit=crop",
      authorName: "Aarav Sharma",
      authorImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
      metaTitle: "AI-Assisted Coding in 2026 | BharatSkillz",
      date: "May 22, 2026"
    }
  ];

  for (const blog of sampleBlogs) {
    await addBlog(blog);
  }
}
