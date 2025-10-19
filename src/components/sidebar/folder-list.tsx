'use client';

import { useState, useEffect } from 'react';
import { dbOperations } from '@/lib/db/schema';
import type { FeedFolder, Feed } from '@/types';
import { FolderItem } from './folder-item';
import { FeedItem } from './feed-item';
import { Button } from '@/components/ui/button';
import { Plus, FolderPlus } from 'lucide-react';
import { FolderManagementDialog } from '../dialogs/folder-management-dialog';

interface FolderListProps {
  feeds: Feed[];
  selectedFeed: Feed | null;
  onSelectFeed: (feed: Feed | null) => void;
  onFeedsUpdate: () => void;
}

export function FolderList({ feeds, selectedFeed, onSelectFeed, onFeedsUpdate }: FolderListProps) {
  const [folders, setFolders] = useState<FeedFolder[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [pendingFeedId, setPendingFeedId] = useState<string | null>(null);

  useEffect(() => {
    loadFolders();

    // Listen for create folder event from context menu
    const handleCreateFolder = (e: CustomEvent) => {
      setPendingFeedId(e.detail?.feedId || null);
      setShowCreateDialog(true);
    };

    window.addEventListener('createFolder', handleCreateFolder as EventListener);
    return () => {
      window.removeEventListener('createFolder', handleCreateFolder as EventListener);
    };
  }, []);

  const loadFolders = async () => {
    const allFolders = await dbOperations.getAllFolders();
    setFolders(allFolders);
  };

  const handleFolderUpdate = async (folderId?: string) => {
    // If there's a pending feed, move it to the new folder
    if (pendingFeedId && folderId) {
      await dbOperations.updateFeed(pendingFeedId, { folderId });
      setPendingFeedId(null);
    }
    loadFolders();
    onFeedsUpdate();
  };

  // Get root-level folders (no parent)
  const rootFolders = folders.filter(f => !f.parentId);

  // Only show folders section if there are folders
  if (rootFolders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between px-2 py-1">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          My Folders
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowCreateDialog(true)}
          className="h-6 w-6 p-0"
          title="Create folder"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {rootFolders.map(folder => (
        <FolderItem
          key={folder.id}
          folder={folder}
          feeds={feeds.filter(f => f.folderId === folder.id)}
          allFolders={folders}
          selectedFeed={selectedFeed}
          onSelectFeed={onSelectFeed}
          onUpdate={handleFolderUpdate}
        />
      ))}

      <FolderManagementDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={(folderId) => {
          handleFolderUpdate(folderId);
          setShowCreateDialog(false);
        }}
      />
    </div>
  );
}
