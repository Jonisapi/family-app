const fs = require('fs');
let onboarding = fs.readFileSync('src/pages/Onboarding.tsx', 'utf8');
onboarding = onboarding.replace(
  'import { useFamily } from "../contexts/FamilyContext"',
  'import { useFamily } from "../contexts/FamilyContext"\nimport saladHero from "../assets/salad-hero.png"'
);
onboarding = onboarding.replace(
  '<p className="text-5xl mb-3">🥗</p>',
  '<img src={saladHero} alt="" className="mx-auto mb-3" style={{ height: 120, width: 120, objectFit: "contain" }} />'
);
fs.writeFileSync('src/pages/Onboarding.tsx', onboarding, 'utf8');
console.log('Done!', onboarding.includes('saladHero'));
