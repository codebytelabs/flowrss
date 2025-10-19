'use client';

import { useState } from 'react';
import type { FeedFolder, Feed } from '@/types';
import { dbOperations } from '@/lib/db/schema';
import { ChevronRight, ChevronDown, Folder, MoreVertical, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FeedItem } from './feed-item';
import { FolderManagementDialog } from '../dialogs/folder-management-dialog';

interface FolderItemProps {
  folder: FeedFolder;
  feeds: Feed[];
  allFolders: FeedFolder[];
  selectedFeed: Feed | null;
  onSelectFeed: (feed: Feed | null) => void;
  onUpdate: () => void;
}

export function FolderItem({ folder, feeds, allFolders, selectedFeed, onSelectFeed, onUpdate }: FolderItemProps) {
  const [isCollapsed, setIsCollapsed] = useState(folder.isCollapsed ?? false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const toggleCollapse = async () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    await dbOperations.updateFolder(folder.id, { isCollapsed: newState });
  };

  const handleDelete = async () => {
    if (!confirm(`Delete folder "${folder.name}"? Feeds will be moved to Uncategorized.`)) {
      return;
    }

    await dbOperations.deleteFolder(folder.id);
    onUpdate();
  };

  const handleMarkAllRead = async () => {
    // Get all articles from feeds in this folder
    for (const feed of feeds) {
      const articles = await dbOperations.getArticlesByFeed(feed.id);
      for (const article of articles) {
        if (!article.isRead) {
          await dbOperations.markAsRead(article.id);
        }
      }
    }
    onUpdate();
  };

  // Get sub-folders
  const subFolders = allFolders.filter(f => f.parentId === folder.id);

  // Count unread articles (simplified - would need proper implementation)
  const unreadCount = 0; // TODO: Calculate from feeds

  const hasContent = feeds.length > 0 || subFolders.length > 0;

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-accent group">
        {hasContent && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className="h-5 w-5 p-0 hover:bg-transparent"
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
        )}

        {!hasContent && <div className="w-5" />}

        {isCollapsed ? (
          <Folder className="h-4 w-4 text-muted-foreground flex-shrink-0" style={{ color: folder.color }} />
        ) : (
          <FolderOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" style={{ color: folder.color }} />
        )}

        <span className="flex-1 text-sm font-medium truncate">
          {folder.icon && <span className="mr-1">{folder.icon}</span>}
          {folder.name}
        </span>

        {unreadCount > 0 && (
          <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
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
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
              Edit folder
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleMarkAllRead}>
              Mark all as read
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              Delete folder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {!isCollapsed && hasContent && (
        <div className="ml-5 space-y-0.5">
          {/* Sub-folders */}
          {subFolders.map(subFolder => (
            <FolderItem
              key={subFolder.id}
              folder={subFolder}
              feeds={feeds.filter(f => f.folderId === subFolder.id)}
              allFolders={allFolders}
              selectedFeed={selectedFeed}
              onSelectFeed={onSelectFeed}
              onUpdate={onUpdate}
            />
          ))}

          {/* Feeds in this folder */}
          {feeds.map(feed => (
            <FeedItem
              key={feed.id}
              feed={feed}
              isSelected={selectedFeed?.id === feed.id}
              onClick={() => onSelectFeed(feed)}
              onUpdate={onUpdate}
              allFolders={allFolders}
            />
          ))}
        </div>
      )}

      <FolderManagementDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        folderId={folder.id}
        onSuccess={onUpdate}
      />
    </div>
  );
}
