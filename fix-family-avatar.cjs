const fs = require('fs');
let family = fs.readFileSync('src/pages/Family.tsx', 'utf8');

// Add selectedAvatar state
family = family.replace(
  "const [adding, setAdding] = useState(false)",
  "const [adding, setAdding] = useState(false)\n  const [selectedAvatar, setSelectedAvatar] = useState('/avatars/avatar-1.png')"
);

// Fix addMember to use selectedAvatar
family = family.replace(
  'const newMember = { id: crypto.randomUUID(), name: newName.trim(), avatar: "/avatars/avatar-1.png" }',
  'const newMember = { id: crypto.randomUUID(), name: newName.trim(), avatar: selectedAvatar }'
);

// Add avatar picker before the input
const AVATARS = [1,2,3,4,5,6,7,8,9,10].map(i => `/avatars/avatar-${i}.png`)

family = family.replace(
  '<h2 className="mb-3 text-sm font-semibold text-slate-500">הוספת בן משפחה</h2>',
  `<h2 className="mb-3 text-sm font-semibold text-slate-500">הוספת בן משפחה</h2>
          <div className="grid grid-cols-5 gap-1 mb-3">
            {[1,2,3,4,5,6,7,8,9,10].map((i) => (
              <button key={i} type="button" onClick={() => setSelectedAvatar(\`/avatars/avatar-\${i}.png\`)}
                className="overflow-hidden rounded-lg border-2"
                style={{ borderColor: selectedAvatar === \`/avatars/avatar-\${i}.png\` ? "#1a4731" : "#e2e8f0" }}>
                <img src={\`/avatars/avatar-\${i}.png\`} alt="" className="h-12 w-full object-cover" />
              </button>
            ))}
          </div>`
);

fs.writeFileSync('src/pages/Family.tsx', family, 'utf8');
console.log('Done!');
