import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouterState,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
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
    console.error("[Application Error Boundary]:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">This page didn't load</h1>
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
      { title: "Matri Shakti Infrastructure — PM Surya Ghar Solar Installation" },
      {
        name: "description",
        content:
          "UPNEDA registered solar installation partner for PM Surya Ghar Muft Bijli Yojana. Rooftop solar with government subsidy and easy EMI across Uttar Pradesh.",
      },
      { name: "author", content: "Matri Shakti Infrastructure" },
      { property: "og:title", content: "Matri Shakti Infrastructure — Solar Partner" },
      {
        property: "og:description",
        content:
          "Authorized UPNEDA vendor for PM Surya Ghar Muft Bijli Yojana. Save up to two-thirds on your electricity bill.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Matri Shakti Infrastructure" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#f97316" },
      { name: "apple-mobile-web-app-title", content: "Matri Shakti Solar" },
      { name: "application-name", content: "Matri Shakti Solar" },
      // Add Google Search Console verification tag
      {
        name: "google-site-verification",
        content: import.meta.env.VITE_GOOGLE_VERIFICATION_CODE,
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Matri-Shakti Infrastructure",
          description:
            "UPNEDA registered solar installation partner for PM Surya Ghar Muft Bijli Yojana.",
          telephone: ["+91-8948933657", "+91-9305827390"],
          email: "matrishaktiinfrastructure@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Anil Singh, Madhonagar, Paniyara",
            addressLocality: "Maharajganj",
            addressRegion: "Uttar Pradesh",
            addressCountry: "IN",
          },
        }),
      },
      // Add Google Analytics script
      import.meta.env.VITE_GA_ID && {
        async: true,
        src: `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_ID}`,
      },
      import.meta.env.VITE_GA_ID && {
        children: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${import.meta.env.VITE_GA_ID}');
        `,
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
  const { isLoading } = useRouterState();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          {/* Page loading indicator */}
          {isLoading && (
            <div className="fixed top-0 left-0 right-0 h-0.5 z-[99] bg-primary animate-pulse" />
          )}
          <Outlet />
        </main>
        <Footer />
        <FloatingActions />
        <ScrollToTop />
        <Toaster />
        <CookieBanner />
      </div>
    </QueryClientProvider>
  );
}
