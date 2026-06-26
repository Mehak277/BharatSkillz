import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, MapPin, IndianRupee, Calendar, Inbox } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserApplications, type InternshipApplication } from "@/lib/firebase/users";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/internships")({
  component: AppliedInternships,
});

const statusStyles: Record<InternshipApplication["status"], string> = {
  Applied: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
  Shortlisted: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  Interview: "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30",
  Selected: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  Rejected: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
};

function AppliedInternships() {
  const { user } = useAuth();
  const { applications, loading } = useUserApplications(user?.uid);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-extrabold">My Internship Applications</h2>
          <p className="text-sm text-muted-foreground">Track the status of every internship you've applied to.</p>
        </div>
        <div className="glass-card flex flex-col items-center justify-center rounded-3xl p-12 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-primary">
            <Inbox className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-display text-xl font-bold">No internship applications yet</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Start applying to handpicked internships from 480+ hiring partners and track your status here.
          </p>
          <Button asChild className="mt-5">
            <Link to="/internships">Explore internships</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-extrabold">My Internship Applications</h2>
          <p className="text-sm text-muted-foreground">
            {applications.length} application{applications.length !== 1 ? "s" : ""} submitted.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/internships">Browse internships</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {applications.map((i) => (
          <article
            key={i.id}
            className="glass-card lift-card flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-peach/20 border border-peach/35 text-orange-foreground">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold leading-tight">{i.role}</p>
                <p className="text-sm text-muted-foreground">{i.company}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {i.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />{i.location}
                    </span>
                  )}
                  {i.stipend && (
                    <span className="inline-flex items-center gap-1">
                      <IndianRupee className="h-3 w-3" />{i.stipend}
                    </span>
                  )}
                  {i.appliedOn && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />Applied {i.appliedOn}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
                  statusStyles[i.status],
                )}
              >
                {i.status}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
