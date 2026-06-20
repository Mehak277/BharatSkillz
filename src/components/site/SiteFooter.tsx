import { Link } from "@tanstack/react-router";
import { GraduationCap, Mail, MapPin, Phone, Github, Twitter, Linkedin, Instagram } from "lucide-react";
import { SITE } from "@/lib/data/site";

const cols = [
  {
    title: "Learn",
    links: [
      { label: "All Courses", to: "/courses" },
      { label: "Career Tracks", to: "/career-tracks" },
      { label: "Blog", to: "/blog" },
    ],
  },
  {
    title: "Opportunities",
    links: [
      { label: "Internships", to: "/internships" },
      { label: "Placement Support", to: "/career-tracks" },
      { label: "Success Stories", to: "/success-stories" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", to: "/contact" },
      { label: "About", to: "/" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr_1.4fr]">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="font-display text-lg font-extrabold tracking-tight">
                {SITE.name}
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              {SITE.description}
            </p>
            <div className="mt-5 flex items-center gap-3 text-muted-foreground">
              <a href="#" aria-label="Twitter" className="grid h-9 w-9 place-items-center rounded-full bg-background hover:text-primary"><Twitter className="h-4 w-4" /></a>
              <a href="#" aria-label="LinkedIn" className="grid h-9 w-9 place-items-center rounded-full bg-background hover:text-primary"><Linkedin className="h-4 w-4" /></a>
              <a href="#" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-full bg-background hover:text-primary"><Instagram className="h-4 w-4" /></a>
              <a href="#" aria-label="GitHub" className="grid h-9 w-9 place-items-center rounded-full bg-background hover:text-primary"><Github className="h-4 w-4" /></a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {cols.map((c) => (
              <div key={c.title}>
                <h4 className="text-sm font-semibold text-foreground">{c.title}</h4>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="hover:text-foreground">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h4 className="text-sm font-semibold">Get in touch</h4>
            <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> hello@bharatskillz.com</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +91 80-4567-8900</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Bengaluru, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>Made with care for India's next generation of talent.</p>
        </div>
      </div>
    </footer>
  );
}
