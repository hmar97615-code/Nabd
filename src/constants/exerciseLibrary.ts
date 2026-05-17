export interface ExerciseDef {
  id: string;
  name: string;
  muscles: string[];
  equipment: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructions: string;
  videoUrl: string;
  isCore?: boolean;
}

export const MUSCLE_GROUPS = [
  "Abs",
  "Abductors",
  "Adductors",
  "Biceps",
  "Triceps",
  "Calves",
  "Chest",
  "Forearms",
  "Cardio",
  "Full-Body",
  "Glutes",
  "Hamstrings",
  "Lats",
  "Lower Back",
  "Neck",
  "Quadriceps",
  "Shoulders",
  "Traps",
  "Upper Back"
];

export const EQUIPMENT_TYPES = [
  "None (Bodyweight)",
  "Barbell",
  "Dumbbells",
  "Kettlebell",
  "Machines",
  "Plates",
  "Resistance Band",
  "Suspension Band",
  "Wheel",
  "Ball",
  "Box",
  "Rope",
  "Sled",
  "Cable",
  "Pool"
];

export const EXERCISE_LIBRARY: ExerciseDef[] = [
  {
    "id": "core_1",
    "name": "Barbell Bench Press",
    "muscles": ["Chest", "Triceps", "Shoulders"],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Lie on a flat bench, grip the barbell slightly wider than shoulder-width. Lower the bar to your mid-chest and press it back up while keeping your feet planted.",
    "videoUrl": "https://www.youtube.com/results?search_query=barbell+bench+press+form",
    "isCore": true
  },
  {
    "id": "core_2",
    "name": "Barbell Back Squat",
    "muscles": ["Quadriceps", "Glutes", "Hamstrings", "Lower Back"],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Place the barbell on your upper traps. Stand with feet shoulder-width apart. Squat down by pushing your hips back and bending your knees until thighs are parallel to the floor. Drive back up through your heels.",
    "videoUrl": "https://www.youtube.com/results?search_query=barbell+back+squat+form",
    "isCore": true
  },
  {
    "id": "core_3",
    "name": "Deadlift",
    "muscles": ["Hamstrings", "Glutes", "Lower Back", "Traps", "Forearms"],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Stand with feet hip-width apart, bar over mid-foot. Grip the bar, flatten your back, and lift by extending your hips and knees simultaneously. Keep the bar close to your body.",
    "videoUrl": "https://www.youtube.com/results?search_query=deadlift+form",
    "isCore": true
  },
  {
    "id": "core_4",
    "name": "Overhead Press (Military Press)",
    "muscles": ["Shoulders", "Triceps", "Upper Back"],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Stand with feet shoulder-width apart. Hold the barbell at shoulder height. Press the bar overhead until arms are fully extended, then lower back to the starting position.",
    "videoUrl": "https://www.youtube.com/results?search_query=overhead+press+form",
    "isCore": true
  },
  {
    "id": "core_5",
    "name": "Pull-ups",
    "muscles": ["Lats", "Biceps", "Upper Back"],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Grip the pull-up bar with palms facing away. Pull yourself up until your chin is over the bar, then lower yourself with control.",
    "videoUrl": "https://www.youtube.com/results?search_query=pull-ups+form",
    "isCore": true
  },
  {
    "id": "core_6",
    "name": "Lat Pulldown",
    "muscles": ["Lats", "Biceps", "Upper Back"],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Sit at the machine and grip the bar wider than shoulder-width. Pull the bar down to your upper chest while keeping your torso upright, then slowly return to the start.",
    "videoUrl": "https://www.youtube.com/results?search_query=lat+pulldown+form",
    "isCore": true
  },
  {
    "id": "core_7",
    "name": "Barbell Row",
    "muscles": ["Upper Back", "Lats", "Biceps", "Lower Back"],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Bend at the hips with a flat back. Grip the barbell and pull it towards your lower ribs, squeezing your shoulder blades together.",
    "videoUrl": "https://www.youtube.com/results?search_query=barbell+row+form",
    "isCore": true
  },
  {
    "id": "core_8",
    "name": "Dumbbell Bench Press",
    "muscles": ["Chest", "Triceps", "Shoulders"],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Lie on a flat bench with a dumbbell in each hand. Press the weights up over your chest and lower them until they are level with your chest.",
    "videoUrl": "https://www.youtube.com/results?search_query=dumbbell+bench+press+form",
    "isCore": true
  },
  {
    "id": "core_9",
    "name": "Leg Press",
    "muscles": ["Quadriceps", "Glutes", "Hamstrings"],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Sit in the leg press machine and place your feet shoulder-width apart on the platform. Lower the platform until your knees are at 90 degrees, then press back up.",
    "videoUrl": "https://www.youtube.com/results?search_query=leg+press+form",
    "isCore": true
  },
  {
    "id": "core_10",
    "name": "Romanian Deadlift",
    "muscles": ["Hamstrings", "Glutes", "Lower Back"],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Hold a barbell at hip height. Lower the bar by pushing your hips back while keeping your legs relatively straight (slight knee bend). Feel the stretch in your hamstrings and return to start.",
    "videoUrl": "https://www.youtube.com/results?search_query=romanian+deadlift+form",
    "isCore": true
  },
  {
    "id": "core_11",
    "name": "Dumbbell Lateral Raise",
    "muscles": ["Shoulders"],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Stand with dumbbells at your sides. Raise your arms out to the sides until they are parallel to the floor, then lower them slowly.",
    "videoUrl": "https://www.youtube.com/results?search_query=dumbbell+lateral+raise+form",
    "isCore": true
  },
  {
    "id": "core_12",
    "name": "Face Pull",
    "muscles": ["Shoulders", "Upper Back"],
    "equipment": "Cable",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Use a rope attachment on a cable machine at face height. Pull the rope towards your face, pulling the ends apart while squeezing your rear delts.",
    "videoUrl": "https://www.youtube.com/results?search_query=face+pull+form",
    "isCore": true
  },
  {
    "id": "core_13",
    "name": "Dips",
    "muscles": ["Triceps", "Chest", "Shoulders"],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Lower your body by bending your arms until your shoulders are below your elbows, then push back up to the starting position.",
    "videoUrl": "https://www.youtube.com/results?search_query=dips+form",
    "isCore": true
  },
  {
    "id": "core_14",
    "name": "Lunges",
    "muscles": ["Quadriceps", "Glutes", "Hamstrings"],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Step forward with one leg and lower your hips until both knees are bent at a 90-degree angle. Push back to the starting position and repeat with the other leg.",
    "videoUrl": "https://www.youtube.com/results?search_query=lunges+form",
    "isCore": true
  },
  {
    "id": "core_15",
    "name": "Barbell Bicep Curl",
    "muscles": ["Biceps", "Forearms"],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Stand with a barbell in your hands, palms facing up. Curl the bar towards your shoulders while keeping your elbows tucked, then lower with control.",
    "videoUrl": "https://www.youtube.com/results?search_query=barbell+bicep+curl+form",
    "isCore": true
  },
  {
    "id": "core_16",
    "name": "Triceps Pushdown",
    "muscles": ["Triceps"],
    "equipment": "Cable",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Use a cable machine with a bar or rope. Push the weight down until your arms are fully extended, focusing on the triceps contraction.",
    "videoUrl": "https://www.youtube.com/results?search_query=triceps+pushdown+form",
    "isCore": true
  },
  {
    "id": "core_17",
    "name": "Leg Extension",
    "muscles": ["Quadriceps"],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Sit in the leg extension machine and place your ankles behind the padded bar. Extend your legs until they are straight, then lower them slowly.",
    "videoUrl": "https://www.youtube.com/results?search_query=leg+extension+form",
    "isCore": true
  },
  {
    "id": "core_18",
    "name": "Leg Curl",
    "muscles": ["Hamstrings"],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Lie or sit in the leg curl machine and place your ankles behind the padded bar. Curl your legs towards your glutes, then return to the starting position.",
    "videoUrl": "https://www.youtube.com/results?search_query=leg+curl+form",
    "isCore": true
  },
  {
    "id": "core_19",
    "name": "Standing Calf Raise",
    "muscles": ["Calves"],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Stand on the edge of a platform or in a calf raise machine. Raise your heels as high as possible, then lower them below the platform level.",
    "videoUrl": "https://www.youtube.com/results?search_query=standing+calf+raise+form",
    "isCore": true
  },
  {
    "id": "core_20",
    "name": "Hammer Curl",
    "muscles": ["Biceps", "Forearms"],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Hold dumbbells with a neutral grip (palms facing each other). Curl the weights towards your shoulders while keeping your elbows tucked.",
    "videoUrl": "https://www.youtube.com/results?search_query=hammer+curl+form",
    "isCore": true
  },
  {
    "id": "core_21",
    "name": "Skull Crusher",
    "muscles": ["Triceps"],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Lie on a bench and hold a barbell or EZ bar with a narrow grip. Lower the bar towards your forehead by bending your elbows, then extend your arms back up.",
    "videoUrl": "https://www.youtube.com/results?search_query=skull+crusher+form",
    "isCore": true
  },
  {
    "id": "core_22",
    "name": "Cable Crossover",
    "muscles": ["Chest"],
    "equipment": "Cable",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Stand between two cable pulleys. Pull the handles together in front of your chest while keeping a slight bend in your elbows.",
    "videoUrl": "https://www.youtube.com/results?search_query=cable+crossover+form",
    "isCore": true
  },
  {
    "id": "core_23",
    "name": "Pec Deck Machine",
    "muscles": ["Chest"],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Sit in the pec deck machine and place your arms on the pads. Squeeze your arms together in front of your chest, then return slowly.",
    "videoUrl": "https://www.youtube.com/results?search_query=pec+deck+form",
    "isCore": true
  },
  {
    "id": "core_24",
    "name": "Barbell Shrug",
    "muscles": ["Traps"],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Hold a barbell in front of your thighs. Shrug your shoulders as high as possible towards your ears, then lower them back down.",
    "videoUrl": "https://www.youtube.com/results?search_query=barbell+shrug+form",
    "isCore": true
  },
  {
    "id": "core_25",
    "name": "Plank",
    "muscles": ["Abs", "Lower Back"],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Hold a push-up position but with your weight on your forearms. Keep your body in a straight line from head to heels.",
    "videoUrl": "https://www.youtube.com/results?search_query=plank+form",
    "isCore": true
  },
  {
    "id": "core_26",
    "name": "Russian Twist",
    "muscles": ["Abs"],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Sit on the floor with knees bent and feet slightly elevated. Twist your torso from side to side, touching the floor with your hands.",
    "videoUrl": "https://www.youtube.com/results?search_query=russian+twist+form",
    "isCore": true
  },
  {
    "id": "core_27",
    "name": "Hanging Leg Raise",
    "muscles": ["Abs", "Hip Flexors"],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Hang from a pull-up bar. Raise your legs until they are parallel to the floor, then lower them slowly without swinging.",
    "videoUrl": "https://www.youtube.com/results?search_query=hanging+leg+raise+form",
    "isCore": true
  },
  {
    "id": "core_28",
    "name": "Seated Cable Row",
    "muscles": ["Upper Back", "Lats", "Biceps"],
    "equipment": "Cable",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Sit at the cable row machine with your feet on the platforms. Pull the handle towards your lower stomach while keeping your back straight and squeezing your shoulder blades.",
    "videoUrl": "https://www.youtube.com/results?search_query=seated+cable+row+form",
    "isCore": true
  },
  {
    "id": "core_29",
    "name": "Incline Dumbbell Press",
    "muscles": ["Chest", "Shoulders", "Triceps"],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Lie on an incline bench (30-45 degrees). Press the dumbbells up from your shoulders until arms are extended, then lower them slowly.",
    "videoUrl": "https://www.youtube.com/results?search_query=incline+dumbbell+press+form",
    "isCore": true
  },
  {
    "id": "core_30",
    "name": "Bulgarian Split Squat",
    "muscles": ["Quadriceps", "Glutes", "Hamstrings"],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Stand with one foot on a bench behind you. Lower your hips until your front thigh is parallel to the ground, then push back up.",
    "videoUrl": "https://www.youtube.com/results?search_query=bulgarian+split+squat+form",
    "isCore": true
  },
  {
    "id": "core_31",
    "name": "Goblet Squat",
    "muscles": ["Quadriceps", "Glutes", "Hamstrings"],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Hold a kettlebell or dumbbell close to your chest. Squat down until your elbows touch your knees, then stand back up.",
    "videoUrl": "https://www.youtube.com/results?search_query=goblet+squat+form",
    "isCore": true
  },
  {
    "id": "core_32",
    "name": "Preacher Curl",
    "muscles": ["Biceps"],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Sit at a preacher bench and rest your arms on the pad. Curl the barbell towards your shoulders, then lower it fully.",
    "videoUrl": "https://www.youtube.com/results?search_query=preacher+curl+form",
    "isCore": true
  },
  {
    "id": "core_33",
    "name": "Dumbbell Chest Fly",
    "muscles": ["Chest"],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Lie on a flat bench with dumbbells. Lower your arms out to the sides in a wide arc until you feel a stretch in your chest, then bring them back together.",
    "videoUrl": "https://www.youtube.com/results?search_query=dumbbell+chest+fly+form",
    "isCore": true
  },
  {
    "id": "core_34",
    "name": "Incline Dumbbell Fly",
    "muscles": ["Chest"],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Lie on an incline bench. Lower the dumbbells in a wide arc to the sides, then bring them back together over your upper chest.",
    "videoUrl": "https://www.youtube.com/results?search_query=incline+dumbbell+fly+form",
    "isCore": true
  },
  {
    "id": "core_35",
    "name": "Cable Chest Fly",
    "muscles": ["Chest"],
    "equipment": "Cable",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Stand between cable pulleys. Pull the handles together in a wide arc in front of your chest, focusing on the squeeze.",
    "videoUrl": "https://www.youtube.com/results?search_query=cable+chest+fly+form",
    "isCore": true
  },
  {
    "id": "core_36",
    "name": "Arnold Press",
    "muscles": ["Shoulders", "Triceps"],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Sit with dumbbells in front of your shoulders, palms facing you. Rotate your palms outward as you press the weights overhead.",
    "videoUrl": "https://www.youtube.com/results?search_query=arnold+press+form",
    "isCore": true
  },
  {
    "id": "core_37",
    "name": "Dumbbell Rear Delt Fly",
    "muscles": ["Shoulders", "Upper Back"],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Bend at the hips with a flat back. Raise the dumbbells out to the sides, focusing on your rear deltoids.",
    "videoUrl": "https://www.youtube.com/results?search_query=dumbbell+rear+delt+fly+form",
    "isCore": true
  },
  {
    "id": "core_38",
    "name": "Barbell Hip Thrust",
    "muscles": ["Glutes", "Hamstrings"],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Sit on the floor with your back against a bench. Place a barbell over your hips and drive through your heels to lift your hips until they are level with your knees.",
    "videoUrl": "https://www.youtube.com/results?search_query=barbell+hip+thrust+form",
    "isCore": true
  },
  {
    "id": "core_39",
    "name": "Close Grip Bench Press",
    "muscles": ["Triceps", "Chest", "Shoulders"],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Lie on a bench and grip the barbell with hands shoulder-width apart. Lower the bar to your chest and press back up, keeping elbows close to your body.",
    "videoUrl": "https://www.youtube.com/results?search_query=close+grip+bench+press+form",
    "isCore": true
  },
  {
    "id": "core_40",
    "name": "Overhead Triceps Extension",
    "muscles": ["Triceps"],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Hold a dumbbell with both hands overhead. Lower it behind your head by bending your elbows, then extend your arms back up.",
    "videoUrl": "https://www.youtube.com/results?search_query=overhead+triceps+extension+form",
    "isCore": true
  },
  {
    "id": "core_41",
    "name": "Seated Calf Raise",
    "muscles": ["Calves"],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Sit in the calf raise machine with the pads on your thighs. Lift your heels as high as possible, then lower them slowly.",
    "videoUrl": "https://www.youtube.com/results?search_query=seated+calf+raise+form",
    "isCore": true
  },
  {
    "id": "core_42",
    "name": "One-Arm Dumbbell Row",
    "muscles": ["Upper Back", "Lats", "Biceps"],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Place one hand and knee on a bench. Pull a dumbbell up to your hip with the other hand, keeping your back flat.",
    "videoUrl": "https://www.youtube.com/results?search_query=one+arm+dumbbell+row+form",
    "isCore": true
  },
  {
    "id": "core_43",
    "name": "Straight-Arm Pulldown",
    "muscles": ["Lats", "Upper Back"],
    "equipment": "Cable",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Stand at a cable machine and grip a bar with straight arms. Pull the bar down to your thighs while keeping your arms straight.",
    "videoUrl": "https://www.youtube.com/results?search_query=straight+arm+pulldown+form",
    "isCore": true
  },
  {
    "id": "core_44",
    "name": "Incline Barbell Bench Press",
    "muscles": ["Chest", "Shoulders", "Triceps"],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Lie on an incline bench and press the barbell up from your upper chest.",
    "videoUrl": "https://www.youtube.com/results?search_query=incline+barbell+bench+press+form",
    "isCore": true
  },
  {
    "id": "core_45",
    "name": "Reverse Fly (Machine)",
    "muscles": ["Shoulders", "Upper Back"],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Sit facing the machine and pull the handles back in a wide arc, squeezing your rear delts.",
    "videoUrl": "https://www.youtube.com/results?search_query=reverse+fly+machine+form",
    "isCore": true
  },
  {
    "id": "core_46",
    "name": "Upright Row",
    "muscles": ["Shoulders", "Traps"],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Hold a barbell in front of you. Pull it up towards your chin, leading with your elbows.",
    "videoUrl": "https://www.youtube.com/results?search_query=upright+row+form",
    "isCore": true
  },
  {
    "id": "core_47",
    "name": "Front Squat",
    "muscles": ["Quadriceps", "Upper Back", "Abs"],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Hold the barbell across the front of your shoulders. Squat down while keeping your elbows high and torso upright.",
    "videoUrl": "https://www.youtube.com/results?search_query=front+squat+form",
    "isCore": true
  },
  {
    "id": "core_48",
    "name": "T-Bar Row",
    "muscles": ["Upper Back", "Lats", "Biceps"],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Stand on the platform and pull the handles towards your chest, keeping your back flat.",
    "videoUrl": "https://www.youtube.com/results?search_query=t+bar+row+form",
    "isCore": true
  },
  {
    "id": "core_49",
    "name": "Bicycle Crunches",
    "muscles": ["Abs"],
    "equipment": "None (Bodyweight)",
    "category": "Core",
    "difficulty": "Beginner",
    "instructions": "Lie on your back and bring opposite elbow to opposite knee in a pedaling motion.",
    "videoUrl": "https://www.youtube.com/results?search_query=bicycle+crunches+form",
    "isCore": true
  },
  {
    "id": "core_50",
    "name": "Mountain Climbers",
    "muscles": ["Abs", "Cardio", "Full-Body"],
    "equipment": "None (Bodyweight)",
    "category": "Cardio",
    "difficulty": "Beginner",
    "instructions": "From a plank position, alternate bringing your knees towards your chest as fast as possible.",
    "videoUrl": "https://www.youtube.com/results?search_query=mountain+climbers+form",
    "isCore": true
  },
  {
    "id": "core_51",
    "name": "Chest Fly Machine",
    "muscles": ["Chest"],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Sit in the machine with your back flat against the pad. Grip the handles and bring them together in front of your chest, squeezing your pectoral muscles, then return slowly to the starting position.",
    "videoUrl": "https://www.youtube.com/results?search_query=chest+fly+machine+form",
    "isCore": true
  },
  {
    "id": "ex_1",
    "name": "Crunches",
    "muscles": [
      "Abs"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Core",
    "difficulty": "Beginner",
    "instructions": "Perform Crunches with proper form. Focus on the mind-muscle connection.",
    "videoUrl": "https://www.youtube.com/results?search_query=Crunches+form"
  },
  {
    "id": "ex_2",
    "name": "Plank",
    "muscles": [
      "Abs",
      "Full-Body"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Core",
    "difficulty": "Beginner",
    "instructions": "Perform Plank with proper form. Focus on the mind-muscle connection.",
    "videoUrl": "https://www.youtube.com/results?search_query=Plank+form"
  },
  {
    "id": "ex_3",
    "name": "Barbell Curl",
    "muscles": [
      "Biceps",
      "Forearms"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Barbell Curl with proper form. Focus on the mind-muscle connection.",
    "videoUrl": "https://www.youtube.com/results?search_query=Barbell%20Curl+form"
  },
  {
    "id": "ex_4",
    "name": "Triceps Pushdown",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Cable",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Triceps Pushdown with proper form. Focus on the mind-muscle connection.",
    "videoUrl": "https://www.youtube.com/results?search_query=Triceps%20Pushdown+form"
  },
  {
    "id": "ex_5",
    "name": "Barbell Bench Press",
    "muscles": [
      "Chest",
      "Triceps",
      "Shoulders"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Barbell Bench Press with proper form. Focus on the mind-muscle connection.",
    "videoUrl": "https://www.youtube.com/results?search_query=Barbell%20Bench%20Press+form"
  },
  {
    "id": "ex_6",
    "name": "Push-Ups",
    "muscles": [
      "Chest",
      "Triceps",
      "Abs"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Push-Ups with proper form. Focus on the mind-muscle connection.",
    "videoUrl": "https://www.youtube.com/results?search_query=Push-Ups+form"
  },
  {
    "id": "ex_7",
    "name": "Barbell Squats",
    "muscles": [
      "Quadriceps",
      "Glutes",
      "Hamstrings"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Barbell Squats with proper form. Focus on the mind-muscle connection.",
    "videoUrl": "https://www.youtube.com/results?search_query=Barbell%20Squats+form"
  },
  {
    "id": "ex_8",
    "name": "Deadlift",
    "muscles": [
      "Hamstrings",
      "Glutes",
      "Lower Back",
      "Traps"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Deadlift with proper form. Focus on the mind-muscle connection.",
    "videoUrl": "https://www.youtube.com/results?search_query=Deadlift+form"
  },
  {
    "id": "ex_9",
    "name": "Pull-Ups",
    "muscles": [
      "Lats",
      "Biceps",
      "Upper Back"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Pull-Ups with proper form. Focus on the mind-muscle connection.",
    "videoUrl": "https://www.youtube.com/results?search_query=Pull-Ups+form"
  },
  {
    "id": "ex_10",
    "name": "Overhead Press",
    "muscles": [
      "Shoulders",
      "Triceps"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Overhead Press with proper form. Focus on the mind-muscle connection.",
    "videoUrl": "https://www.youtube.com/results?search_query=Overhead%20Press+form"
  },
  {
    "id": "ex_11",
    "name": "Standard Bodyweight Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Core",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Bodyweight Abs Crunch using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Bodyweight%20Abs%20Crunch+form"
  },
  {
    "id": "ex_12",
    "name": "Incline Bodyweight Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Core",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Bodyweight Abs Crunch using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Bodyweight%20Abs%20Crunch+form"
  },
  {
    "id": "ex_13",
    "name": "Decline Bodyweight Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Core",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Bodyweight Abs Crunch using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Bodyweight%20Abs%20Crunch+form"
  },
  {
    "id": "ex_14",
    "name": "Single-Arm/Leg Bodyweight Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Core",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Bodyweight Abs Crunch using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Bodyweight%20Abs%20Crunch+form"
  },
  {
    "id": "ex_15",
    "name": "Standard Barbell Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Barbell",
    "category": "Core",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Barbell Abs Crunch using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Barbell%20Abs%20Crunch+form"
  },
  {
    "id": "ex_16",
    "name": "Incline Barbell Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Barbell",
    "category": "Core",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Barbell Abs Crunch using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Barbell%20Abs%20Crunch+form"
  },
  {
    "id": "ex_17",
    "name": "Decline Barbell Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Barbell",
    "category": "Core",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Barbell Abs Crunch using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Barbell%20Abs%20Crunch+form"
  },
  {
    "id": "ex_18",
    "name": "Single-Arm/Leg Barbell Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Barbell",
    "category": "Core",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Barbell Abs Crunch using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Barbell%20Abs%20Crunch+form"
  },
  {
    "id": "ex_19",
    "name": "Standard Dumbbells Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Dumbbells",
    "category": "Core",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Dumbbells Abs Crunch using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Dumbbells%20Abs%20Crunch+form"
  },
  {
    "id": "ex_20",
    "name": "Incline Dumbbells Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Dumbbells",
    "category": "Core",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Dumbbells Abs Crunch using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Dumbbells%20Abs%20Crunch+form"
  },
  {
    "id": "ex_21",
    "name": "Decline Dumbbells Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Dumbbells",
    "category": "Core",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Dumbbells Abs Crunch using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Dumbbells%20Abs%20Crunch+form"
  },
  {
    "id": "ex_22",
    "name": "Single-Arm/Leg Dumbbells Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Dumbbells",
    "category": "Core",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Dumbbells Abs Crunch using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Dumbbells%20Abs%20Crunch+form"
  },
  {
    "id": "ex_23",
    "name": "Standard Kettlebell Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Kettlebell",
    "category": "Core",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Kettlebell Abs Crunch using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Kettlebell%20Abs%20Crunch+form"
  },
  {
    "id": "ex_24",
    "name": "Incline Kettlebell Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Kettlebell",
    "category": "Core",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Kettlebell Abs Crunch using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Kettlebell%20Abs%20Crunch+form"
  },
  {
    "id": "ex_25",
    "name": "Decline Kettlebell Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Kettlebell",
    "category": "Core",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Kettlebell Abs Crunch using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Kettlebell%20Abs%20Crunch+form"
  },
  {
    "id": "ex_26",
    "name": "Single-Arm/Leg Kettlebell Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Kettlebell",
    "category": "Core",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Kettlebell Abs Crunch using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Kettlebell%20Abs%20Crunch+form"
  },
  {
    "id": "ex_27",
    "name": "Standard Machines Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Machines",
    "category": "Core",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Machines Abs Crunch using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Machines%20Abs%20Crunch+form"
  },
  {
    "id": "ex_28",
    "name": "Incline Machines Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Machines",
    "category": "Core",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Machines Abs Crunch using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Machines%20Abs%20Crunch+form"
  },
  {
    "id": "ex_29",
    "name": "Decline Machines Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Machines",
    "category": "Core",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Machines Abs Crunch using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Machines%20Abs%20Crunch+form"
  },
  {
    "id": "ex_30",
    "name": "Single-Arm/Leg Machines Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Machines",
    "category": "Core",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Machines Abs Crunch using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Machines%20Abs%20Crunch+form"
  },
  {
    "id": "ex_31",
    "name": "Standard Plates Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Plates",
    "category": "Core",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Plates Abs Crunch using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Plates%20Abs%20Crunch+form"
  },
  {
    "id": "ex_32",
    "name": "Incline Plates Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Plates",
    "category": "Core",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Plates Abs Crunch using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Plates%20Abs%20Crunch+form"
  },
  {
    "id": "ex_33",
    "name": "Decline Plates Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Plates",
    "category": "Core",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Plates Abs Crunch using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Plates%20Abs%20Crunch+form"
  },
  {
    "id": "ex_34",
    "name": "Single-Arm/Leg Plates Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Plates",
    "category": "Core",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Plates Abs Crunch using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Plates%20Abs%20Crunch+form"
  },
  {
    "id": "ex_35",
    "name": "Standard Resistance Band Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Resistance Band",
    "category": "Core",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Resistance Band Abs Crunch using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Resistance%20Band%20Abs%20Crunch+form"
  },
  {
    "id": "ex_36",
    "name": "Incline Resistance Band Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Resistance Band",
    "category": "Core",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Resistance Band Abs Crunch using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Resistance%20Band%20Abs%20Crunch+form"
  },
  {
    "id": "ex_37",
    "name": "Decline Resistance Band Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Resistance Band",
    "category": "Core",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Resistance Band Abs Crunch using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Resistance%20Band%20Abs%20Crunch+form"
  },
  {
    "id": "ex_38",
    "name": "Single-Arm/Leg Resistance Band Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Resistance Band",
    "category": "Core",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Resistance Band Abs Crunch using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Resistance%20Band%20Abs%20Crunch+form"
  },
  {
    "id": "ex_39",
    "name": "Standard Suspension Band Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Suspension Band",
    "category": "Core",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Suspension Band Abs Crunch using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Suspension%20Band%20Abs%20Crunch+form"
  },
  {
    "id": "ex_40",
    "name": "Incline Suspension Band Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Suspension Band",
    "category": "Core",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Suspension Band Abs Crunch using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Suspension%20Band%20Abs%20Crunch+form"
  },
  {
    "id": "ex_41",
    "name": "Decline Suspension Band Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Suspension Band",
    "category": "Core",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Suspension Band Abs Crunch using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Suspension%20Band%20Abs%20Crunch+form"
  },
  {
    "id": "ex_42",
    "name": "Single-Arm/Leg Suspension Band Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Suspension Band",
    "category": "Core",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Suspension Band Abs Crunch using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Suspension%20Band%20Abs%20Crunch+form"
  },
  {
    "id": "ex_43",
    "name": "Standard Wheel Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Wheel",
    "category": "Core",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Wheel Abs Crunch using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Wheel%20Abs%20Crunch+form"
  },
  {
    "id": "ex_44",
    "name": "Incline Wheel Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Wheel",
    "category": "Core",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Wheel Abs Crunch using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Wheel%20Abs%20Crunch+form"
  },
  {
    "id": "ex_45",
    "name": "Decline Wheel Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Wheel",
    "category": "Core",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Wheel Abs Crunch using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Wheel%20Abs%20Crunch+form"
  },
  {
    "id": "ex_46",
    "name": "Single-Arm/Leg Wheel Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Wheel",
    "category": "Core",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Wheel Abs Crunch using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Wheel%20Abs%20Crunch+form"
  },
  {
    "id": "ex_47",
    "name": "Standard Ball Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Ball",
    "category": "Core",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Ball Abs Crunch using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Ball%20Abs%20Crunch+form"
  },
  {
    "id": "ex_48",
    "name": "Incline Ball Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Ball",
    "category": "Core",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Ball Abs Crunch using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Ball%20Abs%20Crunch+form"
  },
  {
    "id": "ex_49",
    "name": "Decline Ball Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Ball",
    "category": "Core",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Ball Abs Crunch using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Ball%20Abs%20Crunch+form"
  },
  {
    "id": "ex_50",
    "name": "Single-Arm/Leg Ball Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Ball",
    "category": "Core",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Ball Abs Crunch using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Ball%20Abs%20Crunch+form"
  },
  {
    "id": "ex_51",
    "name": "Standard Box Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Box",
    "category": "Core",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Box Abs Crunch using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Box%20Abs%20Crunch+form"
  },
  {
    "id": "ex_52",
    "name": "Incline Box Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Box",
    "category": "Core",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Box Abs Crunch using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Box%20Abs%20Crunch+form"
  },
  {
    "id": "ex_53",
    "name": "Decline Box Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Box",
    "category": "Core",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Box Abs Crunch using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Box%20Abs%20Crunch+form"
  },
  {
    "id": "ex_54",
    "name": "Single-Arm/Leg Box Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Box",
    "category": "Core",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Box Abs Crunch using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Box%20Abs%20Crunch+form"
  },
  {
    "id": "ex_55",
    "name": "Standard Rope Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Rope",
    "category": "Core",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Rope Abs Crunch using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Rope%20Abs%20Crunch+form"
  },
  {
    "id": "ex_56",
    "name": "Incline Rope Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Rope",
    "category": "Core",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Rope Abs Crunch using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Rope%20Abs%20Crunch+form"
  },
  {
    "id": "ex_57",
    "name": "Decline Rope Abs Crunch",
    "muscles": [
      "Abs"
    ],
    "equipment": "Rope",
    "category": "Core",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Rope Abs Crunch using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Rope%20Abs%20Crunch+form"
  },
  {
    "id": "ex_58",
    "name": "Standard Bodyweight Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Bodyweight Abductors Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Bodyweight%20Abductors%20Press+form"
  },
  {
    "id": "ex_59",
    "name": "Incline Bodyweight Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Bodyweight Abductors Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Bodyweight%20Abductors%20Press+form"
  },
  {
    "id": "ex_60",
    "name": "Decline Bodyweight Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Bodyweight Abductors Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Bodyweight%20Abductors%20Press+form"
  },
  {
    "id": "ex_61",
    "name": "Single-Arm/Leg Bodyweight Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Bodyweight Abductors Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Bodyweight%20Abductors%20Press+form"
  },
  {
    "id": "ex_62",
    "name": "Standard Barbell Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Barbell Abductors Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Barbell%20Abductors%20Press+form"
  },
  {
    "id": "ex_63",
    "name": "Incline Barbell Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Barbell Abductors Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Barbell%20Abductors%20Press+form"
  },
  {
    "id": "ex_64",
    "name": "Decline Barbell Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Barbell Abductors Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Barbell%20Abductors%20Press+form"
  },
  {
    "id": "ex_65",
    "name": "Single-Arm/Leg Barbell Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Barbell Abductors Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Barbell%20Abductors%20Press+form"
  },
  {
    "id": "ex_66",
    "name": "Standard Dumbbells Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Dumbbells Abductors Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Dumbbells%20Abductors%20Press+form"
  },
  {
    "id": "ex_67",
    "name": "Incline Dumbbells Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Dumbbells Abductors Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Dumbbells%20Abductors%20Press+form"
  },
  {
    "id": "ex_68",
    "name": "Decline Dumbbells Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Dumbbells Abductors Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Dumbbells%20Abductors%20Press+form"
  },
  {
    "id": "ex_69",
    "name": "Single-Arm/Leg Dumbbells Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Dumbbells Abductors Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Dumbbells%20Abductors%20Press+form"
  },
  {
    "id": "ex_70",
    "name": "Standard Kettlebell Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Kettlebell Abductors Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Kettlebell%20Abductors%20Press+form"
  },
  {
    "id": "ex_71",
    "name": "Incline Kettlebell Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Kettlebell Abductors Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Kettlebell%20Abductors%20Press+form"
  },
  {
    "id": "ex_72",
    "name": "Decline Kettlebell Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Kettlebell Abductors Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Kettlebell%20Abductors%20Press+form"
  },
  {
    "id": "ex_73",
    "name": "Single-Arm/Leg Kettlebell Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Kettlebell Abductors Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Kettlebell%20Abductors%20Press+form"
  },
  {
    "id": "ex_74",
    "name": "Standard Machines Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Machines Abductors Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Machines%20Abductors%20Press+form"
  },
  {
    "id": "ex_75",
    "name": "Incline Machines Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Machines Abductors Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Machines%20Abductors%20Press+form"
  },
  {
    "id": "ex_76",
    "name": "Decline Machines Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Machines Abductors Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Machines%20Abductors%20Press+form"
  },
  {
    "id": "ex_77",
    "name": "Single-Arm/Leg Machines Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Machines Abductors Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Machines%20Abductors%20Press+form"
  },
  {
    "id": "ex_78",
    "name": "Standard Plates Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Plates Abductors Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Plates%20Abductors%20Press+form"
  },
  {
    "id": "ex_79",
    "name": "Incline Plates Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Plates Abductors Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Plates%20Abductors%20Press+form"
  },
  {
    "id": "ex_80",
    "name": "Decline Plates Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Plates Abductors Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Plates%20Abductors%20Press+form"
  },
  {
    "id": "ex_81",
    "name": "Single-Arm/Leg Plates Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Plates Abductors Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Plates%20Abductors%20Press+form"
  },
  {
    "id": "ex_82",
    "name": "Standard Resistance Band Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Resistance Band Abductors Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Resistance%20Band%20Abductors%20Press+form"
  },
  {
    "id": "ex_83",
    "name": "Incline Resistance Band Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Resistance Band Abductors Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Resistance%20Band%20Abductors%20Press+form"
  },
  {
    "id": "ex_84",
    "name": "Decline Resistance Band Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Resistance Band Abductors Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Resistance%20Band%20Abductors%20Press+form"
  },
  {
    "id": "ex_85",
    "name": "Single-Arm/Leg Resistance Band Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Resistance Band Abductors Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Resistance%20Band%20Abductors%20Press+form"
  },
  {
    "id": "ex_86",
    "name": "Standard Suspension Band Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Suspension Band Abductors Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Suspension%20Band%20Abductors%20Press+form"
  },
  {
    "id": "ex_87",
    "name": "Incline Suspension Band Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Suspension Band Abductors Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Suspension%20Band%20Abductors%20Press+form"
  },
  {
    "id": "ex_88",
    "name": "Decline Suspension Band Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Suspension Band Abductors Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Suspension%20Band%20Abductors%20Press+form"
  },
  {
    "id": "ex_89",
    "name": "Single-Arm/Leg Suspension Band Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Suspension Band Abductors Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Suspension%20Band%20Abductors%20Press+form"
  },
  {
    "id": "ex_90",
    "name": "Standard Wheel Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Wheel Abductors Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Wheel%20Abductors%20Press+form"
  },
  {
    "id": "ex_91",
    "name": "Incline Wheel Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Wheel Abductors Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Wheel%20Abductors%20Press+form"
  },
  {
    "id": "ex_92",
    "name": "Decline Wheel Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Wheel Abductors Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Wheel%20Abductors%20Press+form"
  },
  {
    "id": "ex_93",
    "name": "Single-Arm/Leg Wheel Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Wheel Abductors Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Wheel%20Abductors%20Press+form"
  },
  {
    "id": "ex_94",
    "name": "Standard Ball Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Ball Abductors Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Ball%20Abductors%20Press+form"
  },
  {
    "id": "ex_95",
    "name": "Incline Ball Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Ball Abductors Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Ball%20Abductors%20Press+form"
  },
  {
    "id": "ex_96",
    "name": "Decline Ball Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Ball Abductors Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Ball%20Abductors%20Press+form"
  },
  {
    "id": "ex_97",
    "name": "Single-Arm/Leg Ball Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Ball Abductors Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Ball%20Abductors%20Press+form"
  },
  {
    "id": "ex_98",
    "name": "Standard Box Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Box Abductors Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Box%20Abductors%20Press+form"
  },
  {
    "id": "ex_99",
    "name": "Incline Box Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Box Abductors Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Box%20Abductors%20Press+form"
  },
  {
    "id": "ex_100",
    "name": "Decline Box Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Box Abductors Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Box%20Abductors%20Press+form"
  },
  {
    "id": "ex_101",
    "name": "Single-Arm/Leg Box Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Box Abductors Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Box%20Abductors%20Press+form"
  },
  {
    "id": "ex_102",
    "name": "Standard Rope Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Rope Abductors Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Rope%20Abductors%20Press+form"
  },
  {
    "id": "ex_103",
    "name": "Incline Rope Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Rope Abductors Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Rope%20Abductors%20Press+form"
  },
  {
    "id": "ex_104",
    "name": "Decline Rope Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Rope Abductors Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Rope%20Abductors%20Press+form"
  },
  {
    "id": "ex_105",
    "name": "Single-Arm/Leg Rope Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Rope Abductors Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Rope%20Abductors%20Press+form"
  },
  {
    "id": "ex_106",
    "name": "Standard Sled Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Sled",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Sled Abductors Press using Sled. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Sled%20Abductors%20Press+form"
  },
  {
    "id": "ex_107",
    "name": "Incline Sled Abductors Press",
    "muscles": [
      "Abductors"
    ],
    "equipment": "Sled",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Sled Abductors Press using Sled. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Sled%20Abductors%20Press+form"
  },
  {
    "id": "ex_108",
    "name": "Standard Bodyweight Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Bodyweight Adductors Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Bodyweight%20Adductors%20Press+form"
  },
  {
    "id": "ex_109",
    "name": "Incline Bodyweight Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Bodyweight Adductors Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Bodyweight%20Adductors%20Press+form"
  },
  {
    "id": "ex_110",
    "name": "Decline Bodyweight Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Bodyweight Adductors Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Bodyweight%20Adductors%20Press+form"
  },
  {
    "id": "ex_111",
    "name": "Single-Arm/Leg Bodyweight Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Bodyweight Adductors Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Bodyweight%20Adductors%20Press+form"
  },
  {
    "id": "ex_112",
    "name": "Standard Barbell Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Barbell Adductors Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Barbell%20Adductors%20Press+form"
  },
  {
    "id": "ex_113",
    "name": "Incline Barbell Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Barbell Adductors Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Barbell%20Adductors%20Press+form"
  },
  {
    "id": "ex_114",
    "name": "Decline Barbell Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Barbell Adductors Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Barbell%20Adductors%20Press+form"
  },
  {
    "id": "ex_115",
    "name": "Single-Arm/Leg Barbell Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Barbell Adductors Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Barbell%20Adductors%20Press+form"
  },
  {
    "id": "ex_116",
    "name": "Standard Dumbbells Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Dumbbells Adductors Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Dumbbells%20Adductors%20Press+form"
  },
  {
    "id": "ex_117",
    "name": "Incline Dumbbells Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Dumbbells Adductors Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Dumbbells%20Adductors%20Press+form"
  },
  {
    "id": "ex_118",
    "name": "Decline Dumbbells Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Dumbbells Adductors Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Dumbbells%20Adductors%20Press+form"
  },
  {
    "id": "ex_119",
    "name": "Single-Arm/Leg Dumbbells Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Dumbbells Adductors Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Dumbbells%20Adductors%20Press+form"
  },
  {
    "id": "ex_120",
    "name": "Standard Kettlebell Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Kettlebell Adductors Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Kettlebell%20Adductors%20Press+form"
  },
  {
    "id": "ex_121",
    "name": "Incline Kettlebell Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Kettlebell Adductors Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Kettlebell%20Adductors%20Press+form"
  },
  {
    "id": "ex_122",
    "name": "Decline Kettlebell Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Kettlebell Adductors Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Kettlebell%20Adductors%20Press+form"
  },
  {
    "id": "ex_123",
    "name": "Single-Arm/Leg Kettlebell Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Kettlebell Adductors Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Kettlebell%20Adductors%20Press+form"
  },
  {
    "id": "ex_124",
    "name": "Standard Machines Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Machines Adductors Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Machines%20Adductors%20Press+form"
  },
  {
    "id": "ex_125",
    "name": "Incline Machines Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Machines Adductors Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Machines%20Adductors%20Press+form"
  },
  {
    "id": "ex_126",
    "name": "Decline Machines Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Machines Adductors Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Machines%20Adductors%20Press+form"
  },
  {
    "id": "ex_127",
    "name": "Single-Arm/Leg Machines Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Machines Adductors Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Machines%20Adductors%20Press+form"
  },
  {
    "id": "ex_128",
    "name": "Standard Plates Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Plates Adductors Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Plates%20Adductors%20Press+form"
  },
  {
    "id": "ex_129",
    "name": "Incline Plates Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Plates Adductors Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Plates%20Adductors%20Press+form"
  },
  {
    "id": "ex_130",
    "name": "Decline Plates Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Plates Adductors Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Plates%20Adductors%20Press+form"
  },
  {
    "id": "ex_131",
    "name": "Single-Arm/Leg Plates Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Plates Adductors Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Plates%20Adductors%20Press+form"
  },
  {
    "id": "ex_132",
    "name": "Standard Resistance Band Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Resistance Band Adductors Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Resistance%20Band%20Adductors%20Press+form"
  },
  {
    "id": "ex_133",
    "name": "Incline Resistance Band Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Resistance Band Adductors Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Resistance%20Band%20Adductors%20Press+form"
  },
  {
    "id": "ex_134",
    "name": "Decline Resistance Band Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Resistance Band Adductors Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Resistance%20Band%20Adductors%20Press+form"
  },
  {
    "id": "ex_135",
    "name": "Single-Arm/Leg Resistance Band Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Resistance Band Adductors Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Resistance%20Band%20Adductors%20Press+form"
  },
  {
    "id": "ex_136",
    "name": "Standard Suspension Band Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Suspension Band Adductors Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Suspension%20Band%20Adductors%20Press+form"
  },
  {
    "id": "ex_137",
    "name": "Incline Suspension Band Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Suspension Band Adductors Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Suspension%20Band%20Adductors%20Press+form"
  },
  {
    "id": "ex_138",
    "name": "Decline Suspension Band Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Suspension Band Adductors Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Suspension%20Band%20Adductors%20Press+form"
  },
  {
    "id": "ex_139",
    "name": "Single-Arm/Leg Suspension Band Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Suspension Band Adductors Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Suspension%20Band%20Adductors%20Press+form"
  },
  {
    "id": "ex_140",
    "name": "Standard Wheel Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Wheel Adductors Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Wheel%20Adductors%20Press+form"
  },
  {
    "id": "ex_141",
    "name": "Incline Wheel Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Wheel Adductors Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Wheel%20Adductors%20Press+form"
  },
  {
    "id": "ex_142",
    "name": "Decline Wheel Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Wheel Adductors Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Wheel%20Adductors%20Press+form"
  },
  {
    "id": "ex_143",
    "name": "Single-Arm/Leg Wheel Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Wheel Adductors Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Wheel%20Adductors%20Press+form"
  },
  {
    "id": "ex_144",
    "name": "Standard Ball Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Ball Adductors Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Ball%20Adductors%20Press+form"
  },
  {
    "id": "ex_145",
    "name": "Incline Ball Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Ball Adductors Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Ball%20Adductors%20Press+form"
  },
  {
    "id": "ex_146",
    "name": "Decline Ball Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Ball Adductors Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Ball%20Adductors%20Press+form"
  },
  {
    "id": "ex_147",
    "name": "Single-Arm/Leg Ball Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Ball Adductors Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Ball%20Adductors%20Press+form"
  },
  {
    "id": "ex_148",
    "name": "Standard Box Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Box Adductors Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Box%20Adductors%20Press+form"
  },
  {
    "id": "ex_149",
    "name": "Incline Box Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Box Adductors Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Box%20Adductors%20Press+form"
  },
  {
    "id": "ex_150",
    "name": "Decline Box Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Box Adductors Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Box%20Adductors%20Press+form"
  },
  {
    "id": "ex_151",
    "name": "Single-Arm/Leg Box Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Box Adductors Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Box%20Adductors%20Press+form"
  },
  {
    "id": "ex_152",
    "name": "Standard Rope Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Rope Adductors Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Rope%20Adductors%20Press+form"
  },
  {
    "id": "ex_153",
    "name": "Incline Rope Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Rope Adductors Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Rope%20Adductors%20Press+form"
  },
  {
    "id": "ex_154",
    "name": "Decline Rope Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Rope Adductors Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Rope%20Adductors%20Press+form"
  },
  {
    "id": "ex_155",
    "name": "Single-Arm/Leg Rope Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Rope Adductors Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Rope%20Adductors%20Press+form"
  },
  {
    "id": "ex_156",
    "name": "Standard Sled Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Sled",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Sled Adductors Press using Sled. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Sled%20Adductors%20Press+form"
  },
  {
    "id": "ex_157",
    "name": "Incline Sled Adductors Press",
    "muscles": [
      "Adductors"
    ],
    "equipment": "Sled",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Sled Adductors Press using Sled. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Sled%20Adductors%20Press+form"
  },
  {
    "id": "ex_158",
    "name": "Standard Bodyweight Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Bodyweight Biceps Curl using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Bodyweight%20Biceps%20Curl+form"
  },
  {
    "id": "ex_159",
    "name": "Incline Bodyweight Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Bodyweight Biceps Curl using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Bodyweight%20Biceps%20Curl+form"
  },
  {
    "id": "ex_160",
    "name": "Decline Bodyweight Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Bodyweight Biceps Curl using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Bodyweight%20Biceps%20Curl+form"
  },
  {
    "id": "ex_161",
    "name": "Single-Arm/Leg Bodyweight Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Bodyweight Biceps Curl using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Bodyweight%20Biceps%20Curl+form"
  },
  {
    "id": "ex_162",
    "name": "Standard Barbell Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Barbell Biceps Curl using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Barbell%20Biceps%20Curl+form"
  },
  {
    "id": "ex_163",
    "name": "Incline Barbell Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Barbell Biceps Curl using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Barbell%20Biceps%20Curl+form"
  },
  {
    "id": "ex_164",
    "name": "Decline Barbell Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Barbell Biceps Curl using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Barbell%20Biceps%20Curl+form"
  },
  {
    "id": "ex_165",
    "name": "Single-Arm/Leg Barbell Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Barbell Biceps Curl using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Barbell%20Biceps%20Curl+form"
  },
  {
    "id": "ex_166",
    "name": "Standard Dumbbells Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Dumbbells Biceps Curl using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Dumbbells%20Biceps%20Curl+form"
  },
  {
    "id": "ex_167",
    "name": "Incline Dumbbells Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Dumbbells Biceps Curl using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Dumbbells%20Biceps%20Curl+form"
  },
  {
    "id": "ex_168",
    "name": "Decline Dumbbells Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Dumbbells Biceps Curl using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Dumbbells%20Biceps%20Curl+form"
  },
  {
    "id": "ex_169",
    "name": "Single-Arm/Leg Dumbbells Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Dumbbells Biceps Curl using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Dumbbells%20Biceps%20Curl+form"
  },
  {
    "id": "ex_170",
    "name": "Standard Kettlebell Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Kettlebell Biceps Curl using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Kettlebell%20Biceps%20Curl+form"
  },
  {
    "id": "ex_171",
    "name": "Incline Kettlebell Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Kettlebell Biceps Curl using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Kettlebell%20Biceps%20Curl+form"
  },
  {
    "id": "ex_172",
    "name": "Decline Kettlebell Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Kettlebell Biceps Curl using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Kettlebell%20Biceps%20Curl+form"
  },
  {
    "id": "ex_173",
    "name": "Single-Arm/Leg Kettlebell Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Kettlebell Biceps Curl using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Kettlebell%20Biceps%20Curl+form"
  },
  {
    "id": "ex_174",
    "name": "Standard Machines Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Machines Biceps Curl using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Machines%20Biceps%20Curl+form"
  },
  {
    "id": "ex_175",
    "name": "Incline Machines Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Machines Biceps Curl using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Machines%20Biceps%20Curl+form"
  },
  {
    "id": "ex_176",
    "name": "Decline Machines Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Machines Biceps Curl using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Machines%20Biceps%20Curl+form"
  },
  {
    "id": "ex_177",
    "name": "Single-Arm/Leg Machines Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Machines Biceps Curl using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Machines%20Biceps%20Curl+form"
  },
  {
    "id": "ex_178",
    "name": "Standard Plates Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Plates Biceps Curl using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Plates%20Biceps%20Curl+form"
  },
  {
    "id": "ex_179",
    "name": "Incline Plates Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Plates Biceps Curl using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Plates%20Biceps%20Curl+form"
  },
  {
    "id": "ex_180",
    "name": "Decline Plates Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Plates Biceps Curl using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Plates%20Biceps%20Curl+form"
  },
  {
    "id": "ex_181",
    "name": "Single-Arm/Leg Plates Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Plates Biceps Curl using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Plates%20Biceps%20Curl+form"
  },
  {
    "id": "ex_182",
    "name": "Standard Resistance Band Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Resistance Band Biceps Curl using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Resistance%20Band%20Biceps%20Curl+form"
  },
  {
    "id": "ex_183",
    "name": "Incline Resistance Band Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Resistance Band Biceps Curl using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Resistance%20Band%20Biceps%20Curl+form"
  },
  {
    "id": "ex_184",
    "name": "Decline Resistance Band Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Resistance Band Biceps Curl using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Resistance%20Band%20Biceps%20Curl+form"
  },
  {
    "id": "ex_185",
    "name": "Single-Arm/Leg Resistance Band Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Resistance Band Biceps Curl using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Resistance%20Band%20Biceps%20Curl+form"
  },
  {
    "id": "ex_186",
    "name": "Standard Suspension Band Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Suspension Band Biceps Curl using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Suspension%20Band%20Biceps%20Curl+form"
  },
  {
    "id": "ex_187",
    "name": "Incline Suspension Band Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Suspension Band Biceps Curl using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Suspension%20Band%20Biceps%20Curl+form"
  },
  {
    "id": "ex_188",
    "name": "Decline Suspension Band Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Suspension Band Biceps Curl using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Suspension%20Band%20Biceps%20Curl+form"
  },
  {
    "id": "ex_189",
    "name": "Single-Arm/Leg Suspension Band Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Suspension Band Biceps Curl using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Suspension%20Band%20Biceps%20Curl+form"
  },
  {
    "id": "ex_190",
    "name": "Standard Wheel Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Wheel Biceps Curl using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Wheel%20Biceps%20Curl+form"
  },
  {
    "id": "ex_191",
    "name": "Incline Wheel Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Wheel Biceps Curl using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Wheel%20Biceps%20Curl+form"
  },
  {
    "id": "ex_192",
    "name": "Decline Wheel Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Wheel Biceps Curl using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Wheel%20Biceps%20Curl+form"
  },
  {
    "id": "ex_193",
    "name": "Single-Arm/Leg Wheel Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Wheel Biceps Curl using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Wheel%20Biceps%20Curl+form"
  },
  {
    "id": "ex_194",
    "name": "Standard Ball Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Ball Biceps Curl using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Ball%20Biceps%20Curl+form"
  },
  {
    "id": "ex_195",
    "name": "Incline Ball Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Ball Biceps Curl using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Ball%20Biceps%20Curl+form"
  },
  {
    "id": "ex_196",
    "name": "Decline Ball Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Ball Biceps Curl using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Ball%20Biceps%20Curl+form"
  },
  {
    "id": "ex_197",
    "name": "Single-Arm/Leg Ball Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Ball Biceps Curl using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Ball%20Biceps%20Curl+form"
  },
  {
    "id": "ex_198",
    "name": "Standard Box Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Box Biceps Curl using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Box%20Biceps%20Curl+form"
  },
  {
    "id": "ex_199",
    "name": "Incline Box Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Box Biceps Curl using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Box%20Biceps%20Curl+form"
  },
  {
    "id": "ex_200",
    "name": "Decline Box Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Box Biceps Curl using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Box%20Biceps%20Curl+form"
  },
  {
    "id": "ex_201",
    "name": "Single-Arm/Leg Box Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Box Biceps Curl using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Box%20Biceps%20Curl+form"
  },
  {
    "id": "ex_202",
    "name": "Standard Rope Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Rope Biceps Curl using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Rope%20Biceps%20Curl+form"
  },
  {
    "id": "ex_203",
    "name": "Incline Rope Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Rope Biceps Curl using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Rope%20Biceps%20Curl+form"
  },
  {
    "id": "ex_204",
    "name": "Decline Rope Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Rope Biceps Curl using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Rope%20Biceps%20Curl+form"
  },
  {
    "id": "ex_205",
    "name": "Single-Arm/Leg Rope Biceps Curl",
    "muscles": [
      "Biceps"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Rope Biceps Curl using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Rope%20Biceps%20Curl+form"
  },
  {
    "id": "ex_206",
    "name": "Standard Bodyweight Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Bodyweight Triceps Extension using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Bodyweight%20Triceps%20Extension+form"
  },
  {
    "id": "ex_207",
    "name": "Incline Bodyweight Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Bodyweight Triceps Extension using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Bodyweight%20Triceps%20Extension+form"
  },
  {
    "id": "ex_208",
    "name": "Decline Bodyweight Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Bodyweight Triceps Extension using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Bodyweight%20Triceps%20Extension+form"
  },
  {
    "id": "ex_209",
    "name": "Single-Arm/Leg Bodyweight Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Bodyweight Triceps Extension using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Bodyweight%20Triceps%20Extension+form"
  },
  {
    "id": "ex_210",
    "name": "Standard Barbell Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Barbell Triceps Extension using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Barbell%20Triceps%20Extension+form"
  },
  {
    "id": "ex_211",
    "name": "Incline Barbell Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Barbell Triceps Extension using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Barbell%20Triceps%20Extension+form"
  },
  {
    "id": "ex_212",
    "name": "Decline Barbell Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Barbell Triceps Extension using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Barbell%20Triceps%20Extension+form"
  },
  {
    "id": "ex_213",
    "name": "Single-Arm/Leg Barbell Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Barbell Triceps Extension using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Barbell%20Triceps%20Extension+form"
  },
  {
    "id": "ex_214",
    "name": "Standard Dumbbells Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Dumbbells Triceps Extension using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Dumbbells%20Triceps%20Extension+form"
  },
  {
    "id": "ex_215",
    "name": "Incline Dumbbells Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Dumbbells Triceps Extension using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Dumbbells%20Triceps%20Extension+form"
  },
  {
    "id": "ex_216",
    "name": "Decline Dumbbells Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Dumbbells Triceps Extension using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Dumbbells%20Triceps%20Extension+form"
  },
  {
    "id": "ex_217",
    "name": "Single-Arm/Leg Dumbbells Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Dumbbells Triceps Extension using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Dumbbells%20Triceps%20Extension+form"
  },
  {
    "id": "ex_218",
    "name": "Standard Kettlebell Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Kettlebell Triceps Extension using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Kettlebell%20Triceps%20Extension+form"
  },
  {
    "id": "ex_219",
    "name": "Incline Kettlebell Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Kettlebell Triceps Extension using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Kettlebell%20Triceps%20Extension+form"
  },
  {
    "id": "ex_220",
    "name": "Decline Kettlebell Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Kettlebell Triceps Extension using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Kettlebell%20Triceps%20Extension+form"
  },
  {
    "id": "ex_221",
    "name": "Single-Arm/Leg Kettlebell Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Kettlebell Triceps Extension using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Kettlebell%20Triceps%20Extension+form"
  },
  {
    "id": "ex_222",
    "name": "Standard Machines Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Machines Triceps Extension using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Machines%20Triceps%20Extension+form"
  },
  {
    "id": "ex_223",
    "name": "Incline Machines Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Machines Triceps Extension using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Machines%20Triceps%20Extension+form"
  },
  {
    "id": "ex_224",
    "name": "Decline Machines Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Machines Triceps Extension using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Machines%20Triceps%20Extension+form"
  },
  {
    "id": "ex_225",
    "name": "Single-Arm/Leg Machines Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Machines Triceps Extension using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Machines%20Triceps%20Extension+form"
  },
  {
    "id": "ex_226",
    "name": "Standard Plates Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Plates Triceps Extension using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Plates%20Triceps%20Extension+form"
  },
  {
    "id": "ex_227",
    "name": "Incline Plates Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Plates Triceps Extension using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Plates%20Triceps%20Extension+form"
  },
  {
    "id": "ex_228",
    "name": "Decline Plates Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Plates Triceps Extension using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Plates%20Triceps%20Extension+form"
  },
  {
    "id": "ex_229",
    "name": "Single-Arm/Leg Plates Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Plates Triceps Extension using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Plates%20Triceps%20Extension+form"
  },
  {
    "id": "ex_230",
    "name": "Standard Resistance Band Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Resistance Band Triceps Extension using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Resistance%20Band%20Triceps%20Extension+form"
  },
  {
    "id": "ex_231",
    "name": "Incline Resistance Band Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Resistance Band Triceps Extension using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Resistance%20Band%20Triceps%20Extension+form"
  },
  {
    "id": "ex_232",
    "name": "Decline Resistance Band Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Resistance Band Triceps Extension using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Resistance%20Band%20Triceps%20Extension+form"
  },
  {
    "id": "ex_233",
    "name": "Single-Arm/Leg Resistance Band Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Resistance Band Triceps Extension using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Resistance%20Band%20Triceps%20Extension+form"
  },
  {
    "id": "ex_234",
    "name": "Standard Suspension Band Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Suspension Band Triceps Extension using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Suspension%20Band%20Triceps%20Extension+form"
  },
  {
    "id": "ex_235",
    "name": "Incline Suspension Band Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Suspension Band Triceps Extension using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Suspension%20Band%20Triceps%20Extension+form"
  },
  {
    "id": "ex_236",
    "name": "Decline Suspension Band Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Suspension Band Triceps Extension using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Suspension%20Band%20Triceps%20Extension+form"
  },
  {
    "id": "ex_237",
    "name": "Single-Arm/Leg Suspension Band Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Suspension Band Triceps Extension using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Suspension%20Band%20Triceps%20Extension+form"
  },
  {
    "id": "ex_238",
    "name": "Standard Wheel Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Wheel Triceps Extension using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Wheel%20Triceps%20Extension+form"
  },
  {
    "id": "ex_239",
    "name": "Incline Wheel Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Wheel Triceps Extension using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Wheel%20Triceps%20Extension+form"
  },
  {
    "id": "ex_240",
    "name": "Decline Wheel Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Wheel Triceps Extension using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Wheel%20Triceps%20Extension+form"
  },
  {
    "id": "ex_241",
    "name": "Single-Arm/Leg Wheel Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Wheel Triceps Extension using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Wheel%20Triceps%20Extension+form"
  },
  {
    "id": "ex_242",
    "name": "Standard Ball Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Ball Triceps Extension using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Ball%20Triceps%20Extension+form"
  },
  {
    "id": "ex_243",
    "name": "Incline Ball Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Ball Triceps Extension using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Ball%20Triceps%20Extension+form"
  },
  {
    "id": "ex_244",
    "name": "Decline Ball Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Ball Triceps Extension using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Ball%20Triceps%20Extension+form"
  },
  {
    "id": "ex_245",
    "name": "Single-Arm/Leg Ball Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Ball Triceps Extension using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Ball%20Triceps%20Extension+form"
  },
  {
    "id": "ex_246",
    "name": "Standard Box Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Box Triceps Extension using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Box%20Triceps%20Extension+form"
  },
  {
    "id": "ex_247",
    "name": "Incline Box Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Box Triceps Extension using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Box%20Triceps%20Extension+form"
  },
  {
    "id": "ex_248",
    "name": "Decline Box Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Box Triceps Extension using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Box%20Triceps%20Extension+form"
  },
  {
    "id": "ex_249",
    "name": "Single-Arm/Leg Box Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Box Triceps Extension using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Box%20Triceps%20Extension+form"
  },
  {
    "id": "ex_250",
    "name": "Standard Rope Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Rope Triceps Extension using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Rope%20Triceps%20Extension+form"
  },
  {
    "id": "ex_251",
    "name": "Incline Rope Triceps Extension",
    "muscles": [
      "Triceps"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Rope Triceps Extension using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Rope%20Triceps%20Extension+form"
  },
  {
    "id": "ex_252",
    "name": "Standard Bodyweight Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Bodyweight Calves Raise using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Bodyweight%20Calves%20Raise+form"
  },
  {
    "id": "ex_253",
    "name": "Incline Bodyweight Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Bodyweight Calves Raise using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Bodyweight%20Calves%20Raise+form"
  },
  {
    "id": "ex_254",
    "name": "Decline Bodyweight Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Bodyweight Calves Raise using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Bodyweight%20Calves%20Raise+form"
  },
  {
    "id": "ex_255",
    "name": "Single-Arm/Leg Bodyweight Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Bodyweight Calves Raise using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Bodyweight%20Calves%20Raise+form"
  },
  {
    "id": "ex_256",
    "name": "Standard Barbell Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Barbell Calves Raise using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Barbell%20Calves%20Raise+form"
  },
  {
    "id": "ex_257",
    "name": "Incline Barbell Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Barbell Calves Raise using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Barbell%20Calves%20Raise+form"
  },
  {
    "id": "ex_258",
    "name": "Decline Barbell Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Barbell Calves Raise using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Barbell%20Calves%20Raise+form"
  },
  {
    "id": "ex_259",
    "name": "Single-Arm/Leg Barbell Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Barbell Calves Raise using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Barbell%20Calves%20Raise+form"
  },
  {
    "id": "ex_260",
    "name": "Standard Dumbbells Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Dumbbells Calves Raise using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Dumbbells%20Calves%20Raise+form"
  },
  {
    "id": "ex_261",
    "name": "Incline Dumbbells Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Dumbbells Calves Raise using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Dumbbells%20Calves%20Raise+form"
  },
  {
    "id": "ex_262",
    "name": "Decline Dumbbells Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Dumbbells Calves Raise using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Dumbbells%20Calves%20Raise+form"
  },
  {
    "id": "ex_263",
    "name": "Single-Arm/Leg Dumbbells Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Dumbbells Calves Raise using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Dumbbells%20Calves%20Raise+form"
  },
  {
    "id": "ex_264",
    "name": "Standard Kettlebell Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Kettlebell Calves Raise using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Kettlebell%20Calves%20Raise+form"
  },
  {
    "id": "ex_265",
    "name": "Incline Kettlebell Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Kettlebell Calves Raise using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Kettlebell%20Calves%20Raise+form"
  },
  {
    "id": "ex_266",
    "name": "Decline Kettlebell Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Kettlebell Calves Raise using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Kettlebell%20Calves%20Raise+form"
  },
  {
    "id": "ex_267",
    "name": "Single-Arm/Leg Kettlebell Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Kettlebell Calves Raise using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Kettlebell%20Calves%20Raise+form"
  },
  {
    "id": "ex_268",
    "name": "Standard Machines Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Machines Calves Raise using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Machines%20Calves%20Raise+form"
  },
  {
    "id": "ex_269",
    "name": "Incline Machines Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Machines Calves Raise using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Machines%20Calves%20Raise+form"
  },
  {
    "id": "ex_270",
    "name": "Decline Machines Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Machines Calves Raise using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Machines%20Calves%20Raise+form"
  },
  {
    "id": "ex_271",
    "name": "Single-Arm/Leg Machines Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Machines Calves Raise using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Machines%20Calves%20Raise+form"
  },
  {
    "id": "ex_272",
    "name": "Standard Plates Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Plates Calves Raise using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Plates%20Calves%20Raise+form"
  },
  {
    "id": "ex_273",
    "name": "Incline Plates Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Plates Calves Raise using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Plates%20Calves%20Raise+form"
  },
  {
    "id": "ex_274",
    "name": "Decline Plates Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Plates Calves Raise using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Plates%20Calves%20Raise+form"
  },
  {
    "id": "ex_275",
    "name": "Single-Arm/Leg Plates Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Plates Calves Raise using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Plates%20Calves%20Raise+form"
  },
  {
    "id": "ex_276",
    "name": "Standard Resistance Band Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Resistance Band Calves Raise using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Resistance%20Band%20Calves%20Raise+form"
  },
  {
    "id": "ex_277",
    "name": "Incline Resistance Band Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Resistance Band Calves Raise using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Resistance%20Band%20Calves%20Raise+form"
  },
  {
    "id": "ex_278",
    "name": "Decline Resistance Band Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Resistance Band Calves Raise using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Resistance%20Band%20Calves%20Raise+form"
  },
  {
    "id": "ex_279",
    "name": "Single-Arm/Leg Resistance Band Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Resistance Band Calves Raise using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Resistance%20Band%20Calves%20Raise+form"
  },
  {
    "id": "ex_280",
    "name": "Standard Suspension Band Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Suspension Band Calves Raise using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Suspension%20Band%20Calves%20Raise+form"
  },
  {
    "id": "ex_281",
    "name": "Incline Suspension Band Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Suspension Band Calves Raise using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Suspension%20Band%20Calves%20Raise+form"
  },
  {
    "id": "ex_282",
    "name": "Decline Suspension Band Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Suspension Band Calves Raise using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Suspension%20Band%20Calves%20Raise+form"
  },
  {
    "id": "ex_283",
    "name": "Single-Arm/Leg Suspension Band Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Suspension Band Calves Raise using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Suspension%20Band%20Calves%20Raise+form"
  },
  {
    "id": "ex_284",
    "name": "Standard Wheel Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Wheel Calves Raise using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Wheel%20Calves%20Raise+form"
  },
  {
    "id": "ex_285",
    "name": "Incline Wheel Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Wheel Calves Raise using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Wheel%20Calves%20Raise+form"
  },
  {
    "id": "ex_286",
    "name": "Decline Wheel Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Wheel Calves Raise using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Wheel%20Calves%20Raise+form"
  },
  {
    "id": "ex_287",
    "name": "Single-Arm/Leg Wheel Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Wheel Calves Raise using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Wheel%20Calves%20Raise+form"
  },
  {
    "id": "ex_288",
    "name": "Standard Ball Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Ball Calves Raise using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Ball%20Calves%20Raise+form"
  },
  {
    "id": "ex_289",
    "name": "Incline Ball Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Ball Calves Raise using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Ball%20Calves%20Raise+form"
  },
  {
    "id": "ex_290",
    "name": "Decline Ball Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Ball Calves Raise using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Ball%20Calves%20Raise+form"
  },
  {
    "id": "ex_291",
    "name": "Single-Arm/Leg Ball Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Ball Calves Raise using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Ball%20Calves%20Raise+form"
  },
  {
    "id": "ex_292",
    "name": "Standard Box Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Box Calves Raise using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Box%20Calves%20Raise+form"
  },
  {
    "id": "ex_293",
    "name": "Incline Box Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Box Calves Raise using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Box%20Calves%20Raise+form"
  },
  {
    "id": "ex_294",
    "name": "Decline Box Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Box Calves Raise using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Box%20Calves%20Raise+form"
  },
  {
    "id": "ex_295",
    "name": "Single-Arm/Leg Box Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Box Calves Raise using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Box%20Calves%20Raise+form"
  },
  {
    "id": "ex_296",
    "name": "Standard Rope Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Rope Calves Raise using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Rope%20Calves%20Raise+form"
  },
  {
    "id": "ex_297",
    "name": "Incline Rope Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Rope Calves Raise using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Rope%20Calves%20Raise+form"
  },
  {
    "id": "ex_298",
    "name": "Decline Rope Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Rope Calves Raise using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Rope%20Calves%20Raise+form"
  },
  {
    "id": "ex_299",
    "name": "Single-Arm/Leg Rope Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Rope Calves Raise using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Rope%20Calves%20Raise+form"
  },
  {
    "id": "ex_300",
    "name": "Standard Sled Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Sled",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Sled Calves Raise using Sled. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Sled%20Calves%20Raise+form"
  },
  {
    "id": "ex_301",
    "name": "Incline Sled Calves Raise",
    "muscles": [
      "Calves"
    ],
    "equipment": "Sled",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Sled Calves Raise using Sled. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Sled%20Calves%20Raise+form"
  },
  {
    "id": "ex_302",
    "name": "Standard Bodyweight Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Bodyweight Chest Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Bodyweight%20Chest%20Press+form"
  },
  {
    "id": "ex_303",
    "name": "Incline Bodyweight Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Bodyweight Chest Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Bodyweight%20Chest%20Press+form"
  },
  {
    "id": "ex_304",
    "name": "Decline Bodyweight Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Bodyweight Chest Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Bodyweight%20Chest%20Press+form"
  },
  {
    "id": "ex_305",
    "name": "Single-Arm/Leg Bodyweight Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Bodyweight Chest Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Bodyweight%20Chest%20Press+form"
  },
  {
    "id": "ex_306",
    "name": "Standard Barbell Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Barbell Chest Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Barbell%20Chest%20Press+form"
  },
  {
    "id": "ex_307",
    "name": "Incline Barbell Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Barbell Chest Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Barbell%20Chest%20Press+form"
  },
  {
    "id": "ex_308",
    "name": "Decline Barbell Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Barbell Chest Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Barbell%20Chest%20Press+form"
  },
  {
    "id": "ex_309",
    "name": "Single-Arm/Leg Barbell Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Barbell Chest Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Barbell%20Chest%20Press+form"
  },
  {
    "id": "ex_310",
    "name": "Standard Dumbbells Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Dumbbells Chest Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Dumbbells%20Chest%20Press+form"
  },
  {
    "id": "ex_311",
    "name": "Incline Dumbbells Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Dumbbells Chest Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Dumbbells%20Chest%20Press+form"
  },
  {
    "id": "ex_312",
    "name": "Decline Dumbbells Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Dumbbells Chest Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Dumbbells%20Chest%20Press+form"
  },
  {
    "id": "ex_313",
    "name": "Single-Arm/Leg Dumbbells Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Dumbbells Chest Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Dumbbells%20Chest%20Press+form"
  },
  {
    "id": "ex_314",
    "name": "Standard Kettlebell Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Kettlebell Chest Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Kettlebell%20Chest%20Press+form"
  },
  {
    "id": "ex_315",
    "name": "Incline Kettlebell Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Kettlebell Chest Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Kettlebell%20Chest%20Press+form"
  },
  {
    "id": "ex_316",
    "name": "Decline Kettlebell Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Kettlebell Chest Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Kettlebell%20Chest%20Press+form"
  },
  {
    "id": "ex_317",
    "name": "Single-Arm/Leg Kettlebell Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Kettlebell Chest Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Kettlebell%20Chest%20Press+form"
  },
  {
    "id": "ex_318",
    "name": "Standard Machines Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Machines Chest Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Machines%20Chest%20Press+form"
  },
  {
    "id": "ex_319",
    "name": "Incline Machines Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Machines Chest Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Machines%20Chest%20Press+form"
  },
  {
    "id": "ex_320",
    "name": "Decline Machines Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Machines Chest Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Machines%20Chest%20Press+form"
  },
  {
    "id": "ex_321",
    "name": "Single-Arm/Leg Machines Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Machines Chest Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Machines%20Chest%20Press+form"
  },
  {
    "id": "ex_322",
    "name": "Standard Plates Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Plates Chest Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Plates%20Chest%20Press+form"
  },
  {
    "id": "ex_323",
    "name": "Incline Plates Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Plates Chest Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Plates%20Chest%20Press+form"
  },
  {
    "id": "ex_324",
    "name": "Decline Plates Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Plates Chest Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Plates%20Chest%20Press+form"
  },
  {
    "id": "ex_325",
    "name": "Single-Arm/Leg Plates Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Plates Chest Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Plates%20Chest%20Press+form"
  },
  {
    "id": "ex_326",
    "name": "Standard Resistance Band Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Resistance Band Chest Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Resistance%20Band%20Chest%20Press+form"
  },
  {
    "id": "ex_327",
    "name": "Incline Resistance Band Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Resistance Band Chest Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Resistance%20Band%20Chest%20Press+form"
  },
  {
    "id": "ex_328",
    "name": "Decline Resistance Band Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Resistance Band Chest Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Resistance%20Band%20Chest%20Press+form"
  },
  {
    "id": "ex_329",
    "name": "Single-Arm/Leg Resistance Band Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Resistance Band Chest Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Resistance%20Band%20Chest%20Press+form"
  },
  {
    "id": "ex_330",
    "name": "Standard Suspension Band Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Suspension Band Chest Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Suspension%20Band%20Chest%20Press+form"
  },
  {
    "id": "ex_331",
    "name": "Incline Suspension Band Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Suspension Band Chest Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Suspension%20Band%20Chest%20Press+form"
  },
  {
    "id": "ex_332",
    "name": "Decline Suspension Band Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Suspension Band Chest Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Suspension%20Band%20Chest%20Press+form"
  },
  {
    "id": "ex_333",
    "name": "Single-Arm/Leg Suspension Band Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Suspension Band Chest Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Suspension%20Band%20Chest%20Press+form"
  },
  {
    "id": "ex_334",
    "name": "Standard Wheel Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Wheel Chest Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Wheel%20Chest%20Press+form"
  },
  {
    "id": "ex_335",
    "name": "Incline Wheel Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Wheel Chest Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Wheel%20Chest%20Press+form"
  },
  {
    "id": "ex_336",
    "name": "Decline Wheel Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Wheel Chest Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Wheel%20Chest%20Press+form"
  },
  {
    "id": "ex_337",
    "name": "Single-Arm/Leg Wheel Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Wheel Chest Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Wheel%20Chest%20Press+form"
  },
  {
    "id": "ex_338",
    "name": "Standard Ball Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Ball Chest Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Ball%20Chest%20Press+form"
  },
  {
    "id": "ex_339",
    "name": "Incline Ball Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Ball Chest Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Ball%20Chest%20Press+form"
  },
  {
    "id": "ex_340",
    "name": "Decline Ball Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Ball Chest Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Ball%20Chest%20Press+form"
  },
  {
    "id": "ex_341",
    "name": "Single-Arm/Leg Ball Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Ball Chest Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Ball%20Chest%20Press+form"
  },
  {
    "id": "ex_342",
    "name": "Standard Box Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Box Chest Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Box%20Chest%20Press+form"
  },
  {
    "id": "ex_343",
    "name": "Incline Box Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Box Chest Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Box%20Chest%20Press+form"
  },
  {
    "id": "ex_344",
    "name": "Decline Box Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Box Chest Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Box%20Chest%20Press+form"
  },
  {
    "id": "ex_345",
    "name": "Single-Arm/Leg Box Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Box Chest Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Box%20Chest%20Press+form"
  },
  {
    "id": "ex_346",
    "name": "Standard Rope Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Rope Chest Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Rope%20Chest%20Press+form"
  },
  {
    "id": "ex_347",
    "name": "Incline Rope Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Rope Chest Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Rope%20Chest%20Press+form"
  },
  {
    "id": "ex_348",
    "name": "Decline Rope Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Rope Chest Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Rope%20Chest%20Press+form"
  },
  {
    "id": "ex_349",
    "name": "Single-Arm/Leg Rope Chest Press",
    "muscles": [
      "Chest"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Rope Chest Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Rope%20Chest%20Press+form"
  },
  {
    "id": "ex_350",
    "name": "Standard Bodyweight Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Bodyweight Forearms Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Bodyweight%20Forearms%20Press+form"
  },
  {
    "id": "ex_351",
    "name": "Incline Bodyweight Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Bodyweight Forearms Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Bodyweight%20Forearms%20Press+form"
  },
  {
    "id": "ex_352",
    "name": "Decline Bodyweight Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Bodyweight Forearms Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Bodyweight%20Forearms%20Press+form"
  },
  {
    "id": "ex_353",
    "name": "Single-Arm/Leg Bodyweight Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Bodyweight Forearms Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Bodyweight%20Forearms%20Press+form"
  },
  {
    "id": "ex_354",
    "name": "Standard Barbell Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Barbell Forearms Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Barbell%20Forearms%20Press+form"
  },
  {
    "id": "ex_355",
    "name": "Incline Barbell Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Barbell Forearms Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Barbell%20Forearms%20Press+form"
  },
  {
    "id": "ex_356",
    "name": "Decline Barbell Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Barbell Forearms Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Barbell%20Forearms%20Press+form"
  },
  {
    "id": "ex_357",
    "name": "Single-Arm/Leg Barbell Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Barbell Forearms Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Barbell%20Forearms%20Press+form"
  },
  {
    "id": "ex_358",
    "name": "Standard Dumbbells Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Dumbbells Forearms Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Dumbbells%20Forearms%20Press+form"
  },
  {
    "id": "ex_359",
    "name": "Incline Dumbbells Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Dumbbells Forearms Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Dumbbells%20Forearms%20Press+form"
  },
  {
    "id": "ex_360",
    "name": "Decline Dumbbells Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Dumbbells Forearms Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Dumbbells%20Forearms%20Press+form"
  },
  {
    "id": "ex_361",
    "name": "Single-Arm/Leg Dumbbells Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Dumbbells Forearms Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Dumbbells%20Forearms%20Press+form"
  },
  {
    "id": "ex_362",
    "name": "Standard Kettlebell Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Kettlebell Forearms Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Kettlebell%20Forearms%20Press+form"
  },
  {
    "id": "ex_363",
    "name": "Incline Kettlebell Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Kettlebell Forearms Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Kettlebell%20Forearms%20Press+form"
  },
  {
    "id": "ex_364",
    "name": "Decline Kettlebell Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Kettlebell Forearms Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Kettlebell%20Forearms%20Press+form"
  },
  {
    "id": "ex_365",
    "name": "Single-Arm/Leg Kettlebell Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Kettlebell Forearms Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Kettlebell%20Forearms%20Press+form"
  },
  {
    "id": "ex_366",
    "name": "Standard Machines Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Machines Forearms Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Machines%20Forearms%20Press+form"
  },
  {
    "id": "ex_367",
    "name": "Incline Machines Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Machines Forearms Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Machines%20Forearms%20Press+form"
  },
  {
    "id": "ex_368",
    "name": "Decline Machines Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Machines Forearms Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Machines%20Forearms%20Press+form"
  },
  {
    "id": "ex_369",
    "name": "Single-Arm/Leg Machines Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Machines Forearms Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Machines%20Forearms%20Press+form"
  },
  {
    "id": "ex_370",
    "name": "Standard Plates Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Plates Forearms Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Plates%20Forearms%20Press+form"
  },
  {
    "id": "ex_371",
    "name": "Incline Plates Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Plates Forearms Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Plates%20Forearms%20Press+form"
  },
  {
    "id": "ex_372",
    "name": "Decline Plates Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Plates Forearms Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Plates%20Forearms%20Press+form"
  },
  {
    "id": "ex_373",
    "name": "Single-Arm/Leg Plates Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Plates Forearms Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Plates%20Forearms%20Press+form"
  },
  {
    "id": "ex_374",
    "name": "Standard Resistance Band Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Resistance Band Forearms Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Resistance%20Band%20Forearms%20Press+form"
  },
  {
    "id": "ex_375",
    "name": "Incline Resistance Band Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Resistance Band Forearms Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Resistance%20Band%20Forearms%20Press+form"
  },
  {
    "id": "ex_376",
    "name": "Decline Resistance Band Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Resistance Band Forearms Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Resistance%20Band%20Forearms%20Press+form"
  },
  {
    "id": "ex_377",
    "name": "Single-Arm/Leg Resistance Band Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Resistance Band Forearms Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Resistance%20Band%20Forearms%20Press+form"
  },
  {
    "id": "ex_378",
    "name": "Standard Suspension Band Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Suspension Band Forearms Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Suspension%20Band%20Forearms%20Press+form"
  },
  {
    "id": "ex_379",
    "name": "Incline Suspension Band Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Suspension Band Forearms Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Suspension%20Band%20Forearms%20Press+form"
  },
  {
    "id": "ex_380",
    "name": "Decline Suspension Band Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Suspension Band Forearms Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Suspension%20Band%20Forearms%20Press+form"
  },
  {
    "id": "ex_381",
    "name": "Single-Arm/Leg Suspension Band Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Suspension Band Forearms Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Suspension%20Band%20Forearms%20Press+form"
  },
  {
    "id": "ex_382",
    "name": "Standard Wheel Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Wheel Forearms Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Wheel%20Forearms%20Press+form"
  },
  {
    "id": "ex_383",
    "name": "Incline Wheel Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Wheel Forearms Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Wheel%20Forearms%20Press+form"
  },
  {
    "id": "ex_384",
    "name": "Decline Wheel Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Wheel Forearms Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Wheel%20Forearms%20Press+form"
  },
  {
    "id": "ex_385",
    "name": "Single-Arm/Leg Wheel Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Wheel Forearms Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Wheel%20Forearms%20Press+form"
  },
  {
    "id": "ex_386",
    "name": "Standard Ball Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Ball Forearms Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Ball%20Forearms%20Press+form"
  },
  {
    "id": "ex_387",
    "name": "Incline Ball Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Ball Forearms Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Ball%20Forearms%20Press+form"
  },
  {
    "id": "ex_388",
    "name": "Decline Ball Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Ball Forearms Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Ball%20Forearms%20Press+form"
  },
  {
    "id": "ex_389",
    "name": "Single-Arm/Leg Ball Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Ball Forearms Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Ball%20Forearms%20Press+form"
  },
  {
    "id": "ex_390",
    "name": "Standard Box Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Box Forearms Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Box%20Forearms%20Press+form"
  },
  {
    "id": "ex_391",
    "name": "Incline Box Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Box Forearms Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Box%20Forearms%20Press+form"
  },
  {
    "id": "ex_392",
    "name": "Decline Box Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Box Forearms Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Box%20Forearms%20Press+form"
  },
  {
    "id": "ex_393",
    "name": "Single-Arm/Leg Box Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Box Forearms Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Box%20Forearms%20Press+form"
  },
  {
    "id": "ex_394",
    "name": "Standard Rope Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Rope Forearms Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Rope%20Forearms%20Press+form"
  },
  {
    "id": "ex_395",
    "name": "Incline Rope Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Rope Forearms Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Rope%20Forearms%20Press+form"
  },
  {
    "id": "ex_396",
    "name": "Decline Rope Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Rope Forearms Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Rope%20Forearms%20Press+form"
  },
  {
    "id": "ex_397",
    "name": "Single-Arm/Leg Rope Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Rope Forearms Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Rope%20Forearms%20Press+form"
  },
  {
    "id": "ex_398",
    "name": "Standard Sled Forearms Press",
    "muscles": [
      "Forearms"
    ],
    "equipment": "Sled",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Sled Forearms Press using Sled. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Sled%20Forearms%20Press+form"
  },
  {
    "id": "ex_399",
    "name": "Standard Bodyweight Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Cardio",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Bodyweight Cardio Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Bodyweight%20Cardio%20Press+form"
  },
  {
    "id": "ex_400",
    "name": "Incline Bodyweight Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Cardio",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Bodyweight Cardio Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Bodyweight%20Cardio%20Press+form"
  },
  {
    "id": "ex_401",
    "name": "Decline Bodyweight Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Cardio",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Bodyweight Cardio Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Bodyweight%20Cardio%20Press+form"
  },
  {
    "id": "ex_402",
    "name": "Single-Arm/Leg Bodyweight Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Cardio",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Bodyweight Cardio Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Bodyweight%20Cardio%20Press+form"
  },
  {
    "id": "ex_403",
    "name": "Standard Barbell Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Barbell",
    "category": "Cardio",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Barbell Cardio Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Barbell%20Cardio%20Press+form"
  },
  {
    "id": "ex_404",
    "name": "Incline Barbell Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Barbell",
    "category": "Cardio",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Barbell Cardio Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Barbell%20Cardio%20Press+form"
  },
  {
    "id": "ex_405",
    "name": "Decline Barbell Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Barbell",
    "category": "Cardio",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Barbell Cardio Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Barbell%20Cardio%20Press+form"
  },
  {
    "id": "ex_406",
    "name": "Single-Arm/Leg Barbell Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Barbell",
    "category": "Cardio",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Barbell Cardio Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Barbell%20Cardio%20Press+form"
  },
  {
    "id": "ex_407",
    "name": "Standard Dumbbells Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Dumbbells",
    "category": "Cardio",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Dumbbells Cardio Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Dumbbells%20Cardio%20Press+form"
  },
  {
    "id": "ex_408",
    "name": "Incline Dumbbells Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Dumbbells",
    "category": "Cardio",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Dumbbells Cardio Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Dumbbells%20Cardio%20Press+form"
  },
  {
    "id": "ex_409",
    "name": "Decline Dumbbells Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Dumbbells",
    "category": "Cardio",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Dumbbells Cardio Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Dumbbells%20Cardio%20Press+form"
  },
  {
    "id": "ex_410",
    "name": "Single-Arm/Leg Dumbbells Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Dumbbells",
    "category": "Cardio",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Dumbbells Cardio Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Dumbbells%20Cardio%20Press+form"
  },
  {
    "id": "ex_411",
    "name": "Standard Kettlebell Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Kettlebell",
    "category": "Cardio",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Kettlebell Cardio Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Kettlebell%20Cardio%20Press+form"
  },
  {
    "id": "ex_412",
    "name": "Incline Kettlebell Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Kettlebell",
    "category": "Cardio",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Kettlebell Cardio Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Kettlebell%20Cardio%20Press+form"
  },
  {
    "id": "ex_413",
    "name": "Decline Kettlebell Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Kettlebell",
    "category": "Cardio",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Kettlebell Cardio Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Kettlebell%20Cardio%20Press+form"
  },
  {
    "id": "ex_414",
    "name": "Single-Arm/Leg Kettlebell Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Kettlebell",
    "category": "Cardio",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Kettlebell Cardio Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Kettlebell%20Cardio%20Press+form"
  },
  {
    "id": "ex_415",
    "name": "Standard Machines Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Machines",
    "category": "Cardio",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Machines Cardio Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Machines%20Cardio%20Press+form"
  },
  {
    "id": "ex_416",
    "name": "Incline Machines Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Machines",
    "category": "Cardio",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Machines Cardio Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Machines%20Cardio%20Press+form"
  },
  {
    "id": "ex_417",
    "name": "Decline Machines Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Machines",
    "category": "Cardio",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Machines Cardio Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Machines%20Cardio%20Press+form"
  },
  {
    "id": "ex_418",
    "name": "Single-Arm/Leg Machines Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Machines",
    "category": "Cardio",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Machines Cardio Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Machines%20Cardio%20Press+form"
  },
  {
    "id": "ex_419",
    "name": "Standard Plates Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Plates",
    "category": "Cardio",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Plates Cardio Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Plates%20Cardio%20Press+form"
  },
  {
    "id": "ex_420",
    "name": "Incline Plates Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Plates",
    "category": "Cardio",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Plates Cardio Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Plates%20Cardio%20Press+form"
  },
  {
    "id": "ex_421",
    "name": "Decline Plates Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Plates",
    "category": "Cardio",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Plates Cardio Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Plates%20Cardio%20Press+form"
  },
  {
    "id": "ex_422",
    "name": "Single-Arm/Leg Plates Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Plates",
    "category": "Cardio",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Plates Cardio Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Plates%20Cardio%20Press+form"
  },
  {
    "id": "ex_423",
    "name": "Standard Resistance Band Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Resistance Band",
    "category": "Cardio",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Resistance Band Cardio Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Resistance%20Band%20Cardio%20Press+form"
  },
  {
    "id": "ex_424",
    "name": "Incline Resistance Band Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Resistance Band",
    "category": "Cardio",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Resistance Band Cardio Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Resistance%20Band%20Cardio%20Press+form"
  },
  {
    "id": "ex_425",
    "name": "Decline Resistance Band Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Resistance Band",
    "category": "Cardio",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Resistance Band Cardio Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Resistance%20Band%20Cardio%20Press+form"
  },
  {
    "id": "ex_426",
    "name": "Single-Arm/Leg Resistance Band Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Resistance Band",
    "category": "Cardio",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Resistance Band Cardio Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Resistance%20Band%20Cardio%20Press+form"
  },
  {
    "id": "ex_427",
    "name": "Standard Suspension Band Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Suspension Band",
    "category": "Cardio",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Suspension Band Cardio Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Suspension%20Band%20Cardio%20Press+form"
  },
  {
    "id": "ex_428",
    "name": "Incline Suspension Band Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Suspension Band",
    "category": "Cardio",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Suspension Band Cardio Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Suspension%20Band%20Cardio%20Press+form"
  },
  {
    "id": "ex_429",
    "name": "Decline Suspension Band Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Suspension Band",
    "category": "Cardio",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Suspension Band Cardio Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Suspension%20Band%20Cardio%20Press+form"
  },
  {
    "id": "ex_430",
    "name": "Single-Arm/Leg Suspension Band Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Suspension Band",
    "category": "Cardio",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Suspension Band Cardio Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Suspension%20Band%20Cardio%20Press+form"
  },
  {
    "id": "ex_431",
    "name": "Standard Wheel Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Wheel",
    "category": "Cardio",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Wheel Cardio Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Wheel%20Cardio%20Press+form"
  },
  {
    "id": "ex_432",
    "name": "Incline Wheel Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Wheel",
    "category": "Cardio",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Wheel Cardio Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Wheel%20Cardio%20Press+form"
  },
  {
    "id": "ex_433",
    "name": "Decline Wheel Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Wheel",
    "category": "Cardio",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Wheel Cardio Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Wheel%20Cardio%20Press+form"
  },
  {
    "id": "ex_434",
    "name": "Single-Arm/Leg Wheel Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Wheel",
    "category": "Cardio",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Wheel Cardio Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Wheel%20Cardio%20Press+form"
  },
  {
    "id": "ex_435",
    "name": "Standard Ball Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Ball",
    "category": "Cardio",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Ball Cardio Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Ball%20Cardio%20Press+form"
  },
  {
    "id": "ex_436",
    "name": "Incline Ball Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Ball",
    "category": "Cardio",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Ball Cardio Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Ball%20Cardio%20Press+form"
  },
  {
    "id": "ex_437",
    "name": "Decline Ball Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Ball",
    "category": "Cardio",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Ball Cardio Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Ball%20Cardio%20Press+form"
  },
  {
    "id": "ex_438",
    "name": "Single-Arm/Leg Ball Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Ball",
    "category": "Cardio",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Ball Cardio Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Ball%20Cardio%20Press+form"
  },
  {
    "id": "ex_439",
    "name": "Standard Box Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Box",
    "category": "Cardio",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Box Cardio Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Box%20Cardio%20Press+form"
  },
  {
    "id": "ex_440",
    "name": "Incline Box Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Box",
    "category": "Cardio",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Box Cardio Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Box%20Cardio%20Press+form"
  },
  {
    "id": "ex_441",
    "name": "Decline Box Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Box",
    "category": "Cardio",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Box Cardio Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Box%20Cardio%20Press+form"
  },
  {
    "id": "ex_442",
    "name": "Single-Arm/Leg Box Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Box",
    "category": "Cardio",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Box Cardio Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Box%20Cardio%20Press+form"
  },
  {
    "id": "ex_443",
    "name": "Standard Rope Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Rope",
    "category": "Cardio",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Rope Cardio Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Rope%20Cardio%20Press+form"
  },
  {
    "id": "ex_444",
    "name": "Incline Rope Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Rope",
    "category": "Cardio",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Rope Cardio Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Rope%20Cardio%20Press+form"
  },
  {
    "id": "ex_445",
    "name": "Decline Rope Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Rope",
    "category": "Cardio",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Rope Cardio Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Rope%20Cardio%20Press+form"
  },
  {
    "id": "ex_446",
    "name": "Single-Arm/Leg Rope Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Rope",
    "category": "Cardio",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Rope Cardio Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Rope%20Cardio%20Press+form"
  },
  {
    "id": "ex_447",
    "name": "Standard Sled Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Sled",
    "category": "Cardio",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Sled Cardio Press using Sled. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Sled%20Cardio%20Press+form"
  },
  {
    "id": "ex_448",
    "name": "Incline Sled Cardio Press",
    "muscles": [
      "Cardio"
    ],
    "equipment": "Sled",
    "category": "Cardio",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Sled Cardio Press using Sled. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Sled%20Cardio%20Press+form"
  },
  {
    "id": "ex_449",
    "name": "Standard Bodyweight Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Bodyweight Full-Body Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Bodyweight%20Full-Body%20Press+form"
  },
  {
    "id": "ex_450",
    "name": "Incline Bodyweight Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Bodyweight Full-Body Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Bodyweight%20Full-Body%20Press+form"
  },
  {
    "id": "ex_451",
    "name": "Decline Bodyweight Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Bodyweight Full-Body Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Bodyweight%20Full-Body%20Press+form"
  },
  {
    "id": "ex_452",
    "name": "Single-Arm/Leg Bodyweight Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Bodyweight Full-Body Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Bodyweight%20Full-Body%20Press+form"
  },
  {
    "id": "ex_453",
    "name": "Standard Barbell Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Barbell Full-Body Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Barbell%20Full-Body%20Press+form"
  },
  {
    "id": "ex_454",
    "name": "Incline Barbell Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Barbell Full-Body Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Barbell%20Full-Body%20Press+form"
  },
  {
    "id": "ex_455",
    "name": "Decline Barbell Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Barbell Full-Body Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Barbell%20Full-Body%20Press+form"
  },
  {
    "id": "ex_456",
    "name": "Single-Arm/Leg Barbell Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Barbell Full-Body Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Barbell%20Full-Body%20Press+form"
  },
  {
    "id": "ex_457",
    "name": "Standard Dumbbells Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Dumbbells Full-Body Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Dumbbells%20Full-Body%20Press+form"
  },
  {
    "id": "ex_458",
    "name": "Incline Dumbbells Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Dumbbells Full-Body Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Dumbbells%20Full-Body%20Press+form"
  },
  {
    "id": "ex_459",
    "name": "Decline Dumbbells Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Dumbbells Full-Body Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Dumbbells%20Full-Body%20Press+form"
  },
  {
    "id": "ex_460",
    "name": "Single-Arm/Leg Dumbbells Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Dumbbells Full-Body Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Dumbbells%20Full-Body%20Press+form"
  },
  {
    "id": "ex_461",
    "name": "Standard Kettlebell Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Kettlebell Full-Body Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Kettlebell%20Full-Body%20Press+form"
  },
  {
    "id": "ex_462",
    "name": "Incline Kettlebell Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Kettlebell Full-Body Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Kettlebell%20Full-Body%20Press+form"
  },
  {
    "id": "ex_463",
    "name": "Decline Kettlebell Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Kettlebell Full-Body Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Kettlebell%20Full-Body%20Press+form"
  },
  {
    "id": "ex_464",
    "name": "Single-Arm/Leg Kettlebell Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Kettlebell Full-Body Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Kettlebell%20Full-Body%20Press+form"
  },
  {
    "id": "ex_465",
    "name": "Standard Machines Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Machines Full-Body Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Machines%20Full-Body%20Press+form"
  },
  {
    "id": "ex_466",
    "name": "Incline Machines Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Machines Full-Body Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Machines%20Full-Body%20Press+form"
  },
  {
    "id": "ex_467",
    "name": "Decline Machines Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Machines Full-Body Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Machines%20Full-Body%20Press+form"
  },
  {
    "id": "ex_468",
    "name": "Single-Arm/Leg Machines Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Machines Full-Body Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Machines%20Full-Body%20Press+form"
  },
  {
    "id": "ex_469",
    "name": "Standard Plates Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Plates Full-Body Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Plates%20Full-Body%20Press+form"
  },
  {
    "id": "ex_470",
    "name": "Incline Plates Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Plates Full-Body Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Plates%20Full-Body%20Press+form"
  },
  {
    "id": "ex_471",
    "name": "Decline Plates Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Plates Full-Body Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Plates%20Full-Body%20Press+form"
  },
  {
    "id": "ex_472",
    "name": "Single-Arm/Leg Plates Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Plates Full-Body Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Plates%20Full-Body%20Press+form"
  },
  {
    "id": "ex_473",
    "name": "Standard Resistance Band Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Resistance Band Full-Body Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Resistance%20Band%20Full-Body%20Press+form"
  },
  {
    "id": "ex_474",
    "name": "Incline Resistance Band Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Resistance Band Full-Body Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Resistance%20Band%20Full-Body%20Press+form"
  },
  {
    "id": "ex_475",
    "name": "Decline Resistance Band Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Resistance Band Full-Body Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Resistance%20Band%20Full-Body%20Press+form"
  },
  {
    "id": "ex_476",
    "name": "Single-Arm/Leg Resistance Band Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Resistance Band Full-Body Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Resistance%20Band%20Full-Body%20Press+form"
  },
  {
    "id": "ex_477",
    "name": "Standard Suspension Band Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Suspension Band Full-Body Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Suspension%20Band%20Full-Body%20Press+form"
  },
  {
    "id": "ex_478",
    "name": "Incline Suspension Band Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Suspension Band Full-Body Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Suspension%20Band%20Full-Body%20Press+form"
  },
  {
    "id": "ex_479",
    "name": "Decline Suspension Band Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Suspension Band Full-Body Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Suspension%20Band%20Full-Body%20Press+form"
  },
  {
    "id": "ex_480",
    "name": "Single-Arm/Leg Suspension Band Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Suspension Band Full-Body Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Suspension%20Band%20Full-Body%20Press+form"
  },
  {
    "id": "ex_481",
    "name": "Standard Wheel Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Wheel Full-Body Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Wheel%20Full-Body%20Press+form"
  },
  {
    "id": "ex_482",
    "name": "Incline Wheel Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Wheel Full-Body Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Wheel%20Full-Body%20Press+form"
  },
  {
    "id": "ex_483",
    "name": "Decline Wheel Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Wheel Full-Body Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Wheel%20Full-Body%20Press+form"
  },
  {
    "id": "ex_484",
    "name": "Single-Arm/Leg Wheel Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Wheel Full-Body Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Wheel%20Full-Body%20Press+form"
  },
  {
    "id": "ex_485",
    "name": "Standard Ball Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Ball Full-Body Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Ball%20Full-Body%20Press+form"
  },
  {
    "id": "ex_486",
    "name": "Incline Ball Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Ball Full-Body Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Ball%20Full-Body%20Press+form"
  },
  {
    "id": "ex_487",
    "name": "Decline Ball Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Ball Full-Body Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Ball%20Full-Body%20Press+form"
  },
  {
    "id": "ex_488",
    "name": "Single-Arm/Leg Ball Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Ball Full-Body Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Ball%20Full-Body%20Press+form"
  },
  {
    "id": "ex_489",
    "name": "Standard Box Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Box Full-Body Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Box%20Full-Body%20Press+form"
  },
  {
    "id": "ex_490",
    "name": "Incline Box Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Box Full-Body Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Box%20Full-Body%20Press+form"
  },
  {
    "id": "ex_491",
    "name": "Decline Box Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Box Full-Body Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Box%20Full-Body%20Press+form"
  },
  {
    "id": "ex_492",
    "name": "Single-Arm/Leg Box Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Box Full-Body Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Box%20Full-Body%20Press+form"
  },
  {
    "id": "ex_493",
    "name": "Standard Rope Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Rope Full-Body Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Rope%20Full-Body%20Press+form"
  },
  {
    "id": "ex_494",
    "name": "Incline Rope Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Rope Full-Body Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Rope%20Full-Body%20Press+form"
  },
  {
    "id": "ex_495",
    "name": "Decline Rope Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Rope Full-Body Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Rope%20Full-Body%20Press+form"
  },
  {
    "id": "ex_496",
    "name": "Single-Arm/Leg Rope Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Rope Full-Body Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Rope%20Full-Body%20Press+form"
  },
  {
    "id": "ex_497",
    "name": "Standard Sled Full-Body Press",
    "muscles": [
      "Full-Body"
    ],
    "equipment": "Sled",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Sled Full-Body Press using Sled. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Sled%20Full-Body%20Press+form"
  },
  {
    "id": "ex_498",
    "name": "Standard Bodyweight Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Bodyweight Glutes Thrust using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Bodyweight%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_499",
    "name": "Incline Bodyweight Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Bodyweight Glutes Thrust using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Bodyweight%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_500",
    "name": "Decline Bodyweight Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Bodyweight Glutes Thrust using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Bodyweight%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_501",
    "name": "Single-Arm/Leg Bodyweight Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Bodyweight Glutes Thrust using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Bodyweight%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_502",
    "name": "Standard Barbell Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Barbell Glutes Thrust using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Barbell%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_503",
    "name": "Incline Barbell Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Barbell Glutes Thrust using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Barbell%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_504",
    "name": "Decline Barbell Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Barbell Glutes Thrust using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Barbell%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_505",
    "name": "Single-Arm/Leg Barbell Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Barbell Glutes Thrust using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Barbell%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_506",
    "name": "Standard Dumbbells Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Dumbbells Glutes Thrust using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Dumbbells%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_507",
    "name": "Incline Dumbbells Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Dumbbells Glutes Thrust using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Dumbbells%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_508",
    "name": "Decline Dumbbells Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Dumbbells Glutes Thrust using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Dumbbells%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_509",
    "name": "Single-Arm/Leg Dumbbells Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Dumbbells Glutes Thrust using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Dumbbells%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_510",
    "name": "Standard Kettlebell Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Kettlebell Glutes Thrust using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Kettlebell%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_511",
    "name": "Incline Kettlebell Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Kettlebell Glutes Thrust using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Kettlebell%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_512",
    "name": "Decline Kettlebell Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Kettlebell Glutes Thrust using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Kettlebell%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_513",
    "name": "Single-Arm/Leg Kettlebell Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Kettlebell Glutes Thrust using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Kettlebell%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_514",
    "name": "Standard Machines Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Machines Glutes Thrust using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Machines%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_515",
    "name": "Incline Machines Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Machines Glutes Thrust using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Machines%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_516",
    "name": "Decline Machines Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Machines Glutes Thrust using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Machines%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_517",
    "name": "Single-Arm/Leg Machines Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Machines Glutes Thrust using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Machines%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_518",
    "name": "Standard Plates Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Plates Glutes Thrust using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Plates%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_519",
    "name": "Incline Plates Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Plates Glutes Thrust using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Plates%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_520",
    "name": "Decline Plates Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Plates Glutes Thrust using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Plates%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_521",
    "name": "Single-Arm/Leg Plates Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Plates Glutes Thrust using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Plates%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_522",
    "name": "Standard Resistance Band Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Resistance Band Glutes Thrust using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Resistance%20Band%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_523",
    "name": "Incline Resistance Band Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Resistance Band Glutes Thrust using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Resistance%20Band%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_524",
    "name": "Decline Resistance Band Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Resistance Band Glutes Thrust using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Resistance%20Band%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_525",
    "name": "Single-Arm/Leg Resistance Band Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Resistance Band Glutes Thrust using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Resistance%20Band%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_526",
    "name": "Standard Suspension Band Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Suspension Band Glutes Thrust using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Suspension%20Band%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_527",
    "name": "Incline Suspension Band Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Suspension Band Glutes Thrust using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Suspension%20Band%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_528",
    "name": "Decline Suspension Band Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Suspension Band Glutes Thrust using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Suspension%20Band%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_529",
    "name": "Single-Arm/Leg Suspension Band Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Suspension Band Glutes Thrust using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Suspension%20Band%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_530",
    "name": "Standard Wheel Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Wheel Glutes Thrust using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Wheel%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_531",
    "name": "Incline Wheel Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Wheel Glutes Thrust using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Wheel%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_532",
    "name": "Decline Wheel Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Wheel Glutes Thrust using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Wheel%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_533",
    "name": "Single-Arm/Leg Wheel Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Wheel Glutes Thrust using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Wheel%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_534",
    "name": "Standard Ball Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Ball Glutes Thrust using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Ball%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_535",
    "name": "Incline Ball Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Ball Glutes Thrust using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Ball%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_536",
    "name": "Decline Ball Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Ball Glutes Thrust using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Ball%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_537",
    "name": "Single-Arm/Leg Ball Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Ball Glutes Thrust using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Ball%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_538",
    "name": "Standard Box Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Box Glutes Thrust using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Box%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_539",
    "name": "Incline Box Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Box Glutes Thrust using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Box%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_540",
    "name": "Decline Box Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Box Glutes Thrust using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Box%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_541",
    "name": "Single-Arm/Leg Box Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Box Glutes Thrust using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Box%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_542",
    "name": "Standard Rope Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Rope Glutes Thrust using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Rope%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_543",
    "name": "Incline Rope Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Rope Glutes Thrust using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Rope%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_544",
    "name": "Decline Rope Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Rope Glutes Thrust using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Rope%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_545",
    "name": "Single-Arm/Leg Rope Glutes Thrust",
    "muscles": [
      "Glutes"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Rope Glutes Thrust using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Rope%20Glutes%20Thrust+form"
  },
  {
    "id": "ex_546",
    "name": "Standard Bodyweight Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Bodyweight Hamstrings Curl using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Bodyweight%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_547",
    "name": "Incline Bodyweight Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Bodyweight Hamstrings Curl using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Bodyweight%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_548",
    "name": "Decline Bodyweight Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Bodyweight Hamstrings Curl using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Bodyweight%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_549",
    "name": "Single-Arm/Leg Bodyweight Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Bodyweight Hamstrings Curl using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Bodyweight%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_550",
    "name": "Standard Barbell Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Barbell Hamstrings Curl using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Barbell%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_551",
    "name": "Incline Barbell Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Barbell Hamstrings Curl using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Barbell%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_552",
    "name": "Decline Barbell Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Barbell Hamstrings Curl using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Barbell%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_553",
    "name": "Single-Arm/Leg Barbell Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Barbell Hamstrings Curl using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Barbell%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_554",
    "name": "Standard Dumbbells Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Dumbbells Hamstrings Curl using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Dumbbells%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_555",
    "name": "Incline Dumbbells Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Dumbbells Hamstrings Curl using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Dumbbells%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_556",
    "name": "Decline Dumbbells Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Dumbbells Hamstrings Curl using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Dumbbells%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_557",
    "name": "Single-Arm/Leg Dumbbells Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Dumbbells Hamstrings Curl using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Dumbbells%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_558",
    "name": "Standard Kettlebell Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Kettlebell Hamstrings Curl using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Kettlebell%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_559",
    "name": "Incline Kettlebell Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Kettlebell Hamstrings Curl using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Kettlebell%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_560",
    "name": "Decline Kettlebell Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Kettlebell Hamstrings Curl using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Kettlebell%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_561",
    "name": "Single-Arm/Leg Kettlebell Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Kettlebell Hamstrings Curl using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Kettlebell%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_562",
    "name": "Standard Machines Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Machines Hamstrings Curl using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Machines%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_563",
    "name": "Incline Machines Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Machines Hamstrings Curl using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Machines%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_564",
    "name": "Decline Machines Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Machines Hamstrings Curl using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Machines%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_565",
    "name": "Single-Arm/Leg Machines Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Machines Hamstrings Curl using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Machines%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_566",
    "name": "Standard Plates Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Plates Hamstrings Curl using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Plates%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_567",
    "name": "Incline Plates Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Plates Hamstrings Curl using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Plates%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_568",
    "name": "Decline Plates Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Plates Hamstrings Curl using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Plates%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_569",
    "name": "Single-Arm/Leg Plates Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Plates Hamstrings Curl using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Plates%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_570",
    "name": "Standard Resistance Band Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Resistance Band Hamstrings Curl using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Resistance%20Band%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_571",
    "name": "Incline Resistance Band Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Resistance Band Hamstrings Curl using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Resistance%20Band%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_572",
    "name": "Decline Resistance Band Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Resistance Band Hamstrings Curl using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Resistance%20Band%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_573",
    "name": "Single-Arm/Leg Resistance Band Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Resistance Band Hamstrings Curl using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Resistance%20Band%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_574",
    "name": "Standard Suspension Band Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Suspension Band Hamstrings Curl using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Suspension%20Band%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_575",
    "name": "Incline Suspension Band Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Suspension Band Hamstrings Curl using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Suspension%20Band%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_576",
    "name": "Decline Suspension Band Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Suspension Band Hamstrings Curl using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Suspension%20Band%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_577",
    "name": "Single-Arm/Leg Suspension Band Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Suspension Band Hamstrings Curl using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Suspension%20Band%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_578",
    "name": "Standard Wheel Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Wheel Hamstrings Curl using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Wheel%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_579",
    "name": "Incline Wheel Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Wheel Hamstrings Curl using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Wheel%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_580",
    "name": "Decline Wheel Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Wheel Hamstrings Curl using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Wheel%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_581",
    "name": "Single-Arm/Leg Wheel Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Wheel Hamstrings Curl using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Wheel%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_582",
    "name": "Standard Ball Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Ball Hamstrings Curl using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Ball%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_583",
    "name": "Incline Ball Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Ball Hamstrings Curl using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Ball%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_584",
    "name": "Decline Ball Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Ball Hamstrings Curl using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Ball%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_585",
    "name": "Single-Arm/Leg Ball Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Ball Hamstrings Curl using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Ball%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_586",
    "name": "Standard Box Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Box Hamstrings Curl using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Box%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_587",
    "name": "Incline Box Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Box Hamstrings Curl using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Box%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_588",
    "name": "Decline Box Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Box Hamstrings Curl using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Box%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_589",
    "name": "Single-Arm/Leg Box Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Box Hamstrings Curl using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Box%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_590",
    "name": "Standard Rope Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Rope Hamstrings Curl using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Rope%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_591",
    "name": "Incline Rope Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Rope Hamstrings Curl using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Rope%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_592",
    "name": "Decline Rope Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Rope Hamstrings Curl using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Rope%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_593",
    "name": "Single-Arm/Leg Rope Hamstrings Curl",
    "muscles": [
      "Hamstrings"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Rope Hamstrings Curl using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Rope%20Hamstrings%20Curl+form"
  },
  {
    "id": "ex_594",
    "name": "Standard Bodyweight Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Bodyweight Lats Row using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Bodyweight%20Lats%20Row+form"
  },
  {
    "id": "ex_595",
    "name": "Incline Bodyweight Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Bodyweight Lats Row using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Bodyweight%20Lats%20Row+form"
  },
  {
    "id": "ex_596",
    "name": "Decline Bodyweight Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Bodyweight Lats Row using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Bodyweight%20Lats%20Row+form"
  },
  {
    "id": "ex_597",
    "name": "Single-Arm/Leg Bodyweight Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Bodyweight Lats Row using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Bodyweight%20Lats%20Row+form"
  },
  {
    "id": "ex_598",
    "name": "Standard Barbell Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Barbell Lats Row using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Barbell%20Lats%20Row+form"
  },
  {
    "id": "ex_599",
    "name": "Incline Barbell Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Barbell Lats Row using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Barbell%20Lats%20Row+form"
  },
  {
    "id": "ex_600",
    "name": "Decline Barbell Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Barbell Lats Row using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Barbell%20Lats%20Row+form"
  },
  {
    "id": "ex_601",
    "name": "Single-Arm/Leg Barbell Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Barbell Lats Row using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Barbell%20Lats%20Row+form"
  },
  {
    "id": "ex_602",
    "name": "Standard Dumbbells Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Dumbbells Lats Row using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Dumbbells%20Lats%20Row+form"
  },
  {
    "id": "ex_603",
    "name": "Incline Dumbbells Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Dumbbells Lats Row using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Dumbbells%20Lats%20Row+form"
  },
  {
    "id": "ex_604",
    "name": "Decline Dumbbells Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Dumbbells Lats Row using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Dumbbells%20Lats%20Row+form"
  },
  {
    "id": "ex_605",
    "name": "Single-Arm/Leg Dumbbells Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Dumbbells Lats Row using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Dumbbells%20Lats%20Row+form"
  },
  {
    "id": "ex_606",
    "name": "Standard Kettlebell Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Kettlebell Lats Row using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Kettlebell%20Lats%20Row+form"
  },
  {
    "id": "ex_607",
    "name": "Incline Kettlebell Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Kettlebell Lats Row using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Kettlebell%20Lats%20Row+form"
  },
  {
    "id": "ex_608",
    "name": "Decline Kettlebell Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Kettlebell Lats Row using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Kettlebell%20Lats%20Row+form"
  },
  {
    "id": "ex_609",
    "name": "Single-Arm/Leg Kettlebell Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Kettlebell Lats Row using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Kettlebell%20Lats%20Row+form"
  },
  {
    "id": "ex_610",
    "name": "Standard Machines Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Machines Lats Row using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Machines%20Lats%20Row+form"
  },
  {
    "id": "ex_611",
    "name": "Incline Machines Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Machines Lats Row using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Machines%20Lats%20Row+form"
  },
  {
    "id": "ex_612",
    "name": "Decline Machines Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Machines Lats Row using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Machines%20Lats%20Row+form"
  },
  {
    "id": "ex_613",
    "name": "Single-Arm/Leg Machines Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Machines Lats Row using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Machines%20Lats%20Row+form"
  },
  {
    "id": "ex_614",
    "name": "Standard Plates Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Plates Lats Row using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Plates%20Lats%20Row+form"
  },
  {
    "id": "ex_615",
    "name": "Incline Plates Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Plates Lats Row using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Plates%20Lats%20Row+form"
  },
  {
    "id": "ex_616",
    "name": "Decline Plates Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Plates Lats Row using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Plates%20Lats%20Row+form"
  },
  {
    "id": "ex_617",
    "name": "Single-Arm/Leg Plates Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Plates Lats Row using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Plates%20Lats%20Row+form"
  },
  {
    "id": "ex_618",
    "name": "Standard Resistance Band Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Resistance Band Lats Row using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Resistance%20Band%20Lats%20Row+form"
  },
  {
    "id": "ex_619",
    "name": "Incline Resistance Band Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Resistance Band Lats Row using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Resistance%20Band%20Lats%20Row+form"
  },
  {
    "id": "ex_620",
    "name": "Decline Resistance Band Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Resistance Band Lats Row using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Resistance%20Band%20Lats%20Row+form"
  },
  {
    "id": "ex_621",
    "name": "Single-Arm/Leg Resistance Band Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Resistance Band Lats Row using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Resistance%20Band%20Lats%20Row+form"
  },
  {
    "id": "ex_622",
    "name": "Standard Suspension Band Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Suspension Band Lats Row using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Suspension%20Band%20Lats%20Row+form"
  },
  {
    "id": "ex_623",
    "name": "Incline Suspension Band Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Suspension Band Lats Row using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Suspension%20Band%20Lats%20Row+form"
  },
  {
    "id": "ex_624",
    "name": "Decline Suspension Band Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Suspension Band Lats Row using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Suspension%20Band%20Lats%20Row+form"
  },
  {
    "id": "ex_625",
    "name": "Single-Arm/Leg Suspension Band Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Suspension Band Lats Row using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Suspension%20Band%20Lats%20Row+form"
  },
  {
    "id": "ex_626",
    "name": "Standard Wheel Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Wheel Lats Row using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Wheel%20Lats%20Row+form"
  },
  {
    "id": "ex_627",
    "name": "Incline Wheel Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Wheel Lats Row using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Wheel%20Lats%20Row+form"
  },
  {
    "id": "ex_628",
    "name": "Decline Wheel Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Wheel Lats Row using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Wheel%20Lats%20Row+form"
  },
  {
    "id": "ex_629",
    "name": "Single-Arm/Leg Wheel Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Wheel Lats Row using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Wheel%20Lats%20Row+form"
  },
  {
    "id": "ex_630",
    "name": "Standard Ball Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Ball Lats Row using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Ball%20Lats%20Row+form"
  },
  {
    "id": "ex_631",
    "name": "Incline Ball Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Ball Lats Row using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Ball%20Lats%20Row+form"
  },
  {
    "id": "ex_632",
    "name": "Decline Ball Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Ball Lats Row using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Ball%20Lats%20Row+form"
  },
  {
    "id": "ex_633",
    "name": "Single-Arm/Leg Ball Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Ball Lats Row using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Ball%20Lats%20Row+form"
  },
  {
    "id": "ex_634",
    "name": "Standard Box Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Box Lats Row using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Box%20Lats%20Row+form"
  },
  {
    "id": "ex_635",
    "name": "Incline Box Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Box Lats Row using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Box%20Lats%20Row+form"
  },
  {
    "id": "ex_636",
    "name": "Decline Box Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Box Lats Row using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Box%20Lats%20Row+form"
  },
  {
    "id": "ex_637",
    "name": "Single-Arm/Leg Box Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Box Lats Row using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Box%20Lats%20Row+form"
  },
  {
    "id": "ex_638",
    "name": "Standard Rope Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Rope Lats Row using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Rope%20Lats%20Row+form"
  },
  {
    "id": "ex_639",
    "name": "Incline Rope Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Rope Lats Row using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Rope%20Lats%20Row+form"
  },
  {
    "id": "ex_640",
    "name": "Decline Rope Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Rope Lats Row using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Rope%20Lats%20Row+form"
  },
  {
    "id": "ex_641",
    "name": "Single-Arm/Leg Rope Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Rope Lats Row using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Rope%20Lats%20Row+form"
  },
  {
    "id": "ex_642",
    "name": "Standard Sled Lats Row",
    "muscles": [
      "Lats"
    ],
    "equipment": "Sled",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Sled Lats Row using Sled. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Sled%20Lats%20Row+form"
  },
  {
    "id": "ex_643",
    "name": "Standard Bodyweight Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Bodyweight Lower Back Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Bodyweight%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_644",
    "name": "Incline Bodyweight Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Bodyweight Lower Back Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Bodyweight%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_645",
    "name": "Decline Bodyweight Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Bodyweight Lower Back Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Bodyweight%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_646",
    "name": "Single-Arm/Leg Bodyweight Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Bodyweight Lower Back Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Bodyweight%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_647",
    "name": "Standard Barbell Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Barbell Lower Back Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Barbell%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_648",
    "name": "Incline Barbell Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Barbell Lower Back Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Barbell%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_649",
    "name": "Decline Barbell Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Barbell Lower Back Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Barbell%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_650",
    "name": "Single-Arm/Leg Barbell Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Barbell Lower Back Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Barbell%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_651",
    "name": "Standard Dumbbells Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Dumbbells Lower Back Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Dumbbells%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_652",
    "name": "Incline Dumbbells Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Dumbbells Lower Back Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Dumbbells%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_653",
    "name": "Decline Dumbbells Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Dumbbells Lower Back Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Dumbbells%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_654",
    "name": "Single-Arm/Leg Dumbbells Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Dumbbells Lower Back Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Dumbbells%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_655",
    "name": "Standard Kettlebell Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Kettlebell Lower Back Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Kettlebell%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_656",
    "name": "Incline Kettlebell Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Kettlebell Lower Back Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Kettlebell%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_657",
    "name": "Decline Kettlebell Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Kettlebell Lower Back Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Kettlebell%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_658",
    "name": "Single-Arm/Leg Kettlebell Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Kettlebell Lower Back Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Kettlebell%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_659",
    "name": "Standard Machines Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Machines Lower Back Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Machines%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_660",
    "name": "Incline Machines Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Machines Lower Back Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Machines%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_661",
    "name": "Decline Machines Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Machines Lower Back Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Machines%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_662",
    "name": "Single-Arm/Leg Machines Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Machines Lower Back Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Machines%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_663",
    "name": "Standard Plates Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Plates Lower Back Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Plates%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_664",
    "name": "Incline Plates Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Plates Lower Back Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Plates%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_665",
    "name": "Decline Plates Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Plates Lower Back Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Plates%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_666",
    "name": "Single-Arm/Leg Plates Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Plates Lower Back Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Plates%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_667",
    "name": "Standard Resistance Band Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Resistance Band Lower Back Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Resistance%20Band%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_668",
    "name": "Incline Resistance Band Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Resistance Band Lower Back Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Resistance%20Band%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_669",
    "name": "Decline Resistance Band Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Resistance Band Lower Back Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Resistance%20Band%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_670",
    "name": "Single-Arm/Leg Resistance Band Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Resistance Band Lower Back Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Resistance%20Band%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_671",
    "name": "Standard Suspension Band Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Suspension Band Lower Back Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Suspension%20Band%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_672",
    "name": "Incline Suspension Band Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Suspension Band Lower Back Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Suspension%20Band%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_673",
    "name": "Decline Suspension Band Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Suspension Band Lower Back Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Suspension%20Band%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_674",
    "name": "Single-Arm/Leg Suspension Band Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Suspension Band Lower Back Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Suspension%20Band%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_675",
    "name": "Standard Wheel Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Wheel Lower Back Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Wheel%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_676",
    "name": "Incline Wheel Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Wheel Lower Back Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Wheel%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_677",
    "name": "Decline Wheel Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Wheel Lower Back Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Wheel%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_678",
    "name": "Single-Arm/Leg Wheel Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Wheel Lower Back Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Wheel%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_679",
    "name": "Standard Ball Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Ball Lower Back Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Ball%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_680",
    "name": "Incline Ball Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Ball Lower Back Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Ball%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_681",
    "name": "Decline Ball Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Ball Lower Back Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Ball%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_682",
    "name": "Single-Arm/Leg Ball Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Ball Lower Back Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Ball%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_683",
    "name": "Standard Box Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Box Lower Back Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Box%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_684",
    "name": "Incline Box Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Box Lower Back Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Box%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_685",
    "name": "Decline Box Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Box Lower Back Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Box%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_686",
    "name": "Single-Arm/Leg Box Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Box Lower Back Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Box%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_687",
    "name": "Standard Rope Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Rope Lower Back Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Rope%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_688",
    "name": "Incline Rope Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Rope Lower Back Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Rope%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_689",
    "name": "Decline Rope Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Rope Lower Back Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Rope%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_690",
    "name": "Single-Arm/Leg Rope Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Rope Lower Back Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Rope%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_691",
    "name": "Standard Sled Lower Back Press",
    "muscles": [
      "Lower Back"
    ],
    "equipment": "Sled",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Sled Lower Back Press using Sled. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Sled%20Lower%20Back%20Press+form"
  },
  {
    "id": "ex_692",
    "name": "Standard Bodyweight Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Bodyweight Neck Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Bodyweight%20Neck%20Press+form"
  },
  {
    "id": "ex_693",
    "name": "Incline Bodyweight Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Bodyweight Neck Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Bodyweight%20Neck%20Press+form"
  },
  {
    "id": "ex_694",
    "name": "Decline Bodyweight Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Bodyweight Neck Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Bodyweight%20Neck%20Press+form"
  },
  {
    "id": "ex_695",
    "name": "Single-Arm/Leg Bodyweight Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Bodyweight Neck Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Bodyweight%20Neck%20Press+form"
  },
  {
    "id": "ex_696",
    "name": "Standard Barbell Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Barbell Neck Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Barbell%20Neck%20Press+form"
  },
  {
    "id": "ex_697",
    "name": "Incline Barbell Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Barbell Neck Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Barbell%20Neck%20Press+form"
  },
  {
    "id": "ex_698",
    "name": "Decline Barbell Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Barbell Neck Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Barbell%20Neck%20Press+form"
  },
  {
    "id": "ex_699",
    "name": "Single-Arm/Leg Barbell Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Barbell Neck Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Barbell%20Neck%20Press+form"
  },
  {
    "id": "ex_700",
    "name": "Standard Dumbbells Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Dumbbells Neck Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Dumbbells%20Neck%20Press+form"
  },
  {
    "id": "ex_701",
    "name": "Incline Dumbbells Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Dumbbells Neck Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Dumbbells%20Neck%20Press+form"
  },
  {
    "id": "ex_702",
    "name": "Decline Dumbbells Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Dumbbells Neck Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Dumbbells%20Neck%20Press+form"
  },
  {
    "id": "ex_703",
    "name": "Single-Arm/Leg Dumbbells Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Dumbbells Neck Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Dumbbells%20Neck%20Press+form"
  },
  {
    "id": "ex_704",
    "name": "Standard Kettlebell Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Kettlebell Neck Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Kettlebell%20Neck%20Press+form"
  },
  {
    "id": "ex_705",
    "name": "Incline Kettlebell Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Kettlebell Neck Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Kettlebell%20Neck%20Press+form"
  },
  {
    "id": "ex_706",
    "name": "Decline Kettlebell Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Kettlebell Neck Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Kettlebell%20Neck%20Press+form"
  },
  {
    "id": "ex_707",
    "name": "Single-Arm/Leg Kettlebell Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Kettlebell Neck Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Kettlebell%20Neck%20Press+form"
  },
  {
    "id": "ex_708",
    "name": "Standard Machines Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Machines Neck Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Machines%20Neck%20Press+form"
  },
  {
    "id": "ex_709",
    "name": "Incline Machines Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Machines Neck Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Machines%20Neck%20Press+form"
  },
  {
    "id": "ex_710",
    "name": "Decline Machines Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Machines Neck Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Machines%20Neck%20Press+form"
  },
  {
    "id": "ex_711",
    "name": "Single-Arm/Leg Machines Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Machines Neck Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Machines%20Neck%20Press+form"
  },
  {
    "id": "ex_712",
    "name": "Standard Plates Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Plates Neck Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Plates%20Neck%20Press+form"
  },
  {
    "id": "ex_713",
    "name": "Incline Plates Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Plates Neck Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Plates%20Neck%20Press+form"
  },
  {
    "id": "ex_714",
    "name": "Decline Plates Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Plates Neck Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Plates%20Neck%20Press+form"
  },
  {
    "id": "ex_715",
    "name": "Single-Arm/Leg Plates Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Plates Neck Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Plates%20Neck%20Press+form"
  },
  {
    "id": "ex_716",
    "name": "Standard Resistance Band Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Resistance Band Neck Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Resistance%20Band%20Neck%20Press+form"
  },
  {
    "id": "ex_717",
    "name": "Incline Resistance Band Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Resistance Band Neck Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Resistance%20Band%20Neck%20Press+form"
  },
  {
    "id": "ex_718",
    "name": "Decline Resistance Band Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Resistance Band Neck Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Resistance%20Band%20Neck%20Press+form"
  },
  {
    "id": "ex_719",
    "name": "Single-Arm/Leg Resistance Band Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Resistance Band Neck Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Resistance%20Band%20Neck%20Press+form"
  },
  {
    "id": "ex_720",
    "name": "Standard Suspension Band Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Suspension Band Neck Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Suspension%20Band%20Neck%20Press+form"
  },
  {
    "id": "ex_721",
    "name": "Incline Suspension Band Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Suspension Band Neck Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Suspension%20Band%20Neck%20Press+form"
  },
  {
    "id": "ex_722",
    "name": "Decline Suspension Band Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Suspension Band Neck Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Suspension%20Band%20Neck%20Press+form"
  },
  {
    "id": "ex_723",
    "name": "Single-Arm/Leg Suspension Band Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Suspension Band Neck Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Suspension%20Band%20Neck%20Press+form"
  },
  {
    "id": "ex_724",
    "name": "Standard Wheel Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Wheel Neck Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Wheel%20Neck%20Press+form"
  },
  {
    "id": "ex_725",
    "name": "Incline Wheel Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Wheel Neck Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Wheel%20Neck%20Press+form"
  },
  {
    "id": "ex_726",
    "name": "Decline Wheel Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Wheel Neck Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Wheel%20Neck%20Press+form"
  },
  {
    "id": "ex_727",
    "name": "Single-Arm/Leg Wheel Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Wheel Neck Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Wheel%20Neck%20Press+form"
  },
  {
    "id": "ex_728",
    "name": "Standard Ball Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Ball Neck Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Ball%20Neck%20Press+form"
  },
  {
    "id": "ex_729",
    "name": "Incline Ball Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Ball Neck Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Ball%20Neck%20Press+form"
  },
  {
    "id": "ex_730",
    "name": "Decline Ball Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Ball Neck Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Ball%20Neck%20Press+form"
  },
  {
    "id": "ex_731",
    "name": "Single-Arm/Leg Ball Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Ball Neck Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Ball%20Neck%20Press+form"
  },
  {
    "id": "ex_732",
    "name": "Standard Box Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Box Neck Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Box%20Neck%20Press+form"
  },
  {
    "id": "ex_733",
    "name": "Incline Box Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Box Neck Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Box%20Neck%20Press+form"
  },
  {
    "id": "ex_734",
    "name": "Decline Box Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Box Neck Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Box%20Neck%20Press+form"
  },
  {
    "id": "ex_735",
    "name": "Single-Arm/Leg Box Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Box Neck Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Box%20Neck%20Press+form"
  },
  {
    "id": "ex_736",
    "name": "Standard Rope Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Rope Neck Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Rope%20Neck%20Press+form"
  },
  {
    "id": "ex_737",
    "name": "Incline Rope Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Rope Neck Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Rope%20Neck%20Press+form"
  },
  {
    "id": "ex_738",
    "name": "Decline Rope Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Rope Neck Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Rope%20Neck%20Press+form"
  },
  {
    "id": "ex_739",
    "name": "Single-Arm/Leg Rope Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Rope Neck Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Rope%20Neck%20Press+form"
  },
  {
    "id": "ex_740",
    "name": "Standard Sled Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Sled",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Sled Neck Press using Sled. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Sled%20Neck%20Press+form"
  },
  {
    "id": "ex_741",
    "name": "Incline Sled Neck Press",
    "muscles": [
      "Neck"
    ],
    "equipment": "Sled",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Sled Neck Press using Sled. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Sled%20Neck%20Press+form"
  },
  {
    "id": "ex_742",
    "name": "Standard Bodyweight Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Bodyweight Quadriceps Extension using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Bodyweight%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_743",
    "name": "Incline Bodyweight Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Bodyweight Quadriceps Extension using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Bodyweight%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_744",
    "name": "Decline Bodyweight Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Bodyweight Quadriceps Extension using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Bodyweight%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_745",
    "name": "Single-Arm/Leg Bodyweight Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Bodyweight Quadriceps Extension using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Bodyweight%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_746",
    "name": "Standard Barbell Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Barbell Quadriceps Extension using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Barbell%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_747",
    "name": "Incline Barbell Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Barbell Quadriceps Extension using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Barbell%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_748",
    "name": "Decline Barbell Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Barbell Quadriceps Extension using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Barbell%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_749",
    "name": "Single-Arm/Leg Barbell Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Barbell Quadriceps Extension using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Barbell%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_750",
    "name": "Standard Dumbbells Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Dumbbells Quadriceps Extension using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Dumbbells%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_751",
    "name": "Incline Dumbbells Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Dumbbells Quadriceps Extension using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Dumbbells%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_752",
    "name": "Decline Dumbbells Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Dumbbells Quadriceps Extension using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Dumbbells%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_753",
    "name": "Single-Arm/Leg Dumbbells Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Dumbbells Quadriceps Extension using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Dumbbells%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_754",
    "name": "Standard Kettlebell Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Kettlebell Quadriceps Extension using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Kettlebell%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_755",
    "name": "Incline Kettlebell Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Kettlebell Quadriceps Extension using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Kettlebell%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_756",
    "name": "Decline Kettlebell Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Kettlebell Quadriceps Extension using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Kettlebell%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_757",
    "name": "Single-Arm/Leg Kettlebell Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Kettlebell Quadriceps Extension using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Kettlebell%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_758",
    "name": "Standard Machines Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Machines Quadriceps Extension using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Machines%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_759",
    "name": "Incline Machines Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Machines Quadriceps Extension using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Machines%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_760",
    "name": "Decline Machines Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Machines Quadriceps Extension using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Machines%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_761",
    "name": "Single-Arm/Leg Machines Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Machines Quadriceps Extension using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Machines%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_762",
    "name": "Standard Plates Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Plates Quadriceps Extension using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Plates%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_763",
    "name": "Incline Plates Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Plates Quadriceps Extension using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Plates%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_764",
    "name": "Decline Plates Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Plates Quadriceps Extension using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Plates%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_765",
    "name": "Single-Arm/Leg Plates Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Plates Quadriceps Extension using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Plates%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_766",
    "name": "Standard Resistance Band Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Resistance Band Quadriceps Extension using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Resistance%20Band%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_767",
    "name": "Incline Resistance Band Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Resistance Band Quadriceps Extension using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Resistance%20Band%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_768",
    "name": "Decline Resistance Band Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Resistance Band Quadriceps Extension using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Resistance%20Band%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_769",
    "name": "Single-Arm/Leg Resistance Band Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Resistance Band Quadriceps Extension using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Resistance%20Band%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_770",
    "name": "Standard Suspension Band Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Suspension Band Quadriceps Extension using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Suspension%20Band%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_771",
    "name": "Incline Suspension Band Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Suspension Band Quadriceps Extension using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Suspension%20Band%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_772",
    "name": "Decline Suspension Band Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Suspension Band Quadriceps Extension using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Suspension%20Band%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_773",
    "name": "Single-Arm/Leg Suspension Band Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Suspension Band Quadriceps Extension using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Suspension%20Band%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_774",
    "name": "Standard Wheel Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Wheel Quadriceps Extension using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Wheel%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_775",
    "name": "Incline Wheel Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Wheel Quadriceps Extension using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Wheel%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_776",
    "name": "Decline Wheel Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Wheel Quadriceps Extension using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Wheel%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_777",
    "name": "Single-Arm/Leg Wheel Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Wheel Quadriceps Extension using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Wheel%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_778",
    "name": "Standard Ball Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Ball Quadriceps Extension using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Ball%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_779",
    "name": "Incline Ball Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Ball Quadriceps Extension using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Ball%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_780",
    "name": "Decline Ball Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Ball Quadriceps Extension using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Ball%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_781",
    "name": "Single-Arm/Leg Ball Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Ball Quadriceps Extension using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Ball%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_782",
    "name": "Standard Box Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Box Quadriceps Extension using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Box%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_783",
    "name": "Incline Box Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Box Quadriceps Extension using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Box%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_784",
    "name": "Decline Box Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Box Quadriceps Extension using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Box%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_785",
    "name": "Single-Arm/Leg Box Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Box Quadriceps Extension using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Box%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_786",
    "name": "Standard Rope Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Rope Quadriceps Extension using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Rope%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_787",
    "name": "Incline Rope Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Rope Quadriceps Extension using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Rope%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_788",
    "name": "Decline Rope Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Rope Quadriceps Extension using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Rope%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_789",
    "name": "Single-Arm/Leg Rope Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Rope Quadriceps Extension using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Rope%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_790",
    "name": "Standard Sled Quadriceps Extension",
    "muscles": [
      "Quadriceps"
    ],
    "equipment": "Sled",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Sled Quadriceps Extension using Sled. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Sled%20Quadriceps%20Extension+form"
  },
  {
    "id": "ex_791",
    "name": "Standard Bodyweight Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Bodyweight Shoulders Raise using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Bodyweight%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_792",
    "name": "Incline Bodyweight Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Bodyweight Shoulders Raise using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Bodyweight%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_793",
    "name": "Decline Bodyweight Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Bodyweight Shoulders Raise using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Bodyweight%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_794",
    "name": "Single-Arm/Leg Bodyweight Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Bodyweight Shoulders Raise using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Bodyweight%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_795",
    "name": "Standard Barbell Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Barbell Shoulders Raise using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Barbell%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_796",
    "name": "Incline Barbell Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Barbell Shoulders Raise using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Barbell%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_797",
    "name": "Decline Barbell Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Barbell Shoulders Raise using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Barbell%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_798",
    "name": "Single-Arm/Leg Barbell Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Barbell Shoulders Raise using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Barbell%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_799",
    "name": "Standard Dumbbells Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Dumbbells Shoulders Raise using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Dumbbells%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_800",
    "name": "Incline Dumbbells Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Dumbbells Shoulders Raise using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Dumbbells%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_801",
    "name": "Decline Dumbbells Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Dumbbells Shoulders Raise using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Dumbbells%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_802",
    "name": "Single-Arm/Leg Dumbbells Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Dumbbells Shoulders Raise using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Dumbbells%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_803",
    "name": "Standard Kettlebell Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Kettlebell Shoulders Raise using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Kettlebell%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_804",
    "name": "Incline Kettlebell Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Kettlebell Shoulders Raise using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Kettlebell%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_805",
    "name": "Decline Kettlebell Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Kettlebell Shoulders Raise using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Kettlebell%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_806",
    "name": "Single-Arm/Leg Kettlebell Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Kettlebell Shoulders Raise using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Kettlebell%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_807",
    "name": "Standard Machines Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Machines Shoulders Raise using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Machines%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_808",
    "name": "Incline Machines Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Machines Shoulders Raise using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Machines%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_809",
    "name": "Decline Machines Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Machines Shoulders Raise using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Machines%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_810",
    "name": "Single-Arm/Leg Machines Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Machines Shoulders Raise using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Machines%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_811",
    "name": "Standard Plates Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Plates Shoulders Raise using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Plates%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_812",
    "name": "Incline Plates Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Plates Shoulders Raise using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Plates%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_813",
    "name": "Decline Plates Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Plates Shoulders Raise using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Plates%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_814",
    "name": "Single-Arm/Leg Plates Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Plates Shoulders Raise using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Plates%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_815",
    "name": "Standard Resistance Band Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Resistance Band Shoulders Raise using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Resistance%20Band%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_816",
    "name": "Incline Resistance Band Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Resistance Band Shoulders Raise using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Resistance%20Band%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_817",
    "name": "Decline Resistance Band Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Resistance Band Shoulders Raise using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Resistance%20Band%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_818",
    "name": "Single-Arm/Leg Resistance Band Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Resistance Band Shoulders Raise using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Resistance%20Band%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_819",
    "name": "Standard Suspension Band Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Suspension Band Shoulders Raise using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Suspension%20Band%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_820",
    "name": "Incline Suspension Band Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Suspension Band Shoulders Raise using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Suspension%20Band%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_821",
    "name": "Decline Suspension Band Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Suspension Band Shoulders Raise using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Suspension%20Band%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_822",
    "name": "Single-Arm/Leg Suspension Band Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Suspension Band Shoulders Raise using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Suspension%20Band%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_823",
    "name": "Standard Wheel Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Wheel Shoulders Raise using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Wheel%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_824",
    "name": "Incline Wheel Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Wheel Shoulders Raise using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Wheel%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_825",
    "name": "Decline Wheel Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Wheel Shoulders Raise using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Wheel%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_826",
    "name": "Single-Arm/Leg Wheel Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Wheel Shoulders Raise using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Wheel%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_827",
    "name": "Standard Ball Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Ball Shoulders Raise using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Ball%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_828",
    "name": "Incline Ball Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Ball Shoulders Raise using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Ball%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_829",
    "name": "Decline Ball Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Ball Shoulders Raise using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Ball%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_830",
    "name": "Single-Arm/Leg Ball Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Ball Shoulders Raise using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Ball%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_831",
    "name": "Standard Box Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Box Shoulders Raise using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Box%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_832",
    "name": "Incline Box Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Box Shoulders Raise using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Box%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_833",
    "name": "Decline Box Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Box Shoulders Raise using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Box%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_834",
    "name": "Single-Arm/Leg Box Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Box Shoulders Raise using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Box%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_835",
    "name": "Standard Rope Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Rope Shoulders Raise using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Rope%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_836",
    "name": "Incline Rope Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Rope Shoulders Raise using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Rope%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_837",
    "name": "Decline Rope Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Rope Shoulders Raise using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Rope%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_838",
    "name": "Single-Arm/Leg Rope Shoulders Raise",
    "muscles": [
      "Shoulders"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Rope Shoulders Raise using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Rope%20Shoulders%20Raise+form"
  },
  {
    "id": "ex_839",
    "name": "Standard Bodyweight Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Bodyweight Traps Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Bodyweight%20Traps%20Press+form"
  },
  {
    "id": "ex_840",
    "name": "Incline Bodyweight Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Bodyweight Traps Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Bodyweight%20Traps%20Press+form"
  },
  {
    "id": "ex_841",
    "name": "Decline Bodyweight Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Bodyweight Traps Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Bodyweight%20Traps%20Press+form"
  },
  {
    "id": "ex_842",
    "name": "Single-Arm/Leg Bodyweight Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Bodyweight Traps Press using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Bodyweight%20Traps%20Press+form"
  },
  {
    "id": "ex_843",
    "name": "Standard Barbell Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Barbell Traps Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Barbell%20Traps%20Press+form"
  },
  {
    "id": "ex_844",
    "name": "Incline Barbell Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Barbell Traps Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Barbell%20Traps%20Press+form"
  },
  {
    "id": "ex_845",
    "name": "Decline Barbell Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Barbell Traps Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Barbell%20Traps%20Press+form"
  },
  {
    "id": "ex_846",
    "name": "Single-Arm/Leg Barbell Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Barbell Traps Press using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Barbell%20Traps%20Press+form"
  },
  {
    "id": "ex_847",
    "name": "Standard Dumbbells Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Dumbbells Traps Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Dumbbells%20Traps%20Press+form"
  },
  {
    "id": "ex_848",
    "name": "Incline Dumbbells Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Dumbbells Traps Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Dumbbells%20Traps%20Press+form"
  },
  {
    "id": "ex_849",
    "name": "Decline Dumbbells Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Dumbbells Traps Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Dumbbells%20Traps%20Press+form"
  },
  {
    "id": "ex_850",
    "name": "Single-Arm/Leg Dumbbells Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Dumbbells Traps Press using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Dumbbells%20Traps%20Press+form"
  },
  {
    "id": "ex_851",
    "name": "Standard Kettlebell Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Kettlebell Traps Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Kettlebell%20Traps%20Press+form"
  },
  {
    "id": "ex_852",
    "name": "Incline Kettlebell Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Kettlebell Traps Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Kettlebell%20Traps%20Press+form"
  },
  {
    "id": "ex_853",
    "name": "Decline Kettlebell Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Kettlebell Traps Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Kettlebell%20Traps%20Press+form"
  },
  {
    "id": "ex_854",
    "name": "Single-Arm/Leg Kettlebell Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Kettlebell Traps Press using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Kettlebell%20Traps%20Press+form"
  },
  {
    "id": "ex_855",
    "name": "Standard Machines Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Machines Traps Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Machines%20Traps%20Press+form"
  },
  {
    "id": "ex_856",
    "name": "Incline Machines Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Machines Traps Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Machines%20Traps%20Press+form"
  },
  {
    "id": "ex_857",
    "name": "Decline Machines Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Machines Traps Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Machines%20Traps%20Press+form"
  },
  {
    "id": "ex_858",
    "name": "Single-Arm/Leg Machines Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Machines Traps Press using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Machines%20Traps%20Press+form"
  },
  {
    "id": "ex_859",
    "name": "Standard Plates Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Plates Traps Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Plates%20Traps%20Press+form"
  },
  {
    "id": "ex_860",
    "name": "Incline Plates Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Plates Traps Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Plates%20Traps%20Press+form"
  },
  {
    "id": "ex_861",
    "name": "Decline Plates Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Plates Traps Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Plates%20Traps%20Press+form"
  },
  {
    "id": "ex_862",
    "name": "Single-Arm/Leg Plates Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Plates Traps Press using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Plates%20Traps%20Press+form"
  },
  {
    "id": "ex_863",
    "name": "Standard Resistance Band Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Resistance Band Traps Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Resistance%20Band%20Traps%20Press+form"
  },
  {
    "id": "ex_864",
    "name": "Incline Resistance Band Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Resistance Band Traps Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Resistance%20Band%20Traps%20Press+form"
  },
  {
    "id": "ex_865",
    "name": "Decline Resistance Band Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Resistance Band Traps Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Resistance%20Band%20Traps%20Press+form"
  },
  {
    "id": "ex_866",
    "name": "Single-Arm/Leg Resistance Band Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Resistance Band Traps Press using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Resistance%20Band%20Traps%20Press+form"
  },
  {
    "id": "ex_867",
    "name": "Standard Suspension Band Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Suspension Band Traps Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Suspension%20Band%20Traps%20Press+form"
  },
  {
    "id": "ex_868",
    "name": "Incline Suspension Band Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Suspension Band Traps Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Suspension%20Band%20Traps%20Press+form"
  },
  {
    "id": "ex_869",
    "name": "Decline Suspension Band Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Suspension Band Traps Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Suspension%20Band%20Traps%20Press+form"
  },
  {
    "id": "ex_870",
    "name": "Single-Arm/Leg Suspension Band Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Suspension Band Traps Press using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Suspension%20Band%20Traps%20Press+form"
  },
  {
    "id": "ex_871",
    "name": "Standard Wheel Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Wheel Traps Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Wheel%20Traps%20Press+form"
  },
  {
    "id": "ex_872",
    "name": "Incline Wheel Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Wheel Traps Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Wheel%20Traps%20Press+form"
  },
  {
    "id": "ex_873",
    "name": "Decline Wheel Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Wheel Traps Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Wheel%20Traps%20Press+form"
  },
  {
    "id": "ex_874",
    "name": "Single-Arm/Leg Wheel Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Wheel Traps Press using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Wheel%20Traps%20Press+form"
  },
  {
    "id": "ex_875",
    "name": "Standard Ball Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Ball Traps Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Ball%20Traps%20Press+form"
  },
  {
    "id": "ex_876",
    "name": "Incline Ball Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Ball Traps Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Ball%20Traps%20Press+form"
  },
  {
    "id": "ex_877",
    "name": "Decline Ball Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Ball Traps Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Ball%20Traps%20Press+form"
  },
  {
    "id": "ex_878",
    "name": "Single-Arm/Leg Ball Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Ball Traps Press using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Ball%20Traps%20Press+form"
  },
  {
    "id": "ex_879",
    "name": "Standard Box Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Box Traps Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Box%20Traps%20Press+form"
  },
  {
    "id": "ex_880",
    "name": "Incline Box Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Box Traps Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Box%20Traps%20Press+form"
  },
  {
    "id": "ex_881",
    "name": "Decline Box Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Box Traps Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Box%20Traps%20Press+form"
  },
  {
    "id": "ex_882",
    "name": "Single-Arm/Leg Box Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Box Traps Press using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Box%20Traps%20Press+form"
  },
  {
    "id": "ex_883",
    "name": "Standard Rope Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Rope Traps Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Rope%20Traps%20Press+form"
  },
  {
    "id": "ex_884",
    "name": "Incline Rope Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Rope Traps Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Rope%20Traps%20Press+form"
  },
  {
    "id": "ex_885",
    "name": "Decline Rope Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Rope Traps Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Rope%20Traps%20Press+form"
  },
  {
    "id": "ex_886",
    "name": "Single-Arm/Leg Rope Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Rope Traps Press using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Rope%20Traps%20Press+form"
  },
  {
    "id": "ex_887",
    "name": "Standard Sled Traps Press",
    "muscles": [
      "Traps"
    ],
    "equipment": "Sled",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Sled Traps Press using Sled. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Sled%20Traps%20Press+form"
  },
  {
    "id": "ex_888",
    "name": "Standard Bodyweight Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Bodyweight Upper Back Row using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Bodyweight%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_889",
    "name": "Incline Bodyweight Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Bodyweight Upper Back Row using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Bodyweight%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_890",
    "name": "Decline Bodyweight Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Bodyweight Upper Back Row using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Bodyweight%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_891",
    "name": "Single-Arm/Leg Bodyweight Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "None (Bodyweight)",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Bodyweight Upper Back Row using None (Bodyweight). Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Bodyweight%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_892",
    "name": "Standard Barbell Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Barbell Upper Back Row using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Barbell%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_893",
    "name": "Incline Barbell Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Barbell Upper Back Row using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Barbell%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_894",
    "name": "Decline Barbell Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Barbell Upper Back Row using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Barbell%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_895",
    "name": "Single-Arm/Leg Barbell Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Barbell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Barbell Upper Back Row using Barbell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Barbell%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_896",
    "name": "Standard Dumbbells Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Dumbbells Upper Back Row using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Dumbbells%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_897",
    "name": "Incline Dumbbells Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Dumbbells Upper Back Row using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Dumbbells%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_898",
    "name": "Decline Dumbbells Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Dumbbells Upper Back Row using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Dumbbells%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_899",
    "name": "Single-Arm/Leg Dumbbells Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Dumbbells",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Dumbbells Upper Back Row using Dumbbells. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Dumbbells%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_900",
    "name": "Standard Kettlebell Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Kettlebell Upper Back Row using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Kettlebell%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_901",
    "name": "Incline Kettlebell Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Kettlebell Upper Back Row using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Kettlebell%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_902",
    "name": "Decline Kettlebell Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Kettlebell Upper Back Row using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Kettlebell%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_903",
    "name": "Single-Arm/Leg Kettlebell Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Kettlebell",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Kettlebell Upper Back Row using Kettlebell. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Kettlebell%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_904",
    "name": "Standard Machines Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Machines Upper Back Row using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Machines%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_905",
    "name": "Incline Machines Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Machines Upper Back Row using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Machines%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_906",
    "name": "Decline Machines Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Machines Upper Back Row using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Machines%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_907",
    "name": "Single-Arm/Leg Machines Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Machines",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Machines Upper Back Row using Machines. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Machines%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_908",
    "name": "Standard Plates Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Plates Upper Back Row using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Plates%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_909",
    "name": "Incline Plates Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Plates Upper Back Row using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Plates%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_910",
    "name": "Decline Plates Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Plates Upper Back Row using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Plates%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_911",
    "name": "Single-Arm/Leg Plates Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Plates",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Plates Upper Back Row using Plates. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Plates%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_912",
    "name": "Standard Resistance Band Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Resistance Band Upper Back Row using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Resistance%20Band%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_913",
    "name": "Incline Resistance Band Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Resistance Band Upper Back Row using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Resistance%20Band%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_914",
    "name": "Decline Resistance Band Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Resistance Band Upper Back Row using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Resistance%20Band%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_915",
    "name": "Single-Arm/Leg Resistance Band Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Resistance Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Resistance Band Upper Back Row using Resistance Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Resistance%20Band%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_916",
    "name": "Standard Suspension Band Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Suspension Band Upper Back Row using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Suspension%20Band%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_917",
    "name": "Incline Suspension Band Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Suspension Band Upper Back Row using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Suspension%20Band%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_918",
    "name": "Decline Suspension Band Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Suspension Band Upper Back Row using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Suspension%20Band%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_919",
    "name": "Single-Arm/Leg Suspension Band Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Suspension Band",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Suspension Band Upper Back Row using Suspension Band. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Suspension%20Band%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_920",
    "name": "Standard Wheel Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Wheel Upper Back Row using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Wheel%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_921",
    "name": "Incline Wheel Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Wheel Upper Back Row using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Wheel%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_922",
    "name": "Decline Wheel Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Wheel Upper Back Row using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Wheel%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_923",
    "name": "Single-Arm/Leg Wheel Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Wheel",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Wheel Upper Back Row using Wheel. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Wheel%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_924",
    "name": "Standard Ball Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Ball Upper Back Row using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Ball%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_925",
    "name": "Incline Ball Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Incline Ball Upper Back Row using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Ball%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_926",
    "name": "Decline Ball Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Decline Ball Upper Back Row using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Ball%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_927",
    "name": "Single-Arm/Leg Ball Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Ball",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Single-Arm/Leg Ball Upper Back Row using Ball. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Ball%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_928",
    "name": "Standard Box Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Standard Box Upper Back Row using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Box%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_929",
    "name": "Incline Box Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Incline Box Upper Back Row using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Box%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_930",
    "name": "Decline Box Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Decline Box Upper Back Row using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Box%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_931",
    "name": "Single-Arm/Leg Box Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Box",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Single-Arm/Leg Box Upper Back Row using Box. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Box%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_932",
    "name": "Standard Rope Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Standard Rope Upper Back Row using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Rope%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_933",
    "name": "Incline Rope Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Advanced",
    "instructions": "Perform Incline Rope Upper Back Row using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Incline%20Rope%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_934",
    "name": "Decline Rope Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Decline Rope Upper Back Row using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Decline%20Rope%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_935",
    "name": "Single-Arm/Leg Rope Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Rope",
    "category": "Strength",
    "difficulty": "Beginner",
    "instructions": "Perform Single-Arm/Leg Rope Upper Back Row using Rope. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Single-Arm%2FLeg%20Rope%20Upper%20Back%20Row+form"
  },
  {
    "id": "ex_936",
    "name": "Standard Sled Upper Back Row",
    "muscles": [
      "Upper Back"
    ],
    "equipment": "Sled",
    "category": "Strength",
    "difficulty": "Intermediate",
    "instructions": "Perform Standard Sled Upper Back Row using Sled. Ensure proper form and controlled movement.",
    "videoUrl": "https://www.youtube.com/results?search_query=Standard%20Sled%20Upper%20Back%20Row+form"
  },
  {
    "id": "swim_1",
    "name": "Freestyle (Front Crawl)",
    "muscles": ["Full-Body", "Cardio", "Shoulders", "Lats"],
    "equipment": "Pool",
    "category": "Swimming",
    "difficulty": "Beginner",
    "instructions": "Swim using the front crawl stroke. Focus on a steady flutter kick and high elbow recovery during the arm pull.",
    "videoUrl": "https://www.youtube.com/results?search_query=freestyle+swimming+technique"
  },
  {
    "id": "swim_2",
    "name": "Breaststroke",
    "muscles": ["Chest", "Shoulders", "Legs", "Full-Body"],
    "equipment": "Pool",
    "category": "Swimming",
    "difficulty": "Beginner",
    "instructions": "Perform the breaststroke by pulling your arms in a heart-shaped motion and using a whip kick with your legs.",
    "videoUrl": "https://www.youtube.com/results?search_query=breaststroke+swimming+technique"
  },
  {
    "id": "swim_3",
    "name": "Backstroke",
    "muscles": ["Back", "Shoulders", "Core", "Full-Body"],
    "equipment": "Pool",
    "category": "Swimming",
    "difficulty": "Beginner",
    "instructions": "Swim on your back using an alternating arm pull and flutter kick. Keep your hips high and look straight up.",
    "videoUrl": "https://www.youtube.com/results?search_query=backstroke+swimming+technique"
  },
  {
    "id": "swim_4",
    "name": "Butterfly",
    "muscles": ["Shoulders", "Core", "Back", "Full-Body"],
    "equipment": "Pool",
    "category": "Swimming",
    "difficulty": "Advanced",
    "instructions": "Use a simultaneous arm pull and a dolphin kick. Focus on the undulating body motion and timing the kick with the arm recovery.",
    "videoUrl": "https://www.youtube.com/results?search_query=butterfly+swimming+technique"
  },
  {
    "id": "swim_5",
    "name": "Kickboard Drills",
    "muscles": ["Quadriceps", "Glutes", "Hamstrings"],
    "equipment": "Pool",
    "category": "Swimming",
    "difficulty": "Beginner",
    "instructions": "Hold a kickboard in front of you and focus solely on your leg kick (flutter, whip, or dolphin) to move across the pool.",
    "videoUrl": "https://www.youtube.com/results?search_query=kickboard+drills+swimming"
  },
  {
    "id": "swim_6",
    "name": "Pull Buoy Drills",
    "muscles": ["Shoulders", "Lats", "Biceps", "Triceps"],
    "equipment": "Pool",
    "category": "Swimming",
    "difficulty": "Intermediate",
    "instructions": "Place a pull buoy between your thighs to keep your legs buoyant. Focus entirely on your arm pull and upper body strength to swim.",
    "videoUrl": "https://www.youtube.com/results?search_query=pull+buoy+drills+swimming"
  },
  {
    "id": "swim_7",
    "name": "Treading Water",
    "muscles": ["Full-Body", "Cardio"],
    "equipment": "Pool",
    "category": "Swimming",
    "difficulty": "Beginner",
    "instructions": "Stay upright in the water using a circular leg motion (eggbeater kick) and sculling arm movements to keep your head above water.",
    "videoUrl": "https://www.youtube.com/results?search_query=treading+water+technique"
  },
  {
    "id": "swim_8",
    "name": "Sculling",
    "muscles": ["Forearms", "Shoulders", "Core"],
    "equipment": "Pool",
    "category": "Swimming",
    "difficulty": "Intermediate",
    "instructions": "Move your hands in a figure-eight motion to create lift and move through the water. Can be done on your front, back, or upright.",
    "videoUrl": "https://www.youtube.com/results?search_query=sculling+swimming+technique"
  }
];
