#!/bin/bash
# ============================================================
#  start.sh — Start n8n for Job Tracker Project
#  Supabase is always online — nothing to start for the DB.
# ============================================================

PROJECT_DIR="$HOME/Downloads/Job_Application_Project"

echo ""
echo "=============================="
echo "  Job Tracker — Starting Up"
echo "=============================="
echo ""

# Check n8n is installed
if ! command -v n8n &> /dev/null; then
  echo "ERROR: n8n not found. Install it with: npm install -g n8n"
  exit 1
fi

echo "Starting n8n on http://localhost:5678 ..."
osascript <<EOF
tell application "Terminal"
  do script "N8N_SECURE_COOKIE=false n8n start; exec bash"
end tell
EOF

sleep 3

echo ""
echo "=============================="
echo "  All services started!"
echo "=============================="
echo ""
echo "  n8n         →  http://localhost:5678"
echo "  Supabase    →  https://supabase.com/dashboard"
echo "  Ollama      →  http://localhost:11434"
echo ""
echo "Opening n8n in browser..."
open "http://localhost:5678"
echo ""
echo "To stop n8n: bash $PROJECT_DIR/scripts/stop.sh"
echo ""
