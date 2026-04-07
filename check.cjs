const fs = require('fs');
let goals = fs.readFileSync('src/pages/Goals.tsx', 'utf8');
const lines = goals.split('\n');
console.log('Line 125 chars:', JSON.stringify(lines[124]));
