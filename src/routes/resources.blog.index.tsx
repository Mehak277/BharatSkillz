import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, Loader2 } from "lucide-react";
import { useBlogs } from "@/lib/firebase/blogs";

export const Route = createFileRoute("/resources/blog/")({
  head: () => ({
    meta: [
      { title: "Featured Articles — BharatSkillz" },
      { name: "description", content: "Guides, tutorials and career insights for students and tech job seekers." },
    ],
  }),
  component: ResourcesBlogPage,
});

function ResourcesBlogPage() {
  const { blogs, loading, error } = useBlogs();

  return (
    <section className="py-16 sm:py-20 min-h-screen bg-background">
      <div className="container-page">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground mb-12 tracking-tight">
          Featured Articles
        </h1>

        {loading ? (
          <div className="mt-12 flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="mt-12 text-center text-destructive py-20">
            <p>Failed to load blogs. Please try again later.</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="mt-12 text-center text-muted-foreground py-20">
            <p>No blog posts published yet.</p>
          </div>
        ) : (
          <div className="grid gap-10 md:gap-x-8 md:gap-y-16 md:grid-cols-2">
            {blogs.map((post) => (
              <article key={post.id} className="group flex flex-col">
                <Link
                  to="/resources/blog/$slug"
                  params={{ slug: post.slug }}
                  className="relative block aspect-[16/10] overflow-hidden rounded-2xl bg-muted mb-6"
                >
                  <img
                    src={post.image || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=3540&auto=format&fit=crop"}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block rounded-full bg-background/80 backdrop-blur-sm px-3 py-1 text-[11px] font-bold text-foreground uppercase tracking-wider">
                      {post.category || post.tags?.[0] || "Featured"}
                    </span>
                  </div>
                </Link>

                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <Link to="/resources/blog/$slug" params={{ slug: post.slug }} className="block group-hover:text-primary transition-colors">
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium leading-snug mb-3">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-5 line-clamp-3">
                  {post.description}
                </p>

                <div className="mt-auto pt-4 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-muted">
                    <img 
                      src={post.authorImage || "https://ui-avatars.com/api/?name=Admin&background=random"} 
                      alt={post.authorName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground">{post.authorName}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
