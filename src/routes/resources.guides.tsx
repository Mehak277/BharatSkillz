import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ArrowLeft, ChevronRight, BookOpen, Rocket, UserCheck, Award, Code, BarChart3 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/resources/guides")({
  head: () => ({
    meta: [
      { title: "Guides — BharatSkillz" },
      { name: "description", content: "Step-by-step how-to guides for every part of the BharatSkillz platform." },
    ],
  }),
  component: ResourcesGuidesPage,
});

interface Guide {
  title: string;
  description: string;
  steps: string[];
  duration: string;
  icon: typeof BookOpen;
  color: string;
}

const GUIDES: Guide[] = [
  {
    icon: Rocket,
    color: "bg-primary/10 text-primary",
    title: "Getting Started",
    description: "Set up your account and navigate the BharatSkillz platform in under 10 minutes.",
    duration: "10 min read",
    steps: [
      "Create your free account using email or Google Sign-In.",
      "Complete your learner profile — add skills, education, and career goals.",
      "Browse and enroll in your first course from the Courses page.",
      "Enable notifications to receive internship alerts and deadline reminders.",
      "Access your personalised Student Dashboard to track progress.",
    ],
  },
  {
    icon: BookOpen,
    color: "bg-sky-50 text-sky-600",
    title: "How to Pick the Right Course",
    description: "Choose a learning path that aligns with your career goals and current skill level.",
    duration: "7 min read",
    steps: [
      "Identify your career target — development, design, data, or marketing.",
      "Take the free Skill Assessment quiz on your dashboard.",
      "Filter courses by category, duration, and price using the Courses page.",
      "Read the curriculum outline and check instructor credentials.",
      "Enroll using our EMI or full-pay options and start learning immediately.",
    ],
  },
  {
    icon: UserCheck,
    color: "bg-emerald-50 text-emerald-600",
    title: "Applying to Internships",
    description: "A step-by-step walkthrough of the internship application pipeline.",
    duration: "8 min read",
    steps: [
      "Visit the Internships page and filter by role, location, or stipend.",
      "Read the full job description and eligibility criteria carefully.",
      "Click 'Apply Now' — your profile data pre-fills the application form.",
      "Attach your resume PDF and write a brief cover note.",
      "Track your application status in Dashboard → Internships.",
    ],
  },
  {
    icon: Code,
    color: "bg-violet-50 text-violet-600",
    title: "Building Your Developer Portfolio",
    description: "Turn your BharatSkillz projects into a compelling portfolio that impresses hiring managers.",
    duration: "12 min read",
    steps: [
      "Complete at least 2 projects from your enrolled course's capstone section.",
      "Push your code to GitHub with a well-structured README.",
      "Deploy your project using Vercel or Netlify for a live demo link.",
      "Add the live URL and GitHub link to your BharatSkillz profile.",
      "Share your portfolio in the community and get peer feedback.",
    ],
  },
  {
    icon: Award,
    color: "bg-amber-50 text-amber-600",
    title: "Earning & Sharing Certificates",
    description: "Complete a course and showcase your credential to employers.",
    duration: "5 min read",
    steps: [
      "Finish all modules and pass the final assessment with ≥70% score.",
      "Your certificate is auto-generated and added to Dashboard → Certificates.",
      "Download the PDF or click 'Share' to get a public verification link.",
      "Add the credential to your LinkedIn profile under 'Licenses & Certifications'.",
      "Paste the verification link in your resume or job applications.",
    ],
  },
  {
    icon: BarChart3,
    color: "bg-rose-50 text-rose-600",
    title: "Tracking Your Progress",
    description: "Use your student dashboard to stay accountable and hit your learning milestones.",
    duration: "6 min read",
    steps: [
      "Visit Dashboard → Progress to see an overview of all enrolled courses.",
      "Each course shows a progress bar and estimated completion date.",
      "Set weekly learning goals using the Goal Tracker widget.",
      "View your streak calendar to build consistent study habits.",
      "Review quiz scores and revisit weak topics using the Study Planner.",
    ],
  },
];

function ResourcesGuidesPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-20">
      <div className="container-page max-w-4xl">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <SectionHeading
          eyebrow="Resources"
          title="Platform Guides"
          description="Everything you need to know to get the most out of BharatSkillz — from sign-up to certificate."
        />

        <div className="mt-12 space-y-4">
          {GUIDES.map((guide, idx) => {
            const Icon = guide.icon;
            const isOpen = expanded === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-3xl border border-border bg-card overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : idx)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-secondary/30 transition-colors"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${guide.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display font-bold text-foreground">{guide.title}</h3>
                      <span className="text-[10px] font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{guide.duration}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{guide.description}</p>
                  </div>
                  <ChevronRight
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 border-t border-border animate-fade-in-up">
                    <p className="text-sm text-muted-foreground mt-4 mb-4">{guide.description}</p>
                    <ol className="space-y-3">
                      {guide.steps.map((step, jdx) => (
                        <li key={jdx} className="flex items-start gap-3">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-black">
                            {jdx + 1}
                          </span>
                          <p className="text-sm text-foreground mt-0.5">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
