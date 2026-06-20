import { Link } from "@tanstack/react-router";
import { BookOpen, Briefcase, Map, Users, Award, Sparkles, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const services = [
  { title: "Courses", desc: "Industry-grade live & self-paced courses.", icon: BookOpen, tone: "bg-peach/50", to: "/courses" },
  { title: "Internships", desc: "Paid internships with top companies.", icon: Briefcase, tone: "bg-peach/50", to: "/internships" },
  { title: "Career Tracks", desc: "End-to-end roadmaps to your dream role.", icon: Map, tone: "bg-peach/50", to: "/career-tracks" },
  { title: "Mentorship", desc: "1:1 sessions with senior engineers.", icon: Users, tone: "bg-peach/50", to: "/mentors" },
  { title: "Certifications", desc: "Recognized certificates employers trust.", icon: Award, tone: "bg-peach/50", to: "/courses" },
  { title: "Placement Support", desc: "Resume, interviews & referrals.", icon: Sparkles, tone: "bg-peach/50", to: "/career-tracks" },
];

export function ServicesGrid() {
  return (
    <section className="section-y">
      <div className="container-page">
        <Reveal self>
          <SectionHeading
            eyebrow="What we offer"
            title="Everything you need to launch your career"
            description="A complete ecosystem — from learning the right skills to landing the right role."
          />
        </Reveal>
        <Reveal className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
          {services.map((s) => (
            <Link
              key={s.title}
              data-reveal
              to={s.to}
              className={`group lift-card relative overflow-hidden rounded-3xl border border-border p-7 ${s.tone}`}
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-background text-primary shadow-sm">
                <s.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              <ArrowUpRight className="absolute right-5 top-5 h-5 w-5 text-foreground/40 transition-all group-hover:right-4 group-hover:top-4 group-hover:text-foreground" />
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
