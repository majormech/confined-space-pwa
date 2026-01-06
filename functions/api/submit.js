export async function onRequestPost({ request }) {
  const GAS_URL =
    "https://script.google.com/macros/s/AKfycbxc-SIWYvEqWg8KRu6MIvbmyCTIyuXbl7ran4KDILVmrbNr6eHPzQNf0h7iwKSfXcdX/exec";

  try {
    const form = await request.formData();

    const payload = {
      csName: (form.get("csName") || "").toString(),
      csId: (form.get("csId") || "").toString(),
      date: (form.get("date") || "").toString(),
      attendant: (form.get("attendant") || "").toString(),

      rescuePerson1: (form.get("rescuePerson1") || "").toString(),
      rescuePerson2: (form.get("rescuePerson2") || "").toString(),
      rescuePerson3: (form.get("rescuePerson3") || "").toString(),
      rescuePerson4: (form.get("rescuePerson4") || "").toString(),

      spaceDescription: (form.get("spaceDescription") || "").toString(),
      comments: (form.get("comments") || "").toString(),

      completedBy: (form.get("completedBy") || "").toString(),
      emailTo: (form.get("emailTo") || "").toString(),

      comm_attendant_to_rescue: (form.get("commAR") || "").toString(),
      comm_attendant_to_workers: form.getAll("commAW").map(v => v.toString()),

      rescue_method: (form.get("rescueMethod") || "").toString(),
      rescue_internal_desc: (form.get("rescueInternalDesc") || "").toString(),
      rescue_congested_desc: (form.get("rescueCongestedDesc") || "").toString(),

      hauling_required: form.get("haulingRequired") === "on",
      hauling_desc: (form.get("haulingDesc") || "").toString(),

      lowering_required: form.get("loweringRequired") === "on",
      lowering_desc: (form.get("loweringDesc") || "").toString(),

      anchor_overhead: form.getAll("anchorOverhead").map(v => v.toString()),
      anchor_tripod_desc: (form.get("anchorTripodDesc") || "").toString(),

      prerig_required: (form.get("preRig") || "").toString().toLowerCase() === "yes",

      equipment: normalizeEquipment({
        hauling_systems: { on: form.get("eq_hauling_systems") === "on", qty: form.get("eq_hauling_systems_qty") || "" },
        carabiners: { on: form.get("eq_carabiners") === "on", qty: form.get("eq_carabiners_qty") || "" },
        pulleys: { on: form.get("eq_pulleys") === "on", qty: form.get("eq_pulleys_qty") || "" },
        shock: { on: form.get("eq_shock") === "on", qty: form.get("eq_shock_qty") || "" },
        anchor_straps: { on: form.get("eq_anchor_straps") === "on", qty: form.get("eq_anchor_straps_qty") || "" },
        webbing: { on: form.get("eq_webbing") === "on", qty: form.get("eq_webbing_qty") || "" },
        ascenders: { on: form.get("eq_ascenders") === "on", qty: form.get("eq_ascenders_qty") || "" },
        body_harnesses: { on: form.get("eq_body_harnesses") === "on", qty: form.get("eq_body_harnesses_qty") || "" },
        rigging_plates: { on: form.get("eq_rigging_plates") === "on", qty: form.get("eq_rigging_plates_qty") || "" },
        safety_lines: { on: form.get("eq_safety_lines") === "on", qty: form.get("eq_safety_lines_qty") || "" },
        main_lines: { on: form.get("eq_main_lines") === "on", qty: form.get("eq_main_lines_qty") || "" },
        wrist_ankle: { on: form.get("eq_wrist_ankle") === "on", qty: form.get("eq_wrist_ankle_qty") || "" },
        fire_ext: { on: form.get("eq_fire_ext") === "on", qty: form.get("eq_fire_ext_qty") || "" },
        other: (form.get("eq_other") || "").toString()
      }),

      medical: {
        first_aid: form.get("med_first_aid") === "on",
        packaging: form.get("med_packaging") === "on",
        packaging_desc: (form.get("med_packaging_desc") || "").toString(),
        other: form.get("med_other") === "on",
        other_desc: (form.get("med_other_desc") || "").toString()
      },

      ppe: form.getAll("ppe").map(v => v.toString()),
      ppe_other_desc: (form.get("ppe_other_desc") || "").toString()
    };

    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "access-control-allow-origin": "*"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err?.message || err) }), {
      status: 500,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "access-control-allow-origin": "*"
      }
    });
  }
}

function normalizeEquipment(eq) {
  const out = {};
  for (const [k, v] of Object.entries(eq || {})) {
    if (k === "other") { out.other = v; continue; }
    if (v && v.on) out[k] = { qty: v.qty ?? "" };
  }
  if (eq?.other) out.other = eq.other;
  return out;
}
