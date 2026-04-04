import { createContext, useContext, useMemo, useState } from 'react'

type FamilyContextValue = {
  familyName: string
  members: string[]
  setFamilyName: (name: string) => void
  setMembers: (members: string[]) => void
}

const FamilyContext = createContext<FamilyContextValue | undefined>(undefined)

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const [familyName, setFamilyName] = useState('') // empty => not onboarded
  const [members, setMembers] = useState<string[]>([]) // empty => not onboarded

  const value = useMemo(
    () => ({ familyName, members, setFamilyName, setMembers }),
    [familyName, members],
  )

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>
}

export function useFamily() {
  const ctx = useContext(FamilyContext)
  if (!ctx) throw new Error('useFamily must be used inside FamilyProvider')
  return ctx
}