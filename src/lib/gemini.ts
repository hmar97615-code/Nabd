import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

/**
 * Helper to get the Gemini API Key from the environment
 */
function getApiKey(): string {
  if (typeof window !== 'undefined' && (window as any).__GEMINI_API_KEY__) {
    return (window as any).__GEMINI_API_KEY__;
  }
  // Prefer process.env.GEMINI_API_KEY as per guidelines
  // Also check for process.env.API_KEY which is injected for paid models
  return process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.USER_GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || "";
}

/**
 * Helper to retry Gemini API calls with exponential backoff
 */
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: any;
  console.log("Starting AI call...");
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await fn();
      console.log("AI call successful");
      return result;
    } catch (error: any) {
      lastError = error;
      console.error(`AI call failed (attempt ${i + 1}/${maxRetries}):`, error);
      
      // Check if it's a rate limit error (429)
      const isRateLimit = error?.message?.includes('429') || error?.status === 'RESOURCE_EXHAUSTED';
      if (isRateLimit && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        console.warn(`Gemini rate limit hit. Retrying in ${Math.round(delay)}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

/**
 * Helper to safely parse JSON from AI responses, handling markdown blocks and partial JSON
 */
function parseJSONResponse(text: string, fallback: any): any {
  if (!text) return fallback;
  try {
    // Remove markdown code blocks if present
    const cleanedText = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();
    return JSON.parse(cleanedText);
  } catch (e) {
    console.warn("Failed to parse JSON directly, attempting extraction:", text);
    try {
      // Attempt to extract JSON from within the text if it's embedded
      const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (match) {
        return JSON.parse(match[0]);
      }
    } catch (e2) {
      console.error("Failed secondary JSON parse attempt", e2);
    }
    return fallback;
  }
}

export const analyzeInBodyScan = async (base64Image: string) => {
  return withRetry(async () => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Gemini API Key not found.");
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are an expert fitness coach and nutritionist. Analyze this InBody scan image.
      Extract the following data accurately from the image:
      - Weight (in kg)
      - Body Fat Percentage (%)
      - Skeletal Muscle Mass (in kg)
      
      Then, provide a detailed analysis in English:
      1. Fat Analysis: Identify where fat is concentrated based on the segmental fat analysis (if visible) or general principles, and provide specific advice on how to lose it.
      2. Muscle Analysis: Identify weak muscle areas based on the segmental lean analysis and provide targeted exercises to improve them.
      3. General Advice: Provide an overall assessment of the body composition and actionable steps to reach a healthy balance.
      
      Return the result in JSON format.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          { text: prompt },
        ],
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weight: { type: Type.NUMBER, description: "Weight in kg" },
            bodyFatPercentage: { type: Type.NUMBER, description: "Body Fat Percentage" },
            skeletalMuscleMass: { type: Type.NUMBER, description: "Skeletal Muscle Mass in kg" },
            fatAnalysis: { type: Type.STRING, description: "Advice on fat distribution and how to lose it" },
            muscleAnalysis: { type: Type.STRING, description: "Advice on weak muscle areas" },
            generalAdvice: { type: Type.STRING, description: "General information and solutions" },
          },
          required: ["weight", "bodyFatPercentage", "skeletalMuscleMass", "fatAnalysis", "muscleAnalysis", "generalAdvice"],
        },
      },
    });

    return parseJSONResponse(response.text || "{}", {
      weight: 0,
      bodyFatPercentage: 0,
      skeletalMuscleMass: 0,
      fatAnalysis: "Insufficient data found.",
      muscleAnalysis: "Insufficient data found.",
      generalAdvice: "Please ensure the scan image is clear."
    });
  });
};

export const analyzeFoodImage = async (base64Images: string[], mealName?: string, ingredients?: string) => {
  return withRetry(async () => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Gemini API Key not found.");
    const ai = new GoogleGenAI({ apiKey });

    const parts: any[] = base64Images.map(img => ({
      inlineData: {
        mimeType: "image/jpeg",
        data: img,
      },
    }));

    let prompt = "You are a professional nutritionist. Analyze these food images (possibly from different angles).";
    if (mealName) prompt += ` The user says this is '${mealName}'.`;
    if (ingredients) prompt += ` The user provided these ingredients/weights: '${ingredients}'.`;
    
    prompt += `
    Requirements:
    1. If no weight is provided, use the multiple angles to estimate the volume and dimensions of the dish to calculate a realistic total weight.
    2. Identify all ingredients visible in the images.
    3. Provide consistent nutritional values based on scientific database averages.
    4. Ensure the sum of ingredient weights matches the estimated or provided total weight.
    
    Return the result in JSON format with fields: name, calories, protein, carbs, fats, ingredients (array of {name, weight}).`;

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            fats: { type: Type.NUMBER },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  weight: { type: Type.NUMBER },
                },
                required: ["name", "weight"],
              },
            },
          },
          required: ["name", "calories", "protein", "carbs", "fats", "ingredients"],
        },
      },
    });

    const text = response.text || "{}";
    return parseJSONResponse(text, {});
  });
};

export const scanNutritionLabel = async (base64Images: string[], barcode?: string, productName?: string) => {
  return withRetry(async () => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Gemini API Key not found.");
    const ai = new GoogleGenAI({ apiKey });

    const parts: any[] = base64Images.map(img => ({
      inlineData: {
        mimeType: "image/jpeg",
        data: img,
      },
    }));

    let prompt = "You are a nutrition expert. ";
    if (base64Images.length > 0) {
      prompt += "Extract the nutritional information from this nutrition facts label. ";
    } else {
      prompt += "Provide the nutritional information for the product based on the following details. ";
    }
    prompt += "Identify the product name, calories, protein, carbs, and fats per serving or per 100g.";
    
    if (barcode) prompt += ` The product barcode is: ${barcode}.`;
    if (productName) prompt += ` The product name is: ${productName}.`;
    
    prompt += " IMPORTANT: Use the Google Search tool to look up the exact product matching the barcode or name to ensure the nutritional values are precise. Search for the barcode on sites like OpenFoodFacts, MyFitnessPal, or FatSecret. Return ONLY a valid JSON object with the following keys: name (string), calories (number), protein (number), carbs (number), fats (number). Do not include any other text or markdown formatting.";
    
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [{ parts }],
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      },
    });

    const text = response.text || "{}";
    return parseJSONResponse(text, {
      name: productName || barcode || "Unknown Product",
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0
    });
  });
};

export const analyzeFoodText = async (mealName: string, ingredients?: string) => {
  return withRetry(async () => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Gemini API Key not found.");
    const ai = new GoogleGenAI({ apiKey });

    let prompt = `Analyze this meal: '${mealName}'.`;
    if (ingredients) prompt += ` Ingredients/weights provided: '${ingredients}'.`;
    prompt += " Estimate the calories, protein, carbs, and fats. Return the result in JSON format with fields: name, calories, protein, carbs, fats.";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            fats: { type: Type.NUMBER },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  weight: { type: Type.NUMBER },
                },
                required: ["name", "weight"],
              },
            },
          },
          required: ["name", "calories", "protein", "carbs", "fats", "ingredients"],
        },
      },
    });

    const text = response.text || "{}";
    return parseJSONResponse(text, {});
  });
};

export const getMealIngredients = async (mealName: string, totalWeight?: number, base64Images?: string[]) => {
  return withRetry(async () => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Gemini API Key not found.");
    const ai = new GoogleGenAI({ apiKey });

    const parts: any[] = [];
    
    if (base64Images && base64Images.length > 0) {
      base64Images.forEach(img => {
        parts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: img,
          },
        });
      });
    }

    const prompt = `List the typical ingredients for a meal named '${mealName}'. 
    ${base64Images && base64Images.length > 0 ? "Use the provided images to identify specific ingredients and estimate their proportions." : ""}
    ${totalWeight ? `The total weight of the meal is ${totalWeight} grams. For each ingredient, provide a weight in grams such that the sum of all ingredient weights is exactly ${totalWeight} grams.` : 'If no total weight is provided, estimate a realistic total weight based on the images (if provided) and typical serving sizes, ensuring the sum of ingredient weights matches this total.'}
    Return as a JSON array of objects with 'name' and 'weight' fields.`;

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              weight: { type: Type.NUMBER },
            },
            required: ["name", "weight"],
          },
        },
      },
    });

    const text = response.text || "[]";
    return parseJSONResponse(text, []);
  });
};

export const generateNutritionPlan = async (userData: any, targetCalories: number, targetMacros: { protein: number, carbs: number, fats: number }) => {
  return withRetry(async () => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Gemini API Key not found.");
    const ai = new GoogleGenAI({ apiKey });

    const currentDate = new Date().toLocaleString('en-US', { timeZoneName: 'short' });
    const prompt = `Based on the following user data, generate a personalized daily nutrition plan for one day.
    Current Date and Time: ${currentDate}
    
    User Data: ${JSON.stringify(userData)}
    Target Daily Calories: ${targetCalories} kcal.
    Target Macros: Protein ${targetMacros.protein}g, Carbs ${targetMacros.carbs}g, Fats ${targetMacros.fats}g.
    
    Selected Sports and Goals: ${JSON.stringify(userData.selectedSports || [])}
    
    CRITICAL HEALTH INSTRUCTION:
    Pay close attention to the user's health condition (healthStatus: ${userData.healthStatus || 'None/Healthy'}). 
    If they have a condition like diabetes, hypertension, etc., the diet MUST be strictly tailored to be safe and beneficial for that condition (e.g., low glycemic index for diabetics).
    Provide a 'healthAdvice' string field with specific nutritional advice related to their health condition.
    
    The plan should include Breakfast, Lunch, Dinner, and 2 Snacks.
    For each meal, provide: name, estimated calories, macros (protein, carbs, fats in grams), a brief description, a list of ingredients with their exact weights (e.g., '150g Chicken Breast'), and the preparation method.
    Make sure the sum of calories across all meals equals exactly ${targetCalories} kcal.
    Return as a JSON object with fields: healthAdvice (string) and meals (array of meal objects).`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            healthAdvice: { type: Type.STRING },
            meals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  mealType: { type: Type.STRING },
                  name: { type: Type.STRING },
                  calories: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                  protein: { type: Type.NUMBER },
                  carbs: { type: Type.NUMBER },
                  fats: { type: Type.NUMBER },
                  ingredients: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  preparation: { type: Type.STRING }
                },
                required: ["mealType", "name", "calories", "description", "protein", "carbs", "fats", "ingredients", "preparation"],
              },
            }
          },
          required: ["healthAdvice", "meals"]
        },
      },
    });

    const text = response.text || "{}";
    const result = parseJSONResponse(text, { healthAdvice: "", meals: [] });
    const meals = result.meals || [];
    
    // Post-processing to ensure exact calorie and macro match
    if (meals && meals.length > 0) {
      const targetP = targetMacros.protein;
      const targetC = targetMacros.carbs;
      const targetF = targetMacros.fats;
      
      let remainingP = targetP;
      let remainingC = targetC;
      let remainingF = targetF;

      const totalOriginalCals = meals.reduce((sum: number, meal: any) => sum + (meal.calories || 1), 0);

      meals.forEach((meal: any, idx: number) => {
        const mealWeight = (meal.calories || 1) / totalOriginalCals;
        
        if (idx === meals.length - 1) {
          meal.protein = Math.max(0, remainingP);
          meal.carbs = Math.max(0, remainingC);
          meal.fats = Math.max(0, remainingF);
        } else {
          meal.protein = Math.round(targetP * mealWeight);
          meal.carbs = Math.round(targetC * mealWeight);
          meal.fats = Math.round(targetF * mealWeight);
          
          remainingP -= meal.protein;
          remainingC -= meal.carbs;
          remainingF -= meal.fats;
        }
        
        // Ensure calories exactly match the macros (4 kcal/g for P/C, 9 kcal/g for F)
        meal.calories = (meal.protein * 4) + (meal.carbs * 4) + (meal.fats * 9);
      });
    }
    return { meals, healthAdvice: result.healthAdvice };
  });
};

export const chatWithHealthAssistant = async (message: string, history: any[], userProfile?: any, recentActivity?: any) => {
  return withRetry(async () => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Gemini API Key not found.");
    const ai = new GoogleGenAI({ apiKey });

    let profileContext = "";
    if (userProfile) {
      profileContext = `
User Profile Context:
- Name: ${userProfile.name || 'Unknown'}
- Age: ${userProfile.age || 'Unknown'}
- Gender: ${userProfile.gender || 'Unknown'}
- Height: ${userProfile.height || 'Unknown'} cm
- Weight: ${userProfile.weight || 'Unknown'} kg
- Goal: ${userProfile.goal || 'Unknown'}
- Activity Level: ${userProfile.activityLevel || 'Unknown'}
- Fitness Level: ${userProfile.fitnessLevel || 'Unknown'}
- Health Status/Injuries: ${userProfile.healthStatus || 'None'}
- Daily Calorie Target: ${userProfile.tdee || 'Unknown'} kcal
- Macros: Protein ${userProfile.macros?.protein || 0}g, Carbs ${userProfile.macros?.carbs || 0}g, Fats ${userProfile.macros?.fats || 0}g
`;
    }

    let activityContext = "";
    if (recentActivity) {
      activityContext = `
Recent Activity (Last few days):
${JSON.stringify(recentActivity, null, 2)}
`;
    }

    let historyContext = "";
    if (history && history.length > 0) {
      historyContext = "Previous Conversation History:\n" + history.map(h => `${h.role === 'user' ? 'User' : 'NABD'}: ${h.text}`).join('\n') + "\n\n";
    }

    const currentDate = new Date().toLocaleString('en-US', { timeZoneName: 'short' });
    const systemInstruction = `You are NABD (نبض), a friendly, informal health and fitness assistant. You are like a close friend or peer to the user. 
    
    Current Date and Time: ${currentDate}
    
    CRITICAL TONE INSTRUCTION:
    - Speak informally and casually, like a best friend.
    - IMPORTANT: Replace standard punctuation (periods, commas, etc.) with tildes (~) to sound more relaxed and friendly. 
    - Use emojis frequently to express emotion and friendliness.
    - Be supportive, encouraging, and sometimes a bit playful.

    CRITICAL LANGUAGE INSTRUCTION: 
    - You MUST detect the language and dialect the user is using (e.g., English, Formal Arabic, Egyptian Arabic, etc.).
    - You MUST respond in the SAME language and dialect as the user.
    - If the user speaks in Egyptian Arabic (Ammiya), respond in friendly, informal Egyptian Arabic.
    - If the user speaks in English, respond in friendly, informal English.

    ${profileContext}
    ${activityContext}

    Use the user's profile context and recent activity (workouts, meals) to provide personalized, context-aware answers. If they ask "What did I eat yesterday?" or "How was my workout?", refer to the provided activity data.`;

    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: systemInstruction,
      },
    });

    const fullMessage = `${historyContext}Current Message: ${message}`;
    const response = await chat.sendMessage({ message: fullMessage });
    return response.text;
  });
};

export const analyzeExerciseForm = async (base64Image: string, exerciseName: string, tutorialVideoUrl?: string) => {
  return withRetry(async () => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Gemini API Key not found.");
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Analyze the user's form for the exercise: ${exerciseName}. 
        ${tutorialVideoUrl ? `The user is following this tutorial: ${tutorialVideoUrl}. Compare their form against the standard technique shown in such tutorials.` : ''}
        Identify if the form is correct or incorrect. 
        Provide specific feedback on what to improve or maintain. 
        Also, mention any potential injury risks if the form is wrong.
        Return the result in JSON format with fields: isCorrect (boolean), feedback (string), injuryRisk (string).`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          { text: prompt },
        ],
      }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCorrect: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING },
            injuryRisk: { type: Type.STRING },
          },
          required: ["isCorrect", "feedback", "injuryRisk"],
        },
      },
    });

    const text = response.text || "{}";
    return parseJSONResponse(text, {
      isCorrect: false,
      feedback: "Could not analyze form. Please ensure the image is clear.",
      injuryRisk: "Unknown"
    });
  });
};

export const replaceMeal = async (currentMeal: any, targetCalories: number, userConstraints: string, targetMacros?: { protein: number, carbs: number, fats: number }) => {
  return withRetry(async () => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Gemini API Key not found.");
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `I need to replace a meal in a daily nutrition plan.
    Current Meal: ${JSON.stringify(currentMeal)}
    Target Calories: ${targetCalories} kcal (Must be exactly or very close to this).
    ${targetMacros ? `Target Macros: Protein ${targetMacros.protein}g, Carbs ${targetMacros.carbs}g, Fats ${targetMacros.fats}g (Must match exactly).` : ''}
    User Constraints/Preferences: "${userConstraints}" (e.g., cheap, delicious, fast to make).
    
    Based on scientific nutrition principles, provide a new meal that meets these constraints and matches the target calories and macros.
    Return as a JSON object with fields: mealType, name, calories, description, protein, carbs, fats, ingredients (array of strings with exact weights), and preparation (string).`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mealType: { type: Type.STRING },
            name: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            description: { type: Type.STRING },
            protein: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            fats: { type: Type.NUMBER },
            ingredients: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            preparation: { type: Type.STRING }
          },
          required: ["mealType", "name", "calories", "description", "protein", "carbs", "fats", "ingredients", "preparation"],
        },
      },
    });

    const text = response.text || "{}";
    const newMeal = parseJSONResponse(text, {});
    
    if (newMeal) {
      if (targetMacros) {
        newMeal.protein = targetMacros.protein;
        newMeal.carbs = targetMacros.carbs;
        newMeal.fats = targetMacros.fats;
      } else {
        const originalMacroCals = ((newMeal.protein || 0) * 4) + ((newMeal.carbs || 0) * 4) + ((newMeal.fats || 0) * 9) || 1;
        const pRatio = ((newMeal.protein || 0) * 4) / originalMacroCals;
        const cRatio = ((newMeal.carbs || 0) * 4) / originalMacroCals;
        const fRatio = ((newMeal.fats || 0) * 9) / originalMacroCals;

        newMeal.protein = Math.round((targetCalories * pRatio) / 4);
        newMeal.carbs = Math.round((targetCalories * cRatio) / 4);
        newMeal.fats = Math.round((targetCalories * fRatio) / 9);
      }
      
      // Exact calorie calculation based on macros
      newMeal.calories = (newMeal.protein * 4) + (newMeal.carbs * 4) + (newMeal.fats * 9);
    }
    return newMeal;
  });
};

export const generateWorkoutPlan = async (userData: any, intensity: string = 'Moderate') => {
  return withRetry(async () => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Gemini API Key not found.");
    const ai = new GoogleGenAI({ apiKey });

    const currentDate = new Date().toLocaleString('en-US', { timeZoneName: 'short' });
    const prompt = `Based on the following user data, generate a personalized weekly workout plan grounded in sports science and the latest kinesiology research.
    Current Date and Time: ${currentDate}
    
    User Data: ${JSON.stringify(userData)}
    Target Intensity: ${intensity}
    
    Selected Sports and Goals: ${JSON.stringify(userData.selectedSports || [])}
    
    CRITICAL HEALTH INSTRUCTION:
    Pay close attention to the user's health condition (healthStatus: ${userData.healthStatus || 'None/Healthy'}). 
    If they have a condition like diabetes, hypertension, joint issues, etc., the workout MUST be strictly tailored to be safe and beneficial for that condition.
    Provide a 'healthAdvice' string field with specific exercise advice and precautions related to their health condition.
    
    Requirements:
    1. Tailor the plan to their specific goals (e.g., hypertrophy, strength, endurance), selected sports, and fitness level (${userData.fitnessLevel || 'intermediate'}).
    2. Use scientific principles like Progressive Overload, Specificity, and Periodization.
    3. Include specific exercises, sets, reps, and rest times optimized for their goal and target intensity (${intensity}).
    4. Incorporate their preferred exercise system if provided (${userData.preferredExerciseSystem || 'any suitable system'}). Apply this system to all their selected sports if applicable.
    5. Provide 5-7 specific injury prevention tips based on biomechanical research.
    6. Write a "Scientific Basis" paragraph explaining the physiological reasoning behind this specific plan (e.g., muscle protein synthesis, metabolic stress, or neural adaptations).
    7. Include a videoUrl for each exercise (can be a placeholder like 'https://example.com/video.mp4' if a real one isn't known, but try to use real YouTube search URLs like 'https://www.youtube.com/results?search_query=exercise+name').
    
    Return as a JSON object with fields: planTitle (string), weeklySchedule (array of objects with day, exercises), injuryPreventionTips (array of strings), scientificBasis (string), healthAdvice (string).`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            planTitle: { type: Type.STRING },
            healthAdvice: { type: Type.STRING },
            weeklySchedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  exercises: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        sets: { type: Type.NUMBER },
                        reps: { type: Type.STRING },
                        rest: { type: Type.STRING },
                        videoUrl: { type: Type.STRING }
                      },
                      required: ["name", "sets", "reps", "rest"]
                    }
                  }
                },
                required: ["day", "exercises"]
              }
            },
            injuryPreventionTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            scientificBasis: { type: Type.STRING }
          },
          required: ["planTitle", "weeklySchedule", "injuryPreventionTips", "scientificBasis", "healthAdvice"]
        }
      }
    });

    const text = response.text || "{}";
    return parseJSONResponse(text, {});
  });
};

export const analyzeWorkoutSession = async (workoutData: any, userHistory: any[], language: string = 'en') => {
  return withRetry(async () => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Gemini API Key not found.");
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an elite fitness coach and sports scientist. Analyze this just-completed workout session.
    
    Language: Respond in ${language === 'ar' ? 'informal, encouraging Egyptian Arabic (Ammiya)' : 'informal, encouraging English'}.
    
    Completed Workout: ${JSON.stringify(workoutData)}
    User's Past Workouts (for comparison): ${JSON.stringify(userHistory.slice(0, 5))}
    
    Requirements:
    1. Identify any Personal Records (PRs) or improvements (e.g., lifted heavier, more reps, more volume) compared to past workouts.
    2. Provide 'pros' (what went well, strengths).
    3. Provide 'cons' (areas for improvement, e.g., low volume on a specific muscle, unbalanced workout).
    4. Provide 'tips' (actionable advice for the next session).
    5. Provide an 'encouragingMessage' celebrating their effort, specifically mentioning if they broke a record or lifted heavier.
    
    Return as a JSON object with fields:
    - pros (array of strings)
    - cons (array of strings)
    - tips (array of strings)
    - encouragingMessage (string)
    - prsBroken (array of strings, e.g., "Bench Press: 80kg x 8 (New PR!)")`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } },
            tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            encouragingMessage: { type: Type.STRING },
            prsBroken: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["pros", "cons", "tips", "encouragingMessage", "prsBroken"]
        }
      }
    });

    const text = response.text || "{}";
    return parseJSONResponse(text, {
      pros: [], cons: [], tips: [], encouragingMessage: "Great job!", prsBroken: []
    });
  });
};

export const analyzeHealthData = async (metrics: any, userData: any, history: any[] = []) => {
  return withRetry(async () => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("Gemini API Key not found.");
    const ai = new GoogleGenAI({ apiKey });

    const currentDate = new Date().toLocaleString('en-US', { timeZoneName: 'short' });
    const prompt = `You are a world-class health scientist and medical AI assistant. Analyze the following health data and provide personalized, evidence-based insights.
    
    Current Date and Time: ${currentDate}
    
    Current Metrics: ${JSON.stringify(metrics)}
    User Profile: ${JSON.stringify(userData)}
    User History (Last 7 days): ${JSON.stringify(history)}
    
    CRITICAL HEALTH INSTRUCTION:
    Pay close attention to the user's health condition (healthStatus: ${userData.healthStatus || 'None/Healthy'}). 
    If they have a condition like diabetes, hypertension, etc., your analysis and recommendations MUST be strictly tailored to be safe and beneficial for that condition.
    
    Requirements:
    1. Analyze Trends: Compare current metrics with the history to identify significant changes or patterns.
    2. Scientific Basis: Reference established medical standards (e.g., American Heart Association, WHO, Mayo Clinic) for heart rate, blood pressure, and stress levels.
    3. Psychological Insight: Analyze mood/stress levels in the context of physical activity and sleep (if available in history).
    4. Personalized Guidance: Provide 3-5 specific, actionable recommendations tailored to this user's history and current state.
    5. Critical Warnings: Identify any immediate health risks or concerning trends that require medical attention.
    
    Return the result in JSON format with these fields:
    - statusSummary: A clear, professional summary of their current health status and trends.
    - guidance: An array of strings containing specific scientific advice.
    - warnings: An array of strings for any health alerts or concerns.
    - insights: An array of strings highlighting interesting patterns found in their history (e.g., "Your heart rate is 5% lower on days you exercise").
    - recommendations: An array of strings for lifestyle changes.
    
    Ensure the tone is professional, scientific, yet encouraging. Use English as the primary language for the response content.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            statusSummary: { type: Type.STRING },
            guidance: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            warnings: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            insights: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["statusSummary", "guidance", "warnings", "insights", "recommendations"]
        }
      }
    });

    const text = response.text || "{}";
    return parseJSONResponse(text, { 
      statusSummary: "Sorry, we couldn't analyze the data at the moment.", 
      guidance: [], 
      warnings: [], 
      insights: [], 
      recommendations: [] 
    });
  });
};
