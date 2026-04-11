const fs = require('fs');
let add = fs.readFileSync('src/pages/Add.tsx', 'utf8');
add = add.replace(
  'const apiBase = import.meta.env.DEV ? \'http://localhost:8787/api\' : \'/api\'\n      const res = await fetch(`${apiBase}/suggest`,',
  'const apiBase = import.meta.env.DEV ? \'http://localhost:8787\' : \'\'\n      const res = await fetch(`${apiBase}/api/nutrition/suggest`,'
);
add = add.replace(
  'const res2Base = import.meta.env.DEV ? \'http://localhost:8787/api\' : \'/api\'\n      const res = await fetch(`${res2Base}/meals`,',
  'const res2Base = import.meta.env.DEV ? \'http://localhost:8787\' : \'\'\n      const res = await fetch(`${res2Base}/api/meals/suggest`,'
);
fs.writeFileSync('src/pages/Add.tsx', add, 'utf8');
console.log('Done!');
