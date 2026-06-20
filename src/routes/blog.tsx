import { createFileRoute } from "@tanstack/react-router";
import { Blog } from "@/components/site/Blog";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — BharatSkillz" },
      { name: "description", content: "Career tips, playbooks and frameworks to help you learn faster and land roles you want." },
      { property: "og:title", content: "Blog — BharatSkillz" },
      { property: "og:description", content: "Practical writing for ambitious learners." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: Blog,
});
