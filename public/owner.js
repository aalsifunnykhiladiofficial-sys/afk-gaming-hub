// Configure this with your deployed Cloudflare Worker URL before deployment.
const API_BASE = ""; // Example: https://afk-gaming-hub-api.YOUR-SUBDOMAIN.workers.dev
const statusBox = document.getElementById("owner-status");

document.getElementById("login-button").addEventListener("click", () => {
  if (!API_BASE) {
    statusBox.textContent = "Setup required: deploy the API and configure Google OAuth before owner login can work.";
    return;
  }
  window.location.href = `${API_BASE}/auth/google/start`;
});

document.getElementById("refresh-button").addEventListener("click", async () => {
  if (!API_BASE) {
    statusBox.textContent = "Demo mode: earnings are not connected yet. No real amounts are being displayed.";
    return;
  }
  try {
    const response = await fetch(`${API_BASE}/api/owner/earnings`, { credentials: "include" });
    if (!response.ok) throw new Error("Owner authorization or provider setup is not ready.");
    const data = await response.json();
    statusBox.textContent = data.message || "Connected. Provider totals are not configured.";
    // Do not render arbitrary provider data here until the API response schema is implemented and reviewed.
  } catch (error) {
    statusBox.textContent = error.message || "Could not load owner data.";
  }
});

document.getElementById("logout-button").addEventListener("click", async () => {
  if (API_BASE) {
    try { await fetch(`${API_BASE}/auth/logout`, { method: "POST", credentials: "include" }); } catch {}
  }
  statusBox.textContent = "Signed out locally. Server-side session revocation must be implemented before launch.";
});
