export type Gender = "male" | "female";
export type Activity = "sedentary" | "light" | "moderate" | "very" | "extreme";
export type Goal = "loss" | "gain" | "maintain" | "muscle";
export type Diet = "vegetarian" | "non-vegetarian" | "vegan" | "keto" | "high-protein";
export type Condition = "diabetes" | "hypertension" | "heart" | "kidney" | "thyroid" | "celiac" | "pcos";
export type Allergy = "nuts" | "lactose" | "gluten" | "soy" | "eggs" | "shellfish" | "fish";

export interface UserInput {
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  activity: Activity;
  goal: Goal;
  diet: Diet;
  conditions: Condition[];
  allergies: Allergy[];
}

export interface Meal {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: { diet: Diet[]; allergens: Allergy[]; avoid?: Condition[] };
}

export interface Plan {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: { breakfast: Meal[]; lunch: Meal[]; dinner: Meal[]; snacks: Meal[] };
  createdAt: string;
}

const ACTIVITY_MULT: Record<Activity, number> = {
  sedentary: 1.2, light: 1.375, moderate: 1.55, very: 1.725, extreme: 1.9,
};

export function calcBMI(weight: number, heightCm: number) {
  const h = heightCm / 100;
  return weight / (h * h);
}

export function bmiCategory(bmi: number) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

export function calcBMR(u: UserInput) {
  const base = 10 * u.weight + 6.25 * u.height - 5 * u.age;
  return u.gender === "male" ? base + 5 : base - 161;
}

export function calcTDEE(bmr: number, activity: Activity) {
  return bmr * ACTIVITY_MULT[activity];
}

export function applyGoal(tdee: number, goal: Goal) {
  switch (goal) {
    case "loss": return tdee - 500;
    case "gain": return tdee + 500;
    case "muscle": return tdee + 300;
    default: return tdee;
  }
}

export function macros(targetCalories: number) {
  const protein = Math.round((targetCalories * 0.3) / 4);
  const carbs = Math.round((targetCalories * 0.4) / 4);
  const fat = Math.round((targetCalories * 0.3) / 9);
  return { protein, carbs, fat };
}

// === Meal database ===
type MealCat = "breakfast" | "lunch" | "dinner" | "snacks";

const ALL: Record<MealCat, Meal[]> = {
  breakfast: [
    { name: "Oats with milk and banana", portion: "1 bowl", calories: 350, protein: 12, carbs: 60, fat: 7, tags: { diet: ["vegetarian", "high-protein"], allergens: ["lactose", "gluten"] } },
    { name: "Egg white omelette with vegetables", portion: "3 eggs", calories: 220, protein: 24, carbs: 6, fat: 10, tags: { diet: ["non-vegetarian", "high-protein", "keto"], allergens: ["eggs"] } },
    { name: "Chia seed pudding with berries", portion: "1 cup", calories: 280, protein: 8, carbs: 30, fat: 14, tags: { diet: ["vegan", "vegetarian"], allergens: [] } },
    { name: "Greek yogurt with honey & nuts", portion: "200g", calories: 320, protein: 18, carbs: 28, fat: 14, tags: { diet: ["vegetarian", "high-protein"], allergens: ["lactose", "nuts"] } },
    { name: "Avocado toast with poached egg", portion: "2 slices", calories: 380, protein: 16, carbs: 32, fat: 22, tags: { diet: ["vegetarian"], allergens: ["gluten", "eggs"] } },
    { name: "Tofu scramble with spinach", portion: "1 plate", calories: 290, protein: 22, carbs: 12, fat: 18, tags: { diet: ["vegan", "vegetarian", "high-protein", "keto"], allergens: ["soy"] } },
    { name: "Smoked salmon & avocado bowl", portion: "1 bowl", calories: 360, protein: 26, carbs: 8, fat: 24, tags: { diet: ["non-vegetarian", "keto", "high-protein"], allergens: ["fish"] } },
    { name: "Quinoa porridge with almond milk", portion: "1 bowl", calories: 320, protein: 10, carbs: 50, fat: 9, tags: { diet: ["vegan", "vegetarian"], allergens: ["nuts"] } },
  ],
  lunch: [
    { name: "Grilled fish with steamed vegetables", portion: "200g fish", calories: 450, protein: 38, carbs: 22, fat: 20, tags: { diet: ["non-vegetarian", "high-protein", "keto"], allergens: ["fish"] } },
    { name: "Chicken & brown rice bowl with salad", portion: "1 bowl", calories: 520, protein: 40, carbs: 55, fat: 14, tags: { diet: ["non-vegetarian", "high-protein"], allergens: [] } },
    { name: "Paneer stir-fry with quinoa", portion: "1 plate", calories: 480, protein: 28, carbs: 45, fat: 20, tags: { diet: ["vegetarian", "high-protein"], allergens: ["lactose"] } },
    { name: "Quinoa Buddha bowl with chickpeas", portion: "1 bowl", calories: 460, protein: 18, carbs: 65, fat: 14, tags: { diet: ["vegan", "vegetarian"], allergens: [] } },
    { name: "Lentil dal with chapati & salad", portion: "1 plate", calories: 430, protein: 20, carbs: 60, fat: 10, tags: { diet: ["vegan", "vegetarian"], allergens: ["gluten"] } },
    { name: "Shrimp avocado salad", portion: "1 large bowl", calories: 380, protein: 32, carbs: 12, fat: 22, tags: { diet: ["non-vegetarian", "keto", "high-protein"], allergens: ["shellfish"] } },
    { name: "Turkey lettuce wraps", portion: "4 wraps", calories: 360, protein: 34, carbs: 14, fat: 18, tags: { diet: ["non-vegetarian", "keto", "high-protein"], allergens: [] } },
    { name: "Tofu & vegetable stir-fry with rice", portion: "1 plate", calories: 470, protein: 22, carbs: 60, fat: 14, tags: { diet: ["vegan", "vegetarian", "high-protein"], allergens: ["soy"] } },
  ],
  dinner: [
    { name: "Baked chicken with quinoa & greens", portion: "180g chicken", calories: 480, protein: 42, carbs: 38, fat: 16, tags: { diet: ["non-vegetarian", "high-protein"], allergens: [] } },
    { name: "Lean beef with roasted vegetables", portion: "180g beef", calories: 520, protein: 40, carbs: 25, fat: 26, tags: { diet: ["non-vegetarian", "keto", "high-protein"], allergens: [] } },
    { name: "Chapati with dal and salad", portion: "2 chapati", calories: 420, protein: 18, carbs: 60, fat: 10, tags: { diet: ["vegan", "vegetarian"], allergens: ["gluten"] } },
    { name: "Grilled tofu with sautéed greens", portion: "200g tofu", calories: 380, protein: 28, carbs: 14, fat: 22, tags: { diet: ["vegan", "vegetarian", "keto", "high-protein"], allergens: ["soy"] } },
    { name: "Salmon with asparagus & sweet potato", portion: "180g salmon", calories: 510, protein: 36, carbs: 32, fat: 22, tags: { diet: ["non-vegetarian", "high-protein"], allergens: ["fish"] } },
    { name: "Cauliflower rice & paneer bowl", portion: "1 bowl", calories: 360, protein: 22, carbs: 16, fat: 22, tags: { diet: ["vegetarian", "keto", "high-protein"], allergens: ["lactose"] } },
    { name: "Vegetable stew with crusty bread", portion: "1 bowl", calories: 380, protein: 12, carbs: 60, fat: 10, tags: { diet: ["vegan", "vegetarian"], allergens: ["gluten"] } },
    { name: "Egg curry with brown rice", portion: "1 plate", calories: 470, protein: 24, carbs: 50, fat: 18, tags: { diet: ["vegetarian", "non-vegetarian", "high-protein"], allergens: ["eggs"] } },
  ],
  snacks: [
    { name: "Mixed nuts and fruits", portion: "30g nuts + fruit", calories: 220, protein: 6, carbs: 22, fat: 14, tags: { diet: ["vegan", "vegetarian", "keto"], allergens: ["nuts"] } },
    { name: "Apple with peanut butter", portion: "1 apple, 2 tbsp", calories: 250, protein: 8, carbs: 28, fat: 14, tags: { diet: ["vegan", "vegetarian"], allergens: ["nuts"] } },
    { name: "Hummus with carrot sticks", portion: "100g hummus", calories: 200, protein: 8, carbs: 22, fat: 10, tags: { diet: ["vegan", "vegetarian"], allergens: [] } },
    { name: "Cottage cheese with berries", portion: "150g", calories: 180, protein: 18, carbs: 14, fat: 6, tags: { diet: ["vegetarian", "high-protein"], allergens: ["lactose"] } },
    { name: "Boiled eggs & cucumber", portion: "2 eggs", calories: 180, protein: 14, carbs: 4, fat: 12, tags: { diet: ["vegetarian", "non-vegetarian", "keto", "high-protein"], allergens: ["eggs"] } },
    { name: "Roasted chickpeas", portion: "50g", calories: 190, protein: 10, carbs: 28, fat: 4, tags: { diet: ["vegan", "vegetarian"], allergens: [] } },
    { name: "Protein smoothie", portion: "1 glass", calories: 240, protein: 26, carbs: 18, fat: 6, tags: { diet: ["vegetarian", "high-protein"], allergens: ["lactose"] } },
    { name: "Avocado on rice cakes", portion: "2 cakes", calories: 210, protein: 4, carbs: 22, fat: 12, tags: { diet: ["vegan", "vegetarian"], allergens: [] } },
  ],
};

// Foods to avoid for conditions
const AVOID_BY_CONDITION: Record<Condition, (m: Meal) => boolean> = {
  diabetes: (m) => m.carbs > 55,
  hypertension: (m) => /salmon|smoked|beef/i.test(m.name) && m.fat > 22,
  heart: (m) => m.fat > 22,
  kidney: (m) => m.protein > 35,
  thyroid: () => false,
  celiac: (m) => m.tags.allergens.includes("gluten"),
  pcos: (m) => m.carbs > 60,
};

function filterMeals(meals: Meal[], u: UserInput): Meal[] {
  return meals.filter((m) => {
    if (!m.tags.diet.includes(u.diet)) return false;
    if (m.tags.allergens.some((a) => u.allergies.includes(a))) return false;
    if (u.conditions.some((c) => AVOID_BY_CONDITION[c](m))) return false;
    return true;
  });
}

function pick(meals: Meal[], n: number): Meal[] {
  if (meals.length === 0) return [];
  const shuffled = [...meals].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, shuffled.length));
}

export function generatePlan(u: UserInput): Plan {
  const bmi = calcBMI(u.weight, u.height);
  const bmr = calcBMR(u);
  const tdee = calcTDEE(bmr, u.activity);
  const targetCalories = applyGoal(tdee, u.goal);
  const m = macros(targetCalories);

  const meals = {
    breakfast: pick(filterMeals(ALL.breakfast, u), 2),
    lunch: pick(filterMeals(ALL.lunch, u), 2),
    dinner: pick(filterMeals(ALL.dinner, u), 2),
    snacks: pick(filterMeals(ALL.snacks, u), 2),
  };

  return {
    bmi: Math.round(bmi * 10) / 10,
    bmiCategory: bmiCategory(bmi),
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    ...m,
    meals,
    createdAt: new Date().toISOString(),
  };
}
