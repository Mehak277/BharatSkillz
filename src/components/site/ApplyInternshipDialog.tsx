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
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/lib/firebase/users";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebase/config";
import type { InternshipDoc } from "@/lib/firebase/internships";
import { Link } from "@tanstack/react-router";

export function ApplyInternshipDialog({
  internship,
  trigger,
}: {
  internship: InternshipDoc;
  trigger: ReactNode;
}) {
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.uid);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [phone, setPhone] = useState("");

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

    if (!user) {
      toast.error("Please login to apply for internships");
      return;
    }

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const resumeFile = form.get("resume") as File | null;
    const resume = resumeFile?.name ? resumeFile.name : "";

    if (!name || !email || !phone) {
      toast.error("Please fill in all required fields");
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
      const db = getFirebaseFirestore();
      const docRef = doc(db, "applications", `${user.uid}_${internship.id}`);
      
      const formattedDate = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      await setDoc(docRef, {
        userId: user.uid,
        internshipId: internship.id,
        role: internship.role,
        company: internship.company,
        status: "Applied",
        appliedOn: formattedDate,
        location: internship.location,
        stipend: internship.stipend,
        appliedAt: serverTimestamp(),
        applicantName: name,
        applicantPhone: phone,
        resumeLink: resume || "",
      });

      setDone(true);
      toast.success(`Applied successfully for ${internship.role}`);
    } catch (err: any) {
      console.error("Error submitting application:", err);
      toast.error("Failed to submit application. Please try again.");
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
        {!user ? (
          <div className="py-6 text-center">
            <h3 className="text-xl font-bold">Login Required</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Please login to apply for <strong>{internship.role}</strong> at {internship.company}.
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
        ) : done ? (
          <div className="py-6 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-soft">
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mt-4 text-xl font-bold">Application Sent!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You have applied for the <strong>{internship.role}</strong> role at {internship.company}.
              You can track your application status in your dashboard.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Button asChild onClick={() => setOpen(false)}>
                <Link to="/dashboard/internships">Go to Dashboard</Link>
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Apply for {internship.role}</DialogTitle>
              <DialogDescription>
                At {internship.company} · {internship.location} ({internship.mode})
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
              <div className="space-y-1.5">
                <Label htmlFor="resume">Resume Attachment</Label>
                <Input
                  id="resume"
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Submitting application…" : "Submit Application"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
