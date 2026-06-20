import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ArrowLeft, ExternalLink, Globe, Briefcase, Code, Layers } from "lucide-react";

export const Route = createFileRoute("/resources/directory")({
  head: () => ({
    meta: [
      { title: "Tools Directory — BharatSkillz" },
      { name: "description", content: "A curated directory of tools and platforms for developers and freelancers." },
    ],
  }),
  component: ResourcesDirectoryPage,
});

const DIRECTORY = [
  {
    category: "Freelance Platforms",
    icon: Briefcase,
    color: "bg-indigo-50 text-indigo-600",
    items: [
      { name: "Toptal", description: "Elite network for the top 3% of freelance talent." },
      { name: "Upwork", description: "World's largest freelancing and remote work marketplace." },
      { name: "Freelancer.in", description: "India-focused freelance work platform for all skill levels." },
    ]
  },
  {
    category: "Portfolio Hosting",
    icon: Globe,
    color: "bg-sky-50 text-sky-600",
    items: [
      { name: "Vercel", description: "Deploy full-stack web apps with zero configuration." },
      { name: "GitHub Pages", description: "Free hosting directly from your GitHub repository." },
      { name: "Netlify", description: "Build, deploy, and scale modern web projects instantly." },
    ]
  },
  {
    category: "Developer Tools",
    icon: Code,
    color: "bg-emerald-50 text-emerald-600",
    items: [
      { name: "VS Code", description: "The most popular open-source code editor in the world." },
      { name: "Postman", description: "API platform for building and testing integrations." },
      { name: "Docker", description: "Build, ship, and run containerized applications." },
    ]
  },
  {
    category: "Learning Resources",
    icon: Layers,
    color: "bg-violet-50 text-violet-600",
    items: [
      { name: "MDN Web Docs", description: "The definitive resource for open web development docs." },
      { name: "DevDocs.io", description: "Unified API documentation browser for 100+ languages." },
      { name: "roadmap.sh", description: "Community-created, interactive developer roadmaps." },
    ]
  }
];

function ResourcesDirectoryPage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <SectionHeading
          eyebrow="Resources"
          title="Tools Directory"
          description="A curated collection of the best platforms, tools and communities for developers and career builders."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {DIRECTORY.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div key={idx} className="glass-card rounded-3xl border border-border bg-card p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${section.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-bold text-foreground">{section.category}</h3>
                </div>
                <div className="space-y-3">
                  {section.items.map((item, jdx) => (
                    <div key={jdx} className="flex items-start justify-between gap-3 rounded-2xl bg-secondary/40 p-4 hover:bg-secondary/70 transition-colors group cursor-pointer">
                      <div>
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{item.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all mt-0.5" />
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
