import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./SectionHeading";
import { CourseCard } from "./CourseCard";
import { Reveal } from "./Reveal";
import { useCourses } from "@/lib/firebase/courses";

export function FeaturedCourses() {
  const { courses: dbCourses = [], loading } = useCourses();

  const featured = dbCourses.slice(0, 6);

  return (
    <section id="courses" className="section-y">
      <div className="container-page">
        <Reveal self>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              align="left"
              eyebrow="Featured courses"
              title="Career-defining programs"
              description="Cohort-based programs built with hiring managers at top product companies."
              className="max-w-xl"
            />
            <Button asChild variant="outline">
              <Link to="/courses">View all courses <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </Reveal>

        {loading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card animate-pulse h-96 rounded-3xl bg-secondary/30" />
            ))}
          </div>
        ) : (
          <Reveal className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {featured.map((c) => (
              <div key={c.slug} data-reveal className="h-full">
                <CourseCard course={c} />
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}
