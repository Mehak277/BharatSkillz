import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — BharatSkillz" },
      { name: "description", content: "Your personal learning dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardLayout,
});
