import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  User,
  BookOpen,
  Briefcase,
  TrendingUp,
  Award,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/lib/firebase/users";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/firebase/auth";
import { useNavigate } from "@tanstack/react-router";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/profile", label: "Profile", icon: User },
  { to: "/dashboard/courses", label: "My Courses", icon: BookOpen },
  { to: "/dashboard/internships", label: "Internships", icon: Briefcase },
  { to: "/dashboard/progress", label: "Progress", icon: TrendingUp },
  { to: "/dashboard/certificates", label: "Certificates", icon: Award },
  { to: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const { user } = useAuth();
  const { profile } = useUserProfile(user?.uid);

  // Derive display values from real user data
  const displayName = profile?.name || user?.displayName || user?.email?.split("@")[0] || "User";
  const displayEmail = user?.email ?? "";

  useEffect(() => {
    if (profile?.status === "Suspended") {
      signOut().then(() => {
        navigate({ to: "/" });
      });
    }
  }, [profile?.status, navigate]);

  const getInitials = (nameStr: string) => {
    if (!nameStr) return "U";
    return nameStr
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };
  const avatarInitials = getInitials(displayName);

  // No mock notifications — unread count is 0 until real sub-collection is wired
  const unread = 0;

  const current = NAV.find((n) => (n.exact ? pathname === n.to : pathname.startsWith(n.to)));

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate({ to: "/" });
    } catch {
      navigate({ to: "/" });
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-secondary/40 via-background to-primary-soft/30">
      {/* decorative blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-72 transform border-r border-border/60 bg-card/70 p-5 backdrop-blur-xl transition-transform lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          )}
        >
          <div className="flex h-full flex-col">
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="font-display text-lg font-extrabold tracking-tight">
                BharatSkillz
              </span>
            </Link>

            {/* Real user card */}
            <div className="mt-6 rounded-2xl border border-border/60 bg-background/60 p-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-peach/20 border border-peach/40 text-sm font-bold text-orange-foreground shrink-0">
                  {avatarInitials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{displayName}</p>
                  <p className="truncate text-xs text-muted-foreground">{displayEmail}</p>
                </div>
              </div>
            </div>

            <nav className="mt-6 flex-1 space-y-1">
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to as "/dashboard"}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.to === "/dashboard/notifications" && unread > 0 && (
                      <span
                        className={cn(
                          "ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                          active
                            ? "bg-primary-foreground text-primary"
                            : "bg-accent text-accent-foreground",
                        )}
                      >
                        {unread}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={handleSignOut}
              className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground w-full text-left"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </aside>

        {open && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Main */}
        <div className="flex min-h-screen w-full flex-1 flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-xl">
            <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
              <button
                type="button"
                aria-label="Toggle menu"
                onClick={() => setOpen((v) => !v)}
                className="grid h-10 w-10 place-items-center rounded-md text-foreground lg:hidden"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              <div>
                <p className="text-xs text-muted-foreground">Dashboard</p>
                <h1 className="text-sm font-semibold leading-tight">
                  {current?.label ?? "Overview"}
                </h1>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <div className="relative hidden md:block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search courses, internships…"
                    className="h-10 w-72 rounded-full border border-border/60 bg-background/80 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>
                <Link
                  to="/dashboard/notifications"
                  className="relative grid h-10 w-10 place-items-center rounded-full border border-border/60 bg-background/80 text-foreground hover:bg-secondary"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unread > 0 && (
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
                  )}
                </Link>
                <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
                  <Link to="/courses">Browse courses</Link>
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
