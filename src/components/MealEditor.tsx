import React, { useState, useRef, useEffect } from 'react';
import { Camera, Plus, Barcode, Upload, Type, X, Loader2, Check, AlertCircle, Trash2, ArrowRight, Utensils, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeFoodImage, analyzeFoodText, scanNutritionLabel } from '../lib/gemini';
import { Html5QrcodeScanner } from 'html5-qrcode';

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

type InputMode = 'manual' | 'camera' | 'gallery' | 'scanner';

export default function MealEditor({ meal, user, onUpdate, onSave, onCancel, onDelete }: { meal: any, user?: any, onUpdate?: (u: any) => void, onSave: (meal: any) => void, onCancel: () => void, onDelete?: (id: string) => void }) {
  const [mode, setMode] = useState<InputMode | null>(meal ? 'manual' : null);
  const [mealName, setMealName] = useState(meal?.name || '');
  const [weight, setWeight] = useState(meal?.weight || '');
  const [unit, setUnit] = useState(meal?.unit || 'g');
  const [calories, setCalories] = useState(meal?.calories || 0);
  const [protein, setProtein] = useState(meal?.protein || 0);
  const [carbs, setCarbs] = useState(meal?.carbs || 0);
  const [fats, setFats] = useState(meal?.fats || 0);
  const [ingredients, setIngredients] = useState<{name: string, weight: number}[]>(meal?.ingredients || []);
  
  const [images, setImages] = useState<string[]>([]);
  const [barcode, setBarcode] = useState('');
  const [manualProductName, setManualProductName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useReference, setUseReference] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Scanner state
  const [isScannerActive, setIsScannerActive] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (mode === 'scanner' && !isScannerActive) {
      startScanner();
    }
    return () => {
      stopScanner();
      stopCamera();
    };
  }, [mode]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      setError("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        setImages([...images, base64]);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          setImages(prev => [...prev, base64]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const startScanner = () => {
    setIsScannerActive(true);
    setTimeout(() => {
      const element = document.getElementById("qr-reader");
      if (!element) return;

      try {
        const scanner = new Html5QrcodeScanner(
          "qr-reader",
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false
        );
        scanner.render(onScanSuccess, onScanFailure);
        scannerRef.current = scanner;
      } catch (err) {
        setError("Failed to start scanner. Please ensure camera permissions are granted.");
      }
    }, 100);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      scannerRef.current = null;
    }
    setIsScannerActive(false);
  };

  const onScanSuccess = async (decodedText: string) => {
    setBarcode(decodedText);
    stopScanner();
    
    setIsProcessing(true);
    setError(null);
    try {
      const result = await scanNutritionLabel([], decodedText, manualProductName);
      if (result) {
        setMealName(result.name || `Product ${decodedText}`);
        setCalories(result.calories || 0);
        setProtein(result.protein || 0);
        setCarbs(result.carbs || 0);
        setFats(result.fats || 0);
        if (result.ingredients) {
          setIngredients(result.ingredients);
          const totalWeight = result.ingredients.reduce((sum: number, ing: any) => sum + (ing.weight || 0), 0);
          setWeight(totalWeight);
        }
        setMode('manual');
      }
    } catch (err) {
      console.error("AI Analysis Error:", err);
      setError("فشل تحليل الذكاء الاصطناعي. يرجى المحاولة مرة أخرى أو الإدخال يدويًا.");
    } finally {
      setIsProcessing(false);
    }
  };

  const onScanFailure = (error: any) => {};

  const handleAIAnalysis = async () => {
    if (images.length === 0 && mode !== 'manual' && mode !== 'scanner') {
      setError("Please provide at least one image.");
      return;
    }

    if (mode === 'scanner' && images.length === 0 && !barcode && !manualProductName) {
      setError("Please provide an image, barcode, or product name.");
      return;
    }

    const cost = 5;
    if (user && (user.credits || 0) < cost) {
      setError(`Insufficient balance. You need ${cost} points for AI analysis.`);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      let result;
      if (mode === 'camera' || mode === 'gallery') {
        const promptSuffix = useReference ? " (A reference object like a coin or card is present for scale)" : "";
        // Pass barcode and product name if available for better accuracy
        const enhancedMealName = manualProductName ? `${manualProductName} (${mealName})` : mealName;
        const enhancedIngredients = barcode ? `Barcode: ${barcode}. ${ingredients.map(i => `${i.name} ${i.weight}g`).join(', ')}` : ingredients.map(i => `${i.name} ${i.weight}g`).join(', ');
        result = await analyzeFoodImage(images, enhancedMealName, enhancedIngredients + promptSuffix);
      } else if (mode === 'manual' && mealName) {
        result = await analyzeFoodText(mealName);
      } else if (mode === 'scanner') {
        result = await scanNutritionLabel(images, barcode, manualProductName);
      }

      if (result) {
        setMealName(result.name || mealName);
        setCalories(result.calories || 0);
        setProtein(result.protein || 0);
        setCarbs(result.carbs || 0);
        setFats(result.fats || 0);
        if (result.ingredients) {
          setIngredients(result.ingredients);
          const totalWeight = result.ingredients.reduce((sum: number, ing: any) => sum + (ing.weight || 0), 0);
          setWeight(totalWeight);
        }
        
        // Deduct points
        if (user && onUpdate) {
          const newCredits = (user.credits || 0) - cost;
          await updateDoc(doc(db, 'users', user.uid), { credits: newCredits });
          onUpdate({ ...user, credits: newCredits });
        }
        
        setMode('manual');
      }
    } catch (err) {
      console.error("AI Analysis Error:", err);
      setError("فشل تحليل الذكاء الاصطناعي. يرجى المحاولة مرة أخرى أو الإدخال يدويًا.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', weight: 0 }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, field: 'name' | 'weight', value: string | number) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
    
    // Update total weight
    if (field === 'weight') {
      const totalWeight = newIngredients.reduce((sum, ing) => sum + (Number(ing.weight) || 0), 0);
      setWeight(totalWeight);
    }
  };

  const handleRecalculateMacros = async () => {
    if (ingredients.length === 0) return;
    
    setIsProcessing(true);
    setError(null);
    try {
      const ingredientsStr = ingredients.map(ing => `${ing.weight}g ${ing.name}`).join(', ');
      const result = await analyzeFoodText(mealName, ingredientsStr);
      if (result) {
        setCalories(result.calories || 0);
        setProtein(result.protein || 0);
        setCarbs(result.carbs || 0);
        setFats(result.fats || 0);
        if (result.ingredients) {
          setIngredients(result.ingredients);
          const totalWeight = result.ingredients.reduce((sum: number, ing: any) => sum + (ing.weight || 0), 0);
          setWeight(totalWeight);
        }
      }
    } catch (err) {
      console.error("Recalculation Error:", err);
      setError("فشلت عملية إعادة الحساب. يرجى التحقق من المكونات.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalSave = () => {
    if (!mealName) {
      setError("Meal name is required.");
      return;
    }
    const mealData: any = {
      name: mealName,
      weight: Number(weight),
      unit,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fats: Number(fats),
      ingredients: ingredients.filter(ing => ing.name && ing.weight > 0)
    };
    if (images.length > 0) mealData.images = images;
    onSave(mealData);
  };

  const modes = [
    { 
      id: 'manual', 
      icon: Type, 
      label: 'Manual Entry', 
      desc: 'Type your meal name and let AI estimate the nutrition.',
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      id: 'camera', 
      icon: Camera, 
      label: 'Smart Camera', 
      desc: 'Snap a photo of your plate for instant AI analysis.',
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    { 
      id: 'gallery', 
      icon: Upload, 
      label: 'Photo Gallery', 
      desc: 'Upload existing photos of your meals from your device.',
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    { 
      id: 'scanner', 
      icon: Barcode, 
      label: 'Barcode Scanner', 
      desc: 'Scan product barcodes or nutrition labels directly.',
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  if (!mode) {
    return (
      <div className="space-y-8 py-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-display font-black text-slate-900">How would you like to log?</h2>
          <p className="text-slate-500 font-medium">Choose your preferred method to track your nutrition.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {modes.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode(item.id as InputMode)}
              className="flex flex-col items-start p-6 bg-white border border-slate-100 rounded-[32px] shadow-xl shadow-slate-200/40 text-left group transition-all hover:border-slate-200"
            >
              <div className={`w-14 h-14 ${item.lightColor} ${item.textColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon size={28} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-1">{item.label}</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </motion.button>
          ))}
        </div>

        <div className="pt-4">
          <button 
            onClick={onCancel}
            className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
          >
            Cancel and Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <button 
          onClick={() => {
            setMode(null);
            stopCamera();
            stopScanner();
            setError(null);
          }}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-sm"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Change Method
        </button>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${modes.find(m => m.id === mode)?.color}`} />
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">
            {modes.find(m => m.id === mode)?.label}
          </span>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode Content */}
      <div className="min-h-[300px]">
        {mode === 'camera' && (
          <div className="space-y-6">
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <h4 className="text-sm font-black text-emerald-900 mb-1">📸 Instructions:</h4>
              <ul className="text-xs text-emerald-800 space-y-1 list-disc list-inside font-medium">
                <li>Place your meal in a well-lit area.</li>
                <li>Take photos from different angles for better accuracy.</li>
                <li>Include a common object (like a coin) for scale if possible.</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Manual Barcode (Optional)</label>
                <input 
                  type="text" 
                  value={barcode}
                  onChange={e => setBarcode(e.target.value)}
                  placeholder="e.g. 012345678901"
                  className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Product Name (Optional)</label>
                <input 
                  type="text" 
                  value={manualProductName}
                  onChange={e => setManualProductName(e.target.value)}
                  placeholder="e.g. Greek Yogurt"
                  className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold"
                />
              </div>
            </div>

            <div className="relative aspect-square bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
              {!isCameraActive ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white">
                    <Camera size={40} />
                  </div>
                  <button 
                    onClick={startCamera}
                    className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-slate-100 transition-all shadow-xl"
                  >
                    Open Camera
                  </button>
                </div>
              ) : (
                <>
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                    <button 
                      onClick={capturePhoto}
                      className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur-md hover:bg-white/40 transition-all active:scale-90"
                    >
                      <div className="w-14 h-14 rounded-full bg-white shadow-lg" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {mode === 'gallery' && (
          <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
              <h4 className="text-sm font-black text-purple-900 mb-1">🖼️ Instructions:</h4>
              <p className="text-xs text-purple-800 font-medium">
                Select one or more photos of your meal from your gallery. AI will analyze them to estimate portions and nutrients.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Manual Barcode (Optional)</label>
                <input 
                  type="text" 
                  value={barcode}
                  onChange={e => setBarcode(e.target.value)}
                  placeholder="e.g. 012345678901"
                  className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-purple-500 outline-none transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Product Name (Optional)</label>
                <input 
                  type="text" 
                  value={manualProductName}
                  onChange={e => setManualProductName(e.target.value)}
                  placeholder="e.g. Greek Yogurt"
                  className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-purple-500 outline-none transition-all font-bold"
                />
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-12 border-4 border-dashed border-slate-100 rounded-[40px] bg-slate-50/50 group hover:bg-slate-50 transition-all">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                <Upload size={40} />
              </div>
              <p className="text-lg font-black text-slate-900 mb-2">Drop photos here</p>
              <p className="text-sm text-slate-500 mb-6 text-center font-medium">or click to browse your device</p>
              <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" id="file-upload" />
              <label 
                htmlFor="file-upload"
                className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-black cursor-pointer hover:bg-purple-700 transition-all shadow-xl shadow-purple-200"
              >
                Choose Photos
              </label>
            </div>
          </div>
        )}

        {mode === 'scanner' && (
          <div className="space-y-6">
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
              <h4 className="text-sm font-black text-orange-900 mb-1">🔍 Instructions:</h4>
              <p className="text-xs text-orange-800 font-medium">
                Point your camera at a product barcode or the nutrition facts table. You can also enter the barcode or product name manually for better accuracy.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Barcode / الباركود</label>
                <input 
                  type="text" 
                  value={barcode}
                  onChange={e => setBarcode(e.target.value)}
                  placeholder="e.g. 012345678901"
                  className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-orange-500 outline-none transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Product Name / اسم المنتج</label>
                <input 
                  type="text" 
                  value={manualProductName}
                  onChange={e => setManualProductName(e.target.value)}
                  placeholder="e.g. Greek Yogurt"
                  className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-orange-500 outline-none transition-all font-bold"
                />
              </div>
            </div>

            <div id="qr-reader" className="rounded-[40px] overflow-hidden border-8 border-white shadow-2xl" />
            
            <div className="flex flex-col items-center justify-center p-8 border-4 border-dashed border-slate-100 rounded-[40px] bg-slate-50/50 group hover:bg-slate-50 transition-all">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-orange-500 mb-4 group-hover:scale-110 transition-transform">
                <Upload size={32} />
              </div>
              <p className="text-sm font-black text-slate-900 mb-1">Upload Nutrition Label Photo</p>
              <p className="text-xs text-slate-500 mb-4 text-center font-medium">Snap a clear photo of the nutrition facts table</p>
              <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" id="label-upload" />
              <label 
                htmlFor="label-upload"
                className="bg-orange-600 text-white px-6 py-3 rounded-xl font-black cursor-pointer hover:bg-orange-700 transition-all shadow-lg"
              >
                Choose Photo
              </label>
            </div>
          </div>
        )}

        {mode === 'manual' && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <h4 className="text-sm font-black text-blue-900 mb-1">✍️ Instructions:</h4>
              <p className="text-xs text-blue-800 font-medium">
                Enter the meal name and portion size. Click "Analyze" to let AI fill in the nutritional details for you.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Meal Description</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={mealName}
                    onChange={e => setMealName(e.target.value)}
                    placeholder="e.g., 200g Grilled Salmon with Asparagus"
                    className="w-full pl-6 pr-32 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-lg"
                  />
                  <button
                    onClick={handleAIAnalysis}
                    disabled={isProcessing || !mealName}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg"
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'AI Analyze'}
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Portion Size</label>
                  <div className="flex">
                    <input 
                      type="number" 
                      value={weight}
                      onChange={e => setWeight(e.target.value)}
                      placeholder="0"
                      className="w-full px-6 py-4 rounded-l-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold"
                    />
                    <select 
                      value={unit} 
                      onChange={e => setUnit(e.target.value)}
                      className="px-4 py-4 rounded-r-2xl border border-l-0 border-slate-100 bg-slate-100 text-sm font-black text-slate-700 outline-none"
                    >
                      <option value="g">g</option>
                      <option value="spoon">spoon</option>
                      <option value="cup">cup</option>
                      <option value="oz">oz</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Calories</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={calories}
                      onChange={e => setCalories(e.target.value)}
                      placeholder="0"
                      className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-orange-500 outline-none transition-all font-black text-xl text-orange-600"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300 uppercase">kcal</span>
                  </div>
                </div>
              </div>

              {/* Ingredients Section */}
              <div className="space-y-4 p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-emerald-500" />
                    Meal Ingredients
                  </h3>
                  <button 
                    onClick={handleAddIngredient}
                    className="text-xs font-black text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Ingredient
                  </button>
                </div>
                
                <div className="space-y-3">
                  {ingredients.map((ing, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        type="text"
                        value={ing.name}
                        onChange={e => handleIngredientChange(idx, 'name', e.target.value)}
                        placeholder="Ingredient name"
                        className="flex-1 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-bold focus:border-emerald-500 outline-none transition-all"
                      />
                      <div className="relative w-24">
                        <input 
                          type="number"
                          value={ing.weight}
                          onChange={e => handleIngredientChange(idx, 'weight', Number(e.target.value))}
                          placeholder="0"
                          className="w-full px-3 py-2 pr-6 rounded-xl border border-slate-200 bg-white text-sm font-bold focus:border-emerald-500 outline-none transition-all text-right"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">g</span>
                      </div>
                      <button 
                        onClick={() => handleRemoveIngredient(idx)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {ingredients.length > 0 && (
                    <button
                      onClick={handleRecalculateMacros}
                      disabled={isProcessing}
                      className="w-full py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black hover:bg-emerald-100 transition-all flex items-center justify-center gap-2 mt-2"
                    >
                      <RefreshCw className={`w-3 h-3 ${isProcessing ? 'animate-spin' : ''}`} />
                      {isProcessing ? 'Recalculating...' : 'Recalculate Macros from Ingredients'}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Protein', value: protein, setter: setProtein, color: 'text-emerald-600', border: 'focus:border-emerald-500' },
                  { label: 'Carbs', value: carbs, setter: setCarbs, color: 'text-blue-600', border: 'focus:border-blue-500' },
                  { label: 'Fats', value: fats, setter: setFats, color: 'text-amber-600', border: 'focus:border-amber-500' }
                ].map((macro) => (
                  <div key={macro.label} className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">{macro.label}</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={macro.value}
                        onChange={e => macro.setter(Number(e.target.value))}
                        className={`w-full px-3 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white ${macro.border} outline-none text-center font-black ${macro.color}`}
                      />
                      <span className="absolute bottom-1 left-0 right-0 text-[8px] font-black text-slate-300 uppercase text-center">grams</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Preview List */}
      {images.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900">Captured Photos ({images.length})</h3>
            <button onClick={() => setImages([])} className="text-xs text-red-500 font-black flex items-center gap-1 hover:underline">
              <Trash2 className="w-3 h-3" /> Clear All
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {images.map((img, idx) => (
              <motion.div 
                key={idx} 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-lg"
              >
                <img src={`data:image/jpeg;base64,${img}`} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 bg-black/50 text-white p-1.5 rounded-full backdrop-blur-md"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
            <button 
              onClick={() => mode === 'camera' ? capturePhoto() : document.getElementById('file-upload')?.click()}
              className="shrink-0 w-24 h-24 rounded-2xl border-4 border-dashed border-slate-100 flex items-center justify-center text-slate-300 hover:bg-slate-50 hover:text-slate-400 transition-all"
            >
              <Plus className="w-8 h-8" />
            </button>
          </div>

          {/* Reference Object Toggle */}
          <button 
            onClick={() => setUseReference(!useReference)}
            className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${
              useReference ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-white'
            }`}
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              useReference ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200'
            }`}>
              {useReference && <Check className="w-4 h-4" />}
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-slate-900">Using Reference Object</p>
              <p className="text-xs text-slate-500 font-medium">I placed a coin or card next to the food for scale.</p>
            </div>
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100">
        {meal && onDelete && (
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="px-6 py-4 rounded-2xl border-2 border-red-100 bg-red-50 font-black text-red-600 hover:bg-red-100 transition-all flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Delete
          </button>
        )}
        
        {mode !== 'manual' ? (
          <button 
            onClick={handleAIAnalysis}
            disabled={isProcessing || (images.length === 0 && !barcode && !manualProductName)}
            className="flex-1 px-8 py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-2xl shadow-slate-200 active:scale-95 transition-all"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                AI Analyzing...
              </>
            ) : (
              <>
                Analyze with AI
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>
        ) : (
          <button 
            onClick={handleFinalSave}
            className="flex-1 px-8 py-4 rounded-2xl bg-emerald-600 text-white font-black hover:bg-emerald-700 shadow-2xl shadow-emerald-200 active:scale-95 transition-all"
          >
            Save Meal Log
          </button>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[120] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Trash2 size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900 text-center mb-2">Delete Meal?</h3>
              <p className="text-slate-500 text-center mb-8">
                Are you sure you want to delete this meal? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button 
                  type="button"
                  className="flex-1 py-4 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-200"
                  onClick={() => {
                    if (onDelete) onDelete(meal.id);
                    setShowDeleteConfirm(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
