const fs = require('fs');
let family = fs.readFileSync('src/pages/Family.tsx', 'utf8');

// Add useState import
family = family.replace(
  'import { useFamily, useTodaySugarByMember } from "../contexts/FamilyContext"',
  'import { useState } from "react"\nimport { useFamily, useTodaySugarByMember } from "../contexts/FamilyContext"'
);

// Add state for new member after navigate
family = family.replace(
  'const navigate = useNavigate()',
  `const navigate = useNavigate()
  const [newName, setNewName] = useState("")
  const [adding, setAdding] = useState(false)

  async function addMember() {
    if (!newName.trim() || !familyCode) return
    setAdding(true)
    const newMember = { id: crypto.randomUUID(), name: newName.trim(), avatar: "/avatars/avatar-1.png" }
    await updateFamily(familyCode, { members: [...members, newMember] })
    setNewName("")
    setAdding(false)
  }`
);

// Add member input before closing main tag
family = family.replace(
  '</main>',
  `<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-500">הוספת בן משפחה</h2>
          <div className="flex gap-2">
            <input value={newName} onChange={(e) => setNewName(e.target.value)}
              placeholder="שם בן משפחה"
              className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm"
              onKeyDown={(e) => e.key === "Enter" && addMember()} />
            <button onClick={addMember} disabled={adding || !newName.trim()}
              className="rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
              style={{ background: "#1a4731" }}>
              {adding ? "..." : "הוסף"}
            </button>
          </div>
        </section>
      </main>`
);

fs.writeFileSync('src/pages/Family.tsx', family, 'utf8');
console.log('Done!');
