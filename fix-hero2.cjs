const fs = require('fs');
let index = fs.readFileSync('src/pages/Index.tsx', 'utf8');

index = index.replace(
  "style={{ background: 'linear-gradient(135deg, #1a4731 0%, #2d6a4f 60%, #40916c 100%)', minHeight: 200 }}",
  "style={{ background: 'linear-gradient(135deg, #1a4731 0%, #2d6a4f 60%, #40916c 100%)', minHeight: 200, width: '100%' }}"
);

index = index.replace(
  "style={{ right: -10, bottom: -30, height: 260, width: 260, objectFit: 'contain', opacity: 0.95, zIndex: 1 }}",
  "style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '45%', objectFit: 'cover', objectPosition: 'center', opacity: 0.85 }}"
);

fs.writeFileSync('src/pages/Index.tsx', index, 'utf8');
console.log('Done!');
