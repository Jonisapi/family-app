import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFamily } from '../contexts/FamilyContext'
import type { Member } from '../contexts/FamilyContext'

const AVATARS = Array.from({ length: 10 }, (_, i) => `/avatars/avatar-${i + 1}.png`)

export default function Onboarding() {
  const navigate = useNavigate()
  const { setFamilyName, setMembers } = useFamily()

  const [familyNameInput, setFamilyNameInput] = useState('')
  const [memberInput, setMemberInput] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0])
  const [draftMembers, setDraftMembers] = useState<Member[]>([])

  function addMember() {
    const name = memberInput.trim()
    if (!name) return

    setDraftMembers((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        avatar: selectedAvatar,
      },
    ])
    setMemberInput('')
  }

  function removeMember(id: string) {
    setDraftMembers((prev) => prev.filter((m) => m.id !== id))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const familyName = familyNameInput.trim()
    if (!familyName) {
      alert('נא להזין שם משפחה')
      return
    }

    if (draftMembers.length === 0) {
      alert('נא להוסיף לפחות בן משפחה אחד')
      return
    }

    setFamilyName(familyName)
    setMembers(draftMembers)
    navigate('/', { replace: true })
  }

  return (
    <div dir="rtl" className="mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-2xl font-bold">אונבורדינג</h1>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">שם משפחה</label>
          <input
            value={familyNameInput}
            onChange={(e) => setFamilyNameInput(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="לדוגמה: משפחת כהן"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">בחירת אווטאר</label>
          <div className="grid grid-cols-5 gap-2">
            {AVATARS.map((src) => {
              const active = selectedAvatar === src
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => setSelectedAvatar(src)}
                  className={`overflow-hidden rounded-lg border-2 ${active ? 'border-green-700' : 'border-slate-200'}`}
                >
                  <img src={src} alt="avatar option" className="h-14 w-full object-cover" />
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">הוספת בן משפחה</label>
          <div className="flex gap-2">
            <input
              value={memberInput}
              onChange={(e) => setMemberInput(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
              placeholder="שם בן משפחה"
            />
            <button type="button" onClick={addMember} className="rounded-lg bg-slate-200 px-4 py-2 font-semibold">
              הוסף
            </button>
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
                    {m.avatar ? <img src={m.avatar} alt={m.name} className="h-8 w-8 rounded-full object-cover" /> : null}
                    <span className="font-medium">{m.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMember(m.id)}
                    className="rounded bg-red-100 px-2 py-1 text-xs text-red-700"
                  >
                    הסר
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" className="w-full rounded-lg bg-green-700 px-4 py-2 font-bold text-white">
          שמירה והמשך
        </button>
      </form>
    </div>
  )
}