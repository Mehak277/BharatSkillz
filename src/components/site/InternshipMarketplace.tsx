import { Link } from "@tanstack/react-router";
import { ArrowRight, Building2, Clock, IndianRupee, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInternships } from "@/lib/firebase/internships";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

export function InternshipMarketplace() {
  const { internships: dbInternships = [], loading } = useInternships();
  const approvedInternships = dbInternships.filter(i => i.status === "Approved");

  return (
    <section className="section-y bg-secondary/40">
      <div className="container-page">
        <Reveal self>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              align="left"
              eyebrow="Internship marketplace"
              title="Real paid internships, hiring now"
              description="Curated openings from 480+ partner companies, refreshed every week."
              className="max-w-xl"
            />
            <Button asChild variant="outline" className="bg-background">
              <Link to="/internships">Browse all <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </Reveal>

        {loading ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card animate-pulse h-64 rounded-3xl bg-secondary/30" />
            ))}
          </div>
        ) : (
          <Reveal className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
            {approvedInternships.slice(0, 6).map((i) => (
              <article
                key={i.id}
              data-reveal
              className="glass-card lift-card flex flex-col rounded-3xl p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {i.logo ? (
                    <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden">
                      <img src={i.logo} alt={`${i.company} logo`} className="h-full w-full object-contain" />
                    </span>
                  ) : (
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl font-display text-sm font-bold text-white"
                      style={{ backgroundColor: i.logoColor }}
                    >
                      {i.company[0]}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{i.company}</p>
                    <p className="text-xs text-muted-foreground">{i.mode} · {i.openings} openings</p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-mint px-2.5 py-1 text-[10px] font-semibold text-primary">
                  {i.postedDays}d ago
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold">{i.role}</h3>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {i.location}</span>
                <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {i.duration}</span>
                <span className="inline-flex items-center gap-1.5"><IndianRupee className="h-3.5 w-3.5" /> {i.stipend}</span>
                <span className="inline-flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> {i.mode}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {i.skills.map((s) => (
                  <span key={s} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium">
                    {s}
                  </span>
                ))}
              </div>

              <Button asChild className="btn-shine mt-5">
                <Link to="/contact">Apply Now</Link>
              </Button>
            </article>
          ))}
        </Reveal>
        )}

        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline" className="bg-background">
            <Link to="/internships">View More <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
