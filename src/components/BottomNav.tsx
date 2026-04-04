import { NavLink } from 'react-router-dom'

export default function BottomNav() {
  const base = 'text-slate-600'
  const active = 'font-bold text-green-700'

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white p-3">
      <div className="mx-auto flex max-w-4xl justify-around">
        <NavLink to="/" className={({ isActive }) => (isActive ? active : base)}>
          בית
        </NavLink>
        <NavLink to="/add" className={({ isActive }) => (isActive ? active : base)}>
          הוספה
        </NavLink>
        <NavLink to="/goals" className={({ isActive }) => (isActive ? active : base)}>
          יעדים
        </NavLink>
        <NavLink to="/family" className={({ isActive }) => (isActive ? active : base)}>
          משפחה
        </NavLink>
      </div>
    </nav>
  )
}