import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Clock, Calendar, Share2, Loader2, Link as LinkIcon, Twitter, Linkedin, Facebook, BookOpen } from "lucide-react";
import { useBlogs } from "@/lib/firebase/blogs";
import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/resources/blog/$slug")({
  head: ({ match }) => ({
    meta: [
      { title: `${match.params.slug} — BharatSkillz` },
    ],
  }),
  component: BlogReadingPage,
});

function BlogReadingPage() {
  const { slug } = Route.useParams();
  const { blogs, loading, error } = useBlogs();
  
  const post = useMemo(() => blogs.find(b => b.slug === slug), [blogs, slug]);

  const [activeHeading, setActiveHeading] = useState("");

  // Very basic Markdown parsing for TOC (finds ## and ###)
  const headings = useMemo(() => {
    if (!post?.content) return [];
    const regex = /^(#{2,3})\s+(.+)$/gm;
    const matches = [];
    let match;
    while ((match = regex.exec(post.content)) !== null) {
      matches.push({
        level: match[1].length,
        text: match[2],
        id: match[2].toLowerCase().replace(/[^\w]+/g, '-')
      });
    }
    return matches;
  }, [post?.content]);

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (element && element.offsetTop <= scrollPosition) {
          setActiveHeading(headings[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center px-4">
        <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
        <p className="text-muted-foreground mb-8">The article you are looking for does not exist or has been removed.</p>
        <Button asChild>
          <Link to="/resources/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-background pb-20">
      {/* Header section */}
      <header className="container-page pt-16 sm:pt-20">
        <Link to="/resources/blog" className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm font-medium">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 font-bold text-primary">
              {post.category || post.tags?.[0] || "Featured"}
            </span>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium text-foreground mb-6 leading-tight tracking-tight">
            {post.title}
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed mb-10">
            {post.description}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-y border-border/60">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-muted shrink-0">
                <img 
                  src={post.authorImage || "https://ui-avatars.com/api/?name=Admin&background=random"} 
                  alt={post.authorName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-foreground text-base">{post.authorName}</p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{post.date}</span>
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 rounded-full px-5 h-10">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={copyLink} className="gap-3 cursor-pointer">
                  <LinkIcon className="h-4 w-4" /> Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-3 cursor-pointer" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=${encodeURIComponent(post.title)}`, '_blank')}>
                  <Twitter className="h-4 w-4" /> Twitter
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-3 cursor-pointer" onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}&title=${encodeURIComponent(post.title)}`, '_blank')}>
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="container-page mt-10 mb-16">
        <div className="w-full aspect-[21/9] md:aspect-[2.5/1] overflow-hidden rounded-3xl bg-muted">
          <img
            src={post.image || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=3540&auto=format&fit=crop"}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container-page">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Content */}
          <div className="flex-1 max-w-3xl">
            <div className="prose prose-lg sm:prose-xl dark:prose-invert max-w-none text-foreground/90 font-serif">
              {post.content ? (
                // Improved markdown rendering mapping
                post.content.split(/\r?\n\r?\n/).map((paragraph, idx) => {
                  const p = paragraph.trim();
                  if (!p) return null;

                  if (p.startsWith('### ')) {
                    const text = p.replace('### ', '');
                    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
                    return <h3 key={idx} id={id} className="font-sans font-bold text-2xl mt-10 mb-4 text-foreground">{text}</h3>;
                  }
                  if (p.startsWith('## ')) {
                    const text = p.replace('## ', '');
                    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
                    return <h2 key={idx} id={id} className="font-sans font-bold text-3xl mt-12 mb-6 text-foreground">{text}</h2>;
                  }
                  if (p.startsWith('- ')) {
                    const items = p.split(/\r?\n/).map(i => i.replace('- ', ''));
                    return (
                      <ul key={idx} className="list-disc pl-6 my-6 font-sans text-base sm:text-lg">
                        {items.map((item, i) => {
                          const boldRe = /\*\*(.*?)\*\*/g;
                          const parts = item.split(boldRe);
                          return (
                            <li key={i} className="mb-2">
                              {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-foreground">{part}</strong> : part)}
                            </li>
                          );
                        })}
                      </ul>
                    );
                  }
                  return (
                    <p key={idx} className="mb-6 leading-relaxed">
                      {p.split(/(\*\*.*?\*\*)/).map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={i} className="text-foreground font-semibold">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                      })}
                    </p>
                  );
                })
              ) : (
                <p className="italic opacity-70">No content available for this post.</p>
              )}
            </div>

            <div className="mt-16 pt-8 border-t border-border/60">
              <h4 className="font-sans font-bold mb-4">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {post.tags?.map(tag => (
                  <span key={tag} className="inline-block rounded-full bg-secondary px-4 py-2 text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          {headings.length > 0 && (
            <div className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-32 rounded-2xl bg-secondary/30 border border-border/50 p-6">
                <h4 className="font-sans font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> Contents
                </h4>
                <nav className="flex flex-col gap-3">
                  {headings.map((heading, idx) => (
                    <a
                      key={idx}
                      href={`#${heading.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className={`text-sm transition-colors ${
                        activeHeading === heading.id 
                          ? 'text-primary font-semibold' 
                          : 'text-muted-foreground hover:text-foreground'
                      } ${heading.level === 3 ? 'pl-4' : ''}`}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
