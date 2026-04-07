import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useFamily } from "../contexts/FamilyContext"
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
  const { setFamilyName, setMembers, setDailyGoal } = useFamily()

  const [step, setStep] = useState(1)
  const [familyNameInput, setFamilyNameInput] = useState("")
  const [memberInput, setMemberInput] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0])
  const [draftMembers, setDraftMembers] = useState<Member[]>([])
  const [selectedGoal, setSelectedGoal] = useState(50)
  const [customGoal, setCustomGoal] = useState("")

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

  function handleSubmit() {
    const goal = customGoal ? Number(customGoal) : selectedGoal
    if (!goal || goal < 5) { alert("נא להזין יעד תקין"); return }
    setFamilyName(familyNameInput.trim())
    setMembers(draftMembers)
    setDailyGoal(goal)
    navigate("/", { replace: true })
  }

  return (
    <div dir="rtl" className="mx-auto max-w-xl p-6">
      <div className="mb-6 flex items-center gap-2">
        <div className={`h-2 flex-1 rounded-full ${step >= 1 ? "bg-green-700" : "bg-slate-200"}`} />
        <div className={`h-2 flex-1 rounded-full ${step >= 2 ? "bg-green-700" : "bg-slate-200"}`} />
      </div>

      {step === 1 && (
        <form onSubmit={handleStep1} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold">שלב 1 — פרטי המשפחה</h1>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">שם משפחה</label>
            <input value={familyNameInput} onChange={(e) => setFamilyNameInput(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              placeholder="לדוגמה: משפחת כהן" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">בחירת אווטאר לבן משפחה</label>
            <div className="grid grid-cols-5 gap-2">
              {AVATARS.map((src) => (
                <button key={src} type="button" onClick={() => setSelectedAvatar(src)}
                  className={`overflow-hidden rounded-lg border-2 ${selectedAvatar === src ? "border-green-700" : "border-slate-200"}`}>
                  <img src={src} alt="avatar" className="h-14 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">הוספת בן משפחה</label>
            <div className="flex gap-2">
              <input value={memberInput} onChange={(e) => setMemberInput(e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
                placeholder="שם בן משפחה" />
              <button type="button" onClick={addMember} className="rounded-lg bg-slate-200 px-4 py-2 font-semibold">הוסף</button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">בני משפחה</p>
            {draftMembers.length === 0 ? (
              <p className="text-sm text-slate-500">עדיין לא הוספת בני משפחה</p>
            ) : (
              <ul className="space-y-2">
                {draftMembers.map((m) => (
                  <li key={m.id} className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <img src={m.avatar} alt={m.name} className="h-8 w-8 rounded-full object-cover" />
                      <span className="font-medium">{m.name}</span>
                    </div>
                    <button type="button" onClick={() => removeMember(m.id)}
                      className="rounded bg-red-100 px-2 py-1 text-xs text-red-700">הסר</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button type="submit" className="w-full rounded-lg bg-green-700 px-4 py-2 font-bold text-white">
            המשך לשלב 2 ←
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold">שלב 2 — יעד סוכר יומי</h1>
          <p className="text-sm text-slate-500">כמה גרם סוכר ביום רוצה המשפחה לצרוך? מומלץ להתחיל בערך ריאלי ולהפחית בהדרגה.</p>

          <div className="grid grid-cols-2 gap-3">
            {GOAL_OPTIONS.map((opt) => (
              <button key={opt.value} type="button" onClick={() => { setSelectedGoal(opt.value); setCustomGoal("") }}
                className={`rounded-xl border-2 p-4 text-right transition ${selectedGoal === opt.value && !customGoal ? "border-green-700 bg-green-50" : "border-slate-200"}`}>
                <p className="font-bold text-slate-800">{opt.label}</p>
                <p className="text-xs text-slate-500 mt-1">{opt.desc}</p>
                <p className="text-2xl font-black text-green-700 mt-1">{opt.value}ג׳</p>
              </button>
            ))}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">או הזן יעד מותאם אישית</label>
            <div className="flex gap-2 items-center">
              <input type="number" value={customGoal} onChange={(e) => setCustomGoal(e.target.value)}
                className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-lg font-bold"
                placeholder="כמות" min={5} />
              <span className="text-slate-500">גרם ביום</span>
            </div>
          </div>

          <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
            <p className="font-bold mb-1">💡 טיפ</p>
            <p>ארגון הבריאות העולמי ממליץ על פחות מ-25 גרם סוכר מוסף ביום. התחילו בערך שנוח לכם ושפרו בהדרגה!</p>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-600">
              ← חזור
            </button>
            <button type="button" onClick={handleSubmit}
              className="flex-1 rounded-lg bg-green-700 px-4 py-2 font-bold text-white">
              התחל! 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
