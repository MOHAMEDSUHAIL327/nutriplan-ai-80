import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { Moon, Sun, Trash2, Sparkles, Cloud, Languages, Activity } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Settings — NutriPlan AI" }] }),
});

function SettingsPage() {
  const { theme, toggle } = useTheme();

  const reset = () => {
    localStorage.clear();
    toast.success("All local data cleared");
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-1 text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mb-6 text-sm text-muted-foreground">Preferences and account data stored locally on this device.</p>

      <div className="space-y-4">
        <Card className="rounded-2xl border-border/60 shadow-card">
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div>
              <div className="text-sm font-semibold">Appearance</div>
              <div className="text-xs text-muted-foreground">Toggle light or dark theme.</div>
            </div>
            <Button variant="outline" onClick={toggle}>
              {theme === "dark" ? <><Sun className="h-4 w-4" />Light mode</> : <><Moon className="h-4 w-4" />Dark mode</>}
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-card">
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div>
              <div className="text-sm font-semibold">Clear local data</div>
              <div className="text-xs text-muted-foreground">Removes saved plans and preferences.</div>
            </div>
            <Button variant="outline" onClick={reset}><Trash2 className="h-4 w-4" />Clear</Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-card">
          <CardContent className="p-5">
            <div className="mb-3 text-sm font-semibold">Coming soon</div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Soon icon={Sparkles} label="AI meal recommendations" />
              <Soon icon={Cloud} label="Cloud sync across devices" />
              <Soon icon={Activity} label="Fitness tracker integration" />
              <Soon icon={Languages} label="Multi-language support" />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Soon({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-dashed border-border/80 bg-muted/30 px-3 py-2.5 text-sm text-muted-foreground">
      <Icon className="h-4 w-4 text-primary" />
      {label}
    </div>
  );
}
