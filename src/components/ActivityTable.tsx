import { useFamily } from '../contexts/FamilyContext'

export default function ActivityTable() {
  const { entries } = useFamily()

  const displayEntries =
    entries.length > 0
      ? entries
      : [
          { id: 'seed-1', member: 'אמא', item: 'אכלתי וופל', sugar: 12, calories: 180 },
          { id: 'seed-2', member: 'אבא', item: 'יוגורט טבעי', sugar: 4, calories: 120 },
          { id: 'seed-3', member: 'נועה', item: 'תפוח עץ', sugar: 0, calories: 95 },
        ]

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xl font-bold">יומן פעילות</h3>
        <span className="rounded-md bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700">היום</span>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-right">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100 text-[11px] font-black uppercase tracking-wider text-slate-500">
              <th className="px-5 py-4">בן משפחה</th>
              <th className="px-5 py-4">פריט</th>
              <th className="px-5 py-4 text-center">סוכר (ג׳)</th>
              <th className="px-5 py-4 text-center">קלוריות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayEntries.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-50">
                <td className="px-5 py-4 font-semibold">{entry.member}</td>
                <td className="px-5 py-4 text-sm text-slate-600">{entry.item}</td>
                <td className="px-5 py-4 text-center">
                  <span
                    className={`rounded-md px-2.5 py-1 text-sm font-bold ${
                      entry.sugar > 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'
                    }`}
                  >
                    {entry.sugar}
                  </span>
                </td>
                <td className="px-5 py-4 text-center text-sm font-medium">{entry.calories}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="px-1 text-[10px] leading-relaxed text-slate-500">
        * פירות מכילים סוכר טבעי שאינו נספר במכסה המעובדת היומית.
      </p>
    </section>
  )
}