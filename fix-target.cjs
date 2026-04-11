const fs = require('fs');
let index = fs.readFileSync('src/pages/Index.tsx', 'utf8');
index = index.replace(
  '<span className="text-xs text-slate-400 mt-0.5">/ {dailyGoal}ג</span>',
  '<span className="text-sm font-bold mt-0.5" style={{ color: "#64748b" }}>/ {dailyGoal}ג</span>'
);
fs.writeFileSync('src/pages/Index.tsx', index, 'utf8');
console.log('Done!');
