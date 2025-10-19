# 🧪 FlowRSS - UAT Testing Session

## ✅ SERVER IS RUNNING!

### Application Server (Frontend + Backend)
**URL:** http://localhost:3000  
**Status:** 🟢 LIVE  
**Process ID:** Check with `ps aux | grep next`  
**Logs:** `tail -f flowrss-app.log`  

---

## 📋 What's Running

### Next.js Server (Port 3000)
This includes:
- ✅ **Frontend** - React UI (pages, components)
- ✅ **Backend** - API Routes (`/api/*`)
- ✅ **Database** - IndexedDB (runs in browser)
- ✅ **Service Worker** - PWA functionality

### API Endpoints Available:
- `POST /api/extract` - Full-text content extraction

### Database:
- **IndexedDB** - Runs in your browser (no separate server needed)
- **Supabase** - Cloud database (optional, for sync)

---

## 🎯 How to Test

### 1. Open the App
```
http://localhost:3000
```

### 2. Test Features

#### ✅ Welcome & Onboarding
- [ ] Welcome screen appears
- [ ] Can select feed packs
- [ ] Can add custom feed
- [ ] Continue button works

#### ✅ Feed Management
- [ ] Feeds appear in sidebar
- [ ] Can click "Add Feed"
- [ ] Can add custom RSS URL
- [ ] Feeds validate correctly

#### ✅ Articles
- [ ] Articles auto-load (wait 2 seconds)
- [ ] Can click to read article
- [ ] Article reader opens
- [ ] Can star articles
- [ ] Can close reader

#### ✅ Search
- [ ] Search bar works
- [ ] Filters articles in real-time
- [ ] Can clear search

#### ✅ Settings
- [ ] Settings modal opens
- [ ] Can change theme
- [ ] Can change fonts
- [ ] Can export OPML
- [ ] Can import OPML

#### ✅ Account Management
- [ ] Account section visible in Settings
- [ ] Sign Up button works
- [ ] Sign In button works
- [ ] Dialog opens with form
- [ ] Supabase integration active

#### ✅ Refresh
- [ ] "Refresh All" button works
- [ ] Shows "Refreshing..." state
- [ ] New articles load

#### ✅ Offline Mode
- [ ] Disconnect internet
- [ ] App still works
- [ ] Can read cached articles
- [ ] Reconnect works

#### ✅ Mobile
- [ ] Resize browser to mobile
- [ ] Sidebar collapses
- [ ] Hamburger menu works
- [ ] Touch-friendly

---

## 🔍 Monitoring

### Check Server Status
```bash
curl http://localhost:3000
```

### View Logs
```bash
tail -f flowrss-app.log
```

### Check Processes
```bash
ps aux | grep next
```

### Kill Server (if needed)
```bash
pkill -f "next"
```

---

## 🐛 Debugging

### Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Check for errors

### Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Monitor API calls

### Application Tab
1. Open DevTools (F12)
2. Go to Application tab
3. Check IndexedDB
4. Check Service Worker

---

## 📊 What to Test

### Critical Features
1. **Welcome Flow** - First-time user experience
2. **Feed Management** - Add, view, refresh feeds
3. **Article Reading** - Browse and read articles
4. **Account Management** - Sign up/sign in (Supabase)
5. **Settings** - All settings work
6. **OPML** - Import/export feeds
7. **Search** - Find articles
8. **Offline** - Works without internet

### Performance
- Initial load time (<3 seconds)
- Article load time (instant)
- Feed refresh time (<5 seconds)
- Smooth scrolling
- No lag

### UI/UX
- Clean design
- Readable text
- Working buttons
- Proper spacing
- No visual glitches

---

## ✅ Expected Behavior

### On First Load
1. Welcome screen appears
2. Can select feed packs
3. Click "Continue"
4. Main app loads
5. Feeds appear in sidebar
6. Articles auto-load within 2 seconds

### Adding Feeds
1. Click "Add Feed"
2. Dialog opens
3. Enter URL (e.g., https://news.ycombinator.com/rss)
4. Click "Add Feed"
5. Toast notification shows
6. Feed appears in sidebar
7. Articles load automatically

### Reading Articles
1. Click any article in list
2. Reader opens full-screen
3. Content is readable
4. Can star article
5. Can close reader
6. Returns to list

### Account Management
1. Click "Settings"
2. Scroll to "Account Management"
3. Click "Sign Up" or "Sign In"
4. Dialog opens
5. Enter email/password
6. Submit form
7. Supabase authentication happens
8. Success/error message shows

---

## 🎯 Test Scenarios

### Scenario 1: New User
1. Open app
2. Select "Tech News" pack
3. Click Continue
4. Wait for articles to load
5. Click an article
6. Read it
7. Star it
8. Close reader

### Scenario 2: Add Custom Feed
1. Click "Add Feed"
2. Enter: https://techcrunch.com/feed/
3. Click "Add Feed"
4. Wait for articles
5. Click the new feed in sidebar
6. View articles from that feed

### Scenario 3: Account Setup
1. Click "Settings"
2. Find "Account Management"
3. Click "Sign Up"
4. Enter test email/password
5. Submit
6. Check for success message

### Scenario 4: OPML Export
1. Click "Settings"
2. Click "Export OPML"
3. File downloads
4. Check file contains feeds

### Scenario 5: Theme Change
1. Click "Settings"
2. Change theme to Dark
3. UI updates immediately
4. Change to Light
5. UI updates again

---

## 📱 Mobile Testing

### On Your Phone
1. Find your local IP:
   ```bash
   ipconfig getifaddr en0
   ```

2. Open on phone:
   ```
   http://YOUR_IP:3000
   ```

3. Test mobile features:
   - Sidebar collapses
   - Hamburger menu
   - Touch targets
   - Scrolling
   - Reading

---

## 🚨 Common Issues

### Port Already in Use
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Articles Not Loading
- Wait 2 seconds for auto-fetch
- Or click "Refresh All" manually
- Check browser console for errors

### Database Not Working
- Clear browser data
- Reload page
- Check IndexedDB in DevTools

### Supabase Not Working
- Check .env file has credentials
- Check internet connection
- Check Supabase project is active

---

## ✅ Success Criteria

### Must Work
- ✅ App loads
- ✅ Feeds display
- ✅ Articles load
- ✅ Can read articles
- ✅ Settings work
- ✅ Account management works

### Should Work
- ✅ Auto-fetch articles
- ✅ Search works
- ✅ OPML import/export
- ✅ Offline mode
- ✅ Mobile responsive

---

## 📞 Need Help?

### Check Logs
```bash
tail -f flowrss-app.log
```

### Check Browser Console
- Open DevTools (F12)
- Look for errors in Console

### Restart Server
```bash
pkill -f "next"
npm run dev
```

---

## 🎉 Ready to Test!

**Server:** http://localhost:3000  
**Status:** 🟢 RUNNING  
**Backend:** Included (API routes)  
**Frontend:** Included (React UI)  
**Database:** IndexedDB (browser) + Supabase (cloud)  

**Start testing and report any issues!** 🚀

---

**Good luck with UAT testing!** 🧪
