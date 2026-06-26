import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { signUp, signInWithGoogle, FirebaseAuthError } from "@/lib/firebase/auth";
import { createUserProfile, getUserProfile } from "@/lib/firebase/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import googleLogo from "@/assets/logos/google.png";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — BharatSkillz" },
      { name: "description", content: "Create your free BharatSkillz account in under 2 minutes." },
      { property: "og:url", content: "/auth/signup" },
    ],
    links: [{ rel: "canonical", href: "/auth/signup" }],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: "/dashboard" });
    }
  }, [user, loading, navigate]);

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
          { line1: "Start Your", line2: "Journey Today" },
          { line1: "Build Skills", line2: "That Get You Hired" },
          { line1: "Real Internships,", line2: "Real Stipends" },
          { line1: "Your Dream Job", line2: "Is One Step Away" },
        ]}
        tagline="Join thousands of students learning industry skills with expert guidance and real internship opportunities."
      />

      {/* Right Side - Signup Form */}
      <div className="flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-foreground">Create your account</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Join thousands of students building amazing careers
            </p>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const name = formData.get("name") as string;
              const email = formData.get("email") as string;
              const password = formData.get("password") as string;
              try {
                const user = await signUp(email, password);
                await createUserProfile(user.uid, name, email);
                toast.success("Account created successfully! Please log in.");
                navigate({
                  to: "/auth/login",
                  search: { email },
                });
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
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                required
                className="h-11 rounded-lg border border-input bg-background px-4 py-2.5 text-base placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="h-11 rounded-lg border border-input bg-background px-4 py-2.5 text-base placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="you@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                className="h-11 rounded-lg border border-input bg-background px-4 py-2.5 text-base placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="At least 8 characters"
              />
            </div>

            <Button
              type="submit"
              className="btn-shine h-11 w-full rounded-lg text-base font-semibold"
            >
              Create account <ArrowRight className="h-4 w-4 ml-2" />
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
                const user = await signInWithGoogle();
                const profile = await getUserProfile(user.uid);
                if (!profile) {
                  await createUserProfile(user.uid, user.displayName || "Google User", user.email || "");
                }
                toast.success("Welcome back!");
                navigate({ to: "/dashboard" });
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
            Already have an account?{" "}
            <Link
              to="/auth/login"
              search={{ email: undefined }}
              className="font-semibold text-primary hover:underline"
            >
              Log in
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
