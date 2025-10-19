# 🔍 Debug Guide - Starred/Saved Navigation

## Added Console Logging

I've added comprehensive console logging to help debug why Starred/Saved navigation isn't working.

### What to Do:

1. **Open Browser Console** (F12 or Cmd+Option+I)
2. **Clear the console** (click the 🚫 icon)
3. **Click "Starred" button** in sidebar
4. **Watch the console output**

### Expected Console Output:

```
[Sidebar] Starred clicked, clearing feed and dispatching event
[ArticleList] Received showStarred event
[ArticleList] Loading articles with filterMode: starred feed: none
[ArticleList] Fetching starred articles
[ArticleList] Loaded X articles
```

### What Each Log Means:

1. **`[Sidebar] Starred clicked`** - Button click registered
2. **`[ArticleList] Received showStarred event`** - Event listener fired
3. **`[ArticleList] Loading articles with filterMode: starred`** - Filter mode changed
4. **`[ArticleList] Fetching starred articles`** - Database query started
5. **`[ArticleList] Loaded X articles`** - Articles loaded successfully

---

## Possible Issues & Solutions:

### Issue 1: No Console Logs at All
**Symptom:** Nothing appears in console when clicking Starred/Saved

**Possible Causes:**
- Console is filtered (check filter settings)
- JavaScript error preventing execution
- Component not mounted

**Solution:**
- Clear all console filters
- Check for red error messages
- Refresh the page

---

### Issue 2: Only Sidebar Log Appears
**Symptom:** See `[Sidebar] Starred clicked` but nothing else

**Possible Causes:**
- Event listener not attached
- ArticleList component not mounted
- Event name mismatch

**Solution:**
This means the event is being dispatched but not received. Let me add a different approach using a callback instead of events.

---

### Issue 3: Event Received But No Articles Load
**Symptom:** See all logs but articles don't change

**Possible Causes:**
- Database query failing
- No starred/saved articles exist
- State not updating UI

**Solution:**
- Check if you have any starred/saved articles
- Try starring an article first, then click Starred

---

### Issue 4: Feed Reset Interfering
**Symptom:** Filter changes but immediately resets

**Possible Causes:**
- Feed change triggering reset
- Race condition in useEffect

**Solution:**
Already handled - feed reset only happens when feed is not null

---

## Alternative Fix (If Events Don't Work)

If the event-based approach isn't working, we can use a callback-based approach instead:

### Step 1: Add filter prop to ArticleList
```typescript
interface ArticleListProps {
  feed: Feed | null;
  selectedArticle: Article | null;
  onSelectArticle: (article: Article) => void;
  filterMode?: 'all' | 'starred' | 'saved'; // Add this
}
```

### Step 2: MainLayout manages filter state
```typescript
const [filterMode, setFilterMode] = useState<'all' | 'starred' | 'saved'>('all');
```

### Step 3: Sidebar calls callback
```typescript
<Button onClick={() => onFilterChange('starred')}>
  Starred
</Button>
```

This is more reliable than events but requires more prop drilling.

---

## Quick Test Steps:

1. **Star an article** - Click the star icon on any article
2. **Open console** - F12 or Cmd+Option+I
3. **Click "Starred"** in sidebar
4. **Check console** - Should see the log sequence above
5. **Check UI** - Should show only starred articles

If you see the logs but UI doesn't update, the issue is in the rendering logic.
If you don't see the logs, the issue is in the event system.

---

## What to Report:

Please copy and paste the console output when you click "Starred" or "Saved".

This will help me identify exactly where the issue is:
- Event dispatch?
- Event reception?
- Database query?
- State update?
- UI rendering?

---

## Temporary Workaround:

While debugging, you can manually test the database queries in console:

```javascript
// Open console and run:
const { dbOperations } = await import('/src/lib/db/schema');
const starred = await dbOperations.getStarredArticles(50);
console.log('Starred articles:', starred);
```

This will show if the database queries work correctly.

---

**Next Steps:**
1. Refresh your browser
2. Open console
3. Click "Starred" button
4. Share the console output with me

This will help me fix the exact issue! 🔍
