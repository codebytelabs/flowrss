'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dbOperations } from '@/lib/db/schema';
import { parseFeedUrl } from '@/lib/rss/parser';
import { useToast } from '@/components/ui/toast';
import { Loader2 } from 'lucide-react';

interface AddFeedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddFeedDialog({ open, onOpenChange, onSuccess }: AddFeedDialogProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      addToast('Please enter a feed URL', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // Validate and parse the feed
      const result = await parseFeedUrl(url);
      
      if (!result.success || !result.metadata) {
        addToast('Invalid RSS feed URL', 'error');
        setIsLoading(false);
        return;
      }

      // Add to database
      await dbOperations.addFeed({
        url: url.trim(),
        title: result.metadata.title || 'Untitled Feed',
        description: result.metadata.description,
        imageUrl: result.metadata.imageUrl,
        isActive: true,
        errorCount: 0,
      });

      addToast('Feed added successfully!', 'success');
      setUrl('');
      onOpenChange(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error adding feed:', error);
      addToast('Failed to add feed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Feed</DialogTitle>
          <DialogDescription>
            Enter the URL of an RSS or Atom feed
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="feed-url">Feed URL</Label>
            <Input
              id="feed-url"
              type="url"
              placeholder="https://example.com/feed.xml"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Feed
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
