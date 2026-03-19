
export interface UserProfile {
  uid: string;
  weight?: number;
  height?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal?: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'fitness';
  targetWeight?: number;
  targetDate?: string;
  targetCalories?: number;
}

export interface PlanDetails {
  calorieGoal: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  training: {
    resistanceDays: number;
    cardioMinutes: number;
    intensity: string;
  };
  recovery: {
    sleepHours: number;
    notes: string;
  };
}

export function calculatePlanDetails(user: UserProfile): PlanDetails {
  // Default values
  const defaultPlan: PlanDetails = {
    calorieGoal: 2200,
    macros: { protein: 150, carbs: 250, fats: 70 },
    training: { resistanceDays: 3, cardioMinutes: 150, intensity: 'Moderate' },
    recovery: { sleepHours: 8, notes: 'Standard recovery protocol.' }
  };

  if (!user.weight || !user.height || !user.age) return defaultPlan;

  // 1. Calculate BMR (Mifflin-St Jeor)
  let bmr = (10 * user.weight) + (6.25 * user.height) - (5 * user.age);
  if (user.gender === 'male') bmr += 5;
  else if (user.gender === 'female') bmr -= 161;

  // 2. Activity Multiplier
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  const multiplier = multipliers[user.activityLevel || 'light'];
  const tdee = bmr * multiplier;

  // 3. Adjust for Smart Plan (Target Weight/Date)
  let calorieGoal = tdee;
  if (user.targetCalories) {
    calorieGoal = user.targetCalories;
  } else if (user.targetWeight && user.targetDate) {
    const today = new Date();
    const target = new Date(user.targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      const weightDiff = user.targetWeight - user.weight;
      const totalCalorieDiff = weightDiff * 7700; // 1kg = ~7700 kcal
      const dailyDiff = totalCalorieDiff / diffDays;
      
      // Safety limits: max 1000 kcal deficit/surplus
      const safeDailyDiff = Math.max(Math.min(dailyDiff, 1000), -1000);
      calorieGoal = tdee + safeDailyDiff;
    }
  } else {
    // Fallback to goal-based adjustment
    if (user.goal === 'weight_loss') calorieGoal = tdee - 500;
    else if (user.goal === 'muscle_gain') calorieGoal = tdee + 300;
  }

  // 4. Calculate Macros
  let proteinRatio = 0.25;
  let fatRatio = 0.25;
  let carbRatio = 0.50;

  if (user.goal === 'muscle_gain') {
    proteinRatio = 0.30;
    carbRatio = 0.50;
    fatRatio = 0.20;
  } else if (user.goal === 'weight_loss') {
    proteinRatio = 0.35;
    fatRatio = 0.25;
    carbRatio = 0.40;
  }

  const protein = Math.round((calorieGoal * proteinRatio) / 4);
  const fats = Math.round((calorieGoal * fatRatio) / 9);
  const carbs = Math.round((calorieGoal * carbRatio) / 4);

  // 5. Training Recommendations
  let resistanceDays = 3;
  let cardioMinutes = 150;
  let intensity = 'Moderate';

  if (user.goal === 'muscle_gain') {
    resistanceDays = 4;
    cardioMinutes = 60;
    intensity = 'High (Hypertrophy focus)';
  } else if (user.goal === 'weight_loss') {
    resistanceDays = 3;
    cardioMinutes = 200;
    intensity = 'Moderate (Fat oxidation focus)';
  }

  // 6. Recovery
  const sleepHours = user.goal === 'muscle_gain' ? 8.5 : 8;
  const recoveryNotes = user.goal === 'muscle_gain' 
    ? 'Focus on protein synthesis during sleep. Avoid caffeine 6h before bed.'
    : 'Sleep is critical for metabolic health and appetite regulation.';

  return {
    calorieGoal: Math.round(calorieGoal),
    macros: { protein, carbs, fats },
    training: { resistanceDays, cardioMinutes, intensity },
    recovery: { sleepHours, notes: recoveryNotes }
  };
}
