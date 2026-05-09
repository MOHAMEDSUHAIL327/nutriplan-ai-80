import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, History, Drumstick } from "lucide-react";
import type { Plan } from "@/lib/diet";
import { toast } from "sonner";

export const Route = createFileRoute("/saved")({
  component: SavedPage,
  head: () => ({ meta: [{ title: "Saved Plans — NutriPlan AI" }] }),
});

function SavedPage() {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    setPlans(JSON.parse(localStorage.getItem("nutriplan-plans") || "[]"));
  }, []);

  const remove = (i: number) => {
    const next = plans.filter((_, idx) => idx !== i);
    setPlans(next);
    localStorage.setItem("nutriplan-plans", JSON.stringify(next));
    toast.success("Plan removed");
  };

  const clearAll = () => {
    setPlans([]);
    localStorage.removeItem("nutriplan-plans");
    toast.success("Cleared all saved plans");
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Saved plans</h1>
          <p className="text-sm text-muted-foreground">Your last {plans.length} saved diet plans.</p>
        </div>
        {plans.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearAll}><Trash2 className="h-4 w-4" />Clear all</Button>
        )}
      </div>

      {plans.length === 0 ? (
        <Card className="rounded-2xl border-border/60 shadow-card">
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary"><History className="h-6 w-6" /></span>
            <h2 className="text-lg font-semibold">No saved plans yet</h2>
            <p className="max-w-sm text-sm text-muted-foreground">Generate your first plan and click Save to keep it here for quick access.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {plans.map((p, i) => (
            <Card key={i} className="rounded-2xl border-border/60 shadow-card">
              <CardContent className="p-5">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleString()}</div>
                    <div className="mt-0.5 text-lg font-semibold">{p.targetCalories.toLocaleString()} kcal target</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => remove(i)} aria-label="Remove">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <Stat k="BMI" v={p.bmi.toString()} />
                  <Stat k="BMR" v={p.bmr.toString()} />
                  <Stat k="TDEE" v={p.tdee.toString()} />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
                  <Pill>P {p.protein}g</Pill><Pill>C {p.carbs}g</Pill><Pill>F {p.fat}g</Pill>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Drumstick className="h-3.5 w-3.5" />
                  {p.meals.breakfast.length + p.meals.lunch.length + p.meals.dinner.length + p.meals.snacks.length} meals planned
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg bg-muted/50 py-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{k}</div>
      <div className="text-sm font-semibold">{v}</div>
    </div>
  );
}
function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-muted px-2 py-0.5">{children}</span>;
}
