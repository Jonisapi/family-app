import { useState } from 'react'
import { useFamily } from '../contexts/FamilyContext'

export default function ActivityTable() {
  const { entries, deleteEntry } = useFamily()
  const [filter, setFilter] = useState<'today' | 'all'>('today')

  const today = new Date().toISOString().slice(0, 10)

  const filtered = filter === 'today'
    ? entries.filter((e) => e.date === today)
    : entries

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-800">יומן פעילות</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('today')}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              filter === 'today'
                ? 'bg-green-700 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            היום
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              filter === 'all'
                ? 'bg-green-700 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            הכל
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-slate-400">
          {filter === 'today' ? 'אין פריטים להיום עדיין' : 'אין פריטים בכלל'}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-right text-xs font-semibold text-slate-500">
                <th className="px-4 py-3">בן משפחה</th>
                <th className="px-4 py-3">פריט</th>
                <th className="px-4 py-3">סוכר (ג׳)</th>
                <th className="px-4 py-3">קלוריות</th>
                <th className="px-4 py-3">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold">
                    {entry.memberName}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{entry.item}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-bold ${
                        entry.sugar === 0
                          ? 'text-green-600'
                          : entry.sugar < 10
                          ? 'text-amber-500'
                          : 'text-red-500'
                      }`}
                    >
                      {entry.sugar}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{entry.calories}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="rounded bg-red-50 px-2 py-1 text-xs font-semibold text-red-500 hover:bg-red-100"
                    >
                      מחק
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="px-5 py-2 text-xs text-slate-400 border-t border-slate-50">
        * פירות מכילים סוכר טבעי שאינו נספר במכסה המעובדת היומית.
      </p>
    </section>
  )
}
