#!/bin/bash
# ============================================================
#  setup.sh — First-time project setup
#  Creates all folders and sets up .env template
#  Database: Supabase (cloud) — nothing to download
# ============================================================

PROJECT_DIR="$HOME/Downloads/Job_Application_Project"

echo ""
echo "=============================="
echo "  Job Tracker — First-Time Setup"
echo "=============================="
echo ""

# ── 1. Create folder structure ──────────────────────────────
echo "Creating project folders..."
mkdir -p "$PROJECT_DIR/scripts"
mkdir -p "$PROJECT_DIR/frontend/css"
mkdir -p "$PROJECT_DIR/frontend/js"
mkdir -p "$PROJECT_DIR/n8n-workflows"
mkdir -p "$PROJECT_DIR/latex-templates"
mkdir -p "$PROJECT_DIR/compiled-resumes"
mkdir -p "$PROJECT_DIR/data"
mkdir -p "$PROJECT_DIR/docs"
echo "  Folders created."

# ── 2. Create .env file if missing ──────────────────────────
ENV_FILE="$PROJECT_DIR/.env"

if [ -f "$ENV_FILE" ]; then
  echo "  .env file already exists — skipping."
else
  echo "Creating .env file..."
  cat > "$ENV_FILE" <<'ENVEOF'
# ============================================================
#  Job Application Automation Suite — Configuration
#  Fill in your keys below. Never share or commit this file.
# ============================================================

# --- Supabase (Database — online, always running) ---
# Get these from: supabase.com → Your Project → Settings → API Keys
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here

# --- AI API Keys (free) ---
GROQ_API_KEY=gsk_your_groq_key_here
GEMINI_API_KEY=AIza_your_gemini_key_here
HUNTER_API_KEY=your_hunter_io_key_here
APOLLO_API_KEY=your_apollo_io_key_here

# --- AI Models ---
GROQ_MODEL=llama-3.3-70b-versatile
GEMINI_MODEL=gemini-1.5-flash
OLLAMA_MODEL=qwen2.5:14b
OLLAMA_FAST_MODEL=llama3.1:8b

# --- Ollama local (runs on your M4) ---
OLLAMA_HOST=localhost
OLLAMA_PORT=11434

# --- n8n ---
N8N_HOST=localhost
N8N_PORT=5678
N8N_SECURE_COOKIE=false

# --- Gmail ---
GMAIL_ADDRESS=your@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx

# --- Job Site APIs (free — fill in later) ---
ADZUNA_APP_ID=
ADZUNA_APP_KEY=
REMOTIVE_API_KEY=
THE_MUSE_API_KEY=

# --- Paths ---
PROJECT_ROOT=~/Downloads/Job_Application_Project
COMPILED_RESUMES_DIR=~/Downloads/Job_Application_Project/compiled-resumes
LATEX_TEMPLATES_DIR=~/Downloads/Job_Application_Project/latex-templates
ENVEOF
  echo "  .env file created. Open and fill in your API keys."
fi

# ── 3. Create .gitignore if missing ─────────────────────────
GITIGNORE="$PROJECT_DIR/.gitignore"
if [ ! -f "$GITIGNORE" ]; then
  cat > "$GITIGNORE" <<'GIEOF'
# API keys and secrets — never commit
.env

# Compiled PDF resumes
compiled-resumes/*.pdf

# macOS system files
.DS_Store
**/.DS_Store

# Node modules
node_modules/

# Tectonic cache
.tectonic/

# Temp files
*.tmp
*.log
*.zip
GIEOF
  echo "  .gitignore created."
fi

echo ""
echo "=============================="
echo "  Setup Complete!"
echo "=============================="
echo ""
echo "  Next steps:"
echo "  1. Sign up at supabase.com and run scripts/setup-supabase.sql"
echo "  2. Fill in your API keys: code $ENV_FILE"
echo "  3. Start the project:     bash $PROJECT_DIR/scripts/start.sh"
echo ""
