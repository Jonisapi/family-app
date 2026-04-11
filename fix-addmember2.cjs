const fs = require('fs');
let family = fs.readFileSync('src/pages/Family.tsx', 'utf8');

family = family.replace(
  `  async function addMember() {
    if (!newName.trim() || !familyCode) return
    setAdding(true)
    const newMember = { id: crypto.randomUUID(), name: newName.trim(), avatar: "/avatars/avatar-1.png" }
    await updateFamily(familyCode, { members: [...members, newMember] })
    setNewName("")
    setAdding(false)
  }`,
  `  async function addMember() {
    if (!newName.trim() || !familyCode) return
    setAdding(true)
    try {
      const newMember = { id: crypto.randomUUID(), name: newName.trim(), avatar: "/avatars/avatar-1.png" }
      await updateFamily(familyCode, { members: [...members, newMember] })
      setNewName("")
    } catch(e) {
      console.error("addMember error:", e)
      alert("שגיאה בהוספת בן משפחה")
    } finally {
      setAdding(false)
    }
  }`
);

fs.writeFileSync('src/pages/Family.tsx', family, 'utf8');
console.log('Done!');
