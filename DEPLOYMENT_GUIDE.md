# 🚀 Complete Deployment Guide for AI Linear Algebra Tutor

## Prerequisites
- GitHub account
- Vercel account (free)
- Render account (free)
- OpenAI API key with sufficient credits
- Google Cloud Console account (for Google OAuth)
- Apple Developer account (for Apple Sign-In)

---

## Part 1: Set Up Authentication (Google & Apple)

### Step 1.1: Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API and Google OAuth2 API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:5173/auth/google/callback` (for development)
   - `https://your-app.vercel.app/auth/google/callback` (for production)
7. Copy the Client ID and Client Secret

### Step 1.2: Apple Sign-In Setup
1. Go to [Apple Developer Console](https://developer.apple.com/)
2. Create a new App ID with "Sign In with Apple" capability
3. Create a Services ID for web authentication
4. Configure the Services ID with your domain
5. Download the private key and note the Key ID and Team ID

---

## Part 2: Prepare the Codebase

### Step 2.1: Create Environment Files

**Backend (.env):**
```env
# Server Configuration
PORT=5001
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/api/auth/google/callback

# Apple Sign-In Configuration
APPLE_CLIENT_ID=your_apple_client_id_here
APPLE_TEAM_ID=your_apple_team_id_here
APPLE_KEY_ID=your_apple_key_id_here
APPLE_PRIVATE_KEY=your_apple_private_key_here
APPLE_CALLBACK_URL=https://your-backend.onrender.com/api/auth/apple/callback
```

**Frontend (.env):**
```env
# Backend API URL
VITE_BACKEND_URL=https://your-backend.onrender.com
```

### Step 2.2: Install Dependencies
```bash
# Backend dependencies
cd backend
npm install passport passport-google-oauth20 passport-apple express-session @types/passport @types/passport-google-oauth20 @types/express-session jsonwebtoken @types/jsonwebtoken

# Frontend dependencies
cd ../frontend
npm install @auth0/nextjs-auth0 react-google-login @types/react-google-login
```

---

## Part 3: Deploy Backend to Render

### Step 3.1: Prepare Backend for Deployment
1. Create a `render.yaml` file in the backend directory (already created)
2. Update `package.json` scripts for production
3. Ensure all environment variables are set

### Step 3.2: Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `ai-linear-algebra-tutor-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: `Node`
5. Add environment variables from your `.env` file
6. Click "Create Web Service"
7. Wait for deployment to complete
8. Note the deployed URL (e.g., `https://ai-linear-algebra-tutor-backend.onrender.com`)

---

## Part 4: Deploy Frontend to Vercel

### Step 4.1: Prepare Frontend for Deployment
1. Update `vercel.json` configuration (already created)
2. Set environment variables in Vercel dashboard

### Step 4.2: Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables:
   - `VITE_BACKEND_URL`: Your Render backend URL
6. Click "Deploy"
7. Wait for deployment to complete
8. Note the deployed URL (e.g., `https://ai-linear-algebra-tutor.vercel.app`)

---

## Part 5: Update OAuth Redirect URLs

### Step 5.1: Update Google OAuth
1. Go back to Google Cloud Console
2. Edit your OAuth 2.0 Client ID
3. Add your production frontend URL to authorized redirect URIs:
   - `https://your-app.vercel.app/auth/google/callback`
4. Save changes

### Step 5.2: Update Apple Sign-In
1. Go to Apple Developer Console
2. Update your Services ID configuration
3. Add your production domain to the configuration
4. Save changes

---

## Part 6: Test the Deployment

### Step 6.1: Test Authentication
1. Visit your deployed frontend URL
2. Click "Continue with Google" or "Continue with Apple"
3. Complete the OAuth flow
4. Verify you're redirected back to the app and logged in

### Step 6.2: Test Core Features
1. Test the whiteboard functionality
2. Test voice chat
3. Test curriculum navigation
4. Test problem solving
5. Test progress tracking

---

## Part 7: Domain Setup (Optional)

### Step 7.1: Custom Domain for Frontend
1. In Vercel dashboard, go to your project settings
2. Add your custom domain
3. Update DNS records as instructed
4. Update OAuth redirect URLs with your custom domain

### Step 7.2: Custom Domain for Backend
1. In Render dashboard, go to your service settings
2. Add your custom domain
3. Update DNS records as instructed
4. Update OAuth redirect URLs with your custom domain

---

## Troubleshooting

### Common Issues:
1. **CORS errors**: Check that `FRONTEND_URL` in backend matches your frontend domain
2. **OAuth redirect errors**: Verify redirect URLs in OAuth providers match your domains
3. **Environment variables**: Ensure all required environment variables are set in production
4. **Build failures**: Check that all dependencies are properly installed and TypeScript compiles

### Debug Steps:
1. Check Render logs for backend issues
2. Check Vercel function logs for frontend issues
3. Use browser developer tools to debug client-side issues
4. Test API endpoints directly using curl or Postman

---

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **JWT Secrets**: Use strong, random secrets for JWT and session secrets
3. **HTTPS**: Ensure all production URLs use HTTPS
4. **CORS**: Configure CORS properly for production domains only
5. **Rate Limiting**: Consider implementing rate limiting for API endpoints

---

## Monitoring and Maintenance

1. **Health Checks**: Monitor your backend health endpoint
2. **Logs**: Regularly check application logs for errors
3. **Updates**: Keep dependencies updated for security patches
4. **Backups**: Consider implementing database backups if you add persistent storage
5. **Performance**: Monitor response times and optimize as needed

---

## Cost Optimization

1. **Render Free Tier**: Be aware of Render's free tier limitations
2. **Vercel Free Tier**: Monitor Vercel's free tier usage
3. **OpenAI API**: Monitor API usage and costs
4. **CDN**: Consider using a CDN for static assets

---

## Next Steps

1. Set up monitoring and alerting
2. Implement user analytics
3. Add more authentication providers
4. Implement user profiles and settings
5. Add more advanced features like collaborative whiteboards
6. Consider implementing a database for persistent data storage
