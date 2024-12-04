import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCBoFiRVZcpQ05dMep58LvjXSuPtunD2gA",
  authDomain: "notes-with-ai.firebaseapp.com",
  projectId: "notes-with-ai",
  storageBucket: "notes-with-ai.firebasestorage.app",
  messagingSenderId: "279555883034",
  appId: "1:279555883034:web:8fe731c10f6faaa5af11a3",
  measurementId: "G-FPBSPFRPVP"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);