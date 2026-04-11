import { useState } from "react"
import { useFamily, useTodaySugarByMember } from '../contexts/FamilyContext'
import { updateFamily } from '../lib/familyService'
import BottomNav from '../components/BottomNav'
import TopBar from '../components/TopBar'
import { useNavigate } from 'react-router-dom'

export default function Family() {
  const { familyName, members, entries, dailyGoal, familyCode } = useFamily()
  const memberStats = useTodaySugarByMember()
  const navigate = useNavigate()
  const [newName, setNewName] = useState("")
  const [adding, setAdding] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState('/avatars/avatar-1.png')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAvatar, setEditAvatar] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  async function addMember() {
    if (!newName.trim() || !familyCode) return
    setAdding(true)
    try {
      const newMember = { id: crypto.randomUUID(), name: newName.trim(), avatar: selectedAvatar }
      await updateFamily(familyCode, { members: [...members, newMember] })
      setNewName("")
    } catch(e) {
      console.error("addMember error:", e)
      alert("שגיאה בהוספת בן משפחה")
    } finally {
      setAdding(false)
    }
  }

  async function editMember(id: string, newName: string) {
    if (!familyCode || !newName.trim()) return
    const updated = members.map((m) => m.id === id ? { ...m, name: newName.trim() } : m)
    await updateFamily(familyCode, { members: updated })
    setEditId(null)
  }

  async function saveEdit(id: string, newAvatar: string) {
    if (!familyCode) return
    const updated = members.map((m) => m.id === id ? { ...m, avatar: newAvatar } : m)
    await updateFamily(familyCode, { members: updated })
    setEditingId(null)
  }

  async function removeMember(id: string) {
    if (!familyCode) return
    if (!window.confirm("האם למחוק את בן המשפחה?")) return
    const updated = members.filter((m) => m.id !== id)
    await updateFamily(familyCode, { members: updated })
  }

  // All-time best per member (lowest daily sugar on any logged day)
  function getBestDay(memberId: string): number | null {
    const byDate: Record<string, number> = {}
    entries
      .filter((e) => e.memberId === memberId)
      .forEach((e) => {
        byDate[e.date] = (byDate[e.date] ?? 0) + e.sugar
      })
    const days = Object.values(byDate)
    return days.length ? Math.min(...days) : null
  }

  // Total entries per member
  function getTotalEntries(memberId: string): number {
    return entries.filter((e) => e.memberId === memberId).length
  }

  if (!members.length) {
    return (
      <div dir="rtl" className="min-h-screen bg-slate-50 pb-24">
        <TopBar />
        <div className="mx-auto max-w-xl p-6 text-center">
          <p className="text-4xl mb-4">👨‍👩‍👧‍👦</p>
          <h2 className="text-xl font-bold mb-2">אין בני משפחה עדיין</h2>
          <p className="text-slate-500 mb-4">הוסף בני משפחה דרך האונבורדינג</p>
          <button
            onClick={() => navigate('/onboarding')}
            className="rounded-lg bg-green-700 px-5 py-2 font-bold text-white"
          >
            התחל אונבורדינג
          </button>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 pb-24 text-slate-800">
      <TopBar />

      <main className="mx-auto max-w-xl space-y-5 px-4 py-6">

        {/* Header */}
        <section className="rounded-2xl bg-green-700 p-6 text-white">
          <p className="text-sm font-semibold text-green-100">משפחת</p>
          <h1 className="text-3xl font-black">{familyName || 'המשפחה שלנו'}</h1>
          <p className="mt-1 text-sm text-green-100">{members.length} משתתפים · יעד יומי: {dailyGoal}ג׳ סוכר</p>
        </section>

        {/* Members */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">קוד המשפחה — שתפו עם בני משפחה</p>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-black tracking-widest" style={{ color: "#1a4731" }}>{familyCode}</p>
            <button onClick={() => navigator.clipboard.writeText(familyCode || "")}
              className="rounded-xl px-3 py-1.5 text-xs font-semibold text-white" style={{ background: "#1a4731" }}>
              העתק
            </button>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-500 px-1">בני המשפחה</h2>
          {memberStats.map((m) => {
            const best = getBestDay(m.id)
            const total = getTotalEntries(m.id)
            const pct = dailyGoal > 0 ? Math.min(100, Math.round((m.totalSugar / dailyGoal) * 100)) : 0
            const barColor = pct < 60 ? '#16a34a' : pct < 90 ? '#f59e0b' : '#dc2626'
            const statusEmoji = pct === 0 ? '😴' : pct < 60 ? '🌟' : pct < 90 ? '👍' : '⚠️'

            return (
              <div key={m.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div>
                    {editingId === m.id ? (
                      <div>
                        <div className="grid grid-cols-5 gap-1 mb-2">
                          {[1,2,3,4,5,6,7,8,9,10].map((i) => (
                            <button key={i} type="button" onClick={() => setEditAvatar(`/avatars/avatar-${i}.png`)}
                              className="overflow-hidden rounded-lg border-2"
                              style={{ borderColor: editAvatar === `/avatars/avatar-${i}.png` ? "#1a4731" : "#e2e8f0" }}>
                              <img src={`/avatars/avatar-${i}.png`} alt="" className="h-10 w-full object-cover" />
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
                  {!editingId && (m.avatar?.startsWith("/") ? <img src={m.avatar} alt="" className="h-10 w-10 rounded-full object-cover" /> : <span className="text-3xl">{m.avatar || "👤"}</span>)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      {editId === m.id ? (
                      <div className="flex gap-1">
                        <input value={editName} onChange={(e) => setEditName(e.target.value)}
                          className="rounded-lg border border-slate-300 px-2 py-1 text-sm font-bold w-28"
                          onKeyDown={(e) => e.key === 'Enter' && editMember(m.id, editName)} />
                        <button onClick={() => editMember(m.id, editName)}
                          className="rounded-lg px-2 py-1 text-xs font-bold text-white" style={{ background: "#1a4731" }}>שמור</button>
                        <button onClick={() => setEditId(null)}
                          className="rounded-lg px-2 py-1 text-xs font-bold text-slate-500 border border-slate-300">ביטול</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold">{m.name}</h3>
                        <button onClick={() => { setEditId(m.id); setEditName(m.name) }}
                          className="text-xs text-slate-400 underline">עריכה</button>
                      </div>
                    )}
                      <span className="text-xl">{statusEmoji}</span>
                    </div>
                    <p className="text-xs text-slate-400">{total} פריטים מוזנים סה״כ</p>
                  </div>
                </div>

                {/* Today's sugar */}
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-500">סוכר היום</span>
                  <span className="font-bold" style={{ color: barColor }}>{m.totalSugar}ג׳</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 mb-3">
                  <div
                    className="h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: barColor }}
                  />
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-lg bg-slate-50 py-2">
                    <p className="text-xs text-slate-400">היום</p>
                    <p className="text-sm font-bold text-slate-700">{m.entryCount} פריטים</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 py-2">
                    <p className="text-xs text-slate-400">שיא אישי (מינימום)</p>
                    <p className="text-sm font-bold text-green-700">
                      {best !== null ? `${best}ג׳` : '—'}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-500">הוספת בן משפחה</h2>
          <div className="grid grid-cols-5 gap-1 mb-3">
            {[1,2,3,4,5,6,7,8,9,10].map((i) => (
              <button key={i} type="button" onClick={() => setSelectedAvatar(`/avatars/avatar-${i}.png`)}
                className="overflow-hidden rounded-lg border-2"
                style={{ borderColor: selectedAvatar === `/avatars/avatar-${i}.png` ? "#1a4731" : "#e2e8f0" }}>
                <img src={`/avatars/avatar-${i}.png`} alt="" className="h-12 w-full object-cover" />
              </button>
            ))}
          </div>
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
      </main>

      <BottomNav />
    </div>
  )
}
