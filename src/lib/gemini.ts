import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.USER_GEMINI_API_KEY || process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || "";

if (!apiKey) {
  console.warn("Gemini API Key not found. AI features will be disabled. Please ensure GEMINI_API_KEY is set in the environment.");
} else {
  console.log("Gemini API Key loaded successfully.");
}
const ai = new GoogleGenAI({ apiKey: apiKey });

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
      if (error.response) {
        console.error("Error response data:", await error.response.text().catch(() => "No text"));
      }
      if (error.details) {
        console.error("Error details:", error.details);
      }
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

export const analyzeFoodImage = async (base64Images: string[], mealName?: string, ingredients?: string) => {
  return withRetry(async () => {
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
      contents: { parts },
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

export const scanNutritionLabel = async (base64Images: string[]) => {
  return withRetry(async () => {
    const parts: any[] = base64Images.map(img => ({
      inlineData: {
        mimeType: "image/jpeg",
        data: img,
      },
    }));

    const prompt = "Extract the nutritional information from this nutrition facts label. Identify the product name, calories, protein, carbs, and fats per serving or per 100g. Return as JSON: {name, calories, protein, carbs, fats}. Use Arabic for the name if possible.";
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
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
          },
          required: ["name", "calories", "protein", "carbs", "fats"],
        },
      },
    });

    const text = response.text || "{}";
    return parseJSONResponse(text, {});
  });
};

export const analyzeFoodText = async (mealName: string, ingredients?: string) => {
  return withRetry(async () => {
    let prompt = `Analyze this meal: '${mealName}'.`;
    if (ingredients) prompt += ` Ingredients/weights provided: '${ingredients}'.`;
    prompt += " Estimate the calories, protein, carbs, and fats. Return the result in JSON format with fields: name, calories, protein, carbs, fats.";

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
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
      contents: { parts },
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

export const generateNutritionPlan = async (userData: any, targetCalories: number) => {
  return withRetry(async () => {
    const prompt = `Based on the following user data, generate a personalized daily nutrition plan for one day.
    User Data: ${JSON.stringify(userData)}
    Target Daily Calories: ${targetCalories} kcal.
    The plan should include Breakfast, Lunch, Dinner, and 2 Snacks.
    For each meal, provide: name, estimated calories, macros (protein, carbs, fats in grams), and a brief description.
    Make sure the sum of calories across all meals equals exactly ${targetCalories} kcal.
    Return as a JSON array of meal objects.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
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
            },
            required: ["mealType", "name", "calories", "description", "protein", "carbs", "fats"],
          },
        },
      },
    });

    const text = response.text || "[]";
    const meals = parseJSONResponse(text, []);
    
    // Post-processing to ensure exact calorie and macro match
    if (meals && meals.length > 0) {
      // Use a 30/40/30 macro split for the daily target
      const targetP = Math.round((targetCalories * 0.3) / 4);
      const targetC = Math.round((targetCalories * 0.4) / 4);
      const targetF = Math.round((targetCalories * 0.3) / 9);
      
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
    return meals;
  });
};

export const chatWithHealthAssistant = async (message: string, history: any[]) => {
  return withRetry(async () => {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "You are NABD (نبض), a professional health and fitness assistant. You provide evidence-based advice on nutrition, exercise, and wellness. Always be encouraging and professional. Use Arabic if the user speaks Arabic, otherwise English.",
      },
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  });
};

export const analyzeExerciseForm = async (base64Image: string, exerciseName: string, tutorialVideoUrl?: string) => {
  return withRetry(async () => {
    const parts: any[] = [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image,
        },
      },
      {
        text: `Analyze the user's form for the exercise: ${exerciseName}. 
        ${tutorialVideoUrl ? `The user is following this tutorial: ${tutorialVideoUrl}. Compare their form against the standard technique shown in such tutorials.` : ''}
        Identify if the form is correct or incorrect. 
        Provide specific feedback on what to improve or maintain. 
        Also, mention any potential injury risks if the form is wrong.
        Return the result in JSON format with fields: isCorrect (boolean), feedback (string), injuryRisk (string).`
      }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
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
    return parseJSONResponse(text, {});
  });
};

export const replaceMeal = async (currentMeal: any, targetCalories: number, userConstraints: string) => {
  return withRetry(async () => {
    const prompt = `I need to replace a meal in a daily nutrition plan.
    Current Meal: ${JSON.stringify(currentMeal)}
    Target Calories: ${targetCalories} kcal (Must be exactly or very close to this).
    User Constraints/Preferences: "${userConstraints}" (e.g., cheap, delicious, fast to make).
    
    Based on scientific nutrition principles, provide a new meal that meets these constraints and matches the target calories.
    Return as a JSON object with fields: mealType, name, calories, description, protein, carbs, fats.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
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
          },
          required: ["mealType", "name", "calories", "description", "protein", "carbs", "fats"],
        },
      },
    });

    const text = response.text || "{}";
    const newMeal = parseJSONResponse(text, {});
    
    if (newMeal) {
      const originalMacroCals = ((newMeal.protein || 0) * 4) + ((newMeal.carbs || 0) * 4) + ((newMeal.fats || 0) * 9) || 1;
      const pRatio = ((newMeal.protein || 0) * 4) / originalMacroCals;
      const cRatio = ((newMeal.carbs || 0) * 4) / originalMacroCals;
      const fRatio = ((newMeal.fats || 0) * 9) / originalMacroCals;

      newMeal.protein = Math.round((targetCalories * pRatio) / 4);
      newMeal.carbs = Math.round((targetCalories * cRatio) / 4);
      newMeal.fats = Math.round((targetCalories * fRatio) / 9);
      
      // Exact calorie calculation based on macros
      newMeal.calories = (newMeal.protein * 4) + (newMeal.carbs * 4) + (newMeal.fats * 9);
    }
    return newMeal;
  });
};

export const generateWorkoutPlan = async (userData: any, intensity: string = 'Moderate') => {
  return withRetry(async () => {
    const prompt = `Based on the following user data, generate a comprehensive weekly workout plan grounded in sports science and the latest kinesiology research.
    User Data: ${JSON.stringify(userData)}
    Target Intensity: ${intensity}
    
    Requirements:
    1. Tailor the plan to their specific goals (e.g., hypertrophy, strength, endurance), selected sports, and fitness level (${userData.fitnessLevel || 'intermediate'}).
    2. Use scientific principles like Progressive Overload, Specificity, and Periodization.
    3. Include specific exercises, sets, reps, and rest times optimized for their goal and target intensity (${intensity}).
    4. Incorporate their preferred exercise system if provided (${userData.preferredExerciseSystem || 'any suitable system'}). Apply this system to all their selected sports if applicable.
    5. Provide 5-7 specific injury prevention tips based on biomechanical research.
    6. Write a "Scientific Basis" paragraph explaining the physiological reasoning behind this specific plan (e.g., muscle protein synthesis, metabolic stress, or neural adaptations).
    7. Include a videoUrl for each exercise (can be a placeholder like 'https://example.com/video.mp4' if a real one isn't known, but try to use real YouTube search URLs like 'https://www.youtube.com/results?search_query=exercise+name').
    
    Return as a JSON object with fields: planTitle (string), weeklySchedule (array of objects with day, exercises), injuryPreventionTips (array of strings), scientificBasis (string).`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            planTitle: { type: Type.STRING },
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
          required: ["planTitle", "weeklySchedule", "injuryPreventionTips", "scientificBasis"]
        }
      }
    });

    const text = response.text || "{}";
    return parseJSONResponse(text, {});
  });
};

export const analyzeHealthData = async (metrics: any, userData: any, history: any[] = []) => {
  return withRetry(async () => {
    const prompt = `You are a world-class health scientist and medical AI assistant. Analyze the following health data and provide personalized, evidence-based insights.
    
    Current Metrics: ${JSON.stringify(metrics)}
    User Profile: ${JSON.stringify(userData)}
    User History (Last 7 days): ${JSON.stringify(history)}
    
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
    
    Ensure the tone is professional, scientific, yet encouraging. Use Arabic as the primary language for the response content.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
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
      statusSummary: "عذراً، لم نتمكن من تحليل البيانات حالياً.", 
      guidance: [], 
      warnings: [], 
      insights: [], 
      recommendations: [] 
    });
  });
};
