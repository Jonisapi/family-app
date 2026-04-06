import { FormEvent, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFamily } from '../contexts/FamilyContext'

type SuggestResponse = {
  sugar_per_100g?: number
  calories_per_100g?: number
  confidence?: 'low' | 'medium' | 'high' | string
}

export default function Add() {
  const navigate = useNavigate()
  const { members, addEntry } = useFamily()

  const memberOptions = useMemo(() => members, [members])

  const [memberId, setMemberId] = useState(memberOptions[0]?.id ?? '')
  const [item, setItem] = useState('')
  const [sugar, setSugar] = useState('')
  const [calories, setCalories] = useState('')
  const [loadingSuggest, setLoadingSuggest] = useState(false)
  const [confidence, setConfidence] = useState<string>('')

  async function handleSuggest() {
    const food = item.trim()
    if (!food) {
      alert('נא להזין שם פריט קודם')
      return
    }

    try {
      setLoadingSuggest(true)
      setConfidence('')

      const res = await fetch('http://localhost:8787/api/nutrition/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ food }),
      })

      if (!res.ok) {
        throw new Error('suggest failed')
      }

      const data = (await res.json()) as SuggestResponse

      if (typeof data.sugar_per_100g === 'number') {
        setSugar(String(Math.round(data.sugar_per_100g * 10) / 10))
      }
      if (typeof data.calories_per_100g === 'number') {
        setCalories(String(Math.round(data.calories_per_100g)))
      }
      if (typeof data.confidence === 'string') {
        setConfidence(data.confidence)
      }
    } catch {
      alert('לא הצלחתי להביא הצעת ערכים כרגע')
    } finally {
      setLoadingSuggest(false)
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const sugarNum = Number(sugar)
    const caloriesNum = Number(calories)

    if (!memberId || !item.trim() || Number.isNaN(sugarNum) || Number.isNaN(caloriesNum)) {
      alert('נא למלא את כל השדות בצורה תקינה')
      return
    }

    const selectedMember = members.find((m) => m.id === memberId)
    if (!selectedMember) {
      alert('יש לבחור בן משפחה')
      return
    }

    addEntry({
      memberId: selectedMember.id,
      memberName: selectedMember.name,
      item: item.trim(),
      sugar: sugarNum,
      calories: caloriesNum,
    })

    navigate('/', { replace: true })
  }

  if (!members.length) {
    return (
      <div dir="rtl" className="mx-auto max-w-xl p-6">
        <h1 className="mb-3 text-2xl font-bold">הוספה</h1>
        <p className="mb-4 text-slate-600">אין בני משפחה עדיין. נא להשלים אונבורדינג קודם.</p>
        <button
          type="button"
          onClick={() => navigate('/onboarding')}
          className="rounded-lg bg-green-700 px-4 py-2 font-bold text-white"
        >
          מעבר לאונבורדינג
        </button>
      </div>
    )
  }

  return (
    <div dir="rtl" className="mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-2xl font-bold">הוספת פריט</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">בן משפחה</label>
          <select
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            {memberOptions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">פריט</label>
          <div className="flex gap-2">
            <input
              value={item}
              onChange={(e) => setItem(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
              placeholder="לדוגמה: יוגרט טבעי"
            />
            <button
              type="button"
              onClick={handleSuggest}
              disabled={loadingSuggest}
              className="rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold disabled:opacity-60"
            >
              {loadingSuggest ? 'חושב...' : 'הצעה אוטומטית'}
            </button>
          </div>
          {confidence ? (
            <p className="mt-1 text-xs text-slate-500">רמת ביטחון: {confidence}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">סוכר (גרם ל-100ג)</label>
            <input
              type="number"
              value={sugar}
              onChange={(e) => setSugar(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              min={0}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">קלוריות (ל-100ג)</label>
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              min={0}
            />
          </div>
        </div>

        <button type="submit" className="w-full rounded-lg bg-green-700 px-4 py-2 font-bold text-white">
          שמור פריט
        </button>
      </form>
    </div>
  )
}