import BottomNav from '../components/BottomNav'
import TopBar from '../components/TopBar'
import ActivityTable from '../components/ActivityTable'
import { useFamily, useTodaySugar, useTodaySugarByMember } from '../contexts/FamilyContext'
import { useNavigate } from 'react-router-dom'

export default function Index() {
  const { familyName, dailyGoal, entries } = useFamily()
  const todayTotal = useTodaySugar()
  const memberStats = useTodaySugarByMember()
  const navigate = useNavigate()

  const pct = dailyGoal > 0 ? Math.min(100, Math.round((todayTotal / dailyGoal) * 100)) : 0
  const isOver = todayTotal > dailyGoal
  const remaining = Math.max(0, dailyGoal - todayTotal)
  const barColor = pct < 60 ? '#16a34a' : pct < 90 ? '#f59e0b' : '#dc2626'

  // Star of today = member with LEAST sugar (who has at least 1 entry)
  const todayStars = memberStats.filter((m) => m.entryCount > 0)
  const starMember = todayStars.length
    ? todayStars.reduce((a, b) => (a.totalSugar <= b.totalSugar ? a : b))
    : null

  // Weekly sugar (last 7 days)
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 6)
  const weekAgoISO = weekAgo.toISOString().slice(0, 10)
  const weeklyTotal = entries
    .filter((e) => e.date >= weekAgoISO)
    .reduce((s, e) => s + e.sugar, 0)
  const weeklyGoal = dailyGoal * 7
  const weeklyPct = weeklyGoal > 0 ? Math.min(100, Math.round((weeklyTotal / weeklyGoal) * 100)) : 0

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 pb-24 text-slate-800">
      <TopBar />

      <main className="mx-auto max-w-4xl space-y-5 px-4 py-6">

        {/* Weekly Summary */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500">סיכום שבועי — {familyName || 'המשפחה'}</h2>
          <p className="mt-1 text-xl font-extrabold">
            {weeklyPct < 80 ? 'בדרך ליעד המשפחתי 💪' : weeklyPct < 100 ? 'כמעט שם! 🔥' : 'שימו לב — חרגתם מהיעד ⚠️'}
          </p>

          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-3 rounded-full transition-all duration-700"
              style={{ width: `${weeklyPct}%`, background: barColor }}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>{weeklyTotal}ג׳ סוכר השבוע</span>
            <span>יעד: {weeklyGoal}ג׳</span>
          </div>
        </section>

        {/* Today's progress */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-500">סוכר היום</h2>
            <button
              onClick={() => navigate('/goals')}
              className="text-xs font-semibold text-green-700 underline"
            >
              יעד: {dailyGoal}ג׳ ←
            </button>
          </div>

          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-black" style={{ color: barColor }}>{todayTotal}</span>
            <span className="text-lg text-slate-400 mb-1">/ {dailyGoal}ג׳</span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-3 rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: barColor }}
            />
          </div>

          {isOver ? (
            <p className="mt-2 text-sm font-semibold text-red-500">⚠️ חרגתם ב-{Math.round(todayTotal - dailyGoal)}ג׳ מהיעד היומי</p>
          ) : (
            <p className="mt-2 text-sm font-semibold text-green-700">✅ נותרו {remaining}ג׳ — כל הכבוד!</p>
          )}
        </section>

        {/* Star of the day */}
        {starMember ? (
          <section className="rounded-2xl bg-green-700 p-5 text-white">
            <h3 className="text-lg font-bold">
              {starMember.avatar && <span className="mr-1">{starMember.avatar}</span>}
              כוכב היום: {starMember.name} ⭐
            </h3>
            <p className="mt-1 text-sm text-white/90">
              הכי פחות סוכר היום — {starMember.totalSugar}ג׳ מתוך יעד {dailyGoal}ג׳
            </p>
          </section>
        ) : (
          <section className="rounded-2xl bg-green-700 p-5 text-white">
            <h3 className="text-lg font-bold">ברוכים הבאים! 👋</h3>
            <p className="mt-1 text-sm text-white/90">
              הוסיפו פריטים כדי להתחיל לעקוב אחרי הסוכר המשפחתי
            </p>
          </section>
        )}

        {/* Activity Table */}
        <ActivityTable />

      </main>

      <BottomNav />
    </div>
  )
}
