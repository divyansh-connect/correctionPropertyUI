import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');

const replacements = [
  // Tailwind class replacements
  { regex: /brand-green/g, replace: 'brand-blue' },
  { regex: /brand-beige/g, replace: 'brand-slate' },
  { regex: /brand-gold/g, replace: 'brand-indigo' },
  
  // SVG Hex Code Replacements
  // Greens
  { regex: /#2F4F3A/gi, replace: '#2563EB' }, // Primary Green to Primary Blue
  { regex: /#233C2C/gi, replace: '#1D4ED8' }, // Dark Green to Dark Blue
  { regex: /#3E5B45/gi, replace: '#DBEAFE' }, // Light Green to Light Blue
  { regex: /#EBF2ED/gi, replace: '#EFF6FF' }, // Surface Green to Surface Blue
  
  // Golds
  { regex: /#BFA46A/gi, replace: '#4F46E5' }, // Primary Gold to Primary Indigo
  { regex: /#A38B53/gi, replace: '#3730A3' }, // Dark Gold to Dark Indigo
  { regex: /#C8AE72/gi, replace: '#818CF8' }, // Light Gold to Light Indigo
  { regex: /#FDFBF7/gi, replace: '#EEF2FF' }, // Surface Gold to Surface Indigo
  
  // Beiges
  { regex: /#F7F4EE/gi, replace: '#F8FAFC' }, // Primary Beige to Primary Slate
  { regex: /#F0ECE1/gi, replace: '#F1F5F9' }, // Muted Beige to Muted Slate
  { regex: /#EAE4D5/gi, replace: '#E2E8F0' }, // Accent Beige to Accent Slate
  { regex: /#FAF8F5/gi, replace: '#FFFFFF' }, // Surface Beige to Surface Slate
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const { regex, replace } of replacements) {
        content = content.replace(regex, replace);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log('Color replacement complete.');
