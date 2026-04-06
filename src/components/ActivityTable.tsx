import { useState } from 'react'
import { useFamily } from '../contexts/FamilyContext'
import type { ActivityEntry } from '../contexts/FamilyContext'

export default function ActivityTable() {
  const { entries, updateEntry, deleteEntry, members } = useFamily()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Omit<ActivityEntry, 'id'> | null>(null)

  const displayEntries = entries

  function startEdit(entry: ActivityEntry) {
    setEditingId(entry.id)
    setDraft({
      memberId: entry.memberId,
      memberName: entry.memberName,
      item: entry.item,
      sugar: entry.sugar,
      calories: entry.calories,
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setDraft(null)
  }

  function saveEdit(id: string) {
    if (!draft) return
    if (!draft.memberName.trim() || !draft.item.trim()) return

    updateEntry(id, {
      memberId: draft.memberId,
      memberName: draft.memberName.trim(),
      item: draft.item.trim(),
      sugar: Number(draft.sugar),
      calories: Number(draft.calories),
    })
    cancelEdit()
  }

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
              <th className="px-4 py-4">בן משפחה</th>
              <th className="px-4 py-4">פריט</th>
              <th className="px-4 py-4 text-center">סוכר (ג׳)</th>
              <th className="px-4 py-4 text-center">קלוריות</th>
              <th className="px-4 py-4 text-center">פעולות</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {displayEntries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  אין נתונים עדיין
                </td>
              </tr>
            ) : (
              displayEntries.map((entry) => {
                const isEditing = editingId === entry.id
                const member =
                members.find((m) => m.id === entry.memberId) ??
                members.find((m) => m.name === entry.memberName)
                return (
                  <tr key={entry.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold">
                      {isEditing ? (
                        <select
                          className="rounded border border-slate-300 px-2 py-1"
                          value={draft?.memberId ?? ''}
                          onChange={(e) => {
                            const selected = members.find((m) => m.id === e.target.value)
                            if (!selected) return
                            setDraft((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    memberId: selected.id,
                                    memberName: selected.name,
                                  }
                                : prev,
                            )
                          }}
                        >
                          {members.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex items-center gap-2">
                          {member?.avatar ? (
                            <img src={member.avatar} alt={entry.memberName} className="h-7 w-7 rounded-full object-cover" />
                          ) : null}
                          <span>{entry.memberName}</span>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-600">
                      {isEditing ? (
                        <input
                          className="w-40 rounded border border-slate-300 px-2 py-1"
                          value={draft?.item ?? ''}
                          onChange={(e) => setDraft((prev) => (prev ? { ...prev, item: e.target.value } : prev))}
                        />
                      ) : (
                        entry.item
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {isEditing ? (
                        <input
                          type="number"
                          className="w-20 rounded border border-slate-300 px-2 py-1 text-center"
                          value={draft?.sugar ?? 0}
                          onChange={(e) =>
                            setDraft((prev) => (prev ? { ...prev, sugar: Number(e.target.value) } : prev))
                          }
                        />
                      ) : (
                        <span
                          className={`rounded-md px-2.5 py-1 text-sm font-bold ${
                            entry.sugar > 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'
                          }`}
                        >
                          {entry.sugar}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center text-sm font-medium">
                      {isEditing ? (
                        <input
                          type="number"
                          className="w-20 rounded border border-slate-300 px-2 py-1 text-center"
                          value={draft?.calories ?? 0}
                          onChange={(e) =>
                            setDraft((prev) => (prev ? { ...prev, calories: Number(e.target.value) } : prev))
                          }
                        />
                      ) : (
                        entry.calories
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {isEditing ? (
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => saveEdit(entry.id)}
                            className="rounded bg-green-700 px-2 py-1 text-xs text-white"
                          >
                            שמור
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="rounded bg-slate-200 px-2 py-1 text-xs"
                          >
                            ביטול
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(entry)}
                            className="rounded bg-slate-200 px-2 py-1 text-xs"
                          >
                            ערוך
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteEntry(entry.id)}
                            className="rounded bg-red-100 px-2 py-1 text-xs text-red-700"
                          >
                            מחק
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="px-1 text-[10px] leading-relaxed text-slate-500">
        * פירות מכילים סוכר טבעי שאינו נספר במכסה המעובדת היומית.
      </p>
    </section>
  )
}