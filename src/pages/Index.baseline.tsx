export default function Index() {
  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 pb-24 text-slate-800">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-lg font-bold">משפחת כהן</h1>
        <span>🔔</span>
      </header>

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
      </main>

      <nav className="fixed bottom-0 left-0 right-0 flex justify-around border-t bg-white p-3">
        <span className="font-bold text-green-700">בית</span>
        <span>הוספה</span>
        <span>יעדים</span>
        <span>משפחה</span>
      </nav>
    </div>
  )
}