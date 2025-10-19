# 🚀 FlowRSS - How to Start Backend & Frontend

## ✅ All Processes Killed - Ready for Fresh Start

---

## 📋 Important: How FlowRSS Works

**FlowRSS uses Next.js**, which means:
- ✅ **Frontend and Backend run together** in ONE process
- ✅ **One command starts everything**
- ✅ **One port (3000) serves everything**

You don't need separate backend and frontend servers!

---

## 🚀 Starting the Application

### Option 1: Development Mode (Recommended)

```bash
npm run dev
```

**What this does:**
- ✅ Starts Next.js development server
- ✅ Runs frontend (React UI)
- ✅ Runs backend (API routes at /api/*)
- ✅ Enables hot reload
- ✅ Shows detailed errors
- ✅ Opens at: http://localhost:3000

**Use this for:**
- Development
- Testing
- UAT
- Debugging

---

### Option 2: Production Mode

```bash
# Step 1: Build the application
npm run build

# Step 2: Start production server
npm start
```

**What this does:**
- ✅ Builds optimized production bundle
- ✅ Starts production server
- ✅ Better performance
- ✅ Opens at: http://localhost:3000

**Use this for:**
- Production deployment
- Performance testing
- Final validation

---

## 🎯 What's Running?

When you start the app, you get **ALL of these**:

### Frontend (Port 3000)
- ✅ React UI
- ✅ Pages and components
- ✅ Client-side routing
- ✅ Service Worker (PWA)

### Backend (Port 3000/api/*)
- ✅ API Routes
- ✅ `/api/extract` - Content extraction
- ✅ Server-side functions

### Database
- ✅ **IndexedDB** - Runs in browser (no server needed)
- ✅ **Supabase** - Cloud database (optional, for sync)

---

## 📝 Step-by-Step Instructions

### For UAT Testing:

1. **Open Terminal**

2. **Navigate to project:**
   ```bash
   cd /path/to/flowRSS
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Wait for startup:**
   ```
   ✓ Ready in 1-2 seconds
   ```

5. **Open browser:**
   ```
   http://localhost:3000
   ```

6. **Start testing!** 🎉

---

## 🛑 Stopping the Application

### Method 1: Keyboard Shortcut
```bash
# In the terminal where npm run dev is running:
Press Ctrl+C
```

### Method 2: Kill Process
```bash
pkill -f "next"
```

### Method 3: Kill Port
```bash
lsof -ti:3000 | xargs kill -9
```

---

## 📱 Testing on Mobile

### Step 1: Find Your Local IP

**macOS/Linux:**
```bash
ipconfig getifaddr en0
```

**Or:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```bash
ipconfig
```

### Step 2: Open on Phone

```
http://YOUR_IP:3000
```

Example: `http://192.168.1.100:3000`

---

## 🔍 Monitoring

### Check if Server is Running
```bash
curl http://localhost:3000
```

### View Logs
```bash
# If you started with:
npm run dev > app.log 2>&1 &

# Then view logs:
tail -f app.log
```

### Check Process
```bash
ps aux | grep next
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Then start again
npm run dev
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Check for type errors
npm run type-check

# Clear Next.js cache
rm -rf .next
npm run build
```

### Database Issues
- Clear browser data
- Reload page
- Check IndexedDB in DevTools (F12 → Application → IndexedDB)

---

## 📊 What to Expect

### On Startup:
```
> flowrss@0.1.0 dev
> next dev

  ▲ Next.js 14.2.33
  - Local:        http://localhost:3000
  - Environments: .env

 ✓ Starting...
 ✓ Ready in 1276ms
```

### In Browser:
1. Welcome screen appears
2. Select feed packs
3. Click "Continue"
4. Articles load automatically
5. Start testing!

---

## 🎯 Quick Commands Reference

```bash
# Install dependencies
npm install

# Start development (frontend + backend)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run type-check

# Stop server
Ctrl+C  # or pkill -f "next"

# Kill port 3000
lsof -ti:3000 | xargs kill -9
```

---

## ✅ Verification Checklist

After starting, verify:

- [ ] Terminal shows "✓ Ready in XXXXms"
- [ ] No error messages in terminal
- [ ] http://localhost:3000 opens in browser
- [ ] Welcome screen appears
- [ ] No errors in browser console (F12)

---

## 🎉 You're Ready!

**Server:** http://localhost:3000  
**Status:** Ready to start  
**Command:** `npm run dev`  

**Start the server and begin UAT testing!** 🚀

---

## 📞 Need Help?

### Check Server Status
```bash
curl http://localhost:3000
```

### View Logs
```bash
tail -f app.log
```

### Restart Server
```bash
pkill -f "next"
npm run dev
```

---

**Happy Testing!** 🧪
