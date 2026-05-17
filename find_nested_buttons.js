const fs = require('fs');
const path = require('path');

function findNestedButtons(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let openButtons = 0;
  let inButton = false;

  lines.forEach((line, index) => {
    const openMatches = (line.match(/<button/g) || []).length;
    const closeMatches = (line.match(/<\/button>/g) || []).length;

    if (openMatches > 0) {
      if (openButtons > 0) {
        console.log(`Potential nested button at ${filePath}:${index + 1}`);
        console.log(`Line: ${line.trim()}`);
      }
      openButtons += openMatches;
    }
    openButtons -= closeMatches;
  });
}

const files = [
  'src/components/SportsModule.tsx',
  'src/components/NutritionDashboard.tsx',
  'src/components/TrainerDashboard.tsx',
  'src/components/HabitModule.tsx',
  'src/components/PlansModule.tsx',
  'src/components/MealEditor.tsx',
  'src/components/SmartwatchModule.tsx',
  'src/components/SleepModule.tsx',
  'src/components/AdminDashboard.tsx',
  'src/components/SubscriptionModule.tsx',
  'src/components/NutritionModule.tsx',
  'src/App.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    findNestedButtons(file);
  }
});
