import { type FormEvent, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFamily } from '../contexts/FamilyContext'

type SuggestResponse = {
  sugar_per_100g?: number
  calories_per_100g?: number
  confidence?: 'low' | 'medium' | 'high' | string
}

type MealSuggestion = {
  name: string
  description: string
  sugar_g: number
  calories: number
}

export default function Add() {
  const navigate = useNavigate()
  const { members, addEntry, dailyGoal } = useFamily()
  const memberOptions = useMemo(() => members, [members])

  const [memberId, setMemberId] = useState(memberOptions[0]?.id ?? '')
  const [item, setItem] = useState('')
  const [sugar, setSugar] = useState('')
  const [calories, setCalories] = useState('')
  const [loadingSuggest, setLoadingSuggest] = useState(false)
  const [confidence, setConfidence] = useState<string>('')
  const [quantity, setQuantity] = useState('100')
  const [showMeals, setShowMeals] = useState(false)
  const [mealType, setMealType] = useState('')
  const [loadingMeals, setLoadingMeals] = useState(false)
  const [mealSuggestions, setMealSuggestions] = useState<MealSuggestion[]>([])
  const [mealError, setMealError] = useState('')

  async function handleSuggest() {
    const food = item.trim()
    if (!food) { alert('נא להזין שם פריט קודם'); return }
    try {
      setLoadingSuggest(true)
      setConfidence('')
      const res = await fetch('http://localhost:8787/api/nutrition/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ food }),
      })
      if (!res.ok) throw new Error('suggest failed')
      const data = (await res.json()) as SuggestResponse
      if (typeof data.sugar_per_100g === 'number') setSugar(String(Math.round(data.sugar_per_100g * 10) / 10))
      if (typeof data.calories_per_100g === 'number') setCalories(String(Math.round(data.calories_per_100g)))
      if (typeof data.confidence === 'string') setConfidence(data.confidence)
    } catch { alert('לא הצלחתי להביא הצעת ערכים כרגע') }
    finally { setLoadingSuggest(false) }
  }

  async function handleMealSuggest() {
    setLoadingMeals(true)
    setMealError('')
    setMealSuggestions([])
    try {
      const maxSugar = Math.round(dailyGoal / 3)
      const res = await fetch('http://localhost:8787/api/meals/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealType: mealType || 'ארוחה כללית', maxSugar }),
      })
      if (!res.ok) throw new Error('failed')
      const data = await res.json()
      if (Array.isArray(data)) setMealSuggestions(data)
      else setMealError('תשובה לא תקינה מהשרת')
    } catch { setMealError('לא הצלחתי לקבל הצעות. האם השרת רץ?') }
    finally { setLoadingMeals(false) }
  }

  function pickMeal(meal: MealSuggestion) {
    setItem(meal.name)
    setSugar(String(meal.sugar_g))
    setCalories(String(meal.calories))
    setShowMeals(false)
    setMealSuggestions([])
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const sugarNum = Number(sugar)
    const caloriesNum = Number(calories)
    if (!memberId || !item.trim() || Number.isNaN(sugarNum) || Number.isNaN(caloriesNum)) {
      alert('נא למלא את כל השדות בצורה תקינה'); return
    }
    const selectedMember = members.find((m) => m.id === memberId)
    if (!selectedMember) { alert('יש לבחור בן משפחה'); return }
    addEntry({ memberId: selectedMember.id, memberName: selectedMember.name, item: item.trim(), sugar: sugarNum, calories: caloriesNum })
    navigate('/', { replace: true })
  }

  if (!members.length) {
    return (
      <div dir="rtl" className="mx-auto max-w-xl p-6">
        <h1 className="mb-3 text-2xl font-bold">הוספה</h1>
        <p className="mb-4 text-slate-600">אין בני משפחה עדיין.</p>
        <button type="button" onClick={() => navigate('/onboarding')} className="rounded-lg bg-green-700 px-4 py-2 font-bold text-white">מעבר לאונבורדינג</button>
      </div>
    )
  }

  return (
    <div dir="rtl" className="mx-auto max-w-xl p-4 pb-28">
      <h1 className="mb-4 text-2xl font-bold">הוספת פריט</h1>
      <div className="mb-4 rounded-xl border border-green-200 bg-green-50">
        <button type="button" onClick={() => setShowMeals(!showMeals)} className="flex w-full items-center justify-between px-4 py-3 text-sm font-bold text-green-800">
          <span>🤖 קבל הצעות ארוחה דלות סוכר מ-AI</span>
          <span>{showMeals ? '▲' : '▼'}</span>
        </button>
        {showMeals && (
          <div className="border-t border-green-200 px-4 pb-4 pt-3">
            <div className="flex gap-2 mb-3">
              <input value={mealType} onChange={(e) => setMealType(e.target.value)} placeholder="סוג ארוחה (למשל: ארוחת בוקר)" className="flex-1 rounded-lg border border-green-300 bg-white px-3 py-2 text-sm" />
              <button type="button" onClick={handleMealSuggest} disabled={loadingMeals} className="rounded-lg bg-green-700 px-3 py-2 text-sm font-bold text-white disabled:opacity-60">{loadingMeals ? '...' : 'הצע'}</button>
            </div>
            {mealError && <p className="text-xs text-red-500 mb-2">{mealError}</p>}
            {mealSuggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-green-700 mb-1">לחץ על ארוחה כדי לבחור:</p>
                {mealSuggestions.map((meal, i) => (
                  <button key={i} type="button" onClick={() => pickMeal(meal)} className="w-full rounded-lg border border-green-200 bg-white px-3 py-2 text-right hover:bg-green-50">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-bold text-slate-800">{meal.name}</span>
                      <div className="flex gap-2 text-xs mr-2">
                        <span className="rounded-full bg-green-100 px-2 py-0.5 font-semibold text-green-700">{meal.sugar_g}ג סוכר</span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-500">{meal.calories} קל</span>
                      </div>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{meal.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">בן משפחה</label>
          <select value={memberId} onChange={(e) => setMemberId(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2">
            {memberOptions.map((m) => (<option key={m.id} value={m.id}>{m.name}</option>))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">פריט</label>
          <div className="flex gap-2">
            <input value={item} onChange={(e) => setItem(e.target.value)} className="flex-1 rounded-lg border border-slate-300 px-3 py-2" placeholder="לדוגמה: יוגרט טבעי" />
            <button type="button" onClick={handleSuggest} disabled={loadingSuggest} className="rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold disabled:opacity-60">{loadingSuggest ? 'חושב...' : 'ערכים אוטומטיים'}</button>
          </div>
          {confidence && <p className="mt-1 text-xs text-slate-500">רמת ביטחון: {confidence}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">כמות שאכלת (גרם)</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value)
              const q = Number(e.target.value)
              const s = Number(sugar)
              const c = Number(calories)
              if (q && s) setSugar(String(Math.round(q * s / 100 * 10) / 10))
              if (q && c) setCalories(String(Math.round(q * c / 100)))
            }}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            min={1}
          />
          <p className="mt-1 text-xs text-slate-400">הערכים יחושבו אוטומטית לפי הכמות</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">סוכר (גרם)</label>
            <input type="number" value={sugar} onChange={(e) => setSugar(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" min={0} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">קלוריות</label>
            <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2" min={0} />
          </div>
        </div>
        <button type="submit" className="w-full rounded-lg bg-green-700 px-4 py-2 font-bold text-white">שמור פריט</button>
      </form>
    </div>
  )
}
