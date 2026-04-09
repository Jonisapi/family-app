import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyD1NTUKoicVABBZ9Y9UuIkWdep2wuIi5sQ",
  authDomain: "sapir-suger-app.firebaseapp.com",
  projectId: "sapir-suger-app",
  storageBucket: "sapir-suger-app.firebasestorage.app",
  messagingSenderId: "283495462181",
  appId: "1:283495462181:web:5716b71af4bdc61a4dd6cc"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
