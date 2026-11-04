# Extract Response Code — one per workflow

Each workflow needs a small Code node AFTER the HTTP Request node
that pulls the text out of Groq's response.

─────────────────────────────────────────────
WORKFLOW 05 — ATS Checker  (extract_response)
─────────────────────────────────────────────
const raw = $input.first().json;
const text = raw?.choices?.[0]?.message?.content || '';
// Strip markdown code fences if Groq wraps JSON in ```
const clean = text.replace(/```json\s*/gi,'').replace(/```/g,'').trim();
let parsed;
try { parsed = JSON.parse(clean); }
catch(e) { parsed = { score:0, matched_keywords:[], missing_keywords:[], suggestions:['Could not parse AI response'] }; }
return [{ json: parsed }];

─────────────────────────────────────────────
WORKFLOW 06 — Cover Letter  (extract_response)
─────────────────────────────────────────────
const raw = $input.first().json;
const text = raw?.choices?.[0]?.message?.content || '';
return [{ json: { cover_letter: text } }];

─────────────────────────────────────────────
WORKFLOW 10 — Outreach Email  (extract_response)
─────────────────────────────────────────────
const raw = $input.first().json;
const text = raw?.choices?.[0]?.message?.content || '';
return [{ json: { email: text } }];

─────────────────────────────────────────────
WORKFLOW 14 — Resume Generator  (extract_response)
─────────────────────────────────────────────
const raw = $input.first().json;
const text = raw?.choices?.[0]?.message?.content || '';
return [{ json: { resume: text } }];
