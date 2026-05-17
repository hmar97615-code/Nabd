import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { analyzeInBodyScan } from '../lib/gemini';
import { doc, setDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

export default function InBodyScanner({ user, onUpdate }: { user: any, onUpdate: (u: any) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setAnalysis(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64String = (reader.result as string).split(',')[1];
        
        // 1. Analyze with Gemini
        const result = await analyzeInBodyScan(base64String);
        
        if (result && result.weight > 0) {
          setAnalysis(result);
          
          // 2. Upload image to Firebase Storage
          const storageRef = ref(storage, `inbody_scans/${user.uid}/${Date.now()}_${file.name}`);
          await uploadBytes(storageRef, file);
          const imageUrl = await getDownloadURL(storageRef);

          // 3. Update Firestore
          const scanData = {
            ...result,
            imageUrl,
            date: new Date().toISOString(),
            timestamp: serverTimestamp()
          };

          await addDoc(collection(db, 'users', user.uid, 'inbodyScans'), scanData);

          await updateDoc(doc(db, 'users', user.uid), {
            weight: result.weight
          });

          const todayStr = new Date().toISOString().split('T')[0];
          await setDoc(doc(db, 'users', user.uid, 'dailyLogs', todayStr), {
            weight: result.weight
          }, { merge: true });

          onUpdate({ ...user, weight: result.weight });
        } else {
          setError("Could not read data clearly. Please ensure the photo is clear.");
        }
      } catch (err: any) {
        console.error("Analysis error:", err);
        setError("An error occurred during image analysis. Please try again.");
      } finally {
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
      setError("An error occurred while reading the file.");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-2xl border border-primary-50 shadow-sm overflow-hidden p-6 md:p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
          <FileText size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-display font-bold text-slate-900">InBody Analysis</h3>
          <p className="text-slate-500">Upload your InBody scan photo to automatically update your weight and get personalized advice.</p>
        </div>
      </div>

      <div className="mb-8">
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full h-32 border-2 border-dashed border-primary-200 bg-primary-50/50 hover:bg-primary-50 text-primary-600 flex flex-col items-center justify-center gap-2 rounded-xl transition-all active:scale-95 disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin" size={32} />
              <span>Analyzing... this may take a few seconds</span>
            </>
          ) : (
            <>
              <Upload size={32} />
              <span className="font-medium text-lg">Click here to upload scan photo</span>
              <span className="text-sm text-primary-400">Supports JPG, PNG</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-xl flex items-start gap-3">
          <AlertCircle className="shrink-0 mt-0.5" size={20} />
          <p>{error}</p>
        </div>
      )}

      {analysis && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 font-medium">
            <CheckCircle2 size={20} />
            Your weight has been successfully updated to {analysis.weight} kg!
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <p className="text-slate-500 text-sm mb-1">Weight</p>
              <p className="text-2xl font-bold text-slate-900">{analysis.weight} <span className="text-sm font-normal text-slate-500">kg</span></p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <p className="text-slate-500 text-sm mb-1">Body Fat %</p>
              <p className="text-2xl font-bold text-slate-900">{analysis.bodyFatPercentage}%</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <p className="text-slate-500 text-sm mb-1">Muscle Mass</p>
              <p className="text-2xl font-bold text-slate-900">{analysis.skeletalMuscleMass} <span className="text-sm font-normal text-slate-500">kg</span></p>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <div className="p-5 bg-orange-50/50 border border-orange-100 rounded-2xl">
              <h4 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                Fat Analysis & Reduction Tips
              </h4>
              <p className="text-orange-900/80 leading-relaxed text-sm">{analysis.fatAnalysis}</p>
            </div>

            <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl">
              <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Muscle Analysis & Weak Points
              </h4>
              <p className="text-blue-900/80 leading-relaxed text-sm">{analysis.muscleAnalysis}</p>
            </div>

            <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
              <h4 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                General Advice & Practical Steps
              </h4>
              <p className="text-emerald-900/80 leading-relaxed text-sm">{analysis.generalAdvice}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
