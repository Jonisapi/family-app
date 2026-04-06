import { useState } from 'react'
import { useFamily, useTodaySugar, useTodaySugarByMember } from '../contexts/FamilyContext'
import BottomNav from '../components/BottomNav'
import TopBar from '../components/TopBar'

export default function Goals() {
  const { dailyGoal, setDailyGoal, members } = useFamily()
  const todayTotal = useTodaySugar()
  const memberStats = useTodaySugarByMember()

  const [editMode, setEditMode] = useState(false)
  const [inputGoal, setInputGoal] = useState(String(dailyGoal))

  const pct = dailyGoal > 0 ? Math.min(100, Math.round((todayTotal / dailyGoal) * 100)) : 0
  const remaining = Math.max(0, dailyGoal - todayTotal)
  const isOver = todayTotal > dailyGoal

  function saveGoal() {
    const val = Number(inputGoal)
    if (!Number.isNaN(val) && val > 0) {
      setDailyGoal(val)
      setEditMode(false)
    }
  }

  // Progress bar color
  const barColor = pct < 60 ? '#16a34a' : pct < 90 ? '#f59e0b' : '#dc2626'

  // Suggested next goal (10% lower, rounded to 5)
  const suggestedNext = Math.max(5, Math.round((dailyGoal * 0.9) / 5) * 5)

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 pb-24 text-slate-800">
      <TopBar />

      <main className="mx-auto max-w-xl space-y-5 px-4 py-6">

        {/* Daily Goal Card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-slate-500">יעד סוכר יומי משפחתי</h2>
            <button
              onClick={() => { setEditMode(!editMode); setInputGoal(String(dailyGoal)) }}
              className="text-xs font-semibold text-green-700 underline"
            >
              {editMode ? 'ביטול' : 'עריכה'}
            </button>
          </div>

          {editMode ? (
            <div className="mt-3 flex gap-2">
              <input
                type="number"
                value={inputGoal}
                onChange={(e) => setInputGoal(e.target.value)}
                className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-lg font-bold"
                min={1}
              />
              <span className="self-center text-slate-500">גרם</span>
              <button
                onClick={saveGoal}
                className="ml-auto rounded-lg bg-green-700 px-4 py-2 font-bold text-white text-sm"
              >
                שמור
              </button>
            </div>
          ) : (
            <p className="mt-1 text-4xl font-black text-slate-800">
              {dailyGoal}
              <span className="ml-1 text-lg font-normal text-slate-400">גרם</span>
            </p>
          )}

          {/* Suggested reduction */}
          {!editMode && (
            <button
              onClick={() => { setDailyGoal(suggestedNext) }}
              className="mt-3 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700"
            >
              💡 הפחת ל-{suggestedNext}ג׳ (שיפור של 10%)
            </button>
          )}
        </section>

        {/* Today Progress */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-500">צריכה היום</h2>

          {/* Progress bar */}
          <div className="mb-2 h-4 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-4 rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: barColor }}
            />
          </div>

          <div className="flex justify-between text-sm font-semibold">
            <span style={{ color: barColor }}>{todayTotal}ג׳ סוכר</span>
            <span className="text-slate-400">מתוך {dailyGoal}ג׳</span>
          </div>

          {isOver ? (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
              ⚠️ עברתם את היעד ב-{Math.round(todayTotal - dailyGoal)}ג׳ היום
            </p>
          ) : (
            <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
              ✅ נותרו {remaining}ג׳ עד לסיום היעד היומי
            </p>
          )}
        </section>

        {/* Per-member breakdown */}
        {members.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-slate-500">פירוט לפי בן משפחה — היום</h2>
            <div className="space-y-4">
              {memberStats.map((m) => {
                const memberPct = dailyGoal > 0 ? Math.min(100, Math.round((m.totalSugar / dailyGoal) * 100)) : 0
                const mColor = memberPct < 60 ? '#16a34a' : memberPct < 90 ? '#f59e0b' : '#dc2626'
                return (
                  <div key={m.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-bold">
                        {m.avatar && <span className="mr-1">{m.avatar}</span>}
                        {m.name}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: mColor }}>
                        {m.totalSugar}ג׳
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ width: `${memberPct}%`, background: mColor }}
                      />
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400">{m.entryCount} פריטים הוזנו</p>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Tips */}
        <section className="rounded-2xl border border-green-100 bg-green-50 p-5">
          <h3 className="mb-2 text-sm font-bold text-green-800">💡 טיפים להצלחה</h3>
          <ul className="space-y-1 text-sm text-green-700 list-disc list-inside">
            <li>התחילו עם יעד נמוך אך ריאלי</li>
            <li>הפחיתו את היעד ב-10% כל שבוע שבו עמדתם ביעד</li>
            <li>מים במקום מיץ = חיסכון של 20-30ג׳ סוכר</li>
            <li>בקשו מ-AI הצעות לארוחות דלות סוכר</li>
          </ul>
        </section>

      </main>

      <BottomNav />
    </div>
  )
}
