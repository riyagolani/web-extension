document.addEventListener("DOMContentLoaded", async () => {
  // Dynamically import Firebase
  const { auth } = await import("../firebase.js");
  const {
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
  } = await import("https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js");

  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const saveNoteBtn = document.getElementById("saveNote");

  loginBtn.addEventListener("click", async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      alert(`Welcome, ${result.user.displayName}!`);
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed!");
    }
  });

  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
    } catch (error) {
      console.error("Logout failed", error);
      alert("Logout failed!");
    }
  });

  saveNoteBtn.addEventListener("click", async () => {
    const noteText = document.getElementById("note-input").value;
    if (!noteText) {
      alert("Please write a note!");
      return;
    }
    chrome.runtime.sendMessage({ action: "saveNote", note: noteText }, (response) => {
      if (response.success) {
        alert("Note saved successfully!");
      } else {
        alert("Failed to save note!");
      }
    });
  });
});
