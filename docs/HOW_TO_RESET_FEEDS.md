# 🔄 How to Reset Feeds and Start Fresh

## Why Your Old Feeds Persist

### The Issue:
- **IndexedDB** stores your feeds in the browser
- **Persists** through cache clearing and `.next` deletion
- **Migration** only runs once (already completed)
- **Old feeds** remain in your database

### What Doesn't Clear IndexedDB:
- ❌ Clearing browser cache
- ❌ Deleting `.next` folder
- ❌ Hard refresh (Cmd+Shift+R)
- ❌ Restarting dev server

### What DOES Clear IndexedDB:
- ✅ Manually deleting the database
- ✅ Using browser DevTools
- ✅ Using reset functions

---

## 🚀 Quick Solutions

### Method 1: Browser Console (Easiest)

1. **Open browser console** (F12 or Cmd+Option+I)
2. **Run this command:**
   ```javascript
   indexedDB.deleteDatabase('FlowRSSDB'); location.reload();
   ```
3. **Done!** You'll see the welcome screen again

### Method 2: Use Reset Functions (Better)

1. **Open browser console**
2. **Choose one:**

   **Option A: Complete Reset (Recommended)**
   ```javascript
   await resetDatabase();
   location.reload();
   ```
   - Deletes entire database
   - Fresh start
   - See welcome screen

   **Option B: Clear Feeds Only**
   ```javascript
   await clearAllFeeds();
   location.reload();
   ```
   - Keeps settings
   - Clears feeds and articles
   - See welcome screen

### Method 3: Browser DevTools

1. **Open DevTools** (F12)
2. **Go to Application tab**
3. **Click "Storage" in left sidebar**
4. **Click "IndexedDB"**
5. **Right-click "FlowRSSDB"**
6. **Click "Delete database"**
7. **Refresh page**

---

## 📋 Step-by-Step: Fresh Start

### Complete Reset Process:

1. **Open your app** in browser
2. **Open console** (F12 or Cmd+Option+I)
3. **Delete database:**
   ```javascript
   indexedDB.deleteDatabase('FlowRSSDB');
   ```
4. **Refresh page:**
   ```javascript
   location.reload();
   ```
5. **See welcome screen** ✅
6. **Select new curated packs** from updated list
7. **Click "Continue"**
8. **Feeds auto-add and fetch** ✅

---

## 🎯 What You'll See After Reset

### Welcome Screen:
1. **Introduction** - App features
2. **Choose Feeds** - 11 curated packs
3. **New Categories:**
   - Tech News (5 feeds)
   - Developer & Engineering (5 feeds)
   - AI & Machine Learning (5 feeds)
   - Design & UX (5 feeds)
   - Business & Startups (5 feeds)
   - Crypto & Web3 (4 feeds)
   - News & World (5 feeds)
   - Science & Research (5 feeds)
   - Culture & Longform (5 feeds)
   - Productivity & Growth (5 feeds)
   - Fun & Comics (2 feeds)

### After Selection:
- Feeds added to database
- Auto-fetch triggered
- Articles load
- Ready to read!

---

## 🔍 Verify Your Feeds

### Check Current Feeds:

**In Console:**
```javascript
const { dbOperations } = await import('/src/lib/db/schema');
const feeds = await dbOperations.getAllFeeds();
console.table(feeds.map(f => ({ title: f.title, url: f.url })));
```

### Check Feed Count:
```javascript
const { dbOperations } = await import('/src/lib/db/schema');
const feeds = await dbOperations.getAllFeeds();
console.log(`You have ${feeds.length} feeds`);
```

### Check Articles:
```javascript
const { dbOperations } = await import('/src/lib/db/schema');
const articles = await dbOperations.getAllArticles();
console.log(`You have ${articles.length} articles`);
```

---

## 🛠️ Troubleshooting

### Issue: "Database deletion blocked"

**Cause:** Multiple tabs open

**Solution:**
1. Close all other tabs with the app
2. Try deleting again
3. Or close browser completely and reopen

### Issue: Reset functions not available

**Cause:** Page not fully loaded

**Solution:**
1. Wait for page to load completely
2. Refresh page
3. Try again

### Issue: Welcome screen doesn't appear

**Cause:** Database not fully deleted

**Solution:**
1. Check DevTools > Application > IndexedDB
2. Verify FlowRSSDB is gone
3. If still there, delete manually
4. Refresh page

### Issue: Old feeds still showing

**Cause:** Database not cleared

**Solution:**
1. Run `resetDatabase()` again
2. Check console for errors
3. Try Method 3 (DevTools) instead

---

## 📊 Understanding IndexedDB

### What is IndexedDB?
- Browser's local database
- Stores structured data
- Persists across sessions
- Survives cache clearing

### What FlowRSS Stores:
- **Feeds** - Your subscriptions
- **Articles** - Feed content
- **Settings** - App preferences
- **Categories** - Feed organization

### Why It Persists:
- Designed for offline use
- Intentionally persistent
- Only cleared manually
- Or by deleting database

---

## 🎉 After Reset

### You'll Have:
- ✅ Clean database
- ✅ Updated curated packs
- ✅ 51 premium feeds available
- ✅ 11 categories to choose from
- ✅ Fresh start

### Next Steps:
1. Select categories you're interested in
2. Click "Continue"
3. Wait for feeds to fetch
4. Start reading!

---

## 💡 Pro Tips

### For Development:
- Keep console open
- Use `resetDatabase()` for quick resets
- Test onboarding flow easily
- Verify feed updates

### For Testing:
- Reset between test runs
- Verify migration behavior
- Test different pack combinations
- Check auto-fetch works

### For Users:
- Reset if feeds seem broken
- Fresh start if confused
- Try different categories
- Experiment with packs

---

## 🚨 Important Notes

### Data Loss Warning:
- Resetting deletes ALL data
- Starred articles will be lost
- Saved articles will be lost
- Settings will reset
- Cannot be undone

### Before Resetting:
- Note which feeds you want
- Screenshot your starred articles
- Export important data (if needed)
- Understand you'll start fresh

### After Resetting:
- Re-select your categories
- Re-star important articles
- Re-configure settings
- Feeds will re-fetch

---

## 📝 Quick Reference

### Reset Commands:
```javascript
// Complete reset
indexedDB.deleteDatabase('FlowRSSDB'); location.reload();

// Or use helper
await resetDatabase(); location.reload();

// Clear feeds only
await clearAllFeeds(); location.reload();
```

### Check Status:
```javascript
// Check feeds
const { dbOperations } = await import('/src/lib/db/schema');
const feeds = await dbOperations.getAllFeeds();
console.log(feeds);

// Check migration version
const settings = await dbOperations.getSettings();
console.log('Migration version:', settings?.migrationVersion);
```

---

## ✅ Summary

**To see updated curated feeds:**
1. Open console
2. Run: `indexedDB.deleteDatabase('FlowRSSDB'); location.reload();`
3. Select new categories
4. Enjoy 51 premium feeds!

**That's it!** 🎊

---

**Last Updated:** January 2025
**Status:** ✅ READY TO USE
