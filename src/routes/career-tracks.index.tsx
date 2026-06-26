import { createFileRoute } from "@tanstack/react-router";
import { CareerRoadmaps } from "@/components/site/CareerRoadmaps";
import { PlacementAssistance } from "@/components/site/PlacementAssistance";

export const Route = createFileRoute("/career-tracks/")({
  head: () => ({
    meta: [
      { title: "Career Tracks — BharatSkillz" },
      { name: "description", content: "End-to-end career roadmaps in AI, Full Stack, Data Science, Cyber Security and Digital Marketing." },
      { property: "og:title", content: "Career Tracks — BharatSkillz" },
      { property: "og:description", content: "From skills to placement — pick a track and follow the roadmap." },
      { property: "og:url", content: "/career-tracks" },
    ],
    links: [{ rel: "canonical", href: "/career-tracks" }],
  }),
  component: () => (
    <>
      <CareerRoadmaps />
      <PlacementAssistance />
    </>
  ),
});
