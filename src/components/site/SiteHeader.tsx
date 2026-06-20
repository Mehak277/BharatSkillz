import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, GraduationCap, BookOpen, BarChart3, FolderOpen, Briefcase, RefreshCw, MapPin, ChevronDown } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/data/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RESOURCE_ITEMS = [
  {
    title: "Blog",
    description: "Guides, tutorials & insights on freelancing and auto-applying.",
    href: "/resources/blog",
    icon: BookOpen,
    color: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    linkText: "Explore Blog"
  },
  {
    title: "Compare",
    description: "Head-to-head tool comparisons so you pick the right stack.",
    href: "/resources/compare",
    icon: BarChart3,
    color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
    linkText: "Explore Compare"
  },
  {
    title: "Directory",
    description: "A curated B2B sales and freelance tools directory.",
    href: "/resources/directory",
    icon: FolderOpen,
    color: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
    linkText: "Explore Directory"
  },
  {
    title: "Use Cases",
    description: "Real workflows broken down by role and industry.",
    href: "/resources/use-cases",
    icon: Briefcase,
    color: "bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400",
    linkText: "Explore Use Cases"
  },
  {
    title: "Changelog",
    description: "Latest product updates, new features, and fixes.",
    href: "/resources/changelog",
    icon: RefreshCw,
    color: "bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
    linkText: "Explore Changelog"
  },
  {
    title: "Guides",
    description: "Step-by-step how-tos for every part of AutoApply.",
    href: "/resources/guides",
    icon: MapPin,
    color: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
    linkText: "Explore Guides"
  }
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight">
            {SITE.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {/* First part of NAV_LINKS (before index 4) */}
          {NAV_LINKS.slice(0, 4).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}

          {/* Resources Dropdown Trigger */}
          <div
            className="relative"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <button className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground inline-flex items-center gap-1 cursor-pointer">
              Resources
              <ChevronDown className="h-3.5 w-3.5 opacity-55 transition-transform duration-200" style={{ transform: showDropdown ? 'rotate(180deg)' : 'none' }} />
            </button>
            {showDropdown && (
              <div className="absolute left-1/2 z-50 mt-2 w-[720px] -translate-x-1/2 rounded-3xl border border-border bg-card p-4 shadow-xl transition-all duration-200 animate-fade-in-up">
                <div className="grid grid-cols-3 gap-3">
                  {RESOURCE_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setShowDropdown(false)}
                        className="group flex flex-col justify-between rounded-2xl p-4 transition-all duration-200 hover:bg-secondary/60 border border-transparent hover:border-border/30"
                      >
                        <div>
                          <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl font-bold", item.color)}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <h4 className="mt-3 font-semibold text-sm text-foreground">{item.title}</h4>
                          <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">{item.description}</p>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-all duration-200">
                          {item.linkText}
                          <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Remaining NAV_LINKS (from index 4 onwards) */}
          {NAV_LINKS.slice(4).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link to="/auth/login">Login</Link>
          </Button>
          <Button asChild size="sm" className="shadow-sm">
            <Link to="/auth/signup">Get Started</Link>
          </Button>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-md text-foreground lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={cn(
          "border-t border-border/60 bg-background lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="container-page flex flex-col py-3 max-h-[calc(100vh-64px)] overflow-y-auto">
          {/* Main Links */}
          {NAV_LINKS.slice(0, 4).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}

          {/* Mobile Resources Sub-menu */}
          <div className="border-l-2 border-primary/20 pl-3 my-2 py-1 space-y-1">
            <p className="text-xs font-bold text-primary uppercase tracking-wider px-3 mb-1">Resources</p>
            {RESOURCE_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Remaining Links */}
          {NAV_LINKS.slice(4).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              {l.label}
            </Link>
          ))}

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/auth/login" onClick={() => setOpen(false)}>Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/auth/signup" onClick={() => setOpen(false)}>Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
