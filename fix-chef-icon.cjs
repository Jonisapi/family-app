const fs = require('fs');
let add = fs.readFileSync('src/pages/Add.tsx', 'utf8');

// Add import
add = add.replace(
  "import { useFamily } from '../contexts/FamilyContext'",
  "import { useFamily } from '../contexts/FamilyContext'\nimport chefIcon from '../assets/chef-icon.png'"
);

// Replace robot emoji with image
add = add.replace(
  '<span>🤖 קבל הצעות ארוחה דלות סוכר מ-AI</span>',
  '<span className="flex items-center gap-2"><img src={chefIcon} alt="" style={{ height: 28, width: 28, borderRadius: 999, objectFit: "cover" }} /> קבל הצעות ארוחה דלות סוכר מ-AI</span>'
);

fs.writeFileSync('src/pages/Add.tsx', add, 'utf8');
console.log("Done!");
