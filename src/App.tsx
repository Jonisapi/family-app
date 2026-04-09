import { Navigate, Route, Routes } from "react-router-dom"
import { FamilyProvider, useFamily } from "./contexts/FamilyContext"
import Index from "./pages/Index"
import Add from "./pages/Add"
import Goals from "./pages/Goals"
import Family from "./pages/Family"
import Onboarding from "./pages/Onboarding"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { familyCode, loading } = useFamily()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#faf7f2" }}>
        <div className="text-center">
          <p className="text-4xl mb-3">🥗</p>
          <p className="text-sm font-semibold" style={{ color: "#1a4731" }}>טוען...</p>
        </div>
      </div>
    )
  }

  if (!familyCode) {
    return <Navigate to="/onboarding" replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <FamilyProvider>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/add" element={<ProtectedRoute><Add /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
        <Route path="/family" element={<ProtectedRoute><Family /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </FamilyProvider>
  )
}
