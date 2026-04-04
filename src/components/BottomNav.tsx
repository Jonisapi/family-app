export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white p-3">
      <div className="mx-auto flex max-w-4xl justify-around">
        <span className="font-bold text-green-700">בית</span>
        <span className="text-slate-600">הוספה</span>
        <span className="text-slate-600">יעדים</span>
        <span className="text-slate-600">משפחה</span>
      </div>
    </nav>
  )
}