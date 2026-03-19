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
  Video,
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
  MoreVertical,
  Trash2,
  Copy,
  Save,
  Check,
  Activity as ActivityIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeExerciseForm, generateWorkoutPlan } from '../lib/gemini';
import { calculatePlanDetails } from '../lib/planUtils';
import { db, OperationType, handleFirestoreError } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { SCIENCE_BASED_PROTOCOLS, WorkoutPlan as ProtocolPlan } from '../constants/protocols';

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
}

interface DayPlan {
  day: string;
  exercises: Exercise[];
}

interface WorkoutPlan {
  planTitle: string;
  weeklySchedule: DayPlan[];
  injuryPreventionTips: string[];
  scientificBasis: string;
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

export default function SportsModule({ user, language }: { user: any, language?: 'en' | 'ar' }) {
  const [activeSubTab, setActiveSubTab] = useState<'plan' | 'analysis' | 'tips' | 'log' | 'library'>('plan');
  const [planMode, setPlanMode] = useState<'ai' | 'protocols'>('ai');
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolPlan | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(null);
  const [restTimer, setRestTimer] = useState<number | null>(null);
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
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [selectedTutorialUrl, setSelectedTutorialUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchWorkoutPlan();
    fetchCompletedExercises();
  }, [user.uid]);

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
        await setDoc(logRef, { workouts: [...workouts, newWorkout] }, { merge: true });
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

  const fetchWorkoutPlan = async () => {
    setLoadingPlan(true);
    try {
      const planDoc = await getDoc(doc(db, 'users', user.uid, 'plans', 'workout'));
      if (planDoc.exists()) {
        setWorkoutPlan(planDoc.data() as WorkoutPlan);
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
    setLoadingPlan(true);
    try {
      const plan = await generateWorkoutPlan(user, planDetails.training.intensity);
      await setDoc(doc(db, 'users', user.uid, 'plans', 'workout'), plan);
      setWorkoutPlan(plan);
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
    if (!videoRef.current || !canvasRef.current || !selectedExercise) return;
    
    setIsAnalyzing(true);
    setAnalysisResult(null);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    // Downscale for Gemini (max 1024px on longest side is usually safe and efficient)
    const maxDim = 1024;
    let width = video.videoWidth;
    let height = video.videoHeight;
    
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
    ctx?.drawImage(video, 0, 0, width, height);
    
    const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
    
    try {
      const result = await analyzeExerciseForm(base64Image, selectedExercise, selectedTutorialUrl || undefined);
      setAnalysisResult(result);
    } catch (error: any) {
      console.error('Analysis error:', error);
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
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Sports Science Lab</h2>
          <p className="text-slate-500">Evidence-based training protocols & biomechanical analysis</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-emerald-100 shadow-sm self-start">
          <button 
            onClick={() => setActiveSubTab('plan')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSubTab === 'plan' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Training Protocol
          </button>
          <button 
            onClick={() => { setActiveSubTab('analysis'); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSubTab === 'analysis' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Biomechanical Analysis
          </button>
          <button 
            onClick={() => setActiveSubTab('tips')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSubTab === 'tips' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Research & Safety
          </button>
          <button 
            onClick={() => setActiveSubTab('library')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSubTab === 'library' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Exercise Library
          </button>
          <button 
            onClick={() => setActiveSubTab('log')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSubTab === 'log' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Log Workout
          </button>
        </div>
      </div>

      <Card className="p-6 bg-slate-900 text-white border-none shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-emerald-400" size={20} />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Smart Plan Integration / تكامل الخطة الذكية</span>
              </div>
              <h2 className="text-2xl font-bold mb-1">Training Recommendation / توصيات التدريب</h2>
              <p className="text-slate-400 text-sm">Based on your {user.goal?.replace('_', ' ')} goal and target weight.</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 min-w-[120px]">
                <p className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Frequency / التكرار</p>
                <p className="text-xl font-bold">{planDetails.training.resistanceDays} <span className="text-xs font-medium text-slate-400">days/wk</span></p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 min-w-[120px]">
                <p className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Intensity / الشدة</p>
                <p className="text-sm font-bold truncate max-w-[150px]">{planDetails.training.intensity}</p>
              </div>
            </div>
          </div>
        </div>
        <Dumbbell className="absolute -bottom-10 -right-10 text-white/5" size={200} />
      </Card>

      <AnimatePresence mode="wait">
        {activeSubTab === 'plan' && (
          <motion.div 
            key="plan"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
              <button 
                onClick={() => setPlanMode('ai')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${planMode === 'ai' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {language === 'ar' ? 'خطة ذكية' : 'AI Generated Plan'}
              </button>
              <button 
                onClick={() => setPlanMode('protocols')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${planMode === 'protocols' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {language === 'ar' ? 'خطط علمية جاهزة' : 'Science Protocols'}
              </button>
            </div>

            {planMode === 'protocols' ? (
              <div className="space-y-8">
                <div className="grid md:grid-cols-3 gap-6">
                  {SCIENCE_BASED_PROTOCOLS.map((protocol) => (
                    <button
                      key={protocol.id}
                      onClick={() => setSelectedProtocol(protocol)}
                      className={`p-6 rounded-3xl border-2 transition-all text-left ${
                        selectedProtocol?.id === protocol.id 
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-100' 
                          : 'border-slate-100 bg-white hover:border-emerald-200'
                      }`}
                    >
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                        <BookOpen size={24} />
                      </div>
                      <h4 className="font-bold text-slate-900 mb-2">{protocol.planTitle}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4">{protocol.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">{protocol.intensity}</span>
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">{protocol.frequency}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedProtocol && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid lg:grid-cols-3 gap-8"
                  >
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-white p-8 rounded-3xl border border-emerald-50 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900">{selectedProtocol.planTitle}</h3>
                            <p className="text-sm text-emerald-600 font-bold">{selectedProtocol.description}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-10">
                          {selectedProtocol.weeklySchedule.map((day, idx) => (
                            <div key={idx} className="space-y-4">
                              <h4 className="text-lg font-bold text-emerald-900 flex items-center gap-3">
                                <span className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-sm shadow-lg shadow-emerald-100">{idx + 1}</span>
                                {day.day}
                              </h4>
                              <div className="grid gap-4">
                                {day.exercises.map((ex, exIdx) => (
                                  <div key={exIdx} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-emerald-300 hover:bg-white transition-all">
                                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                        <Dumbbell size={24} />
                                      </div>
                                      <div>
                                        <p className="font-bold text-slate-900 text-lg">{ex.name}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-wider">{ex.sets} Sets</span>
                                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">{ex.reps} Reps</span>
                                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded uppercase tracking-wider">{ex.rest} Rest</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button 
                                        onClick={() => startWorkoutFromPlan(day)}
                                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-2"
                                      >
                                        <Play size={14} fill="currentColor" />
                                        Start Workout
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl border border-slate-800">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center">
                            <AlertTriangle size={24} />
                          </div>
                          <h3 className="text-xl font-bold">Clinical Warnings</h3>
                        </div>
                        <ul className="space-y-5">
                          {selectedProtocol.injuryPreventionTips.map((tip, idx) => (
                            <li key={idx} className="flex gap-4 text-slate-300 text-sm leading-relaxed">
                              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white p-8 rounded-3xl border border-emerald-50 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                          <BookOpen size={80} />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <ShieldCheck size={24} />
                          </div>
                          <h3 className="text-lg font-bold text-slate-900">Physiological Basis</h3>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed relative z-10">
                          {selectedProtocol.scientificBasis}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : loadingPlan ? (
              <div className="bg-white p-12 rounded-3xl border border-emerald-50 flex flex-col items-center justify-center text-center">
                <RefreshCw className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
                <h3 className="text-xl font-bold text-slate-900">Synthesizing Scientific Protocol...</h3>
                <p className="text-slate-500">Cross-referencing your biometric data with exercise research</p>
              </div>
            ) : workoutPlan ? (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-8 rounded-3xl border border-emerald-50 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">{workoutPlan.planTitle}</h3>
                        <p className="text-sm text-emerald-600 font-bold">Optimized for: {user.goal?.replace('_', ' ')}</p>
                      </div>
                      <button onClick={generateNewPlan} className="text-emerald-600 hover:text-emerald-700 text-sm font-bold flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
                        <RefreshCw size={16} />
                        Update Protocol
                      </button>
                    </div>
                    
                    <div className="space-y-10">
                      {workoutPlan.weeklySchedule.map((day, idx) => (
                        <div key={idx} className="space-y-4">
                          <h4 className="text-lg font-bold text-emerald-900 flex items-center gap-3">
                            <span className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-sm shadow-lg shadow-emerald-100">{idx + 1}</span>
                            {day.day}
                          </h4>
                          <div className="grid gap-4">
                            {day.exercises.map((ex, exIdx) => (
                              <div key={exIdx} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-emerald-300 hover:bg-white transition-all">
                                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-slate-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    <Dumbbell size={24} />
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900 text-lg">{ex.name}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-wider">{ex.sets} Sets</span>
                                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">{ex.reps} Reps</span>
                                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded uppercase tracking-wider">{ex.rest} Rest</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-2">
                                    <button 
                                      onClick={() => startWorkoutFromPlan(day)}
                                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-2"
                                    >
                                      <Play size={14} fill="currentColor" />
                                      Start Workout
                                    </button>
                                    <button 
                                      onClick={() => markExerciseComplete(ex)}
                                      disabled={completedExercises.includes(ex.name)}
                                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                        completedExercises.includes(ex.name) 
                                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                                          : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-600 hover:text-emerald-600'
                                      }`}
                                    >
                                      <CheckCircle2 size={16} />
                                      {completedExercises.includes(ex.name) ? 'Done' : 'Mark Done'}
                                    </button>
                                  </div>
                                  {ex.videoUrl && (
                                    <a 
                                      href={ex.videoUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-emerald-600 hover:text-emerald-600 transition-all"
                                    >
                                      <Play size={16} />
                                      Tutorial
                                    </a>
                                  )}
                                  <button 
                                    onClick={() => { 
                                      setActiveSubTab('analysis'); 
                                      setSelectedExercise(ex.name);
                                      setSelectedTutorialUrl(ex.videoUrl || null);
                                    }}
                                    className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                                    title="Analyze Form"
                                  >
                                    <Camera size={20} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl border border-slate-800">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center">
                        <AlertTriangle size={24} />
                      </div>
                      <h3 className="text-xl font-bold">Clinical Warnings</h3>
                    </div>
                    <ul className="space-y-5">
                      {workoutPlan.injuryPreventionTips.map((tip, idx) => (
                        <li key={idx} className="flex gap-4 text-slate-300 text-sm leading-relaxed">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-8 rounded-3xl border border-emerald-50 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <BookOpen size={80} />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                        <ShieldCheck size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">Physiological Basis</h3>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed relative z-10">
                      {workoutPlan.scientificBasis}
                    </p>
                    <div className="mt-6 pt-6 border-t border-slate-50 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <Info size={12} />
                      Verified by NABD AI Research
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
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
                    <Video className="text-emerald-600" />
                    Biomechanical Scanner
                  </h3>
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Video Analysis Mode
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reference Video URL (Optional)</label>
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
                      <Video size={16} />
                      Upload Video
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
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-800">
                      <Video className="w-12 h-12 text-emerald-500 mb-4" />
                      <h4 className="text-white font-bold mb-2">Upload Exercise Video</h4>
                      <p className="text-slate-400 text-sm mb-6 max-w-xs">Record your exercise and upload the video here for a complete biomechanical diagnostic.</p>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
                      >
                        <Plus size={20} />
                        Select Video File
                      </button>
                    </div>
                  ) : (
                    <>
                      <video 
                        ref={videoRef} 
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
                {analysisResult ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-8 rounded-3xl border border-emerald-50 shadow-sm h-full flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Diagnostic Report</h3>
                      <div className={`px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 ${analysisResult.isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {analysisResult.isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                        {analysisResult.isCorrect ? 'Optimal' : 'Sub-Optimal'}
                      </div>
                    </div>

                    <div className="space-y-8 flex-1">
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Biomechanical Feedback</h4>
                        <p className="text-slate-700 leading-relaxed font-medium">
                          {analysisResult.feedback}
                        </p>
                      </div>

                      {!analysisResult.isCorrect && (
                        <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                          <h4 className="text-[10px] font-black text-orange-700 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                            <AlertTriangle size={16} />
                            Pathological Risk
                          </h4>
                          <p className="text-orange-900 text-sm leading-relaxed font-medium">
                            {analysisResult.injuryRisk}
                          </p>
                        </div>
                      )}

                      <div className="pt-8 border-t border-slate-100 mt-auto">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Corrective Video Protocol</h4>
                        <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden group cursor-pointer">
                          <img 
                            src={`https://picsum.photos/seed/${selectedExercise}/800/450`} 
                            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500" 
                            alt="Tutorial"
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                              <Play size={32} fill="currentColor" />
                            </div>
                            <p className="mt-4 font-bold text-lg">Mastering {selectedExercise} Form</p>
                            <p className="text-xs text-emerald-400 font-mono">SCIENTIFIC BREAKDOWN</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="bg-white p-12 rounded-3xl border border-emerald-50 shadow-sm h-full flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                      <Camera size={48} className="text-slate-200" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-300">Awaiting Data Input</h3>
                    <p className="max-w-xs mx-auto mt-3 text-slate-400 text-sm leading-relaxed">
                      Please select an exercise and perform a scan to generate your biomechanical diagnostic report.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'tips' && (
          <motion.div 
            key="tips"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TipCard 
                title="Neural Adaptations"
                content="Initial strength gains (first 2-4 weeks) are primarily neural. Your brain becomes more efficient at recruiting motor units before significant muscle hypertrophy occurs."
                icon={<Zap className="text-blue-500" />}
              />
              <TipCard 
                title="Metabolic Stress"
                content="The 'pump' isn't just for show. Cellular swelling and metabolite accumulation (lactate, hydrogen ions) trigger anabolic signaling pathways for muscle growth."
                icon={<Play className="text-orange-500" />}
              />
              <TipCard 
                title="Connective Tissue"
                content="Tendons and ligaments adapt slower than muscles. Progressive overload must be gradual to allow collagen synthesis to keep pace with muscular force production."
                icon={<ShieldCheck className="text-emerald-500" />}
              />
              <TipCard 
                title="Hormonal Response"
                content="Compound movements (squats, deadlifts) trigger a systemic hormonal response, increasing testosterone and growth hormone levels more than isolation exercises."
                icon={<Dumbbell className="text-purple-500" />}
              />
              <TipCard 
                title="Biomechanics of Injury"
                content="Most non-contact injuries occur during the eccentric (lowering) phase when muscles are at their longest and under high tension. Control is critical."
                icon={<AlertTriangle className="text-red-500" />}
              />
              <TipCard 
                title="Periodization Science"
                content="Varying intensity and volume in cycles prevents overtraining and plateaus by allowing the central nervous system to recover periodically."
                icon={<TrendingUp size={24} className="text-emerald-600" />}
              />
            </div>

            <div className="bg-white p-10 rounded-[40px] border border-emerald-50 shadow-sm">
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="flex-1 space-y-6">
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">The Science of Recovery</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Recovery is not passive; it is an active physiological process. Our protocols emphasize the <strong>Supercompensation Principle</strong>: training breaks you down, but the body rebuilds stronger only if given adequate stimulus-recovery intervals.
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-emerald-600">48-72h</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Optimal Muscle Recovery</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-blue-600">7-9h</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recommended Sleep Cycle</p>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-80 aspect-square bg-emerald-50 rounded-3xl flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-emerald-600"
                  >
                    <Heart size={120} fill="currentColor" opacity={0.1} />
                  </motion.div>
                </div>
              </div>
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
              onAddExercise={async (ex) => {
                if (activeWorkout) {
                  addExerciseToActiveWorkout(ex);
                  return;
                }
                if (!workoutPlan) return;
                const newEx: Exercise = {
                  name: ex.name,
                  sets: 3,
                  reps: '10-12',
                  rest: '60s',
                  videoUrl: ex.videoUrl
                };
                const updatedSchedule = [...workoutPlan.weeklySchedule];
                if (updatedSchedule.length > 0) {
                  updatedSchedule[0].exercises.push(newEx);
                  const updatedPlan = { ...workoutPlan, weeklySchedule: updatedSchedule };
                  try {
                    await setDoc(doc(db, 'users', user.uid, 'plans', 'workout'), updatedPlan);
                    setWorkoutPlan(updatedPlan);
                    alert(`${ex.name} added to Day 1 of your protocol!`);
                  } catch (e) {
                    console.error(e);
                  }
                }
              }} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {restTimer !== null && (
        <RestTimerOverlay seconds={restTimer} onFinish={() => setRestTimer(null)} />
      )}
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

const EXERCISE_LIBRARY = [
  {
    id: 'squat',
    name: 'Barbell Squat / سكوات بالبار',
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    instructions: 'Place barbell on upper back, feet shoulder-width apart. Lower hips until thighs are parallel to floor, then return to start.',
    videoUrl: 'https://www.youtube.com/results?search_query=barbell+squat+form',
    category: 'Strength',
    difficulty: 'Intermediate'
  },
  {
    id: 'deadlift',
    name: 'Conventional Deadlift / ديدلفت',
    muscles: ['Hamstrings', 'Glutes', 'Lower Back', 'Traps'],
    instructions: 'Stand with feet mid-foot under bar. Bend and grab bar. Hips down, chest up. Pull bar up while keeping it close to body.',
    videoUrl: 'https://www.youtube.com/results?search_query=deadlift+form',
    category: 'Strength',
    difficulty: 'Advanced'
  },
  {
    id: 'bench-press',
    name: 'Bench Press / بنش برس',
    muscles: ['Chest', 'Triceps', 'Shoulders'],
    instructions: 'Lie on bench, feet flat. Grip bar slightly wider than shoulders. Lower bar to mid-chest, then press up.',
    videoUrl: 'https://www.youtube.com/results?search_query=bench+press+form',
    category: 'Strength',
    difficulty: 'Intermediate'
  },
  {
    id: 'pull-up',
    name: 'Pull-up / عقلة',
    muscles: ['Lats', 'Biceps', 'Upper Back'],
    instructions: 'Hang from bar with overhand grip. Pull body up until chin is over bar. Lower with control.',
    videoUrl: 'https://www.youtube.com/results?search_query=pull+up+form',
    category: 'Bodyweight',
    difficulty: 'Intermediate'
  },
  {
    id: 'push-up',
    name: 'Push-up / تمرين الضغط',
    muscles: ['Chest', 'Triceps', 'Shoulders'],
    instructions: 'Start in plank position. Lower body until chest nearly touches floor. Push back up to start.',
    videoUrl: 'https://www.youtube.com/results?search_query=push+up+form',
    category: 'Bodyweight',
    difficulty: 'Beginner'
  },
  {
    id: 'bicep-curl',
    name: 'Dumbbell Bicep Curl / بايسبس بالدمبل',
    muscles: ['Biceps', 'Forearms'],
    instructions: 'Hold dumbbells at sides. Curl weights toward shoulders while keeping elbows stationary. Lower slowly.',
    videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+bicep+curl+form',
    category: 'Strength',
    difficulty: 'Beginner'
  },
  {
    id: 'tricep-dip',
    name: 'Tricep Dips / ترايسبس ديبس',
    muscles: ['Triceps', 'Chest', 'Shoulders'],
    instructions: 'Use parallel bars or bench. Lower body by bending elbows until arms are at 90 degrees. Push back up.',
    videoUrl: 'https://www.youtube.com/results?search_query=tricep+dips+form',
    category: 'Bodyweight',
    difficulty: 'Intermediate'
  },
  {
    id: 'leg-press',
    name: 'Leg Press / ضغط الأرجل',
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    instructions: 'Sit in machine with feet on platform. Push platform away by extending legs. Lower with control.',
    videoUrl: 'https://www.youtube.com/results?search_query=leg+press+form',
    category: 'Strength',
    difficulty: 'Beginner'
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown / سحب الظهر',
    muscles: ['Lats', 'Upper Back', 'Biceps'],
    instructions: 'Sit at machine. Pull bar down to upper chest while squeezing shoulder blades. Return slowly.',
    videoUrl: 'https://www.youtube.com/results?search_query=lat+pulldown+form',
    category: 'Strength',
    difficulty: 'Beginner'
  },
  {
    id: 'lateral-raise',
    name: 'Lateral Raise / رفرفة جانبي',
    muscles: ['Shoulders (Lateral Deltoid)'],
    instructions: 'Hold dumbbells at sides. Raise arms out to sides until parallel with floor. Lower slowly.',
    videoUrl: 'https://www.youtube.com/results?search_query=lateral+raise+form',
    category: 'Strength',
    difficulty: 'Beginner'
  },
  {
    id: 'plank',
    name: 'Forearm Plank / بلانك',
    muscles: ['Core', 'Shoulders'],
    instructions: 'Hold push-up position but on forearms. Keep body in straight line from head to heels. Engage core.',
    videoUrl: 'https://www.youtube.com/results?search_query=plank+form',
    category: 'Core',
    difficulty: 'Beginner'
  },
  {
    id: 'overhead-press',
    name: 'Overhead Press / ضغط الكتف',
    muscles: ['Shoulders', 'Triceps', 'Core'],
    instructions: 'Stand with bar at upper chest. Press bar overhead until arms are locked. Lower to start.',
    videoUrl: 'https://www.youtube.com/results?search_query=overhead+press+form',
    category: 'Strength',
    difficulty: 'Intermediate'
  },
  {
    id: 'lunges',
    name: 'Walking Lunges / طعن متحرك',
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    instructions: 'Step forward and lower hips until both knees are bent at 90 degrees. Step forward with other leg.',
    videoUrl: 'https://www.youtube.com/results?search_query=walking+lunges+form',
    category: 'Strength',
    difficulty: 'Beginner'
  },
  {
    id: 'burpees',
    name: 'Burpees / بوربيز',
    muscles: ['Full Body', 'Cardio'],
    instructions: 'From standing, drop to squat, kick feet back, do a push-up, jump feet forward, and jump up.',
    videoUrl: 'https://www.youtube.com/results?search_query=burpees+form',
    category: 'Cardio',
    difficulty: 'Advanced'
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers / متسلق الجبال',
    muscles: ['Core', 'Cardio', 'Shoulders'],
    instructions: 'Start in plank. Alternately drive knees toward chest as fast as possible while maintaining form.',
    videoUrl: 'https://www.youtube.com/results?search_query=mountain+climbers+form',
    category: 'Cardio',
    difficulty: 'Intermediate'
  },
  {
    id: 'russian-twist',
    name: 'Russian Twist / التواء روسي',
    muscles: ['Obliques', 'Core'],
    instructions: 'Sit with knees bent, feet off floor. Twist torso from side to side, touching floor with hands.',
    videoUrl: 'https://www.youtube.com/results?search_query=russian+twist+form',
    category: 'Core',
    difficulty: 'Beginner'
  },
  {
    id: 'hip-thrust',
    name: 'Barbell Hip Thrust / دفع الحوض بالبار',
    muscles: ['Glutes', 'Hamstrings'],
    instructions: 'Sit with back against bench, bar over hips. Drive hips up until body is parallel to floor. Squeeze glutes.',
    videoUrl: 'https://www.youtube.com/results?search_query=hip+thrust+form',
    category: 'Strength',
    difficulty: 'Intermediate'
  },
  {
    id: 'face-pull',
    name: 'Face Pull / سحب للوجه',
    muscles: ['Rear Deltoids', 'Upper Back'],
    instructions: 'Use rope attachment on cable machine. Pull rope toward face, pulling ends apart. Squeeze rear delts.',
    videoUrl: 'https://www.youtube.com/results?search_query=face+pull+form',
    category: 'Strength',
    difficulty: 'Beginner'
  },
  {
    id: 'hammer-curl',
    name: 'Hammer Curl / هامر كيرل',
    muscles: ['Biceps', 'Brachialis', 'Forearms'],
    instructions: 'Hold dumbbells with palms facing each other. Curl weights toward shoulders. Lower slowly.',
    videoUrl: 'https://www.youtube.com/results?search_query=hammer+curl+form',
    category: 'Strength',
    difficulty: 'Beginner'
  },
  {
    id: 'calf-raise',
    name: 'Standing Calf Raise / رفع السمانة',
    muscles: ['Calves'],
    instructions: 'Stand on edge of step. Raise heels as high as possible, then lower below step level.',
    videoUrl: 'https://www.youtube.com/results?search_query=standing+calf+raise+form',
    category: 'Strength',
    difficulty: 'Beginner'
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat / سكوات بلغاري',
    muscles: ['Quadriceps', 'Glutes'],
    instructions: 'Stand with one foot on bench behind you. Lower hips until front thigh is parallel to floor. Push back up.',
    videoUrl: 'https://www.youtube.com/results?search_query=bulgarian+split+squat+form',
    category: 'Strength',
    difficulty: 'Intermediate'
  },
  {
    id: 'cable-row',
    name: 'Seated Cable Row / سحب كابل جالس',
    muscles: ['Upper Back', 'Lats', 'Biceps'],
    instructions: 'Sit at machine, feet on pads. Pull handle toward abdomen while keeping back straight. Return slowly.',
    videoUrl: 'https://www.youtube.com/results?search_query=seated+cable+row+form',
    category: 'Strength',
    difficulty: 'Beginner'
  },
  {
    id: 'kettlebell-swing',
    name: 'Kettlebell Swing / مرجحة الكيتل بيل',
    muscles: ['Hamstrings', 'Glutes', 'Core', 'Shoulders'],
    instructions: 'Hinge at hips, swing kettlebell between legs, then drive hips forward to swing it to chest height.',
    videoUrl: 'https://www.youtube.com/results?search_query=kettlebell+swing+form',
    category: 'Strength',
    difficulty: 'Intermediate'
  },
  {
    id: 'box-jump',
    name: 'Box Jump / قفز الصندوق',
    muscles: ['Quadriceps', 'Glutes', 'Cardio'],
    instructions: 'Stand in front of box. Jump onto box, landing softly in partial squat. Step down and repeat.',
    videoUrl: 'https://www.youtube.com/results?search_query=box+jump+form',
    category: 'Cardio',
    difficulty: 'Intermediate'
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift / ديدلفت روماني',
    muscles: ['Hamstrings', 'Glutes', 'Lower Back'],
    instructions: 'Hold bar at hips. Hinge at hips, lowering bar while keeping legs nearly straight. Feel stretch in hamstrings.',
    videoUrl: 'https://www.youtube.com/results?search_query=romanian+deadlift+form',
    category: 'Strength',
    difficulty: 'Intermediate'
  },
  {
    id: 'skull-crusher',
    name: 'Skull Crusher / سكال كراشر',
    muscles: ['Triceps'],
    instructions: 'Lie on bench with bar over chest. Lower bar toward forehead by bending elbows. Extend back to start.',
    videoUrl: 'https://www.youtube.com/results?search_query=skull+crusher+form',
    category: 'Strength',
    difficulty: 'Intermediate'
  },
  {
    id: 'arnold-press',
    name: 'Arnold Press / أرنولد برس',
    muscles: ['Shoulders', 'Triceps'],
    instructions: 'Hold dumbbells in front of shoulders, palms facing you. Rotate palms out as you press weights overhead.',
    videoUrl: 'https://www.youtube.com/results?search_query=arnold+press+form',
    category: 'Strength',
    difficulty: 'Intermediate'
  },
  {
    id: 'bicycle-crunch',
    name: 'Bicycle Crunch / طحن الدراجة',
    muscles: ['Core', 'Obliques'],
    instructions: 'Lie on back. Alternately bring opposite elbow to opposite knee in a cycling motion.',
    videoUrl: 'https://www.youtube.com/results?search_query=bicycle+crunch+form',
    category: 'Core',
    difficulty: 'Beginner'
  },
  {
    id: 'leg-curl',
    name: 'Seated Leg Curl / مرجحة الأرجل جالس',
    muscles: ['Hamstrings'],
    instructions: 'Sit in machine with legs over pad. Pull pad down toward back of thighs. Return slowly.',
    videoUrl: 'https://www.youtube.com/results?search_query=seated+leg+curl+form',
    category: 'Strength',
    difficulty: 'Beginner'
  },
  {
    id: 'leg-extension',
    name: 'Leg Extension / تمديد الأرجل',
    muscles: ['Quadriceps'],
    instructions: 'Sit in machine with legs behind pad. Extend legs until straight. Lower with control.',
    videoUrl: 'https://www.youtube.com/results?search_query=leg+extension+form',
    category: 'Strength',
    difficulty: 'Beginner'
  },
  {
    id: 'pec-deck',
    name: 'Pec Deck Fly / تفتيح الصدر بالجهاز',
    muscles: ['Chest'],
    instructions: 'Sit in machine, arms out. Bring handles together in front of chest. Return slowly.',
    videoUrl: 'https://www.youtube.com/results?search_query=pec+deck+fly+form',
    category: 'Strength',
    difficulty: 'Beginner'
  },
  {
    id: 'battle-ropes',
    name: 'Battle Ropes / حبال المقاومة',
    muscles: ['Full Body', 'Cardio', 'Shoulders'],
    instructions: 'Hold ends of ropes. Create waves by moving arms up and down rapidly.',
    videoUrl: 'https://www.youtube.com/results?search_query=battle+ropes+form',
    category: 'Cardio',
    difficulty: 'Intermediate'
  },
  {
    id: 'farmers-walk',
    name: 'Farmers Walk / مشية المزارع',
    muscles: ['Grip', 'Core', 'Full Body'],
    instructions: 'Hold heavy dumbbells in each hand. Walk for a set distance or time while maintaining upright posture.',
    videoUrl: 'https://www.youtube.com/results?search_query=farmers+walk+form',
    category: 'Strength',
    difficulty: 'Beginner'
  },
  {
    id: 'chin-up',
    name: 'Chin-up / عقلة قبضة معكوسة',
    muscles: ['Biceps', 'Lats', 'Upper Back'],
    instructions: 'Hang from bar with underhand grip. Pull body up until chin is over bar. Lower with control.',
    videoUrl: 'https://www.youtube.com/results?search_query=chin+up+form',
    category: 'Bodyweight',
    difficulty: 'Intermediate'
  },
  {
    id: 'diamond-push-up',
    name: 'Diamond Push-up / ضغط ضيق',
    muscles: ['Triceps', 'Chest'],
    instructions: 'Place hands together under chest forming a diamond shape with fingers. Lower and push back up.',
    videoUrl: 'https://www.youtube.com/results?search_query=diamond+push+up+form',
    category: 'Bodyweight',
    difficulty: 'Intermediate'
  },
  {
    id: 'pike-push-up',
    name: 'Pike Push-up / ضغط بايك',
    muscles: ['Shoulders', 'Triceps'],
    instructions: 'Start in downward dog position. Lower head toward floor by bending elbows. Push back up.',
    videoUrl: 'https://www.youtube.com/results?search_query=pike+push+up+form',
    category: 'Bodyweight',
    difficulty: 'Intermediate'
  },
  {
    id: 't-bar-row',
    name: 'T-Bar Row / تجديف T-Bar',
    muscles: ['Upper Back', 'Lats', 'Biceps'],
    instructions: 'Straddle bar with V-handle. Pull bar toward chest while keeping back flat. Lower with control.',
    videoUrl: 'https://www.youtube.com/results?search_query=t+bar+row+form',
    category: 'Strength',
    difficulty: 'Intermediate'
  },
  {
    id: 'incline-db-press',
    name: 'Incline Dumbbell Press / بنش مائل بالدمبل',
    muscles: ['Upper Chest', 'Shoulders', 'Triceps'],
    instructions: 'Lie on incline bench. Press dumbbells from shoulders until arms are locked. Lower slowly.',
    videoUrl: 'https://www.youtube.com/results?search_query=incline+dumbbell+press+form',
    category: 'Strength',
    difficulty: 'Intermediate'
  },
  {
    id: 'cable-crossover',
    name: 'Cable Crossover / كابل كروس',
    muscles: ['Chest'],
    instructions: 'Stand between cable pulleys. Pull handles together in front of body in a hugging motion.',
    videoUrl: 'https://www.youtube.com/results?search_query=cable+crossover+form',
    category: 'Strength',
    difficulty: 'Intermediate'
  },
  {
    id: 'shrugs',
    name: 'Dumbbell Shrugs / تمرين الترابيس',
    muscles: ['Traps'],
    instructions: 'Hold dumbbells at sides. Lift shoulders toward ears as high as possible. Lower slowly.',
    videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+shrugs+form',
    category: 'Strength',
    difficulty: 'Beginner'
  },
  {
    id: 'superman',
    name: 'Superman / سوبرمان',
    muscles: ['Lower Back', 'Glutes'],
    instructions: 'Lie face down. Simultaneously lift arms, chest, and legs off floor. Hold and lower.',
    videoUrl: 'https://www.youtube.com/results?search_query=superman+exercise+form',
    category: 'Core',
    difficulty: 'Beginner'
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug / ديد باج',
    muscles: ['Core'],
    instructions: 'Lie on back, arms up, knees at 90 degrees. Slowly lower opposite arm and leg toward floor.',
    videoUrl: 'https://www.youtube.com/results?search_query=dead+bug+exercise+form',
    category: 'Core',
    difficulty: 'Beginner'
  },
  {
    id: 'thrusters',
    name: 'Thrusters / ثرسترز',
    muscles: ['Full Body', 'Quadriceps', 'Shoulders', 'Cardio'],
    instructions: 'Hold dumbbells at shoulders. Perform a full squat, then press weights overhead as you stand up.',
    videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+thrusters+form',
    category: 'Strength',
    difficulty: 'Advanced'
  },
  {
    id: 'power-clean',
    name: 'Power Clean / باور كلين',
    muscles: ['Full Body', 'Explosive Power', 'Hamstrings', 'Traps'],
    instructions: 'Pull bar from floor explosively, "catching" it on front of shoulders in a partial squat.',
    videoUrl: 'https://www.youtube.com/results?search_query=power+clean+form',
    category: 'Strength',
    difficulty: 'Advanced'
  }
];

function ExerciseLibrary({ onAddExercise }: { onAddExercise: (ex: any) => void }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [viewingExercise, setViewingExercise] = useState<any | null>(null);

  const filtered = EXERCISE_LIBRARY.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase()) || 
                         ex.muscles.some(m => m.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = !selectedCategory || ex.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || ex.difficulty === selectedDifficulty;
    const matchesMuscle = !selectedMuscle || ex.muscles.includes(selectedMuscle);
    return matchesSearch && matchesCategory && matchesDifficulty && matchesMuscle;
  });

  const categories = Array.from(new Set(EXERCISE_LIBRARY.map(ex => ex.category)));
  const difficulties = Array.from(new Set(EXERCISE_LIBRARY.map(ex => ex.difficulty)));
  const allMuscles = Array.from(new Set(EXERCISE_LIBRARY.flatMap(ex => ex.muscles))).sort();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search exercises or muscles..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none w-full"
          />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <select 
            value={selectedCategory || ''} 
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select 
            value={selectedDifficulty || ''} 
            onChange={(e) => setSelectedDifficulty(e.target.value || null)}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Difficulties</option>
            {difficulties.map(diff => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>

          <select 
            value={selectedMuscle || ''} 
            onChange={(e) => setSelectedMuscle(e.target.value || null)}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Muscles</option>
            {allMuscles.map(muscle => (
              <option key={muscle} value={muscle}>{muscle}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(ex => (
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
              <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                ex.difficulty === 'Beginner' ? 'bg-emerald-100 text-emerald-700' :
                ex.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                {ex.difficulty}
              </span>
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
              className="bg-white rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col"
            >
              <div className="h-48 bg-emerald-600 relative overflow-hidden shrink-0">
                <div className="absolute inset-0 opacity-20">
                  <Dumbbell size={200} className="absolute -bottom-10 -right-10 text-white rotate-12" />
                </div>
                <button 
                  onClick={() => setViewingExercise(null)}
                  className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="absolute bottom-8 left-8">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur text-white text-xs font-bold rounded-lg uppercase tracking-widest mb-2 inline-block">
                    {viewingExercise.category}
                  </span>
                  <h3 className="text-3xl font-bold text-white">{viewingExercise.name}</h3>
                </div>
              </div>

              <div className="p-8 overflow-y-auto space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Target Muscles</p>
                    <div className="flex flex-wrap gap-2">
                      {viewingExercise.muscles.map((m: string) => (
                        <span key={m} className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Difficulty</p>
                    <p className="text-lg font-bold text-slate-900">{viewingExercise.difficulty}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen size={20} className="text-emerald-600" />
                    Instructions
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    {viewingExercise.instructions}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Play size={20} className="text-emerald-600" />
                    Video Reference
                  </h4>
                  <a 
                    href={viewingExercise.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                        <Play size={20} fill="currentColor" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Watch Form Tutorial</p>
                        <p className="text-[10px] text-slate-400 uppercase">External Link</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>

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
  setActiveSubTab
}: { 
  user: any, 
  activeWorkout: ActiveWorkout | null, 
  setActiveWorkout: (w: ActiveWorkout | null) => void,
  restTimer: number | null,
  setRestTimer: (n: number | null) => void,
  setActiveSubTab: (s: 'log' | 'plan' | 'analysis' | 'tips' | 'library') => void
}) {
  const [saving, setSaving] = useState(false);
  const [todayWorkouts, setTodayWorkouts] = useState<any[]>([]);
  const [workoutDuration, setWorkoutDuration] = useState(0);

  useEffect(() => {
    fetchTodayWorkouts();
  }, [user.uid]);

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
      const todayStr = new Date().toISOString().split('T')[0];
      const logDoc = await getDoc(doc(db, 'users', user.uid, 'dailyLogs', todayStr));
      if (logDoc.exists()) {
        setTodayWorkouts(logDoc.data().workouts || []);
      }
    } catch (error) {
      console.error("Error fetching today's workouts:", error);
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
    setActiveWorkout({
      ...activeWorkout,
      exercises: activeWorkout.exercises.map(ex => 
        ex.id === exerciseId 
          ? { 
              ...ex, 
              sets: ex.sets.map((s, i) => {
                if (i === setIndex) {
                  const newSet = { ...s, ...updates };
                  if (updates.isCompleted === true && !s.isCompleted) {
                    setRestTimer(90); // Default 90s rest
                  }
                  return newSet;
                }
                return s;
              })
            }
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

      const todayStr = new Date().toISOString().split('T')[0];
      const logRef = doc(db, 'users', user.uid, 'dailyLogs', todayStr);
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
          workouts: [...(currentData.workouts || []), finishedWorkout]
        });
      } else {
        await setDoc(logRef, {
          date: todayStr,
          workouts: [finishedWorkout]
        });
      }
      
      setActiveWorkout(null);
      fetchTodayWorkouts();
      alert("Workout saved! Great job! / تم حفظ التمرين! عمل رائع!");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}/dailyLogs`);
    } finally {
      setSaving(false);
    }
  };

  if (!activeWorkout) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center py-12 bg-white rounded-[40px] border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ActivityIcon size={40} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready for your workout?</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">Start a new session to track your sets, reps, and progress in real-time.</p>
          <button 
            onClick={() => setActiveWorkout({
              name: 'New Workout',
              startTime: new Date().toISOString(),
              exercises: []
            })}
            className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-2 mx-auto"
          >
            <Plus size={20} />
            Start Empty Workout
          </button>
        </div>

        {todayWorkouts.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <History size={20} className="text-emerald-600" />
              Today's History
            </h4>
            <div className="grid gap-4">
              {todayWorkouts.map((w, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-slate-900">{w.name}</h5>
                      <p className="text-sm text-slate-500">{w.duration} mins • {w.totalVolume || 0} kg total volume</p>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 font-bold">
                      <Award size={20} />
                      <span>Completed</span>
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
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-32">
      <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl sticky top-4 z-50 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <input 
              type="text" 
              value={activeWorkout.name}
              onChange={e => setActiveWorkout({ ...activeWorkout, name: e.target.value })}
              className="bg-transparent text-2xl font-bold outline-none border-b border-transparent focus:border-emerald-500 transition-all w-full"
            />
            <div className="flex items-center gap-4 mt-2 text-slate-400 text-sm font-medium">
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span>{Math.floor(workoutDuration / 60)}:{(workoutDuration % 60).toString().padStart(2, '0')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingIcon size={14} />
                <span>{activeWorkout.exercises.reduce((acc, ex) => acc + ex.sets.reduce((sAcc, s) => sAcc + (s.weight * s.reps), 0), 0)} kg</span>
              </div>
            </div>
          </div>
          <button 
            onClick={handleFinishWorkout}
            disabled={saving}
            className="px-6 py-3 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-400 transition-all shadow-lg disabled:opacity-50"
          >
            {saving ? 'Finishing...' : 'Finish'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {activeWorkout.exercises.map((ex, exIndex) => (
          <div key={ex.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
                  {exIndex + 1}
                </div>
                <h4 className="font-bold text-slate-900">{ex.name}</h4>
              </div>
              <button 
                onClick={() => removeExercise(ex.id)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-[40px_1fr_1fr_1fr_40px] gap-4 mb-4 px-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Set</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">kg</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Reps</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">RPE</span>
                <span className="w-10" />
              </div>

              <div className="space-y-3">
                {ex.sets.map((set, setIndex) => (
                  <div 
                    key={setIndex}
                    className={`grid grid-cols-[40px_1fr_1fr_1fr_40px] gap-4 items-center p-2 rounded-2xl transition-all ${set.isCompleted ? 'bg-emerald-50/50' : 'bg-white'}`}
                  >
                    <div className="text-center font-bold text-slate-400 text-sm">{setIndex + 1}</div>
                    <input 
                      type="number" 
                      value={set.weight || ''}
                      onChange={e => updateSet(ex.id, setIndex, { weight: Number(e.target.value) })}
                      placeholder="0"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-2 py-2 text-center font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                    <input 
                      type="number" 
                      value={set.reps || ''}
                      onChange={e => updateSet(ex.id, setIndex, { reps: Number(e.target.value) })}
                      placeholder="0"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-2 py-2 text-center font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                    <select
                      value={set.rpe || ''}
                      onChange={e => updateSet(ex.id, setIndex, { rpe: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-2 py-2 text-center font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
                    >
                      <option value="">-</option>
                      {[6, 7, 8, 9, 10].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <button 
                      onClick={() => updateSet(ex.id, setIndex, { isCompleted: !set.isCompleted })}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        set.isCompleted 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      <Check size={20} />
                    </button>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => addSet(ex.id)}
                className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-emerald-300 hover:text-emerald-600 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Add Set
              </button>
            </div>
          </div>
        ))}

        <button 
          onClick={() => setActiveSubTab('library')}
          className="w-full py-6 bg-white border-2 border-dashed border-emerald-200 rounded-[32px] text-emerald-600 font-bold hover:bg-emerald-50 transition-all flex items-center justify-center gap-3 shadow-sm"
        >
          <Plus size={24} />
          Add Exercise
        </button>
      </div>
    </div>
  );
}

function TipCard({ title, content, icon }: { title: string, content: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-emerald-50 shadow-sm hover:shadow-md transition-shadow">
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
