const fs = require('fs');
const path = require('path');

const targetDirs = [
  './frontend/app',
  './frontend/components'
];

const exactClassMap = {
  // Deep backgrounds
  'bg-slate-950': 'bg-background',
  'bg-slate-900': 'bg-card',
  'bg-\\[#0A101F\\]': 'bg-background',
  'bg-\\[#0f172a\\]': 'bg-card',
  
  // Translucent backgrounds
  'bg-white/5': 'bg-card',
  'bg-white/\\[0\\.02\\]': 'bg-card',
  'bg-white/\\[0\\.03\\]': 'bg-card',
  'bg-white/\\[0\\.04\\]': 'bg-card',
  'bg-white/\\[0\\.05\\]': 'bg-card',
  'bg-slate-200/5': 'bg-card',
  'bg-slate-200/\\[0\\.03\\]': 'bg-card',

  // Borders
  'border-white/5': 'border-border',
  'border-white/10': 'border-border',
  'border-slate-200/10': 'border-border',
  'border-slate-200/5': 'border-border',
  'border-white/20': 'border-border',

  // Text
  'text-slate-200': 'text-foreground',
  'text-slate-300': 'text-muted-foreground',
  'text-slate-400': 'text-muted-foreground',
  'text-slate-800 dark:text-slate-200': 'text-foreground',
  'text-slate-900 dark:text-white': 'text-foreground',
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Replace exact mapped classes
  for (const [find, replace] of Object.entries(exactClassMap)) {
    const regex = new RegExp(`(?<=["'\\s\`])(${find})(?=["'\\s\`])`, 'g');
    content = content.replace(regex, replace);
  }

  // 2. Remove dark: versions of classes we just replaced, to prevent duplicates
  // e.g. dark:bg-white/5, dark:border-white/10
  const darkToRemove = [
    'dark:bg-white/5', 'dark:bg-white/[0.02]', 'dark:bg-white/[0.03]', 'dark:bg-white/[0.04]', 'dark:bg-white/[0.05]',
    'dark:border-white/5', 'dark:border-white/10', 'dark:border-white/20', 'dark:border-slate-200/10', 'dark:border-slate-200/5',
    'dark:bg-[#0A101F]/90', 'bg-[#0A101F]/90'
  ];
  for (const dark of darkToRemove) {
    const escaped = dark.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
    const regex = new RegExp(`(?<=["'\\s\`])(${escaped})(?=["'\\s\`])`, 'g');
    content = content.replace(regex, ''); // just remove them since they are covered by semantic classes
  }
  
  // Replace bg-[#0A101F]/90 with bg-background/90
  content = content.replace(/bg-\[\#0A101F\]\/90/g, 'bg-background/90');


  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated semantics: ${filePath}`);
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
console.log('Done mapping semantics!');
