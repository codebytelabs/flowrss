# Complete Fix Plan - FlowRSS Issues

## 🔴 Critical Issues (Fix Immediately)

### Issue 1: Database Initialization Failure on First Load
**Problem:** "Failed to initialize database" error on first page load
**Root Cause:** IndexedDB async initialization race condition
**Solution:** Add retry logic with exponential backoff

### Issue 2: No Auto-Fetch After Migration
**Problem:** Articles don't load until manual "Refresh All"
**Root Cause:** Auto-fetch only triggers if `lastFetched` exists
**Solution:** Trigger automatic fetch after migration completes

### Issue 3: Boring Article List Design
**Problem:** Plain text list, no visual appeal
**Current State:** Simple title + description
**Desired State:** Reddit-like cards with:
- Thumbnail images
- Source favicon
- Read time estimate
- Better typography
- Hover effects
- Visual hierarchy

## 🟡 Major Issues (Fix Today)

### Issue 4: Next.js Metadata Warnings
**Problem:** Console spam with metadata warnings
**Solution:** Create proper viewport export

### Issue 5: Duplicate Feed Fetches
**Problem:** Each feed fetched twice
**Solution:** Deduplicate fetch requests

### Issue 6: No Visual Feedback During Migration
**Problem:** User doesn't see what's happening
**Solution:** Add progress indicators

## 🟢 Minor Issues (Fix Later)

### Issue 7: Missing PWA Icons
**Problem:** 404 for apple-touch-icon
**Solution:** Add proper icon files

### Issue 8: No Article Images
**Problem:** Articles don't show featured images
**Solution:** Extract and display images from RSS

## Implementation Order

1. Fix database initialization (5 min)
2. Auto-fetch after migration (5 min)
3. Redesign article cards (20 min)
4. Fix metadata warnings (5 min)
5. Deduplicate fetches (5 min)
6. Add loading states (10 min)

**Total Time:** ~50 minutes

Let's start!
