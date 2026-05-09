import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Activity as ActIcon, Target, Salad, HeartPulse, AlertTriangle, Sparkles, Loader2 } from "lucide-react";
import type { Activity, Allergy, Condition, Diet, Gender, Goal, UserInput } from "@/lib/diet";

const schema = z.object({
  age: z.number().int().min(10, "Age must be at least 10").max(100, "Age must be ≤ 100"),
  gender: z.enum(["male", "female"]),
  height: z.number().min(100, "Height must be ≥ 100cm").max(250, "Height must be ≤ 250cm"),
  weight: z.number().min(25, "Weight must be ≥ 25kg").max(300, "Weight must be ≤ 300kg"),
  activity: z.enum(["sedentary", "light", "moderate", "very", "extreme"]),
  goal: z.enum(["loss", "gain", "maintain", "muscle"]),
  diet: z.enum(["vegetarian", "non-vegetarian", "vegan", "keto", "high-protein"]),
});

const conditions: { id: Condition; label: string }[] = [
  { id: "diabetes", label: "Diabetes" }, { id: "hypertension", label: "Hypertension" },
  { id: "heart", label: "Heart Disease" }, { id: "kidney", label: "Kidney Disease" },
  { id: "thyroid", label: "Thyroid Disorder" }, { id: "celiac", label: "Celiac Disease" },
  { id: "pcos", label: "PCOS" },
];

const allergies: { id: Allergy; label: string }[] = [
  { id: "nuts", label: "Nuts" }, { id: "lactose", label: "Lactose" }, { id: "gluten", label: "Gluten" },
  { id: "soy", label: "Soy" }, { id: "eggs", label: "Eggs" }, { id: "shellfish", label: "Shellfish" }, { id: "fish", label: "Fish" },
];

interface Props {
  onSubmit: (input: UserInput) => void;
  loading?: boolean;
}

export function DietForm({ onSubmit, loading }: Props) {
  const [age, setAge] = useState("28");
  const [gender, setGender] = useState<Gender>("male");
  const [height, setHeight] = useState("175");
  const [weight, setWeight] = useState("72");
  const [activity, setActivity] = useState<Activity>("moderate");
  const [goal, setGoal] = useState<Goal>("maintain");
  const [diet, setDiet] = useState<Diet>("non-vegetarian");
  const [conds, setConds] = useState<Condition[]>([]);
  const [allergs, setAllergs] = useState<Allergy[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggle = <T extends string>(arr: T[], setArr: (v: T[]) => void, v: T) =>
    setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({
      age: Number(age), gender, height: Number(height), weight: Number(weight),
      activity, goal, diet,
    });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[i.path[0] as string] = i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    onSubmit({ ...parsed.data, conditions: conds, allergies: allergs });
  };

  return (
    <motion.form
      onSubmit={handle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      <Section icon={<User className="h-4 w-4" />} title="Personal Information">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Age" error={errors.age}>
            <Input type="number" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} />
          </Field>
          <Field label="Gender">
            <Select value={gender} onValueChange={(v) => setGender(v as Gender)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Height (cm)" error={errors.height}>
            <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          </Field>
          <Field label="Weight (kg)" error={errors.weight}>
            <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </Field>
        </div>
      </Section>

      <div className="grid gap-5 md:grid-cols-3">
        <Section icon={<ActIcon className="h-4 w-4" />} title="Activity Level">
          <Select value={activity} onValueChange={(v) => setActivity(v as Activity)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary</SelectItem>
              <SelectItem value="light">Lightly Active</SelectItem>
              <SelectItem value="moderate">Moderately Active</SelectItem>
              <SelectItem value="very">Very Active</SelectItem>
              <SelectItem value="extreme">Extremely Active</SelectItem>
            </SelectContent>
          </Select>
        </Section>
        <Section icon={<Target className="h-4 w-4" />} title="Goal">
          <Select value={goal} onValueChange={(v) => setGoal(v as Goal)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="loss">Weight Loss</SelectItem>
              <SelectItem value="gain">Weight Gain</SelectItem>
              <SelectItem value="maintain">Maintenance</SelectItem>
              <SelectItem value="muscle">Muscle Gain</SelectItem>
            </SelectContent>
          </Select>
        </Section>
        <Section icon={<Salad className="h-4 w-4" />} title="Dietary Preference">
          <Select value={diet} onValueChange={(v) => setDiet(v as Diet)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
              <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
              <SelectItem value="vegan">Vegan</SelectItem>
              <SelectItem value="keto">Keto</SelectItem>
              <SelectItem value="high-protein">High Protein</SelectItem>
            </SelectContent>
          </Select>
        </Section>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Section icon={<HeartPulse className="h-4 w-4" />} title="Health Conditions">
          <CheckGrid items={conditions} selected={conds} onToggle={(v) => toggle(conds, setConds, v)} />
        </Section>
        <Section icon={<AlertTriangle className="h-4 w-4" />} title="Allergies">
          <CheckGrid items={allergies} selected={allergs} onToggle={(v) => toggle(allergs, setAllergs, v)} />
        </Section>
      </div>

      <Button type="submit" disabled={loading} size="lg" className="w-full h-14 text-base rounded-2xl bg-gradient-primary shadow-soft hover:opacity-95">
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
        {loading ? "Generating your plan..." : "Generate My Diet Plan"}
      </Button>
    </motion.form>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-2xl border-border/60 shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-primary">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function CheckGrid<T extends string>({ items, selected, onToggle }: { items: { id: T; label: string }[]; selected: T[]; onToggle: (v: T) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((it) => {
        const active = selected.includes(it.id);
        return (
          <label
            key={it.id}
            className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-colors ${
              active ? "border-primary bg-accent text-foreground" : "border-border hover:bg-muted/50"
            }`}
          >
            <Checkbox checked={active} onCheckedChange={() => onToggle(it.id)} />
            <span>{it.label}</span>
          </label>
        );
      })}
    </div>
  );
}
