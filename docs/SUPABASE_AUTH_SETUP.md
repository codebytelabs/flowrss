# Supabase Authentication Setup Guide

**For:** FlowRSS User Management  
**Providers:** Google, Apple, Email/Password

---

## 📋 Overview

This guide covers:
1. What I'll code (frontend)
2. What you need to configure (Supabase backend)
3. Step-by-step setup for each provider

---

## 🎯 What I'll Implement (Frontend)

### Code I'll Write:
- ✅ Supabase client setup
- ✅ Sign in with Google button
- ✅ Sign in with Apple button
- ✅ Email/password sign in form
- ✅ Sign up form
- ✅ Password reset flow
- ✅ User session management
- ✅ Protected routes
- ✅ User profile component
- ✅ Sign out functionality

### What You'll Get:
- Beautiful auth UI components
- Automatic session handling
- Secure token management
- User state across app

---

## 🔧 What You Need to Configure (Supabase)

### 1. Create Supabase Project (5 minutes)

**Steps:**
1. Go to https://supabase.com
2. Click "Start your project"
3. Create new organization (if needed)
4. Create new project:
   - **Name:** FlowRSS
   - **Database Password:** (save this!)
   - **Region:** Choose closest to your users
5. Wait for project to be ready (~2 minutes)

### 2. Get Your Supabase Credentials (1 minute)

**Steps:**
1. Go to Project Settings → API
2. Copy these values:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **Anon/Public Key:** `eyJhbGc...` (long string)
3. Add to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## 🔐 Provider Setup

### Option 1: Google Sign-In (10 minutes)

**Step 1: Create Google OAuth App**
1. Go to https://console.cloud.google.com
2. Create new project or select existing
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth client ID"
5. Configure consent screen (if first time):
   - User Type: External
   - App name: FlowRSS
   - User support email: your email
   - Developer contact: your email
6. Create OAuth client ID:
   - Application type: Web application
   - Name: FlowRSS
   - Authorized redirect URIs:
     ```
     https://xxxxx.supabase.co/auth/v1/callback
     ```
     (Replace xxxxx with your Supabase project ID)
7. Copy **Client ID** and **Client Secret**

**Step 2: Configure in Supabase**
1. Go to Supabase Dashboard
2. Authentication → Providers
3. Find "Google" and enable it
4. Paste:
   - **Client ID:** from Google
   - **Client Secret:** from Google
5. Click "Save"

**Done!** Google sign-in will work.

---

### Option 2: Apple Sign-In (15 minutes)

**Step 1: Create Apple App ID**
1. Go to https://developer.apple.com/account
2. Certificates, Identifiers & Profiles
3. Identifiers → Click "+"
4. Select "App IDs" → Continue
5. Select "App" → Continue
6. Configure:
   - Description: FlowRSS
   - Bundle ID: com.yourcompany.flowrss
   - Capabilities: Check "Sign in with Apple"
7. Click "Continue" → "Register"

**Step 2: Create Service ID**
1. Identifiers → Click "+"
2. Select "Services IDs" → Continue
3. Configure:
   - Description: FlowRSS Web
   - Identifier: com.yourcompany.flowrss.web
4. Check "Sign in with Apple"
5. Click "Configure"
6. Add domain and return URL:
   - **Domains:** `xxxxx.supabase.co`
   - **Return URLs:** `https://xxxxx.supabase.co/auth/v1/callback`
7. Click "Save" → "Continue" → "Register"

**Step 3: Create Private Key**
1. Keys → Click "+"
2. Key Name: FlowRSS Sign in with Apple
3. Check "Sign in with Apple"
4. Click "Configure"
5. Select your App ID
6. Click "Save" → "Continue" → "Register"
7. **Download the key file** (.p8) - you can only do this once!
8. Note the **Key ID** (10 characters)

**Step 4: Configure in Supabase**
1. Go to Supabase Dashboard
2. Authentication → Providers
3. Find "Apple" and enable it
4. Paste:
   - **Services ID:** com.yourcompany.flowrss.web
   - **Team ID:** (find in Apple Developer account top-right)
   - **Key ID:** from step 3
   - **Private Key:** Open .p8 file, copy entire contents
5. Click "Save"

**Done!** Apple sign-in will work.

---

### Option 3: Email/Password (Already Enabled!)

**No configuration needed!** Supabase enables this by default.

You can customize:
1. Authentication → Email Templates
2. Edit confirmation email, password reset, etc.
3. Add your branding

---

## 📧 Email Configuration (Optional but Recommended)

**Default:** Supabase sends emails from their domain  
**Better:** Use your own domain

**Steps:**
1. Go to Project Settings → Auth
2. SMTP Settings
3. Enable custom SMTP
4. Configure with your email provider:
   - **Gmail:** smtp.gmail.com:587
   - **SendGrid:** smtp.sendgrid.net:587
   - **AWS SES:** email-smtp.region.amazonaws.com:587
5. Enter credentials
6. Test email

---

## 🔒 Security Settings (Important!)

### 1. Configure Site URL
1. Authentication → URL Configuration
2. **Site URL:** `https://flowrss.app` (your production domain)
3. **Redirect URLs:** Add:
   ```
   https://flowrss.app/**
   http://localhost:3000/**
   ```

### 2. Enable Email Confirmations (Recommended)
1. Authentication → Providers → Email
2. **Confirm email:** Enable
3. Users must verify email before signing in

### 3. Set Password Requirements
1. Authentication → Policies
2. Configure:
   - Minimum password length: 8
   - Require uppercase: Yes
   - Require numbers: Yes
   - Require special characters: Optional

---

## 📊 Database Setup (Automatic)

Supabase automatically creates these tables:
- `auth.users` - User accounts
- `auth.sessions` - Active sessions
- `auth.refresh_tokens` - For token refresh

**You don't need to create anything!**

---

## 🧪 Testing Checklist

After I implement the code and you configure Supabase:

### Test Google Sign-In:
- [ ] Click "Sign in with Google"
- [ ] Redirects to Google
- [ ] Select account
- [ ] Redirects back to FlowRSS
- [ ] User is signed in

### Test Apple Sign-In:
- [ ] Click "Sign in with Apple"
- [ ] Redirects to Apple
- [ ] Enter Apple ID
- [ ] Redirects back to FlowRSS
- [ ] User is signed in

### Test Email/Password:
- [ ] Enter email and password
- [ ] Click "Sign up"
- [ ] Receive confirmation email
- [ ] Click confirmation link
- [ ] Can sign in

### Test Sign Out:
- [ ] Click "Sign out"
- [ ] Session cleared
- [ ] Redirected to sign in

---

## 💰 Pricing (Supabase)

**Free Tier:**
- 50,000 monthly active users
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth
- **Perfect for launch!**

**Pro Tier ($25/month):**
- 100,000 monthly active users
- 8 GB database
- 100 GB file storage
- 250 GB bandwidth

---

## 🚀 Implementation Timeline

### What I'll Do (2-3 hours):
1. Install Supabase client
2. Create auth components
3. Implement sign in/up flows
4. Add session management
5. Protect routes
6. Test everything

### What You'll Do (30 minutes):
1. Create Supabase project (5 min)
2. Configure Google OAuth (10 min)
3. Configure Apple OAuth (15 min)
4. Test sign-in flows (10 min)

**Total time:** ~3 hours

---

## 📝 Summary

### You Need To:
1. ✅ Create Supabase project
2. ✅ Get API credentials
3. ✅ Set up Google OAuth (if using)
4. ✅ Set up Apple OAuth (if using)
5. ✅ Configure redirect URLs
6. ✅ Test sign-in flows

### I Will:
1. ✅ Write all frontend code
2. ✅ Integrate Supabase client
3. ✅ Create auth UI components
4. ✅ Handle sessions
5. ✅ Protect routes
6. ✅ Test everything

---

## 🆘 Common Issues

### "Invalid redirect URI"
- Check redirect URL in Google/Apple console
- Must match exactly: `https://xxxxx.supabase.co/auth/v1/callback`

### "Email not confirmed"
- Check spam folder
- Resend confirmation email
- Or disable email confirmation in Supabase

### "Invalid credentials"
- Double-check Client ID and Secret
- Make sure you copied entire key
- Try regenerating credentials

---

## 📞 Need Help?

**Supabase Docs:** https://supabase.com/docs/guides/auth  
**Google OAuth:** https://console.cloud.google.com  
**Apple Sign In:** https://developer.apple.com/sign-in-with-apple

---

**Ready to implement?** Let me know and I'll start coding the authentication system!
