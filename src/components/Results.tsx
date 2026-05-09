import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Flame, Gauge, Scale, Target, RotateCcw, Save, Download, Printer, Share2, Sun, Sandwich, Moon, Cookie, Drumstick } from "lucide-react";
import type { Plan, Meal } from "@/lib/diet";
import { toast } from "sonner";

interface Props {
  plan: Plan;
  onReset: () => void;
}

export function Results({ plan, onReset }: Props) {
  const save = () => {
    const list: Plan[] = JSON.parse(localStorage.getItem("nutriplan-plans") || "[]");
    list.unshift(plan);
    localStorage.setItem("nutriplan-plans", JSON.stringify(list.slice(0, 20)));
    toast.success("Plan saved to your history");
  };

  const share = async () => {
    const text = `My NutriPlan: ${plan.targetCalories} kcal • ${plan.protein}g protein • ${plan.carbs}g carbs • ${plan.fat}g fat`;
    try {
      if (navigator.share) await navigator.share({ title: "NutriPlan AI", text });
      else { await navigator.clipboard.writeText(text); toast.success("Copied to clipboard"); }
    } catch {}
  };

  const exportPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    let y = 18;
    doc.setFontSize(18); doc.text("NutriPlan AI - Personalized Diet Plan", 14, y); y += 10;
    doc.setFontSize(11);
    doc.text(`BMI: ${plan.bmi} (${plan.bmiCategory})  |  BMR: ${plan.bmr} kcal  |  TDEE: ${plan.tdee} kcal`, 14, y); y += 8;
    doc.text(`Target: ${plan.targetCalories} kcal  |  Protein ${plan.protein}g  |  Carbs ${plan.carbs}g  |  Fat ${plan.fat}g`, 14, y); y += 10;
    (Object.keys(plan.meals) as (keyof Plan["meals"])[]).forEach((cat) => {
      doc.setFontSize(13); doc.text(cat.toUpperCase(), 14, y); y += 6;
      doc.setFontSize(10);
      plan.meals[cat].forEach((m) => {
        doc.text(`• ${m.name} — ${m.portion} (${m.calories} kcal, P${m.protein} C${m.carbs} F${m.fat})`, 16, y);
        y += 6;
        if (y > 280) { doc.addPage(); y = 18; }
      });
      y += 4;
    });
    doc.save(`nutriplan-${Date.now()}.pdf`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Your Personalized Plan</h2>
          <p className="text-sm text-muted-foreground">Generated {new Date(plan.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={save}><Save className="h-4 w-4" />Save</Button>
          <Button variant="outline" size="sm" onClick={exportPDF}><Download className="h-4 w-4" />PDF</Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="h-4 w-4" />Print</Button>
          <Button variant="outline" size="sm" onClick={share}><Share2 className="h-4 w-4" />Share</Button>
          <Button size="sm" onClick={onReset} className="bg-gradient-primary"><RotateCcw className="h-4 w-4" />New Plan</Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Stat icon={Scale} label="BMI" value={plan.bmi.toString()} sub={plan.bmiCategory} />
        <Stat icon={Gauge} label="BMR" value={plan.bmr.toLocaleString()} sub="kcal/day" />
        <Stat icon={Activity} label="TDEE" value={plan.tdee.toLocaleString()} sub="kcal/day" />
        <Stat icon={Target} label="Target" value={plan.targetCalories.toLocaleString()} sub="kcal/day" highlight />
        <Stat icon={Flame} label="Category" value={plan.bmiCategory} sub={`BMI ${plan.bmi}`} />
      </div>

      <Card className="rounded-2xl border-border/60 shadow-card">
        <CardContent className="p-5">
          <h3 className="mb-4 text-sm font-semibold">Macronutrients</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Macro label="Protein" grams={plan.protein} kcal={plan.protein * 4} pct={30} color="oklch(0.62 0.17 145)" />
            <Macro label="Carbs" grams={plan.carbs} kcal={plan.carbs * 4} pct={40} color="oklch(0.7 0.18 60)" />
            <Macro label="Fat" grams={plan.fat} kcal={plan.fat * 9} pct={30} color="oklch(0.65 0.22 20)" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <MealGroup icon={Sun} title="Breakfast" meals={plan.meals.breakfast} />
        <MealGroup icon={Sandwich} title="Lunch" meals={plan.meals.lunch} />
        <MealGroup icon={Drumstick} title="Dinner" meals={plan.meals.dinner} />
        <MealGroup icon={Cookie} title="Snacks" meals={plan.meals.snacks} />
      </div>
    </motion.div>
  );
}

function Stat({ icon: Icon, label, value, sub, highlight }: { icon: React.ElementType; label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <Card className={`rounded-2xl border-border/60 shadow-card ${highlight ? "bg-gradient-primary text-primary-foreground border-transparent" : ""}`}>
      <CardContent className="p-4">
        <div className={`flex items-center gap-2 text-xs ${highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
          <Icon className="h-3.5 w-3.5" /> {label}
        </div>
        <div className="mt-1.5 text-2xl font-semibold tracking-tight">{value}</div>
        {sub && <div className={`text-xs ${highlight ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{sub}</div>}
      </CardContent>
    </Card>
  );
}

function Macro({ label, grams, kcal, pct, color }: { label: string; grams: number; kcal: number; pct: number; color: string }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">{pct}% • {kcal} kcal</span>
      </div>
      <div className="text-2xl font-semibold">{grams}<span className="ml-1 text-sm font-normal text-muted-foreground">g</span></div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct * 2}%` }} transition={{ duration: 0.6 }} style={{ background: color, height: "100%" }} />
      </div>
    </div>
  );
}

function MealGroup({ icon: Icon, title, meals }: { icon: React.ElementType; title: string; meals: Meal[] }) {
  return (
    <Card className="rounded-2xl border-border/60 shadow-card">
      <CardContent className="p-5">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-primary"><Icon className="h-4 w-4" /></span>
          {title}
        </h3>
        {meals.length === 0 ? (
          <p className="text-sm text-muted-foreground">No matching meals — try adjusting your filters.</p>
        ) : (
          <ul className="space-y-3">
            {meals.map((m, i) => (
              <li key={i} className="rounded-xl border border-border/60 bg-muted/30 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.portion}</div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="font-semibold text-primary">{m.calories} kcal</div>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                  <span className="rounded-full bg-background px-2 py-0.5">P {m.protein}g</span>
                  <span className="rounded-full bg-background px-2 py-0.5">C {m.carbs}g</span>
                  <span className="rounded-full bg-background px-2 py-0.5">F {m.fat}g</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
