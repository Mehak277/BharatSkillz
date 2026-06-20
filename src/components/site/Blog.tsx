import { ArrowRight } from "lucide-react";
import { POSTS, type Post } from "@/lib/data/posts";
import { SectionHeading } from "./SectionHeading";

const toneBg: Record<Post["tone"], string> = {
  mint: "bg-mint",
  peach: "bg-peach",
  lavender: "bg-lavender",
  gold: "bg-gold/15",
};

export function Blog() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="From the blog"
          title="Career tips, frameworks and playbooks"
          description="Practical writing to help you learn faster and land roles you actually want."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {POSTS.map((p) => (
            <article
              key={p.slug}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(16,24,40,0.18)]"
            >
              <div className={`flex h-40 items-center justify-center ${toneBg[p.tone]}`}>
                <span className="text-5xl">{p.emoji}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-secondary px-2.5 py-1 font-semibold text-foreground">{p.category}</span>
                  <span>·</span>
                  <span>{p.readTime}</span>
                  <span>·</span>
                  <span>{p.date}</span>
                </div>
                <h3 className="mt-3 text-lg font-bold leading-snug">{p.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
                <a href="#" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2">
                  Read article <ArrowRight className="h-4 w-4 transition-all" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
