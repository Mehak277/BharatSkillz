import { BookOpen, Hammer, Briefcase, Trophy } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const steps = [
  { n: "01", title: "Learn", desc: "Master in-demand skills with live cohorts and self-paced courses.", icon: BookOpen, tone: "bg-peach/60" },
  { n: "02", title: "Build Projects", desc: "Apply your skills on real, production-grade projects.", icon: Hammer, tone: "bg-peach/60" },
  { n: "03", title: "Internship", desc: "Get matched with paid internships at top companies.", icon: Briefcase, tone: "bg-peach/60" },
  { n: "04", title: "Get Hired", desc: "Crack interviews with mock prep and placement support.", icon: Trophy, tone: "bg-peach/60" },
];

export function HowItWorks() {
  return (
    <section className="section-y bg-secondary/40">
      <div className="container-page">
        <Reveal self>
          <SectionHeading
            eyebrow="How it works"
            title="A clear path from learner to professional"
            description="Four focused stages designed by hiring managers — so every hour you put in moves you closer to a role."
          />
        </Reveal>
        <Reveal className="relative mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {steps.map((s) => (
            <div key={s.n} data-reveal className="glass-card lift-card relative rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${s.tone}`}>
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="font-display text-3xl font-extrabold text-foreground/10">{s.n}</span>
              </div>
              <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
