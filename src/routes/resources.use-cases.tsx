import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ArrowLeft, Users, Code2, ShoppingCart, Megaphone, HeartPulse, Truck } from "lucide-react";

export const Route = createFileRoute("/resources/use-cases")({
  head: () => ({
    meta: [
      { title: "Use Cases — BharatSkillz" },
      { name: "description", content: "Discover real-world workflows for freelancers, developers, marketers and more." },
    ],
  }),
  component: ResourcesUseCasesPage,
});

const USE_CASES = [
  {
    icon: Code2,
    color: "bg-blue-50 text-blue-600",
    role: "Software Developer",
    scenario: "Full-Stack Freelancer",
    description: "Learn how Rahul, a self-taught developer from Jaipur, landed 3 international clients in 60 days by building a portfolio site, optimising his Upwork profile, and auto-applying to 40+ listings weekly.",
    outcomes: ["₹1.4L/mo revenue", "3 long-term clients", "Upwork Top Rated Plus"],
    tags: ["React", "Node.js", "Freelancing"],
  },
  {
    icon: Megaphone,
    color: "bg-pink-50 text-pink-600",
    role: "Digital Marketer",
    scenario: "Agency Growth Manager",
    description: "Priya runs a boutique social media agency in Mumbai. She used BharatSkillz to upskill her team on performance marketing, cutting CAC by 42% and doubling her retainer count within a quarter.",
    outcomes: ["CAC ↓ 42%", "8 retainer clients", "4x ROAS"],
    tags: ["Meta Ads", "SEO", "Analytics"],
  },
  {
    icon: ShoppingCart,
    color: "bg-amber-50 text-amber-600",
    role: "E-commerce Entrepreneur",
    scenario: "D2C Brand Builder",
    description: "Ankit launched a handmade jewellery D2C brand from Rajasthan. Our courses on Shopify, performance marketing and supply-chain optimisation helped him hit ₹10L GMV in Month 2.",
    outcomes: ["₹10L GMV in 60 days", "1800 orders", "ROAS 6.2x"],
    tags: ["Shopify", "D2C", "Supply Chain"],
  },
  {
    icon: HeartPulse,
    color: "bg-emerald-50 text-emerald-600",
    role: "Healthcare Professional",
    scenario: "MedTech Startup Analyst",
    description: "Dr. Kavya transitioned from clinical practice to a data analytics role in a Bengaluru healthtech startup. BharatSkillz's Data Science track gave her the SQL and Python chops to land the role in 4 months.",
    outcomes: ["Career pivot in 4 months", "₹18 LPA offer", "Top 5% in batch"],
    tags: ["Python", "SQL", "MedTech"],
  },
  {
    icon: Truck,
    color: "bg-orange-50 text-orange-600",
    role: "Logistics Manager",
    scenario: "Supply Chain Optimisation",
    description: "Operations manager Deepak leveraged BharatSkillz's AI & ML Bootcamp to build a demand forecasting model for his company, reducing inventory surplus by 30% and saving ₹25L annually.",
    outcomes: ["30% less surplus", "₹25L/yr savings", "Internal AI tool live"],
    tags: ["AI / ML", "Python", "Operations"],
  },
  {
    icon: Users,
    color: "bg-violet-50 text-violet-600",
    role: "HR & Talent Leader",
    scenario: "People Analytics Specialist",
    description: "Shruti used our Data Science + HR domain knowledge to build attrition prediction dashboards, reducing turnover by 18% and earning a promotion within 6 months at her Fortune-500 employer.",
    outcomes: ["18% ↓ attrition", "Promoted in 6 months", "Dashboard adopted company-wide"],
    tags: ["HR Analytics", "Power BI", "Python"],
  },
];

function ResourcesUseCasesPage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <SectionHeading
          eyebrow="Resources"
          title="Real Use Cases"
          description="See how learners across India use BharatSkillz to break into tech, grow their business, and level up their careers."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((uc, idx) => {
            const Icon = uc.icon;
            return (
              <div key={idx} className="glass-card lift-card rounded-3xl border border-border bg-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${uc.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary">{uc.role}</p>
                      <p className="text-sm font-black text-foreground">{uc.scenario}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{uc.description}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {uc.tags.map((t, i) => (
                      <span key={i} className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">{t}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-5 border-t border-border grid grid-cols-3 gap-2">
                  {uc.outcomes.map((o, i) => (
                    <div key={i} className="rounded-xl bg-primary/5 border border-primary/10 p-2.5 text-center">
                      <p className="text-[10px] font-bold text-primary leading-tight">{o}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
