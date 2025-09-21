#!/bin/bash

# Navigate to project directory
cd /Users/afsanaawal006/ai-linear-algebra-tutor

# Initialize git if not already done
if [ ! -d ".git" ]; then
    git init
fi

# Add remote if not already added
if ! git remote get-url origin >/dev/null 2>&1; then
    git remote add origin https://github.com/aiwithafsana/ai-linear-algebra-tutor.git
fi

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: AI Linear Algebra Tutor with authentication system, progress tracking, and enhanced UI"

# Push to GitHub
git push -u origin main

echo "Code pushed to GitHub successfully!"
echo "Repository: https://github.com/aiwithafsana/ai-linear-algebra-tutor"