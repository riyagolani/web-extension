import { auth, db } from './firebase-config.js';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const quickNoteTextarea = document.getElementById('quick-note');
const saveQuickNoteBtn = document.getElementById('save-quick-note');
const summarizePageBtn = document.getElementById('summarize-page');
const openDashboardBtn = document.getElementById('open-dashboard');

// Save Quick Note
saveQuickNoteBtn.addEventListener('click', async () => {
    try {
        // Ensure user is logged in
        const user = auth.currentUser;
        if (!user) {
            alert('Please log in first');
            return;
        }

        // Get current active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Save note to Firestore
        await addDoc(collection(db, 'web-notes'), {
            userId: user.uid,
            url: tab.url,
            summary: quickNoteTextarea.value,
            createdAt: new Date(),
            x: 100,  // Default positioning
            y: 100
        });

        // Clear textarea and show success
        quickNoteTextarea.value = '';
        alert('Note saved successfully!');
    } catch (error) {
        console.error('Error saving quick note:', error);
        alert('Failed to save note');
    }
});

// Trigger Page Summarization
summarizePageBtn.addEventListener('click', async () => {
    try {
        // Ensure user is logged in
        const user = auth.currentUser;
        if (!user) {
            alert('Please log in first');
            return;
        }

        // Send message to content script to summarize page
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.tabs.sendMessage(tab.id, { action: 'summarize' });

        window.close(); // Close popup after triggering
    } catch (error) {
        console.error('Summarization error:', error);
        alert('Failed to summarize page');
    }
});

// Open Dashboard
openDashboardBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'dashboard.html' });
});

// Authentication State Observer
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Redirect to login if not authenticated
        chrome.tabs.create({ url: 'dashboard.html' });
        window.close();
    }
});

// Optional: Auto-login for development/testing
// Uncomment and add test credentials if needed
// signInWithEmailAndPassword(auth, 'test@example.com', 'password')
//     .catch((error) => {
//         console.error('Auto-login failed:', error);
//     });