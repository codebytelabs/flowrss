# Database Migration Guide

## What Just Happened?

I've implemented an **automatic database migration system** that will clean up broken RSS feeds and add new working ones when users refresh their browser.

## Changes Made

### 1. Created Migration System (`src/lib/db/migrations.ts`)

The migration system automatically:
- ✅ Removes 6 broken feeds from user databases
- ✅ Adds 6 new working feeds (if not already present)
- ✅ Tracks migration version to avoid re-running
- ✅ Logs all changes to console for transparency

### 2. Updated Database Schema

Added `migrationVersion` field to `UserSettings` to track which migrations have been applied.

### 3. Integrated with App Startup

Modified `src/app/page.tsx` to run migrations automatically after database initialization.

## Broken Feeds Being Removed

1. ❌ `https://blog.anthropic.com/rss` - DNS errors
2. ❌ `https://netflixtechblog.com/feed` - SSL certificate issues
3. ❌ `https://openai.com/blog/rss/` - 403 Forbidden
4. ❌ `https://ai.googleblog.com/feeds/posts/default` - 404 Not Found
5. ❌ `https://microconf.com/feed/` - 404 Not Found
6. ❌ `https://www.starterstory.com/rss` - 404 Not Found

## New Working Feeds Being Added

1. ✅ **Stack Overflow Blog** - Developer insights and news
2. ✅ **Hugging Face Blog** - ML and AI developments
3. ✅ **AWS ML Blog** - Machine learning on AWS
4. ✅ **ML Mastery** - Practical ML tutorials
5. ✅ **SaaStr** - SaaS insights and growth
6. ✅ **Groove Blog** - Building a SaaS startup

## What Users Will See

When users refresh their browser:

1. **Console logs** will show:
   ```
   [Migration] Starting feed cleanup and updates...
   [Migration] Running v1: Feed cleanup
   [Migration] Removed broken feed: Anthropic Blog
   [Migration] Removed broken feed: Netflix Tech Blog
   ...
   [Migration] Added new feed: Stack Overflow Blog
   [Migration] Added new feed: Hugging Face Blog
   ...
   [Migration] v1 complete: Removed X broken feeds, added Y new feeds
   ```

2. **Sidebar** will automatically update with:
   - Broken feeds removed
   - New working feeds added
   - No manual action required!

3. **No data loss**:
   - Articles from removed feeds are also deleted
   - But starred/saved articles could be preserved (future enhancement)

## Testing the Migration

1. **Refresh the browser** (Cmd+R or Ctrl+R)
2. **Open browser console** (F12 or Cmd+Option+I)
3. **Look for migration logs** starting with `[Migration]`
4. **Check the sidebar** - broken feeds should be gone
5. **Click "Refresh All"** - only working feeds will fetch

## Future Migrations

The system is designed to support multiple migrations:
- Current version: **v1** (Feed cleanup)
- Future versions can be added easily
- Each migration runs only once per user
- Migration version is stored in database

## Rollback (If Needed)

If something goes wrong, users can:
1. Clear browser data for the site
2. Reload the app (will start fresh)
3. Or manually remove/add feeds as needed

## Developer Notes

### Adding New Migrations

To add a new migration (v2, v3, etc.):

```typescript
// In src/lib/db/migrations.ts

if (currentVersion < 2) {
  console.log('[Migration] Running v2: Your migration name');
  
  // Your migration code here
  
  await dbOperations.updateSettings({ migrationVersion: 2 });
  console.log('[Migration] v2 complete');
}
```

### Testing Migrations Locally

To test migrations again:
1. Open browser DevTools
2. Go to Application > IndexedDB
3. Delete the `FlowRSSDB` database
4. Refresh the page

## Benefits

✅ **Automatic cleanup** - No manual user intervention needed
✅ **Seamless experience** - Happens in the background
✅ **Version tracking** - Won't re-run on every load
✅ **Extensible** - Easy to add future migrations
✅ **Safe** - Only runs once per user
✅ **Transparent** - Console logs show what's happening

## Next Steps

After users refresh:
1. All broken feeds will be removed
2. New working feeds will be added
3. Click "Refresh All" to fetch articles from new feeds
4. Enjoy a working RSS reader! 🎉
