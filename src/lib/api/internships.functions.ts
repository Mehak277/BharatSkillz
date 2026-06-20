import { createServerFn } from "@tanstack/react-start";
import { INTERNSHIPS } from "@/lib/data/internships";

export const listInternships = createServerFn({ method: "GET" }).handler(async () => INTERNSHIPS);

export const applyInternship = createServerFn({ method: "POST" })
  .inputValidator((data: { internshipId: string; email: string }) => data)
  .handler(async ({ data }) => ({ ok: true, applicationId: `app_${data.internshipId}_${Date.now()}` }));
