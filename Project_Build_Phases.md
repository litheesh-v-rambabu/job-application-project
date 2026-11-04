# Job Application Project — Phase-wise Build Guide
> Developer: Litheesh V R | MacBook M4 Air | Started: April 2026
> This document tracks every phase of the project from installation to completion.

---

## Project Overview

This project builds a complete job application automation suite from scratch.
It is split into 6 phases. Each phase builds on the previous one.
You cannot skip a phase — they must be completed in order.

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6
  Tools     Database   Workflows  Frontend   Connect   Polish
 Setup      Schema      in n8n    HTML/JS    & Test    & Done
```

---

## Current Status

| Phase | Name | Status |
|---|---|---|
| Phase 1 | Environment Setup | ✅ COMPLETE |
| Phase 2 | Database Schema (Supabase) | ✅ COMPLETE |
| Phase 3 | Workflow Engine (n8n) | 🔄 IN PROGRESS |
| Phase 4 | Frontend (HTML/CSS/JS) | ⏳ NOT STARTED |
| Phase 5 | Integration & Testing | ⏳ NOT STARTED |
| Phase 6 | Polish & Final Review | ⏳ NOT STARTED |

---

---

# PHASE 1 — Environment Setup
**Status: ✅ COMPLETE**
**Time taken:** ~2 hours

---

## What Phase 1 Is

Phase 1 installs every tool needed to build the project. Think of it as setting up your workshop before you start building. No actual project code is written in this phase — it is purely about getting your Mac ready.

## What Was Installed

| Tool | Version Installed | Purpose in Project |
|---|---|---|
| Homebrew | 5.1.7 | Mac package manager — used to install all other tools |
| Node.js | v24.11.1 | JavaScript runtime — required to run n8n |
| npm | 11.6.2 | Node package manager — used to install n8n |
| n8n | 2.15.0 | Workflow automation engine — the brain of the project |
| Git | 2.50.1 | Version control — tracks changes to your code |
| VS Code | Latest | Code editor — where you write all HTML/CSS/JS |
| Tectonic | 0.15.0 | LaTeX compiler — converts resume .tex files to PDF |
| Ollama | 0.21.1 | Local AI engine — runs AI on your M4 Metal GPU |
| PocketBase | 0.37.3 | Database — stores all jobs, resumes, cover letters |
| DB Browser SQLite | Latest | Visual database viewer |

## AI Models Downloaded

| Model | Size | Purpose |
|---|---|---|
| qwen2.5:14b | 9 GB | Primary local AI — resume analysis, ATS scoring |
| llama3.1:8b | 4.7 GB | Fast backup local model |

## Free Cloud AI Accounts Registered

| Service | Model Available | Daily Free Limit |
|---|---|---|
| Groq | Llama 3.3 70B | 14,400 requests/day |
| Google Gemini | Gemini 1.5 Flash | 1,500 requests/day |
| Together.ai | Llama 3.3 70B | $25 free credit |

## Student Resources Claimed

| Resource | Credit | Notes |
|---|---|---|
| GitHub Student Pack | Various credits | education.github.com/pack |
| AWS Educate | $100 | aws.amazon.com/education/awseducate |
| Azure for Students | $100 | No credit card needed |
| Oracle Cloud Free | Forever free VM | For 24/7 hosting |

## How to Start Services (Every Session)

```bash
# Terminal Tab 1 — Start PocketBase
cd ~/Downloads/Job_Application_Project/pocketbase && ./pocketbase serve

# Terminal Tab 2 — Start n8n
n8n start
```

Or use the helper script:
```bash
bash ~/Downloads/Job_Application_Project/scripts/start.sh
```

---

---

# PHASE 2 — Database Schema Setup
**Status: 🔄 IN PROGRESS**
**Estimated time:** ~20 minutes

---

## What Phase 2 Is

Phase 2 sets up the database — the storage system for the entire project.
Supabase is the database tool. It is a free cloud PostgreSQL database with a clean admin dashboard at `supabase.com`. Your data is always online — you never need to start or stop it.

In this phase you sign up for Supabase and run one SQL script that creates all 8 tables automatically. No manual clicking through forms required.

## What Gets Created in Phase 2

```
PocketBase Database
│
├── jobs              ← Every job you track (title, company, status, etc.)
├── resumes           ← Your resume files + LaTeX source code
├── resume_versions   ← Each edited version of your resume per job
├── cover_letters     ← AI-generated cover letters linked to jobs
├── ats_results       ← ATS scores and keyword analysis per job
├── notifications     ← Log of every Gmail notification sent
├── contacts          ← Hiring managers / recruiters found per job
└── outreach_emails   ← Outreach email drafts linked to jobs and contacts
```

## How the Collections Relate to Each Other

```
resumes ──────────────────────────────────┐
   │                                       │
   └──► resume_versions ◄── jobs ◄──── ats_results
                                 │
                                 ├──── cover_letters
                                 ├──── notifications
                                 ├──── contacts ◄──── outreach_emails
                                 └──── outreach_emails
```

A job links to: its ATS result, its cover letter, resume versions, contacts found, and outreach emails drafted.
A resume links to: all versions created from it.
A contact links to: all outreach emails drafted for that contact.

## The 8 Collections — Quick Reference

### Collection 1: jobs
Stores every job you save or apply to.

| Field | What it stores |
|---|---|
| title | Job title (e.g. "Software Engineer") |
| company | Company name (e.g. "Google") |
| url | Link to the job posting |
| location | City or Remote or Hybrid |
| salary | Salary range if shown |
| status | Where you are: saved / applied / interview / offer / rejected |
| date_applied | When you submitted the application |
| deadline | Application deadline |
| job_description | Full job description text (used for ATS analysis) |
| notes | Your personal notes about this role |
| ats_score | Your last ATS score for this job (0-100) |
| source | Where the job came from (LinkedIn, Handshake, etc.) |
| auto_imported | Was it auto-fetched by n8n or manually added |

---

### Collection 2: resumes
Stores your master resume files.

| Field | What it stores |
|---|---|
| name | Resume name (e.g. "SWE Resume v2") |
| content | Plain text version of resume |
| latex_source | Full LaTeX code (.tex) for the resume |
| compiled_pdf | The last compiled PDF file |
| is_base | True = this is your original master resume |

---

### Collection 3: resume_versions
Every time you edit your resume for a specific job, a new version is saved here.

| Field | What it stores |
|---|---|
| resume_id | Which master resume this came from |
| job_id | Which job this version was tailored for |
| version_number | 1, 2, 3... |
| latex_source | The edited LaTeX for this version |
| compiled_pdf | The PDF compiled for this version |
| ats_score_before | ATS score before you made edits |
| ats_score_after | ATS score after edits |
| pros | List of resume strengths for this job |
| cons | List of resume weaknesses for this job |
| ai_suggestions | Full AI suggestions text |

---

### Collection 4: cover_letters
AI-generated cover letters, one per job.

| Field | What it stores |
|---|---|
| job_id | Which job this cover letter is for |
| content | The full cover letter text |
| tone | formal / conversational / enthusiastic |

---

### Collection 5: ats_results
Stores the detailed ATS analysis for each job check.

| Field | What it stores |
|---|---|
| job_id | Which job was checked |
| resume_id | Which resume was used |
| score | ATS score 0-100 |
| matched_keywords | List of keywords found in both resume and JD |
| missing_keywords | List of keywords in JD but missing from resume |
| suggestions | AI improvement suggestions |

---

### Collection 6: notifications
Log of every Gmail email sent by the system.

| Field | What it stores |
|---|---|
| job_id | Which job triggered this notification |
| type | status_change / ats_alert / deadline / daily_summary |
| subject | Email subject line |
| sent_at | When the email was sent |
| status | sent / failed |

---

### Collection 7: contacts
Hiring managers and recruiters found for each job.

| Field | What it stores |
|---|---|
| job_id | Which job this contact belongs to |
| name | Contact's full name |
| title | Contact's job title (e.g. "Senior Technical Recruiter") |
| email | Email address |
| linkedin_url | LinkedIn profile link (optional) |
| company | Company name |
| source | Where the email came from: hunter / apollo / pattern / manual |
| verified | True if Hunter.io or Apollo confirmed the email is valid |
| outreach_status | none / draft_saved / sent / replied / no_response |
| notes | Your personal notes about this contact |

---

### Collection 8: outreach_emails
Every outreach email draft you create, linked to a job and a contact.

| Field | What it stores |
|---|---|
| job_id | Which job the email is about |
| contact_id | Which contact the email is addressed to |
| subject | Email subject line |
| body | Full email body text |
| tone | formal / conversational / confident |
| status | draft / saved / sent |
| sent_at | When the email was sent (if it was sent) |

## Phase 2 Steps

```
Step 1  Go to supabase.com → Sign Up (use buffalo.edu email)
Step 2  Click New Project → give it a name → set a DB password → Create
Step 3  Wait ~2 minutes for the project to be ready
Step 4  Go to Project Settings → API
        Copy: Project URL, anon public key, service_role secret key
Step 5  Open .env file and fill in:
          SUPABASE_URL=https://your-ref.supabase.co
          SUPABASE_ANON_KEY=your_anon_key
          SUPABASE_SERVICE_KEY=your_service_role_key
Step 6  In Supabase Dashboard → click SQL Editor (left sidebar)
Step 7  Click New query
Step 8  Open the file: scripts/setup-supabase.sql
        Copy the entire contents and paste into the SQL Editor
Step 9  Click Run (green button)
Step 10 Confirm the output shows 8 table names at the bottom
Step 11 Click Table Editor (left sidebar) — verify all 8 tables appear
Step 12 Insert one test row into jobs table → verify it saves → delete it
```

## Phase 2 Checklist

```
[ ] Sign up at supabase.com (free, buffalo.edu email)
[ ] Create new Supabase project
[ ] Copy Project URL + anon key + service key into .env
[ ] Open SQL Editor in Supabase dashboard
[ ] Paste and run scripts/setup-supabase.sql
[ ] Confirm output shows all 8 table names
[ ] Verify all 8 tables appear in Table Editor
[ ] Add a test record to jobs table and verify it saves
[ ] Delete the test record
```

---

---

# PHASE 3 — n8n Workflow Setup
**Status: ⏳ NOT STARTED**
**Estimated time:** ~3-4 hours

---

## What Phase 3 Is

n8n is the automation engine — it is the middleman between your frontend (HTML pages) and everything else (PocketBase database, Groq AI, Gemini AI, Gmail, job site APIs). Every time you click a button in the app, n8n does the actual work.

In Phase 3 you build 19 workflows inside n8n. Each workflow is a visual flowchart of steps. n8n has a drag-and-drop interface at `http://localhost:5678` — no coding for most of it.

## What n8n Does in This Project

```
Your HTML Page clicks a button
         ↓
   n8n receives the request (webhook)
         ↓
   n8n processes it:
   - Calls PocketBase to save/read data
   - Calls Groq API for ATS analysis
   - Calls Gemini API for cover letters and outreach emails
   - Calls Hunter.io / Apollo to find hiring manager emails
   - Calls Ollama if no internet
   - Sends Gmail notifications and outreach emails
   - Fetches from job site APIs on schedule
         ↓
   n8n sends the result back to your page
```

## The 23 Workflows — What Each One Does

### Core Job Tracker (Workflows 1-4)

| # | Workflow | Trigger | What it does |
|---|---|---|---|
| 01 | add-job | Button click | Saves new job to PocketBase + Excel |
| 02 | update-status | Drag Kanban card | Updates job status in PocketBase |
| 03 | get-jobs | Page load | Fetches all jobs → renders Kanban board |
| 04 | export-excel | Button click | Generates formatted Excel file download |

### AI Features (Workflows 5-7)

| # | Workflow | Trigger | What it does |
|---|---|---|---|
| 05 | ats-check | Button click | Sends resume+JD to Groq → returns score + keywords |
| 06 | match-resume | Button click | Sends resume+JD to Groq → returns rewrite suggestions |
| 07 | cover-letter | Button click | Sends job details to Gemini → returns cover letter |

### Utility (Workflows 8-10)

| # | Workflow | Trigger | What it does |
|---|---|---|---|
| 08 | fetch-job-page | Button click | Fetches Workday/any job page content |
| 09 | send-notification | Called by others | Sends Gmail via SMTP — reusable sub-workflow |
| 10 | deadline-reminder | Every day 8 AM | Sends daily summary + deadline alerts |

### Job Site Auto-Fetch (Workflows 11-17)

| # | Workflow | Trigger | What it does |
|---|---|---|---|
| 11 | fetch-remoteok | Every 6 hours | Pulls remote jobs from RemoteOK API |
| 12 | fetch-arbeitnow | Every 6 hours | Pulls global jobs from Arbeitnow API |
| 13 | fetch-adzuna | Every 6 hours | Pulls jobs from Adzuna API (needs free key) |
| 14 | fetch-themuse | Every 12 hours | Pulls jobs from The Muse API (needs free key) |
| 15 | fetch-remotive | Every 6 hours | Pulls remote tech jobs from Remotive |
| 16 | bookmarklet-save | Browser click | Saves job from Handshake/Jobright/LinkedIn |
| 17 | deduplicate | After every fetch | Skips jobs already in the database |

### Resume (Workflows 18-19)

| # | Workflow | Trigger | What it does |
|---|---|---|---|
| 18 | compile-latex | Button click | Runs Tectonic → compiles .tex → returns PDF |
| 19 | save-resume-version | After edit | Saves new resume version + pros/cons to PocketBase |

### Hiring Contact & Outreach (Workflows 20-23)

| # | Workflow | Trigger | What it does |
|---|---|---|---|
| 20 | find-contacts | Button click | Queries Hunter.io + Apollo + AI pattern → returns contact list |
| 21 | generate-outreach | Button click | Sends details to Gemini → returns personalised outreach email |
| 22 | save-outreach | Button click | Saves draft email to Supabase, updates contact status |
| 23 | send-outreach | Button click | Sends email via Gmail SMTP, marks as sent in Supabase |

### LinkedIn Auto-Fill (Workflow 24)

| # | Workflow | Trigger | What it does |
|---|---|---|---|
| 24 | save-profile | Button click | Saves your application profile (name, phone, education) to Supabase for bookmarklet to read |

## API Credentials to Add in n8n

| Credential Name | Type | Where to get key |
|---|---|---|
| Groq API | HTTP Header Auth | console.groq.com |
| Google Gemini | HTTP Header Auth | aistudio.google.com |
| Gmail SMTP | SMTP | Google Account → Security → App Passwords |
| Hunter.io | HTTP Header Auth (X-API-Key) | hunter.io → free account |
| Apollo.io | HTTP Header Auth (X-Api-Key) | apollo.io → free account |
| Supabase | HTTP Header Auth (apikey) | supabase.com → Project Settings → API |

## Phase 3 Checklist

```
[ ] Open n8n at http://localhost:5678
[ ] Create n8n account (local, no email needed)
[ ] Add Groq API credential
[ ] Add Google Gemini API credential
[ ] Add Gmail SMTP credential (App Password)
[ ] Build Workflow 03 (Get Jobs) — tests DB connection
[ ] Build Workflow 01 (Add Job)
[ ] Build Workflow 02 (Update Status)
[ ] Build Workflow 05 (ATS Check) — tests Groq
[ ] Build Workflow 07 (Cover Letter) — tests Gemini
[ ] Build Workflow 06 (Resume Matcher)
[ ] Build Workflow 04 (Export Excel)
[ ] Build Workflow 08 (Fetch Job Page)
[ ] Build Workflow 09 (Gmail sub-workflow)
[ ] Build Workflow 10 (Daily Reminder scheduled)
[ ] Build Workflows 11-15 (Job site fetchers)
[ ] Build Workflow 16 (Bookmarklet save)
[ ] Build Workflow 17 (Deduplication)
[ ] Build Workflow 18 (LaTeX compile)
[ ] Build Workflow 19 (Save resume version)
[ ] Register Hunter.io free account → get API key (hunter.io)
[ ] Register Apollo.io free account → get API key (apollo.io)
[ ] Add Hunter.io API credential in n8n
[ ] Add Apollo.io API credential in n8n
[ ] Build Workflow 20 (Find Contacts — Hunter + Apollo + AI pattern)
[ ] Build Workflow 21 (Generate Outreach Email — Gemini)
[ ] Build Workflow 22 (Save Outreach Draft)
[ ] Build Workflow 23 (Send Outreach via Gmail)
[ ] Build Workflow 24 (Save Application Profile for LinkedIn auto-fill)
[ ] Test all workflows using n8n test button
```

---

---

# PHASE 4 — Frontend Development (HTML/CSS/JS)
**Status: ⏳ NOT STARTED**
**Estimated time:** ~4-5 hours

---

## What Phase 4 Is

Phase 4 builds the visual interface — everything you see and click in the browser. The frontend is built using HTML, CSS (Tailwind), and JavaScript. It runs by opening the HTML files directly in your browser — no web server needed.

Each page calls n8n webhooks using JavaScript fetch() to get data and trigger actions.

## The 9 Pages Being Built

### Page 1: index.html — Job Tracker Dashboard
The main page of the app. Shows all your jobs as a visual Kanban board.

```
┌────────────────────────────────────────────────────────────┐
│  Job Tracker Dashboard           [+ Add Job] [Export Excel] │
│                                                             │
│  Stats: 12 Applied | 3 Interviews | 1 Offer | 68% ATS avg  │
│                                                             │
│  SAVED      APPLIED     INTERVIEW     OFFER     REJECTED   │
│  ┌──────┐  ┌──────┐   ┌──────┐    ┌──────┐   ┌──────┐    │
│  │Google│  │Meta  │   │Apple │    │Stripe│   │Amazon│    │
│  │ SWE  │  │ DS   │   │ iOS  │    │ Eng  │   │ SDE  │    │
│  │ATS:82│  │ATS:71│   │ATS:88│    │      │   │ATS:55│    │
│  └──────┘  └──────┘   └──────┘    └──────┘   └──────┘    │
└────────────────────────────────────────────────────────────┘
```

---

### Page 2: ats.html — ATS Score Checker

```
┌────────────────────────────────────────────────────────────┐
│  ATS Score Checker                                          │
│                                                             │
│  [Paste Resume Text]          [Paste Job Description]      │
│  ┌─────────────────┐          ┌─────────────────────┐      │
│  │ Your resume...  │          │ Job requirements... │      │
│  └─────────────────┘          └─────────────────────┘      │
│                                                             │
│              [ Check ATS Score ]                           │
│                                                             │
│  Score: ████████░░  78/100                                 │
│  Matched: Python, React, AWS, Docker (14 keywords)         │
│  Missing: Kubernetes, GraphQL, TypeScript (3 keywords)     │
│  Suggestion: Add Kubernetes experience to Skills section   │
└────────────────────────────────────────────────────────────┘
```

---

### Page 3: resume.html — Resume Matcher & LaTeX Editor

```
┌───────────────┬──────────────────┬────────────────────────┐
│  PROS / CONS  │   LaTeX Editor   │    PDF Preview         │
│               │  (Monaco Editor) │                        │
│  Pros:        │  \begin{resume}  │   [Live PDF shown      │
│  + Python ✓   │  \name{Litheesh} │    here after          │
│  + AWS ✓      │  \section{Exp.}  │    compile]            │
│               │  \item Built...  │                        │
│  Cons:        │                  │                        │
│  - No K8s     │                  │                        │
│  - No GraphQL │  [Compile PDF]   │  [Download PDF]        │
│               │                  │                        │
│  [Apply Fix]  │                  │                        │
└───────────────┴──────────────────┴────────────────────────┘
```

---

### Page 4: cover-letter.html — Cover Letter Generator

```
┌────────────────────────────────────────────────────────────┐
│  Cover Letter Generator                                     │
│                                                             │
│  Job: Software Engineer at Google      Tone: [Formal ▼]    │
│                                                             │
│             [ Generate Cover Letter ]                      │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Dear Hiring Manager,                                 │  │
│  │                                                      │  │
│  │ I am writing to express my strong interest in the   │  │
│  │ Software Engineer position at Google...              │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  [Regenerate]  [Copy to Clipboard]  [Download .txt]        │
└────────────────────────────────────────────────────────────┘
```

---

### Page 5: workday.html — Workday Job Viewer

```
┌────────────────────────────────────────────────────────────┐
│  Workday Job Viewer                                         │
│                                                             │
│  Job URL: [paste any job URL here]      [Load Page]        │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Software Engineer — Google                          │  │
│  │  Mountain View, CA | Full-time                       │  │
│  │                                                      │  │
│  │  About the role:                                     │  │
│  │  We are looking for a Software Engineer to join...   │  │
│  │                                                      │  │
│  │  Requirements:                                       │  │
│  │  • 3+ years Python experience                        │  │
│  │  • Experience with distributed systems               │  │
│  └──────────────────────────────────────────────────────┘  │
│  [Open in new tab]  [Copy Description]  [Add to Tracker]   │
└────────────────────────────────────────────────────────────┘
```

---

### Page 6: job-sources.html — Job Site Settings

```
┌────────────────────────────────────────────────────────────┐
│  Job Site Settings                                          │
│                                                             │
│  Source        Status    Last Fetch    New Jobs   Toggle   │
│  RemoteOK      Active    2 hours ago   12 new     [ON ]    │
│  Arbeitnow     Active    2 hours ago   5 new      [ON ]    │
│  Adzuna        Active    2 hours ago   8 new      [ON ]    │
│  The Muse      Active    4 hours ago   3 new      [ON ]    │
│  Remotive      Inactive  Never         -          [OFF]    │
│                                                             │
│  Keyword filters: [python] [machine learning] [remote] [+] │
│  Location filter: [Remote] [New York] [+]                  │
│                                                             │
│                   [ Save Settings ]                        │
└────────────────────────────────────────────────────────────┘
```

---

### Page 7: outreach.html — Hiring Contact Finder & Outreach Email

```
┌────────────────────────────────────────────────────────────┐
│  Hiring Contact Finder & Outreach Email                     │
│                                                             │
│  Job: [Software Engineer at Google ▼]                      │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │  CONTACT FINDER                   [Find Contacts]  │    │
│  │                                                    │    │
│  │  Domain: google.com                                │    │
│  │  ○ Jane Smith — Recruiter — jsmith@google.com     │    │
│  │  ○ Tom Lee   — Hiring Mgr — tlee@google.com       │    │
│  │  ○ Enter manually: [_____________________]        │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │  EMAIL DRAFTER        Tone: [Formal ▼]             │    │
│  │                      [Generate Outreach Email]     │    │
│  │                                                    │    │
│  │  Subject: Litheesh V R — Interest in SWE at Google │    │
│  │                                                    │    │
│  │  Dear Jane,                                        │    │
│  │  I came across the Software Engineer position...   │    │
│  │  [editable text area — full email body]            │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  [Save Draft]   [Send via Gmail]   [Regenerate]            │
│                                                             │
│  ── Past Outreach ──────────────────────────────────────   │
│  Google / Jane Smith — Draft saved — Apr 24                │
│  Meta / Tom Rao — Sent — Apr 22                            │
└────────────────────────────────────────────────────────────┘
```

---

### Shared: sidebar navigation (on all pages)

```
┌──────────────┐
│ Job Tracker  │  ← index.html
│ ATS Checker  │  ← ats.html
│ Resume Edit  │  ← resume.html
│ Cover Letter │  ← cover-letter.html
│ Job Viewer   │  ← workday.html
│ Job Sources  │  ← job-sources.html
│ Outreach     │  ← outreach.html
│ Database     │  ← opens localhost:8090
└──────────────┘
```

## Files Created in Phase 4

```
frontend/
├── index.html
├── ats.html
├── resume.html
├── cover-letter.html
├── workday.html
├── job-sources.html
├── outreach.html          ← Hiring Contact Finder & Outreach Email
├── css/
│   └── styles.css
└── js/
    ├── api.js             ← All n8n webhook calls (shared by all pages)
    ├── dashboard.js       ← Kanban board logic
    ├── ats.js             ← ATS checker logic
    ├── resume.js          ← LaTeX editor + pros/cons logic
    ├── cover-letter.js    ← Cover letter generator logic
    ├── workday.js         ← Job page fetcher logic
    ├── job-sources.js     ← Job site settings logic
    └── outreach.js        ← Contact finder + email drafter logic
```

## Phase 4 Checklist

```
[ ] Create all folders (frontend/css, frontend/js)
[ ] Build api.js (shared n8n fetch calls)
[ ] Build index.html + dashboard.js
[ ] Build ats.html + ats.js
[ ] Build resume.html + resume.js (Monaco Editor + LaTeX)
[ ] Build cover-letter.html + cover-letter.js
[ ] Build workday.html + workday.js
[ ] Build job-sources.html + job-sources.js
[ ] Build outreach.html + outreach.js (Contact Finder + Email Drafter)
[ ] Build linkedin-fill.html + linkedin-fill.js (Application Profile + Bookmarklet generator)
[ ] Build styles.css (custom styles)
[ ] Add sidebar navigation to all pages
[ ] Test each page opens in browser without errors
```

---

---

# PHASE 5 — Integration & Testing
**Status: ⏳ NOT STARTED**
**Estimated time:** ~2 hours

---

## What Phase 5 Is

Phase 5 connects everything together and tests the complete flow end to end.
By this point the database exists, the workflows exist, and the frontend exists — but they haven't been tested as a complete system yet.

## What Gets Tested

### Full Application Flow Test
```
1. Open index.html in browser
2. Click Add Job → fill in Google SWE details → click Save
3. Confirm the job card appears on the Kanban board
4. Confirm the job appears in PocketBase at localhost:8090
5. Confirm the job was added to jobs.xlsx

6. Click the job card → go to ATS Checker
7. Paste your resume + the job description → click Check Score
8. Confirm score appears with keywords and suggestions

9. Go to Resume Editor
10. Confirm Pros/Cons report appears
11. Edit a bullet point in the LaTeX editor
12. Click Compile PDF → confirm PDF preview appears
13. Click Download PDF → confirm file downloads

14. Go to Cover Letter Generator
15. Click Generate → confirm cover letter appears
16. Check tone selector works (Formal / Conversational / Enthusiastic)

17. Go to Workday Viewer
18. Paste a job URL → click Load → confirm text appears

19. Drag the job card from Saved to Applied
20. Confirm Gmail notification arrives in inbox

21. Go to Outreach page
22. Select the Google SWE job from the dropdown
23. Click Find Contacts → confirm Hunter.io returns results
24. Select a contact from the list
25. Click Generate Outreach Email → confirm AI drafts an email
26. Edit the draft
27. Click Save Draft → confirm it appears in Past Outreach table
28. Optionally click Send via Gmail → confirm email is received in inbox

29. Check daily reminder email arrives at 8 AM next morning
```

### Job Site Fetch Test
```
1. Go to Job Sources settings page
2. Turn on RemoteOK and Arbeitnow
3. Set keyword filter to "python"
4. Click Fetch Now
5. Confirm new job cards appear on the dashboard
```

### Excel Export Test
```
1. Click Export Excel on the dashboard
2. Confirm jobs.xlsx downloads
3. Open in Excel/Numbers and verify all columns are correct
```

## Phase 5 Checklist

```
[ ] Test Add Job flow → PocketBase → Excel
[ ] Test ATS Score checker → Groq API response
[ ] Test Resume editor → LaTeX compile → PDF download
[ ] Test Cover letter → Gemini API response
[ ] Test Workday viewer → URL fetch
[ ] Test status drag → Gmail notification
[ ] Test job site auto-fetch (RemoteOK, Arbeitnow)
[ ] Test Excel export download
[ ] Test daily reminder email (trigger manually in n8n)
[ ] Test Find Contacts → Hunter.io API response
[ ] Test Generate Outreach Email → Gemini API response
[ ] Test Save Draft → PocketBase contacts + outreach_emails records
[ ] Test Send via Gmail → email received in inbox
[ ] Fix all bugs found during testing
```

---

---

# PHASE 6 — Polish & Final Review
**Status: ⏳ NOT STARTED**
**Estimated time:** ~2 hours

---

## What Phase 6 Is

Phase 6 improves the user experience. The tool works after Phase 5 — Phase 6 makes it feel professional and easy to use.

## What Gets Improved

**Loading states** — every AI call takes 2-5 seconds. Add a spinner so the user knows something is happening rather than staring at a blank screen.

**Error messages** — if Groq is down or internet is disconnected, show a clear message instead of a broken page. Auto-switch to local Ollama.

**Toast notifications** — small pop-up messages confirming actions. "Job saved!", "Cover letter generated!", "PDF downloaded!"

**Responsive layout** — make sure the app looks good on smaller screens.

**Keyboard shortcuts** — Cmd+S to save, Cmd+Enter to submit forms, Esc to close modals.

**Offline indicator** — show a banner when Groq/Gemini are unreachable so you know to expect local AI responses.

**Performance** — make sure the Kanban board loads fast even with 100+ job cards.

## Phase 6 Checklist

```
[ ] Add loading spinners on all AI calls
[ ] Add success toast notifications
[ ] Add error toast notifications
[ ] Add offline/online status indicator
[ ] Add Groq → Gemini → Ollama automatic fallback
[ ] Test responsive layout on smaller window sizes
[ ] Add keyboard shortcuts
[ ] Performance test with 50+ jobs in database
[ ] Final walkthrough of all 7 pages
[ ] Project complete!
```

---

---

# Quick Reference — All Phases Summary

| Phase | What You Build | Key Tools Used | Output |
|---|---|---|---|
| 1 | Development environment | Homebrew, Node, Ollama, PocketBase | All tools installed |
| 2 | Database structure | PocketBase admin panel | 8 collections ready |
| 3 | Automation workflows | n8n visual editor | 23 workflows |
| 4 | User interface | HTML, CSS, JavaScript | 8 web pages |
| 5 | End-to-end connection | All tools together | Working app |
| 6 | User experience polish | CSS, JS improvements | Production-ready app |

---

# How the Pieces Fit Together

```
┌────────────────────────────────────────────────────────────┐
│                    PHASE 4 OUTPUT                          │
│              8 HTML Pages (Frontend)                       │
│  index | ats | resume | cover-letter | workday | sources   │
│                    outreach                                │
└──────────────────────────┬─────────────────────────────────┘
                           │ JavaScript fetch() calls
                           ▼
┌────────────────────────────────────────────────────────────┐
│                    PHASE 3 OUTPUT                          │
│              23 n8n Workflows (Backend Logic)              │
│  add-job | ats-check | cover-letter | compile-latex        │
│  find-contacts | generate-outreach | send-outreach...      │
└────────┬──────────────────────────────┬────────────────────┘
         │                              │
         ▼                              ▼
┌─────────────────┐        ┌───────────────────────────────┐
│  PHASE 2 OUTPUT │        │       External Services       │
│  Supabase DB    │        │  Groq API (Llama 3.3 70B)     │
│  8 Tables       │        │  Gemini API (Flash 1.5)       │
│  supabase.com   │        │  Ollama local (Qwen2.5 14B)   │
│                 │        │  Gmail SMTP                   │
│  jobs           │        │  RemoteOK, Arbeitnow, Adzuna  │
│  resumes        │        │  Hunter.io (email finder)     │
│  resume_vers.   │        │  Apollo.io (contact finder)   │
│  cover_letters  │        └───────────────────────────────┘
│  ats_results    │
│  notifications  │        ┌───────────────────────────────┐
│  contacts       │        │  PHASE 1 OUTPUT               │
│  outreach_emails│        │  Mac Tools: Node, n8n,        │
└─────────────────┘        │  Tectonic, Ollama, Git, Code  │
                           └───────────────────────────────┘
```

---

*Update the Status column at the top of this document as each phase is completed.*
