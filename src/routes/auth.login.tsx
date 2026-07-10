import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { signIn, signInWithGoogle, FirebaseAuthError } from "@/lib/firebase/auth";
import { getUserProfile, createUserProfile } from "@/lib/firebase/users";
import googleLogo from "@/assets/logos/google.png";

export const Route = createFileRoute("/auth/login")({
  validateSearch: (search: Record<string, unknown>): { email?: string; redirect?: string } => {
    return {
      email: typeof search.email === "string" ? search.email : undefined,
      redirect: typeof search.redirect === "string" ? search.redirect : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Login — BharatSkillz" },
      { name: "description", content: "Log in to continue your learning journey." },
      { property: "og:url", content: "/auth/login" },
    ],
    links: [{ rel: "canonical", href: "/auth/login" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      window.location.href = search.redirect || "/dashboard";
    }
  }, [user, loading, navigate, search.redirect]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Side - Animated showcase */}
      <AuthLeftPanel
        headlines={[
          { line1: "Launch Your", line2: "Dream Career" },
          { line1: "Learn Skills That", line2: "Actually Matter" },
          { line1: "Get Hired at", line2: "Top Companies" },
          { line1: "Your Future", line2: "Starts Here" },
        ]}
        tagline="Industry-focused courses, paid internships & expert mentorship — everything you need to succeed in tech."
      />

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-foreground">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Log in to continue your learning journey
            </p>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const email = formData.get("email") as string;
              const password = formData.get("password") as string;
              try {
                await signIn(email, password);
                toast.success("Welcome back!");
                window.location.href = search.redirect || "/dashboard";
              } catch (error) {
                if (error instanceof FirebaseAuthError) {
                  toast.error(error.message);
                } else {
                  toast.error("An unexpected error occurred. Please try again.");
                }
              }
            }}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={search.email || ""}
                required
                className="h-11 rounded-lg border border-input bg-background px-4 py-2.5 text-base placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="you@email.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link
                  to="/contact"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Forgot?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="h-11 rounded-lg border border-input bg-background px-4 py-2.5 text-base placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              className="btn-shine h-11 w-full rounded-lg text-base font-semibold"
            >
              Log in <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            variant="outline"
            type="button"
            onClick={async () => {
              try {
                const result = await signInWithGoogle();
                if (result.isNewUser) {
                  await createUserProfile(
                    result.user.uid,
                    result.user.displayName || "User",
                    result.user.email || ""
                  );
                  toast.success("Account created successfully!");
                } else {
                  toast.success("Welcome back!");
                }
                window.location.href = search.redirect || "/dashboard";
              } catch (error) {
                if (error instanceof FirebaseAuthError) {
                  toast.error(error.message);
                } else {
                  toast.error("Google sign-in failed. Please try again.");
                }
              }
            }}
            className="mt-6 h-11 w-full rounded-lg border-input hover:bg-secondary flex items-center justify-center gap-2"
          >
            <img src={googleLogo} alt="Google logo" className="h-6 w-6 object-contain" />
            Continue with Google
          </Button>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link
              to="/auth/signup"
              className="font-semibold text-primary hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Shared animated left panel ───────────────────────────────────────────────
interface Headline { line1: string; line2: string; }

function AuthLeftPanel({ headlines, tagline }: { headlines: Headline[]; tagline: string }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((prev) => (prev + 1) % headlines.length);
        setVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, [headlines.length]);

  const current = headlines[idx];

  return (
    <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary-soft via-secondary to-lavender/30 p-10 relative overflow-hidden">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--primary)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full opacity-20 blur-3xl"
        style={{ background: "oklch(0.65 0.18 30)" }}
      />

      {/* Logo */}
      <div>
        <div className="text-2xl font-extrabold text-primary mb-1">BharatSkillz</div>
        <p className="text-xs text-muted-foreground tracking-widest uppercase font-medium">India's #1 Career Platform</p>
      </div>

      {/* Animated headline */}
      <div className="space-y-5">
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0px)" : "translateY(14px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-4">✦ Your journey begins</p>
          <h2 className="text-5xl font-black leading-[1.1] text-foreground">
            {current.line1}
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, var(--primary) 0%, oklch(0.65 0.18 160) 100%)" }}
            >
              {current.line2}
            </span>
          </h2>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{tagline}</p>

        {/* Indicator dots */}
        <div className="flex gap-2 pt-1">
          {headlines.map((_, i) => (
            <span
              key={i}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === idx ? "2rem" : "0.375rem",
                background: i === idx
                  ? "var(--primary)"
                  : "color-mix(in oklab, var(--primary) 25%, transparent)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { value: "10K+", label: "Students" },
          { value: "480+", label: "Hiring Partners" },
          { value: "₹15K", label: "Avg Stipend" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-white/40 backdrop-blur-sm border border-white/30 p-4 text-center"
          >
            <p className="text-xl font-black text-foreground">{s.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bottom badge */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
        <span>Join 5,000+ students already thriving on BharatSkillz</span>
      </div>
    </div>
  );
}
