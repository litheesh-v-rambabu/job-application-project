# Phase 1 — Complete Installation Guide
> MacBook M4 Air (16GB RAM, 512GB SSD, 10-core GPU)
> Everything is FREE. No Linux machine required.
> All project files live in: ~/Downloads/Job_Application_Project

---

## About Python — Nothing to Install

You do NOT need to install Python or any Python packages. Python3 comes pre-installed on your Mac. The guide uses it only for one-line verification commands using built-in modules — no pip install, no virtual environments needed.

---

## AI Setup — No Linux, No GPU Machine Needed

Your MacBook M4 Air handles AI in two ways:

| Mode | Tool | When Used |
|---|---|---|
| Online (primary) | Groq API — Llama 3.3 70B | Best quality, free, needs internet |
| Online (writing) | Google Gemini API — Flash 1.5 | Best for cover letters, free |
| Offline (backup) | Ollama — Qwen2.5 14B on M4 | No internet needed, uses M4 Metal GPU |

The M4 10-core GPU with 16GB unified memory runs Qwen2.5 14B locally using Apple Metal — no NVIDIA, no CUDA, no separate machine needed.

---

## Project Folder — Everything in One Place

```
~/Downloads/Job_Application_Project/
├── docs/                  <- Guides (you are here)
├── frontend/              <- HTML, CSS, JS files
│   ├── css/
│   └── js/
├── n8n-workflows/         <- n8n workflow JSON files
├── pocketbase/            <- Database binary + data
├── latex-templates/       <- LaTeX resume templates
├── compiled-resumes/      <- Output PDFs
├── data/                  <- Excel exports
├── scripts/               <- start.sh, stop.sh, setup.sh
├── .env                   <- API keys and config
└── .gitignore
```

---

## Before You Start

Open the Terminal app on your Mac:
- Press Cmd + Space, type Terminal, press Enter
- Keep it open the entire time

---

## PART A — INSTALL ALL TOOLS ON MAC

Run all commands in Terminal one by one. Copy each command, paste it, press Enter, wait for it to finish before the next one.

---

### Step 1 — Check What Is Already Installed

```bash
brew --version
node --version
git --version
```

Version number shown means already installed — skip that step.
command not found means it needs to be installed.

---

### Step 2 — Install Homebrew

Homebrew lets you install software from Terminal easily.
Skip if brew --version showed a number above.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

This asks for your Mac password. Type it (nothing shows — that is normal) and press Enter. Takes 5-10 minutes.

After it finishes, activate Homebrew on Apple Silicon:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
source ~/.zshrc
brew --version
```

Should show: Homebrew 4.x.x

---

### Step 3 — Install Node.js

Node.js is the engine that runs n8n. Skip if node --version showed v18 or higher.

```bash
brew install node@20
echo 'export PATH="/opt/homebrew/opt/node@20/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
node --version
npm --version
```

Should show v20.x.x and 10.x.x

---

### Step 4 — Install n8n

```bash
npm install -g n8n
n8n --version
```

Takes 3-5 minutes. Should show a version like 1.x.x

---

### Step 5 — Install Git

Skip if git --version showed something above.

```bash
brew install git
git --version
```

---

### Step 6 — Install VS Code

```bash
brew install --cask visual-studio-code
open -a "Visual Studio Code"
```

Install the LaTeX extension for syntax highlighting:
```bash
code --install-extension James-Yu.latex-workshop
```

---

### Step 7 — Install Tectonic (LaTeX to PDF Compiler)

Tectonic converts your LaTeX resume source into a professional PDF.

```bash
brew install tectonic
tectonic --version
```

Test it:
```bash
echo '\documentclass{article}\begin{document}Hello, Litheesh!\end{document}' > /tmp/test.tex
tectonic /tmp/test.tex --outdir /tmp
open /tmp/test.pdf
```

A PDF should open showing "Hello, Litheesh!" — Tectonic is working.

---

### Step 8 — Install DB Browser for SQLite

```bash
brew install --cask db-browser-for-sqlite
```

---

### Step 9 — Install Ollama (Local AI Using Your M4 Metal GPU)

Ollama runs AI models locally using your M4 built-in GPU. No NVIDIA, no CUDA needed — Apple Silicon uses Metal automatically.

```bash
brew install ollama
ollama --version
```

Start the Ollama service so it runs in the background:
```bash
brew services start ollama
```

Verify it is running:
```bash
curl http://localhost:11434
```

Should show: Ollama is running

---

### Step 10 — Download AI Models for Local Use

**Primary local model — Qwen2.5 14B (fits perfectly in 16GB M4 unified memory):**
```bash
ollama pull qwen2.5:14b
```

This is a 9GB download. Takes 10-30 minutes.

**Fast backup model — Llama 3.1 8B:**
```bash
ollama pull llama3.1:8b
```

This is a 4.7GB download. Takes 5-15 minutes.

Verify both downloaded:
```bash
ollama list
```

Test that AI works on your M4:
```bash
ollama run llama3.1:8b "Say hello in one sentence"
```

Should respond in 1-3 seconds using your M4 Metal GPU.

---

### Step 11 — Run the Project Setup Script

This script downloads PocketBase and creates all project subfolders:

```bash
bash ~/Downloads/Job_Application_Project/scripts/setup.sh
```

Should end with: Setup Complete!

---

### Step 12 — Open the Project in VS Code

```bash
code ~/Downloads/Job_Application_Project
```

---

### Step 13 — Mac Verification Checkpoint

```bash
echo "=============================="
echo "  Mac Installation Check"
echo "=============================="
echo -n "Homebrew:   " && brew --version | head -1
echo -n "Node.js:    " && node --version
echo -n "npm:        " && npm --version
echo -n "n8n:        " && n8n --version
echo -n "Git:        " && git --version
echo -n "Tectonic:   " && tectonic --version
echo -n "Ollama:     " && ollama --version
echo -n "PocketBase: " && ~/Downloads/Job_Application_Project/pocketbase/pocketbase --version
echo "=============================="
echo "  All tools ready!"
echo "=============================="
```

Every line must show a version number.

---

## PART B — GET FREE AI API KEYS

These take about 5 minutes each. No credit card needed — only an email address.

---

### Step 1 — Get Your Free Groq API Key

Groq gives you free access to Llama 3.3 70B. This is your primary AI for ATS checking and resume matching — much smarter than any model you can run locally.

**Free limits:** 14,400 requests/day on Llama 3.3 70B

1. Go to console.groq.com
2. Click Sign Up and use your buffalo.edu email
3. After login, click API Keys in the left sidebar
4. Click Create API Key and name it "job-tracker"
5. Copy the key — it starts with gsk_
6. Open your .env file: `code ~/Downloads/Job_Application_Project/.env`
7. Paste it as: GROQ_API_KEY=gsk_your_actual_key_here

Test it works:
```bash
curl -X POST https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer YOUR_GROQ_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{"model":"llama-3.3-70b-versatile","messages":[{"role":"user","content":"Say hello in one word"}]}'
```

Should return a JSON response with a greeting.

---

### Step 2 — Get Your Free Google Gemini API Key

Gemini 1.5 Flash is used for cover letter writing — it produces the most natural, human-sounding text.

**Free limits:** 1,500 requests/day

1. Go to aistudio.google.com
2. Sign in with your Google account
3. Click Get API Key in the top right
4. Click Create API Key
5. Copy the key — it starts with AIza
6. Add to .env as: GEMINI_API_KEY=AIza_your_actual_key_here

Test it works:
```bash
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_GEMINI_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Say hello in one word"}]}]}'
```

Should return a JSON response with a greeting.

---

### Step 3 — Fill In Your Complete .env File

```bash
code ~/Downloads/Job_Application_Project/.env
```

Fill in all values:

```
# AI API Keys (free — from Part B Steps 1 and 2)
GROQ_API_KEY=gsk_your_groq_key_here
GEMINI_API_KEY=AIza_your_gemini_key_here

# AI Models
GROQ_MODEL=llama-3.3-70b-versatile
GEMINI_MODEL=gemini-1.5-flash
OLLAMA_MODEL=qwen2.5:14b
OLLAMA_FAST_MODEL=llama3.1:8b

# Ollama local (runs on your M4)
OLLAMA_HOST=localhost
OLLAMA_PORT=11434

# PocketBase
POCKETBASE_HOST=localhost
POCKETBASE_PORT=8090
POCKETBASE_ADMIN_EMAIL=your@email.com
POCKETBASE_ADMIN_PASSWORD=your_password_here

# n8n
N8N_HOST=localhost
N8N_PORT=5678

# Gmail notifications
GMAIL_ADDRESS=your@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx

# Job site APIs (register free — fill in later)
ADZUNA_APP_ID=
ADZUNA_APP_KEY=
REMOTIVE_API_KEY=
THE_MUSE_API_KEY=
```

Save with Cmd + S.

---

## PART C — START ALL SERVICES

Every time you want to work on the project run one command:

```bash
bash ~/Downloads/Job_Application_Project/scripts/start.sh
```

This opens n8n in a new Terminal tab and opens it in your browser. Supabase is always online — nothing to start for the database.

```bash
# Check if everything is running
bash ~/Downloads/Job_Application_Project/scripts/check-status.sh

# Stop everything when done
bash ~/Downloads/Job_Application_Project/scripts/stop.sh
```

---

### First Time Only — n8n Account

1. Go to http://localhost:5678
2. Create a local account (email + password)
3. No email verification — stored only on your Mac

---

## PART D — FINAL SYSTEM CHECK

| Service | URL | What you should see |
|---|---|---|
| Supabase | https://supabase.com/dashboard | Your project + 8 tables in Table Editor |
| n8n | http://localhost:5678 | Workflow editor |
| Ollama | http://localhost:11434 | Ollama is running |
| Groq | Tested via curl above | JSON response |
| Gemini | Tested via curl above | JSON response |

---

## PART E — OPTIONAL: 24/7 Hosting with Oracle Cloud Free Tier

If you want n8n to keep running even when your Mac is closed, Oracle Cloud's always-free tier is the best option for students. Supabase is already always online — only n8n needs hosting.

**What you get — forever free, never expires:**
- 4 ARM cores + 24GB RAM — runs n8n + PocketBase with room to spare
- 200GB block storage
- No credit card for free tier

**Sign up:** oracle.com/cloud/free
Use your buffalo.edu email.

Full Oracle VM setup instructions will be in a separate optional guide. For now, running everything locally on your Mac is perfectly fine for development.

---

## Summary Table — Everything Installed

| Tool | Purpose | Start command |
|---|---|---|
| Homebrew | Package manager | Always available |
| Node.js v20 | Runs n8n | Always available |
| n8n | Workflow automation | Via start.sh |
| Supabase | Database + Admin UI | Always online at supabase.com |
| Ollama | Local AI on M4 Metal GPU | Auto via brew services |
| Qwen2.5 14B | Local AI model (9GB) | Via Ollama |
| Llama 3.1 8B | Fast local backup (4.7GB) | Via Ollama |
| Tectonic | LaTeX to PDF compiler | Always available |
| Git | Version control | Always available |
| VS Code | Code editor | code ~/Downloads/Job_Application_Project |
| DB Browser SQLite | (No longer needed — Supabase has built-in UI) | — |

## Free Cloud AI Accounts

| Service | Model | Daily Limit | Purpose |
|---|---|---|---|
| Groq | Llama 3.3 70B | 14,400 req/day | ATS check, resume matching |
| Google Gemini | Gemini 1.5 Flash | 1,500 req/day | Cover letter writing |

---

## Daily Commands Quick Reference

```bash
# Start n8n (Supabase is always online — nothing to start for DB)
bash ~/Downloads/Job_Application_Project/scripts/start.sh

# Check all services are running
bash ~/Downloads/Job_Application_Project/scripts/check-status.sh

# Stop everything
bash ~/Downloads/Job_Application_Project/scripts/stop.sh

# Open project in VS Code
code ~/Downloads/Job_Application_Project
```

---

## Troubleshooting

**n8n fails to install:**
```bash
sudo npm install -g n8n --unsafe-perm
```

**Ollama not running:**
```bash
brew services restart ollama
curl http://localhost:11434
```

**Groq API returns 401 Unauthorized:**
Your API key is wrong. Check it at console.groq.com and update .env.

**Gemini API returns 403 Forbidden:**
Your API key is wrong. Check it at aistudio.google.com and update .env.

**Local model slow on M4 Air:**
Switch to llama3.1:8b in .env — faster with minimal quality difference for simple tasks.

**Tectonic compile fails:**
```bash
rm -rf ~/.cache/Tectonic
tectonic /tmp/test.tex --outdir /tmp
```

---

*Phase 1 Complete — Next: Phase 2 (Supabase Database Schema Setup)*
