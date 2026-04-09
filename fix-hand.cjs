const fs = require('fs');
let index = fs.readFileSync('src/pages/Index.tsx', 'utf8');

// Remove hand emoji
index = index.replace('משפחת {familyName || \'ספיר\'} 👋', 'משפחת {familyName || \'ספיר\'}');

// Remove hand emoji variation
index = index.replace('משפחת {familyName || \'ספיר\'} ', 'משפחת {familyName || \'ספיר\'}');

fs.writeFileSync('src/pages/Index.tsx', index, 'utf8');
console.log('Done! Hand removed:', !index.includes('👋'));
