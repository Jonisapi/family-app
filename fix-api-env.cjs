const fs = require('fs');
let add = fs.readFileSync('src/pages/Add.tsx', 'utf8');

// Use localhost in dev, /api in production
add = add.replace(
  "const res = await fetch('/api/suggest',",
  "const apiBase = import.meta.env.DEV ? 'http://localhost:8787/api' : '/api'\n      const res = await fetch(`${apiBase}/suggest`,"
);
add = add.replace(
  "const res = await fetch('/api/meals',",
  "const res2Base = import.meta.env.DEV ? 'http://localhost:8787/api' : '/api'\n      const res = await fetch(`${res2Base}/meals`,"
);

fs.writeFileSync('src/pages/Add.tsx', add, 'utf8');
console.log('Done!');
