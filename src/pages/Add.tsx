import { FormEvent, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFamily } from '../contexts/FamilyContext'

export default function Add() {
  const navigate = useNavigate()
  const { members, addEntry } = useFamily()

  const memberOptions = useMemo(() => (members.length ? members : ['אמא', 'אבא', 'נועה']), [members])

  const [member, setMember] = useState(memberOptions[0] ?? '')
  const [item, setItem] = useState('')
  const [sugar, setSugar] = useState('')
  const [calories, setCalories] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const sugarNum = Number(sugar)
    const caloriesNum = Number(calories)

    if (!member || !item.trim() || Number.isNaN(sugarNum) || Number.isNaN(caloriesNum)) {
      alert('נא למלא את כל השדות בצורה תקינה')
      return
    }

    addEntry({
      member,
      item: item.trim(),
      sugar: sugarNum,
      calories: caloriesNum,
    })

    navigate('/', { replace: true })
  }

  return (
    <div dir="rtl" className="mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-2xl font-bold">הוספת פריט</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">בן משפחה</label>
          <select
            value={member}
            onChange={(e) => setMember(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            {memberOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">פריט</label>
          <input
            value={item}
            onChange={(e) => setItem(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="לדוגמה: יוגורט טבעי"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">סוכר (גרם)</label>
            <input
              type="number"
              value={sugar}
              onChange={(e) => setSugar(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              min={0}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">קלוריות</label>
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