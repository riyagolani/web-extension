import { auth, db } from './firebase.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const authContainer = document.getElementById('auth-container');
const dashboardContainer = document.getElementById('dashboard');
const notesBySiteContainer = document.getElementById('notes-by-site');

// Login
loginBtn.addEventListener('click', async () => {
  try {
    await signInWithEmailAndPassword(
      auth, 
      emailInput.value, 
      passwordInput.value
    );
    showDashboard();
  } catch (error) {
    alert(error.message);
  }
});

// Signup
signupBtn.addEventListener('click', async () => {
  try {
    await createUserWithEmailAndPassword(
      auth, 
      emailInput.value, 
      passwordInput.value
    );
    showDashboard();
  } catch (error) {
    alert(error.message);
  }
});

// Logout
logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
  showLoginForm();
});

// Fetch and display notes
async function fetchNotesBySite() {
  const user = auth.currentUser;
  const notesRef = collection(db, 'web-notes');
  const q = query(notesRef, where('userId', '==', user.uid));
  
  const querySnapshot = await getDocs(q);
  const notesBySite = {};

  querySnapshot.forEach((doc) => {
    const note = { id: doc.id, ...doc.data() };
    if (!notesBySite[note.url]) {
      notesBySite[note.url] = [];
    }
    notesBySite[note.url].push(note);
  });

  renderNotesBySite(notesBySite);
}

function renderNotesBySite(notesBySite) {
  notesBySiteContainer.innerHTML = '';
  Object.entries(notesBySite).forEach(([url, notes]) => {
    const siteSection = document.createElement('div');
    siteSection.innerHTML = `
      <h3>${url}</h3>
      ${notes.map(note => `
        <div class="note">
          ${note.summary}
          <button class="delete-note" data-id="${note.id}">Delete</button>
        </div>
      `).join('')}
    `;
    notesBySiteContainer.appendChild(siteSection);
  });

  // Add delete note functionality
  document.querySelectorAll('.delete-note').forEach(button => {
    button.addEventListener('click', async (e) => {
      const noteId = e.target.dataset.id;
      await deleteDoc(doc(db, 'web-notes', noteId));
      fetchNotesBySite();
    });
  });
}

function showLoginForm() {
  authContainer.style.display = 'block';
  dashboardContainer.style.display = 'none';
}

function showDashboard() {
  authContainer.style.display = 'none';
  dashboardContainer.style.display = 'block';
  fetchNotesBySite();
}

// Authentication state observer
auth.onAuthStateChanged((user) => {
  if (user) {
    showDashboard();
  } else {
    showLoginForm();
  }
});