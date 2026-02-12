#!/bin/bash

# Start only the SAVE (Sovereign Asset Valuation Engine) backend server

# Default port
SAVE_BACKEND_PORT=${SAVE_BACKEND_PORT:-22224}

echo "Starting SAVE Backend Server"
echo "Port: $SAVE_BACKEND_PORT"
echo "API Docs will be at: http://localhost:$SAVE_BACKEND_PORT/docs"
echo ""

# Function to kill backend on exit
cleanup() {
    echo ""
    echo "Shutting down backend server..."
    exit
}
trap cleanup EXIT

# Check if port is available
if lsof -Pi :$SAVE_BACKEND_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Port $SAVE_BACKEND_PORT is already in use"
    echo "Current processes on port $SAVE_BACKEND_PORT:"
    lsof -Pi :$SAVE_BACKEND_PORT -sTCP:LISTEN
    echo ""
    read -p "Kill existing processes? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Killing processes on port $SAVE_BACKEND_PORT..."
        kill -9 $(lsof -Pi :$SAVE_BACKEND_PORT -sTCP:LISTEN -t) 2>/dev/null
        sleep 2
        echo "Port cleared"
    else
        echo "Cannot start - port is busy"
        exit 1
    fi
fi

echo "Starting FastAPI backend..."
echo ""

# Change to project directory
cd "$(dirname "$0")/backend" || exit 1

# Run backend in foreground
python3 -m uvicorn main:app --host 0.0.0.0 --port $SAVE_BACKEND_PORT --reload

echo ""
echo "Backend stopped"
