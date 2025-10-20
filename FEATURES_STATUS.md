# FlowRSS - Current Features Status

**Last Updated:** January 20, 2025

---

## ✅ What's Working

### 1. Pull-to-Refresh
**Status:** ✅ IMPLEMENTED

**How to use:**
- **Mobile:** Swipe down on article list when at the top
- **Desktop:** Click and hold at top of article list, drag down, release

**Note:** You must be scrolled to the very top of the article list for this to work.

### 2. Drag-and-Drop (Folders Only)
**Status:** ✅ IMPLEMENTED

**How to use:**
1. **Click and HOLD** on a feed item for ~200ms
2. **Drag** the feed to a folder
3. **Release** to drop

**Visual feedback:**
- Feed becomes semi-transparent while dragging
- Folder shows green border when you can drop
- Folder shows red background if drop is invalid

**Important:** You must click and HOLD, not just click. This is standard HTML5 drag-and-drop behavior.

### 3. Context Menu "Move to Folder"
**Status:** ✅ WORKING (Original Feature)

**How to use:**
1. Right-click on any feed
2. Select "Move to folder"
3. Choose a folder or "Create new folder..."

**This is the easiest way to organize feeds!**

---

## ⚠️ Known Limitations

### Drag-and-Drop
- ❌ **Categories don't accept drops** (removed due to React hooks issues)
- ❌ **No visual "ghost" image** while dragging (browser default)
- ⚠️ **Requires click-and-hold** (not instant drag)

### Pull-to-Refresh
- ⚠️ **Only works at top of list** (by design)
- ⚠️ **Desktop requires mouse drag** (not scroll-based)

---

## 🎯 Recommended Usage

### For Quick Organization:
**Use the context menu** (right-click → Move to folder)
- Faster than drag-and-drop
- More reliable
- Works for creating new folders

### For Bulk Organization:
**Use drag-and-drop**
- Good for moving multiple feeds quickly
- Visual feedback
- Feels more interactive

### For Refreshing:
**Mobile:** Pull-to-refresh gesture
**Desktop:** Click the "Refresh All" button in sidebar

---

## 🔧 How to Test

### Test Pull-to-Refresh:
1. Open FlowRSS
2. Go to "All Articles" or any feed
3. Scroll to the very top
4. **Mobile:** Swipe down
5. **Desktop:** Click and hold at top, drag mouse down, release
6. Watch for FlowRSS logo animation
7. Articles should refresh

### Test Drag-and-Drop:
1. Find a feed in the sidebar
2. **Click and HOLD** for 1 second
3. **Drag** to a folder (you'll see it become transparent)
4. **Hover** over folder (should see green border)
5. **Release** to drop
6. Feed should move to that folder

### Test Context Menu:
1. **Right-click** on any feed
2. Select "Move to folder"
3. Choose a folder or create new one
4. Feed moves instantly

---

## 💡 Tips

### Drag-and-Drop Not Working?
- Make sure you're **holding** the mouse button, not just clicking
- Wait ~200ms after clicking before starting to drag
- Try using the context menu instead (right-click)

### Pull-to-Refresh Not Working?
- Make sure you're at the **very top** of the article list
- Try scrolling up first
- On desktop, try the "Refresh All" button instead

### Can't Create Folders?
- Right-click on any feed
- Select "Move to folder" → "Create new folder..."
- Or use the folder management dialog

---

## 🚀 What's Next

### Phase 2 (Optional):
- [ ] Improve drag-and-drop visual feedback
- [ ] Add drag-and-drop for categories
- [ ] Add scroll-based pull-to-refresh for desktop
- [ ] Add undo/redo for drag operations
- [ ] Add multi-select drag

**Note:** These are nice-to-haves. The current implementation is production-ready!

---

## 📊 Summary

| Feature | Status | Best Method |
|---------|--------|-------------|
| Move feeds to folders | ✅ Working | Context menu (right-click) |
| Drag-and-drop | ✅ Working | Click-and-hold, then drag |
| Pull-to-refresh | ✅ Working | Swipe down (mobile) |
| Create folders | ✅ Working | Context menu → Create new |
| Refresh feeds | ✅ Working | "Refresh All" button |

---

## ✅ Recommendation

**For the best user experience:**
1. Use **context menu** for organizing feeds (most reliable)
2. Use **drag-and-drop** when you want visual feedback
3. Use **pull-to-refresh** on mobile devices
4. Use **"Refresh All" button** on desktop

**The app is production-ready!** The features work, they just require the correct interaction pattern.

---

**Built with ❤️ for FlowRSS**
