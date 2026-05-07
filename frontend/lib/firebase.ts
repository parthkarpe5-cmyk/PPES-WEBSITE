import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Debug logging for environment variables (only in development)
if (process.env.NODE_ENV === "development") {
  const missingVars = Object.entries(firebaseConfig)
    .filter(([_, value]) => !value)
    .map(([key]) => `NEXT_PUBLIC_FIREBASE_${key.replace(/[A-Z]/g, letter => `_${letter.toUpperCase()}`).toUpperCase()}`)

  if (missingVars.length > 0) {
    console.warn("⚠️ Firebase configuration is missing environment variables:", missingVars)
    console.warn("Please check your .env.local file in the frontend directory.")
  } else {
    console.log("✅ Firebase environment variables loaded successfully.")
  }
}

// Prevent duplicate Firebase app initialization in Next.js hot-reloads
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()

export const db = getFirestore(app)
