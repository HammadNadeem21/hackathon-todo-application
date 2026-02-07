#!/bin/bash

# Start the Todo Application

echo "Starting the Todo Application..."

# Start the backend server in the background
echo "Starting backend server..."
cd /home/hammad/GitHub/hackathon-todo-application/backend
python -m uvicorn src.main:app --reload --port 8000 > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID $BACKEND_PID"

# Give backend a moment to start
sleep 3

# Check if backend started successfully
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "Error: Backend failed to start. Check backend.log for details."
    exit 1
fi

echo "Backend is running on http://127.0.0.1:8000"

# Start the frontend server
echo "Starting frontend server..."
cd /home/hammad/GitHub/hackathon-todo-application/frontend
npm run dev > frontend.log 2>&1

# Kill backend when script exits
trap "kill $BACKEND_PID 2>/dev/null" EXIT