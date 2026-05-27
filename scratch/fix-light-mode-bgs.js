const fs = require('fs');
const path = require('path');

const targetDirs = [
  './frontend/app',
  './frontend/components'
];

const classMap = {
  // Deep backgrounds
  'bg-slate-950': 'bg-slate-50 dark:bg-slate-950',
  'bg-slate-900': 'bg-white dark:bg-slate-900',
  'bg-\\[#0A101F\\]': 'bg-slate-50 dark:bg-[#0A101F]',
  'bg-\\[#0f172a\\]': 'bg-white dark:bg-[#0f172a]'
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace mapped classes
  for (const [find, replace] of Object.entries(classMap)) {
    const regex = new RegExp(`(?<=["'\\s\`])(${find})(?=["'\\s\`])`, 'g');
    content = content.replace(regex, replace);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated backgrounds: ${filePath}`);
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
console.log('Done deep backgrounds!');
