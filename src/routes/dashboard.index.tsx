import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import {
  useUserProfile,
  useUserEnrollments,
  useUserApplications,
} from "@/lib/firebase/users";
import {
  BookOpen,
  Briefcase,
  Award,
  Flame,
  ArrowRight,
  Clock,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/")(  {
  component: DashboardHome,
});

function DashboardHome() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile(user?.uid);
  const { enrollments, loading: enrollmentsLoading } = useUserEnrollments(user?.uid);
  const { applications, loading: appsLoading } = useUserApplications(user?.uid);

  const loading = profileLoading || enrollmentsLoading || appsLoading;

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Display name fallback chain
  const displayName = profile?.name || user?.displayName || user?.email?.split("@")[0] || "Learner";

  const getInitials = (nameStr: string) => {
    if (!nameStr) return "U";
    return nameStr
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };
  const avatarInitials = getInitials(displayName);

  const getJoinedDate = (createdAt: any) => {
    if (!createdAt) return "Recently";
    try {
      const date = typeof createdAt.toDate === "function" ? createdAt.toDate() : new Date(createdAt);
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } catch {
      return "Recently";
    }
  };
  const joinedDate = getJoinedDate(profile?.createdAt);

  const enrolled = enrollments.length;
  const completed = enrollments.filter((c) => c.progress === 100).length;
  const inProgress = enrolled - completed;
  const applied = applications.length;

  const continueCourses = enrollments.filter((c) => c.progress < 100).slice(0, 3);

  const stats = [
    { label: "Enrolled Courses", value: enrolled, icon: BookOpen, tone: "from-emerald-400/20 to-teal-400/20" },
    { label: "In Progress", value: inProgress, icon: Flame, tone: "from-amber-400/20 to-orange-400/20" },
    { label: "Completed", value: completed, icon: Award, tone: "from-violet-400/20 to-fuchsia-400/20" },
    { label: "Internships Applied", value: applied, icon: Briefcase, tone: "from-sky-400/20 to-indigo-400/20" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <section className="glass-card relative overflow-hidden rounded-3xl p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-peach/20 via-transparent to-peach/5" />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Welcome back 👋</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Hi {displayName.split(" ")[0]}, ready to keep learning?
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              You've completed <span className="font-semibold text-foreground">{completed}</span> courses and applied to{" "}
              <span className="font-semibold text-foreground">{applied}</span> internships.
              {enrolled === 0 && " Start exploring courses to begin your journey!"}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link to="/courses">
                  {enrolled > 0 ? "Continue learning" : "Browse courses"} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/internships">Find internships</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-background/70 p-4">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-peach/20 border border-peach/40 text-base font-bold text-orange-foreground">
              {avatarInitials}
            </div>
            <div>
              <p className="text-sm font-semibold">{displayName}</p>
              <p className="text-xs text-muted-foreground">Member since {joinedDate}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-card lift-card rounded-2xl p-5">
              <div className={`mb-3 inline-grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${s.tone}`}>
                <Icon className="h-5 w-5 text-foreground" />
              </div>
              <p className="text-2xl font-extrabold tracking-tight">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          );
        })}
      </section>

      {/* Continue Learning + Activity */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="glass-card rounded-2xl p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold">Continue Learning</h3>
            <Link to="/dashboard/courses" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          {continueCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 py-10 text-center">
              <Inbox className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">No courses in progress yet.</p>
              <Button asChild size="sm" className="mt-3">
                <Link to="/courses">Browse courses</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-3">
              {continueCourses.map((c) => (
                <li
                  key={c.slug}
                  className="flex items-center gap-4 rounded-xl border border-border/60 bg-background/60 p-3 transition-colors hover:bg-background"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-peach/20 border border-peach/35 text-2xl">
                    {c.thumbnail}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{c.title}</p>
                    <p className="truncate text-xs text-muted-foreground">Next: {c.nextLesson}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80"
                          style={{ width: `${c.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-foreground/90">{c.progress}%</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="shrink-0">
                    Resume
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="mb-4 text-base font-semibold">Recent Applications</h3>
          {applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Briefcase className="h-7 w-7 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">No applications yet.</p>
              <Button asChild size="sm" variant="outline" className="mt-3">
                <Link to="/internships">Explore internships</Link>
              </Button>
            </div>
          ) : (
            <ol className="space-y-4">
              {applications.slice(0, 4).map((a) => (
                <li key={a.id} className="flex gap-3">
                  <div className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-soft">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm leading-snug font-medium">{a.role}</p>
                    <p className="text-xs text-muted-foreground">{a.company} · {a.status}</p>
                    <p className="text-[11px] text-muted-foreground">{a.appliedOn}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* Progress overview */}
      {enrollments.length > 0 && (
        <section className="glass-card rounded-2xl p-5">
          <h3 className="mb-4 text-base font-semibold">Progress Overview</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {enrollments.map((c) => (
              <div key={c.slug} className="rounded-xl border border-border/60 bg-background/60 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{c.thumbnail}</span>
                  <p className="truncate text-sm font-semibold">{c.title}</p>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-foreground/90">{c.progress}%</span>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {c.completedLessons} / {c.totalLessons} lessons
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
