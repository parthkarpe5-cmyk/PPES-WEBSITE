const fs = require('fs');
const path = require('path');

const targetDirs = [
  './frontend/app',
  './frontend/components'
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Handle text-white with context awareness
  const classNameRegex = /className=["'`]((?:[^"'`\\]|\\.)*)["'`]/g;
  content = content.replace(classNameRegex, (match, classString) => {
    if (classString.includes('text-white')) {
      // If the element has a hardcoded dark background or a colored background, keep text-white
      const hasColoredBg = /bg-(?:sky|emerald|red|saffron|primary|gradient-to-)/.test(classString) || classString.includes('bg-[#') || classString.includes('bg-prestige') || classString.includes('bg-gold');
      if (!hasColoredBg && !classString.includes('dark:text-white')) {
        // Safe to replace text-white with text-foreground
        const newClassString = classString.replace(/(?<=^|\s)text-white(?=\s|$)/g, 'text-foreground');
        return match.replace(classString, newClassString);
      }
    }
    return match;
  });

  // Handle text-slate-200 that wasn't caught by the previous script
  content = content.replace(classNameRegex, (match, classString) => {
    if (classString.includes('text-slate-200')) {
      const hasColoredBg = /bg-(?:sky|emerald|red|saffron|primary|gradient-to-)/.test(classString) || classString.includes('bg-[#');
      if (!hasColoredBg && !classString.includes('dark:text-slate-200')) {
        const newClassString = classString.replace(/(?<=^|\s)text-slate-200(?=\s|$)/g, 'text-foreground/90');
        return match.replace(classString, newClassString);
      }
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated text-white: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

targetDirs.forEach(walkDir);
console.log('Done mapping text-white!');
