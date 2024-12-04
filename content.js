function createStickyNote(text, position = { top: "50px", left: "50px" }) {
  const stickyNote = document.createElement("div");
  stickyNote.className = "sticky-note";
  stickyNote.textContent = text;

  stickyNote.style.position = "absolute";
  stickyNote.style.top = position.top;
  stickyNote.style.left = position.left;
  stickyNote.style.minWidth = "150px";
  stickyNote.style.minHeight = "100px";
  stickyNote.style.backgroundColor = "#fffa65";
  stickyNote.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.1)";
  stickyNote.style.border = "1px solid #ccc";
  stickyNote.style.padding = "10px";
  stickyNote.style.cursor = "move";
  stickyNote.style.resize = "both";
  stickyNote.style.overflow = "hidden";
  stickyNote.style.zIndex = 1000;

  document.body.appendChild(stickyNote);
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "displayNote") {
    message.notes.forEach((note) => {
      createStickyNote(note.note);
    });
  }
});
