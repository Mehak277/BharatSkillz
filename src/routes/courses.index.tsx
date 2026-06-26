import { createFileRoute } from "@tanstack/react-router";

import { CourseCard } from "@/components/site/CourseCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useCourses } from "@/lib/firebase/courses";
import { useState, useMemo } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "Courses — BharatSkillz" },
      {
        name: "description",
        content:
          "Browse career-defining courses in Web Development, Data Science, AI, Cyber Security, Digital Marketing and more.",
      },
      { property: "og:title", content: "Courses — BharatSkillz" },
      { property: "og:description", content: "Industry-grade live and self-paced courses." },
      { property: "og:url", content: "/courses" },
    ],
    links: [{ rel: "canonical", href: "/courses" }],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  const { courses: dbCourses = [], loading } = useCourses();
  const [search, setSearch] = useState("");

  const filteredCourses = useMemo(() => {
    return dbCourses.filter(c => 
      c.title.toLowerCase().includes(search.toLowerCase()) || 
      c.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [dbCourses, search]);

  return (
    <div className="py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="All courses"
          title="Career-defining programs"
          description="Cohort-based and self-paced courses, built with hiring managers from India's top companies."
        />
        
        <div className="mt-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search courses by title or category..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-10 bg-card border-border/60 shadow-sm" 
            />
          </div>
        </div>

        {loading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card animate-pulse h-96 rounded-3xl bg-secondary/30" />
            ))}
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
            {filteredCourses.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                No courses found matching your search.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
