import { createContext, useContext, useEffect, useMemo, useState } from "react"
import {
  createFamily, getFamilyByCode, updateFamily,
  addEntryToFirestore, deleteEntryFromFirestore,
  subscribeToEntries, subscribeToFamily
} from "../lib/familyService"

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
  date: string
}

type FamilyContextValue = {
  familyName: string
  members: Member[]
  entries: ActivityEntry[]
  dailyGoal: number
  familyCode: string | null
  loading: boolean
  setDailyGoal: (goal: number) => void
  setupFamily: (familyName: string, members: Member[], dailyGoal: number) => Promise<string>
  joinFamily: (code: string) => Promise<boolean>
  addEntry: (entry: Omit<ActivityEntry, "id" | "date">) => Promise<void>
  deleteEntry: (id: string) => Promise<void>
  clearFamily: () => void
}

const FamilyContext = createContext<FamilyContextValue | undefined>(undefined)
const STORAGE_KEY = "family-app-code-v3"

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const [familyName, setFamilyName] = useState("")
  const [members, setMembers] = useState<Member[]>([])
  const [entries, setEntries] = useState<ActivityEntry[]>([])
  const [dailyGoal, setDailyGoalState] = useState(50)
  const [familyCode, setFamilyCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // On mount, check localStorage for existing family code
  useEffect(() => {
    const savedCode = localStorage.getItem(STORAGE_KEY)
    if (savedCode) {
      setFamilyCode(savedCode)
    } else {
      setLoading(false)
    }
  }, [])

  // Subscribe to Firestore when we have a code
  useEffect(() => {
    if (!familyCode) return

    setLoading(true)
    const unsubFamily = subscribeToFamily(familyCode, (data) => {
      setFamilyName(data.familyName)
      setMembers(data.members)
      setDailyGoalState(data.dailyGoal)
      setLoading(false)
    })

    const unsubEntries = subscribeToEntries(familyCode, (data) => {
      setEntries(data)
    })

    return () => {
      unsubFamily()
      unsubEntries()
    }
  }, [familyCode])

  async function setupFamily(name: string, mems: Member[], goal: number): Promise<string> {
    const code = await createFamily(name, mems, goal)
    localStorage.setItem(STORAGE_KEY, code)
    setFamilyCode(code)
    return code
  }

  async function joinFamily(code: string): Promise<boolean> {
    const data = await getFamilyByCode(code)
    if (!data) return false
    localStorage.setItem(STORAGE_KEY, code.toUpperCase())
    setFamilyCode(code.toUpperCase())
    return true
  }

  async function setDailyGoal(goal: number) {
    setDailyGoalState(goal)
    if (familyCode) await updateFamily(familyCode, { dailyGoal: goal })
  }

  async function addEntry(entry: Omit<ActivityEntry, "id" | "date">) {
    if (!familyCode) return
    await addEntryToFirestore(familyCode, { ...entry, date: todayISO() })
  }

  async function deleteEntry(id: string) {
    if (!familyCode) return
    await deleteEntryFromFirestore(familyCode, id)
  }

  function clearFamily() {
    localStorage.removeItem(STORAGE_KEY)
    setFamilyCode(null)
    setFamilyName("")
    setMembers([])
    setEntries([])
    setDailyGoalState(50)
  }

  const value = useMemo(() => ({
    familyName, members, entries, dailyGoal, familyCode, loading,
    setDailyGoal, setupFamily, joinFamily, addEntry, deleteEntry, clearFamily,
    // Keep backwards compat
    setFamilyName: () => {}, setMembers: () => {},
  }), [familyName, members, entries, dailyGoal, familyCode, loading])

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>
}

export function useFamily() {
  const ctx = useContext(FamilyContext)
  if (!ctx) throw new Error("useFamily must be used inside FamilyProvider")
  return ctx
}

export function useTodaySugar() {
  const { entries } = useFamily()
  const today = todayISO()
  return entries.filter((e) => e.date === today).reduce((sum, e) => sum + e.sugar, 0)
}

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
