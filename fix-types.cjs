const fs = require('fs');

// Fix Add.tsx
let add = fs.readFileSync('src/pages/Add.tsx', 'utf8');
add = add.replace('import { FormEvent, useMemo, useState }', 'import { type FormEvent, useMemo, useState }');
fs.writeFileSync('src/pages/Add.tsx', add, 'utf8');

// Fix Onboarding.tsx
let onboard = fs.readFileSync('src/pages/Onboarding.tsx', 'utf8');
onboard = onboard.replace('import { FormEvent, useState }', 'import { type FormEvent, useState }');
fs.writeFileSync('src/pages/Onboarding.tsx', onboard, 'utf8');

console.log('Done!');
