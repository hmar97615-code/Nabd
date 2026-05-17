
import * as fs from 'fs';
import * as path from 'path';

function findNestedButtons(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    let stack: { type: string, line: number }[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Very simple regex-based tag tracking
        // This won't handle all JSX cases perfectly but should find simple nesting
        const tags = line.match(/<(button|Button)|<\/(button|Button)>|\/>/g);
        if (tags) {
            for (const tag of tags) {
                if (tag.startsWith('</')) {
                    if (stack.length > 0) {
                        stack.pop();
                    }
                } else if (tag === '/>') {
                    if (stack.length > 0) {
                        stack.pop();
                    }
                } else {
                    if (stack.length > 0) {
                        console.log(`Potential nested button found in ${filePath} at line ${i + 1}:`);
                        console.log(`  Current tag: ${tag}`);
                        console.log(`  Parent tag: <${stack[stack.length - 1].type}> from line ${stack[stack.length - 1].line}`);
                    }
                    stack.push({ type: 'button', line: i + 1 });
                }
            }
        }
    }
}

const targetFiles = [
    'src/components/SportsModule.tsx',
    'src/App.tsx',
    'src/components/PlansModule.tsx'
];

targetFiles.forEach(file => {
    if (fs.existsSync(file)) {
        findNestedButtons(file);
    }
});
