const fs = require('fs');
let family = fs.readFileSync('src/pages/Family.tsx', 'utf8');
// Fix duplicate useState import issue
family = family.replace(
  'import { useState } from "react"\nimport { useFamily',
  'import { useState } from "react"\nimport { useFamily'
);
// Make sure useState is imported
if (!family.includes('import { useState }') && !family.includes('import {useState}')) {
  family = family.replace(
    'import { useFamily',
    'import { useState } from "react"\nimport { useFamily'
  );
}
fs.writeFileSync('src/pages/Family.tsx', family, 'utf8');
console.log('Has useState import:', family.includes("import { useState }"));
