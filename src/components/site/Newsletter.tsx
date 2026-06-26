import { useState } from "react";
import { Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFirebaseFirestore } from "@/lib/firebase/config";
import { doc, setDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";

export function Newsletter() {
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") ?? "").trim().toLowerCase();
    if (!email) return;

    setSubmitting(true);
    try {
      const db = getFirebaseFirestore();
      
      // 1. Add to subscribers collection
      await setDoc(doc(db, "subscribers", email), {
        email,
        subscribedAt: serverTimestamp(),
        status: "active",
      });

      // 2. Add to mail collection (for Firebase Trigger Email extension)
      await addDoc(collection(db, "mail"), {
        to: email,
        message: {
          subject: "Welcome to BharatSkillz! 🚀",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b;">
              <p>Hi,</p>
              <br/>
              <p>Thank you for subscribing to BharatSkillz!</p>
              <br/>
              <p>We're excited to have you with us.</p>
              <br/>
              <p>Here's what you can expect:</p>
              <ul style="margin-top: 8px; margin-bottom: 24px; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Latest updates and news</li>
                <li style="margin-bottom: 8px;">Exclusive offers and promotions</li>
                <li style="margin-bottom: 8px;">Helpful tips and resources</li>
              </ul>
              <br/>
              <p>If you subscribed by mistake, you can unsubscribe anytime using the link at the bottom of our emails.</p>
              <br/>
              <p>Stay tuned!</p>
            </div>
          `
        }
      });

      toast.success("Subscribed successfully!", {
        description: `We have sent a welcome email to ${email}.`,
      });
      form.reset();
    } catch (err: any) {
      console.error("Error subscribing to newsletter:", err);
      toast.error("Failed to subscribe. Please try again.", {
        description: err?.message || "Unknown error",
      });
    } finally {
      setSubmitting(false);
    }
  }

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

            <form className="flex flex-col gap-4" onSubmit={onSubmit}>
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
              <Button type="submit" size="lg" className="h-14 text-base" disabled={submitting}>
                {submitting ? "Subscribing..." : "Subscribe for free"}
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
