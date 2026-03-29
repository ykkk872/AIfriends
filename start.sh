#!/bin/bash

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

source "$PROJECT_DIR/.venv/bin/activate"

echo "🚀 Starting backend (Django) ..."
cd "$PROJECT_DIR/backend"
python manage.py runserver &
BACKEND_PID=$!

echo "🚀 Starting frontend (Vite) ..."
cd "$PROJECT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Backend:  http://127.0.0.1:8000/"
echo "✅ Frontend: http://localhost:5173/"
echo ""
echo "Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo ''; echo 'Stopped.'; exit 0" INT TERM

wait
