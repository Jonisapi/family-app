const fs = require('fs');
let goals = fs.readFileSync('src/pages/Goals.tsx', 'utf8');
goals = goals.replace(
  '{m.avatar && <span className="mr-1">{m.avatar}</span>}\r',
  '{m.avatar && (m.avatar.startsWith("/") ? <img src={m.avatar} alt="" className="h-6 w-6 rounded-full object-cover inline-block ml-1" /> : <span className="mr-1">{m.avatar}</span>)}\r'
);
fs.writeFileSync('src/pages/Goals.tsx', goals, 'utf8');
console.log('Done! Has startsWith:', goals.includes('startsWith'));
