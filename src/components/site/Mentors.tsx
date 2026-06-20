import { Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { MENTORS } from "@/lib/data/mentors";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import m1 from "@/assets/mentors/m1.jpg";
import m2 from "@/assets/mentors/m2.jpg";
import m3 from "@/assets/mentors/m3.jpg";
import m4 from "@/assets/mentors/m4.jpg";
import m5 from "@/assets/mentors/m5.jpg";
import m6 from "@/assets/mentors/m6.jpg";

const photos: Record<string, string> = {
  m1, m2, m3, m4, m5, m6,
};

export function Mentors() {
  return (
    <section className="section-y">
      <div className="container-page">
        <Reveal self>
          <SectionHeading
            eyebrow="Mentor network"
            title="Learn from people who've done it"
            description="Senior engineers and leaders from Google, Microsoft, Amazon, Flipkart and more — mentoring you 1:1."
          />
        </Reveal>

        <Reveal className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
          {MENTORS.map((m) => (
            <article
              key={m.id}
              data-reveal
              className="glass-card lift-card rounded-3xl p-6"
            >
              <div className="flex items-start gap-4">
                <img
                  src={photos[m.id]}
                  alt={m.name}
                  loading="lazy"
                  className="h-14 w-14 shrink-0 rounded-2xl object-cover"
                />

                <div className="min-w-0">
                  <p className="truncate font-bold">{m.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{m.role}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.company} · {m.experience}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {m.expertise.map((e) => (
                  <span key={e} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium">
                    {e}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-gold text-gold" />
                  <span className="font-semibold">{m.rating}</span>
                  <span className="text-xs text-muted-foreground">({m.sessions} sessions)</span>
                </div>
                <Button asChild size="sm" className="btn-shine"><Link to="/contact">Book Session</Link></Button>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
