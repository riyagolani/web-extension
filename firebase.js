// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBoFiRVZcpQ05dMep58LvjXSuPtunD2gA",
  authDomain: "notes-with-ai.firebaseapp.com",
  projectId: "notes-with-ai",
  storageBucket: "notes-with-ai.firebasestorage.app",
  messagingSenderId: "279555883034",
  appId: "1:279555883034:web:8fe731c10f6faaa5af11a3",
  measurementId: "G-FPBSPFRPVP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();