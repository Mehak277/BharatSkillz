import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ArrowLeft, BookOpen, Calendar, Clock, User } from "lucide-react";

export const Route = createFileRoute("/resources/blog")({
  head: () => ({
    meta: [
      { title: "Resources Blog — BharatSkillz" },
      { name: "description", content: "Guides, tutorials and career insights for students and tech job seekers." },
    ],
  }),
  component: ResourcesBlogPage,
});

const MOCK_POSTS = [
  {
    title: "Mastering the Tech Resume: The 1-Page Layout That Works",
    description: "Learn how recruiters review resumes, and download our proven 1-page template that has landed interviews at Google, Razorpay, and Microsoft.",
    date: "Jun 18, 2026",
    readTime: "5 min read",
    author: "Rohan Verma (Super Admin)",
    tag: "Resume Prep",
    tone: "bg-peach"
  },
  {
    title: "How to Land Your First Paid Internship as a Student",
    description: "Struggling to find internships with no prior experience? Here's our step-by-step roadmap for building portfolios and applying on AutoApply.",
    date: "Jun 12, 2026",
    readTime: "7 min read",
    author: "Aarav Patel (SDE @ Razorpay)",
    tag: "Internships",
    tone: "bg-mint"
  },
  {
    title: "Transitioning to Tech: Practical Advice for Non-CS Students",
    description: "Switching from mechanical, commerce, or other fields? Discover how Ishita transitioned to a Data Analyst role and how you can do it too.",
    date: "May 29, 2026",
    readTime: "8 min read",
    author: "Ishita Rao (Data Analyst @ Flipkart)",
    tag: "Career Switch",
    tone: "bg-lavender"
  }
];

function ResourcesBlogPage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <SectionHeading
          eyebrow="Resources"
          title="Career Blog"
          description="Guides, tutorials & insights on freelancing, applying to roles, and tech stacks."
        />

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_POSTS.map((post, idx) => (
            <article key={idx} className="glass-card lift-card rounded-3xl p-6 flex flex-col justify-between border border-border bg-card">
              <div>
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold text-primary ${post.tone}`}>
                  {post.tag}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-foreground leading-tight hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {post.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="h-3.5 w-3.5" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
