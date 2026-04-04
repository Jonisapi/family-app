import BottomNav from '../components/BottomNav'
import TopBar from '../components/TopBar'
import ActivityTable from '../components/ActivityTable'

export default function Index() {
  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 pb-24 text-slate-800">
      <TopBar />

      <main className="mx-auto max-w-4xl space-y-6 px-6 py-8">
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-500">סיכום שבועי</h2>
          <p className="mt-1 text-2xl font-extrabold">בדרך ליעד המשפחתי</p>
          <p className="mt-2 text-3xl font-black text-green-700">68%</p>
        </section>

        <section className="rounded-xl bg-green-700 p-6 text-white">
          <h3 className="text-xl font-bold">הישג היום: יונתן</h3>
          <p className="mt-1 text-sm text-white/90">שמר על רף 0 גרם סוכר מוסף היום.</p>
        </section>

        <ActivityTable />
      </main>

      <BottomNav />
    </div>
  )
}