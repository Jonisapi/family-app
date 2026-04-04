import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type FamilyContextValue = {
  familyName: string
  members: string[]
  setFamilyName: (name: string) => void
  setMembers: (members: string[]) => void
  clearFamily: () => void
}

const FamilyContext = createContext<FamilyContextValue | undefined>(undefined)

const STORAGE_KEY = 'family-app-state-v1'

type StoredState = {
  familyName: string
  members: string[]
}

function readStoredState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { familyName: '', members: [] }

    const parsed = JSON.parse(raw) as Partial<StoredState>
    return {
      familyName: typeof parsed.familyName === 'string' ? parsed.familyName : '',
      members: Array.isArray(parsed.members) ? parsed.members.filter((m) => typeof m === 'string') : [],
    }
  } catch {
    return { familyName: '', members: [] }
  }
}

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const initial = readStoredState()

  const [familyName, setFamilyName] = useState(initial.familyName)
  const [members, setMembers] = useState<string[]>(initial.members)

  useEffect(() => {
    const payload: StoredState = { familyName, members }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [familyName, members])

  function clearFamily() {
    setFamilyName('')
    setMembers([])
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = useMemo(
    () => ({ familyName, members, setFamilyName, setMembers, clearFamily }),
    [familyName, members],
  )

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>
}

export function useFamily() {
  const ctx = useContext(FamilyContext)
  if (!ctx) throw new Error('useFamily must be used inside FamilyProvider')
  return ctx
}