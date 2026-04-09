import { type FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFamily } from "../contexts/FamilyContext"
import saladHero from "../assets/salad-hero.png"
import type { Member } from "../contexts/FamilyContext"

const AVATARS = ["/avatars/avatar-1.png","/avatars/avatar-2.png","/avatars/avatar-3.png","/avatars/avatar-4.png","/avatars/avatar-5.png","/avatars/avatar-6.png","/avatars/avatar-7.png","/avatars/avatar-8.png","/avatars/avatar-9.png","/avatars/avatar-10.png"]

const GOAL_OPTIONS = [
  { label: "נמוך מאוד", value: 25, desc: "פחות מ-25 גרם ביום" },
  { label: "נמוך", value: 37, desc: "פחות מ-37 גרם ביום" },
  { label: "ממוצע", value: 50, desc: "50 גרם ביום (מומלץ להתחלה)" },
  { label: "גבוה", value: 75, desc: "75 גרם ביום" },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const { setupFamily, joinFamily } = useFamily()

  const [mode, setMode] = useState<"choose" | "create" | "join">("choose")
  const [step, setStep] = useState(1)
  const [familyNameInput, setFamilyNameInput] = useState("")
  const [memberInput, setMemberInput] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0])
  const [draftMembers, setDraftMembers] = useState<Member[]>([])
  const [selectedGoal, setSelectedGoal] = useState(50)
  const [customGoal, setCustomGoal] = useState("")
  const [joinCode, setJoinCode] = useState("")
  const [joining, setJoining] = useState(false)
  const [joinError, setJoinError] = useState("")
  const [creating, setCreating] = useState(false)
  const [createdCode, setCreatedCode] = useState("")

  function addMember() {
    const name = memberInput.trim()
    if (!name) return
    setDraftMembers((prev) => [...prev, { id: crypto.randomUUID(), name, avatar: selectedAvatar }])
    setMemberInput("")
  }

  function removeMember(id: string) {
    setDraftMembers((prev) => prev.filter((m) => m.id !== id))
  }

  function handleStep1(e: FormEvent) {
    e.preventDefault()
    if (!familyNameInput.trim()) { alert("נא להזין שם משפחה"); return }
    if (draftMembers.length === 0) { alert("נא להוסיף לפחות בן משפחה אחד"); return }
    setStep(2)
  }

  async function handleCreate() {
    const goal = customGoal ? Number(customGoal) : selectedGoal
    if (!goal || goal < 5) { alert("נא להזין יעד תקין"); return }
    setCreating(true)
    try {
      const code = await setupFamily(familyNameInput.trim(), draftMembers, goal)
      setCreatedCode(code)
      setStep(3)
    } catch {
      alert("שגיאה ביצירת המשפחה. נסה שוב.")
    } finally {
      setCreating(false)
    }
  }

  async function handleJoin(e: FormEvent) {
    e.preventDefault()
    if (!joinCode.trim()) return
    setJoining(true)
    setJoinError("")
    try {
      const success = await joinFamily(joinCode.trim())
      if (success) {
        navigate("/", { replace: true })
      } else {
        setJoinError("קוד משפחה לא נמצא. בדוק שוב.")
      }
    } catch {
      setJoinError("שגיאה בחיבור. נסה שוב.")
    } finally {
      setJoining(false)
    }
  }

  // Choose mode screen
  if (mode === "choose") {
    return (
      <div dir="rtl" className="mx-auto max-w-xl p-6 min-h-screen flex flex-col justify-center">
        <div className="text-center mb-8">
          <img src={saladHero} alt="" className="mx-auto mb-3" style={{ height: 120, width: 120, objectFit: "contain" }} />
          <h1 className="text-3xl font-black" style={{ color: "#1a4731" }}>ברוכים הבאים!</h1>
          <p className="text-slate-500 mt-2">אפליקציית המשפחה להפחתת סוכר</p>
        </div>
        <div className="space-y-3">
          <button onClick={() => setMode("create")}
            className="w-full rounded-2xl p-5 text-right border-2 transition-all"
            style={{ borderColor: "#1a4731", background: "#1a4731", color: "white" }}>
            <p className="text-lg font-black">צור משפחה חדשה</p>
            <p className="text-sm opacity-80 mt-0.5">התחל מסע בריאות משפחתי חדש</p>
          </button>
          <button onClick={() => setMode("join")}
            className="w-full rounded-2xl p-5 text-right border-2 transition-all"
            style={{ borderColor: "#1a4731", color: "#1a4731", background: "white" }}>
            <p className="text-lg font-black">הצטרף למשפחה קיימת</p>
            <p className="text-sm opacity-70 mt-0.5">יש לך קוד? הצטרף לקבוצה</p>
          </button>
        </div>
      </div>
    )
  }

  // Join mode
  if (mode === "join") {
    return (
      <div dir="rtl" className="mx-auto max-w-xl p-6">
        <button onClick={() => setMode("choose")} className="mb-4 text-sm font-semibold" style={{ color: "#1a4731" }}>← חזור</button>
        <h1 className="text-2xl font-black mb-2" style={{ color: "#1a4731" }}>הצטרף למשפחה</h1>
        <p className="text-slate-500 text-sm mb-6">הזן את הקוד שקיבלת מאחד מבני המשפחה</p>
        <form onSubmit={handleJoin} className="space-y-4">
          <input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="קוד משפחה (6 תווים)"
            maxLength={6}
            className="w-full rounded-2xl border-2 px-5 py-4 text-center text-2xl font-black tracking-widest"
            style={{ borderColor: "#1a4731", color: "#1a4731" }}
          />
          {joinError && <p className="text-red-500 text-sm text-center">{joinError}</p>}
          <button type="submit" disabled={joining || joinCode.length < 4}
            className="w-full rounded-2xl py-4 font-black text-white text-lg disabled:opacity-60"
            style={{ background: "#1a4731" }}>
            {joining ? "מחפש..." : "הצטרף!"}
          </button>
        </form>
      </div>
    )
  }

  // Step 3 - Success screen with code
  if (step === 3) {
    return (
      <div dir="rtl" className="mx-auto max-w-xl p-6 text-center">
        <p className="text-5xl mb-4">🎉</p>
        <h1 className="text-2xl font-black mb-2" style={{ color: "#1a4731" }}>המשפחה נוצרה!</h1>
        <p className="text-slate-500 mb-6">שתפו את הקוד עם בני המשפחה כדי שיצטרפו</p>
        <div className="rounded-2xl p-6 mb-6" style={{ background: "#1a4731" }}>
          <p className="text-sm text-white/70 mb-1">קוד המשפחה שלכם</p>
          <p className="text-5xl font-black text-white tracking-widest">{createdCode}</p>
        </div>
        <p className="text-xs text-slate-400 mb-6">שמרו את הקוד! בני משפחה יצטרכו אותו כדי להצטרף</p>
        <button onClick={() => navigate("/", { replace: true })}
          className="w-full rounded-2xl py-4 font-black text-white text-lg"
          style={{ background: "#1a4731" }}>
          בוא נתחיל!
        </button>
      </div>
    )
  }

  return (
    <div dir="rtl" className="mx-auto max-w-xl p-6">
      <button onClick={() => setMode("choose")} className="mb-2 text-sm font-semibold" style={{ color: "#1a4731" }}>← חזור</button>
      <div className="mb-4 flex items-center gap-2">
        <div className={`h-2 flex-1 rounded-full ${step >= 1 ? "bg-green-700" : "bg-slate-200"}`} style={{ background: step >= 1 ? "#1a4731" : "#e2e8f0" }} />
        <div className={`h-2 flex-1 rounded-full`} style={{ background: step >= 2 ? "#1a4731" : "#e2e8f0" }} />
      </div>

      {step === 1 && (
        <form onSubmit={handleStep1} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-black" style={{ color: "#1a4731" }}>שלב 1 — פרטי המשפחה</h1>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">שם משפחה</label>
            <input value={familyNameInput} onChange={(e) => setFamilyNameInput(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              placeholder="לדוגמה: משפחת כהן" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">בחירת אווטאר</label>
            <div className="grid grid-cols-5 gap-2">
              {AVATARS.map((src) => (
                <button key={src} type="button" onClick={() => setSelectedAvatar(src)}
                  className={`overflow-hidden rounded-xl border-2 ${selectedAvatar === src ? "border-green-700" : "border-slate-200"}`}
                  style={{ borderColor: selectedAvatar === src ? "#1a4731" : "#e2e8f0" }}>
                  <img src={src} alt="avatar" className="h-14 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">הוספת בן משפחה</label>
            <div className="flex gap-2">
              <input value={memberInput} onChange={(e) => setMemberInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMember())}
                className="flex-1 rounded-xl border border-slate-300 px-3 py-2"
                placeholder="שם בן משפחה" />
              <button type="button" onClick={addMember} className="rounded-xl px-4 py-2 font-semibold text-white" style={{ background: "#1a4731" }}>הוסף</button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">בני משפחה ({draftMembers.length})</p>
            {draftMembers.length === 0 ? (
              <p className="text-sm text-slate-400">עדיין לא הוספת בני משפחה</p>
            ) : (
              <ul className="space-y-2">
                {draftMembers.map((m) => (
                  <li key={m.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <img src={m.avatar} alt={m.name} className="h-8 w-8 rounded-full object-cover" />
                      <span className="font-medium">{m.name}</span>
                    </div>
                    <button type="button" onClick={() => removeMember(m.id)}
                      className="rounded-lg bg-red-50 px-2 py-1 text-xs text-red-600">הסר</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit" className="w-full rounded-xl py-3 font-black text-white" style={{ background: "#1a4731" }}>
            המשך לשלב 2 ←
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-black" style={{ color: "#1a4731" }}>שלב 2 — יעד סוכר יומי</h1>
          <p className="text-sm text-slate-500">כמה גרם סוכר ביום רוצה המשפחה לצרוך?</p>
          <div className="grid grid-cols-2 gap-3">
            {GOAL_OPTIONS.map((opt) => (
              <button key={opt.value} type="button" onClick={() => { setSelectedGoal(opt.value); setCustomGoal("") }}
                className="rounded-xl border-2 p-4 text-right transition"
                style={{ borderColor: selectedGoal === opt.value && !customGoal ? "#1a4731" : "#e2e8f0", background: selectedGoal === opt.value && !customGoal ? "#f0fdf4" : "white" }}>
                <p className="font-bold text-slate-800">{opt.label}</p>
                <p className="text-xs text-slate-500 mt-1">{opt.desc}</p>
                <p className="text-2xl font-black mt-1" style={{ color: "#1a4731" }}>{opt.value}ג</p>
              </button>
            ))}
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">או הזן יעד מותאם אישית</label>
            <div className="flex gap-2 items-center">
              <input type="number" value={customGoal} onChange={(e) => setCustomGoal(e.target.value)}
                className="w-32 rounded-xl border border-slate-300 px-3 py-2 text-lg font-bold"
                placeholder="כמות" min={5} />
              <span className="text-slate-500">גרם ביום</span>
            </div>
          </div>
          <div className="rounded-xl p-4 text-sm" style={{ background: "#f0fdf4", color: "#1a4731" }}>
            <p className="font-bold mb-1">💡 טיפ</p>
            <p>ארגון הבריאות העולמי ממליץ על פחות מ-25 גרם סוכר מוסף ביום.</p>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)}
              className="flex-1 rounded-xl border border-slate-300 py-3 font-semibold text-slate-600">← חזור</button>
            <button type="button" onClick={handleCreate} disabled={creating}
              className="flex-1 rounded-xl py-3 font-black text-white disabled:opacity-60"
              style={{ background: "#1a4731" }}>
              {creating ? "יוצר..." : "צור משפחה!"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
