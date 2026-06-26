import { Quote, TrendingUp } from "lucide-react";
import { TESTIMONIALS, type Testimonial } from "@/lib/data/testimonials";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import aarav from "@/assets/students/aarav.jpg";
import ishita from "@/assets/students/ishita.jpg";
import mohit from "@/assets/students/mohit.jpg";
import neha from "@/assets/students/neha.jpg";
import m1 from "@/assets/mentors/m1.jpg";
import m2 from "@/assets/mentors/m2.jpg";
import m3 from "@/assets/mentors/m3.jpg";
import m4 from "@/assets/mentors/m4.jpg";
import m5 from "@/assets/mentors/m5.jpg";

const toneBg: Record<Testimonial["tone"], string> = {
  mint: "bg-mint",
  peach: "bg-peach",
  lavender: "bg-lavender",
  gold: "bg-gold/15",
};

const photos: Record<string, string> = {
  t1: aarav,
  t2: ishita,
  t3: mohit,
  t4: neha,
  t5: m1,
  t6: m2,
  t7: m3,
  t8: m4,
  t9: m5,
};

function MarqueeColumn({
  testimonials,
  direction = "up",
  speed = "30s",
}: {
  testimonials: Testimonial[];
  direction?: "up" | "down";
  speed?: string;
}) {
  // Triple the items to ensure the scrolling loop is seamless and smooth
  const items = [...testimonials, ...testimonials, ...testimonials];

  return (
    <div className="relative h-[650px] overflow-hidden py-2 select-none">
      <div
        className={`flex flex-col gap-6 pause-on-hover ${
          direction === "up" ? "animate-marquee-up" : "animate-marquee-down"
        }`}
        style={{ animationDuration: speed }}
      >
        {items.map((t, idx) => (
          <article
            key={`${t.id}-${idx}`}
            className="glass-card lift-card rounded-3xl p-6 flex flex-col justify-between shrink-0"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {photos[t.id] ? (
                    <img
                      src={photos[t.id]}
                      alt={t.name}
                      loading="lazy"
                      className={`h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-background ${toneBg[t.tone]}`}
                    />
                  ) : (
                    <div
                      className={`h-12 w-12 shrink-0 rounded-full flex items-center justify-center font-bold text-sm ring-2 ring-background ${toneBg[t.tone]} text-foreground/80`}
                    >
                      {t.initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-sm md:text-base">{t.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {t.beforeRole} → {t.afterRole} @ {t.company}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {t.package}
                </span>
              </div>

              <div className="mt-5 flex items-start gap-3">
                <Quote className="mt-1 h-5 w-5 shrink-0 text-primary/40" />
                <p className="text-sm leading-relaxed text-foreground/85">{t.quote}</p>
              </div>
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-mint px-2.5 py-1 text-[11px] font-semibold text-primary w-fit">
              <TrendingUp className="h-3 w-3" /> Career growth · {t.afterRole}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function SuccessStories() {
  const col1 = [TESTIMONIALS[0], TESTIMONIALS[1], TESTIMONIALS[2]];
  const col2 = [TESTIMONIALS[3], TESTIMONIALS[4], TESTIMONIALS[5]];
  const col3 = [TESTIMONIALS[6], TESTIMONIALS[7], TESTIMONIALS[8]];

  return (
    <section className="section-y bg-secondary/40 overflow-hidden">
      <div className="container-page">
        <Reveal self>
          <SectionHeading
            eyebrow="Success stories"
            title="Real students. Real outcomes."
            description="From first internship to dream role — here's what our students achieved."
          />
        </Reveal>

        <div
          className="relative mt-12 grid h-[650px] grid-cols-1 gap-6 overflow-hidden rounded-3xl md:grid-cols-2 lg:grid-cols-3 px-4"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)'
          }}
        >
          {/* Column 1: Up */}
          <div className="h-full">
            <MarqueeColumn testimonials={col1} direction="up" speed="25s" />
          </div>

          {/* Column 2: Down */}
          <div className="hidden h-full md:block">
            <MarqueeColumn testimonials={col2} direction="down" speed="28s" />
          </div>

          {/* Column 3: Up */}
          <div className="hidden h-full lg:block">
            <MarqueeColumn testimonials={col3} direction="up" speed="32s" />
          </div>
        </div>
      </div>
    </section>
  );
}
