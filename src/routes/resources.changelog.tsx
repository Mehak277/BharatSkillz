import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ArrowLeft, Sparkles, Wrench, ShieldCheck, Zap } from "lucide-react";

export const Route = createFileRoute("/resources/changelog")({
  head: () => ({
    meta: [
      { title: "Changelog — BharatSkillz" },
      { name: "description", content: "Stay up to date with the latest BharatSkillz platform updates, features, and bug fixes." },
    ],
  }),
  component: ResourcesChangelogPage,
});

type ChangeType = "feature" | "improvement" | "fix" | "security";

interface Change {
  type: ChangeType;
  text: string;
}

interface Release {
  version: string;
  date: string;
  headline: string;
  changes: Change[];
}

const RELEASES: Release[] = [
  {
    version: "v2.6.0",
    date: "June 18, 2026",
    headline: "Google Sign-In & Marquee Reviews",
    changes: [
      { type: "feature", text: "Added Google OAuth 2.0 sign-in on login and signup pages" },
      { type: "feature", text: "New 3-column animated vertical marquee in Success Stories section" },
      { type: "feature", text: "Resources mega-menu added to site header with 6 sub-pages" },
      { type: "improvement", text: "Admin dashboard redesigned with light theme matching site" },
      { type: "fix", text: "Fixed passkey prompt appearing during Google sign-in flow" },
    ],
  },
  {
    version: "v2.5.0",
    date: "May 30, 2026",
    headline: "Admin Console & Internship Manager",
    changes: [
      { type: "feature", text: "Full admin dashboard with Users, Courses, Internships, and Applications tabs" },
      { type: "feature", text: "Internship approval workflow with one-click Approve / Reject" },
      { type: "feature", text: "Application pipeline status manager per student" },
      { type: "improvement", text: "Recharts-powered area chart for student growth trends" },
      { type: "fix", text: "LocalStorage persistence for admin state across sessions" },
    ],
  },
  {
    version: "v2.4.0",
    date: "May 12, 2026",
    headline: "Course Detail & Enroll Flow",
    changes: [
      { type: "feature", text: "Full-page course detail with curriculum accordion and instructor profile" },
      { type: "feature", text: "Enroll dialog with Razorpay mock integration" },
      { type: "improvement", text: "Responsive mobile layouts for course cards and sections" },
      { type: "fix", text: "Rating star display clipping on Safari" },
    ],
  },
  {
    version: "v2.3.0",
    date: "April 22, 2026",
    headline: "Internship Marketplace Launch",
    changes: [
      { type: "feature", text: "Live internship listings with stipend, location, and openings filters" },
      { type: "feature", text: "One-click apply flow with pre-filled profile data" },
      { type: "security", text: "Added CSRF token validation on application submissions" },
      { type: "fix", text: "Fixed duplicate toast notifications on form submit" },
    ],
  },
  {
    version: "v2.2.0",
    date: "April 05, 2026",
    headline: "Student Dashboard & Progress Tracking",
    changes: [
      { type: "feature", text: "Personalised student dashboard with course progress indicators" },
      { type: "feature", text: "Certificate module with download and share options" },
      { type: "improvement", text: "Profile page with editable bio, skills, and social links" },
      { type: "fix", text: "Fixed avatar upload not persisting after page refresh" },
    ],
  },
  {
    version: "v2.1.0",
    date: "March 20, 2026",
    headline: "Dark Mode & Accessibility Pass",
    changes: [
      { type: "improvement", text: "Full dark / light mode toggle with system preference detection" },
      { type: "improvement", text: "WCAG AA colour contrast across all UI components" },
      { type: "improvement", text: "Keyboard navigation improvements on modals and dropdowns" },
      { type: "fix", text: "Focus rings restored on interactive elements" },
    ],
  },
];

const TYPE_CONFIG: Record<ChangeType, { label: string; Icon: typeof Sparkles; cls: string }> = {
  feature:     { label: "Feature",     Icon: Sparkles,    cls: "bg-primary/10 text-primary border-primary/20" },
  improvement: { label: "Improved",    Icon: Zap,         cls: "bg-amber-50 text-amber-600 border-amber-200" },
  fix:         { label: "Fix",         Icon: Wrench,       cls: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  security:    { label: "Security",    Icon: ShieldCheck,  cls: "bg-rose-50 text-rose-600 border-rose-200" },
};

function ResourcesChangelogPage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page max-w-3xl">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <SectionHeading
          eyebrow="Resources"
          title="Changelog"
          description="A running log of every feature, improvement, and fix shipped to BharatSkillz."
        />

        <div className="mt-12 space-y-10">
          {RELEASES.map((release, idx) => (
            <div key={idx} className="relative pl-6 border-l-2 border-border">
              {/* Timeline dot */}
              <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary border-2 border-background shadow" />

              <div className="glass-card rounded-3xl border border-border bg-card p-6">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="font-mono text-xs font-black bg-primary text-primary-foreground rounded-full px-2.5 py-0.5">{release.version}</span>
                  <span className="text-xs text-muted-foreground">{release.date}</span>
                </div>
                <h3 className="font-display font-black text-lg text-foreground mb-4">{release.headline}</h3>

                <div className="space-y-2.5">
                  {release.changes.map((change, jdx) => {
                    const { label, Icon, cls } = TYPE_CONFIG[change.type];
                    return (
                      <div key={jdx} className="flex items-start gap-3">
                        <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${cls}`}>
                          <Icon className="h-3 w-3" />
                          {label}
                        </span>
                        <p className="text-sm text-muted-foreground mt-0.5">{change.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
