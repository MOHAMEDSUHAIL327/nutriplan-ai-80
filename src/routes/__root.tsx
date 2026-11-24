import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  useLocation,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider, useTheme } from "@/lib/theme";
import { Header } from "@/components/Header";
import { useCapacitor } from "@/hooks/use-capacitor";
import { Home, History, Settings, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Go home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-6 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "NutriPlan AI — Personalized Diet Generator" },
      { name: "description", content: "Get a personalized diet plan with BMI, BMR, TDEE and macro breakdown tailored to your goals, dietary preferences, and health conditions." },
      { property: "og:title", content: "NutriPlan AI — Personalized Diet Generator" },
      { property: "og:description", content: "Personalized meal plans powered by science-backed nutrition calculations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function BottomNav() {
  const loc = useLocation();
  const { theme, toggle } = useTheme();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/80 bg-background/95 backdrop-blur-xl shadow-lg pb-safe">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        <Link
          to="/"
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-xs transition-colors",
            loc.pathname === "/" ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link
          to="/saved"
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-xs transition-colors",
            loc.pathname === "/saved" ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <History className="h-5 w-5" />
          <span>Saved</span>
        </Link>
        <Link
          to="/settings"
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-xs transition-colors",
            loc.pathname === "/settings" ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
        <button
          type="button"
          onClick={toggle}
          className="flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {theme === "dark" ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
      </div>
    </nav>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useCapacitor();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-soft pb-24">
          <Header />
          <Outlet />
          <BottomNav />
          <Toaster richColors position="top-center" />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
