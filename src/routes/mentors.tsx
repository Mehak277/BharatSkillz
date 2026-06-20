import { createFileRoute } from "@tanstack/react-router";
import { Mentors } from "@/components/site/Mentors";

export const Route = createFileRoute("/mentors")({
  head: () => ({
    meta: [
      { title: "Mentors — BharatSkillz" },
      { name: "description", content: "1:1 mentorship from senior engineers at Google, Microsoft, Amazon, Flipkart and more." },
      { property: "og:title", content: "Mentors — BharatSkillz" },
      { property: "og:description", content: "Book a session with vetted industry mentors." },
      { property: "og:url", content: "/mentors" },
    ],
    links: [{ rel: "canonical", href: "/mentors" }],
  }),
  component: Mentors,
});
