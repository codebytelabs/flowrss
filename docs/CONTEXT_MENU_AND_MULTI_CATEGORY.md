# Context Menu & Multi-Category Support

## Features Implemented

### 1. Enhanced "Move to Folder" Context Menu

**Right-click on any feed to see:**
- 📋 No folder (remove from folder)
- ➕ **Create new folder...** (NEW!)
- Separator
- List of existing folders

**How it works:**
1. Right-click on a feed
2. Select "Move to folder" → "Create new folder..."
3. Dialog opens with folder creation form
4. After creating folder, feed is automatically moved to it
5. Seamless workflow!

### 2. Multi-Category Support

**Feeds can now appear in multiple categories:**
- Feed type updated to support `categories: string[]`
- Backwards compatible with single `category: string`
- Feeds appear in all their assigned categories
- No duplication - same feed, multiple views

**Example:**
```typescript
{
  title: "Hacker News",
  category: "Technology",  // Primary (backwards compatible)
  categories: ["Technology", "News", "Development"]  // Multi-category
}
```

This feed will appear in:
- 💻 Technology category
- 📰 News category  
- 👨‍💻 Development category

---

## Implementation Details

### Files Modified

1. **src/components/sidebar/feed-item.tsx**
   - Added "Create new folder..." option to context menu
   - Added "Create new folder..." option to dropdown menu
   - Dispatches `createFolder` event with feed ID

2. **src/components/sidebar/folder-list.tsx**
   - Listens for `createFolder` event
   - Opens folder creation dialog
   - Auto-moves feed to new folder after creation

3. **src/components/dialogs/folder-management-dialog.tsx**
   - Returns created folder ID in `onSuccess` callback
   - Allows parent to handle post-creation actions

4. **src/components/sidebar/category-list.tsx**
   - Updated to support multi-category feeds
   - Checks both `category` and `categories` fields
   - Avoids duplicate feed entries

5. **src/types/index.ts**
   - Added `categories?: string[]` to Feed interface
   - Maintains backwards compatibility with `category?: string`

---

## User Workflows

### Workflow 1: Create Folder from Context Menu

1. User right-clicks on a feed
2. Selects "Move to folder" → "Create new folder..."
3. Dialog opens
4. User enters folder name, selects icon and color
5. Clicks "Create"
6. Feed is automatically moved to new folder
7. Folder appears in sidebar with feed inside

**Benefits:**
- ✅ No need to create folder first
- ✅ Immediate organization
- ✅ Seamless workflow
- ✅ Fewer clicks

### Workflow 2: Multi-Category Feeds

**Scenario:** Tech news feed relevant to multiple categories

1. Feed has `categories: ["Technology", "News", "Business"]`
2. Feed appears in all three categories
3. User can access from any category
4. Same feed, multiple entry points
5. Better discoverability

**Benefits:**
- ✅ Flexible organization
- ✅ Better discoverability
- ✅ No duplication of data
- ✅ User-friendly

---

## Technical Details

### Event System

**Create Folder Event:**
```typescript
window.dispatchEvent(new CustomEvent('createFolder', { 
  detail: { feedId: feed.id } 
}));
```

**Listener:**
```typescript
const handleCreateFolder = (e: CustomEvent) => {
  setPendingFeedId(e.detail?.feedId || null);
  setShowCreateDialog(true);
};
```

### Multi-Category Logic

```typescript
// Support both single and multiple categories
const categories = feed.categories || 
                  (feed.category ? [feed.category] : ['Uncategorized']);

categories.forEach(category => {
  if (!acc[category]) {
    acc[category] = [];
  }
  // Avoid duplicates
  if (!acc[category].find(f => f.id === feed.id)) {
    acc[category].push(feed);
  }
});
```

---

## Context Menu Structure

```
Right-click on feed:
┌─────────────────────────┐
│ Move to folder      ▶   │
│ Mark all as read        │
│ ─────────────────────── │
│ Unsubscribe             │
└─────────────────────────┘

Submenu:
┌─────────────────────────┐
│ 📋 No folder            │
│ ─────────────────────── │
│ ➕ Create new folder... │ ← NEW!
│ ─────────────────────── │
│ 💻 Work                 │
│ 📚 Reading List         │
│ 🌐 Fediverse            │
└─────────────────────────┘
```

---

## Benefits

### For Users
- **Faster organization** - Create folders on the fly
- **Better discoverability** - Feeds in multiple categories
- **Flexible workflow** - Organize as you browse
- **Intuitive** - Right-click to organize

### For FlowRSS
- **Professional UX** - Matches user expectations
- **Powerful organization** - Multi-category support
- **Scalable** - Works with many feeds
- **Polished** - Attention to detail

---

## Testing

### Test Create Folder from Context Menu
1. Right-click on any feed
2. Select "Move to folder" → "Create new folder..."
3. Enter folder name "Test"
4. Select icon and color
5. Click "Create"
6. Verify feed moved to new folder
7. Verify folder appears in sidebar

### Test Multi-Category
1. Add a feed with multiple categories (requires manual DB edit for now)
2. Verify feed appears in all categories
3. Click feed from different categories
4. Verify same articles load
5. Verify no duplication

---

## Future Enhancements

### UI for Multi-Category
- [ ] Allow users to assign multiple categories to feeds
- [ ] Category picker in feed settings
- [ ] Visual indicator for multi-category feeds
- [ ] Bulk category assignment

### Smart Categorization
- [ ] Auto-suggest categories based on feed content
- [ ] ML-based category prediction
- [ ] User-defined category rules
- [ ] Import category mappings

---

## Summary

**Implemented:**
- ✅ "Create new folder..." in context menu
- ✅ Auto-move feed to new folder
- ✅ Multi-category support in data model
- ✅ Multi-category display in sidebar
- ✅ Backwards compatibility
- ✅ No duplication

**Result:**
- Professional, polished UX
- Flexible organization system
- Intuitive workflows
- Ready for beta!

*Implemented: January 19, 2025*
