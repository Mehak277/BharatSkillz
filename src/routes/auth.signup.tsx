import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { signUp, signInWithGoogle, FirebaseAuthError } from "@/lib/firebase/auth";
import { createUserProfile, getUserProfile } from "@/lib/firebase/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, GraduationCap, Users, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import googleLogo from "@/assets/logos/google.png";

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
  
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Side - Platform showcase */}
      <div className="hidden flex-col justify-between bg-gradient-to-br from-primary-soft via-secondary to-lavender/30 p-8 lg:flex">
        <div>
          <div className="text-2xl font-extrabold text-primary mb-2">BharatSkillz</div>
          <p className="text-sm text-muted-foreground">Build your career with us</p>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold text-foreground">
            Start Your Journey
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Join thousands of students learning industry skills with expert guidance and real internship opportunities.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-2xl bg-white/40 backdrop-blur-sm p-4 border border-white/20">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                <GraduationCap className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">Learn from Experts</h3>
                <p className="text-xs text-muted-foreground mt-1">1:1 mentorship from FAANG engineers</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 rounded-2xl bg-white/40 backdrop-blur-sm p-4 border border-white/20">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange/20 to-orange/10">
                <Briefcase className="h-4 w-4 text-orange" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">Paid Internships</h3>
                <p className="text-xs text-muted-foreground mt-1">Real internships with competitive stipends</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 rounded-2xl bg-white/40 backdrop-blur-sm p-4 border border-white/20">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gold/20 to-gold/10">
                <Users className="h-4 w-4 text-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">Placement Support</h3>
                <p className="text-xs text-muted-foreground mt-1">Guidance till you're hired by top companies</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <span>Join 5000+ successful students</span>
        </div>
      </div>

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
