#!/bin/bash

# Start only the SAVE (Sovereign Asset Valuation Engine) frontend (React + Vite)

# Default port
SAVE_FRONTEND_PORT=${SAVE_FRONTEND_PORT:-22225}

echo "Starting SAVE Frontend"
echo "Port: $SAVE_FRONTEND_PORT"
echo "URL: http://localhost:$SAVE_FRONTEND_PORT"
echo ""

# Function to kill frontend on exit
cleanup() {
    echo ""
    echo "Shutting down frontend server..."
    exit
}
trap cleanup EXIT

# Check if port is available
if lsof -Pi :$SAVE_FRONTEND_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "Port $SAVE_FRONTEND_PORT is already in use"
    echo "Current processes on port $SAVE_FRONTEND_PORT:"
    lsof -Pi :$SAVE_FRONTEND_PORT -sTCP:LISTEN
    echo ""
    read -p "Kill existing processes? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Killing processes on port $SAVE_FRONTEND_PORT..."
        kill -9 $(lsof -Pi :$SAVE_FRONTEND_PORT -sTCP:LISTEN -t) 2>/dev/null
        sleep 2
        echo "Port cleared"
    else
        echo "Cannot start - port is busy"
        exit 1
    fi
fi

echo "Starting Vite dev server..."
echo ""

# Change to frontend directory
cd "$(dirname "$0")/frontend" || exit 1

# Run frontend in foreground with specified port
npm run dev -- --port $SAVE_FRONTEND_PORT

echo ""
echo "Frontend stopped"
