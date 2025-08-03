#!/bin/bash
# Vesturo Production Startup Script

echo "🌟 Starting Vesturo Fashion Platform..."

# Check if .env exists
if [ ! -f backend/.env ]; then
    echo "❌ Environment file not found!"
    echo "💡 Run: node setup-production.js"
    exit 1
fi

# Start the application
echo "🚀 Starting backend server..."
cd backend && npm start
