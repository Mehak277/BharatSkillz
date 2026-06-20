import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile, updateUserProfile } from "@/lib/firebase/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/dashboard/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const { profile, loading } = useUserProfile(user?.uid);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    bio: "",
    skills: "",
    education: "",
    linkedin: "",
    github: "",
    twitter: "",
  });

  // Sync form with profile once loaded
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name ?? "",
        phone: profile.phone ?? "",
        bio: profile.bio ?? "",
        skills: (profile.skills ?? []).join(", "),
        education: profile.education ?? "",
        linkedin: profile.social?.linkedin ?? "",
        github: profile.social?.github ?? "",
        twitter: profile.social?.twitter ?? "",
      });
    } else if (!loading && user) {
      // Fallback from Firebase Auth user object
      setForm((f) => ({
        ...f,
        name: user.displayName ?? user.email?.split("@")[0] ?? "",
      }));
    }
  }, [profile, loading, user]);

  const update =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const getInitials = (nameStr: string) => {
    if (!nameStr) return "U";
    return nameStr
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getJoinedDate = (createdAt: any) => {
    if (!createdAt) return "Recently";
    try {
      const date =
        typeof createdAt.toDate === "function"
          ? createdAt.toDate()
          : new Date(createdAt);
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        name: form.name,
        phone: form.phone,
        bio: form.bio,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        education: form.education,
        social: {
          linkedin: form.linkedin,
          github: form.github,
          twitter: form.twitter,
        },
      });
      toast.success("Profile saved", {
        description: "Your changes have been updated.",
      });
    } catch (err) {
      toast.error("Failed to save", {
        description: "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const displayName = form.name || user?.email?.split("@")[0] || "User";
  const avatarInitials = getInitials(displayName);
  const joinedDate = getJoinedDate(profile?.createdAt);

  return (
    <div className="space-y-6">
      <div className="glass-card flex flex-col items-start gap-5 rounded-3xl p-6 sm:flex-row sm:items-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-peach/20 border border-peach/40 text-xl font-bold text-orange-foreground shadow-sm">
          {avatarInitials}
        </div>
        <div className="flex-1">
          <h2 className="font-display text-2xl font-extrabold">{displayName}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Member since {joinedDate}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="glass-card space-y-6 rounded-3xl p-6">
        <div>
          <h3 className="text-base font-semibold">Basic information</h3>
          <p className="text-xs text-muted-foreground">
            This will be visible on your public profile.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={update("name")}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user?.email ?? ""}
              disabled
              className="mt-1.5 opacity-60 cursor-not-allowed"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={update("phone")}
              className="mt-1.5"
              placeholder="+91 00000 00000"
            />
          </div>
          <div>
            <Label htmlFor="education">Education</Label>
            <Input
              id="education"
              value={form.education}
              onChange={update("education")}
              className="mt-1.5"
              placeholder="B.Tech CS, IIT Delhi (2025)"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            rows={3}
            value={form.bio}
            onChange={update("bio")}
            className="mt-1.5"
            placeholder="Tell us a bit about yourself..."
          />
        </div>

        <div>
          <Label htmlFor="skills">Skills (comma separated)</Label>
          <Input
            id="skills"
            value={form.skills}
            onChange={update("skills")}
            className="mt-1.5"
            placeholder="React, Python, SQL..."
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {form.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
              .map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {s}
                </span>
              ))}
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold">Social links</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={form.linkedin}
                onChange={update("linkedin")}
                className="mt-1.5"
                placeholder="https://linkedin.com/in/you"
              />
            </div>
            <div>
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                value={form.github}
                onChange={update("github")}
                className="mt-1.5"
                placeholder="https://github.com/you"
              />
            </div>
            <div>
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={form.twitter}
                onChange={update("twitter")}
                className="mt-1.5"
                placeholder="https://twitter.com/you"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={() => {
            if (profile) {
              setForm({
                name: profile.name ?? "",
                phone: profile.phone ?? "",
                bio: profile.bio ?? "",
                skills: (profile.skills ?? []).join(", "),
                education: profile.education ?? "",
                linkedin: profile.social?.linkedin ?? "",
                github: profile.social?.github ?? "",
                twitter: profile.social?.twitter ?? "",
              });
            }
          }}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
