#!/bin/bash

echo "🚀 Setting up AI Linear Algebra Tutor for deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing dependencies..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install passport passport-google-oauth20 passport-apple express-session @types/passport @types/passport-google-oauth20 @types/express-session jsonwebtoken @types/jsonwebtoken

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd ../frontend
npm install @auth0/nextjs-auth0 react-google-login @types/react-google-login

# Go back to root
cd ..

echo "✅ Dependencies installed successfully!"

echo "📝 Creating environment files..."

# Create backend .env.example
cat > backend/.env.example << EOF
# Server Configuration
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback

# Apple Sign-In Configuration
APPLE_CLIENT_ID=your_apple_client_id_here
APPLE_TEAM_ID=your_apple_team_id_here
APPLE_KEY_ID=your_apple_key_id_here
APPLE_PRIVATE_KEY=your_apple_private_key_here
APPLE_CALLBACK_URL=http://localhost:5001/api/auth/apple/callback
EOF

# Create frontend .env.example
cat > frontend/.env.example << EOF
# Backend API URL
VITE_BACKEND_URL=http://localhost:5001

# For production, replace with your deployed backend URL
# VITE_BACKEND_URL=https://your-backend-url.onrender.com
EOF

echo "✅ Environment files created!"

echo "🔧 Building the application..."

# Build frontend
echo "Building frontend..."
cd frontend
npm run build
cd ..

# Build backend
echo "Building backend..."
cd backend
npm run build
cd ..

echo "✅ Build completed successfully!"

echo "📋 Next steps:"
echo "1. Copy backend/.env.example to backend/.env and fill in your values"
echo "2. Copy frontend/.env.example to frontend/.env and fill in your values"
echo "3. Set up Google OAuth and Apple Sign-In (see DEPLOYMENT_GUIDE.md)"
echo "4. Deploy backend to Render (see DEPLOYMENT_GUIDE.md)"
echo "5. Deploy frontend to Vercel (see DEPLOYMENT_GUIDE.md)"
echo "6. Update OAuth redirect URLs with your production domains"

echo "🎉 Setup complete! Check DEPLOYMENT_GUIDE.md for detailed instructions."
