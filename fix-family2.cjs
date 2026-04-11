const fs = require('fs');
let family = fs.readFileSync('src/pages/Family.tsx', 'utf8');

// Add familyCode and updateFamily import
family = family.replace(
  'import { useFamily, useTodaySugarByMember } from "../contexts/FamilyContext"',
  'import { useFamily, useTodaySugarByMember } from "../contexts/FamilyContext"\nimport { updateFamily } from "../lib/familyService"'
);

// Add familyCode to destructuring
family = family.replace(
  'const { familyName, members, entries, dailyGoal } = useFamily()',
  'const { familyName, members, entries, dailyGoal, familyCode } = useFamily()'
);

// Add remove member function after navigate declaration
family = family.replace(
  'const navigate = useNavigate()',
  `const navigate = useNavigate()

  async function removeMember(id: string) {
    if (!familyCode) return
    if (!window.confirm("האם למחוק את בן המשפחה?")) return
    const updated = members.filter((m) => m.id !== id)
    await updateFamily(familyCode, { members: updated })
  }`
);

// Add family code card after header section
family = family.replace(
  '<section className="space-y-3">',
  `<section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">קוד המשפחה — שתפו עם בני משפחה</p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-black tracking-widest" style={{ color: "#1a4731" }}>{familyCode}</p>
            <button onClick={() => navigator.clipboard.writeText(familyCode || "")}
              className="rounded-xl px-3 py-1.5 text-xs font-semibold text-white" style={{ background: "#1a4731" }}>
              העתק
            </button>
          </div>
        </section>

        <section className="space-y-3">`
);

// Add remove button to each member card
family = family.replace(
  '<p className="mt-0.5 text-xs text-slate-400">{m.entryCount} פריטים מוזנים סה״כ</p>',
  `<p className="mt-0.5 text-xs text-slate-400">{m.entryCount} פריטים מוזנים סה״כ</p>
                    <button onClick={() => removeMember(m.id)}
                      className="mt-2 rounded-lg px-2 py-1 text-xs font-semibold"
                      style={{ background: "#fef2f2", color: "#dc2626" }}>
                      עזוב משפחה
                    </button>`
);

fs.writeFileSync('src/pages/Family.tsx', family, 'utf8');
console.log('Done!');
