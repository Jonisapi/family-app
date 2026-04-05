import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type Member = {
  id: string
  name: string
  avatar?: string
}

export type ActivityEntry = {
  id: string
  memberId: string
  memberName: string
  item: string
  sugar: number
  calories: number
}

type FamilyContextValue = {
  familyName: string
  members: Member[]
  entries: ActivityEntry[]
  setFamilyName: (name: string) => void
  setMembers: (members: Member[]) => void
  addEntry: (entry: Omit<ActivityEntry, 'id'>) => void
  updateEntry: (id: string, patch: Omit<ActivityEntry, 'id'>) => void
  deleteEntry: (id: string) => void
  clearFamily: () => void
}

const FamilyContext = createContext<FamilyContextValue | undefined>(undefined)

const STORAGE_KEY = 'family-app-state-v1'

type StoredState = {
  familyName: string
  members: Member[]
  entries: ActivityEntry[]
}

function readStoredState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { familyName: '', members: [], entries: [] }

    const parsed = JSON.parse(raw) as Partial<StoredState>

    const members: Member[] = Array.isArray(parsed.members)
      ? parsed.members
          .filter((m): m is Member => !!m && typeof m.id === 'string' && typeof m.name === 'string')
          .map((m) => ({
            id: m.id,
            name: m.name,
            avatar: typeof m.avatar === 'string' ? m.avatar : undefined,
          }))
      : []

    const entries: ActivityEntry[] = Array.isArray(parsed.entries)
      ? parsed.entries.filter(
          (e): e is ActivityEntry =>
            !!e &&
            typeof e.id === 'string' &&
            typeof e.memberId === 'string' &&
            typeof e.memberName === 'string' &&
            typeof e.item === 'string' &&
            typeof e.sugar === 'number' &&
            typeof e.calories === 'number',
        )
      : []

    return {
      familyName: typeof parsed.familyName === 'string' ? parsed.familyName : '',
      members,
      entries,
    }
  } catch {
    return { familyName: '', members: [], entries: [] }
  }
}

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const initial = readStoredState()

  const [familyName, setFamilyName] = useState(initial.familyName)
  const [members, setMembers] = useState<Member[]>(initial.members)
  const [entries, setEntries] = useState<ActivityEntry[]>(initial.entries)

  useEffect(() => {
    const payload: StoredState = { familyName, members, entries }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [familyName, members, entries])

  function addEntry(entry: Omit<ActivityEntry, 'id'>) {
    const newEntry: ActivityEntry = { id: crypto.randomUUID(), ...entry }
    setEntries((prev) => [newEntry, ...prev])
  }

  function updateEntry(id: string, patch: Omit<ActivityEntry, 'id'>) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { id, ...patch } : e)))
  }

  function deleteEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  function clearFamily() {
    setFamilyName('')
    setMembers([])
    setEntries([])
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = useMemo(
    () => ({
      familyName,
      members,
      entries,
      setFamilyName,
      setMembers,
      addEntry,
      updateEntry,
      deleteEntry,
      clearFamily,
    }),
    [familyName, members, entries],
  )

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>
}

export function useFamily() {
  const ctx = useContext(FamilyContext)
  if (!ctx) throw new Error('useFamily must be used inside FamilyProvider')
  return ctx
}