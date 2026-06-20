import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ArrowLeft, Check, X, ShieldAlert } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/resources/compare")({
  head: () => ({
    meta: [
      { title: "Platform Comparison — BharatSkillz" },
      { name: "description", content: "Compare BharatSkillz with traditional bootcamps and self-study paths." },
    ],
  }),
  component: ResourcesComparePage,
});

const FEATURES = [
  {
    name: "Tuition Cost",
    selfStudy: "Free (or low-cost courses)",
    bootcamp: "₹1.5 Lakhs - ₹3 Lakhs",
    bharatSkillz: "₹11,999 - ₹19,999 (No hidden charges)"
  },
  {
    name: "Paid Internships",
    selfStudy: "No internship assurance",
    bootcamp: "Rarely guaranteed / unpaid projects",
    bharatSkillz: "Assured paid internships (stipend ₹15k-55k/mo)",
    highlight: true
  },
  {
    name: "1:1 Mentorship",
    selfStudy: "Self-driven search",
    bootcamp: "Group doubt sessions",
    bharatSkillz: "1:1 mentorship from FAANG / Top SDEs",
    highlight: true
  },
  {
    name: "Job Placement",
    selfStudy: "Rely on cold applications",
    bootcamp: "Job portals and resume reviews",
    bharatSkillz: "Direct referrals and placement cell"
  },
  {
    name: "Project Work",
    selfStudy: "Solo tutorial clones",
    bootcamp: "Group capstones",
    bharatSkillz: "Real client / production-grade products"
  },
  {
    name: "Flexible Schedule",
    selfStudy: "Yes (self-paced)",
    bootcamp: "Strict cohort timelines",
    bharatSkillz: "Hybrid (self-paced lectures + live reviews)"
  }
];

function ResourcesComparePage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <SectionHeading
          eyebrow="Resources"
          title="Compare Platforms"
          description="Head-to-head program comparisons so you choose the right path for your career stack."
        />

        <div className="mt-12 rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-secondary/40 border-b border-border">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-foreground py-5 text-sm md:text-base">Feature / Program</TableHead>
                <TableHead className="font-semibold text-muted-foreground text-sm">Self-Study</TableHead>
                <TableHead className="font-semibold text-muted-foreground text-sm">Traditional Bootcamps</TableHead>
                <TableHead className="font-semibold text-primary font-bold text-sm md:text-base bg-primary/5">BharatSkillz</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {FEATURES.map((feature, idx) => (
                <TableRow key={idx} className="border-b border-border/60 hover:bg-secondary/20 transition-colors">
                  <TableCell className="font-semibold text-foreground py-4 text-xs md:text-sm">
                    {feature.name}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{feature.selfStudy}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{feature.bootcamp}</TableCell>
                  <TableCell className={`text-xs font-semibold text-foreground bg-primary/5 ${feature.highlight ? "text-primary font-bold" : ""}`}>
                    {feature.bharatSkillz}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-8 rounded-3xl bg-mint/50 p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-primary/10">
          <div>
            <h3 className="text-sm font-bold text-foreground">Ready to start your journey with India's best stack?</h3>
            <p className="text-xs text-muted-foreground mt-1">Get FAANG mentors, paid internships, and active referrals.</p>
          </div>
          <Link to="/auth/signup" className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-sm">
            Join BharatSkillz
          </Link>
        </div>
      </div>
    </section>
  );
}
