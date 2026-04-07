const fs = require('fs');
let family = fs.readFileSync('src/pages/Family.tsx', 'utf8');
const lines = family.split('\n');
lines.forEach((line, i) => {
  if (line.includes('avatar')) console.log(i+1, JSON.stringify(line));
});
