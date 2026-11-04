# JobSuite — What Has Been Built

> Project: Job Application Automation Suite (JobSuite)
> Developer: Litheesh V R
> Machine: MacBook M4 Air
> This file describes the work that exists in the project folder as of October 21, 2026.
> It is based on the current source files, not on the older phase checklists.

JobSuite is a local career toolkit. The browser pages are the product. They talk to three backends:

- **Supabase** (cloud PostgreSQL) stores jobs and contacts.
- **n8n** on `localhost:5678` runs the longer AI workflows (ATS, cover letter, outreach email, resume tailor).
- **Groq, Gemini, and Hunter.io** are called directly from some pages when a full n8n workflow is not required.

The original plan was six phases. Environment setup, a database script, a frontend, and four AI workflow code files are in place. Scheduled job fetchers, a Kanban board, LaTeX PDF compile, Excel export, and most of the planned n8n workflows are still only described in the planning docs.

---

## How the pieces fit

```
Browser pages (frontend/*.html)
        |
        |-- Supabase REST  -->  jobs, contacts, and related tables
        |-- n8n webhooks   -->  Groq Llama 3.3 70B
        |-- Groq directly  -->  LinkedIn notes, and the chatbot's writing tools
        |-- Gemini         -->  JobBot chat (function calling)
        |-- Hunter.io      -->  email lookup on the Outreach page
        |-- Gmail API      -->  save an outreach draft (needs Google OAuth)
        |-- Remotive API   -->  live remote job listings
```

Settings and profile live in the browser (`localStorage`), with `frontend/config.js` as the fallback. Secrets are also expected in `.env` for scripts. `frontend/config.js` and `.env` are gitignored.

Open the app by serving the `frontend` folder (the n8n guide uses `http://localhost:8080`). Every page shares the same sidebar and loads `chatbot.js`.

---

## Status against the original six phases

`Project_Build_Phases.md` still says the frontend has not started and that Phase 3 is in progress. The folder is further along than that document.

| Phase | Planned work | What is actually in the folder |
|---|---|---|
| 1. Environment | Homebrew, Node, n8n, Git, Ollama, Tectonic, PocketBase, helper scripts | Scripts and install docs are written. PocketBase binary is still in `pocketbase/`. The running database choice later switched to Supabase. |
| 2. Database | 8 PostgreSQL tables plus row-level security | `scripts/setup-supabase.sql` creates those 8 tables. The live pages do not all use those table names. See [Database mismatch](#database-mismatch). |
| 3. n8n workflows | About 24 workflows (jobs, ATS, mail, job APIs, LaTeX, contacts) | Prompt code and extract-response snippets exist for 4 AI workflows only. They still have to be pasted into n8n and activated. |
| 4. Frontend | 7 pages, shared `api.js`, Kanban, Monaco LaTeX editor | 10 finished HTML pages, one shared chatbot, one bookmarklet. No shared `api.js`, no Kanban, no LaTeX editor. |
| 5. Integration and testing | Wire pages to n8n and test every flow | Pages are wired. There is no automated test suite. |
| 6. Polish | Final review | Not started as its own pass. The UI is already styled. |

---

## 1. Frontend

All pages use Tailwind from a CDN, Inter, and Material Symbols. The sidebar groups are Main, AI Tools, and Data, plus Settings.

| Page | File | What it does |
|---|---|---|
| Dashboard | `frontend/dashboard.html` | Reads the `jobs` table. Shows counts for total, interviews, offers, and pending, a status breakdown, and the 5 most recent rows. The activity bar chart is a static visual; it does not use real dates. Search in the header is not wired. |
| Job Board | `frontend/job-board.html` | Lists applications, filters by status, adds a job in a modal, and deletes a row. Saves to a table named `job_applications` with a `role` column. Shows a response-rate style summary from the loaded rows. |
| ATS Checker | `frontend/ats-checker.html` | Paste a job description and an optional resume. Posts to the n8n webhook `check-ats`. Renders score, matched keywords, missing keywords, and suggestions. Keeps a simple scan count in the page. |
| Cover Letter | `frontend/cover-letter.html` | Job title, company, description, hiring manager, and key points. Posts to `generate-cover-letter`. The letter is editable. Copy and download as `.txt` are included. |
| Outreach Email | `frontend/outreach-email.html` | Cold or referral tone. Posts to `generate-outreach-email`. Looks up an email with Hunter.io. Can connect Gmail and save the message as a Gmail draft. |
| LinkedIn Note | `frontend/linkedin-note.html` | Calls Groq directly (not n8n). Drafts a connection note and tracks a 300-character LinkedIn limit. |
| Resume Tailor | `frontend/resume-generator.html` | Job title, company, description, and Standard or Compact format. Posts to `generate-resume`. Editable result, word count, copy, download, and regenerate. |
| Contacts | `frontend/contacts.html` | Table of hiring contacts with search, sort, paging, add, and delete. Reads and writes `hiring_contacts`. |
| Remote Jobs | `frontend/remote-jobs.html` | Loads up to 100 jobs from the public Remotive API. Keyword and category filters, bookmarks in `localStorage`, and an option to save a listing into `job_applications`. |
| Settings | `frontend/settings.html` | Saves n8n URL, Groq, Gemini, Supabase URL and anon key, Hunter.io, and Google OAuth client id. Also saves name, email, phone, website, title, and resume text. |

`frontend/config.example.js` is the template for `frontend/config.js`. Keys saved in Settings override the file.

### JobBot (`frontend/chatbot.js`)

JobBot is on every page. It uses **Gemini function calling** as the chat model and **Groq Llama 3.3 70B** for writing tasks. It can:

- Add, list, update, and delete rows in the `jobs` table, and summarize stats
- Generate a cover letter, check an ATS score, write a LinkedIn note, draft an outreach email
- Look up contacts (Hunter.io), search remote jobs, rewrite a resume bullet
- Prepare interview questions and do a light salary discussion
- Jump the user to another JobSuite page

The chatbot writes to `jobs`. The Job Board writes to `job_applications`. Those two screens do not share one table. See below.

### Bookmarklet (`frontend/js/bookmarklet.js`)

A browser bookmarklet that scrapes the open job page and posts it to n8n. Site extractors exist for:

- LinkedIn
- Handshake
- Levels.fyi
- Wellfound
- SimplyHired
- Ladders
- Hiring Cafe

It expects webhooks `add-job` and `linkedin-note` at `http://localhost:5678/webhook`. Those two workflows are not in the `n8n_workflows` folder. Only the bookmarklet source is written.

---

## 2. n8n AI workflows

Folder: `n8n_workflows/`

These are JavaScript snippets to paste into n8n Code nodes. They are not importable workflow JSON. Each intended chain is:

`Webhook → Code (build the Groq request) → HTTP Request (Groq) → Code (extract the answer) → Respond to Webhook`

Model used in all four: `llama-3.3-70b-versatile`.

| Workflow | Webhook path | Code file | What the model returns |
|---|---|---|---|
| 05 ATS Checker | `check-ats` | `workflow_05_ats_checker_code.js` | JSON: score 0–100, matched keywords, missing keywords, suggestions |
| 06 Cover Letter | `generate-cover-letter` | `workflow_06_cover_letter_code.js` | A full letter. The page sends job, company, hiring manager, and key points. |
| 10 Outreach Email | `generate-outreach-email` | `workflow_10_outreach_email_code.js` | A cold email or a referral request, plus subject and body handling on the page. |
| 14 Resume Tailor | `generate-resume` | `workflow_14_resume_generator_code.js` | A plain-text resume tailored to the job. Standard or compact length. Prompts forbid inventing experience. |

`EXTRACT_RESPONSE_NODES.md` holds the second Code node for each workflow. The ATS extractor strips markdown fences and parses JSON. The others wrap the text as `cover_letter`, `email`, or `resume`.

`SETUP_GUIDE.md` is the click-by-click n8n setup: start command, node settings, and the four test URLs on port 8080.

Each of the four Code files embeds the same master resume (experience at Isahghan Minds and ESI, three projects, UB M.S. and VTU B.E.). The ATS workflow can override that text when the page sends `resume_override`. The guide says later resume edits are made in the Code node, not in the HTML.

### Workflows that were planned and are not in this folder

The phase guide lists many more workflows. None of these exist as code here:

- Add job, update status, get jobs, export Excel
- Resume pros/cons matcher and “apply AI fix”
- Fetch a Workday (or other) job page
- Gmail notification sub-workflow and daily reminder
- Scheduled fetchers for RemoteOK, Arbeitnow, Adzuna, The Muse, Remotive
- Bookmarklet save, deduplication
- Tectonic LaTeX compile and resume version history
- Find contacts inside n8n (Hunter + Apollo)
- Save outreach draft, send outreach, save application profile

Hunter lookup and Gmail drafts were built in the browser instead of as n8n workflows. Remotive fetch was also built in the browser.

---

## 3. Database

`scripts/setup-supabase.sql` is meant to be run once in the Supabase SQL editor. It creates eight tables, turns on row-level security, and adds a policy that allows all operations (so the anon key used by the browser can read and write).

| Table in the SQL script | Purpose |
|---|---|
| `jobs` | Title, company, URL, location, salary, status, dates, description, notes, ATS score, source |
| `resumes` | Master resume name, plain text, LaTeX, PDF URL, base flag |
| `resume_versions` | Per-job edits, before/after ATS scores, pros, cons, suggestions |
| `cover_letters` | Letter text and tone, linked to a job |
| `ats_results` | Score, matched and missing keywords, suggestions |
| `notifications` | Log of emails the system was going to send |
| `contacts` | Recruiter or hiring manager, verification, outreach status |
| `outreach_emails` | Subject, body, tone, draft/sent status |

Status values in `jobs` are constrained to `saved`, `applied`, `interview`, `offer`, `rejected`. Sources are constrained to a fixed list (`remoteok`, `arbeitnow`, `adzuna`, `themuse`, `remotive`, `handshake`, `jobright`, `linkedin`, `manual`).

`resumes`, `resume_versions`, `cover_letters`, `ats_results`, `notifications`, and `outreach_emails` are created by the script. No current page writes to them. ATS results, letters, and tailored resumes stay in the browser after generation.

PocketBase 0.37 is still in `pocketbase/` from the first plan (binary, license, local `pb_data`). The scripts and the UI treat Supabase as the database. Nothing in `frontend/` calls PocketBase.

### Database mismatch

The SQL script and the pages do not agree. Until this is aligned, saving on one screen will not show up on another.

| Screen | Table it calls | Column it uses for the role |
|---|---|---|
| SQL script | `jobs` | `title` (required) |
| Dashboard | `jobs` | displays `role`, then `job_title` (neither is a column in the script) |
| JobBot | `jobs` | `title` |
| Job Board | `job_applications` | `role` |
| Remote Jobs “save” | `job_applications` | sends `title` in one payload shape |
| SQL script contacts | `contacts` | `outreach_status` |
| Contacts page | `hiring_contacts` | `status`, plus `date_added` |

`job_applications` and `hiring_contacts` are not created by `setup-supabase.sql`. If only that script has been run, the Job Board and Contacts page have no table to write to. The Dashboard and JobBot use `jobs`, which the script does create, but the Dashboard looks for role columns the script does not define.

Job status casing also differs. The SQL check wants lowercase `saved`. JobBot sends `Saved`. The Job Board compares status in lowercase when filtering, which hides some of that, but an insert into `jobs` with `Saved` would fail the check constraint.

---

## 4. Scripts and local setup

| File | What it does |
|---|---|
| `scripts/setup.sh` | Creates folders (`frontend/css`, `frontend/js`, `latex-templates`, `compiled-resumes`, `data`, `docs`) and writes a `.env` template and `.gitignore` if they are missing. It creates `n8n-workflows` (hyphen). The real folder in the repo is `n8n_workflows` (underscore). |
| `scripts/start.sh` | Opens a Terminal window and runs `N8N_SECURE_COOKIE=false n8n start`, then opens `http://localhost:5678`. |
| `scripts/stop.sh` | Stops the n8n process. Supabase is left running in the cloud. |
| `scripts/check-status.sh` | Reports whether n8n and Ollama are up, and whether the Supabase URL in `.env` answers. |
| `scripts/setup-supabase.sql` | The 8-table schema above. |
| `.env` / `.env-1_sample` | Keys for Supabase, Groq, Gemini, Hunter, Apollo, Ollama model names, n8n, Gmail app password, and job-board API ids. |
| `.gitignore` | Ignores `.env`, `frontend/config.js`, compiled PDFs, `.DS_Store`, `node_modules`, Tectonic cache, and temp files. |
| `requirements.txt` | Python packages (Flask, PyPDF2, python-docx, NLTK, and others). A `venv` is present. There is no application `.py` file. These packages are unused by the current UI. |

Phase 1 docs (`Phase1_Installation_Guide.md`, the top of `Project_Build_Phases.md`) record the machine setup: Homebrew, Node, npm, n8n, Git, VS Code, Tectonic, Ollama, PocketBase, and DB Browser for SQLite, plus local models `qwen2.5:14b` and `llama3.1:8b`. Ollama is installed as an offline backup. No page or workflow in this folder calls `localhost:11434`.

---

## 5. Docs already in the repo

| File | Contents |
|---|---|
| `JobTracker_Plan_of_Action.md` | Full product plan: stack, architecture, every feature, AI routing (Groq for analysis, Gemini for writing, Ollama offline). |
| `Project_Build_Phases.md` | Phase-by-phase build log. Its status table is out of date relative to the frontend. |
| `Phase1_Installation_Guide.md` | Install steps for the Mac. |
| `docs/Cloud_AI_Pricing_Guide.md` | Free-tier and paid cost comparison. Groq and Gemini free tiers are the intended default. Dated April 2026. |
| `docs/Recruiter_Email_Templates.md` | Cold, referral, follow-up, and related email templates with placeholders. |
| `n8n_workflows/SETUP_GUIDE.md` | How to build the four Groq workflows inside n8n. |
| `n8n_workflows/EXTRACT_RESPONSE_NODES.md` | The extract Code nodes. |

---

## 6. What a working session looks like today

1. Supabase project exists and `setup-supabase.sql` has been run (or the extra tables the pages expect have been created by hand).
2. `frontend/config.js` or the Settings page has the Supabase URL, anon key, Groq key, Gemini key, and Hunter key.
3. `bash scripts/start.sh` so n8n is on port 5678.
4. The four workflows are pasted in, activated, and the Groq credential is set on the HTTP Request nodes.
5. The `frontend` folder is served at `http://localhost:8080`.
6. Dashboard is `dashboard.html`.

Without n8n, these still work on their own: Settings, Job Board and Dashboard (if Supabase is configured and the table names match), Contacts, Remote Jobs, LinkedIn Note (Groq key), and JobBot (Gemini key). ATS, cover letter, outreach generation, and resume tailor need the matching webhook to be active.

---

## 7. Planned work that is not built

From `JobTracker_Plan_of_Action.md` and Phase 4–6 of the build guide, these items are described and not implemented:

- Kanban board (Saved → Applied → Interview → Offer → Rejected) with drag and drop
- Excel export (SheetJS was in the plan)
- Pros/cons report beside the resume
- In-browser Monaco LaTeX editor, Tectonic compile, live PDF preview, version history, and three LaTeX templates (`latex-templates/` and `compiled-resumes/` are only created by `setup.sh` if you run it; they are not populated)
- Workday / generic job-page viewer
- Job-source settings page with on/off toggles for RemoteOK, Arbeitnow, Adzuna, The Muse, and Remotive
- Scheduled fetches every few hours inside n8n
- Deduplication of imported jobs
- Apollo.io contact search
- Gmail SMTP notifications (status change, ATS alert, deadline, daily summary). Gmail in the app today only saves a draft from the Outreach page via the Gmail API.
- Persisting ATS scores, cover letters, and resume versions into Supabase
- Offline fallback to Ollama when Groq or Gemini fails
- Automated tests and a Phase 6 polish pass
- A Python/Flask backend (dependencies are installed; there is no app)

---

## 8. Practical gaps to know about

- **Two job tables.** Dashboard and JobBot use `jobs`. Job Board and Remote Jobs use `job_applications`. Pick one and point every page at it.
- **Contacts table name.** The SQL file creates `contacts`. The Contacts page uses `hiring_contacts`.
- **Status values.** The SQL constraint is lowercase. Several pages send capitalized statuses such as `Saved`.
- **Dashboard role column.** It displays `role` or `job_title`. The SQL `jobs` table stores `title`.
- **Activity chart and some badges** (for example “+12%”) are layout, not calculated from data.
- **Header search** on the dashboard is not connected to filtering.
- **Bookmarklet webhooks** `add-job` and `linkedin-note` have no workflow code in the repo.
- **Master resume is duplicated** inside four workflow files. A change has to be made in each Code node, or the workflows will drift.
- **`n8n_workflows/SETUP_GUIDE.md` contains a live Groq API key** in the HTTP header examples. That key should be rotated in the Groq console and removed from the guide. Use an n8n credential instead of pasting the key into a markdown file.
- **Phase status in `Project_Build_Phases.md` is stale.** Use this file for the current picture.

---

## 9. File map

```
Job_Application_Project/
├── PROJECT_OVERVIEW.md          ← this file
├── JobTracker_Plan_of_Action.md
├── Project_Build_Phases.md
├── Phase1_Installation_Guide.md
├── requirements.txt
├── .env                         ← secrets, gitignored
├── .gitignore
├── frontend/
│   ├── dashboard.html
│   ├── job-board.html
│   ├── ats-checker.html
│   ├── cover-letter.html
│   ├── outreach-email.html
│   ├── linkedin-note.html
│   ├── resume-generator.html
│   ├── contacts.html
│   ├── remote-jobs.html
│   ├── settings.html
│   ├── chatbot.js
│   ├── config.js                ← gitignored
│   ├── config.example.js
│   └── js/bookmarklet.js
├── n8n_workflows/
│   ├── workflow_05_ats_checker_code.js
│   ├── workflow_06_cover_letter_code.js
│   ├── workflow_10_outreach_email_code.js
│   ├── workflow_14_resume_generator_code.js
│   ├── EXTRACT_RESPONSE_NODES.md
│   └── SETUP_GUIDE.md
├── scripts/
│   ├── setup.sh
│   ├── start.sh
│   ├── stop.sh
│   ├── check-status.sh
│   └── setup-supabase.sql
├── docs/
│   ├── Cloud_AI_Pricing_Guide.md
│   └── Recruiter_Email_Templates.md
└── pocketbase/                  ← leftover from the first database plan
```
