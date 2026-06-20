import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Clock, Target, TrendingUp, Inbox } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserEnrollments } from "@/lib/firebase/users";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/progress")({
  component: ProgressPage,
});

// Static weekly hours data — this would ideally come from a learningActivity sub-collection
const WEEKLY_HOURS = [
  { day: "Mon", hours: 0 },
  { day: "Tue", hours: 0 },
  { day: "Wed", hours: 0 },
  { day: "Thu", hours: 0 },
  { day: "Fri", hours: 0 },
  { day: "Sat", hours: 0 },
  { day: "Sun", hours: 0 },
];

function ProgressPage() {
  const { user } = useAuth();
  const { enrollments, loading } = useUserEnrollments(user?.uid);

  const overall =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce((s, c) => s + c.progress, 0) / enrollments.length
        )
      : 0;

  const completedCourses = enrollments.filter((c) => c.progress === 100).length;

  const kpis = [
    { label: "Hours this week", value: "0h", icon: Clock },
    { label: "Daily average", value: "0h", icon: Target },
    { label: "Completed courses", value: String(completedCourses), icon: Flame },
    { label: "Overall progress", value: `${overall}%`, icon: TrendingUp },
  ];

  const max = Math.max(...WEEKLY_HOURS.map((d) => d.hours), 1);
  const w = 600;
  const h = 180;
  const pad = 24;
  const stepX = (w - pad * 2) / (WEEKLY_HOURS.length - 1);
  const points = WEEKLY_HOURS.map((d, i) => {
    const x = pad + i * stepX;
    const y = h - pad - (d.hours / max) * (h - pad * 2);
    return [x, y] as const;
  });
  const linePath = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`)
    .join(" ");
  const areaPath = `${linePath} L${points[points.length - 1][0]},${h - pad} L${points[0][0]},${h - pad} Z`;

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-extrabold">Your Learning Progress</h2>
        <p className="text-sm text-muted-foreground">Track your learning journey.</p>
      </div>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="glass-card rounded-2xl p-5">
              <div className="mb-3 inline-grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-2xl font-extrabold tracking-tight">{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
            </div>
          );
        })}
      </section>

      <section className="glass-card rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold">Weekly learning hours</h3>
            <p className="text-xs text-muted-foreground">Hours spent learning, per day.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${w} ${h}`} className="h-48 w-full min-w-[500px]">
            <defs>
              <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.62 0.17 148)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="oklch(0.62 0.17 148)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="lineStroke" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="oklch(0.62 0.17 148)" />
                <stop offset="100%" stopColor="oklch(0.78 0.16 65)" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map((p) => (
              <line
                key={p}
                x1={pad}
                x2={w - pad}
                y1={pad + (h - pad * 2) * p}
                y2={pad + (h - pad * 2) * p}
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeDasharray="3 4"
              />
            ))}
            <path d={areaPath} fill="url(#areaFill)" />
            <path
              d={linePath}
              fill="none"
              stroke="url(#lineStroke)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {points.map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="4" fill="oklch(0.62 0.17 148)" />
                <text
                  x={x}
                  y={h - 4}
                  textAnchor="middle"
                  fontSize="10"
                  fill="currentColor"
                  opacity="0.6"
                >
                  {WEEKLY_HOURS[i].day}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2">
          Detailed learning activity tracking coming soon.
        </p>
      </section>

      <section className="glass-card rounded-2xl p-6">
        <h3 className="mb-4 text-base font-semibold">Course completion</h3>
        {enrollments.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <Inbox className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No courses enrolled yet.</p>
            <Button asChild size="sm" className="mt-3">
              <Link to="/courses">Browse courses</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map((c) => (
              <div key={c.slug}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">
                    <span className="mr-2">{c.thumbnail}</span>
                    {c.title}
                  </span>
                  <span className="text-xs font-bold text-foreground/90">{c.progress}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
