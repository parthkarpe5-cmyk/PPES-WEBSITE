const fs = require('fs');
const path = require('path');

const targetDirs = [
  './frontend/app',
  './frontend/components'
];

const classMap = {
  // Backgrounds
  'bg-white/\\[0\\.02\\]': 'bg-white dark:bg-white/[0.02]',
  'bg-white/\\[0\\.03\\]': 'bg-white dark:bg-white/[0.03]',
  'bg-white/\\[0\\.04\\]': 'bg-slate-50 dark:bg-white/[0.04]',
  'bg-white/\\[0\\.05\\]': 'bg-slate-50 dark:bg-white/[0.05]',
  'bg-white/5': 'bg-white dark:bg-white/5',
  'bg-white/10': 'bg-slate-100 dark:bg-white/10',
  'bg-slate-200/\\[0\\.03\\]': 'bg-white dark:bg-slate-200/[0.03]',
  'bg-slate-200/\\[0\\.07\\]': 'bg-slate-50 dark:bg-slate-200/[0.07]',
  'bg-slate-200/5': 'bg-white dark:bg-slate-200/5',
  'bg-black/20': 'bg-slate-100 dark:bg-black/20',

  // Borders
  'border-white/5': 'border-slate-200 dark:border-white/5',
  'border-white/10': 'border-slate-200 dark:border-white/10',
  'border-slate-200/10': 'border-slate-200 dark:border-slate-200/10',
  'border-slate-200/5': 'border-slate-200 dark:border-slate-200/5',

  // Text colors
  'text-slate-200': 'text-slate-800 dark:text-slate-200',
  'text-slate-300': 'text-slate-700 dark:text-slate-300',
  'text-slate-400': 'text-slate-600 dark:text-slate-400',
  'text-slate-500': 'text-slate-500', // slate-500 is ok in both
  // 'text-white' is handled separately with logic
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace mapped classes
  for (const [find, replace] of Object.entries(classMap)) {
    const regex = new RegExp(`(?<=["'\\s\`])(${find})(?=["'\\s\`])`, 'g');
    content = content.replace(regex, replace);
  }

  // Handle text-white with context awareness
  const classNameRegex = /className=["'`]((?:[^"'`\\]|\\.)*)["'`]/g;
  content = content.replace(classNameRegex, (match, classString) => {
    if (classString.includes('text-white')) {
      const hasColoredBg = /bg-(?:sky|emerald|red|saffron|primary|gradient-to-)/.test(classString) || classString.includes('bg-[#');
      if (!hasColoredBg && !classString.includes('dark:text-white')) {
        const newClassString = classString.replace(/(?<=^|\s)text-white(?=\s|$)/g, 'text-slate-900 dark:text-white');
        return match.replace(classString, newClassString);
      }
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
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
console.log('Done!');
