import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA54v_TLKTKP_jf-K-v2bDFBIjmRQDinqE",
    authDomain: "memoire-ia-88600.firebaseapp.com",
    projectId: "memoire-ia-88600",
    storageBucket: "memoire-ia-88600.firebasestorage.app",
    messagingSenderId: "624532746053",
    appId: "1:624532746053:web:8aef323b542aa71d70182c"
};

// Initialize Firebase (singleton pattern to avoid reloading errors in Next.js hot reload)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
