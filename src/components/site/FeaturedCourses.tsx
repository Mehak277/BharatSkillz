import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COURSES } from "@/lib/data/courses";
import { SectionHeading } from "./SectionHeading";
import { CourseCard } from "./CourseCard";
import { Reveal } from "./Reveal";
import { useCourses } from "@/lib/firebase/courses";

export function FeaturedCourses() {
  const { courses: dbCourses = [], loading } = useCourses();

  // Map and merge Firestore courses with static ones
  const allCourses = [
    ...dbCourses.map((c) => ({
      slug: c.slug,
      title: c.title,
      category: c.category,
      level: (c.level as any) || "Beginner",
      duration: c.duration || "3 months",
      lessons: c.lessons || 10,
      rating: c.rating || 4.5,
      students: c.students || 0,
      price: c.price || 0,
      originalPrice: c.originalPrice || 0,
      certificate: c.certificate ?? true,
      tone: (c.category.toLowerCase().includes("data") ? "lavender" : c.category.toLowerCase().includes("design") ? "peach" : c.category.toLowerCase().includes("ai") ? "gold" : "mint") as "mint" | "peach" | "lavender" | "gold",
      emoji: c.emoji || "📚",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60",
      short: c.short || "",
      long: c.long || "",
      outcomes: c.outcomes || [],
      syllabus: [
        { title: "Introduction", topics: ["Overview", "Setup", "Basics"] },
        { title: "Deep Dive", topics: ["Intermediate concepts", "Practical projects"] },
        { title: "Advanced Topics", topics: ["Deployment", "Best practices"] }
      ],
      instructor: { name: "BharatSkillz Expert", role: "Industry Mentor", company: "BharatSkillz Partner" }
    })),
    ...COURSES.filter((sc) => !dbCourses.some((c) => c.slug === sc.slug))
  ];

  const featured = allCourses.slice(0, 6);

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
