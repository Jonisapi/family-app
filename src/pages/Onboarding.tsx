import { useNavigate } from 'react-router-dom'
import { useFamily } from '../contexts/FamilyContext'

export default function Onboarding() {
  const navigate = useNavigate()
  const { setFamilyName, setMembers } = useFamily()

  function handleStart() {
    setFamilyName('משפחת כהן')
    setMembers(['אמא', 'אבא', 'נועה'])
    navigate('/', { replace: true })
  }

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">אונבורדינג</h1>
      <p className="mb-4 text-slate-600">לחץ כדי ליצור משפחה לדוגמה ולהמשיך.</p>
      <button
        type="button"
        onClick={handleStart}
        className="rounded-lg bg-green-700 px-4 py-2 text-white"
      >
        התחל
      </button>
    </div>
  )
}