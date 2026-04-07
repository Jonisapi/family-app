import { useFamily, useTodaySugarByMember } from '../contexts/FamilyContext'
import BottomNav from '../components/BottomNav'
import TopBar from '../components/TopBar'
import { useNavigate } from 'react-router-dom'

export default function Family() {
  const { familyName, members, entries, dailyGoal } = useFamily()
  const memberStats = useTodaySugarByMember()
  const navigate = useNavigate()

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
                  {m.avatar?.startsWith("/") ? <img src={m.avatar} alt="" className="h-10 w-10 rounded-full object-cover" /> : <span className="text-3xl">{m.avatar || "👤"}</span>}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">{m.name}</h3>
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

      </main>

      <BottomNav />
    </div>
  )
}
