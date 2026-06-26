import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/site/Hero";
import { TrustedBy } from "@/components/site/TrustedBy";
import { ServicesGrid } from "@/components/site/ServicesGrid";
import { HowItWorks } from "@/components/site/HowItWorks";
import { FeaturedCourses } from "@/components/site/FeaturedCourses";
import { InternshipMarketplace } from "@/components/site/InternshipMarketplace";
import { CareerRoadmaps } from "@/components/site/CareerRoadmaps";
import { SuccessStories } from "@/components/site/SuccessStories";

import { PlacementAssistance } from "@/components/site/PlacementAssistance";

import { FinalCTA } from "@/components/site/FinalCTA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BharatSkillz — Learn Skills. Gain Experience. Build Your Career." },
      {
        name: "description",
        content:
          "India's premium career platform. Industry-grade courses, paid internships, mentorship, certifications and placement support.",
      },
      { property: "og:title", content: "BharatSkillz — Build Your Career" },
      {
        property: "og:description",
        content: "Courses, internships, mentorship and placement support — all in one platform.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <ServicesGrid />
      <HowItWorks />
      <FeaturedCourses />
      <InternshipMarketplace />
      <CareerRoadmaps />
      <SuccessStories />
      
      <PlacementAssistance />
      <FinalCTA />
    </>
  );
}
