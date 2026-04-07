const fs = require('fs');
let goals = fs.readFileSync('src/pages/Goals.tsx', 'utf8');
const lines = goals.split('\n');
const oldLine = lines[124];
lines[124] = lines[124].replace(
  '{m.avatar && <span className="mr-1">{m.avatar}</span>}',
  '{m.avatar && (m.avatar.startsWith("/") ? <img src={m.avatar} alt="" className="h-6 w-6 rounded-full object-cover inline-block ml-1" /> : <span className="mr-1">{m.avatar}</span>)}'
);
fs.writeFileSync('src/pages/Goals.tsx', lines.join('\n'), 'utf8');
console.log('Old:', oldLine.trim());
console.log('New:', lines[124].trim());
