const form = document.getElementById("rescueForm");
const statusEl = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(() => {});
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "";
  submitBtn.disabled = true;

  try {
    const fd = new FormData(form);

    const res = await fetch("/api/submit", {
      method: "POST",
      body: fd
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.ok) {
      throw new Error(data.error || `Submit failed (${res.status})`);
    }

    statusEl.textContent = "Submitted. PDF will be emailed shortly.";
    form.reset();
  } catch (err) {
    statusEl.textContent = err.message || "Error submitting form.";
  } finally {
    submitBtn.disabled = false;
  }
});
