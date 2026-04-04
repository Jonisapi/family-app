import { Navigate, Route, Routes } from 'react-router-dom'
import { FamilyProvider, useFamily } from './contexts/FamilyContext'
import Index from './pages/Index'
import Add from './pages/Add'
import Goals from './pages/Goals'
import Family from './pages/Family'
import Onboarding from './pages/Onboarding'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { familyName, members } = useFamily()

  if (!familyName || members.length === 0) {
    return <Navigate to="/onboarding" replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <FamilyProvider>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <Add />
            </ProtectedRoute>
          }
        />

        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <Goals />
            </ProtectedRoute>
          }
        />

        <Route
          path="/family"
          element={
            <ProtectedRoute>
              <Family />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </FamilyProvider>
  )
}