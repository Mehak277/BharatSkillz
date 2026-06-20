import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Award, Clock, Users, Star, CheckCircle2, BookOpen } from "lucide-react";
import { COURSES, getCourseBySlug, type Course } from "@/lib/data/courses";
import { Button } from "@/components/ui/button";
import { EnrollDialog } from "@/components/site/EnrollDialog";
import { SuccessStories } from "@/components/site/SuccessStories";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebase/config";

async function fetchCourseBySlug(slug: string): Promise<Course | null> {
  const staticCourse = getCourseBySlug(slug);
  try {
    const db = getFirebaseFirestore();
    const q = query(collection(db, "courses"), where("slug", "==", slug), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      const d = docSnap.data();
      return {
        slug: d.slug ?? docSnap.id,
        title: d.title ?? "",
        category: d.category ?? "",
        level: (d.level as any) || "Beginner",
        duration: d.duration || "3 months",
        lessons: d.lessons ?? 0,
        rating: d.rating ?? 5,
        students: d.students ?? 0,
        price: d.price ?? 0,
        originalPrice: d.originalPrice ?? 0,
        certificate: d.certificate ?? true,
        tone: (d.category?.toLowerCase()?.includes("data") ? "lavender" : d.category?.toLowerCase()?.includes("design") ? "peach" : d.category?.toLowerCase()?.includes("ai") ? "gold" : "mint") as any,
        emoji: d.emoji ?? "📚",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60",
        short: d.short ?? "",
        long: d.long ?? "",
        outcomes: Array.isArray(d.outcomes) ? d.outcomes : [],
        syllabus: [
          { title: "Introduction", topics: ["Overview", "Setup", "Basics"] },
          { title: "Deep Dive", topics: ["Intermediate concepts", "Practical projects"] },
          { title: "Advanced Topics", topics: ["Deployment", "Best practices"] }
        ],
        instructor: { name: "BharatSkillz Expert", role: "Industry Mentor", company: "BharatSkillz Partner" }
      };
    }
  } catch (err) {
    console.error("Error fetching course from firestore:", err);
  }
  return staticCourse || null;
}

export const Route = createFileRoute("/courses/$slug")({
  loader: async ({ params }): Promise<{ course: Course }> => {
    const course = await fetchCourseBySlug(params.slug);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
        { title: `${loaderData.course.title} — BharatSkillz` },
        { name: "description", content: loaderData.course.short },
        { property: "og:title", content: `${loaderData.course.title} — BharatSkillz` },
        { property: "og:description", content: loaderData.course.short },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/courses/${loaderData.course.slug}` },
      ]
      : [],
    links: loaderData ? [{ rel: "canonical", href: `/courses/${loaderData.course.slug}` }] : [],
    scripts: loaderData
      ? [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: loaderData.course.title,
            description: loaderData.course.long,
            provider: { "@type": "Organization", name: "BharatSkillz" },
          }),
        },
      ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="text-2xl font-bold">Course not found</h1>
      <Button asChild className="mt-6"><Link to="/courses">Browse courses</Link></Button>
    </div>
  ),
  component: CourseDetail,
});

const toneBg: Record<Course["tone"], string> = { mint: "bg-mint", peach: "bg-peach", lavender: "bg-lavender", gold: "bg-gold/15" };

function CourseDetail() {
  const { course } = Route.useLoaderData() as { course: Course };
  const related = COURSES.filter((c) => c.slug !== course.slug).slice(0, 3);

  return (
    <>
      <section className={`${toneBg[course.tone]} py-14 sm:py-20`}>
        <div className="container-page grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Link to="/courses" className="text-sm font-semibold text-primary hover:underline">
              ← All courses
            </Link>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-background px-2.5 py-1 text-xs font-semibold">{course.category}</span>
              <span className="rounded-full bg-background px-2.5 py-1 text-xs font-semibold">{course.level}</span>
              {course.certificate && (
                <span className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 text-xs font-semibold text-gold-foreground">
                  <Award className="h-3 w-3" /> Certificate
                </span>
              )}
            </div>
            <h1 className="mt-4 text-balance text-4xl font-extrabold leading-tight sm:text-5xl">
              {course.title}
            </h1>
            <p className="mt-4 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
              {course.long}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm">
              <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {course.duration}</span>
              <span className="inline-flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> {course.lessons} lessons</span>
              <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" /> {course.students.toLocaleString("en-IN")} students</span>
              <span className="inline-flex items-center gap-1.5"><Star className="h-4 w-4 fill-gold text-gold" /> {course.rating}</span>
            </div>
          </div>

          <div className="group rounded-3xl border border-border bg-card p-6 shadow-[0_24px_60px_-24px_rgba(16,24,40,0.18)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_-22px_rgba(16,24,40,0.28)] motion-safe:animate-fade-in-up">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
              <img src={course.image} alt={course.title} className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
            </div>
            <div className="mt-5">
              <p className="font-display">
                <span className="text-3xl font-extrabold">₹{course.price.toLocaleString("en-IN")}</span>
                <span className="ml-2 text-sm text-muted-foreground line-through">₹{course.originalPrice.toLocaleString("en-IN")}</span>
              </p>
              <p className="mt-1 text-xs font-semibold text-primary">
                Limited cohort seats — next batch starts soon
              </p>
            </div>
            <EnrollDialog
              course={course}
              trigger={
                <Button className="mt-5 h-12 w-full text-base transition-transform active:scale-[0.98]">
                  Enroll Now
                </Button>
              }
            />
            <Button asChild variant="outline" className="mt-2 w-full"><Link to="/contact">Download Brochure</Link></Button>
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Lifetime access to course material</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> 1:1 mentor sessions</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Internship + placement support</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">What you'll achieve</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {course.outcomes.map((o) => (
                <li key={o} className="flex items-start gap-2 rounded-2xl border border-border bg-card p-4 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-12 text-2xl font-extrabold sm:text-3xl">Syllabus</h2>
            <div className="mt-5 space-y-3">
              {course.syllabus.map((m, i) => (
                <div key={m.title} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft font-display text-sm font-extrabold text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-bold">{m.title}</h3>
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {m.topics.map((t) => (
                      <li key={t} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <aside>
            <div className="rounded-3xl border border-border bg-card p-6">
              <h3 className="text-lg font-bold">Meet your instructor</h3>
              <div className="mt-4 flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-mint font-display font-extrabold">
                  {course.instructor.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                </span>
                <div>
                  <p className="font-semibold">{course.instructor.name}</p>
                  <p className="text-sm text-muted-foreground">{course.instructor.role}</p>
                  <p className="text-xs text-muted-foreground">{course.instructor.company}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <SuccessStories />

      <section className="bg-secondary/40 py-16">
        <div className="container-page">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Related courses</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <Link
                key={c.slug}
                to="/courses/$slug"
                params={{ slug: c.slug }}
                className="group block overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_24px_60px_-22px_rgba(16,24,40,0.25)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <img src={c.image} alt={c.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold text-muted-foreground">{c.category}</p>
                  <h3 className="mt-1 font-bold transition-colors group-hover:text-primary">{c.title}</h3>
                  <p className="mt-2 text-sm font-display font-extrabold">₹{c.price.toLocaleString("en-IN")}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
