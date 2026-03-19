import React, { useState, useEffect } from 'react';
import { 
  Utensils, 
  Camera, 
  RefreshCw, 
  CheckCircle2, 
  Plus, 
  Activity, 
  ChevronRight,
  Apple,
  Info,
  Trash2,
  Clock,
  Flame,
  Scale,
  Barcode,
  BookOpen
} from 'lucide-react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { motion, AnimatePresence } from 'motion/react';
import { db, OperationType, handleFirestoreError } from '../firebase';
import { calculatePlanDetails } from '../lib/planUtils';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { SCIENCE_BASED_DIETS, DietProtocol } from '../constants/dietProtocols';
import { 
  analyzeFoodImage, 
  analyzeFoodText, 
  getMealIngredients, 
  generateNutritionPlan, 
  replaceMeal,
  scanNutritionLabel
} from '../lib/gemini';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  height?: number;
  weight?: number;
  gender?: 'male' | 'female' | 'other';
  nationality?: string;
  age?: number;
  healthStatus?: string;
  dietaryPreferences?: string;
  goal?: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'fitness';
  budgetLevel?: 'low' | 'medium' | 'high';
  role: 'user' | 'coach' | 'admin';
  playsSports?: boolean;
  selectedSports?: { sportId: string, goalIds: string[] }[];
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  targetWeight?: number;
  targetDate?: string;
  targetCalories?: number;
}

interface Meal {
  mealType: string;
  name: string;
  calories: number;
  description: string;
  protein: number;
  carbs: number;
  fats: number;
  consumed?: boolean;
}

interface NutritionPlanData {
  planTitle: string;
  meals: Meal[];
  totalMacros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  targetCalories: number;
  createdAt: any;
}

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button = ({ children, className, variant = 'primary', size = 'md', type = 'button', ...props }: any) => {
  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
    secondary: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
    outline: 'border border-slate-200 text-slate-600 hover:bg-slate-50',
    ghost: 'text-slate-500 hover:bg-slate-50',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg font-medium',
  };
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-xl transition-all active:scale-95 disabled:opacity-50 ${variants[variant as keyof typeof variants]} ${sizes[size as keyof typeof sizes]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default function NutritionModule({ user }: { user: UserProfile }) {
  const [activeTab, setActiveTab] = useState<'log' | 'plan'>('log');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Nutrition & Diet / التغذية والنظام الغذائي</h1>
          <p className="text-slate-500">AI-powered meal tracking and personalized nutrition plans.</p>
        </div>
        <div className="bg-slate-100 p-1 rounded-xl inline-flex">
          <button
            onClick={() => setActiveTab('log')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'log' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Log Meal / تسجيل وجبة
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'plan' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Nutrition Plan / خطة التغذية
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'log' ? (
          <MealLogger key="logger" user={user} />
        ) : (
          <NutritionPlan key="plan" user={user} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MealLogger({ user }: { user: UserProfile }) {
  const [images, setImages] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [mealName, setMealName] = useState('');
  const [totalWeight, setTotalWeight] = useState('');
  const [ingredients, setIngredients] = useState<{ name: string, weight: number }[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [scanningLoading, setScanningLoading] = useState(false);
  
  const [isLiveCamera, setIsLiveCamera] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      setIsLiveCamera(true);
    } catch (err: any) {
      console.warn("Camera access failed:", err);
      setIsLiveCamera(false);
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.message?.includes('Permission denied')) {
        setError("تم رفض الوصول للكاميرا. يرجى السماح بصلاحيات الكاميرا من إعدادات المتصفح (أيقونة القفل بجانب الرابط أعلى الشاشة) ثم تحديث الصفحة. إذا استمرت المشكلة، جرب فتح التطبيق في نافذة جديدة.");
      } else if (err.name === 'NotFoundError') {
        setError("لم يتم العثور على كاميرا في هذا الجهاز.");
      } else {
        setError("تعذر الوصول للكاميرا. يرجى التأكد من عدم استخدام الكاميرا في تطبيق آخر.");
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsLiveCamera(false);
  };

  useEffect(() => {
    if (isLiveCamera && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isLiveCamera]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setImages(prev => [...prev, dataUrl]);
        stopCamera();
      }
    }
  };

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    if (isScanning) {
      scanner = new Html5QrcodeScanner(
        "reader",
        { 
          fps: 10, 
          qrbox: { width: 280, height: 150 }, // Wider box for barcodes
          aspectRatio: 1.0,
          formatsToSupport: [
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.QR_CODE
          ]
        },
        /* verbose= */ false
      );
      scanner.render(onScanSuccess, onScanFailure);
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(error => console.error("Failed to clear scanner", error));
      }
    };
  }, [isScanning]);

  async function handleManualBarcodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onScanSuccess(manualBarcode.trim());
    }
  }

  async function onScanSuccess(decodedText: string) {
    setIsScanning(false);
    setManualBarcode('');
    setScanningLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${decodedText}.json`);
      const data = await response.json();
      
      if (data.status === 1) {
        const product = data.product;
        setMealName(product.product_name || product.generic_name || 'Unknown Product');
        
        // Try to extract nutritional info
        const nutriments = product.nutriments;
        if (nutriments) {
          const calories = nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0;
          const protein = nutriments.proteins_100g || nutriments.proteins || 0;
          const carbs = nutriments.carbohydrates_100g || nutriments.carbohydrates || 0;
          const fats = nutriments.fat_100g || nutriments.fat || 0;
          
          setResult({
            name: product.product_name || 'Scanned Product',
            calories: Math.round(calories),
            protein: Math.round(protein),
            carbs: Math.round(carbs),
            fats: Math.round(fats),
            ingredients: []
          });
          
          // Set total weight if available
          if (product.net_weight_unit === 'g' && product.net_weight_value) {
            setTotalWeight(product.net_weight_value.toString());
          }
        }
      } else {
        setError('Product not found in database. Please use "Scan Label" to read the nutrition facts directly from the package. / المنتج غير موجود. يرجى استخدام "مسح الملصق" لقراءة الحقائق الغذائية من العبوة.');
      }
    } catch (err) {
      console.error('Barcode scan error:', err);
      setError('Failed to fetch product info. Please try "Scan Label" instead. / فشل في جلب معلومات المنتج. يرجى تجربة "مسح الملصق".');
    } finally {
      setScanningLoading(false);
    }
  }

  function onScanFailure(error: any) {
    // console.warn(`Code scan error = ${error}`);
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && images.length < 3) {
      const reader = new FileReader();
      reader.onloadend = () => setImages(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const [error, setError] = useState<string | null>(null);
  const [fetchingIngredients, setFetchingIngredients] = useState(false);

  const handleFetchIngredients = async () => {
    if (!mealName && images.length === 0) {
      setError('Please provide a meal name or at least one image. / يرجى تقديم اسم الوجبة أو صورة واحدة على الأقل.');
      return;
    }
    setFetchingIngredients(true);
    setError(null);
    try {
      const weight = totalWeight ? parseFloat(totalWeight) : undefined;
      const processedImages = await Promise.all(images.map(img => processImage(img)));
      const fetchedIngredients = await getMealIngredients(mealName, weight, processedImages);
      setIngredients(fetchedIngredients);
      
      // If AI estimated a weight, we could update it here if the API returned it, 
      // but for now we just update the ingredients list.
    } catch (err) {
      console.error('Failed to fetch ingredients:', err);
      setError('Failed to extract ingredients. Please try again.');
    } finally {
      setFetchingIngredients(false);
    }
  };

  const processImage = async (imgSrc: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imgSrc;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1024;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) { height = (maxDim / width) * height; width = maxDim; }
          else { width = (maxDim / height) * width; height = maxDim; }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8).split(',')[1]);
      };
    });
  };

  const labelFileInputRef = React.useRef<HTMLInputElement>(null);

  const handleNutritionLabelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    setError(null);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Img = reader.result as string;
          const processedImg = await processImage(base64Img);
          const data = await scanNutritionLabel([processedImg]);
          
          if (data && data.calories) {
            setResult({ ...data, ingredients: [] });
            setMealName(data.name || mealName);
          } else {
            setError('Could not read nutrition label. Please ensure the photo is clear. / لم نتمكن من قراءة ملصق التغذية. يرجى التأكد من وضوح الصورة.');
          }
        } catch (err) {
          console.error('Label scan error:', err);
          setError('Failed to read nutrition label. / فشل قراءة ملصق التغذية.');
        } finally {
          setAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File read error:', err);
      setError('Failed to process image. / فشل معالجة الصورة.');
      setAnalyzing(false);
    }
  };

  const handleIngredientChange = (index: number, field: 'name' | 'weight', value: string | number) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', weight: 100 }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError(null);
    try {
      let data;
      const ingredientsStr = ingredients.length > 0 
        ? ingredients.map(i => `${i.name}: ${i.weight}g`).join(', ') 
        : (totalWeight ? `Total weight: ${totalWeight}g` : '');
      
      if (images.length > 0) {
        const processedImages = await Promise.all(images.map(img => processImage(img)));
        data = await analyzeFoodImage(processedImages, mealName, ingredientsStr);
      } else {
        data = await analyzeFoodText(mealName, ingredientsStr);
      }
      setResult(data);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const saveMeal = async () => {
    if (!result) return;
    setError(null);
    try {
      const today = new Date().toISOString().split('T')[0];
      const logRef = doc(db, 'users', user.uid, 'dailyLogs', today);
      const logDoc = await getDoc(logRef);
      
      if (logDoc.exists()) {
        const currentData = logDoc.data();
        await updateDoc(logRef, {
          meals: [...(currentData.meals || []), result],
          totalCalories: (currentData.totalCalories || 0) + result.calories
        });
      } else {
        await setDoc(logRef, {
          date: today,
          meals: [result],
          totalCalories: result.calories,
          waterIntake: 0,
          createdAt: serverTimestamp()
        });
      }
      setResult(null);
      setImages([]);
      setMealName('');
      setTotalWeight('');
      setIngredients([]);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}/dailyLogs`);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Meal Details / تفاصيل الوجبة</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Meal Name / اسم الوجبة</label>
              <input 
                type="text" 
                value={mealName}
                onChange={e => setMealName(e.target.value)}
                placeholder="e.g. Grilled Chicken with Rice / دجاج مشوي مع أرز"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Total Weight (Recommended) / الوزن الكلي (يفضل إدخاله)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={totalWeight}
                  onChange={e => setTotalWeight(e.target.value)}
                  placeholder="e.g. 300"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-lg"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">g</span>
              </div>
              {!totalWeight && (
                <p className="text-[10px] text-orange-600 font-medium bg-orange-50 p-2 rounded-lg border border-orange-100">
                  If weight is unknown, please take photos from multiple angles (top and side) for better AI estimation.
                  <br />
                  إذا كان الوزن غير معروف، يرجى تصوير الطبق من عدة زوايا (من الأعلى ومن الجانب) لتقدير أفضل بالذكاء الاصطناعي.
                </p>
              )}
            </div>

            <Button 
              onClick={handleFetchIngredients} 
              disabled={(images.length === 0 && !mealName) || fetchingIngredients}
              variant={ingredients.length > 0 ? "secondary" : "primary"}
              className="w-full py-3 shadow-sm"
            >
              {fetchingIngredients ? (
                <><RefreshCw className="animate-spin mr-2" size={18} /> Extracting... / جاري الاستخراج...</>
              ) : (
                <><Apple className="mr-2" size={18} /> Extract Ingredients / استخراج المكونات</>
              )}
            </Button>

            <div className="space-y-3 mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase">Ingredients (g) / المكونات (جرام)</label>
              </div>
              
              {ingredients.length > 0 ? (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 mb-2">Adjust the weights in grams for accurate nutritional analysis.</p>
                  {ingredients.map((ing, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input 
                        type="text" 
                        value={ing.name}
                        onChange={e => handleIngredientChange(idx, 'name', e.target.value)}
                        placeholder="Ingredient name"
                        className="flex-[2] px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                      <div className="flex-1 relative">
                        <input 
                          type="number" 
                          value={ing.weight}
                          onChange={e => handleIngredientChange(idx, 'weight', parseFloat(e.target.value) || 0)}
                          placeholder="Weight"
                          className="w-full px-3 py-2 pr-8 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">g</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeIngredient(idx)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  
                  <button 
                    type="button"
                    onClick={addIngredient}
                    className="flex items-center justify-center w-full gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 py-3 rounded-xl mt-4 transition-colors"
                  >
                    <Plus size={18} /> Add Another Ingredient / إضافة مكون آخر
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-sm text-slate-500">
                    Type a meal name and click "Extract Ingredients" to get a precise, science-based recipe breakdown.
                    <br />
                    اكتب اسم الوجبة واضغط على "استخراج المكونات" للحصول على تفصيل دقيق مبني على أسس علمية.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        <div className="space-y-8">
          {/* Section 1: Photo Analysis */}
          <Card className="p-6 border-2 border-emerald-100 bg-white shadow-sm">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                <Camera size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">تصوير الوجبات / Meal Photography</h3>
                <p className="text-xs text-slate-500">التقط صوراً لوجبتك للتحليل الذكي</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
              <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                <Info size={16} />
                إرشادات التصوير (للحصول على أدق نتيجة):
              </h4>
              <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                <li>الصورة الأولى: صورة واضحة للوجبة من الأعلى.</li>
                <li>الصورة الثانية: صورة من الجانب لإظهار عمق الطبق.</li>
                <li>الصورة الثالثة: صورة مع وضع شيء مرجعي (مثل ملعقة أو يدك) لمعرفة أبعاد الطبق.</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square group">
                  <img src={img} className="w-full h-full object-cover rounded-2xl border border-slate-200" />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)} 
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {images.length < 3 && !isLiveCamera && (
                <>
                  <button 
                    type="button"
                    onClick={startCamera}
                    className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-emerald-200 rounded-2xl aspect-square hover:bg-emerald-50 transition-all group"
                  >
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      <Camera size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider text-center">كاميرا<br/>Camera</span>
                  </button>
                  <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl aspect-square hover:bg-slate-50 transition-all group">
                    <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      <Plus size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider text-center">معرض الصور<br/>Gallery</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </>
              )}
            </div>

            {isLiveCamera && (
              <div className="mb-6 space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-black aspect-video">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={capturePhoto} variant="primary" className="flex-1 py-3">
                    <Camera className="mr-2" size={20} /> التقاط / Capture
                  </Button>
                  <Button onClick={stopCamera} variant="outline" className="px-6">
                    إلغاء / Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Section 2: Barcode & Label Scanning */}
          <Card className="p-6 border-2 border-blue-100 bg-white shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <Barcode size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">مسح المنتجات / Product Scanner</h3>
                <p className="text-xs text-slate-500">امسح الباركود أو ملصق التغذية للمنتجات المعلبة</p>
              </div>
            </div>

            {isScanning ? (
              <div className="space-y-4">
                <div id="reader" className="w-full rounded-2xl overflow-hidden border border-slate-200"></div>
                <div className="flex gap-2">
                  <Button onClick={() => setIsScanning(false)} variant="outline" className="flex-1">
                    Cancel / إلغاء
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => setIsScanning(true)} 
                    variant="secondary" 
                    className="w-full py-6 bg-blue-50 text-blue-700 hover:bg-blue-100 border-none text-sm font-bold"
                    disabled={scanningLoading || analyzing}
                  >
                    {scanningLoading ? <RefreshCw className="animate-spin mr-2" size={20} /> : <Barcode className="mr-2" size={20} />}
                    مسح الباركود<br/>Scan Barcode
                  </Button>
                  
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment" 
                    className="hidden" 
                    ref={labelFileInputRef}
                    onChange={handleNutritionLabelUpload} 
                  />
                  <Button 
                    onClick={() => labelFileInputRef.current?.click()} 
                    variant="secondary" 
                    className="w-full py-6 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none text-sm font-bold"
                    disabled={analyzing || scanningLoading}
                  >
                    {analyzing ? <RefreshCw className="animate-spin mr-2" size={20} /> : <Camera className="mr-2" size={20} />}
                    مسح ملصق التغذية<br/>Scan Nutrition Label
                  </Button>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-100"></span>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                    <span className="bg-white px-4 text-slate-400 font-bold">Or Enter Manually / أو أدخل يدوياً</span>
                  </div>
                </div>

                <form onSubmit={handleManualBarcodeSubmit} className="flex gap-2">
                  <input 
                    type="text" 
                    value={manualBarcode}
                    onChange={(e) => setManualBarcode(e.target.value)}
                    placeholder="Enter Barcode Number / أدخل رقم الباركود"
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
                  />
                  <Button type="submit" variant="primary" className="px-8">
                    Go
                  </Button>
                </form>
              </div>
            )}
          </Card>
        </div>

        <Button 
          onClick={handleAnalyze} 
          disabled={analyzing || (mealName === '' && images.length === 0)} 
          className="w-full py-4 text-lg"
        >
          {analyzing ? <RefreshCw className="animate-spin mr-2" /> : <Activity className="mr-2" />}
          {analyzing ? "Analyzing..." : "Analyze with AI / تحليل بالذكاء الاصطناعي"}
        </Button>
      </div>

      <Card className="p-8 flex flex-col">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Analysis Result / نتيجة التحليل</h3>
        {result ? (
          <div className="space-y-6 flex-1">
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
              <h4 className="text-lg font-bold text-emerald-900 mb-1">{result.name}</h4>
              <p className="text-5xl font-bold text-emerald-600">{result.calories}</p>
              <p className="text-sm font-medium text-emerald-400 uppercase tracking-widest">Calories / سعرة حرارية</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <MacroStat label="Protein" value={result.protein} unit="g" color="text-blue-600" />
              <MacroStat label="Carbs" value={result.carbs} unit="g" color="text-orange-600" />
              <MacroStat label="Fats" value={result.fats} unit="g" color="text-yellow-600" />
            </div>
            <Button onClick={saveMeal} className="w-full py-4 mt-auto">Log This Meal / تسجيل الوجبة</Button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
            <Utensils size={64} className="mb-4 opacity-10" />
            <p className="text-center max-w-[200px]">Provide details to see nutritional breakdown</p>
          </div>
        )}
      </Card>
    </div>
  );
}

function MacroStat({ label, value, unit, color }: { label: string, value: number, unit: string, color: string }) {
  return (
    <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}{unit}</p>
    </div>
  );
}

function NutritionPlan({ user }: { user: UserProfile }) {
  const [plan, setPlan] = useState<NutritionPlanData | null>(null);
  const [planMode, setPlanMode] = useState<'ai' | 'protocols'>('ai');
  const [selectedProtocol, setSelectedProtocol] = useState<DietProtocol | null>(null);
  const [loading, setLoading] = useState(false);
  const [targetCalories, setTargetCalories] = useState(2000);
  const [replacingMealIdx, setReplacingMealIdx] = useState<number | null>(null);
  const [constraints, setConstraints] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    // Calculate target calories using shared utility
    const planDetails = calculatePlanDetails(user);
    setTargetCalories(planDetails.calorieGoal);

    // Load existing plan
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid, 'plans', 'nutrition'), (doc) => {
      if (doc.exists()) {
        setPlan(doc.data() as NutritionPlanData);
      }
    });
    return unsubscribe;
  }, [user]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const meals = await generateNutritionPlan(user, targetCalories);
      const totalMacros = meals.reduce((acc: any, m: any) => ({
        protein: acc.protein + (m.protein || 0),
        carbs: acc.carbs + (m.carbs || 0),
        fats: acc.fats + (m.fats || 0),
      }), { protein: 0, carbs: 0, fats: 0 });

      const newPlan: NutritionPlanData = {
        planTitle: `Daily Plan for ${user.displayName}`,
        meals: meals.map((m: any) => ({ ...m, consumed: false })),
        totalMacros,
        targetCalories,
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, 'users', user.uid, 'plans', 'nutrition'), newPlan);
    } catch (error) {
      console.error("Error generating plan:", error);
      // Error handling could be improved with a state-based message
    } finally {
      setLoading(false);
    }
  };

  const toggleConsumed = async (idx: number) => {
    if (!plan) return;
    const newMeals = [...plan.meals];
    newMeals[idx].consumed = !newMeals[idx].consumed;
    
    try {
      await updateDoc(doc(db, 'users', user.uid, 'plans', 'nutrition'), { meals: newMeals });
      
      // If marked as consumed, also log to dailyLogs
      if (newMeals[idx].consumed) {
        const today = new Date().toISOString().split('T')[0];
        const logRef = doc(db, 'users', user.uid, 'dailyLogs', today);
        const logDoc = await getDoc(logRef);
        const mealToLog = {
          name: newMeals[idx].name,
          calories: newMeals[idx].calories,
          protein: newMeals[idx].protein,
          carbs: newMeals[idx].carbs,
          fats: newMeals[idx].fats,
          type: 'planned'
        };

        if (logDoc.exists()) {
          const currentData = logDoc.data();
          await updateDoc(logRef, {
            meals: [...(currentData.meals || []), mealToLog],
            totalCalories: (currentData.totalCalories || 0) + mealToLog.calories
          });
        } else {
          await setDoc(logRef, {
            date: today,
            meals: [mealToLog],
            totalCalories: mealToLog.calories,
            waterIntake: 0,
            createdAt: serverTimestamp()
          });
        }
      }
    } catch (error) {
      console.error("Error updating meal status:", error);
    }
  };

  const handleReplace = async (idx: number) => {
    if (!plan) return;
    setReplacingMealIdx(idx);
    try {
      const currentMeal = plan.meals[idx];
      const constraint = constraints[idx] || '';
      const newMeal = await replaceMeal(currentMeal, currentMeal.calories, constraint);
      
      const newMeals = [...plan.meals];
      newMeals[idx] = { ...newMeal, consumed: false };
      
      const totalMacros = newMeals.reduce((acc: any, m: any) => ({
        protein: acc.protein + (m.protein || 0),
        carbs: acc.carbs + (m.carbs || 0),
        fats: acc.fats + (m.fats || 0),
      }), { protein: 0, carbs: 0, fats: 0 });

      await updateDoc(doc(db, 'users', user.uid, 'plans', 'nutrition'), { 
        meals: newMeals,
        totalMacros
      });
      setConstraints(prev => ({ ...prev, [idx]: '' }));
    } catch (error) {
      console.error("Error replacing meal:", error);
    } finally {
      setReplacingMealIdx(null);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-8 bg-emerald-900 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Daily Goal / الهدف اليومي</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">{targetCalories}</span>
                <span className="text-emerald-300 font-medium">kcal / day</span>
              </div>
              <p className="text-emerald-200 mt-2 text-sm max-w-md">
                Based on your goal of <span className="text-white font-bold">{user.goal?.replace('_', ' ')}</span> and your physical metrics.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex bg-white/10 p-1 rounded-2xl w-fit self-end">
                <button 
                  onClick={() => setPlanMode('ai')}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${planMode === 'ai' ? 'bg-white text-emerald-900 shadow-sm' : 'text-emerald-100 hover:text-white'}`}
                >
                  AI Plan
                </button>
                <button 
                  onClick={() => setPlanMode('protocols')}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${planMode === 'protocols' ? 'bg-white text-emerald-900 shadow-sm' : 'text-emerald-100 hover:text-white'}`}
                >
                  Science Protocols
                </button>
              </div>
              {planMode === 'ai' && (
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={handleGenerate} 
                    disabled={loading}
                    variant="secondary"
                    className="bg-white text-emerald-900 hover:bg-emerald-50 border-none px-8 py-4 h-auto"
                  >
                    {loading ? <RefreshCw className="animate-spin mr-2" /> : <RefreshCw className="mr-2" />}
                    {plan ? "Regenerate Plan / إعادة إنشاء الخطة" : "Generate Plan / إنشاء خطة"}
                  </Button>
                  {plan && Math.abs(plan.targetCalories - targetCalories) > 10 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Button
                        onClick={handleGenerate}
                        disabled={loading}
                        variant="secondary"
                        className="bg-amber-400 text-amber-950 hover:bg-amber-300 border-none px-4 py-2 text-xs font-bold w-full"
                      >
                        <RefreshCw className="mr-2" size={14} />
                        Sync with New Goal ({targetCalories} kcal)
                      </Button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <Flame className="absolute -bottom-10 -right-10 text-emerald-800 opacity-30" size={240} />
      </Card>

      {planMode === 'protocols' ? (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {SCIENCE_BASED_DIETS.filter(p => !user.goal || p.goal === user.goal || user.goal === 'fitness').map((protocol) => (
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
                  <Apple size={24} />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">{protocol.planTitle}</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{protocol.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">{protocol.goal.replace('_', ' ')}</span>
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">{protocol.targetCalories} kcal</span>
                </div>
              </button>
            ))}
          </div>

          {selectedProtocol && (() => {
            // Calculate exact target macros based on the protocol's original ratios
            const pRatio = (selectedProtocol.totalMacros.protein * 4) / selectedProtocol.targetCalories;
            const cRatio = (selectedProtocol.totalMacros.carbs * 4) / selectedProtocol.targetCalories;
            const fRatio = (selectedProtocol.totalMacros.fats * 9) / selectedProtocol.targetCalories;

            const targetP = Math.round((targetCalories * pRatio) / 4);
            const targetC = Math.round((targetCalories * cRatio) / 4);
            const targetF = Math.round((targetCalories * fRatio) / 9);

            let remainingP = targetP;
            let remainingC = targetC;
            let remainingF = targetF;

            const scaledMeals = selectedProtocol.meals.map((m, idx) => {
              const mealWeight = m.calories / selectedProtocol.targetCalories;
              
              let p, c, f;
              if (idx === selectedProtocol.meals.length - 1) {
                p = Math.max(0, remainingP);
                c = Math.max(0, remainingC);
                f = Math.max(0, remainingF);
              } else {
                p = Math.round(targetP * mealWeight);
                c = Math.round(targetC * mealWeight);
                f = Math.round(targetF * mealWeight);
                
                remainingP -= p;
                remainingC -= c;
                remainingF -= f;
              }

              return {
                ...m,
                protein: p,
                carbs: c,
                fats: f,
                calories: (p * 4) + (c * 4) + (f * 9)
              };
            });

            const scaledMacros = {
              protein: targetP,
              carbs: targetC,
              fats: targetF,
            };
            
            const exactTargetCalories = (targetP * 4) + (targetC * 4) + (targetF * 9);

            return (
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
                      <p className="text-sm text-emerald-600 font-bold">Scaled to your target: {targetCalories} kcal</p>
                    </div>
                    <Button 
                      onClick={async () => {
                        const newPlan: NutritionPlanData = {
                          planTitle: selectedProtocol.planTitle,
                          meals: scaledMeals.map(m => ({ ...m, consumed: false })),
                          totalMacros: scaledMacros,
                          targetCalories: exactTargetCalories,
                          createdAt: serverTimestamp()
                        };
                        await setDoc(doc(db, 'users', user.uid, 'plans', 'nutrition'), newPlan);
                        setPlanMode('ai'); // Switch back to view the active plan
                      }}
                    >
                      Apply Protocol
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    {scaledMeals.map((meal, idx) => (
                      <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 text-emerald-600 shadow-sm border border-slate-100">
                              <Utensils size={24} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{meal.mealType}</span>
                              </div>
                              <h4 className="text-xl font-bold text-slate-900">{meal.name}</h4>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-slate-900">{meal.calories} <span className="text-sm font-medium text-slate-400">kcal</span></p>
                            <div className="flex gap-3 mt-1 justify-end">
                              <span className="text-xs font-medium text-blue-600">P: {meal.protein}g</span>
                              <span className="text-xs font-medium text-orange-600">C: {meal.carbs}g</span>
                              <span className="text-xs font-medium text-yellow-600">F: {meal.fats}g</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 italic">
                          {meal.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl border border-slate-800">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
                      <Info size={24} />
                    </div>
                    <h3 className="text-xl font-bold">Protocol Guidelines</h3>
                  </div>
                  <ul className="space-y-5">
                    {selectedProtocol.tips.map((tip, idx) => (
                      <li key={idx} className="flex gap-4 text-slate-300 text-sm leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
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
                      <Activity size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Scientific Basis</h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed relative z-10">
                    {selectedProtocol.scientificBasis}
                  </p>
                </div>
              </div>
            </motion.div>
            );
          })()}
        </div>
      ) : plan ? (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {plan.meals.map((meal, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={`p-6 transition-all ${meal.consumed ? 'bg-slate-50 opacity-75' : 'bg-white'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${meal.consumed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {meal.consumed ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{meal.mealType}</span>
                          {meal.consumed && <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-full">Consumed</span>}
                        </div>
                        <h4 className="text-xl font-bold text-slate-900">{meal.name}</h4>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900">{meal.calories} <span className="text-sm font-medium text-slate-400">kcal</span></p>
                      <div className="flex gap-3 mt-1 justify-end">
                        <span className="text-xs font-medium text-blue-600">P: {meal.protein}g</span>
                        <span className="text-xs font-medium text-orange-600">C: {meal.carbs}g</span>
                        <span className="text-xs font-medium text-yellow-600">F: {meal.fats}g</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                    {meal.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={() => toggleConsumed(idx)}
                      variant={meal.consumed ? 'secondary' : 'primary'}
                      className="flex-1"
                    >
                      {meal.consumed ? "Undo / تراجع" : "Mark Consumed / تم التناول"}
                    </Button>
                    <div className="flex-[2] flex gap-2">
                      <input 
                        type="text"
                        placeholder="Replace constraints (e.g. vegan, fast...)"
                        value={constraints[idx] || ''}
                        onChange={e => setConstraints(prev => ({ ...prev, [idx]: e.target.value }))}
                        className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                      <Button 
                        onClick={() => handleReplace(idx)}
                        disabled={replacingMealIdx === idx}
                        variant="outline"
                        className="shrink-0"
                      >
                        {replacingMealIdx === idx ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Scale size={20} className="text-emerald-600" />
                Daily Progress / التقدم اليومي
              </h4>
              {(() => {
                const consumed = plan.meals.filter(m => m.consumed).reduce((acc, m) => ({
                  protein: acc.protein + m.protein,
                  carbs: acc.carbs + m.carbs,
                  fats: acc.fats + m.fats,
                  calories: acc.calories + m.calories
                }), { protein: 0, carbs: 0, fats: 0, calories: 0 });

                return (
                  <div className="space-y-6">
                    <MacroProgress label="Calories" current={consumed.calories} target={plan.targetCalories} color="bg-emerald-500" unit="kcal" />
                    <MacroProgress label="Protein" current={consumed.protein} target={plan.totalMacros.protein} color="bg-blue-500" unit="g" />
                    <MacroProgress label="Carbs" current={consumed.carbs} target={plan.totalMacros.carbs} color="bg-orange-500" unit="g" />
                    <MacroProgress label="Fats" current={consumed.fats} target={plan.totalMacros.fats} color="bg-yellow-500" unit="g" />
                  </div>
                );
              })()}
              <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2 text-emerald-700">
                  <Info size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Scientific Note</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your macros are precisely calculated. 1g Protein = 4 kcal, 1g Carbs = 4 kcal, 1g Fat = 9 kcal. Hitting these exact targets optimizes your metabolic response for {user.goal?.replace('_', ' ')}.
                </p>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <Apple size={64} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Plan / لا توجد خطة نشطة</h3>
          <p className="text-slate-500 mb-8">Generate a personalized nutrition plan based on your profile.</p>
          <Button onClick={handleGenerate} disabled={loading} size="lg">
            {loading ? <RefreshCw className="animate-spin mr-2" /> : <Plus className="mr-2" />}
            Generate My Plan / أنشئ خطتي
          </Button>
        </div>
      )}
    </div>
  );
}

function MacroProgress({ label, current, target, color, unit = "g" }: { label: string, current: number, target: number, color: string, unit?: string }) {
  const percentage = Math.min((current / target) * 100, 100) || 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold">
        <span className="text-slate-500 uppercase tracking-widest">{label}</span>
        <span className="text-slate-900">{current}{unit} / {target}{unit}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}
