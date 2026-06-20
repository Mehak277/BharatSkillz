import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Briefcase, GraduationCap, BadgeCheck, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import studentImg from "@/assets/hero/student.png";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 0%, color-mix(in oklab, var(--orange) 18%, transparent) 0%, transparent 60%), radial-gradient(50% 40% at 0% 30%, color-mix(in oklab, var(--primary) 12%, transparent) 0%, transparent 60%)",
        }}
      />
      <div className="container-page grid items-center gap-12 py-14 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:py-20">
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> New cohort starts Aug 2026
          </span>
          <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Learn Skills.{" "}
            <span className="bg-gradient-to-r from-primary to-[oklch(0.7_0.15_160)] bg-clip-text text-transparent">
              Gain Experience.
            </span>{" "}
            Build Your Career.
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
            Industry-focused courses, paid internships, expert mentorship and
            placement support — everything you need to launch a career India's
            top companies actually hire for.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="btn-shine h-12 px-6 text-base shadow-sm">
              <Link to="/courses">
                Explore Courses <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-foreground/15 bg-background px-6 text-base"
            >
              <Link to="/internships">Apply for Internship</Link>
            </Button>
          </div>

          <ul className="mt-8 grid max-w-lg grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            {[
              "1:1 mentorship from FAANG engineers",
              "Real internships with stipend",
              "Industry-recognized certificates",
              "Placement support till you're hired",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  const imgRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        if (imgRef.current) {
          gsap.to(imgRef.current, {
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: imgRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      });

      cleanup = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      {/* decorative backdrop */}
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2rem] opacity-70 blur-2xl"
        style={{ background: "var(--gradient-soft)" }}
      />
      <div
        aria-hidden
        className="absolute inset-x-6 top-10 bottom-6 -z-10 rounded-[2.5rem]"
        style={{ background: "color-mix(in oklab, var(--orange) 22%, transparent)" }}
      />
      <svg
        aria-hidden
        className="absolute -right-2 top-2 -z-10 h-12 w-16 text-orange"
        viewBox="0 0 64 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <path d="M4 16 Q16 4 28 16 T52 16" />
        <path d="M4 32 Q16 20 28 32 T52 32" />
      </svg>

      <div ref={imgRef} className="relative">
        <img
          src={studentImg}
          alt="BharatSkillz student ready for career launch"
          width={896}
          height={1152}
          className="relative z-10 mx-auto w-full max-w-[460px] select-none drop-shadow-[0_30px_50px_rgba(16,24,40,0.18)]"
          draggable={false}
        />
      </div>

      {/* Floating cards */}
      <div
        ref={card1Ref}
        className="glass-card absolute left-0 top-6 z-20 hidden items-center gap-3 rounded-2xl p-3 sm:flex"
      >
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Users className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-bold leading-none">480+</p>
          <p className="text-[11px] text-muted-foreground">Hiring Partners</p>
        </div>
      </div>

      <div
        ref={card2Ref}
        className="glass-card absolute -right-2 top-20 z-20 hidden items-center gap-3 rounded-2xl p-3 sm:flex"
      >
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint text-primary">
          <GraduationCap className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-bold leading-none">10,000+</p>
          <p className="text-[11px] text-muted-foreground">Students Trained</p>
        </div>
      </div>

      <div
        ref={card3Ref}
        className="glass-card absolute -left-2 bottom-24 z-20 hidden items-center gap-3 rounded-2xl p-3 sm:flex"
      >
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-peach text-orange">
          <Briefcase className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-bold leading-none">Paid Internship</p>
          <p className="text-[11px] text-muted-foreground">Available now</p>
        </div>
      </div>

      <div
        ref={card4Ref}
        className="glass-card absolute right-0 bottom-8 z-20 hidden items-center gap-3 rounded-2xl p-3 sm:flex"
      >
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-lavender text-primary">
          <BadgeCheck className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-bold leading-none">Placement Support</p>
          <p className="text-[11px] text-muted-foreground">Till you're hired</p>
        </div>
      </div>

      {/* Progress strip below — Learn → Experience → Hired */}
      <div className="glass-card mx-auto mt-6 flex max-w-md items-center justify-between gap-2 rounded-2xl px-4 py-3 text-[11px] font-semibold sm:absolute sm:inset-x-6 sm:bottom-[-28px] sm:mt-0">
        <Step label="Learn Skills" />
        <Arrow />
        <Step label="Get Experience" />
        <Arrow />
        <Step label="Get Hired" highlight />
      </div>
    </div>
  );
}

function Step({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <span className={highlight ? "text-primary" : "text-foreground/80"}>{label}</span>
  );
}

function Arrow() {
  return <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />;
}
