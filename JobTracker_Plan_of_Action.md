# Job Application Automation Suite — Complete Plan of Action
> Developer: Litheesh V R | MacBook M4 Air (16GB, 512GB) | 100% Free
> AI: Groq API (free) + Ollama local on M4 Air | No Linux machine required

---

## Overview

This tool is a self-hosted job application management system running entirely on your MacBook M4 Air. It uses free cloud AI APIs (Groq, Google Gemini) for high-quality responses and runs Ollama locally on the M4's built-in GPU for offline use. No Linux machine, no paid GPU, no subscriptions.

---

## Final Tech Stack (All Free)

| Component | Tool | Purpose |
|---|---|---|
| Frontend | HTML + CSS + JavaScript | The UI you see in the browser |
| CSS Framework | Tailwind CSS (CDN) | Styling, no installation needed |
| Workflow Engine | n8n (self-hosted on Mac) | Automation and API logic |
| Database | Supabase (free cloud) | Stores all job/resume/cover letter data — PostgreSQL online |
| AI — Primary | Groq API (free tier) | Llama 3.3 70B — fast, free, best quality |
| AI — Writing | Google Gemini API (free tier) | Gemini 1.5 Flash — best for cover letters |
| AI — Offline | Ollama + Qwen2.5 14B (on M4 Air) | Works without internet, uses M4 Metal GPU |
| Excel Export | SheetJS (CDN) | Read/write .xlsx files in the browser |
| PDF Reading | PDF.js (CDN) | Parse uploaded PDF resumes |
| LaTeX Compiler | Tectonic (via Homebrew) | Compiles .tex resume files to PDF locally |
| Code Editor | Monaco Editor (CDN) | In-browser LaTeX editor (same engine as VS Code) |
| Runtime | Node.js v20 | Required to run n8n |
| Email | Gmail SMTP (App Password) | Send notifications and outreach — 500 emails/day free |
| Job APIs | RemoteOK, Arbeitnow, Adzuna, The Muse, Remotive | Auto-fetch live job listings |
| Job Scraping | Browser Bookmarklet (custom) | One-click save from Handshake, Jobright, LinkedIn |

**AI Free Tier Limits:**
- Groq: 14,400 requests/day on Llama 3.3 70B — more than enough for daily job searching
- Gemini: 1,500 requests/day on Gemini 1.5 Flash — plenty for cover letters
- Ollama local: Unlimited — runs on your M4 Air's 10-core GPU with no internet needed

---

## Architecture Diagram

```
 Job Sites (Internet)           Browser Bookmarklet
 RemoteOK, Arbeitnow,    <───── (Handshake, Jobright,
 Adzuna, The Muse,               LinkedIn, any site)
 Remotive                               |
        |                              |
        └──────────────┬───────────────┘
                       ▼
┌──────────────────────────────────────────────────────┐
│              YOUR BROWSER (Frontend)                  │
│   HTML + CSS + JavaScript + Tailwind CSS             │
│   open index.html in browser                         │
└──────────────────┬───────────────────────────────────┘
                   │  fetch() API calls (HTTP)
                   ▼
┌──────────────────────────────────────────────────────┐
│           n8n WORKFLOW ENGINE                         │
│           localhost:5678                             │
│   Receives requests → processes → calls DB & AI      │
│   Runs scheduled jobs (fetch APIs every 6h)          │
└────────┬─────────────────────┬────────────────────────┘
         │                     │
         ▼                     ▼
┌────────────────┐   ┌──────────────────────────────────┐
│   Supabase     │   │        AI ROUTING LAYER          │
│ supabase.com   │   │                                  │
│ (PostgreSQL +  │   │  1. Groq API (primary, free)     │
│  Dashboard UI) │   │     api.groq.com                 │
└────────────────┘   │     Llama 3.3 70B                │
         │           │                                  │
         ▼           │  2. Google Gemini (writing)      │
┌────────────────┐   │     generativelanguage.googleapis│
│ Local Files    │   │     Gemini 1.5 Flash             │
│ jobs.xlsx      │   │                                  │
│ (Excel export) │   │  3. Ollama local (offline backup) │
└────────────────┘   │     localhost:11434              │
                     │     Qwen2.5 14B on M4 Metal GPU  │
                     └──────────────────────────────────┘
```

---

## AI Strategy — Which Model Does What

| Task | AI Used | Why |
|---|---|---|
| ATS Score Check | Groq — Llama 3.3 70B | Best keyword analysis, fast |
| Resume Matching | Groq — Llama 3.3 70B | Best rewrite quality |
| Pros/Cons Report | Groq — Llama 3.3 70B | Detailed analysis |
| Cover Letter | Google Gemini 1.5 Flash | Best natural writing style |
| Outreach Email Draft | Google Gemini 1.5 Flash | Best professional tone, personalised writing |
| Offline fallback | Ollama — Qwen2.5 14B | No internet needed |

n8n automatically switches to local Ollama if Groq/Gemini are unreachable.

---

## Features (Detailed Breakdown)

### Feature 1 — Job Tracker Dashboard (Main Page)
**What it does:** Central hub to manage all your job applications.

- Add a new job (manually fill: Title, Company, URL, Location, Salary, Deadline, Notes)
- Visual Kanban board with 5 columns: Saved → Applied → Interview → Offer → Rejected
- Drag cards between columns to update status
- Click any card to see full details
- Search and filter jobs by company, status, or date
- Statistics bar: Total Applied, Interviews Landed, Offers, Rejection Rate
- Export all jobs to a formatted Excel (.xlsx) file with one click
- Delete a job entry

**Database:** Supabase `jobs` table — n8n calls Supabase REST API to read/write records.

**n8n workflows involved:** add-job, update-status, get-jobs, export-excel

---

### Feature 2 — ATS Score Checker
**What it does:** Analyzes how well your resume matches a job description using AI.

- Paste (or upload) your resume text
- Paste the job description
- Click "Check Score" → Groq AI (Llama 3.3 70B) processes both
- Returns:
  - Overall ATS Score (0–100) with a visual progress bar
  - Matched Keywords (shown in green)
  - Missing Keywords (shown in red)
  - Section-by-section analysis (Skills, Experience, Education)
  - Specific improvement suggestions
- Option to save the result linked to a job entry

**n8n workflows involved:** ats-check

---

### Feature 3 — Resume Matcher, Pros/Cons Report & LaTeX Editor
**What it does:** For every job you search or apply to, AI generates a detailed pros and cons report showing exactly where your resume is strong and where it falls short — then lets you fix it right there in a professional LaTeX editor and download a polished PDF instantly.

---

#### Section A — Pros & Cons Report (Per Job)

Every time you run a resume match against a job description, the page displays a structured report:

**PROS (What's Working)**
- Skills you have that the job explicitly asks for
- Experience that directly aligns with the role's requirements
- Keywords present in both your resume and the job description
- Certifications or education that match requirements
- Quantified achievements relevant to the role

**CONS (What's Missing)**
- Required skills not mentioned anywhere in your resume
- Preferred qualifications you lack
- Keywords the ATS system will search for but won't find
- Sections that are weak for this specific role
- Experience gaps compared to what the job expects

**SUGGESTIONS (AI Recommendations)**
- Specific bullet points to rewrite (shows old → new version)
- Keywords to add and where to add them
- Sections to strengthen for this particular role
- Formatting tips to make the resume ATS-friendly

Report is saved to PocketBase linked to both the job and your resume version — so you can compare reports across multiple jobs over time.

---

#### Section B — LaTeX Resume Editor (In-Browser)

The resume editing happens inside a professional LaTeX editor built directly into the page.

**Editor layout (3-panel view):**

```
┌─────────────────┬──────────────────┬─────────────────┐
│   PROS / CONS   │   LaTeX Editor   │   PDF Preview   │
│     Report      │  (Monaco Editor) │  (Live render)  │
│                 │                  │                 │
│  Pros list      │  \begin{resume}  │  [Your resume   │
│  Cons list      │  \name{Litheesh} │   rendered as   │
│  Suggestions    │  \section{...}   │   a real PDF]   │
│                 │  ...             │                 │
│  [Apply AI Fix] │  [Compile PDF]   │  [Download PDF] │
└─────────────────┴──────────────────┴─────────────────┘
```

**Editor features:**
- Monaco Editor with full LaTeX syntax highlighting and autocomplete
- AI "Apply Fix" button — one click rewrites the relevant LaTeX section
- "Compile PDF" button — sends LaTeX to n8n → compiled by Tectonic on Mac → PDF returns to browser
- Live PDF preview in the right panel after each compile
- Version history — every compile is saved so you can go back
- "Download PDF" — instantly downloads the final compiled resume
- 3 clean LaTeX templates to choose from (Professional, Modern, Academic)

Starter LaTeX template provided — you do not need to know LaTeX to start. The AI fills in your details.

---

#### Section C — Resume Version Control

Each time you edit and compile your resume for a specific job, a new version is saved:

| Version | Job | ATS Score Before | ATS Score After | Date |
|---|---|---|---|---|
| v1 (original) | — | — | — | Jan 1 |
| v2 (Google SWE) | Google Software Engineer | 52 | 78 | Jan 5 |
| v3 (Meta DS) | Meta Data Scientist | 61 | 84 | Jan 8 |

You can load any previous version back into the editor at any time.

**n8n workflows involved:** match-resume, compile-latex (Workflow 18), save-resume-version (Workflow 19)

---

### Feature 4 — Cover Letter Generator
**What it does:** Google Gemini AI writes a tailored cover letter for each job application.

- Auto-fills company name and job title if job is already saved in tracker
- Or manually input job details
- Choose a tone: Formal / Conversational / Enthusiastic
- Click "Generate" → Gemini 1.5 Flash writes a full cover letter
- Edit the letter inline
- Regenerate if you don't like the result
- Copy to clipboard or download as .txt
- Save the cover letter linked to the job entry in PocketBase

**n8n workflows involved:** cover-letter

---

### Feature 5 — Workday Job Page Viewer
**What it does:** Shows the company's Workday job listing inside the app.

- Paste the Workday job URL
- Panel opens on the right side showing the job content
- n8n fetches the page HTML and displays the text cleanly inside the app
- "Open in new tab" button for the real page
- Auto-extract: job title, company, requirements section

**n8n workflows involved:** fetch-job-page

---

### Feature 6 — Job Site Integrations (Modular System)
**What it does:** Automatically pulls live job listings from multiple job sites into your tracker.

#### Tier 1 — Free APIs (Auto-fetch)

**RemoteOK** — No registration needed. Remote tech jobs. Fetches every 6 hours.

**Arbeitnow** — No registration needed. EU and global jobs, visa sponsorship filter.

**Adzuna** — Free with one-time registration (no credit card). Largest aggregator — 100+ job boards in one call. 250 API calls/day free.

**The Muse** — Free with registration. Job details + company culture info. 3,600 requests/hour free.

**Remotive** — Free with email registration. Specialized in remote tech jobs.

---

#### Tier 2 — Handshake & Jobright (Browser Bookmarklet)

Handshake and Jobright have no public APIs and prohibit scraping. Instead we use a Browser Bookmarklet — a tiny JavaScript snippet saved as a browser bookmark. When you find a job on Handshake or Jobright, you click the bookmark and the job is instantly saved to your tracker. One click, done. 100% legal — you are logged in and manually triggering the save yourself.

The bookmarklet works on any job site: Handshake, Jobright, LinkedIn, Indeed, Glassdoor, anywhere.

---

#### Tier 3 — Future Sites (Plug-in Ready)

Add any new job site by adding one n8n workflow. Pre-planned: ZipRecruiter, USAJobs.gov, GitHub Jobs, AngelList/Wellfound.

---

#### Job Site Settings Page

Toggle each source ON/OFF, set keyword filters, set location filters, control fetch frequency, see last fetch time and new job count, view API status.

---

### Feature 7 — Gmail Notifications
**What it does:** Automatically sends email alerts for important job application events.

| Trigger | Email Sent |
|---|---|
| New job added | "You saved a new job: [Title] at [Company]" |
| Status → Applied | "Application submitted to [Company]" |
| Status → Interview | "Interview scheduled at [Company]!" |
| Status → Offer | "Offer received from [Company]!" |
| Status → Rejected | "Application update from [Company]" |
| ATS score below 50 | "Low ATS score for [Company] — Resume needs work" |
| Deadline within 2 days | "Deadline Alert: [Company] application due in 2 days!" |
| Daily 8 AM summary | All active applications, upcoming deadlines, ATS average |
| Cover letter generated | "Cover letter ready for [Company]" |

**Setup:** Google Account → Security → App Passwords → Generate password for Mail → Add to n8n. One time, 5 minutes, completely free.

**n8n workflows involved:** send-notification (sub-workflow), deadline-reminder (scheduled)

---

### Feature 8 — Database Viewer (Built-in)
**What it does:** Visual table to see and manage all stored data.

PocketBase automatically gives you an admin panel at `localhost:8090/_/` — filter, sort, search, export, edit, or delete any record. No extra development needed.

---

### Feature 9 — Hiring Contact Finder & Outreach Email Drafter
**What it does:** For any job you have saved, this feature finds the email address of the hiring manager or recruiter at that company, then uses AI to draft a professional, personalised outreach email that you can review, edit, save, and optionally send directly from the app.

---

#### Section A — Contact Email Finder

When you open a job and click "Find Hiring Contact", the system:

1. Extracts the company domain from the job URL (e.g. `google.com` from a Google careers link)
2. Queries **Hunter.io free API** (25 searches/month free) to look up known email addresses at that domain
3. As a fallback, generates likely email patterns using the hiring manager's name if you know it:
   - `firstname@company.com`
   - `firstname.lastname@company.com`
   - `f.lastname@company.com`
   - `firstnamelastname@company.com`
4. Shows all found or guessed contacts in a list with their name, title, and email
5. Lets you pick the best contact or enter one manually
6. Saves the contact to PocketBase linked to the job

**Free email finder APIs used (no payment):**

| Service | Free Limit | What it finds |
|---|---|---|
| Hunter.io | 25 domain searches/month | Real emails from company domain |
| Apollo.io | 50 contact exports/month | Name + title + email |
| Email pattern generator | Unlimited (AI-based) | Likely pattern guesses |

You can register for Hunter.io and Apollo.io free tiers using your buffalo.edu email.

---

#### Section B — Outreach Email Drafter

Once a contact is selected, click "Draft Outreach Email":

1. Gemini 1.5 Flash receives: your name, your background (from your resume), the job title, the company, and the contact's name and title
2. AI drafts a short, professional cold-outreach email — 3–4 paragraphs, no fluff
3. The email follows best practices:
   - Subject line that gets opened
   - Opens with a genuine compliment or connection to the company
   - One clear paragraph on your relevant experience
   - Specific ask (brief call or referral for the open role)
   - Professional sign-off with your contact details
4. You can choose the tone: **Formal** / **Conversational** / **Confident**
5. Edit the draft inline before saving
6. Click **Save Draft** — saved to PocketBase linked to the job and contact
7. Optionally click **Send via Gmail** — sends directly through your connected Gmail SMTP

**Example email skeleton AI follows:**

```
Subject: [Your Name] — Interest in [Job Title] at [Company]

Dear [Contact Name],

I came across the [Job Title] position at [Company] and was particularly drawn
to [specific thing about the company/role].

I am currently [one sentence background], and have experience in [1–2 key
skills relevant to the job]. Most recently I [brief achievement].

I would love to briefly connect to learn more about the team. Would you have
15 minutes for a quick call, or could you point me to the right person for the
[Job Title] role?

Thank you for your time.

Best regards,
Litheesh V R
litheesh@buffalo.edu
```

---

#### Section C — Outreach Tracking

Every saved draft is tracked in the dashboard:

| Contact | Company | Job | Email Status | Last Updated |
|---|---|---|---|---|
| Jane Smith | Google | SWE | Draft saved | Apr 24 |
| Tom Rao | Meta | DS | Sent | Apr 22 |
| — | Apple | iOS | No contact found | Apr 20 |

Status values: **No Contact** → **Contact Found** → **Draft Saved** → **Sent** → **Replied** / **No Response**

---

#### Section D — Page Layout (outreach.html)

```
┌──────────────────────────────────────────────────────────────┐
│  Hiring Contact Finder & Outreach Email                       │
│                                                              │
│  Job: [Software Engineer at Google ▼]                        │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  CONTACT FINDER                    [Find Contacts]  │    │
│  │                                                     │    │
│  │  Domain: google.com                                 │    │
│  │  ○ Jane Smith — Recruiter — jsmith@google.com      │    │
│  │  ○ Tom Lee   — Hiring Manager — tlee@google.com    │    │
│  │  ○ Enter manually: [_________________]             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  EMAIL DRAFTER          Tone: [Formal ▼]            │    │
│  │                        [Generate Outreach Email]    │    │
│  │                                                     │    │
│  │  Subject: Litheesh V R — Interest in SWE at Google  │    │
│  │                                                     │    │
│  │  Dear Jane,                                         │    │
│  │                                                     │    │
│  │  I came across the Software Engineer position at    │    │
│  │  Google and was drawn to...                         │    │
│  │  [editable text area]                               │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  [Save Draft]   [Send via Gmail]   [Regenerate]             │
│                                                              │
│  ── Past Outreach ──────────────────────────────────────    │
│  Google / Jane Smith — Draft saved — Apr 24                 │
│  Meta / Tom Rao — Sent — Apr 22                             │
└──────────────────────────────────────────────────────────────┘
```

**n8n workflows involved:** find-contacts (WF 20), generate-outreach (WF 21), save-outreach (WF 22), send-outreach (WF 23)

---

## Complete Folder Structure

```
~/Downloads/Job_Application_Project/
│
├── docs/
│   ├── JobTracker_Plan_of_Action.md
│   └── Phase1_Installation_Guide.md
│
├── frontend/
│   ├── index.html               <- Job Tracker Dashboard
│   ├── ats.html                 <- ATS Score Checker
│   ├── resume.html              <- Resume Matcher & LaTeX Editor
│   ├── cover-letter.html        <- Cover Letter Generator
│   ├── workday.html             <- Workday Viewer
│   ├── job-sources.html         <- Job Site Settings
│   ├── outreach.html            <- Hiring Contact Finder & Outreach Email
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── api.js               <- All fetch() calls to n8n (shared)
│       ├── dashboard.js
│       ├── ats.js
│       ├── resume.js
│       ├── cover-letter.js
│       ├── workday.js
│       ├── job-sources.js
│       └── outreach.js          <- Contact finder + email drafter logic
│
├── n8n-workflows/
│   ├── 01_add-job.json
│   ├── 02_update-status.json
│   ├── 03_get-jobs.json
│   ├── 04_export-excel.json
│   ├── 05_ats-check.json            <- Uses Groq API (Llama 3.3 70B)
│   ├── 06_match-resume.json         <- Uses Groq API (Llama 3.3 70B)
│   ├── 07_cover-letter.json         <- Uses Gemini API (Flash 1.5)
│   ├── 08_fetch-job-page.json
│   ├── 09_send-notification.json    <- Gmail sub-workflow
│   ├── 10_deadline-reminder.json    <- Scheduled daily 8 AM
│   ├── 11_fetch-remoteok.json
│   ├── 12_fetch-arbeitnow.json
│   ├── 13_fetch-adzuna.json
│   ├── 14_fetch-themuse.json
│   ├── 15_fetch-remotive.json
│   ├── 16_bookmarklet-save.json
│   ├── 17_deduplicate-jobs.json
│   ├── 18_compile-latex.json        <- Tectonic on Mac compiles PDF
│   ├── 19_save-resume-version.json
│   ├── 20_find-contacts.json        <- Hunter.io + Apollo free API + pattern generator
│   ├── 21_generate-outreach.json    <- Gemini AI drafts personalised outreach email
│   ├── 22_save-outreach.json        <- Saves draft to PocketBase
│   └── 23_send-outreach.json        <- Sends email via Gmail SMTP
│
├── pocketbase/                  <- Can be deleted (replaced by Supabase)
│
├── latex-templates/             <- Starter .tex resume templates
├── compiled-resumes/            <- Output PDFs
├── data/
│   └── jobs.xlsx
├── scripts/
│   ├── setup.sh
│   ├── start.sh
│   ├── stop.sh
│   └── check-status.sh
├── .env                         <- API keys and config
└── .gitignore
```

---

## Supabase Database Schema

All tables live in your Supabase project. Create them by running `scripts/setup-supabase.sql` in the Supabase SQL Editor (one click — see Phase 2 steps).

### Table 1: `jobs`
| Field | Type | Notes |
|---|---|---|
| id | auto | Unique ID |
| title | Text | Job title |
| company | Text | Company name |
| url | URL | Job posting link |
| location | Text | City / Remote / Hybrid |
| salary | Text | Salary range |
| status | Select | saved / applied / interview / offer / rejected |
| date_applied | Date | When you applied |
| deadline | Date | Application deadline |
| job_description | Text (long) | Full JD text |
| notes | Text (long) | Your personal notes |
| ats_score | Number | Last ATS score (0–100) |
| source | Select | remoteok / arbeitnow / adzuna / themuse / remotive / handshake / jobright / linkedin / manual |
| source_id | Text | Original job ID from source (for deduplication) |
| auto_imported | Boolean | True if fetched by API |
| created | auto | Timestamp |
| updated | auto | Timestamp |

### Table 2: `resumes`
| Field | Type | Notes |
|---|---|---|
| id | auto | Unique ID |
| name | Text | e.g. "Software Engineer Resume v2" |
| content | Text (long) | Plain text version |
| latex_source | Text (long) | Full LaTeX source (.tex) |
| compiled_pdf | File | Last compiled PDF |
| is_base | Boolean | True = master/original resume |
| created | auto | Timestamp |

### Table 3: `resume_versions`
| Field | Type | Notes |
|---|---|---|
| id | auto | Unique ID |
| resume_id | Relation → resumes | Base resume |
| job_id | Relation → jobs | Job this was tailored for |
| version_number | Number | 1, 2, 3... |
| latex_source | Text (long) | LaTeX for this version |
| compiled_pdf | File | PDF for this version |
| ats_score_before | Number | Score before edits |
| ats_score_after | Number | Score after edits |
| pros | JSON | List of pros from AI report |
| cons | JSON | List of cons from AI report |
| ai_suggestions | Text (long) | Full AI suggestions |
| created | auto | Timestamp |

### Table 4: `cover_letters`
| Field | Type | Notes |
|---|---|---|
| id | auto | Unique ID |
| job_id | Relation → jobs | Linked job |
| content | Text (long) | Full cover letter text |
| tone | Select | formal / conversational / enthusiastic |
| created | auto | Timestamp |

### Table 5: `ats_results`
| Field | Type | Notes |
|---|---|---|
| id | auto | Unique ID |
| job_id | Relation → jobs | Job checked against |
| resume_id | Relation → resumes | Resume used |
| score | Number | ATS score 0–100 |
| matched_keywords | JSON | Matched words list |
| missing_keywords | JSON | Missing words list |
| suggestions | Text (long) | AI improvement suggestions |
| created | auto | Timestamp |

### Table 6: `notifications`
| Field | Type | Notes |
|---|---|---|
| id | auto | Unique ID |
| job_id | Relation → jobs | Job that triggered this |
| type | Select | status_change / ats_alert / deadline / daily_summary |
| subject | Text | Email subject line |
| sent_at | DateTime | When sent |
| status | Select | sent / failed |

### Table 7: `contacts`
Stores hiring managers and recruiters found for each job.

| Field | Type | Notes |
|---|---|---|
| id | auto | Unique ID |
| job_id | Relation → jobs | Job this contact is linked to |
| name | Text | Contact's full name |
| title | Text | Contact's job title (e.g. "Senior Recruiter") |
| email | Text | Email address |
| linkedin_url | URL | LinkedIn profile link (optional) |
| company | Text | Company name |
| source | Select | hunter / apollo / pattern / manual |
| verified | Boolean | True if email confirmed by Hunter or Apollo |
| outreach_status | Select | none / draft_saved / sent / replied / no_response |
| notes | Text (long) | Your notes about this contact |
| created | auto | Timestamp |
| updated | auto | Timestamp |

### Table 8: `outreach_emails`
Stores every outreach email draft linked to a job and contact.

| Field | Type | Notes |
|---|---|---|
| id | auto | Unique ID |
| job_id | Relation → jobs | Job the email is about |
| contact_id | Relation → contacts | Who the email is addressed to |
| subject | Text | Email subject line |
| body | Text (long) | Full email body text |
| tone | Select | formal / conversational / confident |
| status | Select | draft / saved / sent |
| sent_at | DateTime | When the email was sent (if sent) |
| created | auto | Timestamp |
| updated | auto | Timestamp |

---

## n8n Workflows (What Each One Does)

### Workflow 1: Add Job (`POST /webhook/add-job`)
1. Receives job data from the frontend form
2. Validates required fields
3. Saves to PocketBase `jobs` collection
4. Appends a new row to `jobs.xlsx`
5. Returns the saved job ID to the frontend

### Workflow 2: Update Job Status (`POST /webhook/update-status`)
1. Receives job ID + new status (when user drags a Kanban card)
2. Updates PocketBase and Excel
3. Triggers Gmail notification for status change
4. Returns success confirmation

### Workflow 3: Get All Jobs (`GET /webhook/get-jobs`)
1. Fetches all records from PocketBase `jobs`
2. Returns JSON — frontend renders as Kanban cards

### Workflow 4: Export to Excel (`GET /webhook/export-excel`)
1. Fetches all jobs from PocketBase
2. Generates formatted Excel file
3. Returns as download

### Workflow 5: ATS Score Check (`POST /webhook/ats-check`)
1. Receives resume text + job description
2. Calls Groq API with Llama 3.3 70B
3. Prompt: extract JD keywords, compare against resume, score 0-100, list gaps
4. Falls back to local Ollama (Qwen2.5 14B) if Groq is unreachable
5. Parses response into structured JSON
6. Saves result to PocketBase `ats_results`
7. Returns score + keywords + suggestions to frontend

### Workflow 6: Resume Matcher (`POST /webhook/match-resume`)
1. Receives resume text + job description
2. Calls Groq API — prompt: rewrite bullet points to match JD
3. Falls back to local Ollama if needed
4. Returns original + suggested rewrites as structured JSON
5. Frontend shows side-by-side for accept/reject

### Workflow 7: Cover Letter Generator (`POST /webhook/cover-letter`)
1. Receives job title, company, JD, resume text, tone preference
2. Calls Google Gemini 1.5 Flash API (best for natural writing)
3. Falls back to Groq if Gemini is unreachable
4. Returns generated cover letter text
5. Saves to PocketBase linked to the job

### Workflow 8: Fetch Job Page (`POST /webhook/fetch-job-page`)
1. Receives a job URL from the frontend
2. HTTP Request node fetches the webpage
3. Strips HTML, extracts readable text
4. Returns clean job description text

### Workflow 9: Send Gmail Notification (Sub-workflow)
1. Receives: email, subject, body, type
2. Sends via Gmail SMTP (App Password)
3. Logs to PocketBase `notifications`

### Workflow 10: Daily Deadline Reminder (Scheduled — 8 AM)
1. Triggers every day at 8:00 AM
2. Queries PocketBase for jobs with deadline within 2 days
3. Sends Gmail alert for each
4. Sends daily summary: active applications, interviews this week, deadlines, ATS average

### Workflows 11–15: Job Site Fetchers (Scheduled — every 6h)
Each workflow fetches from one job site API, runs deduplication, saves new jobs to PocketBase with status "saved".

### Workflow 16: Bookmarklet Save (`POST /webhook/bookmarklet-save`)
1. Receives job data from the browser bookmarklet click
2. Saves immediately to PocketBase
3. Returns confirmation popup to the browser

### Workflow 17: Deduplication (Sub-workflow)
1. Checks if a job URL already exists in PocketBase
2. Skips if duplicate, saves if new

### Workflow 18: Compile LaTeX (`POST /webhook/compile-latex`)
1. Receives LaTeX source code from the browser editor
2. Saves to a temp .tex file on Mac
3. Runs Tectonic to compile it to PDF
4. Returns the PDF file to the browser for preview and download

### Workflow 19: Save Resume Version (`POST /webhook/save-resume-version`)
1. Receives latex source + job ID + pros/cons report + ATS scores
2. Saves as a new version in PocketBase `resume_versions`
3. Returns version number to the frontend

### Workflow 20: Find Contacts (`POST /webhook/find-contacts`)
1. Receives a job ID from the frontend
2. Extracts the company domain from the job's URL (e.g. `careers.google.com` → `google.com`)
3. Calls **Hunter.io Domain Search API** (free tier — 25 searches/month) to retrieve known emails at that domain
4. Calls **Apollo.io People Search API** (free tier — 50 exports/month) to find recruiter/hiring manager names
5. Falls back to AI pattern generation: Groq generates the 4 most likely email formats for the domain
6. Returns a ranked list of contacts to the frontend
7. Saves all found contacts to PocketBase `contacts` collection linked to the job

### Workflow 21: Generate Outreach Email (`POST /webhook/generate-outreach`)
1. Receives: contact name, contact title, company, job title, tone preference, and your resume summary
2. Calls **Google Gemini 1.5 Flash** with a structured prompt to write a professional outreach email
3. Prompt instructs Gemini to:
   - Write a subject line that gets opened (name + role + company)
   - Open with a genuine connection to the company or role
   - Include one paragraph of relevant background drawn from the resume
   - Make a specific, low-pressure ask (15-minute call or referral)
   - Sign off with full contact details
4. Falls back to Groq (Llama 3.3 70B) if Gemini is unreachable
5. Returns the subject + body as JSON to the frontend for editing

### Workflow 22: Save Outreach Email Draft (`POST /webhook/save-outreach`)
1. Receives job ID, contact ID, subject, body, and tone from the frontend
2. Saves to PocketBase `outreach_emails` with status = "saved"
3. Updates the contact's `outreach_status` to "draft_saved"
4. Returns confirmation to the frontend

### Workflow 23: Send Outreach Email (`POST /webhook/send-outreach`)
1. Receives the outreach email ID from the frontend
2. Fetches the full email record from PocketBase (subject, body, contact email)
3. Sends via Gmail SMTP using the same App Password configured in Workflow 9
4. Updates PocketBase `outreach_emails` status to "sent" and records the sent timestamp
5. Updates the contact's `outreach_status` to "sent"
6. Triggers a Gmail notification log entry in the `notifications` collection
7. Returns success confirmation to the frontend

---

## Step-by-Step Build Order

### Phase 1 — Environment Setup (Day 1)
1. Install Homebrew (if not already installed)
2. Install Node.js v20 via Homebrew
3. Install n8n globally via npm
4. Install Tectonic (LaTeX compiler) via Homebrew
5. Install Ollama on Mac — uses M4's 10-core Metal GPU
6. Pull Qwen2.5 14B model via Ollama (fits in 16GB unified memory)
7. Pull Llama 3.1 8B as fast backup model
8. Download PocketBase binary for Mac (arm64)
9. Get free Groq API key at console.groq.com
10. Get free Google Gemini API key at aistudio.google.com
11. Add both keys to the .env file
12. Run setup.sh to create all project folders

### Phase 2 — Database Setup (Day 1)
1. Start PocketBase
2. Create admin account at localhost:8090/_/
3. Create all 8 collections with the schema above
4. Test by adding a dummy record

### Phase 3 — n8n Workflow Setup (Day 2)
1. Start n8n
2. Add Groq API credential in n8n settings
3. Add Google Gemini API credential in n8n settings
4. Build Workflow 3 (Get Jobs — tests DB connection)
5. Build Workflow 1 (Add Job)
6. Build Workflow 2 (Update Status)
7. Build Workflow 5 (ATS Check — tests Groq connection)
8. Build Workflow 7 (Cover Letter — tests Gemini connection)
9. Build Workflow 6 (Resume Matcher)
10. Build Workflow 4 (Export Excel)
11. Build Workflow 8 (Fetch Job Page)
12. Set up Gmail SMTP credential (Google App Password)
13. Build Workflow 9 (Gmail sub-workflow)
14. Build Workflow 10 (Daily reminder — scheduled)
15. Register free Adzuna, Remotive, The Muse API keys
16. Build Workflows 11–15 (Job site fetchers)
17. Build Workflow 16 (Bookmarklet save)
18. Build Workflow 17 (Deduplication)
19. Build Workflow 18 (LaTeX compile)
20. Build Workflow 19 (Save resume version)
21. Register free Hunter.io API key (25 domain searches/month)
22. Register free Apollo.io API key (50 contact exports/month)
23. Build Workflow 20 (Find Contacts — Hunter + Apollo + pattern)
24. Build Workflow 21 (Generate Outreach Email — Gemini)
25. Build Workflow 22 (Save Outreach Draft)
26. Build Workflow 23 (Send Outreach via Gmail)
27. Create browser bookmarklet JavaScript snippet
28. Test all workflows

### Phase 4 — Frontend Development (Day 3–5)
1. Build api.js (shared fetch() calls to n8n)
2. Build index.html + dashboard.js (Job Tracker Dashboard)
3. Build ats.html + ats.js (ATS Checker)
4. Build resume.html + resume.js (Resume Editor with Monaco + LaTeX)
5. Build cover-letter.html + cover-letter.js
6. Build workday.html + workday.js
7. Build job-sources.html (Job Site Settings)
8. Build outreach.html + outreach.js (Hiring Contact Finder & Outreach Email)
9. Build styles.css
10. Add sidebar navigation between all pages

### Phase 5 — Integration & Testing (Day 6)
1. Connect all frontend forms to n8n webhooks
2. Test full flow: Add job → ATS check → Edit resume → Cover letter
3. Test Excel export
4. Test LaTeX compile and PDF download
5. Test job site auto-fetch
6. Test Gmail notifications
7. Fix bugs

### Phase 6 — Polish (Day 7)
1. Add loading spinners while AI is processing
2. Add success/error toast notifications
3. Make responsive for smaller screens
4. Add keyboard shortcuts
5. Final review

---

## Ports & Services Summary

| Service | URL | Purpose |
|---|---|---|
| Frontend | open index.html in browser | Your app UI |
| n8n | http://localhost:5678 | Workflow editor and API |
| Supabase | https://supabase.com/dashboard | Database admin panel (cloud) |
| Ollama (local) | http://localhost:11434 | Offline AI backup |
| Groq API | https://api.groq.com | Primary AI (free cloud) |
| Gemini API | https://generativelanguage.googleapis.com | Cover letter + outreach AI |
| Gmail SMTP | smtp.gmail.com:587 | Outgoing email notifications |

---

## Student Free Resources to Register For

| Resource | What You Get | URL |
|---|---|---|
| Groq API | 14,400 AI requests/day free | console.groq.com |
| Google Gemini API | 1,500 requests/day free | aistudio.google.com |
| Hunter.io | 25 email domain searches/month free | hunter.io |
| Apollo.io | 50 contact exports/month free | apollo.io |
| GitHub Student Pack | $200 Azure + many other credits | education.github.com/pack |
| AWS Educate | $100 cloud credit, no credit card | aws.amazon.com/education/awseducate |
| Azure for Students | $100 credit, no credit card | azure.microsoft.com/free/students |
| Oracle Cloud Free | Forever-free VM for 24/7 hosting | oracle.com/cloud/free |

Use your buffalo.edu email for all student registrations.

---

## What You Will Learn By Building This

- Setting up and running local servers (n8n, PocketBase, Ollama)
- Designing a relational database schema
- Building REST API workflows with n8n
- Connecting to free cloud AI APIs (Groq, Gemini)
- Writing JavaScript fetch() calls to consume APIs
- Building a multi-page HTML/CSS/JS application
- LaTeX document editing and PDF compilation
- Reading and writing Excel files programmatically
- Sending automated emails via SMTP
- Understanding how frontend and backend communicate

---

### Feature 10 — LinkedIn Application Auto-Fill (You Submit Manually)

**What it does:** When you find a job on LinkedIn and open Easy Apply, a side panel appears (triggered by the bookmarklet) that pre-fills every field in the LinkedIn application form using your saved resume data — name, phone, address, education, work experience, skills. You review the filled form, make any changes you want, then click **Submit** yourself. The system never submits on your behalf.

---

#### How It Works

1. You browse LinkedIn and find a job you want to apply to
2. Click **Easy Apply** on LinkedIn — the multi-step form opens
3. Click your **Job Tracker Bookmarklet** in your browser bookmark bar
4. A small side panel opens on the right side of the screen showing your saved info
5. The bookmarklet automatically fills in:
   - Full name, email, phone number
   - Current location / address
   - Education (university, degree, graduation year)
   - Work experience entries
   - Skills list
   - Resume upload (points to your latest compiled PDF)
   - Cover letter (if one was generated for this job in the tracker)
6. The form is filled but **nothing is submitted**
7. You read through every field, make any corrections
8. You click **Submit Application** yourself when ready
9. The bookmarklet then saves the job to your tracker with status = `applied` and records the date

#### Why No Auto-Submit

LinkedIn's Terms of Service prohibit automated submissions. More importantly, every application should be reviewed by you — auto-filled does not mean auto-perfect. A single wrong field (wrong salary expectation, wrong availability date) can disqualify you instantly. You stay in control.

#### What You Need to Fill In Once

In your tracker settings, save your standard application info:
- Full legal name
- Phone number
- Current address (city, state, zip)
- LinkedIn profile URL
- GitHub URL
- University, degree, GPA, graduation date
- Work authorization status (e.g. "Authorized to work in the US — OPT/STEM OPT")
- Desired salary range
- Earliest start date

The bookmarklet reads these from your Supabase profile record and fills LinkedIn fields automatically.

#### Page Layout Addition (outreach.html gets a new tab)

```
┌────────────────────────────────────────────────────────┐
│  Outreach  |  LinkedIn Auto-Fill                        │
│                                                        │
│  Your Application Profile (saved once, used always)   │
│                                                        │
│  Full Name:       Litheesh V R                        │
│  Email:           litheesh@buffalo.edu                │
│  Phone:           +1 [___________]                    │
│  Location:        Buffalo, NY 14260                   │
│  University:      University at Buffalo               │
│  Degree:          MS Computer Science                 │
│  Graduation:      May 2026                            │
│  Work Auth:       OPT / STEM OPT eligible             │
│  Start Date:      [___________]                       │
│  Salary Range:    [___________]                       │
│                                                        │
│                   [ Save Profile ]                    │
│                                                        │
│  Bookmarklet:  [Drag this → Job Tracker Fill]         │
│  (drag to your bookmarks bar — use on any job site)   │
└────────────────────────────────────────────────────────┘
```

**n8n workflows involved:** save-profile (new WF 24), bookmarklet reads profile from Supabase and fills form fields using JavaScript

---

*Last updated: Added Feature 10 — LinkedIn Auto-Fill, no auto-submit (May 2026)*
