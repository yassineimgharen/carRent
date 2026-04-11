# Render Deployment Guide

## Prerequisites
- GitHub account
- Render account (you just signed up ✅)

## Step 1: Push to GitHub

1. Create a new repository on GitHub (name it `sihabi-cars`)
2. Push your code:
```bash
cd /goinfre/yaimghar/wheelie-happy-car
git init
git add .
git commit -m "Initial commit - ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sihabi-cars.git
git push -u origin main
```

## Step 2: Deploy on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository `sihabi-cars`
4. Configure:
   - **Name**: `sihabi-cars`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server/index.js`
   - **Instance Type**: `Free`

## Step 3: Add Environment Variables

In Render dashboard, go to **Environment** tab and add:

```
NODE_ENV=production
JWT_SECRET=your_jwt_secret_from_env_file
ADMIN_EMAIL=admin@sihabi.com
ADMIN_PASSWORD=Sihabi@Cars2024!
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
FRONTEND_URL=https://sihabi-cars.onrender.com
```

**Important**: Replace `FRONTEND_URL` with your actual Render URL after deployment (it will be shown after first deploy)

## Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for build to complete
3. Your site will be live at: `https://sihabi-cars.onrender.com`

## Step 5: Update FRONTEND_URL

1. After first deployment, copy your Render URL
2. Go to **Environment** tab
3. Update `FRONTEND_URL` to your actual URL
4. Click **"Save Changes"** (will trigger redeploy)

## Important Notes

- **Free tier sleeps after 15min inactivity** - first visit takes ~30 seconds to wake up
- **Database persists** - SQLite file is stored on Render's disk
- **Uploads folder** - Car images will be stored on Render (may be lost on redeploy, consider using cloud storage later)
- **Custom domain** - You can add your own domain in Render settings

## Testing

After deployment:
1. Visit your site on mobile
2. Login as admin: `admin@sihabi.com` / `Sihabi@Cars2024!`
3. Add your first car from admin dashboard
4. Test booking flow
5. Share link with friends!

## Troubleshooting

- **Build fails**: Check logs in Render dashboard
- **Site not loading**: Check environment variables are set correctly
- **Email not working**: Verify SMTP credentials
- **Database empty**: First deployment creates fresh database with only admin account
