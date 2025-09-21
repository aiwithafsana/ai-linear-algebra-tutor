#!/bin/bash

echo "🔑 OpenAI API Key Setup for AI Linear Algebra Tutor"
echo "=================================================="
echo ""

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "❌ .env file not found in backend directory"
    exit 1
fi

echo "📝 Please enter your OpenAI API key:"
echo "   (You can get one from: https://platform.openai.com/account/api-keys)"
echo ""
read -p "API Key: " api_key

# Validate API key format (basic check)
if [ ${#api_key} -lt 20 ]; then
    echo "❌ Invalid API key format. Please enter a valid OpenAI API key."
    exit 1
fi

# Update the .env file
sed -i '' "s/OPENAI_API_KEY=your_openai_api_key_here/OPENAI_API_KEY=$api_key/" backend/.env

echo ""
echo "✅ API key updated successfully!"
echo ""
echo "🚀 You can now start the application with:"
echo "   npm run dev"
echo ""
echo "🔍 To verify the setup, you can test the health endpoint:"
echo "   curl http://localhost:5001/api/ask/health"
echo ""
