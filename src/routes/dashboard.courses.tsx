import { createFileRoute, Link } from "@tanstack/react-router";
import { Play, Clock, CheckCircle2, Inbox } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserEnrollments } from "@/lib/firebase/users";
import { Button } from "@/components/ui/button";
import { useCourses } from "@/lib/firebase/courses";
import { CourseLearningDialog } from "@/components/site/CourseLearningDialog";

export const Route = createFileRoute("/dashboard/courses")({
  component: MyCourses,
});

function MyCourses() {
  const { user } = useAuth();
  const { enrollments, loading: enrollmentsLoading } = useUserEnrollments(user?.uid);
  const { courses: dbCourses, loading: coursesLoading } = useCourses();

  const activeEnrollments = enrollments.filter(e => dbCourses.some(c => c.slug === e.slug));
  const loading = enrollmentsLoading || coursesLoading;

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (activeEnrollments.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-extrabold">My Courses</h2>
          <p className="text-sm text-muted-foreground">All your enrolled courses in one place.</p>
        </div>
        <div className="glass-card flex flex-col items-center justify-center rounded-3xl p-14 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-primary mb-4">
            <Inbox className="h-7 w-7" />
          </div>
          <h3 className="font-display text-xl font-bold">No courses enrolled yet</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Browse our catalog of 200+ courses and start your learning journey today.
          </p>
          <Button asChild className="mt-5">
            <Link to="/courses">Explore courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-extrabold">My Courses</h2>
        <p className="text-sm text-muted-foreground">
          {activeEnrollments.length} course{activeEnrollments.length !== 1 ? "s" : ""} enrolled.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {activeEnrollments.map((c) => {
          const done = c.progress === 100;
          const courseData = dbCourses.find((item) => item.slug === c.slug);
          const courseImage = courseData?.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60";
          return (
            <article key={c.slug} className="glass-card lift-card flex h-full flex-col overflow-hidden rounded-3xl">
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={courseImage}
                  alt={c.title}
                  className="h-full w-full object-cover"
                />
                {done && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground shadow">
                    <CheckCircle2 className="h-3 w-3" /> Completed
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-bold leading-tight">{courseData?.title || c.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">By {courseData?.instructor?.name || c.instructor}</p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground/90">Progress</span>
                    <span className="font-bold">{c.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                  <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {c.completedLessons} / {c.totalLessons} lessons
                  </p>
                </div>

                {!done && c.nextLesson && (
                  <p className="mt-2 text-[11px] text-muted-foreground truncate">
                    Next: {c.nextLesson}
                  </p>
                )}

                <div className="mt-auto pt-5">
                  <CourseLearningDialog 
                    enrollment={c}
                    courseData={courseData}
                    trigger={
                      <Button className="w-full" variant={done ? "outline" : "default"}>
                        <Play className="h-3.5 w-3.5" />
                        {done ? "Review course" : "Continue learning"}
                      </Button>
                    }
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
