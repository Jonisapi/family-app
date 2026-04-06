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
  date: string // ISO date string YYYY-MM-DD
}

type FamilyContextValue = {
  familyName: string
  members: Member[]
  entries: ActivityEntry[]
  dailyGoal: number
  setFamilyName: (name: string) => void
  setMembers: (members: Member[]) => void
  setDailyGoal: (goal: number) => void
  addEntry: (entry: Omit<ActivityEntry, 'id' | 'date'>) => void
  updateEntry: (id: string, patch: Omit<ActivityEntry, 'id' | 'date'>) => void
  deleteEntry: (id: string) => void
  clearFamily: () => void
}

const FamilyContext = createContext<FamilyContextValue | undefined>(undefined)

const STORAGE_KEY = 'family-app-state-v2'

type StoredState = {
  familyName: string
  members: Member[]
  entries: ActivityEntry[]
  dailyGoal: number
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function readStoredState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { familyName: '', members: [], entries: [], dailyGoal: 50 }
    const parsed = JSON.parse(raw) as Partial<StoredState>

    const members: Member[] = Array.isArray(parsed.members)
      ? parsed.members
          .filter((m): m is Member => !!m && typeof m.id === 'string' && typeof m.name === 'string')
          .map((m) => ({ id: m.id, name: m.name, avatar: typeof m.avatar === 'string' ? m.avatar : undefined }))
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
        ).map((e) => ({ ...e, date: typeof e.date === 'string' ? e.date : todayISO() }))
      : []

    return {
      familyName: typeof parsed.familyName === 'string' ? parsed.familyName : '',
      members,
      entries,
      dailyGoal: typeof parsed.dailyGoal === 'number' && parsed.dailyGoal > 0 ? parsed.dailyGoal : 50,
    }
  } catch {
    return { familyName: '', members: [], entries: [], dailyGoal: 50 }
  }
}

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const initial = readStoredState()
  const [familyName, setFamilyName] = useState(initial.familyName)
  const [members, setMembers] = useState<Member[]>(initial.members)
  const [entries, setEntries] = useState<ActivityEntry[]>(initial.entries)
  const [dailyGoal, setDailyGoal] = useState<number>(initial.dailyGoal)

  useEffect(() => {
    const payload: StoredState = { familyName, members, entries, dailyGoal }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [familyName, members, entries, dailyGoal])

  function addEntry(entry: Omit<ActivityEntry, 'id' | 'date'>) {
    const newEntry: ActivityEntry = { id: crypto.randomUUID(), date: todayISO(), ...entry }
    setEntries((prev) => [newEntry, ...prev])
  }

  function updateEntry(id: string, patch: Omit<ActivityEntry, 'id' | 'date'>) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  }

  function deleteEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  function clearFamily() {
    setFamilyName('')
    setMembers([])
    setEntries([])
    setDailyGoal(50)
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = useMemo(
    () => ({
      familyName, members, entries, dailyGoal,
      setFamilyName, setMembers, setDailyGoal,
      addEntry, updateEntry, deleteEntry, clearFamily,
    }),
    [familyName, members, entries, dailyGoal],
  )

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>
}

export function useFamily() {
  const ctx = useContext(FamilyContext)
  if (!ctx) throw new Error('useFamily must be used inside FamilyProvider')
  return ctx
}

// Helper: get today's total sugar for all members
export function useTodaySugar() {
  const { entries } = useFamily()
  const today = todayISO()
  return entries
    .filter((e) => e.date === today)
    .reduce((sum, e) => sum + e.sugar, 0)
}

// Helper: get today's sugar per member
export function useTodaySugarByMember() {
  const { entries, members } = useFamily()
  const today = todayISO()
  const todayEntries = entries.filter((e) => e.date === today)
  return members.map((m) => ({
    ...m,
    totalSugar: todayEntries.filter((e) => e.memberId === m.id).reduce((s, e) => s + e.sugar, 0),
    entryCount: todayEntries.filter((e) => e.memberId === m.id).length,
  }))
}
