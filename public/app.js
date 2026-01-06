const $ = (id) => document.getElementById(id);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(()=>{});
}

const form = $("rescueForm");
const statusEl = $("status");
const btn = $("submitBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "";
  btn.disabled = true;

  try {
    const fd = new FormData(form);

    const res = await fetch("/api/submit", {
      method: "POST",
      body: fd
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.error || `Submit failed (${res.status})`);
    }

    statusEl.textContent = "Submitted. Check your email in a minute.";
    form.reset();
  } catch (err) {
    statusEl.textContent = err.message || "Error submitting form.";
  } finally {
    btn.disabled = false;
  }
});
