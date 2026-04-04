import { Navigate, Route, Routes } from 'react-router-dom'
import Index from './pages/Index'
import Add from './pages/Add'
import Goals from './pages/Goals'
import Family from './pages/Family'
import Onboarding from './pages/Onboarding'

export default function App() {
  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/" element={<Index />} />
      <Route path="/add" element={<Add />} />
      <Route path="/goals" element={<Goals />} />
      <Route path="/family" element={<Family />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}