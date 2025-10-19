# FlowRSS Beta Testing Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to `http://localhost:3000`

---

## 🧪 Testing Scenarios

### Scenario 1: First-Time User Experience

**Steps:**
1. Open FlowRSS for the first time
2. Click "Get Started" on welcome screen
3. Select "Fediverse - Mastodon" pack
4. Select "Fediverse - Lemmy" pack
5. Select "Tech News" pack
6. Click "Continue"
7. Wait for feeds to sync
8. Explore the sidebar

**Expected Results:**
- Welcome screen displays with 3 feature cards
- Curated packs show in grid layout
- Fediverse packs are visible and selectable
- Feeds are added successfully
- Sidebar shows all subscribed feeds
- Articles start loading

---

### Scenario 2: Create and Organize Folders

**Steps:**
1. Click the "+" button next to "My Folders" (or "Your Feeds")
2. Enter folder name: "Tech"
3. Select an icon (e.g., 💻)
4. Select a color (e.g., blue)
5. Click "Create"
6. Right-click on a feed
7. Select "Move to folder" → "Tech"
8. Verify feed moved to folder
9. Click folder to collapse/expand

**Expected Results:**
- Folder creation dialog opens
- Folder is created with chosen name, icon, and color
- Feed moves to folder successfully
- Folder can be collapsed and expanded
- Feeds inside folder are visible when expanded

---

### Scenario 3: Fediverse Feeds

**Steps:**
1. Subscribe to "Fediverse - Mastodon" pack
2. Wait for feeds to load
3. Click on "Mastodon Official (@Gargron)" feed
4. View articles
5. Click on an article to read
6. Subscribe to "Fediverse - Lemmy" pack
7. Click on "Lemmy - Linux Community" feed
8. View articles

**Expected Results:**
- Mastodon feeds load successfully
- Articles display with proper formatting
- Lemmy feeds load via OpenRSS.org
- Articles are readable
- Images display correctly
- Links work properly

---

### Scenario 4: Context Menus

**Steps:**
1. Right-click on a feed
2. Verify context menu appears
3. Select "Move to folder"
4. Choose a folder
5. Right-click on a folder
6. Select "Mark all as read"
7. Right-click on a feed
8. Select "Unsubscribe"

**Expected Results:**
- Context menu appears on right-click
- "Move to folder" shows list of folders
- Feed moves to selected folder
- "Mark all as read" marks all articles as read
- "Unsubscribe" removes feed after confirmation

---

### Scenario 5: Nested Folders

**Steps:**
1. Create a folder named "Tech"
2. Create another folder named "Programming"
3. Edit "Programming" folder
4. Set parent folder to "Tech"
5. Move some feeds to "Programming"
6. Collapse "Tech" folder
7. Expand "Tech" folder
8. Verify "Programming" is nested inside

**Expected Results:**
- Folders can be nested
- Nested folders display with indentation
- Collapsing parent collapses all children
- Expanding parent shows children
- Feeds in nested folders are accessible

---

### Scenario 6: Mobile Responsiveness

**Steps:**
1. Open FlowRSS on mobile device (or resize browser to mobile width)
2. Click hamburger menu to open sidebar
3. Navigate through feeds
4. Create a folder
5. Move feeds to folder
6. Read an article
7. Close sidebar

**Expected Results:**
- Sidebar is hidden by default on mobile
- Hamburger menu opens sidebar
- All features work on mobile
- Touch interactions work properly
- Sidebar closes when clicking outside
- Reading experience is optimized for mobile

---

### Scenario 7: Star and Save

**Steps:**
1. Click on a feed
2. View articles
3. Click star icon on an article
4. Click save icon on another article
5. Click "Starred" in sidebar
6. Verify starred article appears
7. Click "Saved" in sidebar
8. Verify saved article appears

**Expected Results:**
- Star icon toggles on/off
- Save icon toggles on/off
- Starred articles appear in "Starred" view
- Saved articles appear in "Saved" view
- Icons update in real-time
- Counts update correctly

---

### Scenario 8: Search and Filter

**Steps:**
1. Type in search box at top of sidebar
2. Search for a feed name
3. Verify filtered results
4. Clear search
5. Click "All Articles"
6. Verify all articles display
7. Click on a specific feed
8. Verify only that feed's articles display

**Expected Results:**
- Search filters feeds in real-time
- Only matching feeds display
- Clearing search shows all feeds
- "All Articles" shows all articles
- Clicking feed shows only that feed's articles

---

### Scenario 9: Refresh Feeds

**Steps:**
1. Click "Refresh All" button
2. Watch for loading indicator
3. Wait for refresh to complete
4. Verify new articles appear
5. Check for any error messages

**Expected Results:**
- Refresh button shows loading state
- All feeds are refreshed
- New articles appear
- No errors in console
- UI remains responsive during refresh

---

### Scenario 10: Settings and Preferences

**Steps:**
1. Click "Settings" button
2. Change theme (light/dark)
3. Adjust font size
4. Change content width
5. Toggle "Show images"
6. Save settings
7. Verify changes apply

**Expected Results:**
- Settings dialog opens
- Theme changes immediately
- Font size adjusts
- Content width changes
- Images toggle on/off
- Settings persist after reload

---

## 🐛 Bug Reporting

### What to Report

**Critical Bugs:**
- App crashes
- Data loss
- Cannot add feeds
- Cannot read articles
- Database errors

**Major Bugs:**
- Features not working
- UI broken
- Performance issues
- Mobile issues

**Minor Bugs:**
- Visual glitches
- Typos
- Minor UX issues

### How to Report

**Include:**
1. **Steps to reproduce**
2. **Expected behavior**
3. **Actual behavior**
4. **Screenshots** (if applicable)
5. **Browser and OS**
6. **Console errors** (F12 → Console)

**Template:**
```
**Bug Title:** [Brief description]

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected:** [What should happen]

**Actual:** [What actually happened]

**Environment:**
- Browser: Chrome 120
- OS: macOS 14
- Screen: Desktop

**Console Errors:**
[Paste any errors from console]

**Screenshots:**
[Attach screenshots]
```

---

## 💡 Feature Requests

### What to Suggest

**Good Feature Requests:**
- Solve a real problem
- Align with FlowRSS vision
- Feasible to implement
- Benefit multiple users

**Template:**
```
**Feature Title:** [Brief description]

**Problem:** [What problem does this solve?]

**Solution:** [How would this feature work?]

**Use Case:** [When would you use this?]

**Priority:** [Low/Medium/High]
```

---

## 📊 Performance Testing

### Metrics to Check

**Load Time:**
- Initial page load: < 2 seconds
- Feed refresh: < 5 seconds
- Article load: < 1 second

**Memory Usage:**
- Idle: < 100 MB
- With 50 feeds: < 200 MB
- With 100 feeds: < 300 MB

**Database:**
- Query time: < 100ms
- Write time: < 50ms
- Storage: < 50 MB for 1000 articles

### How to Test

**Chrome DevTools:**
1. Open DevTools (F12)
2. Go to "Performance" tab
3. Click "Record"
4. Perform actions
5. Stop recording
6. Analyze results

**Memory:**
1. Open DevTools (F12)
2. Go to "Memory" tab
3. Take heap snapshot
4. Perform actions
5. Take another snapshot
6. Compare

---

## ✅ Acceptance Criteria

### Must Work
- [x] Onboarding flow
- [x] Subscribe to feeds
- [x] Read articles
- [x] Star/save articles
- [x] Create folders
- [x] Move feeds to folders
- [x] Fediverse feeds load
- [x] Context menus work
- [x] Mobile responsive

### Should Work
- [ ] Drag-and-drop (needs testing)
- [ ] Nested folders
- [ ] Mark all as read
- [ ] Unsubscribe
- [ ] Search feeds
- [ ] Refresh all

### Nice to Have
- [ ] Keyboard shortcuts
- [ ] OPML export
- [ ] Folder statistics
- [ ] Smart folders

---

## 🎉 Success Criteria

**Beta is successful if:**
1. ✅ No critical bugs
2. ✅ All core features work
3. ✅ Positive user feedback
4. ✅ Performance is acceptable
5. ✅ Mobile experience is good

**Ready for public launch if:**
1. All "Must Work" items pass
2. 90%+ of "Should Work" items pass
3. No major bugs
4. Performance meets targets
5. User satisfaction > 4/5

---

## 📞 Contact

**Questions?** Open an issue on GitHub  
**Bugs?** Use the bug report template  
**Feedback?** Email beta@flowrss.com

---

**Thank you for beta testing FlowRSS! Your feedback is invaluable.** 🙏

*Last Updated: January 19, 2025*
