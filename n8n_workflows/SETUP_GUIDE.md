# n8n Workflow Setup Guide — JobSuite AI
Complete step-by-step for all 4 workflows.

## Before you start
1. Open Terminal and run:
   export N8N_SECURE_COOKIE=false && n8n start
2. Open http://localhost:5678 in your browser

---

## WORKFLOW 05 — ATS Checker
**Webhook path:** check-ats

### Node structure (left → right):
Webhook → Code (build prompt) → HTTP Request (Groq) → Code (extract response) → Respond to Webhook

### Step 1 — Webhook node
- HTTP Method: POST
- Path: check-ats
- Response Mode: Using "Respond to Webhook" node

### Step 2 — Code node (Build Prompt)
Paste the entire contents of: workflow_05_ats_checker_code.js

### Step 3 — HTTP Request node
- Method: POST
- URL: https://api.groq.com/openai/v1/chat/completions
- Headers: Add header → Name: Authorization | Value: Bearer YOUR_GROQ_API_KEY
- Body: JSON → Body Content Type = JSON → Body = {{ =$json }}

### Step 4 — Code node (Extract Response)
Paste from EXTRACT_RESPONSE_NODES.md — the WORKFLOW 05 section

### Step 5 — Respond to Webhook
- Respond With: All Incoming Items

### Step 6 — Save & Activate (toggle ON)

---

## WORKFLOW 06 — Cover Letter Generator
**Webhook path:** generate-cover-letter

### Node structure:
Webhook → Code (build prompt) → HTTP Request (Groq) → Code (extract response) → Respond to Webhook

### Step 1 — Webhook node
- Path: generate-cover-letter
- Response Mode: Using "Respond to Webhook" node

### Step 2 — Code node (Build Prompt)
Paste the entire contents of: workflow_06_cover_letter_code.js

### Step 3 — HTTP Request node
- Method: POST
- URL: https://api.groq.com/openai/v1/chat/completions
- Headers: Authorization: Bearer YOUR_GROQ_API_KEY
- Body: JSON → ={{ $json }}

### Step 4 — Code node (Extract Response)
Paste WORKFLOW 06 section from EXTRACT_RESPONSE_NODES.md

### Step 5 — Respond to Webhook
- Respond With: All Incoming Items

### Step 6 — Save & Activate

---

## WORKFLOW 10 — Outreach Email Generator
**Webhook path:** generate-outreach-email

### Node structure:
Webhook → Code (build prompt) → HTTP Request (Groq) → Code (extract response) → Respond to Webhook

### Step 1 — Webhook node
- Path: generate-outreach-email
- Response Mode: Using "Respond to Webhook" node

### Step 2 — Code node (Build Prompt)
Paste the entire contents of: workflow_10_outreach_email_code.js

### Step 3 — HTTP Request node
- Method: POST
- URL: https://api.groq.com/openai/v1/chat/completions
- Headers: Authorization: Bearer YOUR_GROQ_API_KEY
- Body: JSON → ={{ $json }}

### Step 4 — Code node (Extract Response)
Paste WORKFLOW 10 section from EXTRACT_RESPONSE_NODES.md

### Step 5 — Respond to Webhook
- Respond With: All Incoming Items

### Step 6 — Save & Activate

---

## WORKFLOW 14 — Resume Generator (NEW — create from scratch)
**Webhook path:** generate-resume

### Create new workflow
1. Click + New Workflow
2. Name it: Resume Generator (Workflow 14)

### Node structure:
Webhook → Code (build prompt) → HTTP Request (Groq) → Code (extract response) → Respond to Webhook

### Step 1 — Add Webhook node
- Click + → search "Webhook" → add it
- Path: generate-resume
- Response Mode: Using "Respond to Webhook" node

### Step 2 — Add Code node
- Click + after Webhook → search "Code" → add it
- Language: JavaScript
- Paste the entire contents of: workflow_14_resume_generator_code.js

### Step 3 — Add HTTP Request node
- Click + after Code → search "HTTP Request" → add it
- Method: POST
- URL: https://api.groq.com/openai/v1/chat/completions
- Headers tab → Add header:
  Name: Authorization
  Value: Bearer YOUR_GROQ_API_KEY
- Body tab:
  Body Content Type: JSON
  Specify Body: Using Fields Below → Field: body | Value: ={{ $json }}
  (or use JSON mode and put: ={{ $json }})

### Step 4 — Add Code node (Extract Response)
- Click + after HTTP Request → add Code node
- Paste WORKFLOW 14 section from EXTRACT_RESPONSE_NODES.md

### Step 5 — Add Respond to Webhook node
- Click + after Extract Code → search "Respond to Webhook"
- Respond With: All Incoming Items

### Step 6 — Save & Activate

---

## HTTP Request Body — IMPORTANT NOTE
The body field in HTTP Request must use n8n expression syntax:
  ={{ $json }}
NOT: {{ JSON.stringify($json) }}
NOT: $json (without = prefix)

---

## How to update your resume later
Open the workflow → click the first Code node → edit the RESUME constant → Save → the change is live immediately. No need to touch the frontend.

---

## After all 4 workflows are active, test by visiting:
- http://localhost:8080/ats-checker.html
- http://localhost:8080/cover-letter.html
- http://localhost:8080/outreach-email.html
- http://localhost:8080/resume-generator.html
