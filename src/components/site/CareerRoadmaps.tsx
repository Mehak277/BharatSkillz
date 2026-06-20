import { ArrowRight, BarChart3, Brain, CheckCircle2, Code2, Megaphone, ShieldCheck, type LucideIcon } from "lucide-react";
import { TRACKS, type Track } from "@/lib/data/tracks";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";

const toneBg: Record<Track["tone"], string> = {
  mint: "bg-peach/50",
  peach: "bg-peach/50",
  lavender: "bg-peach/50",
  gold: "bg-peach/50",
};

const toneIconColor: Record<Track["tone"], string> = {
  mint: "text-primary",
  peach: "text-orange",
  lavender: "text-orange",
  gold: "text-gold-foreground",
};

const trackIcon: Record<string, LucideIcon> = {
  "ai-engineer": Brain,
  "full-stack": Code2,
  "data-science": BarChart3,
  "cyber-security": ShieldCheck,
  "digital-marketing": Megaphone,
};

export function CareerRoadmaps() {
  return (
    <section className="section-y">
      <div className="container-page">
        <Reveal self>
          <SectionHeading
            eyebrow="Career roadmaps"
            title="A clear path to the role you want"
            description="Curated, end-to-end tracks built around what top companies actually hire for."
          />
        </Reveal>

        <Reveal className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {TRACKS.map((t) => {
            const Icon = trackIcon[t.slug] ?? Brain;
            return (
              <article
                key={t.slug}
                data-reveal
                className={`group lift-card relative overflow-hidden rounded-3xl border border-border p-6 ${toneBg[t.tone]}`}
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-background shadow-sm ring-1 ring-border">
                    <Icon className={`h-6 w-6 ${toneIconColor[t.tone]}`} strokeWidth={1.75} />
                  </span>
                  <span className="rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
                    Avg {t.averagePackage}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold">{t.title}</h3>
                <p className="text-sm text-muted-foreground">{t.duration} program</p>

                <ul className="mt-4 space-y-2">
                  {t.milestones.map((m) => (
                    <li key={m} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>

                <Button asChild variant="outline" className="mt-5 bg-background">
                  <Link to="/career-tracks/$slug" params={{ slug: t.slug }}>
                    View roadmap <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
