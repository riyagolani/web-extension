import { db, auth } from './firebase.js';
import { collection, addDoc } from 'firebase/firestore';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI('YOUR_GOOGLE_GENERATIVE_AI_API_KEY');

// Note Creation and Positioning
function createNote(summary, x, y) {
  const noteElement = document.createElement('div');
  noteElement.className = 'web-note';
  noteElement.style.position = 'absolute';
  noteElement.style.left = `${x}px`;
  noteElement.style.top = `${y}px`;
  noteElement.innerHTML = `
    <textarea>${summary}</textarea>
    <div class="note-controls">
      <button class="save-note">Save</button>
      <button class="delete-note">Delete</button>
    </div>
  `;

  // Make note draggable
  let isDragging = false;
  let offset = { x: 0, y: 0 };

  noteElement.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);

  function startDrag(e) {
    isDragging = true;
    offset.x = e.clientX - noteElement.offsetLeft;
    offset.y = e.clientY - noteElement.offsetTop;
  }

  function drag(e) {
    if (!isDragging) return;
    noteElement.style.left = `${e.clientX - offset.x}px`;
    noteElement.style.top = `${e.clientY - offset.y}px`;
  }

  function stopDrag() {
    isDragging = false;
  }

  // Save note to Firestore
  noteElement.querySelector('.save-note').addEventListener('click', async () => {
    const summary = noteElement.querySelector('textarea').value;
    try {
      await addDoc(collection(db, 'web-notes'), {
        userId: auth.currentUser.uid,
        url: window.location.href,
        summary: summary,
        x: parseInt(noteElement.style.left),
        y: parseInt(noteElement.style.top)
      });
      alert('Note saved!');
    } catch (error) {
      console.error('Error saving note:', error);
    }
  });

  // Delete note
  noteElement.querySelector('.delete-note').addEventListener('click', () => {
    document.body.removeChild(noteElement);
  });

  document.body.appendChild(noteElement);
}

// Page Summarization
async function summarizePage() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const pageText = document.body.innerText;
  
  try {
    const result = await model.generateContent(`Summarize the following web page content in 3-4 sentences: ${pageText}`);
    const summary = await result.response.text();
    
    // Create note at center of page
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    createNote(summary, x, y);
  } catch (error) {
    console.error('Summarization error:', error);
  }
}

// Add context menu or keyboard shortcut to trigger summarization
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'summarize') {
    summarizePage();
  }
});