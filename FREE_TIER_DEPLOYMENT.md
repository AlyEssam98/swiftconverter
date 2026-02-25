# Free Tier Deployment Guide

Complete step-by-step guide to deploy SWIFT MT-MX SaaS on free tier services: **Vercel** (frontend), **Render** (backend), and **Supabase** (database). Total cost: **$0/month**.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Supabase Database Setup](#step-1-supabase-database-setup)
3. [Step 2: GitHub Repository](#step-2-github-repository)
4. [Step 3: Vercel Frontend Deployment](#step-3-vercel-frontend-deployment)
5. [Step 4: Render Backend Deployment](#step-4-render-backend-deployment)
6. [Step 5: Verification & Testing](#step-5-verification--testing)
7. [Environment Variables Reference](#environment-variables-reference)
8. [Troubleshooting](#troubleshooting)
9. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

Before starting, you'll need:

- **GitHub Account** (Free) - Code repository at https://github.com/AlyEssam98/swiftconverter
- **Vercel Account** (Free) - Sign up at https://vercel.com with GitHub
- **Render Account** (Free) - Sign up at https://render.com with GitHub
- **Supabase Account** (Free) - Sign up at https://supabase.com with GitHub
- **Stripe Test Keys** (Free) - Dashboard at https://dashboard.stripe.com
- **Google OAuth Credentials** (Free) - Google Cloud Console

**Estimated Setup Time:** 40-50 minutes

---

## Step 1: Supabase Database Setup

### 1.1 Create Supabase Project

1. Go to https://supabase.com and sign in with GitHub
2. Click **"New Project"**
3. Configure:
   - **Name**: `swift-converter`
   - **Database Password**: Generate strong password (save it!)
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
4. Wait 2-3 minutes for project to initialize

### 1.2 Get Connection String

1. In Supabase project, go to **Settings → Database**
2. Copy the **"Connection string"** URI (looks like):
   ```
   postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres?sslmode=require
   ```
3. Save this as `DATABASE_URL` (you'll need it in Step 3 & 4)

### 1.3 Create Database Schema

1. In Supabase, go to **SQL Editor**
2. Click **"New Query"**
3. Copy and paste the entire schema from [database-schema.sql](#database-schema-sql-reference) below
4. Click **"Run"** to execute
5. Verify tables are created: Check **Table Editor** and see `users`, `contact_us`, `transactions`, `audit_logs` tables

### 1.4 Enable Row Level Security (Optional but Recommended)

1. Go to **Authentication → Policies**
2. Enable RLS on each table
3. Add policies as needed for your security requirements

---

## Step 2: GitHub Repository

✅ **Already Done!** Your code is pushed to: https://github.com/AlyEssam98/swiftconverter

Verify:
- Branch: `main`
- Status: Clean (no uncommitted changes)
- Size: ~23 MB (large files removed)
- Files included:
  - `backend/` - Spring Boot API
  - `frontend/` - Next.js web app
  - `docker-compose.yml` - Local development
  - `.gitignore` - Excludes build artifacts
  - `.env` - Environment template

---

## Step 3: Vercel Frontend Deployment

### 3.1 Import GitHub Repository to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"New Project"**
3. Click **"Import Git Repository"**
4. Find and select **`swiftconverter`** repository
5. Click **"Import"**

### 3.2 Configure Environment Variables

1. After import, you'll see **"Environment Variables"** section
2. Add the following variables:

```
NEXT_PUBLIC_API_URL=https://your-render-backend-url.onrender.com
```

⚠️ **Important Notes:**
- Replace `your-render-backend-url` with actual Render domain (done in Step 4)
- `NEXT_PUBLIC_` prefix makes it available in browser (build-time injection)
- **Do NOT add sensitive keys** (API secrets) to frontend env vars

### 3.3 Deploy

1. Click **"Deploy"** button
2. Wait 2-3 minutes for build to complete
3. Your URL will be: `https://swift-converter-xxx.vercel.app` (or custom domain)

### 3.4 View Deployment

- Vercel will show: ✅ **"Congratulations! Your app is live"**
- Visit the URL to see frontend loading
- You should see the login/register page

### 3.5 Optional: Connect Custom Domain

1. Go to project **Settings → Domains**
2. Add your custom domain (e.g., `myapp.com`)
3. Follow DNS configuration steps provided by Vercel
4. Wait for DNS propagation (up to 48 hours)

---

## Step 4: Render Backend Deployment

### 4.1 Create New Web Service on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Select **"Connect a repository"**
4. Find and select **`swiftconverter`** repository
5. Click **"Connect"**

### 4.2 Configure Service

Fill in the following:

| Field | Value |
|-------|-------|
| **Name** | `swift-mtsaas-backend` |
| **Runtime** | `Docker` |
| **Root Directory** | `backend` |
| **Branch** | `main` |
| **Auto-Deploy** | On (auto-redeploy on GitHub push) |

### 4.3 Add Environment Variables

1. Go to **Environment** section
2. Add ALL variables from [Environment Variables Reference](#environment-variables-reference)
3. Essential variables (from Step 1 & security setup):

```
# Database
DATABASE_URL=postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres?sslmode=require
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=YOUR_SUPABASE_PASSWORD

# Frontend
FRONTEND_URL=https://your-vercel-frontend.vercel.app

# OAuth & Security
GOOGLE_CLIENT_ID=your-google-oauth-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret
JWT_SECRET=generate-strong-random-string
STRIPE_SECRET_KEY=sk_test_xxxx (or sk_live_xxxx)
STRIPE_WEBHOOK_SECRET=whsec_xxxx

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
SUPPORT_EMAIL=support@yourapp.com

# Environment
SPRING_PROFILES_ACTIVE=prod
API_URL=https://your-render-backend.onrender.com
```

### 4.4 Configure Render.yaml

1. The `render.yaml` file (already in repo) configures:
   - Application build & start commands
   - Health check endpoint
   - Scaling (2 CPUs, 512 MB RAM - free tier)
   - Cron job to prevent auto-sleep

2. Render will automatically detect and use it

### 4.5 Add Keep-Alive Cron Job (Prevent Sleeping)

Free tier Web Services auto-sleep after 15 minutes of inactivity. To keep it running:

1. In Render dashboard, go to **"Create"** → **"Cron Job"**
2. Configure:
   - **Name**: `swift-keep-alive`
   - **Schedule**: `*/10 * * * *` (every 10 minutes)
   - **Runtime**: `curl`
   - **Command**: `curl https://your-render-domain.onrender.com/api/v1/health`
3. Click **"Create Cron Job"**

### 4.6 Deploy

1. Click **"Deploy"** button
2. Wait 5-10 minutes for build and startup
3. Check **Logs** during build
4. Once deployed, you'll get URL: `https://swift-mtsaas-backend-xxxx.onrender.com`

### 4.7 Verify Render Deployment

Check backend is running:
```bash
curl https://your-render-domain.onrender.com/api/v1/health
```

Expected response:
```json
{
  "status": "UP",
  "components": {
    "db": { "status": "UP" }
  }
}
```

---

## Step 5: Verification & Testing

### 5.1 Test Frontend

1. Visit your Vercel URL: `https://swift-converter-xxx.vercel.app`
2. You should see:
   - Login/Register page loads successfully
   - No console errors (open DevTools: F12)
   - Page is responsive on mobile

### 5.2 Test Backend API

```bash
# Health check
curl https://your-render-backend.onrender.com/api/v1/health

# Contact Us endpoint (optional field test)
curl -X POST https://your-render-backend.onrender.com/api/v1/contact-us \
  -H "Content-Type: application/json" \
  -d '{"message":"Test message"}'

# Expected: 200 OK (even with only message field)
```

### 5.3 Test Database Connection

1. In Supabase, go to **SQL Editor**
2. Run:
   ```sql
   SELECT COUNT(*) as users_count FROM users;
   SELECT COUNT(*) as contacts_count FROM contact_us;
   ```
3. Should return 0 rows initially (no data yet)

### 5.4 Test Full Registration Flow

1. On frontend, click **"Register"**
2. Fill in credentials and click **"Sign Up"**
3. Check backend logs on Render for SQL queries
4. After verification, user should appear in Supabase `users` table

### 5.5 Test API Authorization

```bash
# Get JWT token (replace with test credentials)
curl -X POST https://your-render-backend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Use token in next request
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://your-render-backend.onrender.com/api/v1/user/profile
```

---

## Environment Variables Reference

### Required for Production

```env
# ============= DATABASE =============
DATABASE_URL=jdbc:postgresql://db.xxx.supabase.co:5432/postgres?sslmode=require
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_supabase_password

# ============= FRONTEND =============
FRONTEND_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_API_URL=https://your-render-domain.onrender.com

# ============= AUTH & SECURITY =============
JWT_SECRET=generate-strong-random-uuid (at least 32 characters)
JWT_EXPIRATION_HOURS=24

# ============= OAUTH - Google =============
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxx

# ============= STRIPE =============
STRIPE_SECRET_KEY=sk_live_xxxx or sk_test_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx
STRIPE_SUCCESS_REDIRECT=https://your-vercel-domain/dashboard/credits/success
STRIPE_CANCEL_REDIRECT=https://your-vercel-domain/dashboard/credits/cancel

# ============= EMAIL NOTIFICATIONS =============
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=app-specific-password (NOT your regular password!)
SUPPORT_EMAIL=support@yourapp.com

# ============= SPRING BOOT =============
SPRING_PROFILES_ACTIVE=prod
API_URL=https://your-render-domain.onrender.com

# ============= OPTIONAL - Monitoring =============
LOG_LEVEL=INFO
```

### How to Generate/Get Each Variable

**JWT_SECRET:**
```bash
# On Linux/Mac
openssl rand -hex 32

# On Windows PowerShell
[System.Guid]::NewGuid().ToString() -replace '-'
```

**GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET:**
1. Go to https://console.cloud.google.com
2. Create new project or use existing
3. Enable OAuth 2.0 Consent Screen
4. Create OAuth 2.0 Client ID (Web application)
5. Add redirect URI: `https://your-render-domain/login/oauth2/code/google`
6. Copy Client ID and Client Secret

**STRIPE_SECRET_KEY & STRIPE_WEBHOOK_SECRET:**
1. Go to https://dashboard.stripe.com
2. Use **Test** keys for development
3. Secret key: Reveal in **Developers → API Keys**
4. Webhook secret: Create webhook endpoint at `https://your-render-domain/api/v1/webhooks/stripe`

**MAIL_PASSWORD (Gmail):**
1. Enable 2-Factor Authentication on Google Account
2. Go to https://myaccount.google.com/apppasswords
3. Generate app-specific password (16 characters)
4. Use this in `MAIL_PASSWORD` (NOT your Gmail password)

---

## Troubleshooting

### Frontend Issues

**"API Backend Not Found" Error**
- ✅ Check `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- ✅ Verify Render backend is running: `curl backend-url/api/v1/health`
- ✅ Check browser console (F12) for CORS errors
- ✅ Ensure frontend was redeployed after changing env var

**Blank Page / Build Failed**
- ✅ Check Vercel build logs for errors
- ✅ Ensure `package.json` and `next.config.ts` exist
- ✅ No dependency version conflicts

**Slow Loading**
- ✅ First visit: Render backend may take 30-60 seconds to wake up (auto-sleep after 15 min)
- ✅ Subsequent requests: ~200-500ms latency
- ✅ Solution: Keep-alive cron job (Step 4.5) prevents most sleeping

### Backend Issues

**"Connection to Database Failed"**
- ✅ Check `DATABASE_URL` format is correct
- ✅ Verify Supabase project is running (check Supabase dashboard)
- ✅ Ensure firewall allows Render IP: Supabase auto-allows all by default
- ✅ Test connection locally: Edit `.env` and run `./mvnw.cmd spring-boot:run`

**Build Fails on Render**
- ✅ Check Render build logs for Maven errors
- ✅ Ensure `backend/Dockerfile` exists
- ✅ Check `render.yaml` is present in repo root
- ✅ Rebuild: Push to GitHub (auto-triggers on main branch)

**"502 Bad Gateway" Error**
- ✅ Backend likely crashed: Check Render logs
- ✅ Verify all environment variables are set
- ✅ Check database connection: Run health check
- ✅ Restart service: Manual restart in Render dashboard

**"Unauthorized" / JWT Errors**
- ✅ Ensure `JWT_SECRET` is set and consistent
- ✅ Check token is being sent in `Authorization: Bearer <token>` header
- ✅ Verify token hasn't expired (24 hours default)

### Database Issues

**"Table Does Not Exist"**
- ✅ Check schema was created in Step 1.3
- ✅ Verify you ran complete SQL script
- ✅ Check you're using correct database: Should be `postgres` (default)

**"Too Many Connections"**
- ✅ Supabase free tier: Max 3 connections
- ✅ Spring Boot connection pool: Set to max 3 in `application.properties`
- ✅ Close unused connections: Restart Render service

**Out of Storage**
- ✅ Supabase free tier: 500 MB limit
- ✅ Check database size: Run `SELECT pg_database.datname, pg_size_pretty(pg_database_size(pg_database.datname)) FROM pg_database;`
- ✅ Clean old audit logs: `DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '90 days';`

---

## Monitoring & Maintenance

### Getting Logs

**Vercel Logs:**
1. Dashboard → Your project → **Deployments** tab
2. Click latest deployment → **Functions** or **Logs**
3. See frontend build and runtime logs

**Render Logs:**
1. Dashboard → Your service → **Logs** tab
2. Streaming logs show in real-time
3. Filter by `ERROR` or `WARN` to find issues

**Supabase Logs:**
1. Dashboard → **Logs** tab
2. See database connection, query execution, and errors

### Database Maintenance

**Weekly:**
- Check database size (near 500 MB limit?)
- Monitor slow queries in Supabase logs
- Review error logs for connection issues

**Monthly:**
- Delete old audit logs: `DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '90 days';`
- Analyze table usage patterns
- Plan feature scaling if approaching limits

### Uptime Monitoring

**Free Options:**
- **Uptime Monitor**: https://uptimerobot.com (free tier monitors 5 endpoints)
- **Health Checks**: Set up cron job to test `/api/v1/health` periodically
- **Alerts**: Get email notifications if service goes down

### Cost Optimization

**Current Costs:** $0/month

**Usage Limits (Before Paid Plans):**
- **Vercel**: Unlimited deployments, functions, bandwidth
- **Render**: 750 hours/month free tier (30 days × 24 hours = 720 hours)
- **Supabase**: 500 MB storage, 3 concurrent connections

**When to Upgrade:**
- Vercel: Never (free tier is full-featured)
- Render: If needing > 750 hours or better performance ($7/month)
- Supabase: If needing > 500 MB storage ($25/month for next tier)

---

## Database Schema SQL Reference

Run this in Supabase SQL Editor to create tables:

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  google_id VARCHAR(255) UNIQUE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact Us table
CREATE TABLE contact_us (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'NEW',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table (for credits & payments)
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  credits_amount INTEGER,
  stripe_payment_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Audit Logs table
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id VARCHAR(255),
  details JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_contact_us_email ON contact_us(email);
CREATE INDEX idx_contact_us_status ON contact_us(status);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

---

## Quick Reference Checklist

- [ ] Supabase project created and database schema loaded
- [ ] Database URL copied and verified
- [ ] GitHub repository pushed (main branch)
- [ ] Vercel frontend deployed with `NEXT_PUBLIC_API_URL` set
- [ ] Render backend deployed with all env vars set
- [ ] Render keep-alive cron job created
- [ ] Health check verified: `/api/v1/health` returns 200
- [ ] Frontend loads without errors
- [ ] Registration flow tested end-to-end
- [ ] Database queries working (check Supabase)
- [ ] Custom domains configured (optional)
- [ ] Email notifications tested
- [ ] Stripe webhook configured
- [ ] SSL certificates verified (auto-managed)

---

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Spring Boot Reference**: https://spring.io/projects/spring-boot
- **Next.js Guide**: https://nextjs.org/docs

---

**Deployed! 🚀**

Your SWIFT MT-MX SaaS is now live on production infrastructure, completely free. Monitor logs regularly and enjoy scale-free hosting.
