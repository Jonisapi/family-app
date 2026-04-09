import { db } from "./firebase"
import {
  doc, setDoc, getDoc, collection,
  addDoc, onSnapshot, deleteDoc, updateDoc
} from "firebase/firestore"
import type { Member, ActivityEntry } from "../contexts/FamilyContext"

export type FamilyDoc = {
  familyName: string
  members: Member[]
  dailyGoal: number
  code: string
  createdAt: number
}

export function generateFamilyCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export async function createFamily(familyName: string, members: Member[], dailyGoal: number): Promise<string> {
  const code = generateFamilyCode()
  const familyRef = doc(db, "families", code)
  await setDoc(familyRef, { familyName, members, dailyGoal, code, createdAt: Date.now() })
  return code
}

export async function getFamilyByCode(code: string): Promise<FamilyDoc | null> {
  const familyRef = doc(db, "families", code.toUpperCase())
  const snap = await getDoc(familyRef)
  if (!snap.exists()) return null
  return snap.data() as FamilyDoc
}

export async function updateFamily(code: string, data: Partial<FamilyDoc>) {
  const familyRef = doc(db, "families", code)
  await updateDoc(familyRef, data)
}

export async function addEntryToFirestore(familyCode: string, entry: Omit<ActivityEntry, "id">) {
  const entriesRef = collection(db, "families", familyCode, "entries")
  await addDoc(entriesRef, { ...entry, createdAt: Date.now() })
}

export async function deleteEntryFromFirestore(familyCode: string, entryId: string) {
  const entryRef = doc(db, "families", familyCode, "entries", entryId)
  await deleteDoc(entryRef)
}

export function subscribeToEntries(familyCode: string, callback: (entries: ActivityEntry[]) => void) {
  const entriesRef = collection(db, "families", familyCode, "entries")
  return onSnapshot(entriesRef, (snap) => {
    const entries: ActivityEntry[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<ActivityEntry, "id">)
    }))
    entries.sort((a, b) => (b.date > a.date ? 1 : -1))
    callback(entries)
  })
}

export function subscribeToFamily(familyCode: string, callback: (data: FamilyDoc) => void) {
  const familyRef = doc(db, "families", familyCode)
  return onSnapshot(familyRef, (snap) => {
    if (snap.exists()) callback(snap.data() as FamilyDoc)
  })
}
