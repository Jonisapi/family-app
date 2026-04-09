const fs = require('fs');
let index = fs.readFileSync('src/pages/Index.tsx', 'utf8');

// Fix hero section
index = index.replace(
  '<p className="text-sm font-medium" style={{ color: \'rgba(255,255,255,0.7)\' }}>שלום,</p>\r\n          <h1 className="text-3xl font-black text-white mt-0.5">משפחת {familyName || \'ספיר\'} 👋</h1>',
  '<p className="text-sm font-medium" style={{ color: \'rgba(255,255,255,0.7)\' }}>שלום,</p>\r\n          <h1 className="text-3xl font-black text-white mt-0.5">משפחת {familyName || \'ספיר\'}</h1>'
);

// Fix image position - move into hero properly
index = index.replace(
  'style={{ right: -20, top: -20, height: 240, width: 240, objectFit: \'contain\', opacity: 0.9 }}',
  'style={{ right: -10, bottom: -30, height: 260, width: 260, objectFit: \'contain\', opacity: 0.95, zIndex: 1 }}'
);

fs.writeFileSync('src/pages/Index.tsx', index, 'utf8');
console.log('Done!');
