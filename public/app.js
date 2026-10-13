const API_BASE = ""; // Set this to your deployed Worker URL, e.g. https://afk-api.yourname.workers.dev
document.getElementById("year").textContent = new Date().getFullYear();

const statusNote = document.getElementById("status-note");
document.querySelectorAll("[data-demo]").forEach(button => {
  button.addEventListener("click", async () => {
    if (!API_BASE) {
      statusNote.textContent = "Demo mode: API is not connected. Deploy and configure the secure backend before enabling downloads.";
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/api/files`);
      if (!response.ok) throw new Error("API not ready");
      const data = await response.json();
      statusNote.textContent = `API connected. ${Array.isArray(data.files) ? data.files.length : 0} file(s) returned.`;
    } catch {
      statusNote.textContent = "Could not connect to the API. Check your deployment and configuration.";
    }
  });
});

document.getElementById("upload-form").addEventListener("submit", event => {
  event.preventDefault();
  document.getElementById("upload-note").textContent =
    "Preview only: no file was uploaded. Admin authentication and private storage must be implemented in the backend first.";
});
