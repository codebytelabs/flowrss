# 🧪 FlowRSS - UAT Testing Guide

## ✅ SERVER IS RUNNING!

**Frontend & Backend:** http://localhost:3000  
**Status:** 🟢 READY FOR TESTING  

---

## 🎯 Quick Start

### 1. Open FlowRSS
```
http://localhost:3000
```

### 2. Test on Mobile (Optional)
Find your local IP:
```bash
ipconfig getifaddr en0
```

Then open on your phone:
```
http://YOUR_IP:3000
```

---

## 📋 UAT Test Scenarios

### ✅ Scenario 1: First-Time User Experience

**Steps:**
1. Open http://localhost:3000
2. You should see the Welcome Screen
3. Click "Get Started"
4. Select one or more curated feed packs:
   - 💻 Tech News
   - 👨‍💻 Developer Blogs
   - ₿ Crypto & Web3
   - 🎨 Design & UX
   - 🤖 AI & Machine Learning
   - ⚡ Productivity & Life
   - 🚀 Indie Hackers
5. Click "Continue"
6. You should see the main app with articles

**Expected Results:**
- ✅ Welcome screen displays correctly
- ✅ Feed packs are selectable
- ✅ Continue button works
- ✅ Articles load from selected feeds
- ✅ No errors in console

---

### ✅ Scenario 2: Browse & Read Articles

**Steps:**
1. Look at the article list
2. Click on any article
3. Article reader should open
4. Read the article
5. Click the X to close
6. Try another article

**Expected Results:**
- ✅ Articles display in list
- ✅ Article titles are readable
- ✅ Click opens article reader
- ✅ Content is readable
- ✅ Close button works
- ✅ Can navigate between articles

---

### ✅ Scenario 3: Add Custom Feed

**Steps:**
1. Click "Add Feed" in sidebar
2. Dialog should open
3. Enter a feed URL (try these):
   - https://news.ycombinator.com/rss
   - https://techcrunch.com/feed/
   - https://www.theverge.com/rss/index.xml
4. Click "Add Feed"
5. Toast notification should appear
6. Feed should appear in sidebar
7. Click on the new feed
8. Articles should load

**Expected Results:**
- ✅ Add feed dialog opens
- ✅ Can enter URL
- ✅ Feed validates and adds
- ✅ Success notification shows
- ✅ Feed appears in sidebar
- ✅ Articles load from new feed

---

### ✅ Scenario 4: Star & Save Articles

**Steps:**
1. Open an article
2. Click the star icon
3. Star should fill with yellow
4. Close article
5. Click "Starred" in sidebar
6. Article should appear in starred list

**Expected Results:**
- ✅ Star icon works
- ✅ Visual feedback (yellow star)
- ✅ Starred filter works
- ✅ Article appears in starred list

---

### ✅ Scenario 5: Search Articles

**Steps:**
1. Look for search bar (if visible)
2. Type a search term
3. Articles should filter
4. Clear search
5. All articles should show again

**Expected Results:**
- ✅ Search bar is accessible
- ✅ Search filters articles
- ✅ Clear search works
- ✅ Results update in real-time

---

### ✅ Scenario 6: Settings & Preferences

**Steps:**
1. Click "Settings" in sidebar
2. Settings modal should open
3. Try changing theme:
   - Light
   - Dark
   - Sepia
4. Try changing font size
5. Try changing font family
6. Click "Save Changes"
7. Settings should persist

**Expected Results:**
- ✅ Settings modal opens
- ✅ Theme changes work
- ✅ Font size changes work
- ✅ Font family changes work
- ✅ Settings save successfully
- ✅ Settings persist after reload

---

### ✅ Scenario 7: OPML Export

**Steps:**
1. Open Settings
2. Click "Export OPML"
3. File should download
4. Check the downloaded file
5. It should contain your feeds in XML format

**Expected Results:**
- ✅ Export button works
- ✅ File downloads
- ✅ File contains feeds
- ✅ XML format is valid

---

### ✅ Scenario 8: OPML Import

**Steps:**
1. Open Settings
2. Click "Import OPML"
3. Select an OPML file
4. Feeds should import
5. Success notification should show
6. New feeds should appear in sidebar

**Expected Results:**
- ✅ Import button works
- ✅ File picker opens
- ✅ File uploads successfully
- ✅ Feeds import correctly
- ✅ Success notification shows
- ✅ Feeds appear in sidebar

---

### ✅ Scenario 9: Refresh Feeds

**Steps:**
1. Click "Refresh All" in sidebar
2. Loading indicator should show
3. Feeds should update
4. New articles should appear
5. Success notification should show

**Expected Results:**
- ✅ Refresh button works
- ✅ Loading state shows
- ✅ Feeds update
- ✅ New articles load
- ✅ No errors occur

---

### ✅ Scenario 10: Offline Mode

**Steps:**
1. Load some articles
2. Disconnect internet
3. Try browsing articles
4. Articles should still load
5. Try reading saved articles
6. Reconnect internet
7. App should sync

**Expected Results:**
- ✅ App works offline
- ✅ Cached articles load
- ✅ Can read saved content
- ✅ No errors when offline
- ✅ Syncs when back online

---

### ✅ Scenario 11: Responsive Design (Mobile)

**Steps:**
1. Open on mobile device
2. Or resize browser to mobile size
3. Sidebar should collapse
4. Hamburger menu should appear
5. Tap to open sidebar
6. Tap article to read
7. Full-screen reader should open

**Expected Results:**
- ✅ Mobile layout works
- ✅ Sidebar collapses
- ✅ Hamburger menu works
- ✅ Touch targets are large enough
- ✅ Text is readable
- ✅ No horizontal scrolling

---

### ✅ Scenario 12: Keyboard Shortcuts

**Steps:**
1. Press `?` (Shift + /)
2. Shortcuts modal should open
3. Try keyboard shortcuts:
   - `a` - Add feed
   - `,` - Settings
   - `Esc` - Close modals

**Expected Results:**
- ✅ Shortcuts modal opens
- ✅ Shortcuts are listed
- ✅ Shortcuts work
- ✅ Modal closes with Esc

---

## 🐛 Bug Reporting

### If You Find a Bug:

**Report Format:**
```markdown
**Bug Description:**
[What went wrong]

**Steps to Reproduce:**
1. Go to...
2. Click on...
3. See error...

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happened]

**Screenshots:**
[If applicable]

**Environment:**
- Browser: [e.g., Chrome 120]
- OS: [e.g., macOS 14]
- Device: [e.g., MacBook Pro]
```

---

## ✅ Test Checklist

### Core Features
- [ ] Welcome screen works
- [ ] Can select feed packs
- [ ] Articles load
- [ ] Can read articles
- [ ] Can add custom feeds
- [ ] Can star articles
- [ ] Can search articles
- [ ] Settings work
- [ ] Theme changes work
- [ ] OPML export works
- [ ] OPML import works
- [ ] Refresh feeds works

### UI/UX
- [ ] Layout looks good
- [ ] Text is readable
- [ ] Buttons work
- [ ] Forms work
- [ ] Modals open/close
- [ ] Notifications show
- [ ] Loading states show
- [ ] No visual glitches

### Performance
- [ ] App loads fast (<3s)
- [ ] Navigation is smooth
- [ ] No lag when scrolling
- [ ] Images load properly
- [ ] No memory leaks

### Mobile
- [ ] Works on mobile
- [ ] Responsive layout
- [ ] Touch targets work
- [ ] Sidebar collapses
- [ ] Can install as PWA

### Offline
- [ ] Works offline
- [ ] Cached content loads
- [ ] Syncs when online
- [ ] No errors offline

---

## 📊 Performance Metrics to Check

### Load Times
- Initial load: Should be <3 seconds
- Article load: Should be instant
- Feed refresh: Should be <5 seconds

### Bundle Size
- Total JS: ~239 KB
- First Load: ~239 KB
- Subsequent: <1 second (cached)

### Memory Usage
- Idle: <50 MB
- With 100 articles: <100 MB
- No memory leaks

---

## 🎯 Success Criteria

### Must Pass:
- ✅ All core features work
- ✅ No critical bugs
- ✅ Performance is acceptable
- ✅ Mobile works
- ✅ Offline works

### Nice to Have:
- ✅ All keyboard shortcuts work
- ✅ All animations smooth
- ✅ Perfect responsive design
- ✅ Zero console errors

---

## 🚀 After UAT Testing

### If Everything Works:
1. ✅ Mark as production ready
2. ✅ Deploy to Vercel
3. ✅ Set up domain
4. ✅ Launch!

### If Issues Found:
1. Document all bugs
2. Prioritize (critical/high/medium/low)
3. Fix critical bugs first
4. Re-test
5. Deploy when ready

---

## 📞 Need Help?

### Check Logs:
```bash
# Server logs
tail -f flowrss-server.log

# Browser console
Open DevTools (F12) → Console
```

### Common Issues:

**Port already in use:**
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

**Database not initializing:**
- Clear browser data
- Reload page
- Check console for errors

**Feeds not loading:**
- Check internet connection
- Check feed URL is valid
- Check console for errors

---

## ✅ READY TO TEST!

**Server Status:** 🟢 RUNNING  
**URL:** http://localhost:3000  
**Mobile URL:** http://YOUR_IP:3000  

**Start testing and report any issues you find!**

**Good luck! 🚀**
