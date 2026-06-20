import { createFileRoute } from "@tanstack/react-router";
import { COURSES } from "@/lib/data/courses";
import { CourseCard } from "@/components/site/CourseCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { useCourses } from "@/lib/firebase/courses";

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

  // Map Firestore CourseDoc to Course shape & merge with static COURSES
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

  return (
    <div className="py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="All courses"
          title="Career-defining programs"
          description="Cohort-based and self-paced courses, built with hiring managers from India's top companies."
        />
        {loading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card animate-pulse h-96 rounded-3xl bg-secondary/30" />
            ))}
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allCourses.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
