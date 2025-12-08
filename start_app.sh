#!/bin/bash
echo "Starting AI Study Planner..."

# Start Server in background
cd server
npm start &
SERVER_PID=$!
echo "Server started with PID $SERVER_PID"

# Start Client
cd ../client
npm run dev &
CLIENT_PID=$!
echo "Client started with PID $CLIENT_PID"

# Trap cleanup
trap "kill $SERVER_PID $CLIENT_PID" EXIT

# Wait
wait
