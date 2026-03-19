export interface DietMeal {
  mealType: string;
  name: string;
  calories: number;
  description: string;
  protein: number;
  carbs: number;
  fats: number;
}

export interface DietProtocol {
  id: string;
  planTitle: string;
  description: string;
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance';
  scientificBasis: string;
  tips: string[];
  meals: DietMeal[];
  totalMacros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  targetCalories: number;
}

export const SCIENCE_BASED_DIETS: DietProtocol[] = [
  {
    id: 'intermittent-fasting-16-8',
    planTitle: 'Intermittent Fasting (16:8) - Weight Loss',
    description: 'A time-restricted eating protocol where you fast for 16 hours and eat within an 8-hour window. Excellent for fat loss and insulin sensitivity.',
    goal: 'weight_loss',
    scientificBasis: 'Fasting depletes liver glycogen stores, forcing the body to use stored fat for energy (lipolysis). It also lowers insulin levels, which facilitates fat burning and improves metabolic health.',
    tips: [
      'Drink plenty of water, black coffee, or green tea during the fasting window.',
      'Break your fast with a high-protein, moderate-fat meal to avoid insulin spikes.',
      'Ensure you hit your daily protein target within the 8-hour window to preserve muscle mass.'
    ],
    targetCalories: 1800,
    totalMacros: { protein: 140, carbs: 150, fats: 70 },
    meals: [
      {
        mealType: 'Meal 1 (12:00 PM) - Break Fast',
        name: 'High-Protein Scramble with Avocado',
        calories: 500,
        description: '3 whole eggs, 100g egg whites, 50g spinach, and half an avocado.',
        protein: 35,
        carbs: 10,
        fats: 35
      },
      {
        mealType: 'Meal 2 (4:00 PM) - Pre-Workout/Snack',
        name: 'Greek Yogurt with Berries & Almonds',
        calories: 400,
        description: '200g 0% Greek yogurt, 100g mixed berries, 30g almonds.',
        protein: 25,
        carbs: 30,
        fats: 20
      },
      {
        mealType: 'Meal 3 (7:30 PM) - Dinner',
        name: 'Grilled Chicken Breast with Quinoa & Broccoli',
        calories: 900,
        description: '250g chicken breast, 100g quinoa (dry weight), 200g steamed broccoli, 1 tbsp olive oil.',
        protein: 80,
        carbs: 110,
        fats: 15
      }
    ]
  },
  {
    id: 'high-protein-keto',
    planTitle: 'High-Protein Ketogenic Diet - Rapid Fat Loss',
    description: 'A very low-carb, high-protein, and moderate-fat diet designed to induce ketosis while preserving lean muscle mass.',
    goal: 'weight_loss',
    scientificBasis: 'Restricting carbohydrates to under 30-50g per day forces the body to produce ketones from fat for energy. The high protein content preserves muscle and increases satiety via the thermic effect of food (TEF).',
    tips: [
      'Keep net carbs below 30g per day.',
      'Consume adequate sodium, potassium, and magnesium to avoid the "keto flu".',
      'Focus on fibrous green vegetables for your carbohydrate allowance.'
    ],
    targetCalories: 1700,
    totalMacros: { protein: 160, carbs: 25, fats: 105 },
    meals: [
      {
        mealType: 'Breakfast',
        name: 'Bacon, Egg, and Spinach Omelet',
        calories: 450,
        description: '3 large eggs, 2 slices of turkey bacon, 1 cup spinach, cooked in 1 tsp butter.',
        protein: 30,
        carbs: 5,
        fats: 35
      },
      {
        mealType: 'Lunch',
        name: 'Tuna Salad with Olive Oil',
        calories: 500,
        description: '1 can of tuna (in water), 2 tbsp olive oil mayo, celery, served over mixed greens.',
        protein: 40,
        carbs: 5,
        fats: 35
      },
      {
        mealType: 'Dinner',
        name: 'Steak with Asparagus',
        calories: 750,
        description: '250g sirloin steak, 150g grilled asparagus with 1 tbsp butter.',
        protein: 90,
        carbs: 15,
        fats: 35
      }
    ]
  },
  {
    id: 'clean-bulk-surplus',
    planTitle: 'Clean Bulking (Lean Muscle Gain)',
    description: 'A slight caloric surplus (+300-500 kcal) focused on nutrient-dense foods to maximize muscle growth while minimizing fat accumulation.',
    goal: 'muscle_gain',
    scientificBasis: 'Muscle hypertrophy requires a positive energy balance and adequate protein synthesis. A moderate surplus ensures energy for intense workouts and recovery without excessive lipogenesis (fat storage).',
    tips: [
      'Aim to gain 0.25 - 0.5 kg (0.5 - 1 lb) per week.',
      'Consume 1.6 - 2.2g of protein per kg of body weight.',
      'Time your carbohydrates around your workouts for optimal performance and glycogen replenishment.'
    ],
    targetCalories: 2800,
    totalMacros: { protein: 180, carbs: 350, fats: 75 },
    meals: [
      {
        mealType: 'Breakfast',
        name: 'Oatmeal with Whey Protein and Peanut Butter',
        calories: 650,
        description: '100g oats, 1 scoop whey protein, 1 banana, 1 tbsp peanut butter.',
        protein: 40,
        carbs: 85,
        fats: 15
      },
      {
        mealType: 'Lunch',
        name: 'Chicken, Rice, and Avocado Bowl',
        calories: 800,
        description: '200g chicken breast, 150g jasmine rice (dry), half an avocado, mixed vegetables.',
        protein: 60,
        carbs: 115,
        fats: 15
      },
      {
        mealType: 'Pre-Workout Snack',
        name: 'Rice Cakes and Honey',
        calories: 300,
        description: '4 plain rice cakes with 2 tbsp honey and a pinch of salt.',
        protein: 5,
        carbs: 70,
        fats: 0
      },
      {
        mealType: 'Dinner',
        name: 'Salmon with Sweet Potato',
        calories: 850,
        description: '200g Atlantic salmon, 300g baked sweet potato, side salad with olive oil dressing.',
        protein: 55,
        carbs: 80,
        fats: 35
      },
      {
        mealType: 'Before Bed',
        name: 'Cottage Cheese',
        calories: 200,
        description: '200g low-fat cottage cheese (casein protein for slow digestion).',
        protein: 20,
        carbs: 10,
        fats: 10
      }
    ]
  },
  {
    id: 'mediterranean-maintenance',
    planTitle: 'Mediterranean Diet - Health & Maintenance',
    description: 'A balanced, heart-healthy diet rich in healthy fats, lean proteins, and complex carbohydrates.',
    goal: 'maintenance',
    scientificBasis: 'Consistently ranked as the healthiest diet globally. High in monounsaturated fats (olive oil) and omega-3s, which reduce inflammation and support cardiovascular health.',
    tips: [
      'Use extra virgin olive oil as your primary fat source.',
      'Eat fish and seafood at least twice a week.',
      'Incorporate plenty of legumes, nuts, and seeds.'
    ],
    targetCalories: 2200,
    totalMacros: { protein: 130, carbs: 220, fats: 90 },
    meals: [
      {
        mealType: 'Breakfast',
        name: 'Greek Yogurt Parfait',
        calories: 400,
        description: '150g Greek yogurt, 1 tbsp honey, walnuts, and fresh berries.',
        protein: 20,
        carbs: 40,
        fats: 15
      },
      {
        mealType: 'Lunch',
        name: 'Mediterranean Chickpea Salad',
        calories: 600,
        description: 'Mixed greens, 100g chickpeas, cherry tomatoes, cucumber, feta cheese, olives, olive oil vinaigrette.',
        protein: 20,
        carbs: 50,
        fats: 35
      },
      {
        mealType: 'Snack',
        name: 'Hummus and Carrots',
        calories: 300,
        description: '3 tbsp hummus with baby carrots and cucumber slices.',
        protein: 10,
        carbs: 30,
        fats: 15
      },
      {
        mealType: 'Dinner',
        name: 'Baked White Fish with Quinoa',
        calories: 900,
        description: '200g cod or tilapia baked with lemon and herbs, 100g quinoa, roasted zucchini.',
        protein: 80,
        carbs: 100,
        fats: 25
      }
    ]
  }
];
