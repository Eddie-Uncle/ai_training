# Railway Deployment Instructions

## Quick Start (Recommended)

### Backend Deployment Helper
```bash
cd /Users/eagle/code/ai_training/labs/lab01-vibe-coding-intro/backend
./deploy.sh
```

This script will:
- ✅ Verify you're in the correct directory
- ✅ Check all required files exist
- ✅ Deploy to Railway

---

## Problem Fixed
The deployment was failing because Railway was detecting the project from the parent directory and trying to use Python for the Node.js frontend. Additionally, the nixpacks configuration wasn't properly setting up pip.

**Key fixes applied:**
1. Created `Procfile` for simpler Python deployment
2. Added proper `railway.toml` and `nixpacks.toml` for both services
3. **CRITICAL**: You must deploy from within the `backend` or `frontend` directory, NOT from the parent directory

## Deploy as Separate Services

### IMPORTANT: Directory Location
When deploying, make sure you are IN the specific service directory:
- For backend: `cd backend` then deploy
- For frontend: `cd frontend` then deploy

**DO NOT deploy from the lab01-vibe-coding-intro parent directory!**

### Option 1: Deploy Both on Railway

#### Step 1: Deploy Backend

```bash
# IMPORTANT: Navigate to the backend directory first!
cd /Users/eagle/code/ai_training/labs/lab01-vibe-coding-intro/backend

# Verify you're in the right directory (should see main.py and requirements.txt)
ls -la

# Install Railway CLI if not already installed
npm i -g @railway/cli

# Login to Railway
railway login

# Initialize new Railway project for backend
railway init

# Deploy the backend
railway up

# Get the backend URL
railway status
# Copy the URL (e.g., https://url-shortener-backend-production.up.railway.app)
```

**Common Issues:**
- If Railway says "pip: command not found", you're likely deploying from the wrong directory
- Make sure you see `main.py` and `requirements.txt` when you run `ls`

#### Step 2: Deploy Frontend

```bash
# IMPORTANT: Navigate to the frontend directory first!
cd /Users/eagle/code/ai_training/labs/lab01-vibe-coding-intro/frontend

# Verify you're in the right directory (should see package.json and next.config.js)
ls -la

# Create a .env.production file with the backend URL
echo "NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app" > .env.production

# Initialize new Railway project for frontend
railway init

# Deploy the frontend
railway up

# Get the frontend URL
railway status
```

**Common Issues:**
- If Railway tries to use Python, you're likely in the wrong directory
- Make sure you see `package.json` and `next.config.js` when you run `ls`

### Option 2: Backend on Railway, Frontend on Vercel (Recommended)

#### Step 1: Deploy Backend on Railway

```bash
# IMPORTANT: Navigate to the backend directory first!
cd /Users/eagle/code/ai_training/labs/lab01-vibe-coding-intro/backend

# Verify you're in the right directory
ls -la

# Install Railway CLI if not already installed
npm i -g @railway/cli

# Login to Railway
railway login

# Initialize and deploy
railway init
railway up

# Get the backend URL
railway status
# Copy the URL for frontend configuration
```

##IMPORTANT: Navigate to the frontend directory first!
cd /Users/eagle/code/ai_training/labs/lab01-vibe-coding-intro/frontend

# Verify you're in the right directory
ls -la
```bash
# Navigate to frontend directory
cd ../frontend

# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# When prompted:
# - Set up and deploy? Yes
# - Which scope? (Select your account)
# - Link to existing project? No
# - What's your project's name? url-shortener-frontend
# - In which directory is your code located? ./
# - Want to override settings? No

# Set environment variable for backend URL
vercel env add NEXT_PUBLIC_API_URL production
# Enter your Railway backend URL when prompted
```

## Environment Variables

### Backend (Railway)
No additional environment variables required for basic setup.

Optional:
- `DATABASE_URL`: Path to SQLite database (default: `./urls.db`)

### Frontend (Railway or Vercel)
Required:
- `NEXT_PUBLIC_API_URL`: Your backend URL from Railway

Example:
```
NEXT_PUBLIC_API_URL=https://url-shortener-backend-production.up.railway.app
```

## Configuration Files Created

### Backend
- `Procfile`: Defines the start command (Railway uses this)
- `railway.toml`: Railway deployment configuration
- ~~`nixpacks.toml`~~: Removed to let Railway auto-detect Python

### Frontend
- `railway.toml`: Railway deployment configuration
- `nixpacks.toml`: Build configuration for Node.js

## Verify Deployment

1. **Test Backend**: Visit `https://your-backend-url.railway.app/docs`
2. **Test Frontend**: Visit `https://your-frontend-url.vercel.app` or `https://your-frontend-url.railway.app`

## Troubleshooting

### Error: "pip: command not found" or "bash: line 1: pip: command not found"

**This means you're deploying from the wrong directory!**

Solution:
```bash
# Check your current directory
pwd

# You should be IN the backend directory:
# /Users/eagle/code/ai_training/labs/lab01-vibe-coding-intro/backend

# If not, navigate there:
cd /Users/eagle/code/ai_training/labs/lab01-vibe-coding-intro/backend

# Verify you see the right files:
ls -la
# Should show: main.py, requirements.txt, Procfile, railway.toml

# Now deploy:
railway up
```

### Frontend still detecting Python
- Make sure you're deploying from the `frontend` directory, not the parent directory
- The `railway.toml` and `nixpacks.toml` files should be in the `frontend` directory

### Backend not starting
- Check that `main.py` exists in the `backend` directory
- Verify all dependencies in `requirements.txt` are correct
- Check Railway logs: `railway logs`

### Frontend can't connect to backend
- Verify `NEXT_PUBLIC_API_URL` environment variable is set correctly
- Make sure the backend URL includes `https://` and has no trailing slash
- Check CORS settings in backend if requests are being blocked

## Redeploy

After making changes:

```bash
# For Railway
railway up

# For Vercel
vercel --prod
```
