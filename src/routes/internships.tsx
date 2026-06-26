import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Clock, IndianRupee, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { useInternships } from "@/lib/firebase/internships";
import { ApplyInternshipDialog } from "@/components/site/ApplyInternshipDialog";

export const Route = createFileRoute("/internships")({
  head: () => ({
    meta: [
      { title: "Internships — BharatSkillz" },
      { name: "description", content: "Paid internships with India's top companies. Apply in minutes." },
      { property: "og:title", content: "Internships — BharatSkillz" },
      { property: "og:description", content: "Curated paid internship openings, refreshed weekly." },
      { property: "og:url", content: "/internships" },
    ],
    links: [{ rel: "canonical", href: "/internships" }],
  }),
  component: InternshipsPage,
});

function InternshipsPage() {
  const { internships: dbInternships = [], loading } = useInternships();

  const approvedInternships = dbInternships.filter((i) => i.status === "Approved");

  return (
    <>
      <section className="py-14 sm:py-16">
        <div className="container-page">
          <SectionHeading
            eyebrow="Internship marketplace"
            title="Find your next paid internship"
            description="Hand-curated openings from 480+ partner companies across India."
          />
        </div>
      </section>

      <section className="pb-20">
        <div className="container-page">
          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card animate-pulse h-64 rounded-3xl bg-secondary/30" />
              ))}
            </div>
          ) : (
            <Reveal className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
              {approvedInternships.map((i) => (
                <article
                  key={i.id}
                  data-reveal
                  className="glass-card lift-card flex flex-col rounded-3xl p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {(i as any).logo ? (
                        <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden">
                          <img src={(i as any).logo} alt={`${i.company} logo`} className="h-full w-full object-contain" />
                        </span>
                      ) : (
                        <span
                          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl font-display text-sm font-bold text-white"
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

                  <ApplyInternshipDialog
                    internship={i}
                    trigger={
                      <Button className="btn-shine mt-5 w-full">
                        Apply Now
                      </Button>
                    }
                  />
                </article>
              ))}
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
