import { Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  return (
    <section className="border-t border-border bg-gradient-to-br from-mint via-background to-peach">
      <div className="container-page py-20">
        <div className="mx-auto max-w-6xl rounded-3xl border border-border bg-background/80 p-10 shadow-sm backdrop-blur md:p-16">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                <Sparkles className="h-4 w-4" /> Newsletter
              </span>
              <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                Career tips, new courses & internships — straight to your inbox.
              </h2>
              <p className="mt-3 text-base text-muted-foreground">
                Join 25,000+ learners. One email a week. No spam, unsubscribe anytime.
              </p>
            </div>

            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const email = String(fd.get("email") ?? "").trim();
                if (!email) return;
                toast.success("Subscribed!", { description: `We'll send updates to ${email}.` });
                e.currentTarget.reset();
              }}
            >
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="h-14 bg-background pl-12 text-base"
                />
              </div>
              <Button type="submit" size="lg" className="h-14 text-base">
                Subscribe for free
              </Button>
              <p className="text-xs text-muted-foreground">
                By subscribing, you agree to receive emails from us.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
