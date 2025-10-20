# 🧪 Test New Features - Quick Guide

**Time needed:** 5 minutes  
**Features to test:** Pull-to-refresh & Drag-and-drop

---

## 🚀 Quick Start

```bash
# Start the app
npm run dev

# Open in browser
open http://localhost:3000
```

---

## ✅ Test 1: Pull-to-Refresh (2 minutes)

### Desktop Testing
1. Open FlowRSS in browser
2. Click on "All Articles" or any feed
3. Scroll to the very top of the article list
4. **Click and hold** at the top of the list
5. **Drag down** with mouse
6. You should see:
   - FlowRSS logo appears
   - Logo rotates as you drag
   - Text says "Pull to refresh"
   - When you drag far enough: "Release to refresh"
7. **Release mouse** when it says "Release to refresh"
8. Watch the logo spin while refreshing
9. Articles should reload

### Mobile Testing (if you have a phone)
1. Open FlowRSS on your phone
2. Go to article list
3. **Pull down** with your finger
4. Same behavior as desktop
5. Release to refresh

### Expected Behavior
- ✅ Logo appears when pulling
- ✅ Logo rotates based on pull distance
- ✅ Text changes: "Pull" → "Release" → "Refreshing"
- ✅ Articles refresh after release
- ✅ Smooth animations

---

## ✅ Test 2: Drag-and-Drop (3 minutes)

### Test A: Drag Feed to Folder
1. Look at your sidebar (left side)
2. Find any feed (e.g., "Hacker News")
3. **Click and hold** on the feed
4. **Drag** it over a folder
5. You should see:
   - Feed becomes semi-transparent while dragging
   - Folder gets a green border when you hover over it
6. **Release** to drop the feed into the folder
7. Feed should move into that folder instantly

### Test B: Drag Feed to Category
1. Find a feed that's not in a category
2. **Click and hold** on the feed
3. **Drag** it over a category (e.g., "Technology")
4. You should see:
   - Category gets a green border
5. **Release** to drop
6. Feed should appear in that category

### Test C: Invalid Drop
1. Drag a feed
2. Try to drop it on itself or an invalid location
3. You should see:
   - Red background on invalid targets
   - Feed returns to original position if dropped on invalid target

### Expected Behavior
- ✅ Feeds are draggable
- ✅ Visual feedback (opacity, borders)
- ✅ Green border = valid drop
- ✅ Red background = invalid drop
- ✅ Feed moves instantly on drop
- ✅ Sidebar updates automatically

---

## 🐛 Troubleshooting

### Pull-to-Refresh Not Working
- Make sure you're at the **top** of the article list
- Try scrolling up first
- Refresh the page (Cmd+R)

### Drag-and-Drop Not Working
- Make sure you **click and hold** (not just click)
- Try dragging slowly
- Check browser console for errors (F12)

### Nothing Happens
- Hard refresh: **Cmd+Shift+R** (Mac) or **Ctrl+Shift+F5** (Windows)
- Clear browser cache
- Try incognito mode

---

## 📊 What to Look For

### Good Signs ✅
- Smooth animations (no lag)
- Instant feedback
- Clear visual indicators
- No errors in console
- Features work on first try

### Bad Signs ❌
- Laggy animations
- No visual feedback
- Console errors
- Features don't work
- UI doesn't update

---

## 🎉 Success Criteria

You're ready to launch if:
- [x] Pull-to-refresh works smoothly
- [x] Drag-and-drop works reliably
- [x] Visual feedback is clear
- [x] No console errors
- [x] UI updates instantly

---

## 📝 Report Issues

If you find bugs:
1. Open browser console (F12)
2. Take a screenshot
3. Note what you were doing
4. Check for error messages

---

## 🚀 Next Steps

Once testing is complete:
1. ✅ Features work → Deploy to production
2. ❌ Issues found → Report them for fixes
3. 🎉 Everything perfect → Launch!

---

**Happy Testing!** 🧪

*Time to make FlowRSS the best RSS reader out there!*
