const fs = require('fs');
let add = fs.readFileSync('src/pages/Add.tsx', 'utf8');
add = add.replace('http://localhost:8787/api/nutrition/suggest', '/api/suggest');
add = add.replace('http://localhost:8787/api/meals/suggest', '/api/meals');
fs.writeFileSync('src/pages/Add.tsx', add, 'utf8');
console.log('Done! Has /api/suggest:', add.includes('/api/suggest'));
