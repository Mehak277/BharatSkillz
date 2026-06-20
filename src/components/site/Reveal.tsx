import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Vertical offset in px for the initial state. */
  y?: number;
  /** Stagger between children matching [data-reveal]. */
  stagger?: number;
  /** Initial delay before the animation starts. */
  delay?: number;
  /** Scroll start position (GSAP ScrollTrigger syntax). */
  start?: string;
  /** When true, animate the root element instead of looking for [data-reveal] children. */
  self?: boolean;
};

/**
 * Premium scroll-reveal wrapper powered by GSAP + ScrollTrigger.
 * - Animates once for performance
 * - Respects prefers-reduced-motion
 * - Looks for [data-reveal] descendants for staggered grids
 */
export function Reveal({
  children,
  as,
  className,
  y = 28,
  stagger = 0.08,
  delay = 0,
  start = "top 85%",
  self = false,
}: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
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

      const targets = self
        ? [el]
        : Array.from(el.querySelectorAll<HTMLElement>("[data-reveal]"));
      const nodes = targets.length ? targets : [el];

      const ctx = gsap.context(() => {
        gsap.fromTo(
          nodes,
          { y, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            delay,
            stagger,
            scrollTrigger: {
              trigger: el,
              start,
              once: true,
            },
          },
        );
      }, el);

      cleanup = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [y, stagger, delay, start, self]);

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Px shift applied across scroll. Negative = moves up faster. */
  amount?: number;
};

/** Subtle scroll parallax for featured visuals. Disabled on reduced-motion. */
export function Parallax({ children, className, amount = -60 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
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
        gsap.to(el, {
          y: amount,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }, el);

      cleanup = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [amount]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
