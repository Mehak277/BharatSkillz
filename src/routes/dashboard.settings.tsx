import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [prefs, setPrefs] = useState({
    publicProfile: true,
    showProgress: true,
    emailUpdates: true,
    pushUpdates: false,
    marketing: false,
  });

  const toggle = (k: keyof typeof prefs) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-extrabold">Settings</h2>
        <p className="text-sm text-muted-foreground">Account, privacy and notifications.</p>
      </div>

      <section className="glass-card space-y-5 rounded-3xl p-6">
        <div>
          <h3 className="text-base font-semibold">Account</h3>
          <p className="text-xs text-muted-foreground">Update your sign-in credentials.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="current">Current password</Label>
            <Input id="current" type="password" className="mt-1.5" placeholder="••••••••" />
          </div>
          <div>
            <Label htmlFor="new">New password</Label>
            <Input id="new" type="password" className="mt-1.5" placeholder="At least 8 characters" />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => toast.success("Password updated")}>Update password</Button>
        </div>
      </section>

      <section className="glass-card rounded-3xl p-6">
        <h3 className="text-base font-semibold">Privacy</h3>
        <p className="text-xs text-muted-foreground">Control what others can see.</p>
        <ToggleRow
          label="Public profile"
          help="Show your profile to recruiters and hiring partners."
          checked={prefs.publicProfile}
          onChange={() => toggle("publicProfile")}
        />
        <ToggleRow
          label="Show learning progress"
          help="Display course progress on your public profile."
          checked={prefs.showProgress}
          onChange={() => toggle("showProgress")}
        />
      </section>

      <section className="glass-card rounded-3xl p-6">
        <h3 className="text-base font-semibold">Notifications</h3>
        <p className="text-xs text-muted-foreground">Choose how you'd like to be notified.</p>
        <ToggleRow
          label="Email updates"
          help="Course progress, internship status and weekly digest."
          checked={prefs.emailUpdates}
          onChange={() => toggle("emailUpdates")}
        />
        <ToggleRow
          label="Push notifications"
          help="Get real-time updates on your device."
          checked={prefs.pushUpdates}
          onChange={() => toggle("pushUpdates")}
        />
        <ToggleRow
          label="Marketing & offers"
          help="New courses, scholarships and discounts."
          checked={prefs.marketing}
          onChange={() => toggle("marketing")}
        />
      </section>

      <section className="glass-card rounded-3xl border-rose-500/30 p-6">
        <h3 className="text-base font-semibold text-rose-600">Danger zone</h3>
        <p className="text-xs text-muted-foreground">
          Permanently delete your account and all related data.
        </p>
        <Button variant="destructive" className="mt-4" onClick={() => toast.error("Account deletion is disabled in demo mode")}>
          Delete account
        </Button>
      </section>
    </div>
  );
}

function ToggleRow({
  label,
  help,
  checked,
  onChange,
}: {
  label: string;
  help: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="mt-4 flex items-start justify-between gap-4 rounded-xl border border-border/60 bg-background/60 p-4">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{help}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
