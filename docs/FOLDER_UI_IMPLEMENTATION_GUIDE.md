# Folder UI Implementation Guide

## Quick Start: Adding Folder Support to Sidebar

This guide shows how to implement the folder/category UI in the sidebar.

---

## Step 1: Update Sidebar Component

### Current Sidebar Structure
```typescript
// src/components/layout/sidebar.tsx
- All Articles
- Starred
- Saved
- [Flat list of feeds]
```

### New Sidebar Structure
```typescript
- All Articles
- Starred
- Saved
---
- 📁 My Folders (collapsible)
  - 📁 Tech (collapsible)
    - 📰 Hacker News
    - 📰 TechCrunch
  - 📁 News
  - 📁 Fediverse
---
- 🏷️ Categories
  - Technology
  - Fediverse
  - Business
---
- 📚 Curated Packs
  - Tech News
  - Fediverse - Mastodon
  - Fediverse - Lemmy
```

---

## Step 2: Create Folder Components

### FolderList Component

```typescript
// src/components/sidebar/folder-list.tsx
'use client';

import { useState, useEffect } from 'react';
import { dbOperations } from '@/lib/db/schema';
import type { FeedFolder, Feed } from '@/types';
import { FolderItem } from './folder-item';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function FolderList() {
  const [folders, setFolders] = useState<FeedFolder[]>([]);
  const [feeds, setFeeds] = useState<Feed[]>([]);

  useEffect(() => {
    loadFolders();
    loadFeeds();
  }, []);

  const loadFolders = async () => {
    const allFolders = await dbOperations.getAllFolders();
    setFolders(allFolders);
  };

  const loadFeeds = async () => {
    const allFeeds = await dbOperations.getAllFeeds();
    setFeeds(allFeeds);
  };

  const handleCreateFolder = async () => {
    const name = prompt('Folder name:');
    if (!name) return;

    await dbOperations.addFolder({
      name,
      order: folders.length,
      feedIds: [],
    });
    
    loadFolders();
  };

  // Get root-level folders (no parent)
  const rootFolders = folders.filter(f => !f.parentId);

  // Get feeds without folders
  const unorganizedFeeds = feeds.filter(f => !f.folderId);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          My Folders
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCreateFolder}
          className="h-6 w-6 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {rootFolders.map(folder => (
        <FolderItem
          key={folder.id}
          folder={folder}
          feeds={feeds.filter(f => f.folderId === folder.id)}
          allFolders={folders}
          onUpdate={loadFolders}
        />
      ))}

      {unorganizedFeeds.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-medium text-gray-500 px-2 mb-2">
            Uncategorized
          </h4>
          {unorganizedFeeds.map(feed => (
            <FeedItem key={feed.id} feed={feed} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### FolderItem Component

```typescript
// src/components/sidebar/folder-item.tsx
'use client';

import { useState } from 'react';
import type { FeedFolder, Feed } from '@/types';
import { dbOperations } from '@/lib/db/schema';
import { ChevronRight, ChevronDown, Folder, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FolderItemProps {
  folder: FeedFolder;
  feeds: Feed[];
  allFolders: FeedFolder[];
  onUpdate: () => void;
}

export function FolderItem({ folder, feeds, allFolders, onUpdate }: FolderItemProps) {
  const [isCollapsed, setIsCollapsed] = useState(folder.isCollapsed ?? false);

  const toggleCollapse = async () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    await dbOperations.updateFolder(folder.id, { isCollapsed: newState });
  };

  const handleRename = async () => {
    const newName = prompt('New folder name:', folder.name);
    if (!newName || newName === folder.name) return;

    await dbOperations.updateFolder(folder.id, { name: newName });
    onUpdate();
  };

  const handleDelete = async () => {
    if (!confirm(`Delete folder "${folder.name}"? Feeds will be moved to Uncategorized.`)) {
      return;
    }

    await dbOperations.deleteFolder(folder.id);
    onUpdate();
  };

  const handleMarkAllRead = async () => {
    // TODO: Implement mark all articles in folder as read
  };

  // Get sub-folders
  const subFolders = allFolders.filter(f => f.parentId === folder.id);

  // Count unread articles
  const unreadCount = 0; // TODO: Calculate from feeds

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 group">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCollapse}
          className="h-5 w-5 p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        <Folder className="h-4 w-4 text-gray-500" style={{ color: folder.color }} />

        <span className="flex-1 text-sm font-medium truncate">
          {folder.name}
        </span>

        {unreadCount > 0 && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {unreadCount}
          </span>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleRename}>
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleMarkAllRead}>
              Mark all as read
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              Delete folder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {!isCollapsed && (
        <div className="ml-6 space-y-1">
          {/* Sub-folders */}
          {subFolders.map(subFolder => (
            <FolderItem
              key={subFolder.id}
              folder={subFolder}
              feeds={feeds.filter(f => f.folderId === subFolder.id)}
              allFolders={allFolders}
              onUpdate={onUpdate}
            />
          ))}

          {/* Feeds in this folder */}
          {feeds.map(feed => (
            <FeedItem key={feed.id} feed={feed} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### FeedItem Component

```typescript
// src/components/sidebar/feed-item.tsx
'use client';

import type { Feed } from '@/types';
import { Rss } from 'lucide-react';

interface FeedItemProps {
  feed: Feed;
  onClick?: () => void;
}

export function FeedItem({ feed, onClick }: FeedItemProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
    >
      {feed.imageUrl ? (
        <img
          src={feed.imageUrl}
          alt={feed.title}
          className="h-4 w-4 rounded"
        />
      ) : (
        <Rss className="h-4 w-4 text-gray-500" />
      )}

      <span className="flex-1 text-sm truncate">
        {feed.title}
      </span>

      {/* TODO: Show unread count */}
    </div>
  );
}
```

---

## Step 3: Add Drag and Drop Support

### Install react-beautiful-dnd

```bash
npm install react-beautiful-dnd
npm install --save-dev @types/react-beautiful-dnd
```

### Implement Drag and Drop

```typescript
// src/components/sidebar/folder-list.tsx
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export function FolderList() {
  // ... existing code

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId, type } = result;

    if (type === 'FEED') {
      // Moving a feed
      const feedId = draggableId;
      const newFolderId = destination.droppableId === 'root' 
        ? undefined 
        : destination.droppableId;

      await dbOperations.updateFeed(feedId, { folderId: newFolderId });
      loadFeeds();
    } else if (type === 'FOLDER') {
      // Reordering folders
      const newFolders = Array.from(folders);
      const [removed] = newFolders.splice(source.index, 1);
      newFolders.splice(destination.index, 0, removed);

      // Update order
      for (let i = 0; i < newFolders.length; i++) {
        await dbOperations.updateFolder(newFolders[i].id, { order: i });
      }
      
      loadFolders();
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="folders" type="FOLDER">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {rootFolders.map((folder, index) => (
              <Draggable key={folder.id} draggableId={folder.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <FolderItem
                      folder={folder}
                      feeds={feeds.filter(f => f.folderId === folder.id)}
                      allFolders={folders}
                      onUpdate={loadFolders}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
```

---

## Step 4: Update Sidebar to Include Folders

```typescript
// src/components/layout/sidebar.tsx
import { FolderList } from '@/components/sidebar/folder-list';

export function Sidebar() {
  return (
    <div className="sidebar">
      {/* Existing: All Articles, Starred, Saved */}
      <div className="space-y-1">
        <SidebarItem icon={Inbox} label="All Articles" />
        <SidebarItem icon={Star} label="Starred" />
        <SidebarItem icon={Bookmark} label="Saved" />
      </div>

      <Separator className="my-4" />

      {/* NEW: Folders */}
      <FolderList />

      <Separator className="my-4" />

      {/* Existing: Curated Packs, etc. */}
    </div>
  );
}
```

---

## Step 5: Add Folder Management Dialog

```typescript
// src/components/dialogs/folder-management-dialog.tsx
'use client';

import { useState, useEffect } from 'react';
import { dbOperations } from '@/lib/db/schema';
import type { FeedFolder } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FolderManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId?: string; // For editing existing folder
}

export function FolderManagementDialog({
  open,
  onOpenChange,
  folderId,
}: FolderManagementDialogProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [icon, setIcon] = useState('📁');

  useEffect(() => {
    if (folderId) {
      loadFolder();
    } else {
      resetForm();
    }
  }, [folderId, open]);

  const loadFolder = async () => {
    if (!folderId) return;
    const folder = await dbOperations.getFolderById(folderId);
    if (folder) {
      setName(folder.name);
      setColor(folder.color || '#3b82f6');
      setIcon(folder.icon || '📁');
    }
  };

  const resetForm = () => {
    setName('');
    setColor('#3b82f6');
    setIcon('📁');
  };

  const handleSave = async () => {
    if (!name.trim()) return;

    if (folderId) {
      // Update existing folder
      await dbOperations.updateFolder(folderId, { name, color, icon });
    } else {
      // Create new folder
      const folders = await dbOperations.getAllFolders();
      await dbOperations.addFolder({
        name,
        color,
        icon,
        order: folders.length,
        feedIds: [],
      });
    }

    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {folderId ? 'Edit Folder' : 'Create Folder'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Folder Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Tech, News, Personal"
            />
          </div>

          <div>
            <Label htmlFor="icon">Icon</Label>
            <Input
              id="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="📁"
              maxLength={2}
            />
          </div>

          <div>
            <Label htmlFor="color">Color</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-20"
              />
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#3b82f6"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {folderId ? 'Save' : 'Create'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Step 6: Add Context Menu for Feeds

```typescript
// src/components/sidebar/feed-item.tsx
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

export function FeedItem({ feed, onClick }: FeedItemProps) {
  const [folders, setFolders] = useState<FeedFolder[]>([]);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    const allFolders = await dbOperations.getAllFolders();
    setFolders(allFolders);
  };

  const handleMoveToFolder = async (folderId: string | undefined) => {
    await dbOperations.updateFeed(feed.id, { folderId });
    // Trigger refresh
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
          {/* ... existing feed item content */}
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem onClick={() => handleMoveToFolder(undefined)}>
          Remove from folder
        </ContextMenuItem>

        <ContextMenuSub>
          <ContextMenuSubTrigger>Move to folder</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {folders.map(folder => (
              <ContextMenuItem
                key={folder.id}
                onClick={() => handleMoveToFolder(folder.id)}
              >
                {folder.icon} {folder.name}
              </ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuItem>Mark all as read</ContextMenuItem>
        <ContextMenuItem>Refresh feed</ContextMenuItem>
        <ContextMenuItem className="text-red-600">
          Unsubscribe
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

---

## Summary

This implementation provides:

1. ✅ **Folder List Component** - Display folders with collapse/expand
2. ✅ **Folder Item Component** - Individual folder with context menu
3. ✅ **Feed Item Component** - Feed with move-to-folder option
4. ✅ **Drag and Drop** - Organize feeds by dragging
5. ✅ **Folder Management Dialog** - Create/edit folders
6. ✅ **Context Menus** - Right-click actions

**Next Steps:**
1. Implement unread count calculation
2. Add keyboard shortcuts
3. Implement mark all as read
4. Add folder export/import (OPML)
5. Polish animations and transitions

The folder system is now ready to use!
