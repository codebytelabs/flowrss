'use client';

import { useState, useEffect } from 'react';
import type { Feed, FeedFolder } from '@/types';
import { dbOperations } from '@/lib/db/schema';
import { Rss, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDraggable } from '@/hooks/use-draggable';
import { cn } from '@/lib/utils';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { getFaviconUrl } from '@/lib/utils';

interface FeedItemProps {
  feed: Feed;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: () => void;
  allFolders: FeedFolder[];
}

export function FeedItem({ feed, isSelected, onClick, onUpdate, allFolders }: FeedItemProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  // Drag functionality
  const { isDragging, dragHandleProps, dragImageRef } = useDraggable({
    id: feed.id,
    type: 'feed',
    data: feed,
  });

  useEffect(() => {
    loadUnreadCount();
  }, [feed.id]);

  const loadUnreadCount = async () => {
    const articles = await dbOperations.getArticlesByFeed(feed.id);
    const unread = articles.filter(a => !a.isRead).length;
    setUnreadCount(unread);
  };

  const handleMoveToFolder = async (folderId: string | undefined) => {
    await dbOperations.updateFeed(feed.id, { folderId });
    onUpdate();
  };

  const handleMarkAllRead = async () => {
    const articles = await dbOperations.getArticlesByFeed(feed.id);
    for (const article of articles) {
      if (!article.isRead) {
        await dbOperations.markAsRead(article.id);
      }
    }
    loadUnreadCount();
    onUpdate();
  };

  const handleUnsubscribe = async () => {
    if (!confirm(`Unsubscribe from "${feed.title}"?`)) {
      return;
    }
    await dbOperations.deleteFeed(feed.id);
    onUpdate();
  };

  const FeedContent = (
    <div
      ref={dragImageRef as React.RefObject<HTMLDivElement>}
      {...dragHandleProps}
      className={cn(
        'flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer group transition-opacity',
        isSelected ? 'bg-accent' : 'hover:bg-accent',
        isDragging && 'opacity-50'
      )}
      onClick={onClick}
    >
      <img
        src={feed.imageUrl || getFaviconUrl(feed.url)}
        alt=""
        className="w-4 h-4 rounded flex-shrink-0"
        onError={e => {
          e.currentTarget.src = getFaviconUrl(feed.url);
        }}
      />

      <span className="flex-1 text-sm truncate">{feed.title}</span>

      {unreadCount > 0 && (
        <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
          {unreadCount}
        </span>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Move to folder</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => handleMoveToFolder(undefined)}>
                📋 No folder
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => {
                  // Trigger folder creation dialog
                  window.dispatchEvent(new CustomEvent('createFolder', { 
                    detail: { feedId: feed.id } 
                  }));
                }}
                className="text-primary"
              >
                ➕ Create new folder...
              </DropdownMenuItem>
              {allFolders.length > 0 && <DropdownMenuSeparator />}
              {allFolders.map(folder => (
                <DropdownMenuItem
                  key={folder.id}
                  onClick={() => handleMoveToFolder(folder.id)}
                >
                  {folder.icon} {folder.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem onClick={handleMarkAllRead}>
            Mark all as read
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleUnsubscribe} className="text-destructive">
            Unsubscribe
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger>{FeedContent}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Move to folder</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => handleMoveToFolder(undefined)}>
              📋 No folder
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem 
              onClick={() => {
                // Trigger folder creation dialog
                window.dispatchEvent(new CustomEvent('createFolder', { 
                  detail: { feedId: feed.id } 
                }));
              }}
              className="text-primary"
            >
              ➕ Create new folder...
            </ContextMenuItem>
            {allFolders.length > 0 && <ContextMenuSeparator />}
            {allFolders.map(folder => (
              <ContextMenuItem
                key={folder.id}
                onClick={() => handleMoveToFolder(folder.id)}
              >
                {folder.icon} {folder.name}
              </ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem onClick={handleMarkAllRead}>
          Mark all as read
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleUnsubscribe} className="text-destructive">
          Unsubscribe
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
