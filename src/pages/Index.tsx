import BottomNav from '../components/BottomNav'
import TopBar from '../components/TopBar'
import ActivityTable from '../components/ActivityTable'
import { useFamily, useTodaySugar, useTodaySugarByMember } from '../contexts/FamilyContext'
import { useNavigate } from 'react-router-dom'
import saladHero from '../assets/salad-hero.png'

export default function Index() {
  const { familyName, dailyGoal, entries } = useFamily()
  const todayTotal = useTodaySugar()
  const memberStats = useTodaySugarByMember()
  const navigate = useNavigate()

  const pct = dailyGoal > 0 ? Math.min(100, Math.round((todayTotal / dailyGoal) * 100)) : 0
  const isOver = todayTotal > dailyGoal
  const remaining = Math.max(0, dailyGoal - todayTotal)
  const ringColor = pct < 60 ? '#4ade80' : pct < 90 ? '#fbbf24' : '#f87171'
  const radius = 54
  const circ = 2 * Math.PI * radius
  const offset = circ - (pct / 100) * circ

  const todayStars = memberStats.filter((m) => m.entryCount > 0)
  const starMember = todayStars.length ? todayStars.reduce((a, b) => (a.totalSugar <= b.totalSugar ? a : b)) : null

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 6)
  const weekAgoISO = weekAgo.toISOString().slice(0, 10)
  const weeklyTotal = entries.filter((e) => e.date >= weekAgoISO).reduce((s, e) => s + e.sugar, 0)
  const weeklyGoal = dailyGoal * 7
  const weeklyPct = weeklyGoal > 0 ? Math.min(100, Math.round((weeklyTotal / weeklyGoal) * 100)) : 0

  return (
    <div dir="rtl" className="min-h-screen pb-24" style={{ background: '#faf7f2', fontFamily: "'Heebo', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;900&display=swap" rel="stylesheet" />
      <TopBar />
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a4731 0%, #2d6a4f 60%, #40916c 100%)', minHeight: 200, width: '100%' }}>
        <img src={saladHero} alt="" className="absolute" style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '45%', objectFit: 'cover', objectPosition: 'center', opacity: 0.85 }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative px-5 pt-5 pb-10">
          <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>שלום,</p>
          <h1 className="text-3xl font-black text-white mt-0.5">משפחת {familyName || 'ספיר'}</h1>
          <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {isOver ? `⚠️ חרגתם ב-${Math.round(todayTotal - dailyGoal)}ג` : `✅ נותרו ${remaining}ג להיום`}
          </p>
          <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
            <span>שבועי: {weeklyTotal}ג / {weeklyGoal}ג</span>
            <span style={{ background: weeklyPct < 80 ? '#4ade80' : '#fbbf24', borderRadius: 999, padding: '1px 8px', color: '#1a4731', fontWeight: 700 }}>{weeklyPct}%</span>
          </div>
        </div>
      </div>
      <main className="mx-auto max-w-lg px-4 -mt-5 space-y-4">
        <div className="rounded-2xl bg-white overflow-hidden" style={{ boxShadow: '0 8px 32px rgba(26,71,49,0.12)' }}>
          <div className="p-5 flex items-center gap-4">
            <div className="relative shrink-0" style={{ width: 120, height: 120 }}>
              <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r={radius} fill="none" stroke="#f0ebe3" strokeWidth="9" />
                <circle cx="60" cy="60" r={radius} fill="none" stroke={ringColor} strokeWidth="9"
                  strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black" style={{ color: '#1a4731', lineHeight: 1 }}>{todayTotal}</span>
                <span className="text-sm font-bold mt-0.5" style={{ color: "#64748b" }}>/ {dailyGoal}ג</span>
                <span className="text-sm font-bold" style={{ color: ringColor }}>{pct}%</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-bold text-slate-800">סוכר היום</h2>
                <button onClick={() => navigate('/goals')} className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: '#e8f5e9', color: '#1a4731' }}>יעדים</button>
              </div>
              <div className="space-y-2">
                {memberStats.map((m) => {
                  const mPct = dailyGoal > 0 ? Math.min(100, Math.round((m.totalSugar / dailyGoal) * 100)) : 0
                  const mColor = mPct < 60 ? '#4ade80' : mPct < 90 ? '#fbbf24' : '#f87171'
                  return (
                    <div key={m.id}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="font-semibold text-slate-700 truncate">{m.name}</span>
                        <span className="font-bold shrink-0 mr-1" style={{ color: mColor }}>{m.totalSugar}ג</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#f0ebe3' }}>
                        <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${mPct}%`, background: mColor }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        {starMember ? (
          <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, #1a4731, #40916c)', boxShadow: '0 8px 32px rgba(26,71,49,0.25)' }}>
            <div className="shrink-0">
              {starMember.avatar?.startsWith('/') ? (
                <img src={starMember.avatar} alt="" className="h-14 w-14 rounded-full object-cover" style={{ border: '2px solid rgba(255,255,255,0.3)' }} />
              ) : (
                <span className="text-4xl">{starMember.avatar}</span>
              )}
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>כוכב היום</p>
              <p className="text-xl font-black text-white">{starMember.name}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>{starMember.totalSugar}ג סוכר בלבד היום</p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #1a4731, #40916c)', boxShadow: '0 8px 32px rgba(26,71,49,0.25)' }}>
            <p className="text-xl font-black text-white">ברוכים הבאים!</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>הוסיפו פריטים כדי להתחיל לעקוב</p>
          </div>
        )}
        <ActivityTable />
      </main>
      <BottomNav />
    </div>
  )
}
