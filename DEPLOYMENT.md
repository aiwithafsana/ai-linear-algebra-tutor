# 🚀 Deployment Guide - AI Linear Algebra Tutor

## 📋 **Prerequisites**

- GitHub account
- Vercel account (free tier available)
- Render account (free tier available)
- OpenAI API key

## 🎯 **Quick Deployment (5 minutes)**

### **1. Frontend Deployment (Vercel)**

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add polished UI and deployment configs"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` folder as root directory
   - Vercel will automatically detect the Vite configuration
   - Deploy!

3. **Environment Variables** (if needed):
   - `VITE_API_URL`: Your backend URL (will be set after backend deployment)

### **2. Backend Deployment (Render)**

1. **Prepare Backend**:
   ```bash
   cd backend
   npm run build
   ```

2. **Deploy to Render**:
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder
   - Use these settings:
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Environment**: `Node`

3. **Set Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `FRONTEND_URL`: `https://your-frontend-url.vercel.app`
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `OPENAI_MODEL`: `gpt-3.5-turbo`
   - `OPENAI_MAX_TOKENS`: `1500`
   - `OPENAI_TEMPERATURE`: `0.7`

4. **Deploy**: Click "Create Web Service"

### **3. Update Frontend URL**

1. **Get Backend URL**: Copy the Render service URL
2. **Update Vercel Environment**:
   - Go to your Vercel project settings
   - Add environment variable: `VITE_API_URL` = `https://your-backend-url.onrender.com`
   - Redeploy the frontend

## 🔧 **Alternative: Heroku Deployment**

### **Backend on Heroku**

1. **Install Heroku CLI**:
   ```bash
   # macOS
   brew install heroku/brew/heroku
   
   # Or download from heroku.com
   ```

2. **Create Heroku App**:
   ```bash
   cd backend
   heroku create ai-linear-algebra-tutor-backend
   ```

3. **Set Environment Variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=https://your-frontend-url.vercel.app
   heroku config:set OPENAI_API_KEY=your_openai_api_key_here
   heroku config:set OPENAI_MODEL=gpt-3.5-turbo
   ```

4. **Deploy**:
   ```bash
   git subtree push --prefix backend heroku main
   ```

## 🌐 **Custom Domain Setup**

### **Vercel (Frontend)**
1. Go to project settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate is automatically provisioned

### **Render (Backend)**
1. Go to service settings → Custom Domains
2. Add your custom domain
3. Update DNS records
4. SSL certificate is automatically provisioned

## 🔒 **Security Considerations**

### **Environment Variables**
- Never commit API keys to Git
- Use environment variables for all sensitive data
- Rotate API keys regularly

### **CORS Configuration**
- Backend is configured to allow requests from Vercel domains
- Update `FRONTEND_URL` if using custom domain

### **Rate Limiting**
- Backend includes rate limiting (10 requests/minute)
- Adjust in environment variables if needed

## 📊 **Monitoring & Analytics**

### **Vercel Analytics**
- Built-in performance monitoring
- Real-time analytics dashboard
- Error tracking and logging

### **Render Monitoring**
- Built-in uptime monitoring
- Performance metrics
- Log aggregation

### **Custom Monitoring**
- Add Google Analytics to frontend
- Implement error tracking (Sentry)
- Set up uptime monitoring (UptimeRobot)

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Build Failures**:
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   - Check build logs for specific errors

2. **API Connection Issues**:
   - Verify CORS settings
   - Check environment variables
   - Ensure backend is running

3. **Voice Features Not Working**:
   - Requires HTTPS (automatically provided by Vercel/Render)
   - Check browser permissions
   - Test in different browsers

### **Debug Steps**

1. **Check Logs**:
   - Vercel: Project → Functions → View Logs
   - Render: Service → Logs

2. **Test Locally**:
   ```bash
   # Frontend
   cd frontend && npm run dev
   
   # Backend
   cd backend && npm run dev
   ```

3. **Verify Environment Variables**:
   - Check all required variables are set
   - Verify API keys are valid
   - Test API endpoints directly

## 📈 **Scaling Considerations**

### **Free Tier Limits**
- **Vercel**: 100GB bandwidth/month
- **Render**: 750 hours/month
- **OpenAI**: Based on usage

### **Upgrade Path**
- **Vercel Pro**: $20/month for more bandwidth
- **Render Paid**: $7/month for always-on service
- **OpenAI**: Pay-per-use scaling

### **Performance Optimization**
- Enable Vercel's Edge Functions
- Use CDN for static assets
- Implement caching strategies
- Optimize images and assets

## 🎯 **Production Checklist**

- [ ] All environment variables set
- [ ] HTTPS enabled (automatic)
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Error handling implemented
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Documentation updated
- [ ] Team access configured
- [ ] Security review completed

## 📞 **Support**

### **Vercel Support**
- Documentation: [vercel.com/docs](https://vercel.com/docs)
- Community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

### **Render Support**
- Documentation: [render.com/docs](https://render.com/docs)
- Community: [community.render.com](https://community.render.com)

### **OpenAI Support**
- Documentation: [platform.openai.com/docs](https://platform.openai.com/docs)
- Support: [help.openai.com](https://help.openai.com)

---

**🎉 Congratulations! Your AI Linear Algebra Tutor is now live and ready to help students learn!**
