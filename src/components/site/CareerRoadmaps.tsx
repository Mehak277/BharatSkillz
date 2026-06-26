import { ArrowRight, BarChart3, Brain, CheckCircle2, Code2, Megaphone, ShieldCheck, type LucideIcon } from "lucide-react";
import { TRACKS, type Track } from "@/lib/data/tracks";
import { SectionHeading } from "./SectionHeading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Reveal } from "./Reveal";
import { DETAILED_ROADMAPS, type DetailedRoadmap } from "@/lib/data/roadmaps";
import { TrackEnrollDialog } from "./TrackEnrollDialog";

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

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="mt-5 bg-background">
                      View roadmap <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl bg-background border border-border">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">{t.title} Roadmap</DialogTitle>
                    </DialogHeader>
                    {DETAILED_ROADMAPS[t.slug] ? (
                      <DetailedRoadmapView roadmap={DETAILED_ROADMAPS[t.slug]} track={t} />
                    ) : (
                      <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
                        <p className="text-muted-foreground text-sm mb-6">A step-by-step path from fundamentals to your first role.</p>
                        <ol className="space-y-4">
                          {t.milestones.map((m, i) => (
                            <li key={m} className="glass-card flex items-start gap-4 rounded-2xl p-4 border border-border bg-secondary/20">
                              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 font-display text-sm font-bold text-primary">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <div className="min-w-0 mt-0.5">
                                <p className="font-semibold text-foreground text-sm">{m}</p>
                                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Hands-on projects & assessments
                                </p>
                              </div>
                            </li>
                          ))}
                        </ol>
                        <div className="mt-8 pt-6 border-t border-border">
                          <TrackEnrollDialog
                            track={t}
                            trigger={<Button className="w-full text-base h-12 btn-shine">Enroll Now</Button>}
                          />
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}

function DetailedRoadmapView({ roadmap, track }: { roadmap: DetailedRoadmap; track: Track }) {
  return (
    <div className="mt-4 max-h-[70vh] overflow-y-auto pr-4 space-y-8">
      <div>
        <p className="text-muted-foreground text-sm mb-6">
          {roadmap.description}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-card rounded-xl p-3 border border-border">
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="font-semibold text-sm">{roadmap.duration}</p>
          </div>
          <div className="glass-card rounded-xl p-3 border border-border">
            <p className="text-xs text-muted-foreground">Avg Salary</p>
            <p className="font-semibold text-sm">{roadmap.avgSalary}</p>
          </div>
          <div className="glass-card rounded-xl p-3 border border-border md:col-span-2">
            <p className="text-xs text-muted-foreground">Prerequisites</p>
            <p className="font-semibold text-sm">{roadmap.prerequisites}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="text-lg font-bold flex items-center gap-2">What You'll Learn</h4>
        <div className="relative border-l-2 border-border/60 ml-3 pl-6 space-y-8">
          {roadmap.phases.map((p, i) => (
            <div key={i} className="relative">
              <span className="absolute -left-[35px] top-1 grid h-7 w-7 place-items-center rounded-full bg-primary/10 font-bold text-xs text-primary ring-4 ring-background">
                {i + 1}
              </span>
              <h5 className="font-bold text-base text-foreground">{p.title} <span className="text-muted-foreground font-normal text-xs ml-2">({p.duration})</span></h5>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {p.topics.map(t => (
                  <span key={t} className="bg-secondary/50 text-secondary-foreground px-2 py-1 rounded-md text-xs">{t}</span>
                ))}
              </div>
              
              {p.tools && (
                <p className="mt-3 text-xs text-muted-foreground">
                  <strong className="text-foreground">Tools:</strong> {p.tools.join(", ")}
                </p>
              )}
              
              <div className="mt-3 bg-primary/5 border border-primary/20 rounded-xl p-3">
                <p className="text-xs text-primary font-semibold">Project: {p.project}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-bold">Career Opportunities</h4>
        <div className="flex flex-wrap gap-2">
          {roadmap.careerOpportunities.map(role => (
            <span key={role} className="bg-mint text-primary px-3 py-1.5 rounded-full text-xs font-semibold">{role}</span>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-lg font-bold">Placement Support</h4>
        <ul className="grid grid-cols-2 gap-2">
          {["✅ Resume Building", "✅ LinkedIn Optimization", "✅ Mock Interviews", "✅ Aptitude Preparation", "✅ HR Interview Training", "✅ Job Referrals"].map(support => (
            <li key={support} className="text-sm text-muted-foreground">{support}</li>
          ))}
        </ul>
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <TrackEnrollDialog
          track={track}
          trigger={<Button className="w-full text-base h-12 btn-shine">Enroll Now</Button>}
        />
      </div>
    </div>
  );
}
