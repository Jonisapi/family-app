import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type ActivityEntry = {
  id: string
  member: string
  item: string
  sugar: number
  calories: number
}

type FamilyContextValue = {
  familyName: string
  members: string[]
  entries: ActivityEntry[]
  setFamilyName: (name: string) => void
  setMembers: (members: string[]) => void
  addEntry: (entry: Omit<ActivityEntry, 'id'>) => void
  clearFamily: () => void
}

const FamilyContext = createContext<FamilyContextValue | undefined>(undefined)

const STORAGE_KEY = 'family-app-state-v1'

type StoredState = {
  familyName: string
  members: string[]
  entries: ActivityEntry[]
}

function readStoredState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { familyName: '', members: [], entries: [] }

    const parsed = JSON.parse(raw) as Partial<StoredState>
    return {
      familyName: typeof parsed.familyName === 'string' ? parsed.familyName : '',
      members: Array.isArray(parsed.members) ? parsed.members.filter((m) => typeof m === 'string') : [],
      entries: Array.isArray(parsed.entries)
        ? parsed.entries.filter(
            (e) =>
              e &&
              typeof e.id === 'string' &&
              typeof e.member === 'string' &&
              typeof e.item === 'string' &&
              typeof e.sugar === 'number' &&
              typeof e.calories === 'number',
          )
        : [],
    }
  } catch {
    return { familyName: '', members: [], entries: [] }
  }
}

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const initial = readStoredState()

  const [familyName, setFamilyName] = useState(initial.familyName)
  const [members, setMembers] = useState<string[]>(initial.members)
  const [entries, setEntries] = useState<ActivityEntry[]>(initial.entries)

  useEffect(() => {
    const payload: StoredState = { familyName, members, entries }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [familyName, members, entries])

  function addEntry(entry: Omit<ActivityEntry, 'id'>) {
    const newEntry: ActivityEntry = {
      id: crypto.randomUUID(),
      ...entry,
    }
    setEntries((prev) => [newEntry, ...prev])
  }

  function clearFamily() {
    setFamilyName('')
    setMembers([])
    setEntries([])
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = useMemo(
    () => ({ familyName, members, entries, setFamilyName, setMembers, addEntry, clearFamily }),
    [familyName, members, entries],
  )

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>
}

export function useFamily() {
  const ctx = useContext(FamilyContext)
  if (!ctx) throw new Error('useFamily must be used inside FamilyProvider')
  return ctx
}