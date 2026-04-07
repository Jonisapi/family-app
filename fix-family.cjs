const fs = require('fs');
let family = fs.readFileSync('src/pages/Family.tsx', 'utf8');
family = family.replace(
  '<span className="text-3xl">{m.avatar || \'👤\'}</span>\r',
  '{m.avatar?.startsWith("/") ? <img src={m.avatar} alt="" className="h-10 w-10 rounded-full object-cover" /> : <span className="text-3xl">{m.avatar || "👤"}</span>}\r'
);
fs.writeFileSync('src/pages/Family.tsx', family, 'utf8');
console.log('Done! Has startsWith:', family.includes('startsWith'));
