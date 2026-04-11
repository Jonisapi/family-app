const fs = require('fs');
let family = fs.readFileSync('src/pages/Family.tsx', 'utf8');

// Add editingId state
family = family.replace(
  "const [selectedAvatar, setSelectedAvatar] = useState('/avatars/avatar-1.png')",
  "const [selectedAvatar, setSelectedAvatar] = useState('/avatars/avatar-1.png')\n  const [editingId, setEditingId] = useState<string | null>(null)\n  const [editAvatar, setEditAvatar] = useState('')"
);

// Add saveEdit and removeMember functions after addMember
family = family.replace(
  "  async function removeMember(id: string) {",
  `  async function saveEdit(id: string, newAvatar: string) {
    if (!familyCode) return
    const updated = members.map((m) => m.id === id ? { ...m, avatar: newAvatar } : m)
    await updateFamily(familyCode, { members: updated })
    setEditingId(null)
  }

  async function removeMember(id: string) {`
);

// Replace the member card avatar display with edit capability
family = family.replace(
  `{m.avatar?.startsWith("/") ? <img src={m.avatar} alt="" className="h-10 w-10 rounded-full object-cover" /> : <span className="text-3xl">{m.avatar || "👤"}</span>}`,
  `<div>
                    {editingId === m.id ? (
                      <div>
                        <div className="grid grid-cols-5 gap-1 mb-2">
                          {[1,2,3,4,5,6,7,8,9,10].map((i) => (
                            <button key={i} type="button" onClick={() => setEditAvatar(\`/avatars/avatar-\${i}.png\`)}
                              className="overflow-hidden rounded-lg border-2"
                              style={{ borderColor: editAvatar === \`/avatars/avatar-\${i}.png\` ? "#1a4731" : "#e2e8f0" }}>
                              <img src={\`/avatars/avatar-\${i}.png\`} alt="" className="h-10 w-full object-cover" />
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(m.id, editAvatar)}
                            className="flex-1 rounded-lg py-1.5 text-xs font-bold text-white" style={{ background: "#1a4731" }}>שמור</button>
                          <button onClick={() => setEditingId(null)}
                            className="flex-1 rounded-lg py-1.5 text-xs font-bold text-slate-600 border border-slate-300">ביטול</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => { setEditingId(m.id); setEditAvatar(m.avatar || "/avatars/avatar-1.png") }}
                          className="rounded-lg px-2 py-1 text-xs font-semibold"
                          style={{ background: "#f0fdf4", color: "#1a4731" }}>שנה אווטאר</button>
                        <button onClick={() => removeMember(m.id)}
                          className="rounded-lg px-2 py-1 text-xs font-semibold"
                          style={{ background: "#fef2f2", color: "#dc2626" }}>הסר</button>
                      </div>
                    )}
                  </div>
                  {!editingId && (m.avatar?.startsWith("/") ? <img src={m.avatar} alt="" className="h-10 w-10 rounded-full object-cover" /> : <span className="text-3xl">{m.avatar || "👤"}</span>)}`
);

fs.writeFileSync('src/pages/Family.tsx', family, 'utf8');
console.log('Done!');
