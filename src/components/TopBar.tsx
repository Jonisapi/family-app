import { useFamily } from '../contexts/FamilyContext'
import foodIcon from '../assets/food-icon.png'

export default function TopBar() {
  const { familyName } = useFamily()

  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
          <img className="h-full w-full object-cover" src={foodIcon} alt="App icon" />
        </div>
        <h1 className="text-lg font-bold tracking-tight">
          {familyName ? `משפחת ${familyName}` : 'האפליקציה המשפחתית'}
        </h1>
      </div>
      <button type="button" aria-label="Notifications" className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100">
        🔔
      </button>
    </header>
  )
}
