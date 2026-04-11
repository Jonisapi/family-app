const fs = require('fs');
let family = fs.readFileSync('src/pages/Family.tsx', 'utf8');
family = family.replace(
  "import { useFamily, useTodaySugarByMember } from '../contexts/FamilyContext'",
  "import { useFamily, useTodaySugarByMember } from '../contexts/FamilyContext'\nimport { updateFamily } from '../lib/familyService'"
);
fs.writeFileSync('src/pages/Family.tsx', family, 'utf8');
console.log('Done! Has updateFamily:', family.includes('updateFamily'));
