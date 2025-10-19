# Quick Commands Reference

## Push to GitHub

```bash
# 1. Create repo on GitHub: https://github.com/new
# 2. Then run these commands:

git remote add origin https://github.com/YOUR_USERNAME/flowrss.git
git push -u origin main
```

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts, it will:
# - Link to your GitHub repo
# - Deploy automatically
# - Give you a live URL
```

## Local Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Testing

```bash
# Test the app
open http://localhost:3000

# Check for errors
# Open browser console (Cmd+Option+J)
```

## Database Reset (if needed)

```bash
# In browser console:
await window.resetDatabase()
```

## Git Commands

```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push

# Pull latest changes
git pull
```

## Useful Links

- **GitHub:** https://github.com/YOUR_USERNAME/flowrss
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Local App:** http://localhost:3000

---

**Current Status:** ✅ All code committed, ready to push to GitHub!
