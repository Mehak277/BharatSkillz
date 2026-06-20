import { createServerFn } from "@tanstack/react-start";
import { COURSES, getCourseBySlug } from "@/lib/data/courses";

export const listCourses = createServerFn({ method: "GET" }).handler(async () => COURSES);

export const getCourse = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => getCourseBySlug(data.slug) ?? null);
