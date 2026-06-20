import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: () => (
    <div className="relative min-h-screen bg-background">
      {/* Gradient background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 20%, color-mix(in oklab, var(--primary) 12%, transparent) 0%, transparent 60%), radial-gradient(50% 40% at 100% 80%, color-mix(in oklab, var(--orange) 10%, transparent) 0%, transparent 60%)",
        }}
      />

      {/* Main content - full screen */}
      <Outlet />
    </div>
  ),
});
