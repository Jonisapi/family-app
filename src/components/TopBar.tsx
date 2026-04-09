import { useFamily } from '../contexts/FamilyContext'
import foodIcon from '../assets/food-icon.png'

export default function TopBar() {
  const { familyName } = useFamily()

  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between px-5 py-3"
      style={{ background: 'rgba(250,247,242,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(26,71,49,0.08)' }}>
      <button type="button" className="rounded-xl p-2 relative" style={{ background: 'rgba(26,71,49,0.06)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a4731" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full" style={{ background: '#4ade80' }} />
      </button>
      <div className="flex items-center gap-2.5">
        <div>
          <p className="text-xs text-left" style={{ color: '#94a3b8', lineHeight: 1 }}>משפחת</p>
          <h1 className="text-base font-black leading-tight" style={{ color: '#1a4731' }}>
            {familyName || 'ספיר'}
          </h1>
        </div>
        <div className="rounded-xl overflow-hidden" style={{ width: 36, height: 36, boxShadow: '0 2px 8px rgba(26,71,49,0.15)' }}>
          <img className="h-full w-full object-cover" src={foodIcon} alt="App icon" />
        </div>
      </div>
    </header>
  )
}
