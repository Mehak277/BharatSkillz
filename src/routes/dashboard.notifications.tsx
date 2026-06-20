import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Briefcase, Trophy, Bell, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/notifications")({
  component: NotificationsPage,
});

const iconFor = (t: string) =>
  t === "course" ? BookOpen : t === "internship" ? Briefcase : t === "achievement" ? Trophy : Bell;

function NotificationsPage() {
  // Notifications will be loaded from users/{uid}/notifications sub-collection in the future.
  // For now, show an empty state as we don't want to show fake data.
  const notifications: any[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-extrabold">Notifications</h2>
        <p className="text-sm text-muted-foreground">Course updates, internship news and achievements.</p>
      </div>

      {notifications.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center rounded-3xl p-14 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-primary mb-4">
            <Inbox className="h-7 w-7" />
          </div>
          <h3 className="font-display text-xl font-bold">All caught up!</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            You have no new notifications. Start learning to get course updates and achievement badges.
          </p>
        </div>
      ) : (
        <ul className="glass-card divide-y divide-border/60 overflow-hidden rounded-2xl">
          {notifications.map((n) => {
            const Icon = iconFor(n.type);
            return (
              <li
                key={n.id}
                className={cn(
                  "flex items-start gap-4 p-5 transition-colors hover:bg-background/60",
                  n.unread && "bg-primary-soft/30",
                )}
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-background/70">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{n.title}</p>
                    {n.unread && <span className="h-2 w-2 rounded-full bg-accent" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{n.body}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{n.time}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
