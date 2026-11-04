#!/bin/bash
# ============================================================
#  stop.sh — Stop n8n
#  (Supabase is cloud-hosted — nothing to stop there)
# ============================================================

echo ""
echo "=============================="
echo "  Stopping all services..."
echo "=============================="
echo ""

# Kill n8n
if pgrep -f "n8n" > /dev/null; then
  pkill -f "n8n"
  echo "  n8n stopped."
else
  echo "  n8n was not running."
fi

echo ""
echo "  Done. Supabase stays online in the cloud."
echo ""
