# Article List Refresh Fix

## Issue
After clicking "Refresh All" in the sidebar, articles were fetched successfully but the article list didn't update automatically. Users had to manually refresh the page or navigate away and back to see the new articles.

## Root Cause
The sidebar was fetching feeds and updating its own state, but wasn't notifying the article list component that new articles were available. The components weren't synchronized.

## Solution
Implemented a proper event-based communication system:

1. **Sidebar dispatches event** - After fetching feeds, the sidebar now dispatches a `refreshFeeds` custom event
2. **MainLayout listens** - The MainLayout component listens for this event and updates both the sidebar key and article list key
3. **ArticleList refreshes** - When the article list key changes, React re-renders the component and loads the new articles

## Changes Made

### src/components/layout/sidebar.tsx
```typescript
const handleRefreshAll = async () => {
  setIsRefreshing(true);
  console.log('[Sidebar] Starting refresh all feeds');
  await fetchAllFeeds(false);
  await loadFeeds();
  setIsRefreshing(false);
  console.log('[Sidebar] Refresh complete, dispatching event');
  // Notify other components that feeds have been refreshed
  window.dispatchEvent(new CustomEvent('refreshFeeds'));
};
```

### src/components/layout/main-layout.tsx
```typescript
const handleRefreshFeeds = () => {
  console.log('[MainLayout] Refresh feeds event received');
  setRefreshKey(prev => prev + 1);
  setArticleListKey(prev => prev + 1); // Also refresh article list
};
```

## Testing
1. Open FlowRSS
2. Complete onboarding and subscribe to feeds
3. Click "Refresh All" in sidebar
4. Articles should appear immediately without manual page refresh

## Result
✅ Articles now appear immediately after refresh  
✅ No manual page refresh needed  
✅ Smooth user experience  
✅ Proper component synchronization  

## Related Files
- `src/components/layout/sidebar.tsx`
- `src/components/layout/main-layout.tsx`
- `src/components/feed/article-list.tsx`

*Fixed: January 19, 2025*
