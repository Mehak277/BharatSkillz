import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { TRACKS, type Track } from "@/lib/data/tracks";
import { Button } from "@/components/ui/button";

const toneBg: Record<Track["tone"], string> = {
  mint: "bg-mint",
  peach: "bg-peach",
  lavender: "bg-lavender",
  gold: "bg-gold/15",
};

export const Route = createFileRoute("/career-tracks/$slug")({
  loader: ({ params }) => {
    const track = TRACKS.find((t) => t.slug === params.slug);
    if (!track) throw notFound();
    return { track };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.track.title} Roadmap — BharatSkillz` },
      {
        name: "description",
        content: `${loaderData?.track.title} career roadmap: ${loaderData?.track.duration} program with placement support. Avg package ${loaderData?.track.averagePackage}.`,
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="container-page py-24 text-center">
      <h1 className="text-2xl font-bold">Track not found</h1>
      <Button asChild className="mt-6"><Link to="/career-tracks">Back to tracks</Link></Button>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="container-page py-24 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>
      <Button className="mt-6" onClick={reset}>Try again</Button>
    </div>
  ),
  component: TrackPage,
});

function TrackPage() {
  const { track } = Route.useLoaderData() as { track: Track };

  return (
    <section className="section-y">
      <div className="container-page max-w-4xl">
        <Link
          to="/career-tracks"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All career tracks
        </Link>

        <div className={`mt-6 rounded-3xl border border-border p-8 ${toneBg[track.tone]}`}>
          <div className="flex items-start justify-between gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-background text-3xl shadow-sm">
              {track.emoji}
            </span>
            <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-semibold backdrop-blur">
              Avg {track.averagePackage}
            </span>
          </div>
          <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">{track.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {track.duration} program</span>
            <span className="inline-flex items-center gap-1.5"><TrendingUp className="h-4 w-4" /> {track.averagePackage} avg package</span>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold">Your roadmap</h2>
          <p className="mt-1.5 text-muted-foreground">A step-by-step path from fundamentals to your first role.</p>

          <ol className="mt-8 space-y-4">
            {track.milestones.map((m, i) => (
              <li key={m} className="glass-card flex items-start gap-4 rounded-2xl p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 font-display text-sm font-bold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold">{m}</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Hands-on projects & assessments
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 rounded-3xl border border-border bg-secondary/40 p-8 text-center">
          <h3 className="text-xl font-bold">Ready to start your {track.title} journey?</h3>
          <p className="text-sm text-muted-foreground">Talk to a counsellor and get your personalised plan.</p>
          <Button asChild className="btn-shine mt-2"><Link to="/contact">Talk to a counsellor</Link></Button>
        </div>
      </div>
    </section>
  );
}
