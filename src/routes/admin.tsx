import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — BharatSkillz" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = pathname === "/admin";

  if (isLogin) {
    return (
      <div className="grid min-h-screen place-items-center bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 p-4">
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
          <div className="absolute -top-24 left-1/3 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        </div>
        <div className="relative z-10 w-full max-w-md">
          <div className="mb-6 flex items-center justify-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-white">
              BharatSkillz Admin
            </span>
          </div>
          <Outlet />
        </div>
      </div>
    );
  }

  return <Outlet />;
}
