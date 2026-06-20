import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";

export function FinalCTA() {
  return (
    <section className="section-y">
      <div className="container-page">
        <Reveal self>
          <div
            className="relative overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:px-12 sm:py-20"
            style={{ background: "var(--gradient-primary)" }}
          >
            <div aria-hidden className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div aria-hidden className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-orange/30 blur-3xl" />

            <span className="relative inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
              Limited cohort seats
            </span>
            <h2 className="relative mt-4 text-balance font-display text-3xl font-extrabold text-white sm:text-5xl">
              Start your career journey today
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-pretty text-white/85 sm:text-lg">
              Join 50,000+ students learning the skills India's top companies hire for.
              Get started in under 2 minutes.
            </p>

            <div className="relative mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="btn-shine h-12 bg-white px-6 text-primary hover:bg-white/90">
                <Link to="/auth/signup">
                  Create free account <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-white/40 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/courses">Browse courses</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
