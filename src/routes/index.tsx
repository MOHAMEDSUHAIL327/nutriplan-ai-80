import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { DietForm } from "@/components/DietForm";
import { Results } from "@/components/Results";
import { generatePlan, type Plan, type UserInput } from "@/lib/diet";
import { Sparkles, Leaf, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "NutriPlan AI — Build your personalized diet plan" },
      { name: "description", content: "Generate a science-backed diet plan with BMI, BMR, TDEE, macros, and tailored meals in seconds." },
    ],
  }),
});

function Index() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (input: UserInput) => {
    setLoading(true);
    setTimeout(() => {
      setPlan(generatePlan(input));
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 700);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {!plan ? (
        <>
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-card">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Powered by science-backed nutrition
            </div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Your personalized <span className="text-gradient-primary">diet plan</span><br className="hidden sm:block" /> in under a minute.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-balance text-base text-muted-foreground">
              NutriPlan AI calculates your BMI, BMR and TDEE, then crafts meals tuned to your goals, preferences and health.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Leaf className="h-3.5 w-3.5 text-primary" /> Goal-based macros</span>
              <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> 100% on-device</span>
            </div>
          </motion.section>

          <DietForm onSubmit={handleSubmit} loading={loading} />
        </>
      ) : (
        <Results plan={plan} onReset={() => setPlan(null)} />
      )}
    </main>
  );
}
