import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
      <h1 className="text-2xl font-extrabold text-white">Admin Login</h1>
      <p className="mt-1 text-sm text-white/60">Restricted access. Authorized administrators only.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Welcome, admin");
          navigate({ to: "/admin/dashboard" });
        }}
        className="mt-6 space-y-4"
      >
        <div>
          <Label htmlFor="admin-email" className="text-white/80">Email</Label>
          <Input
            id="admin-email"
            type="email"
            required
            placeholder="admin@bharatskillz.in"
            className="mt-1.5 border-white/15 bg-white/10 text-white placeholder:text-white/40"
          />
        </div>
        <div>
          <Label htmlFor="admin-password" className="text-white/80">Password</Label>
          <Input
            id="admin-password"
            type="password"
            required
            placeholder="••••••••"
            className="mt-1.5 border-white/15 bg-white/10 text-white placeholder:text-white/40"
          />
        </div>
        <Button type="submit" className="h-11 w-full">
          <Lock className="h-4 w-4" /> Sign in to admin
        </Button>
      </form>
      <p className="mt-6 text-center text-xs text-white/40">
        Admin accounts are provisioned manually. No public signup.
      </p>
    </div>
  );
}
