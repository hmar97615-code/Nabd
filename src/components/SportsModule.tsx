import React, { useState, useEffect, useRef } from 'react';
import { 
  Dumbbell, 
  Camera, 
  AlertTriangle, 
  Plus,
  Play, 
  CheckCircle2, 
  XCircle, 
  Info, 
  ChevronRight, 
  RefreshCw,
  Zap,
  ShieldCheck,
  BookOpen,
  Heart,
  Search,
  X,
  Clock,
  Timer,
  History,
  TrendingUp as TrendingIcon,
  Award,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  MoreVertical,
  Trash2,
  Copy,
  Save,
  Check,
  Activity as ActivityIcon,
  Target,
  Settings,
  Star,
  Sparkles,
  Trophy,
  Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeExerciseForm, generateWorkoutPlan, analyzeWorkoutSession } from '../lib/gemini';
import { calculatePlanDetails } from '../lib/planUtils';
import { db, OperationType, handleFirestoreError } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, collection, query, getDocs, addDoc, deleteDoc, orderBy, limit } from 'firebase/firestore';
import { SCIENCE_BASED_PROTOCOLS, WorkoutPlan as ProtocolPlan } from '../constants/protocols';
import { EXERCISE_LIBRARY, MUSCLE_GROUPS, EQUIPMENT_TYPES, ExerciseDef } from '../constants/exerciseLibrary';
import { cn } from '../lib/utils';
import { SPORTS_DATA, Button } from '../App';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  videoUrl?: string;
  muscles?: string[];
}

interface WorkoutSet {
  weight: number;
  reps: number;
  rpe?: number;
  isCompleted: boolean;
  type: 'normal' | 'warmup' | 'dropset' | 'failure';
}

interface ActiveExercise {
  id: string;
  name: string;
  sets: WorkoutSet[];
}

interface ActiveWorkout {
  name: string;
  startTime: string;
  endTime?: string;
  exercises: ActiveExercise[];
}

interface LoggedExercise {
  id: string;
  name: string;
  sets: WorkoutSet[];
}

interface ActiveWorkout {
  startTime: string;
  name: string;
  exercises: LoggedExercise[];
  date?: string;
}

interface DayPlan {
  day: string;
  exercises: Exercise[];
}

interface WorkoutPlan {
  id?: string;
  planTitle: string;
  weeklySchedule: DayPlan[];
  injuryPreventionTips: string[];
  scientificBasis: string;
  healthAdvice?: string;
  isAI?: boolean;
}

interface AnalysisResult {
  isCorrect: boolean;
  feedback: string;
  injuryRisk: string;
}

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

function ExerciseSummaryModal({ summary, onClose }: { summary: any, onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-[32px] shadow-2xl max-w-sm w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative h-32 bg-emerald-600 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12" />
          </div>
          <div className="relative z-10 w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
            <CheckCircle2 size={32} className="text-white" />
          </div>
        </div>

        <div className="p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-1">Exercise Complete!</h3>
          <p className="text-slate-500 text-sm mb-8">Great intensity on that one!</p>

          <div className="bg-slate-50 rounded-2xl p-6 mb-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-sm">Exercise</span>
              <span className="font-bold text-slate-900">{summary.name}</span>
            </div>
            <div className="h-px bg-slate-200 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <div className="text-left">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Calories</p>
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                  <Zap size={14} />
                  <span>{summary.calories} kcal</span>
                </div>
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Duration</p>
                <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                  <Clock size={14} />
                  <span>{summary.duration} min</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-[0.98]"
          >
            Continue Workout
          </button>
          
          <p className="mt-4 text-[10px] text-slate-400 font-medium">
            Completed at {summary.timestamp}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

const getExerciseGifUrl = (name: string, muscles?: string[], category?: string): string | null => {
  const normalizedName = name.toLowerCase().trim();
  
  // Muscle-based fallbacks (General GIFs for each muscle group)
  const muscleFallbacks: Record<string, string> = {
    "chest": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bench-Press.gif",
    "back": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bent-Over-Row.gif",
    "shoulders": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Overhead-Press.gif",
    "quads": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Squat.gif",
    "hamstrings": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lying-Leg-Curl.gif",
    "glutes": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Hip-Thrust.gif",
    "calves": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Standing-Calf-Raise.gif",
    "biceps": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Curl.gif",
    "triceps": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Triceps-Pushdown.gif",
    "abs": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Crunch.gif",
    "core": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Plank.gif",
    "forearms": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Wrist-Curl.gif"
  };

  const categoryFallbacks: Record<string, string> = {
    "swimming": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Freestyle-Swimming.gif",
    "cardio": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Running.gif",
    "pool": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Freestyle-Swimming.gif"
  };
  
  const map: Record<string, string> = {
    // Chest
    "barbell bench press": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bench-Press.gif",
    "bench press": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bench-Press.gif",
    "dumbbell bench press": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Bench-Press.gif",
    "incline barbell bench press": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Barbell-Bench-Press.gif",
    "incline barbell press": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Barbell-Bench-Press.gif",
    "incline dumbbell press": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Press.gif",
    "decline barbell bench press": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Decline-Barbell-Bench-Press.gif",
    "decline barbell press": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Decline-Barbell-Bench-Press.gif",
    "decline dumbbell press": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Decline-Dumbbell-Press.gif",
    "push-ups": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-Up.gif",
    "pushups": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-Up.gif",
    "push up": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-Up.gif",
    "dumbbell chest fly": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Fly.gif",
    "dumbbell fly": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Fly.gif",
    "dumbbell flyes": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Fly.gif",
    "incline dumbbell fly": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Fly.gif",
    "cable crossover": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Crossover.gif",
    "cable chest fly": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Crossover.gif",
    "cable fly": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Crossover.gif",
    "pec deck": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Pec-Deck-Fly.gif",
    "pec deck fly": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Pec-Deck-Fly.gif",
    "chest fly machine": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Pec-Deck-Fly.gif",
    "pec deck machine": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Pec-Deck-Fly.gif",
    "machine chest press": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lever-Chest-Press.gif",
    "chest press machine": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lever-Chest-Press.gif",

    // Back
    "pull-ups": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif",
    "pullups": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif",
    "pull ups": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif",
    "lat pulldown": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif",
    "wide grip lat pulldown": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif",
    "v-bar pulldown": "https://fitnessprogramer.com/wp-content/uploads/2021/02/V-Bar-Pulldown.gif",
    "close grip lat pulldown": "https://fitnessprogramer.com/wp-content/uploads/2021/02/V-Bar-Pulldown.gif",
    "close grip pulldown": "https://fitnessprogramer.com/wp-content/uploads/2021/02/V-Bar-Pulldown.gif",
    "seated cable row": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Cable-Row.gif",
    "seated row": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Cable-Row.gif",
    "cable row": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Cable-Row.gif",
    "barbell row": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bent-Over-Row.gif",
    "bent over row": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bent-Over-Row.gif",
    "barbell bent over row": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bent-Over-Row.gif",
    "dumbbell row": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Row.gif",
    "one arm dumbbell row": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Row.gif",
    "one arm row": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Row.gif",
    "t-bar row": "https://fitnessprogramer.com/wp-content/uploads/2021/02/T-Bar-Row.gif",
    "t bar row": "https://fitnessprogramer.com/wp-content/uploads/2021/02/T-Bar-Row.gif",
    "straight-arm pulldown": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Straight-Arm-Pulldown.gif",
    "hyperextension": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Back-Extension.gif",
    "back extension": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Back-Extension.gif",

    // Shoulders
    "overhead press": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Overhead-Press.gif",
    "military press": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Overhead-Press.gif",
    "barbell overhead press": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Overhead-Press.gif",
    "dumbbell shoulder press": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif",
    "seated dumbbell press": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif",
    "arnold press": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Arnold-Press.gif",
    "dumbbell arnold press": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Arnold-Press.gif",
    "lateral raise": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif",
    "dumbbell lateral raise": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif",
    "side lateral raise": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif",
    "cable lateral raise": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Lateral-Raise.gif",
    "front raise": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Front-Raise.gif",
    "dumbbell front raise": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Front-Raise.gif",
    "barbell front raise": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Front-Raise.gif",
    "face pull": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Face-Pull.gif",
    "facepull": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Face-Pull.gif",
    "cable face pull": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Face-Pull.gif",
    "dumbbell rear delt fly": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Rear-Lateral-Raise.gif",
    "reverse fly (machine)": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Rear-Delt-Machine-Flys.gif",
    "upright row": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Upright-Row.gif",
    "barbell upright row": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Upright-Row.gif",
    "dumbbell upright row": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Upright-Row.gif",
    "barbell shrug": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Shrug.gif",
    "barbell shrugs": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Shrug.gif",
    "dumbbell shrug": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shrug.gif",
    "dumbbell shrugs": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shrug.gif",
    "shrugs": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Shrug.gif",
    "machine shoulder press": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lever-Shoulder-Press.gif",
    "shoulder press machine": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lever-Shoulder-Press.gif",

    // Legs
    "barbell back squat": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Squat.gif",
    "squat": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Squat.gif",
    "front squat": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Front-Squat.gif",
    "goblet squat": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Goblet-Squat.gif",
    "dumbbell goblet squat": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Goblet-Squat.gif",
    "dumbbell squat": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Squat.gif",
    "smith machine squat": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Smith-Machine-Squat.gif",
    "smith squat": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Smith-Machine-Squat.gif",
    "hack squat": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Hack-Squat.gif",
    "leg press": "https://fitnessprogramer.com/wp-content/uploads/2015/11/Leg-Press.gif",
    "leg press machine": "https://fitnessprogramer.com/wp-content/uploads/2015/11/Leg-Press.gif",
    "45 degree leg press": "https://fitnessprogramer.com/wp-content/uploads/2015/11/Leg-Press.gif",
    "leg extension": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Extension.gif",
    "seated leg extension": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Extension.gif",
    "leg curl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Curl.gif",
    "lying leg curl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lying-Leg-Curl.gif",
    "lying leg curls": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lying-Leg-Curl.gif",
    "seated leg curl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Leg-Curl.gif",
    "seated leg curls": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Leg-Curl.gif",
    "deadlift": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Deadlift.gif",
    "barbell deadlift": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Deadlift.gif",
    "sumo deadlift": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Sumo-Deadlift.gif",
    "romanian deadlift": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Romanian-Deadlift.gif",
    "rdl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Romanian-Deadlift.gif",
    "stiff leg deadlift": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Stiff-Leg-Deadlift.gif",
    "lunges": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lunge.gif",
    "dumbbell lunge": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lunge.gif",
    "walking lunges": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Walking-Lunge.gif",
    "reverse lunges": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Reverse-Lunge.gif",
    "bulgarian split squat": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Bulgarian-Split-Squat.gif",
    "split squat": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Bulgarian-Split-Squat.gif",
    "calf raise": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Standing-Calf-Raise.gif",
    "standing calf raise": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Standing-Calf-Raise.gif",
    "standing calf raises": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Standing-Calf-Raise.gif",
    "seated calf raise": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Calf-Raise.gif",
    "seated calf raises": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Seated-Calf-Raise.gif",
    "barbell hip thrust": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Hip-Thrust.gif",
    "hip thrust": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Hip-Thrust.gif",
    "glute bridge": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Glute-Bridge.gif",
    "donkey kicks": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Donkey-Kick.gif",
    "fire hydrant": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Fire-Hydrant.gif",

    // Arms
    "barbell bicep curl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Curl.gif",
    "dumbbell bicep curl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif",
    "dumbbell curl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Curl.gif",
    "hammer curl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif",
    "hammer curls": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif",
    "preacher curl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Preacher-Curl.gif",
    "preacher curls": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Preacher-Curl.gif",
    "ez-bar curl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/EZ-Bar-Curl.gif",
    "ez bar curl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/EZ-Bar-Curl.gif",
    "concentration curl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Concentration-Curl.gif",
    "cable bicep curl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Cable-Curl.gif",
    "triceps pushdown": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Triceps-Pushdown.gif",
    "tricep pushdown": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Triceps-Pushdown.gif",
    "rope pushdown": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Rope-Pushdown.gif",
    "skull crusher": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Skull-Crusher.gif",
    "skull crushers": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Skull-Crusher.gif",
    "overhead triceps extension": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Overhead-Triceps-Extension.gif",
    "triceps extension": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Triceps-Extension.gif",
    "dips": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dips.gif",
    "bench dips": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Bench-Dips.gif",
    "close grip bench press": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Close-Grip-Bench-Press.gif",

    // Core
    "crunch": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Crunch.gif",
    "crunches": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Crunch.gif",
    "bicycle crunches": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Bicycle-Crunch.gif",
    "leg raise": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lying-Leg-Raise.gif",
    "lying leg raise": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lying-Leg-Raise.gif",
    "hanging leg raise": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Hanging-Leg-Raise.gif",
    "reverse crunch": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Reverse-Crunch.gif",
    "plank": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Plank.gif",
    "side plank": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Side-Plank.gif",
    "russian twist": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Russian-Twist.gif",
    "mountain climbers": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Mountain-Climber.gif",
    "mountain climber": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Mountain-Climber.gif",
    "burpees": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Burpee.gif",
    "jumping jacks": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Jumping-Jack.gif",

    // Swimming
    "freestyle": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Freestyle-Swimming.gif",
    "front crawl": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Freestyle-Swimming.gif",
    "freestyle (front crawl)": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Freestyle-Swimming.gif",
    "breaststroke": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Breaststroke-Swimming.gif",
    "backstroke": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Backstroke-Swimming.gif",
    "butterfly": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Butterfly-Swimming.gif",
    "kickboard drills": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Kickboard-Drills.gif",
    "pull buoy drills": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-Buoy-Drills.gif",
    "treading water": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Treading-Water.gif",
    "sculling": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Sculling.gif",
    "swimming": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Freestyle-Swimming.gif",
    
    // Cardio
    "running": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Running.gif",
    "cycling": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Cycling.gif",
    "walking": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Walking.gif",
    "elliptical": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Elliptical-Machine.gif",
    "rowing": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Rowing-Machine.gif",
    "stair climber": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Stair-Climber.gif",
    "jump rope": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Jump-Rope.gif",
    
    // Others
    "abductor": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Machine-Hip-Abduction.gif",
    "adductor": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Machine-Hip-Adduction.gif",
    "hip abduction": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Machine-Hip-Abduction.gif",
    "hip adduction": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Machine-Hip-Adduction.gif"
  };
  
  // 1. Exact match
  if (map[normalizedName]) return map[normalizedName];
  
  // 2. Best match heuristic: find the longest key that is contained in the name
  let bestMatch: string | null = null;
  let longestKeyLength = 0;
  
  for (const key in map) {
    if (normalizedName.includes(key)) {
      if (key.length > longestKeyLength) {
        longestKeyLength = key.length;
        bestMatch = map[key];
      }
    }
  }
  
  if (bestMatch) return bestMatch;

  // 3. Advanced heuristic: remove equipment and common modifiers, then try matching again
  const modifiers = [
    "barbell", "dumbbell", "kettlebell", "ez-bar", "cable", "machine", "lever", "smith machine",
    "standard", "incline", "decline", "seated", "standing", "lying", "bent over", "wide grip", 
    "close grip", "reverse", "alternating", "single-arm", "single-leg", "one-arm", "one-leg", 
    "bodyweight", "weighted", "abs"
  ];
  
  const modifierRegex = new RegExp(`\\b(${modifiers.join("|")})\\b`, "g");
  const cleanName = normalizedName.replace(modifierRegex, "").replace(/\s+/g, " ").trim();
    
  if (cleanName && cleanName !== normalizedName) {
    // Try exact match on clean name
    if (map[cleanName]) return map[cleanName];
    
    // Try best match on clean name
    let cleanBestMatch: string | null = null;
    let cleanLongestKeyLength = 0;
    
    for (const key in map) {
      if (cleanName.includes(key)) {
        if (key.length > cleanLongestKeyLength) {
          cleanLongestKeyLength = key.length;
          cleanBestMatch = map[key];
        }
      }
    }
    if (cleanBestMatch) return cleanBestMatch;
  }
  
  // 4. Specific swimming/pool check
  if (normalizedName.includes("swim") || normalizedName.includes("pool")) {
    return map["swimming"];
  }

  // 5. Muscle-based fallback (CRITICAL: Ensures no exercise is left without a visual)
  if (muscles && muscles.length > 0) {
    for (const muscle of muscles) {
      const m = muscle.toLowerCase();
      if (muscleFallbacks[m]) return muscleFallbacks[m];
      // Check for partial muscle matches (e.g. "Upper Chest" -> "Chest")
      for (const fallbackMuscle in muscleFallbacks) {
        if (m.includes(fallbackMuscle)) return muscleFallbacks[fallbackMuscle];
      }
    }
  }

  // 6. Category-based fallback
  if (category) {
    const cat = category.toLowerCase();
    if (categoryFallbacks[cat]) return categoryFallbacks[cat];
    for (const fallbackCat in categoryFallbacks) {
      if (cat.includes(fallbackCat)) return categoryFallbacks[fallbackCat];
    }
  }
  
  // 7. Final fallback: try to create a URL-friendly name
  const urlFriendlyName = name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('-');
  return `https://fitnessprogramer.com/wp-content/uploads/2021/02/${urlFriendlyName}.gif`;
};

export default function SportsModule({ user, language, onUpdate }: { user: any, language?: 'en' | 'ar', onUpdate: (u: any) => void }) {
  const [activeSubTab, setActiveSubTab] = useState<'plan' | 'analysis' | 'tips' | 'log' | 'library' | 'achievements' | 'my-sports' | 'history'>('plan');
  const [achievements, setAchievements] = useState<any[]>([]);
  const [planMode, setPlanMode] = useState<'ai' | 'protocols' | 'manual'>('ai');
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolPlan | null>(null);
  const [aiPlan, setAiPlan] = useState<WorkoutPlan | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [manualPlans, setManualPlans] = useState<WorkoutPlan[]>([]);
  const [selectedManualPlan, setSelectedManualPlan] = useState<WorkoutPlan | null>(null);
  const [isCreatingManualPlan, setIsCreatingManualPlan] = useState(false);
  const [addingExerciseToDay, setAddingExerciseToDay] = useState<number | null>(null);
  const [tempExercise, setTempExercise] = useState<Exercise>({ name: '', sets: 3, reps: '10-12', rest: '60s' });
  const [showLibraryForManual, setShowLibraryForManual] = useState(false);
  const [newManualPlan, setNewManualPlan] = useState<WorkoutPlan>({
    planTitle: '',
    weeklySchedule: [],
    injuryPreventionTips: [],
    scientificBasis: 'Custom manual plan'
  });
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(null);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [expandedDays, setExpandedDays] = useState<number[]>([]);
  const [showSportsEditor, setShowSportsEditor] = useState(false);
  const [selectedExerciseInfo, setSelectedExerciseInfo] = useState<ExerciseDef | null>(null);
  const [gifError, setGifError] = useState(false);
  const [showExtraPlanInfo, setShowExtraPlanInfo] = useState(false);
  const [showExerciseSummary, setShowExerciseSummary] = useState<any | null>(null);

  useEffect(() => {
    if (selectedExerciseInfo) {
      setGifError(false);
    }
  }, [selectedExerciseInfo]);
  const [expandedHealth, setExpandedHealth] = useState(false);
  const [expandedWarnings, setExpandedWarnings] = useState(false);
  const [expandedScience, setExpandedScience] = useState(false);

  const toggleDay = (idx: number) => {
    setExpandedDays(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const getDayLabel = (idx: number) => {
    if (language === 'ar') {
      const labels = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh'];
      return `Day ${labels[idx] || (idx + 1)}`;
    }
    return `Day ${idx + 1}`;
  };

  const markDayComplete = async (day: DayPlan) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const logRef = doc(db, 'users', user.uid, 'dailyLogs', todayStr);
      const logDoc = await getDoc(logRef);
      
      const newWorkouts = day.exercises
        .filter(ex => !completedExercises.includes(ex.name))
        .map(ex => ({
          name: ex.name,
          duration: 15,
          caloriesBurned: 50
        }));

      if (newWorkouts.length === 0) {
        alert('All exercises for this day are already completed');
        return;
      }

      if (logDoc.exists()) {
        const data = logDoc.data();
        const workouts = data.workouts || [];
        await setDoc(logRef, { date: todayStr, workouts: [...workouts, ...newWorkouts] }, { merge: true });
      } else {
        await setDoc(logRef, {
          date: todayStr,
          meals: [],
          totalCalories: 0,
          exercise: '',
          waterIntake: 0,
          weight: user.weight || 0,
          workouts: newWorkouts
        });
      }
      
      setCompletedExercises(prev => [...prev, ...newWorkouts.map(w => w.name)]);
      
      // Check for achievements even when marking day complete
      const dayVolume = day.exercises.reduce((acc, ex) => acc + (parseInt(ex.reps) || 0) * 10, 0); // Estimate volume
      await checkAchievements({ totalVolume: dayVolume });

      alert('Day completed successfully!');
    } catch (error) {
      console.error("Error marking day complete:", error);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchManualPlans();
    }
  }, [user?.uid]);

  const fetchManualPlans = async () => {
    try {
      const q = query(collection(db, 'users', user.uid, 'manualPlans'));
      const querySnapshot = await getDocs(q);
      const plans: any[] = [];
      querySnapshot.forEach((doc) => {
        plans.push({ id: doc.id, ...doc.data() });
      });
      setManualPlans(plans);
      return plans;
    } catch (error) {
      console.error("Error fetching manual plans:", error);
      return [];
    }
  };

  const saveManualPlan = async (plan: any) => {
    try {
      const plansRef = collection(db, 'users', user.uid, 'manualPlans');
      let planToSave = { ...plan };
      if (plan.id) {
        await setDoc(doc(db, 'users', user.uid, 'manualPlans', plan.id), planToSave);
      } else {
        const docRef = await addDoc(plansRef, planToSave);
        planToSave.id = docRef.id;
      }
      
      // If this was the selected plan, update the active workout plan too
      if (selectedManualPlan?.id === planToSave.id) {
        setSelectedManualPlan(planToSave);
        setWorkoutPlan(planToSave);
        await setDoc(doc(db, 'users', user.uid, 'plans', 'workout'), { ...planToSave, isAI: false });
      }
      
      await fetchManualPlans();
      setIsCreatingManualPlan(false);
      alert('Plan saved successfully!');
    } catch (error) {
      console.error("Error saving manual plan:", error);
      alert('Failed to save plan');
    }
  };

  const deleteManualPlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'manualPlans', planId));
      await fetchManualPlans();
      if (selectedManualPlan?.id === planId) {
        setSelectedManualPlan(null);
      }
      alert('Plan deleted');
    } catch (error) {
      console.error("Error deleting manual plan:", error);
    }
  };

  const addDayToManualPlan = () => {
    setNewManualPlan(prev => ({
      ...prev,
      weeklySchedule: [...prev.weeklySchedule, { day: `Day ${prev.weeklySchedule.length + 1}`, exercises: [] }]
    }));
  };

  const addExerciseToManualDay = (dayIdx: number, exercise: Exercise) => {
    setNewManualPlan(prev => {
      const updatedSchedule = [...prev.weeklySchedule];
      updatedSchedule[dayIdx].exercises = [...updatedSchedule[dayIdx].exercises, exercise];
      return { ...prev, weeklySchedule: updatedSchedule };
    });
  };

  const removeExerciseFromManualDay = (dayIdx: number, exIdx: number) => {
    setNewManualPlan(prev => {
      const updatedSchedule = [...prev.weeklySchedule];
      updatedSchedule[dayIdx].exercises = updatedSchedule[dayIdx].exercises.filter((_, i) => i !== exIdx);
      return { ...prev, weeklySchedule: updatedSchedule };
    });
  };

  const removeDayFromManualPlan = (dayIdx: number) => {
    setNewManualPlan(prev => ({
      ...prev,
      weeklySchedule: prev.weeklySchedule.filter((_, i) => i !== dayIdx)
    }));
  };

  const planDetails = calculatePlanDetails(user);
  
  const startWorkoutFromPlan = (day: DayPlan) => {
    const newWorkout: ActiveWorkout = {
      name: day.day,
      startTime: new Date().toISOString(),
      exercises: day.exercises.map(ex => ({
        id: Math.random().toString(36).substr(2, 9),
        name: ex.name,
        sets: Array.from({ length: ex.sets }).map(() => ({
          weight: 0,
          reps: parseInt(ex.reps) || 0,
          isCompleted: false,
          type: 'normal'
        }))
      }))
    };
    setActiveWorkout(newWorkout);
    setActiveSubTab('log');
  };

  const addExerciseToActiveWorkout = (exercise: any) => {
    if (!activeWorkout) return;
    const newExercise: LoggedExercise = {
      id: Math.random().toString(36).substr(2, 9),
      name: exercise.name,
      sets: [{ weight: 0, reps: 0, isCompleted: false, type: 'normal' }]
    };
    setActiveWorkout({
      ...activeWorkout,
      exercises: [...activeWorkout.exercises, newExercise]
    });
    setActiveSubTab('log');
  };
  
  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [selectedTutorialUrl, setSelectedTutorialUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      const plans = await fetchManualPlans();
      await fetchWorkoutPlan(plans);
      await fetchCompletedExercises();
      await fetchAchievements();
    };
    init();
  }, [user.uid]);

  const fetchAchievements = async () => {
    try {
      const achDoc = await getDoc(doc(db, 'users', user.uid, 'achievements', 'stats'));
      if (achDoc.exists()) {
        setAchievements(achDoc.data().list || []);
      } else {
        // Initialize with empty list if not exists
        await setDoc(doc(db, 'users', user.uid, 'achievements', 'stats'), { list: [] });
        setAchievements([]);
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
    }
  };

  const ACHIEVEMENTS_LIST = [
    { id: 'first_workout', title: 'First Workout', description: 'Complete your first workout', icon: '��', target: 1, type: 'workouts' },
    { id: 'workout_10', title: '10 Workouts', description: 'Complete 10 workouts', icon: '��', target: 10, type: 'workouts' },
    { id: 'workout_50', title: '50 Workouts', description: 'Complete 50 workouts', icon: '⭐', target: 50, type: 'workouts' },
    { id: 'volume_1000', title: '1,000kg Lifter', description: 'Lift a total of 1,000kg', icon: '��', target: 1000, type: 'volume' },
    { id: 'volume_10000', title: '10,000kg Lifter', description: 'Lift a total of 10,000kg', icon: '��️', target: 10000, type: 'volume' },
    { id: 'streak_3', title: '3 Day Streak', description: 'Workout 3 days in a row', icon: '⚡', target: 3, type: 'streak' },
    { id: 'streak_7', title: '7 Day Streak', description: 'Workout 7 days in a row', icon: '��', target: 7, type: 'streak' },
    { id: 'weight_pr', title: 'Weight Record', description: 'Break your heaviest lift record', icon: '��', type: 'record' },
    { id: 'volume_record', title: 'Volume Record', description: 'Break your total workout volume record', icon: '��', type: 'record' },
    { id: 'reps_record', title: 'Reps Record', description: 'Break your total reps in one workout record', icon: '��', type: 'record' },
  ];

  const checkAchievements = async (newWorkout: any) => {
    try {
      const achRef = doc(db, 'users', user.uid, 'achievements', 'stats');
      const achDoc = await getDoc(achRef);
      const currentAch = achDoc.exists() ? achDoc.data().list || [] : [];
      
      const statsRef = doc(db, 'users', user.uid, 'stats', 'fitness');
      const statsDoc = await getDoc(statsRef);
      const stats = statsDoc.exists() ? statsDoc.data() : { totalWorkouts: 0, totalVolume: 0, lastWorkoutDate: '', currentStreak: 0, bestVolume: 0, bestReps: 0, bestWeight: 0 };
      
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      const newTotalWorkouts = (stats.totalWorkouts || 0) + 1;
      const newTotalVolume = (stats.totalVolume || 0) + (newWorkout.totalVolume || 0);
      let newStreak = stats.currentStreak || 0;
      
      if (stats.lastWorkoutDate === yesterday) {
        newStreak += 1;
      } else if (stats.lastWorkoutDate !== today) {
        newStreak = 1;
      }

      // Calculate current workout stats
      const currentVolume = newWorkout.totalVolume || 0;
      const currentReps = newWorkout.exercises?.reduce((acc: number, ex: any) => 
        acc + ex.sets.reduce((sAcc: number, s: any) => sAcc + (s.reps || 0), 0), 0) || 0;
      const currentMaxWeight = newWorkout.exercises?.reduce((acc: number, ex: any) => 
        Math.max(acc, ex.sets.reduce((sAcc: number, s: any) => Math.max(sAcc, s.weight || 0), 0)), 0) || 0;

      let isNewVolumeRecord = currentVolume > (stats.bestVolume || 0);
      let isNewRepsRecord = currentReps > (stats.bestReps || 0);
      let isNewWeightRecord = currentMaxWeight > (stats.bestWeight || 0);
      
      await setDoc(statsRef, {
        totalWorkouts: newTotalWorkouts,
        totalVolume: newTotalVolume,
        lastWorkoutDate: today,
        currentStreak: newStreak,
        bestVolume: isNewVolumeRecord ? currentVolume : (stats.bestVolume || 0),
        bestReps: isNewRepsRecord ? currentReps : (stats.bestReps || 0),
        bestWeight: isNewWeightRecord ? currentMaxWeight : (stats.bestWeight || 0)
      }, { merge: true });
      
      const newlyUnlocked = [];
      for (const ach of ACHIEVEMENTS_LIST) {
        if (currentAch.some((a: any) => a.id === ach.id)) continue;
        
        let unlocked = false;
        if (ach.type === 'workouts' && newTotalWorkouts >= ach.target!) unlocked = true;
        if (ach.type === 'volume' && newTotalVolume >= ach.target!) unlocked = true;
        if (ach.type === 'streak' && newStreak >= ach.target!) unlocked = true;
        
        // New Record Achievements
        if (ach.id === 'volume_record' && isNewVolumeRecord && stats.totalWorkouts > 0) unlocked = true;
        if (ach.id === 'reps_record' && isNewRepsRecord && stats.totalWorkouts > 0) unlocked = true;
        if (ach.id === 'weight_pr' && isNewWeightRecord && stats.totalWorkouts > 0) unlocked = true;
        
        if (unlocked) {
          newlyUnlocked.push({ ...ach, unlockedAt: new Date().toISOString() });
        }
      }
      
      if (newlyUnlocked.length > 0) {
        const updatedList = [...currentAch, ...newlyUnlocked];
        await updateDoc(achRef, { list: updatedList });
        setAchievements(updatedList);
        
        newlyUnlocked.forEach(ach => {
          alert(`�� New Achievement: ${language === 'ar' ? ach.titleAr : ach.title}!`);
        });
      }
    } catch (error) {
      console.error("Error checking achievements:", error);
    }
  };

  const fetchCompletedExercises = async () => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const logDoc = await getDoc(doc(db, 'users', user.uid, 'dailyLogs', todayStr));
      if (logDoc.exists()) {
        const data = logDoc.data();
        if (data.workouts) {
          setCompletedExercises(data.workouts.map((w: any) => w.name));
        }
      }
    } catch (error) {
      console.error("Error fetching completed exercises:", error);
    }
  };

  const markExerciseComplete = async (exercise: Exercise) => {
    if (completedExercises.includes(exercise.name)) return;

    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const logRef = doc(db, 'users', user.uid, 'dailyLogs', todayStr);
      const logDoc = await getDoc(logRef);
      
      // Estimate calories burned (e.g., 50 kcal per exercise)
      const caloriesBurned = 50;
      
      const newWorkout = {
        name: exercise.name,
        duration: 15, // estimated minutes
        caloriesBurned
      };

      if (logDoc.exists()) {
        const data = logDoc.data();
        const workouts = data.workouts || [];
        await setDoc(logRef, { date: todayStr, workouts: [...workouts, newWorkout] }, { merge: true });
      } else {
        await setDoc(logRef, {
          date: todayStr,
          meals: [],
          totalCalories: 0,
          exercise: '',
          waterIntake: 0,
          weight: user.weight || 0,
          workouts: [newWorkout]
        });
      }
      
      setCompletedExercises(prev => [...prev, exercise.name]);
      setShowExerciseSummary({
        name: exercise.name,
        calories: caloriesBurned,
        duration: 15,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (error) {
      console.error("Error marking exercise complete:", error);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setCameraError(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = url;
      }
    }
  };

  const fetchWorkoutPlan = async (existingManualPlans?: any[]) => {
    setLoadingPlan(true);
    try {
      const planDoc = await getDoc(doc(db, 'users', user.uid, 'plans', 'workout'));
      if (planDoc.exists()) {
        const planData = planDoc.data() as WorkoutPlan;
        setWorkoutPlan(planData);
        
        // If it's an AI plan, also set it as the current AI plan
        if ((planData as any).isAI) {
          setAiPlan(planData);
          setPlanMode('ai');
        } else {
          // Check if it's a manual plan
          // We don't set selectedManualPlan here so the user sees the list of all manual plans first
          setPlanMode('manual');
        }
      } else {
        await generateNewPlan();
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}/plans/workout`);
    } finally {
      setLoadingPlan(false);
    }
  };

  const generateNewPlan = async () => {
    const cost = 50;
    if ((user.credits || 0) < cost) {
      alert(`Sorry, your balance is insufficient. You need ${cost} points to generate a smart plan.`);
      return;
    }

    setLoadingPlan(true);
    try {
      const plan = await generateWorkoutPlan(user, planDetails.training.intensity);
      const aiPlanData = { ...plan, isAI: true };
      await setDoc(doc(db, 'users', user.uid, 'plans', 'workout'), aiPlanData);
      setWorkoutPlan(aiPlanData);
      setAiPlan(aiPlanData);
      setSelectedManualPlan(null);
      
      // Deduct credits
      const newCredits = (user.credits || 0) - cost;
      await updateDoc(doc(db, 'users', user.uid), { credits: newCredits });
    } catch (error: any) {
      console.error('Error generating plan:', error);
      if (error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED') {
        alert("AI workout generation quota reached. Please try again in a few minutes.");
      } else {
        alert("Failed to generate workout plan. Please check your profile details and try again.");
      }
    } finally {
      setLoadingPlan(false);
    }
  };

  const startCamera = async () => {
    // Camera disabled as per user request to use recorded video instead
    setCameraError("Camera access is disabled. Please upload a recorded video for analysis.");
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const captureAndAnalyze = async () => {
    console.log("captureAndAnalyze triggered", { 
      hasVideoRef: !!videoRef.current, 
      hasCanvasRef: !!canvasRef.current, 
      selectedExercise,
      isAnalyzing 
    });

    if (!videoRef.current || !canvasRef.current || !selectedExercise) {
      if (!selectedExercise) alert("Please select an exercise first.");
      return;
    }
    
    const cost = 25;
    if ((user.credits || 0) < cost) {
      alert(`Sorry, your balance is insufficient. You need ${cost} points for video analysis.`);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAnalysisError(null);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    // Downscale for Gemini (max 1024px on longest side is usually safe and efficient)
    const maxDim = 1024;
    let width = video.videoWidth;
    let height = video.videoHeight;
    console.log("Video dimensions:", { width, height });
    
    if (!width || !height) {
      console.error("Video dimensions are 0", { width, height });
      alert("Could not capture video frame. Please ensure the video is loaded and playing.");
      setIsAnalyzing(false);
      return;
    }
    
    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = (maxDim / width) * height;
        width = maxDim;
      } else {
        width = (maxDim / height) * width;
        height = maxDim;
      }
    }
    
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Could not get canvas context");
      setIsAnalyzing(false);
      return;
    }
    ctx.drawImage(video, 0, 0, width, height);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    const parts = dataUrl.split(',');
    if (parts.length < 2) {
      console.error("Invalid data URL generated from canvas");
      alert("Failed to process video frame. Please try again.");
      setIsAnalyzing(false);
      return;
    }
    const base64Image = parts[1];
    console.log("Frame captured, sending to AI...");
    
    try {
      const result = await analyzeExerciseForm(base64Image, selectedExercise, selectedTutorialUrl || undefined);
      console.log("AI Analysis successful:", result);
      setAnalysisResult(result);
      
      // Deduct credits
      const newCredits = (user.credits || 0) - 25;
      await updateDoc(doc(db, 'users', user.uid), { credits: newCredits });
      onUpdate({ ...user, credits: newCredits });
    } catch (error: any) {
      console.error('Analysis error:', error);
      setAnalysisError(error?.message || "Failed to analyze exercise form.");
      // Friendly error message for quota
      if (error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED') {
        alert("AI analysis quota reached. Please try again in a few minutes.");
      } else {
        alert(`Analysis failed: ${error?.message || 'Please ensure your form is clearly visible in the frame.'}`);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Sports Science Lab</h2>
          <p className="text-xs md:text-sm text-slate-500">Evidence-based training protocols & biomechanical analysis</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-emerald-100 shadow-sm self-start overflow-x-auto max-w-full scrollbar-hide">
          <button 
            onClick={() => setActiveSubTab('plan')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeSubTab === 'plan' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Training Protocol
          </button>
          <button 
            onClick={() => { setActiveSubTab('analysis'); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeSubTab === 'analysis' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Biomechanical Analysis
          </button>
          <button 
            onClick={() => setActiveSubTab('library')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeSubTab === 'library' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Exercise Library
          </button>
          <button 
            onClick={() => setActiveSubTab('achievements')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeSubTab === 'achievements' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Medals & Rewards
          </button>
          <button 
            onClick={() => setActiveSubTab('my-sports')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeSubTab === 'my-sports' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
          >
            My Sports
          </button>
          <button 
            onClick={() => setActiveSubTab('log')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeSubTab === 'log' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Log Workout
          </button>
          <button 
            onClick={() => setActiveSubTab('history')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeSubTab === 'history' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
          >
            History
          </button>
        </div>
      </div>


      <AnimatePresence mode="wait">
        {activeSubTab === 'plan' && (
          <motion.div 
            key="plan"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex bg-slate-100 p-1 rounded-2xl w-fit max-w-full overflow-x-auto scrollbar-hide">
              <button 
                onClick={() => setPlanMode('ai')}
                className={`px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${planMode === 'ai' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Zap size={14} fill={planMode === 'ai' ? 'currentColor' : 'none'} />
                AI Smart Plan
                {aiPlan && workoutPlan?.isAI && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
              </button>
              <button 
                onClick={() => setPlanMode('protocols')}
                className={`px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${planMode === 'protocols' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <BookOpen size={14} />
                Science Protocols
                {selectedProtocol && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
              </button>
              <button 
                onClick={() => setPlanMode('manual')}
                className={`px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${planMode === 'manual' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Dumbbell size={14} />
                Manual Plan
                {workoutPlan && !workoutPlan.isAI && !selectedProtocol && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
              </button>
            </div>

            {planMode === 'protocols' ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {SCIENCE_BASED_PROTOCOLS.map((protocol) => (
                    <button
                      key={protocol.id}
                      onClick={() => {
                        setSelectedProtocol(protocol);
                        setSelectedManualPlan(null);
                        setWorkoutPlan(null);
                      }}
                      className={`p-4 md:p-6 rounded-2xl md:rounded-3xl border-2 transition-all text-left ${
                        selectedProtocol?.id === protocol.id 
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-100' 
                          : 'border-slate-100 bg-white hover:border-emerald-200'
                      }`}
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 text-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4">
                        <BookOpen size={20} className="md:w-6 md:h-6" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm md:text-base mb-1 md:mb-2">{protocol.planTitle}</h4>
                      <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed mb-3 md:mb-4 line-clamp-2">{protocol.description}</p>
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[9px] md:text-[10px] font-bold rounded uppercase">{protocol.intensity}</span>
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[9px] md:text-[10px] font-bold rounded uppercase">{protocol.frequency}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedProtocol && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4 md:space-y-6">
                      <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl border border-emerald-50 shadow-sm">
                        <div className="flex items-center justify-between mb-6 md:mb-8">
                          <div>
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900">{selectedProtocol.planTitle}</h3>
                            <p className="text-xs md:text-sm text-emerald-600 font-bold">{selectedProtocol.description}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-6 md:space-y-10">
                          {selectedProtocol.weeklySchedule.map((day, idx) => (
                            <div key={idx} className="bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100 overflow-hidden">
                              <div 
                                onClick={() => toggleDay(idx)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && toggleDay(idx)}
                                className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-white transition-all group cursor-pointer"
                              >
                                <div className="flex items-center gap-3 md:gap-4">
                                  <span className="w-8 h-8 md:w-10 md:h-10 bg-emerald-600 text-white rounded-lg md:rounded-xl flex items-center justify-center text-xs md:text-sm shadow-lg shadow-emerald-100 font-bold">
                                    {idx + 1}
                                  </span>
                                  <div className="text-left">
                                    <h4 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                      {getDayLabel(idx)}
                                    </h4>
                                    <p className="text-[10px] md:text-xs text-slate-500 font-medium">{day.day} • {day.exercises.length} Exercises</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 md:gap-4">
                                  {expandedDays.includes(idx) && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        markDayComplete(day);
                                      }}
                                      className="px-3 py-1.5 md:px-4 md:py-2 bg-emerald-100 text-emerald-700 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold hover:bg-emerald-200 transition-all flex items-center gap-1.5 md:gap-2"
                                    >
                                      <CheckCircle2 size={12} className="md:w-3.5 md:h-3.5" />
                                      <span className="hidden xs:inline">Finish Day</span>
                                      <span className="xs:hidden">Done</span>
                                    </button>
                                  )}
                                  <div className={`p-1.5 md:p-2 rounded-lg bg-white border border-slate-100 text-slate-400 transition-transform duration-300 ${expandedDays.includes(idx) ? 'rotate-180' : ''}`}>
                                    <ChevronDown size={16} className="md:w-5 md:h-5" />
                                  </div>
                                </div>
                              </div>

                              <AnimatePresence>
                                {expandedDays.includes(idx) && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-slate-100 bg-white"
                                  >
                                    <div className="p-6 space-y-4">
                                      <div className="grid gap-4">
                                        {day.exercises.map((ex, exIdx) => (
                                      <div key={exIdx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-emerald-300 hover:bg-white transition-all gap-4">
                                        <div className="flex items-center gap-3 md:gap-4">
                                          <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                            <Dumbbell size={20} className="md:w-6 md:h-6" />
                                          </div>
                                          <div>
                                            <div className="flex items-center gap-2">
                                              <p className="font-bold text-slate-900 text-base md:text-lg">{ex.name}</p>
                                              {EXERCISE_LIBRARY.find(l => l.name === ex.name) && (
                                                <button
                                                  onClick={() => setSelectedExerciseInfo(EXERCISE_LIBRARY.find(l => l.name === ex.name) || null)}
                                                  className="p-1 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                                                >
                                                  <Info size={16} />
                                                </button>
                                              )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] md:text-[10px] font-bold rounded uppercase tracking-wider">{ex.sets} Sets</span>
                                              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] md:text-[10px] font-bold rounded uppercase tracking-wider">{ex.reps} Reps</span>
                                              <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-[9px] md:text-[10px] font-bold rounded uppercase tracking-wider">{ex.rest} Rest</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                          {ex.videoUrl && (
                                            <button 
                                              onClick={() => setSelectedExerciseInfo(EXERCISE_LIBRARY.find(l => l.name === ex.name) || { id: 'custom', name: ex.name, videoUrl: ex.videoUrl, instructions: 'Follow the video tutorial for proper form.', category: 'Custom', difficulty: 'Intermediate', equipment: 'Varies', muscles: [] } as any)}
                                              className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white border border-slate-200 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold text-slate-600 hover:border-emerald-600 hover:text-emerald-600 transition-all"
                                            >
                                              <Play size={14} className="md:w-4 md:h-4" />
                                              Tutorial
                                            </button>
                                          )}
                                          <button 
                                            onClick={() => startWorkoutFromPlan(day)}
                                            className="px-3 py-1.5 md:px-4 md:py-2 bg-emerald-600 text-white rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1.5 md:gap-2"
                                          >
                                            <Play size={12} fill="currentColor" className="md:w-3.5 md:h-3.5" />
                                            Start
                                          </button>
                                        </div>
                                      </div>
                                        ))}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : planMode === 'manual' ? (
              <div className="space-y-8">
                {isCreatingManualPlan ? (
                  <Card className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-slate-900">Create Manual Plan</h3>
                      <button 
                        onClick={() => setIsCreatingManualPlan(false)}
                        className="p-2 text-slate-400 hover:text-slate-600"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Plan Title</label>
                        <input 
                          type="text"
                          value={newManualPlan.planTitle}
                          onChange={(e) => setNewManualPlan(prev => ({ ...prev, planTitle: e.target.value }))}
                          placeholder="e.g., Summer Shred, Powerlifting Phase 1"
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>

                      <div className="space-y-6">
                        {newManualPlan.weeklySchedule.map((day, dayIdx) => (
                          <div key={dayIdx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                            <div className="flex items-center justify-between">
                              <input 
                                type="text"
                                value={day.day}
                                onChange={(e) => {
                                  const updated = [...newManualPlan.weeklySchedule];
                                  updated[dayIdx].day = e.target.value;
                                  setNewManualPlan(prev => ({ ...prev, weeklySchedule: updated }));
                                }}
                                className="bg-transparent font-bold text-slate-900 outline-none border-b border-transparent focus:border-emerald-500"
                              />
                              <button 
                                onClick={() => removeDayFromManualPlan(dayIdx)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>

                            <div className="space-y-2">
                              {day.exercises.map((ex, exIdx) => (
                                <div key={exIdx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100">
                                  <div>
                                    <p className="font-bold text-slate-900 text-sm">{ex.name}</p>
                                    <p className="text-xs text-slate-500">{ex.sets} sets • {ex.reps} reps • {ex.rest} rest</p>
                                  </div>
                                  <button 
                                    onClick={() => removeExerciseFromManualDay(dayIdx, exIdx)}
                                    className="text-slate-400 hover:text-red-500"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              ))}
                            </div>

                            {addingExerciseToDay === dayIdx ? (
                              <div className="bg-white p-4 rounded-2xl border border-emerald-100 space-y-3 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">New Exercise</h5>
                                  <button 
                                    onClick={() => setShowLibraryForManual(true)} 
                                    className="text-[10px] font-bold text-slate-400 hover:text-emerald-600 flex items-center gap-1"
                                  >
                                    <Search size={12} /> Pick from Library
                                  </button>
                                </div>
                                <input 
                                  type="text"
                                  placeholder="Exercise Name"
                                  value={tempExercise.name}
                                  onChange={(e) => setTempExercise(prev => ({ ...prev, name: e.target.value }))}
                                  className="w-full px-3 py-2 rounded-xl border border-slate-100 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <div className="grid grid-cols-3 gap-2">
                                  <div>
                                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Sets</label>
                                    <input 
                                      type="number"
                                      value={tempExercise.sets}
                                      onChange={(e) => setTempExercise(prev => ({ ...prev, sets: parseInt(e.target.value) || 0 }))}
                                      className="w-full px-3 py-2 rounded-xl border border-slate-100 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Reps</label>
                                    <input 
                                      type="text"
                                      value={tempExercise.reps}
                                      onChange={(e) => setTempExercise(prev => ({ ...prev, reps: e.target.value }))}
                                      className="w-full px-3 py-2 rounded-xl border border-slate-100 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Rest</label>
                                    <input 
                                      type="text"
                                      value={tempExercise.rest}
                                      onChange={(e) => setTempExercise(prev => ({ ...prev, rest: e.target.value }))}
                                      className="w-full px-3 py-2 rounded-xl border border-slate-100 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                  <button 
                                    onClick={() => {
                                      if (!tempExercise.name) return;
                                      addExerciseToManualDay(dayIdx, tempExercise);
                                      setAddingExerciseToDay(null);
                                      setTempExercise({ name: '', sets: 3, reps: '10-12', rest: '60s' });
                                    }}
                                    className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm"
                                  >
                                    Add
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setAddingExerciseToDay(null);
                                      setTempExercise({ name: '', sets: 3, reps: '10-12', rest: '60s' });
                                    }}
                                    className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button 
                                onClick={() => setAddingExerciseToDay(dayIdx)}
                                className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 text-xs font-bold hover:border-emerald-500 hover:text-emerald-500 transition-all flex items-center justify-center gap-2"
                              >
                                <Plus size={14} /> Add Exercise
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={addDayToManualPlan}
                        className="w-full py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={18} /> Add Day
                      </button>

                      <div className="pt-4">
                        <Button 
                          onClick={() => saveManualPlan(newManualPlan)}
                          className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100"
                          disabled={!newManualPlan.planTitle || newManualPlan.weeklySchedule.length === 0}
                        >
                          Save Plan
                        </Button>
                      </div>
                    </div>

                    {showLibraryForManual && (
                      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-white rounded-[32px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                        >
                          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-900">Exercise Library</h3>
                            <button onClick={() => setShowLibraryForManual(false)} className="p-2 text-slate-400 hover:text-slate-600">
                              <X size={24} />
                            </button>
                          </div>
                          <div className="flex-1 overflow-y-auto p-6">
                            <ExerciseLibrary 
                              user={user}
                              onAddExercise={(ex) => {
                                setTempExercise(prev => ({ ...prev, name: ex.name }));
                                setShowLibraryForManual(false);
                              }}
                            />
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </Card>
                ) : selectedManualPlan ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <Button 
                        onClick={() => setSelectedManualPlan(null)}
                        className="text-slate-500 hover:text-emerald-600 flex items-center gap-2"
                      >
                        <ChevronLeft size={20} /> Back to Manual Plans
                      </Button>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                          Manual Custom Plan
                        </span>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">{selectedManualPlan.planTitle}</h3>
                          <p className="text-sm text-slate-500 font-medium">Created by you • {selectedManualPlan.weeklySchedule.length} Training Days</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            onClick={() => {
                              setNewManualPlan(selectedManualPlan);
                              setIsCreatingManualPlan(true);
                            }}
                            className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                          >
                            <Settings size={20} />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {selectedManualPlan.weeklySchedule.map((day: any, idx: number) => (
                          <div key={idx} className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                            <div 
                              onClick={() => toggleDay(idx)}
                              className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-white transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-4">
                                <span className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold">
                                  {idx + 1}
                                </span>
                                <div className="text-left">
                                  <h4 className="text-lg font-bold text-slate-900">{day.day}</h4>
                                  <p className="text-xs text-slate-500">{day.exercises.length} Exercises</p>
                                </div>
                              </div>
                              <ChevronDown size={20} className={`text-slate-400 transition-transform ${expandedDays.includes(idx) ? 'rotate-180' : ''}`} />
                            </div>
                            
                            <AnimatePresence>
                              {expandedDays.includes(idx) && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="border-t border-slate-100 bg-white p-6"
                                >
                                  <div className="grid gap-4">
                                    {day.exercises.map((ex: any, exIdx: number) => (
                                      <div key={exIdx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-4">
                                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100">
                                            <Dumbbell size={24} />
                                          </div>
                                          <div>
                                            <p className="font-bold text-slate-900">{ex.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{ex.sets} Sets</span>
                                              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{ex.reps} Reps</span>
                                              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">{ex.rest} Rest</span>
                                            </div>
                                          </div>
                                        </div>
                                        <button 
                                          onClick={() => startWorkoutFromPlan(day)}
                                          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-2"
                                        >
                                          <Play size={14} fill="currentColor" /> Start
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-slate-900">Your Manual Plans</h3>
                      <div className="flex items-center gap-3">
                        {selectedManualPlan && (
                          <Button 
                            onClick={async () => {
                              setSelectedManualPlan(null);
                              // If we clear manual plan, maybe we should default back to AI plan if it exists
                              if (aiPlan) {
                                setWorkoutPlan(aiPlan);
                                try {
                                  await setDoc(doc(db, 'users', user.uid, 'plans', 'workout'), aiPlan);
                                  alert('Manual plan deselected. AI plan is now active.');
                                } catch (error) {
                                  console.error("Error clearing selection:", error);
                                }
                              } else {
                                setWorkoutPlan(null);
                              }
                            }}
                            className="text-slate-500 hover:text-red-500 text-xs font-bold flex items-center gap-1"
                          >
                            <X size={14} /> Clear Selection
                          </Button>
                        )}
                        <Button 
                          onClick={() => {
                            setNewManualPlan({
                              planTitle: '',
                              weeklySchedule: [],
                              injuryPreventionTips: [],
                              scientificBasis: 'Custom manual plan'
                            });
                            setIsCreatingManualPlan(true);
                          }}
                          className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2"
                        >
                          <Plus size={18} /> Create New
                        </Button>
                      </div>
                    </div>

                    {manualPlans.length === 0 ? (
                      <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <Dumbbell size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500 font-medium">No manual plans yet. Create your first one!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {manualPlans.map((plan: any) => (
                          <Card key={plan.id} className="p-6 hover:shadow-md transition-all group">
                            <div className="flex items-center justify-between mb-4">
                              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                                <Dumbbell size={24} />
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button 
                                  onClick={() => {
                                    setNewManualPlan(plan);
                                    setIsCreatingManualPlan(true);
                                  }}
                                  className="p-2 text-slate-400 hover:text-emerald-600"
                                >
                                  <Settings size={18} />
                                </button>
                                <button 
                                  onClick={() => deleteManualPlan(plan.id)}
                                  className="p-2 text-slate-400 hover:text-red-600"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                            <h4 className="font-bold text-slate-900 mb-1">{plan.planTitle}</h4>
                            <p className="text-xs text-slate-500 mb-4">{plan.weeklySchedule.length} Days • {plan.weeklySchedule.reduce((acc: number, day: any) => acc + day.exercises.length, 0)} Exercises</p>
                            <Button 
                              onClick={async () => {
                                setSelectedManualPlan(plan);
                                setWorkoutPlan(plan); // Set as active plan
                                setSelectedProtocol(null); // Clear protocol
                                try {
                                  await setDoc(doc(db, 'users', user.uid, 'plans', 'workout'), { ...plan, isAI: false });
                                  alert(`Plan "${plan.planTitle}" selected and saved!`);
                                } catch (error) {
                                  console.error("Error saving selected plan:", error);
                                }
                              }}
                              className={`w-full py-2 rounded-xl font-bold transition-all ${
                                workoutPlan?.id === plan.id 
                                  ? 'bg-emerald-100 text-emerald-700' 
                                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-600 hover:text-white'
                              }`}
                            >
                              {workoutPlan?.id === plan.id ? 'Active Plan' : 'Select Plan'}
                            </Button>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : planMode === 'ai' ? (
              loadingPlan ? (
                <div className="bg-white p-12 rounded-3xl border border-emerald-50 flex flex-col items-center justify-center text-center">
                  <RefreshCw className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
                  <h3 className="text-xl font-bold text-slate-900">Synthesizing Scientific Protocol...</h3>
                  <p className="text-slate-500">Cross-referencing your biometric data with exercise research</p>
                </div>
              ) : aiPlan ? (
                <div className="space-y-6">
                  <div className="bg-white p-5 md:p-6 rounded-3xl border border-emerald-50 shadow-sm">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-2xl font-bold text-slate-900">{aiPlan.planTitle}</h3>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200 flex items-center gap-1">
                              <Zap size={10} fill="currentColor" />
                              AI Smart Plan
                            </span>
                          </div>
                          <p className="text-sm text-emerald-600 font-bold">Optimized for: {user.goal?.replace('_', ' ')}</p>
                        </div>
                        <button onClick={generateNewPlan} className="text-emerald-600 hover:text-emerald-700 text-sm font-bold flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
                          <RefreshCw size={16} />
                          Update Protocol
                        </button>
                      </div>
                      
                      <div className="space-y-6 md:space-y-10">
                        {aiPlan.weeklySchedule.map((day, idx) => (
                          <div key={idx} className="bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100 overflow-hidden">
                            <div 
                              onClick={() => toggleDay(idx)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => e.key === 'Enter' && toggleDay(idx)}
                              className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-white transition-all group cursor-pointer"
                            >
                              <div className="flex items-center gap-3 md:gap-4">
                                <span className="w-8 h-8 md:w-10 md:h-10 bg-emerald-600 text-white rounded-lg md:rounded-xl flex items-center justify-center text-xs md:text-sm shadow-lg shadow-emerald-100 font-bold">
                                  {idx + 1}
                                </span>
                                <div className="text-left">
                                  <h4 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                    {getDayLabel(idx)}
                                  </h4>
                                  <p className="text-[10px] md:text-xs text-slate-500 font-medium">{day.day} • {day.exercises.length} Exercises</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 md:gap-4">
                                {expandedDays.includes(idx) && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markDayComplete(day);
                                    }}
                                    className="px-3 py-1.5 md:px-4 md:py-2 bg-emerald-100 text-emerald-700 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold hover:bg-emerald-200 transition-all flex items-center gap-1.5 md:gap-2"
                                  >
                                    <CheckCircle2 size={12} className="md:w-3.5 md:h-3.5" />
                                    <span className="hidden xs:inline">Finish Day</span>
                                    <span className="xs:hidden">Done</span>
                                  </button>
                                )}
                                <div className={`p-1.5 md:p-2 rounded-lg bg-white border border-slate-100 text-slate-400 transition-transform duration-300 ${expandedDays.includes(idx) ? 'rotate-180' : ''}`}>
                                  <ChevronDown size={16} className="md:w-5 md:h-5" />
                                </div>
                              </div>
                            </div>

                            <AnimatePresence>
                              {expandedDays.includes(idx) && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="border-t border-slate-100 bg-white"
                                >
                                  <div className="p-6 space-y-4">
                                    <div className="grid gap-4">
                                      {day.exercises.map((ex, exIdx) => (
                                          <div key={exIdx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-emerald-300 hover:bg-white transition-all gap-4">
                                            <div className="flex items-center gap-3 md:gap-4">
                                              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                                <Dumbbell size={20} className="md:w-6 md:h-6" />
                                              </div>
                                              <div>
                                                <div className="flex items-center gap-2">
                                                  <p className="font-bold text-slate-900 text-base md:text-lg">{ex.name}</p>
                                                  {EXERCISE_LIBRARY.find(l => l.name === ex.name) && (
                                                    <button
                                                      onClick={() => setSelectedExerciseInfo(EXERCISE_LIBRARY.find(l => l.name === ex.name) || null)}
                                                      className="p-1 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                                                    >
                                                      <Info size={16} />
                                                    </button>
                                                  )}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                                  <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] md:text-[10px] font-bold rounded uppercase tracking-wider">{ex.sets} Sets</span>
                                                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] md:text-[10px] font-bold rounded uppercase tracking-wider">{ex.reps} Reps</span>
                                                  <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-[9px] md:text-[10px] font-bold rounded uppercase tracking-wider">{ex.rest} Rest</span>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2">
                                              <div className="flex flex-wrap items-center gap-2">
                                                <button 
                                                  onClick={() => startWorkoutFromPlan(day)}
                                                  className="px-3 py-1.5 md:px-4 md:py-2 bg-emerald-600 text-white rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1.5 md:gap-2"
                                                >
                                                  <Play size={12} fill="currentColor" className="md:w-3.5 md:h-3.5" />
                                                  Start
                                                </button>
                                                <button 
                                                  onClick={() => markExerciseComplete(ex)}
                                                  disabled={completedExercises.includes(ex.name)}
                                                  className={`flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold transition-all ${
                                                    completedExercises.includes(ex.name) 
                                                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                                                      : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-600 hover:text-emerald-600'
                                                  }`}
                                                >
                                                  <CheckCircle2 size={14} className="md:w-4 md:h-4" />
                                                  {completedExercises.includes(ex.name) ? 'Done' : 'Mark'}
                                                </button>
                                              </div>
                                              {ex.videoUrl && (
                                                <button 
                                                  onClick={() => setSelectedExerciseInfo(EXERCISE_LIBRARY.find(l => l.name === ex.name) || { id: 'custom', name: ex.name, videoUrl: ex.videoUrl, instructions: 'Follow the video tutorial for proper form.', category: 'Custom', difficulty: 'Intermediate', equipment: 'Varies', muscles: [] } as any)}
                                                  className="flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white border border-slate-200 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold text-slate-600 hover:border-emerald-600 hover:text-emerald-600 transition-all"
                                                >
                                                  <Play size={14} className="md:w-4 md:h-4" />
                                                  Tutorial
                                                </button>
                                              )}
                                              <button 
                                                onClick={() => { 
                                                  setActiveSubTab('analysis'); 
                                                  setSelectedExercise(ex.name);
                                                  setSelectedTutorialUrl(ex.videoUrl || null);
                                                }}
                                                className="p-2 bg-emerald-50 text-emerald-600 rounded-lg md:rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                                                title="Analyze Form"
                                              >
                                                <Camera size={18} className="md:w-5 md:h-5" />
                                              </button>
                                            </div>
                                          </div>
                                      ))}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-3xl border border-emerald-50">
                  <RefreshCw className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-900">No AI Plan Generated</h3>
                  <p className="text-slate-500 mb-6">Generate a smart plan tailored to your goals.</p>
                  <Button onClick={generateNewPlan} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-100">
                    Generate Smart Plan
                  </Button>
                </div>
              )
            ) : null}

            {/* Plan Insights & Safety Section */}
            {((planMode === 'ai' && aiPlan) || (planMode === 'manual' && selectedManualPlan) || (planMode === 'protocols' && selectedProtocol)) && (
              <div className="mt-12 pt-12 border-t border-slate-100 space-y-8 max-w-4xl mx-auto px-4">
                <div className="grid gap-6">
                  {/* Health Advice */}
                  {((planMode === 'ai' && aiPlan?.healthAdvice) || 
                    (planMode === 'manual' && selectedManualPlan?.healthAdvice) || 
                    (planMode === 'protocols' && selectedProtocol?.description)) && (
                    <div className="p-6 bg-orange-50 border border-orange-100 rounded-3xl flex items-start gap-4 shadow-sm">
                      <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center shrink-0 text-orange-600">
                        <ActivityIcon size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-orange-900 mb-2">Personalized Health Advice</h4>
                        <p className={`text-sm text-orange-800 leading-relaxed font-medium ${!expandedHealth ? 'line-clamp-2' : ''}`}>
                          {planMode === 'ai' ? aiPlan?.healthAdvice : 
                           planMode === 'manual' ? selectedManualPlan?.healthAdvice : 
                           selectedProtocol?.description}
                        </p>
                        <button 
                          onClick={() => setExpandedHealth(!expandedHealth)}
                          className="mt-2 text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                        >
                          {expandedHealth ? <>Read Less <ChevronUp size={14} /></> : <>Read More <ChevronDown size={14} /></>}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Clinical Warnings */}
                  {((planMode === 'ai' && aiPlan?.injuryPreventionTips) || 
                    (planMode === 'manual' && selectedManualPlan?.injuryPreventionTips) || 
                    (planMode === 'protocols' && selectedProtocol?.injuryPreventionTips)) && (
                    <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-800">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center">
                          <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Clinical Warnings</h3>
                      </div>
                      <ul className="space-y-4">
                        {((expandedWarnings 
                          ? (planMode === 'ai' ? aiPlan?.injuryPreventionTips : planMode === 'manual' ? selectedManualPlan?.injuryPreventionTips : selectedProtocol?.injuryPreventionTips || [])
                          : (planMode === 'ai' ? aiPlan?.injuryPreventionTips : planMode === 'manual' ? selectedManualPlan?.injuryPreventionTips : selectedProtocol?.injuryPreventionTips || []).slice(0, 2)
                        ) || []).map((tip, idx) => (
                          <li key={idx} className="flex gap-4 text-slate-300 text-sm leading-relaxed">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                      <button 
                        onClick={() => setExpandedWarnings(!expandedWarnings)}
                        className="mt-6 text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
                      >
                        {expandedWarnings ? <>Show Less <ChevronUp size={14} /></> : <>View All Warnings <ChevronDown size={14} /></>}
                      </button>
                    </div>
                  )}

                  {/* Physiological Basis */}
                  {((planMode === 'ai' && aiPlan?.scientificBasis) || 
                    (planMode === 'manual' && selectedManualPlan?.scientificBasis) || 
                    (planMode === 'protocols' && selectedProtocol?.scientificBasis)) && (
                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-emerald-50 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                        <BookOpen size={80} />
                      </div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                          <ShieldCheck size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Physiological Basis</h3>
                      </div>
                      <p className={`text-slate-600 text-sm leading-relaxed relative z-10 ${!expandedScience ? 'line-clamp-3' : ''}`}>
                        {planMode === 'ai' ? aiPlan?.scientificBasis : 
                         planMode === 'manual' ? selectedManualPlan?.scientificBasis : 
                         selectedProtocol?.scientificBasis}
                      </p>
                      <button 
                        onClick={() => setExpandedScience(!expandedScience)}
                        className="mt-4 relative z-10 text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        {expandedScience ? <>Read Less <ChevronUp size={14} /></> : <>Read More <ChevronDown size={14} /></>}
                      </button>
                      <div className="mt-6 pt-6 border-t border-slate-50 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Info size={12} />
                        Verified by NABD AI Research
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeSubTab === 'achievements' && (
          <motion.div 
            key="achievements"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            <div className="bg-white p-5 md:p-8 rounded-3xl md:rounded-[40px] border border-slate-100 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 md:mb-8">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-50 text-emerald-600 rounded-2xl md:rounded-3xl flex items-center justify-center shrink-0">
                  <Award size={24} className="md:w-8 md:h-8" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900">
                    Medals & Rewards
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500">
                    Complete challenges to unlock new medals
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {ACHIEVEMENTS_LIST.map((ach) => {
                  const isUnlocked = achievements.some((a: any) => a.id === ach.id);
                  const unlockedData = achievements.find((a: any) => a.id === ach.id);
                  
                  return (
                    <div 
                      key={ach.id} 
                      className={`p-5 md:p-6 rounded-2xl md:rounded-[32px] border transition-all duration-500 relative overflow-hidden ${
                        isUnlocked 
                          ? 'bg-white border-emerald-100 shadow-xl shadow-emerald-500/5' 
                          : 'bg-slate-50 border-slate-100 opacity-60 grayscale'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3 md:mb-4">
                        <div className={`text-3xl md:text-4xl ${isUnlocked ? 'animate-bounce' : ''}`}>
                          {ach.icon}
                        </div>
                        {isUnlocked && (
                          <div className="bg-emerald-500 text-white p-1 md:p-1.5 rounded-full">
                            <Check size={10} className="md:w-3 md:h-3" />
                          </div>
                        )}
                      </div>
                      
                      <h4 className={`font-bold text-base md:text-lg mb-1 ${isUnlocked ? 'text-slate-900' : 'text-slate-500'}`}>
                        {ach.title}
                      </h4>
                      <p className="text-[10px] md:text-xs text-slate-400 leading-relaxed mb-3 md:mb-4">
                        {ach.description}
                      </p>
                      
                      {isUnlocked && unlockedData?.unlockedAt && (
                        <div className="text-[9px] md:text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-auto">
                          Unlocked on: 
                          {new Date(unlockedData.unlockedAt).toLocaleDateString()}
                        </div>
                      )}
                      
                      {!isUnlocked && (
                        <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-3 md:mt-4">
                          <div className="bg-slate-400 h-full w-0 transition-all duration-1000" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reward Section */}
            <div className="bg-slate-900 rounded-3xl md:rounded-[40px] p-6 md:p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3 md:mb-4">
                  <Zap className="text-emerald-400 md:w-6 md:h-6" size={20} />
                  <h3 className="text-lg md:text-xl font-bold">
                    Reward System
                  </h3>
                </div>
                <p className="text-slate-400 text-xs md:text-sm mb-5 md:mb-6 max-w-md">
                  Each medal you unlock grants you bonus credits that can be used for generating new AI plans or video analysis.
                </p>
                <div className="flex gap-4">
                  <div className="bg-white/10 backdrop-blur-md p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/10">
                    <p className="text-[9px] md:text-[10px] font-bold text-emerald-400 uppercase mb-1">Bonus Credits</p>
                    <p className="text-xl md:text-2xl font-bold">+50 <span className="text-[10px] md:text-xs font-medium text-slate-400">per medal</span></p>
                  </div>
                </div>
              </div>
              <Award className="absolute -bottom-10 -right-10 text-white/5 w-40 h-40 md:w-60 md:h-60" />
            </div>
          </motion.div>
        )}
        {activeSubTab === 'analysis' && (
          <motion.div 
            key="analysis"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-emerald-50 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <TrendingIcon className="text-emerald-600" />
                    Biomechanical Scanner
                  </h3>
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Performance Analysis Mode
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reference URL (Optional)</label>
                    <input 
                      type="text" 
                      value={selectedTutorialUrl || ''}
                      onChange={(e) => setSelectedTutorialUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Exercise</label>
                    <select 
                      value={selectedExercise}
                      onChange={(e) => setSelectedExercise(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium"
                    >
                      <option value="">Select...</option>
                      <option value="Squat">Squat</option>
                      <option value="Deadlift">Deadlift</option>
                      <option value="Push-up">Push-up</option>
                      <option value="Plank">Plank</option>
                      <option value="Bicep Curl">Bicep Curl</option>
                      <option value="Shoulder Press">Shoulder Press</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Analysis Mode</label>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
                    >
                      <TrendingIcon size={16} />
                      Upload Session
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleVideoUpload} 
                      accept="video/*" 
                      className="hidden" 
                    />
                  </div>
                </div>

                <div className="relative aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  {!videoUrl ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-5 md:p-6 text-center bg-slate-800">
                      <TrendingIcon className="w-12 h-12 text-emerald-500 mb-4" />
                      <h4 className="text-white font-bold mb-2">Upload Exercise Session</h4>
                      <p className="text-slate-400 text-sm mb-6 max-w-xs">Record your exercise and upload the video here for a complete biomechanical diagnostic.</p>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
                      >
                        <Plus size={20} />
                        Select Session File
                      </button>
                    </div>
                  ) : (
                    <>
                      <video 
                        ref={videoRef} 
                        src={videoUrl}
                        autoPlay 
                        playsInline 
                        muted 
                        controls
                        className="w-full h-full object-contain"
                      />
                      <canvas ref={canvasRef} className="hidden" />
                      
                      {/* Scanning Overlay (Visual only) */}
                      {!isAnalyzing && (
                        <div className="absolute inset-0 pointer-events-none opacity-30">
                          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-emerald-500 m-4" />
                          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-emerald-500 m-4" />
                          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-emerald-500 m-4" />
                          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-emerald-500 m-4" />
                        </div>
                      )}
                    </>
                  )}

                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center text-white z-20">
                      <div className="relative">
                        <RefreshCw className="w-16 h-16 text-emerald-400 animate-spin mb-4" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Zap size={24} className="text-emerald-400" />
                        </div>
                      </div>
                      <h4 className="text-xl font-bold mb-1">Processing Biometrics</h4>
                      <p className="text-emerald-400/80 text-sm font-mono">CALCULATING JOINT ANGLES...</p>
                    </div>
                  )}

                  {videoUrl && (
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center px-6 z-10">
                      <button 
                        onClick={captureAndAnalyze}
                        disabled={!selectedExercise || isAnalyzing}
                        className="group relative bg-white text-slate-900 px-10 py-4 rounded-2xl font-bold shadow-2xl hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50 overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center gap-3">
                          <Zap size={20} className="group-hover:animate-pulse" />
                          Run Diagnostic
                        </span>
                        <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Info className="text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Laboratory Instructions</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Ensure adequate lighting and high contrast between your clothing and background. Position the camera at a 45-degree angle for best joint visibility.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {analysisError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-100 p-4 rounded-2xl mb-6 flex items-center gap-3 text-red-700"
                  >
                    <AlertTriangle size={20} className="shrink-0" />
                    <p className="text-sm font-medium">{analysisError}</p>
                  </motion.div>
                )}

                {analysisResult ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl border border-emerald-50 shadow-sm h-full flex flex-col"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Diagnostic Report</h3>
                      <div className={`px-4 py-1.5 md:px-5 md:py-2 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center gap-2 w-fit ${analysisResult.isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {analysisResult.isCorrect ? <CheckCircle2 size={14} className="md:w-4 md:h-4" /> : <XCircle size={14} className="md:w-4 md:h-4" />}
                        {analysisResult.isCorrect ? 'Optimal' : 'Sub-Optimal'}
                      </div>
                    </div>

                    <div className="space-y-6 md:space-y-8 flex-1">
                      <div className="p-4 md:p-6 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
                        <h4 className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 md:mb-4">Biomechanical Feedback</h4>
                        <p className="text-sm md:text-base text-slate-700 leading-relaxed font-medium">
                          {analysisResult.feedback}
                        </p>
                      </div>

                      {!analysisResult.isCorrect && (
                        <div className="p-4 md:p-6 bg-orange-50 rounded-xl md:rounded-2xl border border-orange-100">
                          <h4 className="text-[9px] md:text-[10px] font-black text-orange-700 uppercase tracking-[0.2em] mb-2 md:mb-3 flex items-center gap-2">
                            <AlertTriangle size={14} className="md:w-4 md:h-4" />
                            Pathological Risk
                          </h4>
                          <p className="text-orange-900 text-xs md:text-sm leading-relaxed font-medium">
                            {analysisResult.injuryRisk}
                          </p>
                        </div>
                      )}

                      <div className="pt-6 md:pt-8 border-t border-slate-100 mt-auto">
                        <h4 className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 md:mb-4">Corrective Protocol</h4>
                        <div className="relative aspect-video bg-slate-900 rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer">
                          <img 
                            src={`https://picsum.photos/seed/${selectedExercise}/800/450`} 
                            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500" 
                            alt="Tutorial"
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                              <Play size={24} className="md:w-8 md:h-8" fill="currentColor" />
                            </div>
                            <p className="mt-3 md:mt-4 font-bold text-sm md:text-lg">Mastering {selectedExercise} Form</p>
                            <p className="text-[10px] md:text-xs text-emerald-400 font-mono">SCIENTIFIC BREAKDOWN</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : isAnalyzing ? (
                  <div className="bg-white p-12 rounded-3xl border border-emerald-50 shadow-sm h-full flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                      <Camera size={48} className="text-emerald-500 animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Analyzing Video...</h3>
                    <p className="max-w-xs mx-auto mt-3 text-slate-500 text-sm leading-relaxed">
                      Please wait while we generate your biomechanical diagnostic report.
                    </p>
                  </div>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'log' && (
          <motion.div 
            key="log"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <WorkoutLogger 
              user={user} 
              activeWorkout={activeWorkout} 
              setActiveWorkout={setActiveWorkout}
              restTimer={restTimer}
              setRestTimer={setRestTimer}
              setActiveSubTab={setActiveSubTab}
              checkAchievements={checkAchievements}
              setShowExerciseSummary={setShowExerciseSummary}
              language={language}
            />
          </motion.div>
        )}
        {activeSubTab === 'library' && (
          <motion.div 
            key="library"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <ExerciseLibrary 
              user={user}
              onAddExercise={async (ex) => {
                if (activeWorkout) {
                  addExerciseToActiveWorkout(ex);
                  return;
                }
                
                const targetPlan = planMode === 'manual' ? selectedManualPlan : workoutPlan;
                if (!targetPlan) {
                  alert("Please select or create a plan first.");
                  return;
                }

                const newEx: Exercise = {
                  name: ex.name,
                  sets: 3,
                  reps: '10-12',
                  rest: '60s',
                  videoUrl: ex.videoUrl
                };

                const updatedPlan = { ...targetPlan };
                if (updatedPlan.weeklySchedule.length > 0) {
                  updatedPlan.weeklySchedule[0].exercises.push(newEx);
                  try {
                    if (planMode === 'manual' && updatedPlan.id) {
                      await setDoc(doc(db, 'users', user.uid, 'manualPlans', updatedPlan.id), updatedPlan);
                      setManualPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
                      if (selectedManualPlan?.id === updatedPlan.id) setSelectedManualPlan(updatedPlan);
                    }
                    
                    // Always update the active workout plan if it matches the target
                    // or if we are in AI/Protocol mode where workoutPlan is the source of truth
                    if (planMode !== 'manual' || workoutPlan?.id === updatedPlan.id) {
                      await setDoc(doc(db, 'users', user.uid, 'plans', 'workout'), updatedPlan);
                      setWorkoutPlan(updatedPlan);
                    }
                    
                    alert(`${ex.name} added to Day 1 of your ${planMode === 'manual' ? 'manual plan' : 'plan'}!`);
                  } catch (e) {
                    console.error(e);
                  }
                } else {
                  alert("Your plan has no days. Please add a day first.");
                }
              }} 
            />
          </motion.div>
        )}
        {activeSubTab === 'my-sports' && (
          <motion.div 
            key="my-sports"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-white p-5 md:p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-bold text-slate-900">My Sports</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowSportsEditor(true)}>
                  <Settings size={16} />
                </Button>
              </div>
              <div className="space-y-4">
                {user.selectedSports?.length ? user.selectedSports.map((s: any) => {
                  const sport = SPORTS_DATA.find(sd => sd.id === s.sportId);
                  return (
                    <div key={s.sportId} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                          {sport?.icon}
                        </div>
                        <h4 className="font-bold text-slate-900">{sport?.name}</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {s.goalIds.map((goal: string) => (
                          <span key={goal} className="px-2 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-medium text-slate-600">
                            {goal}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-center py-6 text-slate-400">
                    <p className="text-sm">No sports selected yet.</p>
                    <Button variant="ghost" size="sm" onClick={() => setShowSportsEditor(true)} className="text-emerald-600 mt-2">
                      Add Sports
                    </Button>
                  </div>
                )}
              </div>
            </div>
            {showSportsEditor && (
              <SportsEditor 
                user={user} 
                onUpdate={onUpdate}
                onClose={() => setShowSportsEditor(false)} 
              />
            )}
          </motion.div>
        )}
        {activeSubTab === 'history' && (
          <motion.div 
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <WorkoutHistoryTab user={user} language={language} />
          </motion.div>
        )}
      </AnimatePresence>

      {restTimer !== null && (
        <RestTimerOverlay seconds={restTimer} onFinish={() => setRestTimer(null)} />
      )}

      <AnimatePresence>
        {selectedExerciseInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedExerciseInfo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-xl max-w-lg w-full overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">{selectedExerciseInfo.name}</h3>
                <button onClick={() => setSelectedExerciseInfo(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {selectedExerciseInfo.videoUrl && (
                  <>
                  <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden relative group">
                    {getExerciseGifUrl(selectedExerciseInfo.name, selectedExerciseInfo.muscles, selectedExerciseInfo.category) ? (
                      <img 
                        src={getExerciseGifUrl(selectedExerciseInfo.name, selectedExerciseInfo.muscles, selectedExerciseInfo.category) || ''}
                        alt={selectedExerciseInfo.name}
                        className="w-full h-full object-contain bg-white"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <iframe
                        src={`https://www.youtube.com/embed/${selectedExerciseInfo.videoUrl.split('v=')[1]?.split('&')[0] || selectedExerciseInfo.videoUrl.split('/').pop()}?autoplay=1&mute=1&loop=1&playlist=${selectedExerciseInfo.videoUrl.split('v=')[1]?.split('&')[0] || selectedExerciseInfo.videoUrl.split('/').pop()}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                        title={selectedExerciseInfo.name}
                        className="w-full h-full object-cover pointer-events-none"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                    {/* 
                      alt={selectedExerciseInfo.name}
                      className="w-full h-full object-contain bg-white"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${selectedExerciseInfo.videoUrl.split('v=')[1]?.split('&')[0] || selectedExerciseInfo.videoUrl.split('/').pop()}/maxresdefault.jpg`;
                        (e.target as HTMLImageElement).onerror = (e2) => {
                          (e2.target as HTMLImageElement).src = `https://picsum.photos/seed/${selectedExerciseInfo.name}/800/450`;
                        };
                      }}
                    */}
                    <a 
                      href={selectedExerciseInfo.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors"
                    >
                      <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all">
                        <Play size={24} className="text-emerald-600 ml-1" fill="currentColor" />
                      </div>
                    </a>
                  </div>
                  <a 
                    href={selectedExerciseInfo.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 md:p-4 bg-slate-900 text-white rounded-xl md:rounded-2xl hover:bg-slate-800 transition-all group mt-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-red-600 rounded-lg md:rounded-xl flex items-center justify-center">
                        <Play size={16} className="md:w-5 md:h-5" fill="currentColor" />
                      </div>
                      <div>
                        <p className="font-bold text-xs md:text-sm">Watch Full Tutorial on YouTube</p>
                        <p className="text-[10px] text-slate-400 uppercase">External Link</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                  </>
                )}
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Instructions</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{selectedExerciseInfo.instructions}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">{selectedExerciseInfo.category}</span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg">{selectedExerciseInfo.difficulty}</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg">{selectedExerciseInfo.equipment}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RestTimerOverlay({ seconds, onFinish }: { seconds: number, onFinish: () => void }) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onFinish]);

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[150] bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-6 border border-white/10 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">
        <Timer className="text-emerald-400 animate-pulse" size={24} />
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Rest Timer</p>
          <p className="text-2xl font-mono font-bold">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
        </div>
      </div>
      <div className="h-8 w-px bg-white/10" />
      <button 
        onClick={onFinish}
        className="text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
      >
        Skip
      </button>
    </motion.div>
  );
}


function ExerciseLibrary({ onAddExercise, user }: { onAddExercise: (ex: any) => void, user?: any }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [showCoreOnly, setShowCoreOnly] = useState(false);
  const [viewingExercise, setViewingExercise] = useState<any | null>(null);
  const [exerciseHistory, setExerciseHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [gifError, setGifError] = useState(false);

  useEffect(() => {
    if (viewingExercise) {
      setGifError(false);
      if (user) {
        fetchExerciseHistory(viewingExercise.name);
      }
    } else {
      setExerciseHistory([]);
    }
  }, [viewingExercise, user]);

  const fetchExerciseHistory = async (exerciseName: string) => {
    if (!user) return;
    setLoadingHistory(true);
    try {
      const logsRef = collection(db, 'users', user.uid, 'dailyLogs');
      const q = query(logsRef, orderBy('date', 'desc'), limit(30));
      const querySnapshot = await getDocs(q);
      
      const history: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.workouts) {
          data.workouts.forEach((workout: any) => {
            if (workout.exercises) {
              const ex = workout.exercises.find((e: any) => e.name === exerciseName);
              if (ex && ex.sets && ex.sets.length > 0) {
                history.push({
                  date: data.date,
                  workoutName: workout.name,
                  sets: ex.sets
                });
              }
            }
          });
        }
      });
      setExerciseHistory(history);
    } catch (error) {
      console.error("Error fetching exercise history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const [displayLimit, setDisplayLimit] = useState(50);

  const filtered = React.useMemo(() => {
    const searchLower = search.toLowerCase();
    return EXERCISE_LIBRARY.filter(ex => {
      const matchesSearch = !searchLower || ex.name.toLowerCase().includes(searchLower) || 
                           ex.muscles.some(m => m.toLowerCase().includes(searchLower));
      const matchesCategory = !selectedCategory || ex.category === selectedCategory;
      const matchesDifficulty = !selectedDifficulty || ex.difficulty === selectedDifficulty;
      const matchesMuscle = !selectedMuscle || ex.muscles.includes(selectedMuscle);
      const matchesEquipment = !selectedEquipment || ex.equipment === selectedEquipment;
      const matchesCore = !showCoreOnly || ex.isCore;
      return matchesSearch && matchesCategory && matchesDifficulty && matchesMuscle && matchesEquipment && matchesCore;
    });
  }, [search, selectedCategory, selectedDifficulty, selectedMuscle, selectedEquipment, showCoreOnly]);

  const categories = React.useMemo(() => Array.from(new Set(EXERCISE_LIBRARY.map(ex => ex.category))), []);
  const difficulties = React.useMemo(() => Array.from(new Set(EXERCISE_LIBRARY.map(ex => ex.difficulty))), []);
  const allMuscles = React.useMemo(() => Array.from(new Set(EXERCISE_LIBRARY.flatMap(ex => ex.muscles))).sort(), []);
  const allEquipment = React.useMemo(() => Array.from(new Set(EXERCISE_LIBRARY.map(ex => ex.equipment))).sort(), []);

  const displayedExercises = filtered.slice(0, displayLimit);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search exercises or muscles..." 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setDisplayLimit(50); // Reset limit on new search
            }}
            className="pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none w-full"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 md:gap-4">
          <select 
            value={selectedCategory || ''} 
            onChange={(e) => { setSelectedCategory(e.target.value || null); setDisplayLimit(50); }}
            className="flex-1 min-w-[140px] px-3 py-2 md:px-4 md:py-2 rounded-xl border border-slate-200 bg-white text-xs md:text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select 
            value={selectedDifficulty || ''} 
            onChange={(e) => { setSelectedDifficulty(e.target.value || null); setDisplayLimit(50); }}
            className="flex-1 min-w-[140px] px-3 py-2 md:px-4 md:py-2 rounded-xl border border-slate-200 bg-white text-xs md:text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Difficulties</option>
            {difficulties.map(diff => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>

          <select 
            value={selectedMuscle || ''} 
            onChange={(e) => { setSelectedMuscle(e.target.value || null); setDisplayLimit(50); }}
            className="flex-1 min-w-[140px] px-3 py-2 md:px-4 md:py-2 rounded-xl border border-slate-200 bg-white text-xs md:text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Muscles</option>
            {allMuscles.map(muscle => (
              <option key={muscle} value={muscle}>{muscle}</option>
            ))}
          </select>

          <select 
            value={selectedEquipment || ''} 
            onChange={(e) => { setSelectedEquipment(e.target.value || null); setDisplayLimit(50); }}
            className="flex-1 min-w-[140px] px-3 py-2 md:px-4 md:py-2 rounded-xl border border-slate-200 bg-white text-xs md:text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Equipment</option>
            {allEquipment.map(eq => (
              <option key={eq} value={eq}>{eq}</option>
            ))}
          </select>

          <button
            onClick={() => { setShowCoreOnly(!showCoreOnly); setDisplayLimit(50); }}
            className={`flex-1 min-w-[140px] px-3 py-2 md:px-4 md:py-2 rounded-xl border transition-all text-xs md:text-sm font-bold flex items-center justify-center gap-2 ${
              showCoreOnly 
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-500'
            }`}
          >
            <Star size={16} fill={showCoreOnly ? "currentColor" : "none"} />
            Core Only
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedExercises.map(ex => (
          <motion.div
            layoutId={ex.id}
            key={ex.id}
            onClick={() => setViewingExercise(ex)}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Dumbbell size={24} />
              </div>
              <div className="flex flex-col items-end gap-1">
                {ex.isCore && (
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Star size={10} fill="currentColor" />
                    Core
                  </span>
                )}
                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                  ex.difficulty === 'Beginner' ? 'bg-emerald-100 text-emerald-700' :
                  ex.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {ex.difficulty}
                </span>
              </div>
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">{ex.name}</h4>
            <div className="flex flex-wrap gap-1 mb-4">
              {ex.muscles.map(m => (
                <span key={m} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-medium rounded">
                  {m}
                </span>
              ))}
            </div>
            <div className="flex items-center text-emerald-600 text-sm font-bold">
              View Details
              <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length > displayLimit && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setDisplayLimit(prev => prev + 50)}
            className="px-6 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
          >
            Load More Exercises ({filtered.length - displayLimit} remaining)
          </button>
        </div>
      )}

      <AnimatePresence>
        {viewingExercise && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingExercise(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              layoutId={viewingExercise.id}
              className="bg-white rounded-3xl md:rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col mx-4"
            >
              <div className="h-32 md:h-48 bg-emerald-600 relative overflow-hidden shrink-0">
                <div className="absolute inset-0 opacity-20">
                  <Dumbbell size={120} className="absolute -bottom-5 -right-5 md:-bottom-10 md:-right-10 text-white rotate-12 md:w-[200px] md:h-[200px]" />
                </div>
                <button 
                  onClick={() => setViewingExercise(null)}
                  className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors"
                >
                  <X size={18} className="md:w-5 md:h-5" />
                </button>
                <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8">
                  <span className="px-2 py-0.5 md:px-3 md:py-1 bg-white/20 backdrop-blur text-white text-[10px] md:text-xs font-bold rounded-lg uppercase tracking-widest mb-1 md:mb-2 inline-block">
                    {viewingExercise.category}
                  </span>
                  <h3 className="text-xl md:text-3xl font-bold text-white">{viewingExercise.name}</h3>
                </div>
              </div>

              <div className="p-5 md:p-8 overflow-y-auto space-y-6 md:space-y-8">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 md:mb-2">Target Muscles</p>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {viewingExercise.muscles.map((m: string) => (
                        <span key={m} className="px-2 py-0.5 md:px-3 md:py-1 bg-white border border-slate-200 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold text-slate-700">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 md:mb-2">Difficulty</p>
                    <p className="text-sm md:text-lg font-bold text-slate-900">{viewingExercise.difficulty}</p>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <h4 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen size={18} className="text-emerald-600 md:w-5 md:h-5" />
                    Instructions
                  </h4>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                    {viewingExercise.instructions}
                  </p>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <h4 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Play size={18} className="text-emerald-600 md:w-5 md:h-5" />
                    Session Reference
                  </h4>
                  {viewingExercise.videoUrl && (
                    <>
                    <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden relative group">
                      {getExerciseGifUrl(viewingExercise.name, viewingExercise.muscles, viewingExercise.category) && !gifError ? (
                        <div className="relative w-full h-full">
                          <img 
                            src={getExerciseGifUrl(viewingExercise.name, viewingExercise.muscles, viewingExercise.category) || ''}
                            alt={viewingExercise.name}
                            className="w-full h-full object-contain bg-white"
                            referrerPolicy="no-referrer"
                            onError={() => setGifError(true)}
                          />
                          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-[8px] text-white/80 font-medium">
                            Source: FitnessProgramer
                          </div>
                        </div>
                      ) : (
                        <iframe
                          src={`https://www.youtube.com/embed/${viewingExercise.videoUrl.split('v=')[1]?.split('&')[0] || viewingExercise.videoUrl.split('/').pop()}?autoplay=1&mute=1&loop=1&playlist=${viewingExercise.videoUrl.split('v=')[1]?.split('&')[0] || viewingExercise.videoUrl.split('/').pop()}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                          title={viewingExercise.name}
                          className="w-full h-full object-cover pointer-events-none"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                    </div>
                    <a 
                      href={viewingExercise.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 md:p-4 bg-slate-900 text-white rounded-xl md:rounded-2xl hover:bg-slate-800 transition-all group mt-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-red-600 rounded-lg md:rounded-xl flex items-center justify-center">
                          <Play size={16} className="md:w-5 md:h-5" fill="currentColor" />
                        </div>
                        <div>
                          <p className="font-bold text-xs md:text-sm">Watch Full Tutorial on YouTube</p>
                          <p className="text-[10px] text-slate-400 uppercase">External Link</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    </>
                  )}
                </div>

                {user && (
                  <div className="space-y-3 md:space-y-4">
                    <h4 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
                      <History size={18} className="text-emerald-600 md:w-5 md:h-5" />
                      Your History
                    </h4>
                    {loadingHistory ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full" />
                      </div>
                    ) : exerciseHistory.length > 0 ? (
                      <div className="space-y-3">
                        {exerciseHistory.slice(0, 3).map((hist, idx) => (
                          <div key={idx} className="bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs md:text-sm font-bold text-slate-900">{hist.date}</span>
                              <span className="text-[10px] md:text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200">{hist.workoutName}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {hist.sets.map((set: any, sIdx: number) => (
                                <div key={sIdx} className="bg-white p-2 rounded-lg border border-slate-100 text-center">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase">Set {sIdx + 1}</p>
                                  <p className="text-xs md:text-sm font-bold text-slate-900">{set.weight}kg × {set.reps}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-4 rounded-xl md:rounded-2xl border border-slate-100 text-center">
                        <p className="text-sm text-slate-500">No history found for this exercise yet. Start tracking to see your progress!</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-4">
                  <button 
                    onClick={() => {
                      onAddExercise(viewingExercise);
                      setViewingExercise(null);
                    }}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center"
                  >
                    <Plus size={20} className="mr-2" />
                    Add to My Plan
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>
    </div>
  );
}

function WorkoutLogger({ 
  user, 
  activeWorkout, 
  setActiveWorkout,
  restTimer,
  setRestTimer,
  setActiveSubTab,
  checkAchievements,
  setShowExerciseSummary,
  language
}: { 
  user: any, 
  activeWorkout: ActiveWorkout | null, 
  setActiveWorkout: (w: ActiveWorkout | null) => void,
  restTimer: number | null,
  setRestTimer: (n: number | null) => void,
  setActiveSubTab: (s: 'log' | 'plan' | 'analysis' | 'tips' | 'library' | 'achievements') => void,
  checkAchievements: (w: any) => Promise<void>,
  setShowExerciseSummary: (s: any) => void,
  language?: 'en' | 'ar'
}) {
  const [saving, setSaving] = useState(false);
  const [todayWorkouts, setTodayWorkouts] = useState<any[]>([]);
  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [selectedExerciseInfo, setSelectedExerciseInfo] = useState<ExerciseDef | null>(null);
  const [exerciseHistory, setExerciseHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [gifError, setGifError] = useState(false);
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [workoutAnalysis, setWorkoutAnalysis] = useState<any | null>(null);
  const [isAnalyzingWorkout, setIsAnalyzingWorkout] = useState(false);
  const [justFinishedWorkout, setJustFinishedWorkout] = useState<any | null>(null);

  useEffect(() => {
    if (selectedExerciseInfo) {
      setGifError(false);
      fetchExerciseHistory(selectedExerciseInfo.name);
    } else {
      setExerciseHistory([]);
    }
  }, [selectedExerciseInfo]);

  const fetchExerciseHistory = async (exerciseName: string) => {
    setLoadingHistory(true);
    try {
      const logsRef = collection(db, 'users', user.uid, 'dailyLogs');
      const q = query(logsRef, orderBy('date', 'desc'), limit(30));
      const querySnapshot = await getDocs(q);
      
      const history: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.workouts) {
          data.workouts.forEach((workout: any) => {
            if (workout.exercises) {
              const ex = workout.exercises.find((e: any) => e.name === exerciseName);
              if (ex && ex.sets && ex.sets.length > 0) {
                history.push({
                  date: data.date,
                  workoutName: workout.name,
                  sets: ex.sets
                });
              }
            }
          });
        }
      });
      setExerciseHistory(history);
    } catch (error) {
      console.error("Error fetching exercise history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const [activeSetMenu, setActiveSetMenu] = useState<{ exId: string, setIdx: number } | null>(null);

  // Scientific Formulas
  const calculate1RM = (weight: number, reps: number) => {
    if (weight <= 0 || reps <= 0) return 0;
    if (reps === 1) return weight;
    // Brzycki Formula: 1RM = w / (1.0278 - 0.0278 * r)
    return Math.round(weight / (1.0278 - 0.0278 * reps));
  };

  const getFatigueFactor = (type: string) => {
    switch (type) {
      case 'warmup': return 0.5;
      case 'failure': return 2.0;
      case 'dropset': return 1.5;
      default: return 1.0;
    }
  };

  const calculateFatigueScore = () => {
    if (!activeWorkout) return 0;
    return activeWorkout.exercises.reduce((acc, ex) => 
      acc + ex.sets.reduce((sAcc, s) => {
        if (!s.isCompleted) return sAcc;
        return sAcc + (s.weight * s.reps * getFatigueFactor(s.type || 'normal'));
      }, 0), 0
    );
  };

  const calculateTotalVolume = () => {
    if (!activeWorkout) return 0;
    return activeWorkout.exercises.reduce((acc, ex) => 
      acc + ex.sets.reduce((sAcc, s) => sAcc + (s.weight * s.reps), 0), 0
    );
  };

  const fatigueScore = calculateFatigueScore();
  const totalVolume = calculateTotalVolume();
  const fatigueRatio = totalVolume > 0 ? (fatigueScore / totalVolume).toFixed(2) : "0.00";
  
  const totalFailureSets = activeWorkout?.exercises.reduce((acc, ex) => 
    acc + ex.sets.filter(s => s.type === 'failure' && s.isCompleted).length, 0
  ) || 0;

  const failureLimit = 5;
  const isHighFatigue = parseFloat(fatigueRatio) > 1.4 || totalFailureSets >= failureLimit;

  useEffect(() => {
    let interval: any;
    if (activeWorkout) {
      const start = new Date(activeWorkout.startTime).getTime();
      interval = setInterval(() => {
        setWorkoutDuration(Math.floor((Date.now() - start) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeWorkout]);

  const fetchTodayWorkouts = async () => {
    try {
      const logDoc = await getDoc(doc(db, 'users', user.uid, 'dailyLogs', workoutDate));
      if (logDoc.exists()) {
        setTodayWorkouts(logDoc.data().workouts || []);
      } else {
        setTodayWorkouts([]);
      }
    } catch (error) {
      console.error("Error fetching today's workouts:", error);
    }
  };

  useEffect(() => {
    fetchTodayWorkouts();
  }, [workoutDate]);

  const deleteLoggedWorkout = async (index: number) => {
    try {
      const logRef = doc(db, 'users', user.uid, 'dailyLogs', workoutDate);
      const newWorkouts = todayWorkouts.filter((_, i) => i !== index);
      await updateDoc(logRef, { workouts: newWorkouts });
      setTodayWorkouts(newWorkouts);
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  const addSet = (exerciseId: string) => {
    if (!activeWorkout) return;
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, sets: [...ex.sets, { weight: 0, reps: 0, isCompleted: false, type: 'normal' }] }
          : ex
      )
    });
  };

  const updateSet = (exerciseId: string, setIndex: number, updates: Partial<WorkoutSet>) => {
    if (!activeWorkout) return;
    
    let exerciseFinished = false;
    let finishedExerciseName = "";

    const newExercises = activeWorkout.exercises.map(ex => {
      if (ex.id === exerciseId) {
        const newSets = ex.sets.map((s, i) => {
          if (i === setIndex) {
            let newSet = { ...s, ...updates };
            
            // Automatic RPE linking
            if (updates.type) {
              if (updates.type === 'warmup') newSet.rpe = 5;
              else if (updates.type === 'normal') newSet.rpe = 8;
              else if (updates.type === 'failure') newSet.rpe = 10;
              else if (updates.type === 'dropset') newSet.rpe = 9;
            }

            if (updates.isCompleted === true && !s.isCompleted) {
              setRestTimer(90); // Default 90s rest
            }
            return newSet;
          }
          return s;
        });

        // Check if all sets are now completed and this was the last set being checked
        if (updates.isCompleted === true && newSets.every(s => s.isCompleted)) {
          const wasAlreadyFinished = ex.sets.every(s => s.isCompleted);
          if (!wasAlreadyFinished) {
            exerciseFinished = true;
            finishedExerciseName = ex.name;
          }
        }

        return { ...ex, sets: newSets };
      }
      return ex;
    });

    setActiveWorkout({
      ...activeWorkout,
      exercises: newExercises
    });

    if (exerciseFinished) {
      setShowExerciseSummary({
        name: finishedExerciseName,
        calories: 45, // Estimated per exercise
        duration: 12, // Estimated minutes
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  };

  const removeSet = (exerciseId: string, setIndex: number) => {
    if (!activeWorkout) return;
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map(ex => 
        ex.id === exerciseId 
          ? { ...ex, sets: ex.sets.filter((_, i) => i !== setIndex) }
          : ex
      )
    });
  };

  const removeExercise = (exerciseId: string) => {
    if (!activeWorkout) return;
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.filter(ex => ex.id !== exerciseId)
    });
  };

  const handleFinishWorkout = async () => {
    if (!activeWorkout) return;
    setSaving(true);
    try {
      const totalVolume = activeWorkout.exercises.reduce((acc, ex) => 
        acc + ex.sets.reduce((sAcc, s) => sAcc + (s.weight * s.reps), 0), 0
      );

      // Calculate volume per muscle group
      const muscleVolume: { [key: string]: number } = {};
      activeWorkout.exercises.forEach(ex => {
        const exVolume = ex.sets.reduce((acc, s) => acc + (s.weight * s.reps), 0);
        // Find exercise in library to get muscles if not present
        const libEx = EXERCISE_LIBRARY.find(l => l.name === ex.name);
        const muscles = libEx?.muscles || [];
        muscles.forEach(m => {
          muscleVolume[m] = (muscleVolume[m] || 0) + exVolume;
        });
      });

      const targetDate = activeWorkout.date || workoutDate;
      const logRef = doc(db, 'users', user.uid, 'dailyLogs', targetDate);
      const logDoc = await getDoc(logRef);
      
      const finishedWorkout = {
        ...activeWorkout,
        endTime: new Date().toISOString(),
        duration: Math.floor(workoutDuration / 60),
        totalVolume,
        muscleVolume,
        caloriesBurned: Math.floor(workoutDuration * 0.1), // Rough estimate
        intensity: 'Medium'
      };

      if (logDoc.exists()) {
        const currentData = logDoc.data();
        await setDoc(logRef, { 
          ...currentData,
          date: targetDate,
          workouts: [...(currentData.workouts || []), finishedWorkout]
        });
      } else {
        await setDoc(logRef, {
          date: targetDate,
          workouts: [finishedWorkout]
        });
      }
      
      setActiveWorkout(null);
      fetchTodayWorkouts();
      await checkAchievements(finishedWorkout);
      setJustFinishedWorkout(finishedWorkout);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}/dailyLogs`);
    } finally {
      setSaving(false);
    }
  };

  if (!activeWorkout) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <Calendar size={20} className="text-emerald-600" />
            <span>Workout Date</span>
          </div>
          <input 
            type="date" 
            value={workoutDate}
            onChange={(e) => setWorkoutDate(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm font-bold text-slate-700"
          />
        </div>

        <div className="text-center py-6 md:py-8 bg-white rounded-3xl md:rounded-[40px] border border-slate-100 shadow-sm px-4">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-50 text-emerald-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6">
            <ActivityIcon size={32} className="md:w-10 md:h-10" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Ready for your workout?</h3>
          <p className="text-xs md:text-sm text-slate-500 mb-6 md:mb-8 max-w-md mx-auto">Start a new session to track your sets, reps, and progress in real-time.</p>
          <button 
            onClick={() => setActiveWorkout({
              name: 'New Workout',
              startTime: new Date().toISOString(),
              exercises: [],
              date: workoutDate
            })}
            className="px-6 py-3 md:px-8 md:py-4 bg-emerald-600 text-white rounded-xl md:rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-2 mx-auto text-sm md:text-base"
          >
            <Plus size={18} className="md:w-5 md:h-5" />
            Start Empty Workout
          </button>
        </div>

        {todayWorkouts.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <History size={20} className="text-emerald-600" />
              Workouts on {workoutDate}
            </h4>
            <div className="grid gap-4">
              {todayWorkouts.map((w, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-slate-900">{w.name}</h5>
                      <p className="text-sm text-slate-500">{w.duration} mins • {w.totalVolume || 0} kg total volume</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-emerald-600 font-bold">
                        <Award size={20} />
                        <span>Completed</span>
                      </div>
                      <button 
                        onClick={() => deleteLoggedWorkout(i)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Workout"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  {w.muscleVolume && Object.keys(w.muscleVolume).length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50">
                      {Object.entries(w.muscleVolume).map(([muscle, volume]) => (
                        <div key={muscle} className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-600 border border-slate-100">
                          {muscle}: {volume as number} kg
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setJustFinishedWorkout(w);
                    }}
                    className="w-full py-2.5 mt-2 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 border border-slate-200 hover:border-emerald-200 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Sparkles size={16} />
                    Analyze with AI
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 pb-32">
      <div className="bg-slate-900 text-white p-5 md:p-8 rounded-3xl md:rounded-[40px] shadow-2xl sticky top-4 z-50 border border-white/10 backdrop-blur-xl mx-2 md:mx-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={activeWorkout.name}
                onChange={e => setActiveWorkout({ ...activeWorkout, name: e.target.value })}
                className="bg-transparent text-lg md:text-2xl font-bold outline-none border-b border-transparent focus:border-emerald-500 transition-all w-full truncate"
              />
              {isHighFatigue && (
                <div className="flex items-center gap-1 bg-red-500/20 text-red-400 px-2 py-1 rounded-lg text-[10px] font-bold animate-pulse border border-red-500/30">
                  <AlertTriangle size={12} />
                  <span>RECOVERY RISK</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 md:gap-4 mt-1 md:mt-2 text-slate-400 text-[10px] md:text-sm font-medium">
              <div className="flex items-center gap-1 md:gap-1.5">
                <Clock size={12} className="md:w-[14px] md:h-[14px]" />
                <span>{Math.floor(workoutDuration / 60)}:{(workoutDuration % 60).toString().padStart(2, '0')}</span>
              </div>
              <div className="flex items-center gap-1 md:gap-1.5">
                <TrendingIcon size={12} className="md:w-[14px] md:h-[14px]" />
                <span>{totalVolume.toLocaleString()} kg Volume</span>
              </div>
              <div className={cn(
                "flex items-center gap-1 md:gap-1.5 px-2 py-0.5 rounded-lg transition-colors",
                parseFloat(fatigueRatio) > 1.4 ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
              )}>
                <Zap size={12} className="md:w-[14px] md:h-[14px]" />
                <span>Fatigue: {fatigueRatio}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={handleFinishWorkout}
            disabled={saving}
            className="px-4 py-2 md:px-6 md:py-3 bg-emerald-500 text-white rounded-xl md:rounded-2xl font-bold hover:bg-emerald-400 transition-all shadow-lg disabled:opacity-50 text-xs md:text-base shrink-0"
          >
            {saving ? '...' : 'Finish'}
          </button>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        {activeWorkout.exercises.map((ex, exIndex) => (
          <div key={ex.id} className="bg-white rounded-2xl md:rounded-[32px] border border-slate-100 shadow-sm overflow-visible mx-2 md:mx-0">
            <div className="p-4 md:p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50 rounded-t-2xl md:rounded-t-[32px]">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-100 text-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center font-bold text-sm md:text-base">
                  {exIndex + 1}
                </div>
                <h4 className="font-bold text-slate-900 text-sm md:text-base truncate max-w-[150px] md:max-w-none">{ex.name}</h4>
                {EXERCISE_LIBRARY.find(l => l.name === ex.name) && (
                  <button
                    onClick={() => setSelectedExerciseInfo(EXERCISE_LIBRARY.find(l => l.name === ex.name) || null)}
                    className="p-1.5 md:p-2 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <Info size={16} className="md:w-[18px] md:h-[18px]" />
                  </button>
                )}
              </div>
              <button 
                onClick={() => removeExercise(ex.id)}
                className="p-1.5 md:p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
              </button>
            </div>
            
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-[30px_1fr_1fr_1fr_30px] md:grid-cols-[40px_1fr_1fr_1fr_40px] gap-2 md:gap-4 mb-3 md:mb-4 px-1 md:px-2">
                <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Set</span>
                <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">kg</span>
                <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Reps</span>
                <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">RPE</span>
                <span className="w-8 md:w-10" />
              </div>

              <div className="space-y-2 md:space-y-3">
                {ex.sets.map((set, setIndex) => (
                  <div 
                    key={setIndex}
                    className={`grid grid-cols-[30px_1fr_1fr_1fr_30px] md:grid-cols-[40px_1fr_1fr_1fr_40px] gap-2 md:gap-4 items-center p-1.5 md:p-2 rounded-xl md:rounded-2xl transition-all overflow-visible ${set.isCompleted ? 'bg-emerald-50/50' : 'bg-white'}`}
                  >
                    <div className="relative">
                      <button 
                        onClick={() => setActiveSetMenu(activeSetMenu?.exId === ex.id && activeSetMenu?.setIdx === setIndex ? null : { exId: ex.id, setIdx: setIndex })}
                        className={`w-full h-8 md:h-10 rounded-lg md:rounded-xl font-bold text-xs md:text-sm flex items-center justify-center transition-all ${
                          set.type === 'warmup' ? 'bg-amber-100 text-amber-600 shadow-sm border border-amber-200' :
                          set.type === 'failure' ? 'bg-red-100 text-red-600 shadow-sm border border-red-200' :
                          set.type === 'dropset' ? 'bg-blue-100 text-blue-600 shadow-sm border border-blue-200' :
                          'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {set.type === 'warmup' ? 'W' : 
                         set.type === 'failure' ? 'F' : 
                         set.type === 'dropset' ? 'D' : 
                         (setIndex + 1)}
                      </button>
                      
                      <AnimatePresence>
                        {activeSetMenu?.exId === ex.id && activeSetMenu?.setIdx === setIndex && (
                          <>
                            <div 
                              className="fixed inset-0 z-[90]" 
                              onClick={() => setActiveSetMenu(null)}
                            />
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 10 }}
                              className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-[100] max-h-[400px] overflow-y-auto"
                            >
                              <div className="text-[10px] font-bold text-slate-400 px-3 py-2 uppercase tracking-wider flex items-center justify-between">
                                <span>Select Set Type</span>
                                <button onClick={() => setActiveSetMenu(null)} className="p-1 hover:bg-slate-100 rounded-full">
                                  <X size={12} />
                                </button>
                              </div>
                              <div className="grid gap-1">
                                <button 
                                  onClick={() => { updateSet(ex.id, setIndex, { type: 'warmup' }); setActiveSetMenu(null); }} 
                                  className="w-full flex items-center gap-3 p-2.5 hover:bg-amber-50 rounded-xl transition-all text-left group"
                                >
                                  <span className="w-7 h-7 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">W</span>
                                  <div className="flex-1">
                                    <span className="text-xs font-bold text-slate-700 block">Warm Up Set</span>
                                    <span className="text-[9px] text-slate-400">Preparation & mobility</span>
                                  </div>
                                  <Info size={12} className="text-slate-300" />
                                </button>
                                <button 
                                  onClick={() => { updateSet(ex.id, setIndex, { type: 'normal' }); setActiveSetMenu(null); }} 
                                  className="w-full flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-xl transition-all text-left group"
                                >
                                  <span className="w-7 h-7 bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">1</span>
                                  <div className="flex-1">
                                    <span className="text-xs font-bold text-slate-700 block">Normal Set</span>
                                    <span className="text-[9px] text-slate-400">Standard working set</span>
                                  </div>
                                  <Info size={12} className="text-slate-300" />
                                </button>
                                <button 
                                  onClick={() => { updateSet(ex.id, setIndex, { type: 'failure' }); setActiveSetMenu(null); }} 
                                  className="w-full flex items-center gap-3 p-2.5 hover:bg-red-50 rounded-xl transition-all text-left group"
                                >
                                  <span className="w-7 h-7 bg-red-100 text-red-600 rounded-lg flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">F</span>
                                  <div className="flex-1">
                                    <span className="text-xs font-bold text-slate-700 block">Failure Set</span>
                                    <span className="text-[9px] text-slate-400">Maximum effort (RPE 10)</span>
                                  </div>
                                  <Info size={12} className="text-slate-300" />
                                </button>
                                <button 
                                  onClick={() => { updateSet(ex.id, setIndex, { type: 'dropset' }); setActiveSetMenu(null); }} 
                                  className="w-full flex items-center gap-3 p-2.5 hover:bg-blue-50 rounded-xl transition-all text-left group"
                                >
                                  <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">D</span>
                                  <div className="flex-1">
                                    <span className="text-xs font-bold text-slate-700 block">Drop Set</span>
                                    <span className="text-[9px] text-slate-400">Reduce weight, no rest</span>
                                  </div>
                                  <Info size={12} className="text-slate-300" />
                                </button>
                                <div className="h-px bg-slate-50 my-1" />
                                <button 
                                  onClick={() => { removeSet(ex.id, setIndex); setActiveSetMenu(null); }} 
                                  className="w-full flex items-center gap-3 p-2.5 hover:bg-red-50 rounded-xl transition-all text-left text-red-500 group"
                                >
                                  <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Trash2 size={14} />
                                  </div>
                                  <span className="text-xs font-bold">Remove Set</span>
                                </button>
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex flex-col gap-1">
                      <input 
                        type="number" 
                        value={set.weight || ''}
                        onChange={e => updateSet(ex.id, setIndex, { weight: Number(e.target.value) })}
                        placeholder="0"
                        className="w-full bg-slate-50 border border-slate-100 rounded-lg md:rounded-xl px-1 py-1.5 md:px-2 md:py-2 text-center font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none text-xs md:text-base"
                      />
                      {set.weight > 0 && set.reps > 0 && (
                        <div className="text-[8px] md:text-[9px] text-slate-400 font-bold text-center">
                          1RM: {calculate1RM(set.weight, set.reps)}kg
                        </div>
                      )}
                      {set.type === 'dropset' && setIndex > 0 && ex.sets[setIndex-1].weight > 0 && (
                        <div className="text-[8px] md:text-[9px] text-blue-500 font-bold text-center">
                          Sug: {Math.round(ex.sets[setIndex-1].weight * 0.8)}kg
                        </div>
                      )}
                    </div>

                    <input 
                      type="number" 
                      value={set.reps || ''}
                      onChange={e => updateSet(ex.id, setIndex, { reps: Number(e.target.value) })}
                      placeholder="0"
                      className="w-full bg-slate-50 border border-slate-100 rounded-lg md:rounded-xl px-1 py-1.5 md:px-2 md:py-2 text-center font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none text-xs md:text-base"
                    />

                    <select
                      value={set.rpe || ''}
                      onChange={e => updateSet(ex.id, setIndex, { rpe: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-lg md:rounded-xl px-1 py-1.5 md:px-2 md:py-2 text-center font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none appearance-none text-xs md:text-base"
                    >
                      <option value="">-</option>
                      {[6, 7, 8, 9, 10].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <button 
                      onClick={() => updateSet(ex.id, setIndex, { isCompleted: !set.isCompleted })}
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center transition-all ${
                        set.isCompleted 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      <Check size={16} className="md:w-5 md:h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => addSet(ex.id)}
                className="w-full mt-4 md:mt-6 py-2 md:py-3 border-2 border-dashed border-slate-200 rounded-xl md:rounded-2xl text-slate-400 font-bold hover:border-emerald-300 hover:text-emerald-600 transition-all flex items-center justify-center gap-2 text-xs md:text-base"
              >
                <Plus size={16} className="md:w-[18px] md:h-[18px]" />
                Add Set
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 md:mt-12">
        <button 
          onClick={() => setActiveSubTab('library')}
          className="w-full py-4 md:py-6 bg-white border-2 border-dashed border-emerald-200 rounded-2xl md:rounded-[32px] text-emerald-600 font-bold hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 md:gap-3 shadow-sm text-sm md:text-base mx-2 md:mx-0"
        >
          <Plus size={20} className="md:w-6 md:h-6" />
          Add Exercise
        </button>
      </div>

      <AnimatePresence>
        {selectedExerciseInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedExerciseInfo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-xl max-w-lg w-full overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">{selectedExerciseInfo.name}</h3>
                <button onClick={() => setSelectedExerciseInfo(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {selectedExerciseInfo.videoUrl && (
                  <>
                  <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden relative group">
                    {getExerciseGifUrl(selectedExerciseInfo.name, selectedExerciseInfo.muscles, selectedExerciseInfo.category) ? (
                      <img 
                        src={getExerciseGifUrl(selectedExerciseInfo.name, selectedExerciseInfo.muscles, selectedExerciseInfo.category) || ''}
                        alt={selectedExerciseInfo.name}
                        className="w-full h-full object-contain bg-white"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <iframe
                        src={`https://www.youtube.com/embed/${selectedExerciseInfo.videoUrl.split('v=')[1]?.split('&')[0] || selectedExerciseInfo.videoUrl.split('/').pop()}?autoplay=1&mute=1&loop=1&playlist=${selectedExerciseInfo.videoUrl.split('v=')[1]?.split('&')[0] || selectedExerciseInfo.videoUrl.split('/').pop()}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                        title={selectedExerciseInfo.name}
                        className="w-full h-full object-cover pointer-events-none"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                    {/* 
                      alt={selectedExerciseInfo.name}
                      className="w-full h-full object-contain bg-white"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${selectedExerciseInfo.videoUrl.split('v=')[1]?.split('&')[0] || selectedExerciseInfo.videoUrl.split('/').pop()}/maxresdefault.jpg`;
                        (e.target as HTMLImageElement).onerror = (e2) => {
                          (e2.target as HTMLImageElement).src = `https://picsum.photos/seed/${selectedExerciseInfo.name}/800/450`;
                        };
                      }}
                    */}
                    <a 
                      href={selectedExerciseInfo.videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors"
                    >
                      <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all">
                        <Play size={24} className="text-emerald-600 ml-1" fill="currentColor" />
                      </div>
                    </a>
                  </div>
                  <a 
                    href={selectedExerciseInfo.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 md:p-4 bg-slate-900 text-white rounded-xl md:rounded-2xl hover:bg-slate-800 transition-all group mt-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-red-600 rounded-lg md:rounded-xl flex items-center justify-center">
                        <Play size={16} className="md:w-5 md:h-5" fill="currentColor" />
                      </div>
                      <div>
                        <p className="font-bold text-xs md:text-sm">Watch Full Tutorial on YouTube</p>
                        <p className="text-[10px] text-slate-400 uppercase">External Link</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                  </>
                )}
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Instructions</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{selectedExerciseInfo.instructions}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">{selectedExerciseInfo.category}</span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg">{selectedExerciseInfo.difficulty}</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg">{selectedExerciseInfo.equipment}</span>
                </div>

                {user && (
                  <div className="space-y-3 md:space-y-4">
                    <h4 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
                      <History size={18} className="text-emerald-600 md:w-5 md:h-5" />
                      Your History
                    </h4>
                    {loadingHistory ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full" />
                      </div>
                    ) : exerciseHistory.length > 0 ? (
                      <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                        {exerciseHistory.slice(0, 3).map((hist, idx) => (
                          <div key={idx} className="bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs md:text-sm font-bold text-slate-900">{hist.date}</span>
                              <span className="text-[10px] md:text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200">{hist.workoutName}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {hist.sets.map((set: any, sIdx: number) => (
                                <div key={sIdx} className="bg-white p-2 rounded-lg border border-slate-100 text-center">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase">Set {sIdx + 1}</p>
                                  <p className="text-xs md:text-sm font-bold text-slate-900">{set.weight}kg × {set.reps}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-4 rounded-xl md:rounded-2xl border border-slate-100 text-center">
                        <p className="text-sm text-slate-500">No history found for this exercise yet. Start tracking to see your progress!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {justFinishedWorkout && (
          <WorkoutAnalysisModal 
            workout={justFinishedWorkout}
            onClose={() => setJustFinishedWorkout(null)}
            user={user}
            language={language}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function WorkoutAnalysisModal({ 
  workout, 
  onClose, 
  user,
  language 
}: { 
  workout: any, 
  onClose: () => void, 
  user: any,
  language?: 'en' | 'ar'
}) {
  const [workoutAnalysis, setWorkoutAnalysis] = useState<any | null>(null);
  const [isAnalyzingWorkout, setIsAnalyzingWorkout] = useState(false);

  const handleAnalyzeWorkout = async () => {
    setIsAnalyzingWorkout(true);
    try {
      const logsRef = collection(db, 'users', user.uid, 'dailyLogs');
      const q = query(logsRef, orderBy('date', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      
      const history: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.workouts) {
          history.push(...data.workouts);
        }
      });

      const analysis = await analyzeWorkoutSession(workout, history, language);
      setWorkoutAnalysis(analysis);
    } catch (error) {
      console.error("Error analyzing workout:", error);
      alert("Failed to analyze workout. Please try again.");
    } finally {
      setIsAnalyzingWorkout(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Award size={24} />
            Workout Complete!
          </h3>
          <button onClick={onClose} className="p-2 text-white/80 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {!workoutAnalysis && !isAnalyzingWorkout && (
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Trophy size={40} />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-slate-900 mb-2">Great Job!</h4>
                <p className="text-slate-500">You've successfully logged your workout. Want to see how you did?</p>
              </div>
              <button
                onClick={handleAnalyzeWorkout}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles size={20} className="text-emerald-400" />
                Analyze with AI
              </button>
            </div>
          )}

          {isAnalyzingWorkout && (
            <div className="text-center space-y-6 py-12">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                <Sparkles size={24} className="absolute inset-0 m-auto text-emerald-500 animate-pulse" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Analyzing Performance...</h4>
                <p className="text-sm text-slate-500">Comparing with your past records</p>
              </div>
            </div>
          )}

          {workoutAnalysis && (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-center">
                <p className="text-emerald-800 font-bold text-lg">{workoutAnalysis.encouragingMessage}</p>
              </div>

              {workoutAnalysis.prsBroken && workoutAnalysis.prsBroken.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <Trophy size={18} className="text-yellow-500" />
                    Personal Records
                  </h4>
                  <div className="grid gap-2">
                    {workoutAnalysis.prsBroken.map((pr: string, idx: number) => (
                      <div key={idx} className="bg-yellow-50 border border-yellow-100 p-3 rounded-xl flex items-start gap-3">
                        <Star size={16} className="text-yellow-600 mt-0.5 shrink-0" fill="currentColor" />
                        <p className="text-sm text-yellow-900 font-medium">{pr}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp size={18} className="text-emerald-500" />
                    Pros
                  </h4>
                  <ul className="space-y-2">
                    {workoutAnalysis.pros.map((pro: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-amber-500" />
                    Areas to Improve
                  </h4>
                  <ul className="space-y-2">
                    {workoutAnalysis.cons.map((con: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-2" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <Lightbulb size={18} className="text-blue-500" />
                  Tips for Next Time
                </h4>
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl space-y-3">
                  {workoutAnalysis.tips.map((tip: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-blue-900 pt-0.5">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TipCard({ title, content, icon }: { title: string, content: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-5 md:p-6 rounded-3xl border border-emerald-50 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{content}</p>
    </div>
  );
}

function TrendingUp({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function SportsEditor({ user, onUpdate, onClose }: { user: any, onUpdate: (u: any) => void, onClose: () => void }) {
  const [selectedSports, setSelectedSports] = useState<{ sportId: string, goalIds: string[] }[]>(user.selectedSports || []);
  const [targetWeight, setTargetWeight] = useState<number | undefined>(user.targetWeight);
  const [targetDate, setTargetDate] = useState<string | undefined>(user.targetDate);
  const [saving, setSaving] = useState(false);

  const toggleSport = (sportId: string) => {
    const exists = selectedSports.find(s => s.sportId === sportId);
    if (exists) {
      setSelectedSports(selectedSports.filter(s => s.sportId !== sportId));
    } else {
      setSelectedSports([...selectedSports, { sportId, goalIds: [] }]);
    }
  };

  const toggleGoal = (sportId: string, goalId: string) => {
    const updated = selectedSports.map(s => {
      if (s.sportId === sportId) {
        const goals = s.goalIds.includes(goalId) 
          ? s.goalIds.filter(g => g !== goalId)
          : [...s.goalIds, goalId];
        return { ...s, goalIds: goals };
      }
      return s;
    });
    setSelectedSports(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = { 
        selectedSports,
        targetWeight: targetWeight || null,
        targetDate: targetDate || null
      };
      await updateDoc(doc(db, 'users', user.uid), updates);
      onUpdate({ ...user, ...updates });
      onClose();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">Edit Sports & Goals</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {SPORTS_DATA.map(sport => {
            const isSelected = selectedSports.some(s => s.sportId === sport.id);
            return (
              <div key={sport.id} className="space-y-3">
                <button
                  onClick={() => toggleSport(sport.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                    isSelected ? "bg-emerald-50 border-emerald-600 text-emerald-900" : "border-slate-200 text-slate-600 hover:border-emerald-200"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", isSelected ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500")}>
                    {sport.icon}
                  </div>
                  <span className="font-semibold flex-1">{sport.name}</span>
                  {isSelected && <CheckCircle2 size={20} className="text-emerald-600" />}
                </button>
                
                {isSelected && (
                  <div className="pl-14 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sport.goals.map(goal => {
                      const isGoalSelected = selectedSports.find(s => s.sportId === sport.id)?.goalIds.includes(goal);
                      return (
                        <button
                          key={goal}
                          onClick={() => toggleGoal(sport.id, goal)}
                          className={cn(
                            "text-left px-4 py-2 rounded-lg text-sm transition-all border",
                            isGoalSelected ? "bg-emerald-100 border-emerald-300 text-emerald-800 font-medium" : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
                          )}
                        >
                          {goal}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Target size={18} className="text-emerald-600" />
              Weight Goal Settings
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Weight (kg)</label>
                <input 
                  type="number"
                  step="0.1"
                  value={targetWeight || ''}
                  onChange={(e) => setTargetWeight(parseFloat(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium"
                  placeholder="e.g. 75.0"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Date</label>
                <input 
                  type="date"
                  value={targetDate || ''}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex gap-4">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function WorkoutHistoryTab({ user, language }: { user: any, language?: 'en' | 'ar' }) {
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState<any | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const logsRef = collection(db, 'users', user.uid, 'dailyLogs');
        const q = query(logsRef, orderBy('date', 'desc'), limit(30));
        const querySnapshot = await getDocs(q);
        
        const logs: any[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.workouts && data.workouts.length > 0) {
            logs.push({
              date: data.date,
              workouts: data.workouts
            });
          }
        });
        setHistoryLogs(logs);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (historyLogs.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <History size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No History Yet</h3>
        <p className="text-slate-500">Start logging your workouts to see them here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <History className="text-emerald-600" />
          Workout History
        </h3>
        <div className="space-y-8">
          {historyLogs.map((log, idx) => (
            <div key={idx} className="relative pl-6 md:pl-8 border-l-2 border-slate-100 pb-2 last:pb-0">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
              <h4 className="font-bold text-slate-900 mb-4 text-lg">{log.date}</h4>
              <div className="grid gap-4">
                {log.workouts.map((w: any, wIdx: number) => (
                  <div key={wIdx} className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <h5 className="font-bold text-slate-900 text-lg">{w.name}</h5>
                        <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                          <Clock size={14} /> {w.duration} mins
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <ActivityIcon size={14} /> {w.totalVolume || 0} kg volume
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedWorkout(w)}
                        className="px-4 py-2 bg-white hover:bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
                      >
                        <Sparkles size={16} />
                        Analyze with AI
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {w.exercises?.slice(0, 3).map((ex: any, eIdx: number) => (
                        <div key={eIdx} className="flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">{ex.name}</span>
                          <span className="text-slate-500">{ex.sets?.length || 0} sets</span>
                        </div>
                      ))}
                      {w.exercises?.length > 3 && (
                        <p className="text-xs text-slate-400 font-medium pt-2">
                          + {w.exercises.length - 3} more exercises
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedWorkout && (
          <WorkoutAnalysisModal 
            workout={selectedWorkout}
            onClose={() => setSelectedWorkout(null)}
            user={user}
            language={language}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
