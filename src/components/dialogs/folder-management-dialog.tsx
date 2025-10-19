'use client';

import { useState, useEffect } from 'react';
import { dbOperations } from '@/lib/db/schema';
import type { FeedFolder } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FolderManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId?: string; // For editing existing folder
  onSuccess: (folderId?: string) => void;
}

const PRESET_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // green
  '#06b6d4', // cyan
  '#ef4444', // red
  '#6366f1', // indigo
];

const PRESET_ICONS = ['📁', '💻', '📰', '🌐', '🚀', '📚', '🎨', '🔬', '💼', '🎯'];

export function FolderManagementDialog({
  open,
  onOpenChange,
  folderId,
  onSuccess,
}: FolderManagementDialogProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [icon, setIcon] = useState(PRESET_ICONS[0]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (folderId) {
        loadFolder();
      } else {
        resetForm();
      }
    }
  }, [folderId, open]);

  const loadFolder = async () => {
    if (!folderId) return;
    const folder = await dbOperations.getFolderById(folderId);
    if (folder) {
      setName(folder.name);
      setColor(folder.color || PRESET_COLORS[0]);
      setIcon(folder.icon || PRESET_ICONS[0]);
    }
  };

  const resetForm = () => {
    setName('');
    setColor(PRESET_COLORS[0]);
    setIcon(PRESET_ICONS[0]);
  };

  const handleSave = async () => {
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      let createdFolderId: string | undefined;
      
      if (folderId) {
        // Update existing folder
        await dbOperations.updateFolder(folderId, { name, color, icon });
        createdFolderId = folderId;
      } else {
        // Create new folder
        const folders = await dbOperations.getAllFolders();
        createdFolderId = await dbOperations.addFolder({
          name,
          color,
          icon,
          order: folders.length,
          feedIds: [],
        });
      }

      onSuccess(createdFolderId);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error saving folder:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {folderId ? 'Edit Folder' : 'Create Folder'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Folder Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Tech, News, Personal"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_ICONS.map((presetIcon) => (
                <Button
                  key={presetIcon}
                  type="button"
                  variant={icon === presetIcon ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIcon(presetIcon)}
                  className="text-lg"
                >
                  {presetIcon}
                </Button>
              ))}
            </div>
            <Input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Or enter custom emoji"
              maxLength={2}
              className="mt-2"
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  type="button"
                  onClick={() => setColor(presetColor)}
                  className={`w-8 h-8 rounded-md border-2 ${
                    color === presetColor ? 'border-foreground' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: presetColor }}
                />
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-20 h-10"
              />
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#3b82f6"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !name.trim()}>
            {isLoading ? 'Saving...' : folderId ? 'Save' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
