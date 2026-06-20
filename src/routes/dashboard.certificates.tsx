import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Award, Download, Eye, Inbox } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/lib/firebase/users";
import { useUserEnrollments } from "@/lib/firebase/users";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/certificates")({
  component: CertificatesPage,
});

// Certificate colors
const CERT_COLORS = [
  "from-emerald-400/30 to-teal-400/30",
  "from-amber-400/30 to-orange-400/30",
  "from-sky-400/30 to-indigo-400/30",
  "from-violet-400/30 to-fuchsia-400/30",
  "from-rose-400/30 to-pink-400/30",
];

function CertificatesPage() {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile(user?.uid);
  const { enrollments, loading: enrollmentsLoading } = useUserEnrollments(user?.uid);

  const loading = profileLoading || enrollmentsLoading;

  // Certificates are completed courses
  const completedCourses = enrollments.filter((c) => c.progress === 100);

  const displayName =
    profile?.name || user?.displayName || user?.email?.split("@")[0] || "Learner";

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-extrabold">Certificates</h2>
        <p className="text-sm text-muted-foreground">
          Industry-recognized certificates you've earned.
        </p>
      </div>

      {completedCourses.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center rounded-3xl p-14 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-primary mb-4">
            <Inbox className="h-7 w-7" />
          </div>
          <h3 className="font-display text-xl font-bold">No certificates yet</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Complete a course to earn your first industry-recognized certificate.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {completedCourses.map((c, idx) => {
            const color = CERT_COLORS[idx % CERT_COLORS.length];
            const credentialId = `BSZ-${c.slug.slice(0, 3).toUpperCase()}-2026-${String(idx + 1).padStart(5, "0")}`;
            return (
              <article key={c.slug} className="glass-card lift-card overflow-hidden rounded-2xl">
                <div className={`relative bg-gradient-to-br ${color} p-6`}>
                  <div className="flex items-start justify-between">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-background/70 backdrop-blur">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <span className="rounded-full bg-background/70 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground backdrop-blur">
                      Certificate
                    </span>
                  </div>
                  <h3 className="mt-8 font-display text-lg font-extrabold leading-tight">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-xs font-medium text-foreground/80">
                    Awarded to {displayName}
                  </p>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-muted-foreground">Instructor</p>
                      <p className="font-semibold">{c.instructor}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Credential ID</p>
                      <p className="truncate font-mono font-semibold">{credentialId}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => toast("Opening certificate preview…")}
                    >
                      <Eye className="h-3.5 w-3.5" /> View
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => toast.success("Download started")}
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
