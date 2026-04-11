const fs = require('fs');
let add = fs.readFileSync('src/pages/Add.tsx', 'utf8');
add = add.replace(
  '<div dir="rtl" className="mx-auto max-w-xl p-4 pb-28">',
  '<div dir="rtl" className="mx-auto max-w-xl p-4 pb-28">\n      <button onClick={() => navigate(-1)} className="mb-3 flex items-center gap-1 text-sm font-semibold" style={{ color: "#1a4731" }}>→ חזור</button>'
);
fs.writeFileSync('src/pages/Add.tsx', add, 'utf8');
console.log('Done!');
