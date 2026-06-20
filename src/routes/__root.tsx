import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Newsletter } from "@/components/site/Newsletter";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-extrabold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "BharatSkillz — Learn Skills. Gain Experience. Build Your Career." },
      {
        name: "description",
        content:
          "India's premium career platform. Industry-grade courses, paid internships, expert mentors, certifications and placement support.",
      },
      { name: "author", content: "BharatSkillz" },
      { property: "og:title", content: "BharatSkillz — Learn Skills. Gain Experience. Build Your Career." },
      {
        property: "og:description",
        content:
          "Courses, internships, mentorship and placement support for India's next generation of talent.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "BharatSkillz" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@BharatSkillz" },
      { name: "twitter:title", content: "BharatSkillz — Learn Skills. Gain Experience. Build Your Career." },
      { name: "description", content: "BharatSkillz Ascent is a modern EdTech platform offering industry-focused courses, internships, and career services." },
      { property: "og:description", content: "BharatSkillz Ascent is a modern EdTech platform offering industry-focused courses, internships, and career services." },
      { name: "twitter:description", content: "BharatSkillz Ascent is a modern EdTech platform offering industry-focused courses, internships, and career services." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4e96d6a9-8f12-437b-b195-7300258f724e/id-preview-dc1dd906--9cae82a6-ed83-4123-896c-68c7c1aa114e.lovable.app-1781347082026.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4e96d6a9-8f12-437b-b195-7300258f724e/id-preview-dc1dd906--9cae82a6-ed83-4123-896c-68c7c1aa114e.lovable.app-1781347082026.png" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "BharatSkillz",
          url: "/",
          description:
            "India's premium career platform — courses, internships, mentorship and placement support.",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");
  const isAuth = pathname.startsWith("/auth");
  const hideLayout = isDashboard || isAdmin || isAuth;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex min-h-screen flex-col">
          {!hideLayout && <SiteHeader />}
          <main className="flex-1">
            <Outlet />
          </main>
          {!hideLayout && (
            <>
              <Newsletter />
              <SiteFooter />
            </>
          )}
        </div>
        <Toaster richColors position="top-center" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
