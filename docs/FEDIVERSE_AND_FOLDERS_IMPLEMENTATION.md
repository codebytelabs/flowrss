# Fediverse Feeds & Folder Organization Implementation

## Overview

This document describes the implementation of two major features:
1. **Fediverse Feed Integration** - Mastodon, Lemmy, and other decentralized social feeds
2. **User-Created Folders & Categories** - Organize feeds with custom folders and nested categories

---

## Part 1: Fediverse Feed Integration

### What Was Added

#### New Curated Packs

**1. Fediverse - Mastodon** (`fediverse-mastodon`)
- Mastodon Official (@Gargron)
- Mozilla on Fosstodon
- #OpenSource hashtag feed
- #Privacy hashtag feed
- #Technology on TechHub
- #Programming on Hachyderm
- #Linux on Fosstodon

**2. Fediverse - Lemmy** (`fediverse-lemmy`)
- Linux Community (lemmy.ml)
- Programming (programming.dev)
- Privacy (lemmy.ml)
- Technology (beehaw.org)
- Self-Hosted (lemmy.world)
- Rust Programming (programming.dev)
- Open Source (lemmy.ml)

**3. Fediverse - Mixed** (`fediverse-mixed`)
- Curated mix of Mastodon, Lemmy, and other Fediverse platforms
- Includes trending posts and popular accounts

### Feed URL Patterns

#### Mastodon
```
User feeds:    https://{instance}/@{username}.rss
Hashtag feeds: https://{instance}/tags/{tag}.rss

Examples:
- https://mastodon.social/@Gargron.rss
- https://fosstodon.org/@mozilla.rss
- https://mastodon.social/tags/opensource.rss
```

#### Lemmy (via OpenRSS.org)
```
Communities:    https://openrss.org/{instance}/c/{community}
User posts:     https://openrss.org/{instance}/u/{username}
Local timeline: https://openrss.org/{instance}/local
All timeline:   https://openrss.org/{instance}/all

Examples:
- https://openrss.org/lemmy.ml/c/linux
- https://openrss.org/programming.dev/c/programming
- https://openrss.org/lemmy.world/all/hot
```

### Popular Instances

#### Mastodon
- **mastodon.social** - Flagship instance (largest)
- **fosstodon.org** - FOSS community (~23k members)
- **techhub.social** - Tech professionals (~30k members)
- **hachyderm.io** - Hackers and tech enthusiasts (~13k members)
- **universeodon.com** - Science and education (~36k members)

#### Lemmy
- **lemmy.world** - General purpose, Reddit-like
- **lemmy.ml** - Original instance
- **beehaw.org** - Well-moderated communities
- **programming.dev** - Programming-focused
- **sh.itjust.works** - Tech and general topics

### How Users Can Add More

**Mastodon:**
1. Find any Mastodon account
2. Add `.rss` to the profile URL
3. Example: `https://mastodon.social/@username` → `https://mastodon.social/@username.rss`

**Lemmy:**
1. Find a Lemmy community URL
2. Convert to OpenRSS format: `https://openrss.org/{instance}/c/{community}`
3. Example: `lemmy.ml/c/linux` → `https://openrss.org/lemmy.ml/c/linux`

---

## Part 2: Folder & Category Organization

### Database Schema Changes

#### New Types Added

**FeedFolder Interface:**
```typescript
export interface FeedFolder {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  order: number;
  parentId?: string; // For nested folders
  isCollapsed?: boolean;
  feedIds: string[]; // Feeds in this folder
  createdAt: Date;
  updatedAt: Date;
}
```

**Enhanced FeedCategory:**
```typescript
export interface FeedCategory {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  order: number;
  parentId?: string; // For nested categories
  isCollapsed?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Enhanced Feed:**
```typescript
export interface Feed {
  // ... existing fields
  folderId?: string; // User-created folder
  tags?: string[]; // User-defined tags
}
```

#### Database Schema v2

```typescript
this.version(2).stores({
  feeds: 'id, url, category, folderId, isActive, lastFetched, createdAt',
  articles: 'id, feedId, link, pubDate, isRead, isStarred, isSaved, createdAt, [feedId+isRead]',
  categories: 'id, name, order, parentId',
  folders: 'id, name, order, parentId', // NEW TABLE
  settings: 'id',
});
```

### New Database Operations

```typescript
// Folder operations
dbOperations.addFolder(folder)
dbOperations.updateFolder(id, updates)
dbOperations.deleteFolder(id)
dbOperations.getAllFolders()
dbOperations.getFolderById(id)
dbOperations.getFeedsByFolder(folderId)

// Category operations
dbOperations.addCategory(category)
dbOperations.updateCategory(id, updates)
dbOperations.deleteCategory(id)
dbOperations.getAllCategories()
```

### Folder Organization Features

#### 1. User-Created Folders
- Create custom folders to organize feeds
- Drag and drop feeds into folders
- Rename, reorder, and delete folders
- Assign colors and icons to folders

#### 2. Nested Folders (Optional)
- Create sub-folders within folders
- Unlimited nesting depth
- Collapse/expand folder trees
- Example structure:
  ```
  📁 Tech
    📁 Programming
      📰 Hacker News
      📰 Dev.to
    📁 AI/ML
      📰 DeepMind Blog
      📰 Hugging Face
  📁 News
    📰 BBC News
    📰 The Guardian
  ```

#### 3. Smart Categories
- Auto-categorize feeds based on tags
- Filter by category
- Multiple categories per feed
- Category-based views

#### 4. Tags
- Add custom tags to feeds
- Filter by tags
- Tag-based search
- Tag suggestions based on feed content

---

## UI Implementation Plan

### Sidebar Organization

```
┌─────────────────────────┐
│ 📥 All Articles         │
│ ⭐ Starred              │
│ 💾 Saved                │
├─────────────────────────┤
│ 📁 My Folders           │
│   ▼ 📁 Tech (12)        │
│     📰 Hacker News      │
│     📰 TechCrunch       │
│   ▶ 📁 News (5)         │
│   ▶ 📁 Fediverse (8)    │
├─────────────────────────┤
│ 🏷️ Categories           │
│   • Technology          │
│   • Business            │
│   • Fediverse           │
├─────────────────────────┤
│ 📚 Curated Packs        │
│   • Tech News           │
│   • Fediverse - Mastodon│
│   • Fediverse - Lemmy   │
└─────────────────────────┘
```

### Folder Management UI

**Create Folder:**
- Right-click sidebar → "New Folder"
- Name, icon, color picker
- Optional: parent folder selection

**Organize Feeds:**
- Drag and drop feeds into folders
- Multi-select for bulk operations
- Context menu: Move to folder, Add tags

**Folder Actions:**
- Rename, Delete, Change color/icon
- Mark all as read
- Refresh all feeds in folder
- Export folder as OPML

### Category Management

**Auto-Categorization:**
- Based on feed tags from curated packs
- User can override categories
- Suggest categories based on feed content

**Category Views:**
- Filter sidebar by category
- Category-specific article views
- Category statistics (unread count, etc.)

---

## Implementation Steps

### Phase 1: Database & Backend (Completed ✅)
- [x] Add FeedFolder type
- [x] Enhance Feed type with folderId and tags
- [x] Update database schema to v2
- [x] Add folder CRUD operations
- [x] Add category operations
- [x] Add Fediverse feeds to curated packs

### Phase 2: UI Components (Next)
- [ ] Create FolderList component
- [ ] Create FolderItem component (collapsible)
- [ ] Add drag-and-drop support
- [ ] Create FolderManagement dialog
- [ ] Update Sidebar to show folders
- [ ] Add folder context menu

### Phase 3: Feed Organization (Next)
- [ ] Implement "Move to Folder" functionality
- [ ] Add bulk operations (multi-select)
- [ ] Create tag management UI
- [ ] Add category filter
- [ ] Implement folder-based article views

### Phase 4: Polish & UX (Later)
- [ ] Add folder icons and colors
- [ ] Implement nested folders
- [ ] Add folder statistics (unread count)
- [ ] Create folder export/import (OPML)
- [ ] Add keyboard shortcuts for folders

---

## User Workflows

### Workflow 1: Organize Existing Feeds

1. User has 20+ feeds in flat list
2. Right-click sidebar → "New Folder" → Name it "Tech"
3. Drag feeds into "Tech" folder
4. Create more folders: "News", "Fediverse", "Personal"
5. Organize all feeds into folders
6. Collapse folders to reduce clutter

### Workflow 2: Add Fediverse Feeds

1. User opens onboarding or settings
2. Sees "Fediverse" category in curated packs
3. Selects "Fediverse - Mastodon" pack
4. Subscribes to Mastodon feeds
5. Creates "Fediverse" folder
6. Moves all Fediverse feeds into folder
7. Adds custom Mastodon accounts by appending `.rss`

### Workflow 3: Nested Organization

1. User creates "Tech" folder
2. Creates sub-folders: "Programming", "AI/ML", "DevOps"
3. Organizes feeds into sub-folders
4. Collapses "Tech" folder to hide all sub-folders
5. Expands only when needed

### Workflow 4: Tag-Based Filtering

1. User adds tags to feeds: "daily", "weekly", "important"
2. Filters sidebar by tag: "Show only 'daily' feeds"
3. Creates smart views based on tags
4. Uses tags for reading workflows

---

## Migration Strategy

### Automatic Migration

When users upgrade to v2:

1. **Existing feeds remain unchanged**
   - No folders assigned (folderId = undefined)
   - Shown in "Uncategorized" section

2. **Categories preserved**
   - Existing category field remains
   - Can be used for filtering

3. **User prompted to organize**
   - Welcome message: "New! Organize your feeds with folders"
   - Quick setup wizard (optional)
   - Suggest folders based on feed tags

### Default Folder Structure (Optional)

For new users, suggest:
```
📁 Technology
📁 News & Media
📁 Fediverse
📁 Personal
📁 Uncategorized
```

---

## Technical Considerations

### Performance

**Folder Queries:**
- Indexed by folderId for fast lookups
- Cached folder structure in memory
- Lazy load folder contents

**Nested Folders:**
- Limit nesting depth to 5 levels
- Use recursive queries with depth limit
- Cache folder tree structure

### Data Integrity

**Folder Deletion:**
- Prompt user: "Move feeds to Uncategorized or delete?"
- Default: move feeds to root level
- Option: delete feeds with folder

**Feed Deletion:**
- Remove from folder.feedIds array
- Update folder statistics

### Sync Considerations

**Cloud Sync (Future):**
- Sync folder structure
- Sync folder assignments
- Conflict resolution: last-write-wins
- Merge folders with same name

---

## API for Future Features

### Folder API

```typescript
// Create folder
const folderId = await dbOperations.addFolder({
  name: 'Tech',
  color: '#3b82f6',
  icon: '💻',
  order: 0,
  feedIds: [],
});

// Add feed to folder
await dbOperations.updateFeed(feedId, {
  folderId: folderId,
});

// Get all feeds in folder
const feeds = await dbOperations.getFeedsByFolder(folderId);

// Move feed between folders
await dbOperations.updateFeed(feedId, {
  folderId: newFolderId,
});
```

### Category API

```typescript
// Create category
await dbOperations.addCategory({
  name: 'Fediverse',
  color: '#8b5cf6',
  icon: '🌐',
  order: 0,
});

// Assign category to feed
await dbOperations.updateFeed(feedId, {
  category: 'Fediverse',
});

// Get all categories
const categories = await dbOperations.getAllCategories();
```

---

## Testing Checklist

### Fediverse Feeds
- [ ] Mastodon user feeds load correctly
- [ ] Mastodon hashtag feeds load correctly
- [ ] Lemmy community feeds load via OpenRSS
- [ ] Lemmy timeline feeds work
- [ ] Feeds appear in onboarding
- [ ] Feeds can be subscribed from curated packs

### Folder Operations
- [ ] Create folder
- [ ] Rename folder
- [ ] Delete folder (with feeds)
- [ ] Delete folder (without feeds)
- [ ] Move feed to folder
- [ ] Remove feed from folder
- [ ] Reorder folders
- [ ] Collapse/expand folders

### Nested Folders
- [ ] Create sub-folder
- [ ] Move folder into another folder
- [ ] Delete parent folder (handle children)
- [ ] Expand/collapse folder tree
- [ ] Limit nesting depth

### UI/UX
- [ ] Drag and drop works
- [ ] Context menus work
- [ ] Keyboard shortcuts work
- [ ] Folder icons and colors display
- [ ] Unread counts update
- [ ] Responsive on mobile

---

## Future Enhancements

### Smart Folders
- Auto-organize based on rules
- "Unread from last 24h"
- "Starred in Tech folder"
- "High-priority feeds"

### Folder Sharing
- Export folder as OPML
- Share folder with others
- Import shared folders
- Collaborative folders (Pro feature)

### Advanced Organization
- Multi-folder assignment (one feed in multiple folders)
- Virtual folders (saved searches)
- Folder templates
- Bulk operations (tag all, move all, etc.)

### Analytics
- Folder reading statistics
- Most active folders
- Folder engagement metrics
- Suggest folder reorganization

---

## Conclusion

This implementation provides:

1. ✅ **Fediverse Integration** - Unique differentiator, easy to use
2. ✅ **Folder Organization** - Essential for power users with many feeds
3. ✅ **Scalable Architecture** - Supports future enhancements
4. ✅ **Privacy-First** - All data stored locally
5. ✅ **User-Friendly** - Intuitive drag-and-drop interface

**Next Steps:**
1. Implement UI components for folder management
2. Add drag-and-drop support
3. Update sidebar to show folder structure
4. Test with real users
5. Iterate based on feedback

This positions FlowRSS as a modern, organized, and Fediverse-friendly RSS reader!
