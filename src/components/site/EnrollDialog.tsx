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
import type { Course } from "@/lib/data/courses";

export function EnrollDialog({
  course,
  trigger,
}: {
  course: Course;
  trigger: ReactNode;
}) {
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
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setDone(true);
    toast.success(`Enrollment received for ${course.title}`, {
      description: "Our team will reach out within 24 hours.",
    });
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
              We've received your interest in <strong>{course.title}</strong>.
              A program advisor will call you shortly.
            </p>
            <Button className="mt-6 w-full" onClick={() => setOpen(false)}>
              Done
            </Button>
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
                <Input id="name" name="name" placeholder="Your name" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
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
