import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBYR3R7aS4dElEMNql_UQDk54d45l1UFxw",
  authDomain: "rally-in-the-valley-aa44f.firebaseapp.com",
  projectId: "rally-in-the-valley-aa44f",
  storageBucket: "rally-in-the-valley-aa44f.firebasestorage.app",
  messagingSenderId: "340435479743",
  appId: "1:340435479743:web:fcbbb510777c8d276faa0a"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
