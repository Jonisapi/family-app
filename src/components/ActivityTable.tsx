export default function ActivityTable() {
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
            <tr className="hover:bg-slate-50">
              <td className="px-5 py-4 font-semibold">אמא</td>
              <td className="px-5 py-4 text-sm text-slate-600">אכלתי וופל</td>
              <td className="px-5 py-4 text-center">
                <span className="rounded-md bg-red-50 px-2.5 py-1 text-sm font-bold text-red-600">12</span>
              </td>
              <td className="px-5 py-4 text-center text-sm font-medium">180</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-5 py-4 font-semibold">אבא</td>
              <td className="px-5 py-4 text-sm text-slate-600">יוגורט טבעי</td>
              <td className="px-5 py-4 text-center">
                <span className="rounded-md bg-green-50 px-2.5 py-1 text-sm font-bold text-green-700">4</span>
              </td>
              <td className="px-5 py-4 text-center text-sm font-medium">120</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-5 py-4 font-semibold">נועה</td>
              <td className="px-5 py-4 text-sm text-slate-600">תפוח עץ</td>
              <td className="px-5 py-4 text-center">
                <span className="rounded-md bg-green-50 px-2.5 py-1 text-sm font-bold text-green-700">0*</span>
              </td>
              <td className="px-5 py-4 text-center text-sm font-medium">95</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="px-1 text-[10px] leading-relaxed text-slate-500">
        * פירות מכילים סוכר טבעי שאינו נספר במכסה המעובדת היומית.
      </p>
    </section>
  )
}