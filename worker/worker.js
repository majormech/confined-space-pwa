export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/submit" && request.method === "POST") {
      const form = await request.formData();

      // Basic fields
      const payload = {
        spaceDescription: form.get("spaceDescription") || "",
        date: form.get("date") || "",
        completedBy: form.get("completedBy") || "",
        emailTo: form.get("emailTo") || "",
        comments: form.get("comments") || "",
        checks: {
          prior_1: !!form.get("prior_1"),
          prior_2: !!form.get("prior_2"),
          prior_3: !!form.get("prior_3"),
          prior_4: !!form.get("prior_4"),
          entry_1: !!form.get("entry_1"),
          entry_2: !!form.get("entry_2"),
          entry_3: !!form.get("entry_3"),
          rescue_1: !!form.get("rescue_1")
        }
      };

      // Optional diagram file
      const diagramFile = form.get("diagram");
      const hasDiagram = diagramFile && typeof diagramFile === "object" && diagramFile.size > 0;

      return json({
        ok: true,
        received: payload,
        hasDiagram
      });
    }

    return new Response("Not found", { status: 404 });
  }
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
