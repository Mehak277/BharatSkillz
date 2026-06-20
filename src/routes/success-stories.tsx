import { createFileRoute } from "@tanstack/react-router";
import { SuccessStories } from "@/components/site/SuccessStories";

export const Route = createFileRoute("/success-stories")({
  head: () => ({
    meta: [
      { title: "Success Stories — BharatSkillz" },
      { name: "description", content: "Real students. Real placements. See how BharatSkillz changed their careers." },
      { property: "og:title", content: "Success Stories — BharatSkillz" },
      { property: "og:description", content: "Career switches, first jobs, and dream offers — straight from our students." },
      { property: "og:url", content: "/success-stories" },
    ],
    links: [{ rel: "canonical", href: "/success-stories" }],
  }),
  component: SuccessStories,
});
