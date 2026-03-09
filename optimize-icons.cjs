const fs = require('fs');
const path = require('path');

// Map of icon names to their kebab-case file names
const iconMap = {
  'Search': 'search',
  'MapPin': 'map-pin',
  'Filter': 'filter',
  'User': 'user',
  'ArrowRight': 'arrow-right',
  'Star': 'star',
  'GraduationCap': 'graduation-cap',
  'Phone': 'phone',
  'Mail': 'mail',
  'Clock': 'clock',
  'Briefcase': 'briefcase',
  'Upload': 'upload',
  'CheckCircle': 'check-circle',
  'Loader2': 'loader-2',
  'Calendar': 'calendar',
  'Info': 'info',
  'MessageSquare': 'message-square',
  'ArrowLeft': 'arrow-left',
  'Clipboard': 'clipboard',
  'Check': 'check',
  'Share2': 'share-2',
  'Save': 'save',
  'X': 'x',
  'Plus': 'plus',
  'Lightbulb': 'lightbulb',
  'ShieldCheck': 'shield-check',
  'Users': 'users',
  'Target': 'target',
  'Award': 'award',
  'Globe2': 'globe-2',
  'ChevronRight': 'chevron-right',
  'Building2': 'building-2',
  'UploadCloud': 'upload-cloud',
  'CheckCircle2': 'check-circle-2',
  'Store': 'store',
  'Send': 'send',
  'Lock': 'lock',
  'Eye': 'eye',
  'EyeOff': 'eye-off',
  'Sparkles': 'sparkles',
  'Image': 'image',
  'Video': 'video',
  'BrainCircuit': 'brain-circuit',
  'Mic': 'mic',
  'Wand2': 'wand-2',
  'FileSearch': 'file-search',
  'ChevronLeft': 'chevron-left',
  'LayoutDashboard': 'layout-dashboard',
  'Newspaper': 'newspaper',
  'School': 'school',
  'Settings': 'settings',
  'Pencil': 'pencil',
  'Trash2': 'trash-2',
  'EyeOff': 'eye-off',
  'Home': 'home',
  'Bell': 'bell',
  'LogOut': 'log-out',
  'TrendingUp': 'trending-up',
  'AlertCircle': 'alert-circle',
  'Menu': 'menu',
  'Moon': 'moon',
  'Sun': 'sun',
  'Globe': 'globe',
  'ChevronDown': 'chevron-down',
  'ChevronsLeft': 'chevrons-left',
  'ChevronsRight': 'chevrons-right',
  'Maximize2': 'maximize-2',
  'ExternalLink': 'external-link',
  'ShieldAlert': 'shield-alert',
  'RefreshCw': 'refresh-cw',
  'WifiOff': 'wifi-off',
  'ServerCrash': 'server-crash',
  'Twitter': 'twitter',
  'Instagram': 'instagram',
  'Linkedin': 'linkedin',
  'Github': 'github',
  'Facebook': 'facebook',
  'LinkIcon': 'link',
  'XIcon': 'x',
  'CalendarIcon': 'calendar'
};

function optimizeFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Find lucide-react import
  const importRegex = /import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/g;
  const match = importRegex.exec(content);
  
  if (!match) {
    return false;
  }
  
  // Extract icon names
  const iconsStr = match[1];
  const icons = iconsStr.split(',').map(i => i.trim()).filter(Boolean);
  
  // Generate individual imports
  const imports = icons.map(icon => {
    const kebabName = iconMap[icon] || icon.toLowerCase();
    return `import ${icon} from 'lucide-react/dist/esm/icons/${kebabName}';`;
  }).join('\n');
  
  // Replace the import
  content = content.replace(importRegex, imports);
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Optimized: ${path.basename(filePath)}`);
    console.log(`   Icons: ${icons.join(', ')}`);
    return true;
  }
  
  return false;
}

function findAndOptimizeFiles(dir) {
  let count = 0;
  
  function walk(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
          walk(filePath);
        }
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        if (optimizeFile(filePath)) {
          count++;
        }
      }
    });
  }
  
  walk(dir);
  return count;
}

console.log('🚀 Starting Tree Shaking optimization for lucide-react icons...\n');

const srcDir = path.join(__dirname, 'src');
const optimizedCount = findAndOptimizeFiles(srcDir);

console.log(`\n✅ Optimization complete!`);
console.log(`   Files optimized: ${optimizedCount}`);
console.log(`   Expected bundle size reduction: ~150 KB\n`);
