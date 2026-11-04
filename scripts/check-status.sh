#!/bin/bash
# ============================================================
#  check-status.sh — Check if all services are running
# ============================================================

PROJECT_DIR="$HOME/Downloads/Job_Application_Project"
ENV_FILE="$PROJECT_DIR/.env"

echo ""
echo "=============================="
echo "  Service Status Check"
echo "=============================="
echo ""

# n8n
if pgrep -f "n8n" > /dev/null; then
  echo "  n8n         ✅  Running  →  http://localhost:5678"
else
  echo "  n8n         ❌  NOT running  (start with: bash $PROJECT_DIR/scripts/start.sh)"
fi

# Ollama
if curl -s http://localhost:11434 | grep -q "Ollama"; then
  echo "  Ollama      ✅  Running  →  http://localhost:11434"
else
  echo "  Ollama      ❌  NOT running  (start with: brew services start ollama)"
fi

# Supabase — check using the URL from .env
if [ -f "$ENV_FILE" ]; then
  SUPABASE_URL=$(grep '^SUPABASE_URL=' "$ENV_FILE" | cut -d'=' -f2)
  if [ -n "$SUPABASE_URL" ] && [ "$SUPABASE_URL" != "https://your-project-ref.supabase.co" ]; then
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SUPABASE_URL/rest/v1/" \
      -H "apikey: $(grep '^SUPABASE_ANON_KEY=' "$ENV_FILE" | cut -d'=' -f2)")
    if [ "$STATUS" = "200" ] || [ "$STATUS" = "401" ]; then
      echo "  Supabase    ✅  Reachable  →  $SUPABASE_URL"
    else
      echo "  Supabase    ❌  Not reachable (check your internet connection)"
    fi
  else
    echo "  Supabase    ⚠️   URL not set in .env yet"
  fi
fi

echo ""
echo "  Installed Ollama models:"
ollama list 2>/dev/null || echo "  (Ollama not reachable)"

echo ""
echo "=============================="
echo ""
