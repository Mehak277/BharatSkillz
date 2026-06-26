import { useState, type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Track } from "@/lib/data/tracks";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/lib/firebase/users";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebase/config";
import { Link } from "@tanstack/react-router";

export function TrackEnrollDialog({
  track,
  trigger,
}: {
  track: Track;
  trigger: ReactNode;
}) {
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.uid);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    if (!name || !email || !phone) {
      toast.error("Please fill in all fields");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Invalid phone number", {
        description: "Phone number must be exactly 10 digits.",
      });
      return;
    }
    setSubmitting(true);
    try {
      if (user) {
        const db = getFirebaseFirestore();
        const docRef = doc(db, "users", user.uid, "enrollments", track.slug);
        await setDoc(docRef, {
          title: track.title,
          instructor: "Career Counselor",
          thumbnail: track.emoji || "🎓",
          progress: 0,
          nextLesson: "Lesson 1: Introduction",
          totalLessons: 1,
          completedLessons: 0,
          enrolledAt: serverTimestamp(),
        });
      } else {
        await new Promise((r) => setTimeout(r, 700));
      }
      setDone(true);
      toast.success(`Enrollment received for ${track.title}`, {
        description: "Our team will reach out within 24 hours.",
      });
    } catch (err: any) {
      console.error("Error saving enrollment to Firestore:", err);
      toast.error("Failed to enroll. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setDone(false);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {done ? (
          <div className="py-6 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-soft">
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-bold">You're in!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We've received your interest in the <strong>{track.title}</strong> track.
              A program advisor will call you shortly.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              {user && (
                <Button asChild onClick={() => setOpen(false)}>
                  <Link to="/dashboard/courses">Go to Dashboard</Link>
                </Button>
              )}
              <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        ) : !user ? (
          <div className="py-6 text-center">
            <h3 className="text-xl font-bold">Login Required</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Please login to enroll in the <strong>{track.title}</strong> track.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Button asChild onClick={() => setOpen(false)}>
                <Link to="/auth/login" search={{ redirect: `/career-tracks/${track.slug}?enroll=true` }}>Login</Link>
              </Button>
              <Button asChild variant="outline" onClick={() => setOpen(false)}>
                <Link to="/auth/signup" search={{ redirect: `/career-tracks/${track.slug}?enroll=true` }}>Create an Account</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Enroll in {track.title}</DialogTitle>
              <DialogDescription>
                Start your journey towards a successful career.
                Our advisor will contact you to build your personalized learning plan.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  defaultValue={profile?.name || user?.displayName || ""}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  defaultValue={profile?.email || user?.email || ""}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 9xxxxxxxxx"
                  defaultValue={profile?.phone || ""}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Reserving seat…" : "Confirm Enrollment"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
