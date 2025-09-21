#!/bin/bash

echo "🚀 Starting AI Linear Algebra Tutor..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm 8+ first."
    exit 1
fi

echo "✅ Node.js and npm are installed"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ] || [ ! -d "frontend/node_modules" ] || [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install:all
    echo ""
fi

echo "🎯 Starting development servers..."
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo "   Health:   http://localhost:5000/api/health"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start both servers
npm run dev