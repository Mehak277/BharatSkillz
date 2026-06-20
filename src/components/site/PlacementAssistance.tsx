import { FileText, MessagesSquare, Linkedin, Compass, Handshake } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

const items = [
  { title: "Resume Building", desc: "1:1 reviews and a proven 1-page template recruiters love.", icon: FileText, tone: "bg-peach/50" },
  { title: "Mock Interviews", desc: "Realistic interviews with engineers from product companies.", icon: MessagesSquare, tone: "bg-peach/50" },
  { title: "LinkedIn Optimization", desc: "Profile rewrite to attract recruiters on autopilot.", icon: Linkedin, tone: "bg-peach/50" },
  { title: "Career Guidance", desc: "Personal plan with milestones, salary benchmarks and timeline.", icon: Compass, tone: "bg-peach/50" },
  { title: "Job Referrals", desc: "Curated referrals into our 480+ hiring partner network.", icon: Handshake, tone: "bg-peach/50" },
];

export function PlacementAssistance() {
  return (
    <section className="section-y bg-secondary/40">
      <div className="container-page">
        <Reveal self>
          <SectionHeading
            eyebrow="Placement assistance"
            title="We're with you till you're hired"
            description="A dedicated placement team, not a chatbot — working with you on every step of the job hunt."
          />
        </Reveal>

        <Reveal className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
          {items.map((it) => (
            <div key={it.title} data-reveal className="glass-card lift-card rounded-3xl p-6">
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${it.tone}`}>
                <it.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{it.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{it.desc}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
