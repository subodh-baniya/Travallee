# Admin Frontend - Deployment Guide

## Local Docker Development

### Build and Run
```bash
# Build the Docker image
docker build -f Admin-Frontend/Dockerfile -t admin-frontend .

# Run standalone
docker run -p 3000:3000 admin-frontend

# Or use docker-compose (runs with full backend)
docker compose up admin-frontend
```

---

## Vercel Deployment (Recommended for Serverless)

### Method 1: Direct Git Push (Easiest)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Import the project

3. **Configure Build Settings**
   - **Framework**: Vite
   - **Root Directory**: `./Admin-Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables** (in Vercel Dashboard)
   ```
   VITE_API_BASE_URL=https://your-backend-api.com
   ```

5. **Deploy** - Click "Deploy" button

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd Admin-Frontend
vercel --prod
```

---

## Environment Variables

Create `.env.local` file in Admin-Frontend:

```env
VITE_API_BASE_URL=http://localhost:4001  # Development
VITE_API_BASE_URL=https://api.example.com # Production
```

> **Note**: Prefix all env vars with `VITE_` for them to be available in browser code

---

## Docker for Other Platforms (Railway, Render, etc.)

If deploying Docker to Railway/Render instead:

```bash
# Build
docker build -f Admin-Frontend/Dockerfile -t admin-frontend:latest .

# Push to container registry
docker tag admin-frontend:latest your-registry/admin-frontend:latest
docker push your-registry/admin-frontend:latest
```

---

## Vercel vs Docker Summary

| Aspect | Vercel | Docker |
|--------|--------|--------|
| Setup | 5 minutes | 2 minutes |
| Cost | Free tier available | Varies by platform |
| Scaling | Automatic | Manual/Auto depends on platform |
| Best for | React/Next.js apps | Custom environments |
| **Recommended** | ✅ Yes | ❌ Overkill for this |

---

## Troubleshooting

**Issue**: Build fails on Vercel
- Check that root directory is set to `./Admin-Frontend`
- Verify `package.json` exists in that directory

**Issue**: API calls fail in production
- Update `VITE_API_BASE_URL` to your actual backend URL
- Ensure backend CORS allows your Vercel domain

**Issue**: Assets not loading
- Check that `vite.config.ts` has correct `base` path
- Run `npm run build` locally to verify

