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
import type { CourseDoc } from "@/lib/firebase/courses";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/lib/firebase/users";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebase/config";
import { Link } from "@tanstack/react-router";

export function EnrollDialog({
  course,
  trigger,
}: {
  course: CourseDoc;
  trigger: ReactNode;
}) {
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.uid);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [phone, setPhone] = useState("");

  // Sync phone from profile if available
  const handleOpenChange = (o: boolean) => {
    setOpen(o);
    if (!o) {
      setDone(false);
    } else if (profile?.phone) {
      setPhone(profile.phone.replace(/\D/g, "").slice(0, 10));
    }
  };

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
        const docRef = doc(db, "users", user.uid, "enrollments", course.slug);
        await setDoc(docRef, {
          title: course.title,
          instructor: course.instructor?.name || "BharatSkillz Expert",
          thumbnail: course.emoji || "📚",
          progress: 0,
          nextLesson: "Lesson 1: Introduction",
          totalLessons: course.lessons || 10,
          completedLessons: 0,
          enrolledAt: serverTimestamp(),
        });
      } else {
        await new Promise((r) => setTimeout(r, 700));
      }
      setDone(true);
      toast.success(`Enrollment received for ${course.title}`, {
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
      onOpenChange={handleOpenChange}
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
              We've received your interest in <strong>{course.title}</strong>.
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
              Please login to enroll in <strong>{course.title}</strong>.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Button asChild onClick={() => setOpen(false)}>
                <Link to="/auth/login">Login</Link>
              </Button>
              <Button asChild variant="outline" onClick={() => setOpen(false)}>
                <Link to="/auth/signup">Create an Account</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Enroll in {course.title}</DialogTitle>
              <DialogDescription>
                Reserve your seat — fees ₹{course.price.toLocaleString("en-IN")}.
                Our advisor will help with EMI & scholarships.
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
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
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
