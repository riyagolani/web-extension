import { db } from "./firebase.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "getNotes") {
    try {
      const q = query(collection(db, "notes"), where("url", "==", message.url));
      const querySnapshot = await getDocs(q);
      const notes = [];
      querySnapshot.forEach((doc) => notes.push(doc.data()));
      chrome.tabs.sendMessage(sender.tab.id, { action: "displayNote", notes });
      sendResponse({ success: true });
    } catch (error) {
      console.error("Error fetching notes:", error);
      sendResponse({ success: false, message: "Error fetching notes" });
    }
    return true;
  }
});
