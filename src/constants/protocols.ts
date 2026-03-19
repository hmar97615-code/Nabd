export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  videoUrl?: string;
  muscles?: string[];
}

export interface DayPlan {
  day: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id: string;
  planTitle: string;
  description: string;
  weeklySchedule: DayPlan[];
  injuryPreventionTips: string[];
  scientificBasis: string;
  intensity: 'Low' | 'Medium' | 'High';
  frequency: string;
}

export const SCIENCE_BASED_PROTOCOLS: WorkoutPlan[] = [
  {
    id: 'ppl-classic',
    planTitle: 'Push-Pull-Legs (PPL) Classic',
    description: 'The gold standard for hypertrophy. Splits training by movement patterns to maximize recovery and frequency.',
    intensity: 'High',
    frequency: '3-6 Days/Week',
    weeklySchedule: [
      {
        day: 'Push (Chest, Shoulders, Triceps)',
        exercises: [
          { name: 'Bench Press', sets: 3, reps: '5-8', rest: '180s', muscles: ['Chest', 'Triceps', 'Shoulders'] },
          { name: 'Overhead Press', sets: 3, reps: '8-10', rest: '120s', muscles: ['Shoulders', 'Triceps'] },
          { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '90s', muscles: ['Upper Chest', 'Shoulders'] },
          { name: 'Lateral Raises', sets: 3, reps: '15-20', rest: '60s', muscles: ['Side Delts'] },
          { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', rest: '60s', muscles: ['Triceps'] }
        ]
      },
      {
        day: 'Pull (Back, Biceps, Rear Delts)',
        exercises: [
          { name: 'Deadlift', sets: 3, reps: '5', rest: '180s', muscles: ['Back', 'Hamstrings', 'Glutes'] },
          { name: 'Pull-Ups', sets: 3, reps: 'AMRAP', rest: '120s', muscles: ['Lats', 'Biceps'] },
          { name: 'Barbell Rows', sets: 3, reps: '8-10', rest: '120s', muscles: ['Back', 'Biceps'] },
          { name: 'Face Pulls', sets: 3, reps: '15-20', rest: '60s', muscles: ['Rear Delts', 'Upper Back'] },
          { name: 'Hammer Curls', sets: 3, reps: '12-15', rest: '60s', muscles: ['Biceps', 'Forearms'] }
        ]
      },
      {
        day: 'Legs (Quads, Hamstrings, Calves)',
        exercises: [
          { name: 'Barbell Squats', sets: 3, reps: '5-8', rest: '180s', muscles: ['Quads', 'Glutes'] },
          { name: 'Romanian Deadlifts', sets: 3, reps: '8-10', rest: '120s', muscles: ['Hamstrings', 'Glutes'] },
          { name: 'Leg Press', sets: 3, reps: '12-15', rest: '90s', muscles: ['Quads'] },
          { name: 'Leg Curls', sets: 3, reps: '12-15', rest: '60s', muscles: ['Hamstrings'] },
          { name: 'Calf Raises', sets: 4, reps: '15-20', rest: '60s', muscles: ['Calves'] }
        ]
      }
    ],
    injuryPreventionTips: [
      'Warm up with 5-10 mins of light cardio',
      'Use dynamic stretching for the target muscle groups',
      'Prioritize form over weight for compound movements'
    ],
    scientificBasis: 'PPL utilizes the principle of frequency and volume optimization. By grouping muscles that work together, you minimize overlap and allow for 48-72 hours of recovery per muscle group.'
  },
  {
    id: 'upper-lower',
    planTitle: 'Upper-Lower Split',
    description: 'Perfect for intermediate lifters. Alternates between upper and lower body sessions for balanced growth.',
    intensity: 'Medium',
    frequency: '4 Days/Week',
    weeklySchedule: [
      {
        day: 'Upper Body',
        exercises: [
          { name: 'Bench Press', sets: 3, reps: '6-8', rest: '120s', muscles: ['Chest', 'Shoulders'] },
          { name: 'Seated Cable Rows', sets: 3, reps: '10-12', rest: '90s', muscles: ['Back', 'Biceps'] },
          { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', rest: '90s', muscles: ['Shoulders'] },
          { name: 'Lat Pulldowns', sets: 3, reps: '10-12', rest: '90s', muscles: ['Lats'] },
          { name: 'Bicep Curls', sets: 3, reps: '12-15', rest: '60s', muscles: ['Biceps'] }
        ]
      },
      {
        day: 'Lower Body',
        exercises: [
          { name: 'Leg Press', sets: 3, reps: '10-12', rest: '120s', muscles: ['Quads'] },
          { name: 'Hamstring Curls', sets: 3, reps: '12-15', rest: '90s', muscles: ['Hamstrings'] },
          { name: 'Leg Extensions', sets: 3, reps: '12-15', rest: '90s', muscles: ['Quads'] },
          { name: 'Seated Calf Raises', sets: 3, reps: '15-20', rest: '60s', muscles: ['Calves'] },
          { name: 'Plank', sets: 3, reps: '60s', rest: '60s', muscles: ['Core'] }
        ]
      }
    ],
    injuryPreventionTips: [
      'Focus on mind-muscle connection',
      'Ensure full range of motion',
      'Progressively overload weight or reps weekly'
    ],
    scientificBasis: 'The Upper-Lower split allows for a higher frequency per muscle group (2x per week) compared to a traditional bro-split, which is scientifically proven to be superior for hypertrophy.'
  },
  {
    id: 'full-body-science',
    planTitle: 'Science-Based Full Body',
    description: 'Ideal for beginners or those with limited time. Hits every major muscle group in a single session.',
    intensity: 'Medium',
    frequency: '3 Days/Week',
    weeklySchedule: [
      {
        day: 'Full Body Session',
        exercises: [
          { name: 'Goblet Squats', sets: 3, reps: '12-15', rest: '90s', muscles: ['Quads', 'Glutes'] },
          { name: 'Push-Ups', sets: 3, reps: 'AMRAP', rest: '90s', muscles: ['Chest', 'Triceps'] },
          { name: 'Dumbbell Rows', sets: 3, reps: '12-15', rest: '90s', muscles: ['Back', 'Biceps'] },
          { name: 'Glute Bridges', sets: 3, reps: '15-20', rest: '60s', muscles: ['Glutes', 'Hamstrings'] },
          { name: 'Dead Bug', sets: 3, reps: '12 per side', rest: '60s', muscles: ['Core'] }
        ]
      }
    ],
    injuryPreventionTips: [
      'Keep core engaged throughout all movements',
      'Breathe out on the exertion phase',
      'Stay hydrated and maintain electrolyte balance'
    ],
    scientificBasis: 'Full body training maximizes protein synthesis across the entire body multiple times per week, leading to efficient muscle growth and strength gains for novice to intermediate trainees.'
  }
];
