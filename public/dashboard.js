import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Firebase configuration
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
const db = getFirestore(app);
const auth = getAuth(app);

/// Handle login
document.getElementById('login-btn').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    alert(`Welcome back, ${userCredential.user.email}`);
    loadNotes(userCredential.user.uid); // Load notes after login
  } catch (error) {
    alert(error.message);
  }
});

// Handle signup
document.getElementById('signup-btn').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    alert(`Account created, welcome ${userCredential.user.email}`);
    loadNotes(userCredential.user.uid); // Load notes after signup
  } catch (error) {
    alert(error.message);
  }
});

// Handle logout
document.getElementById('logout-btn').addEventListener('click', async () => {
  try {
    await signOut(auth);
    alert('You have logged out');
  } catch (error) {
    alert(error.message);
  }
});

// Load notes for the logged-in user
async function loadNotes(uid) {
  const q = query(collection(db, "notes"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  const notesContainer = document.getElementById("notesContainer");
  notesContainer.innerHTML = ''; // Clear existing notes

  querySnapshot.forEach((doc) => {
    const noteData = doc.data();
    const noteDiv = document.createElement("div");
    noteDiv.textContent = noteData.note;
    notesContainer.appendChild(noteDiv);
  });
}

// Save new note
async function saveNote() {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to save notes.");
    return;
  }

  const note = prompt("Enter your note");
  try {
    await addDoc(collection(db, "notes"), {
      uid: user.uid,
      note: note,
      timestamp: new Date()
    });
    loadNotes(user.uid); // Reload notes after saving
  } catch (error) {
    alert(error.message);
  }
}