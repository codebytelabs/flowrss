'use client';

import { useState, useEffect } from 'react';
import { dbOperations } from '@/lib/db/schema';
import type { Feed } from '@/types';
import { ChevronRight, ChevronDown, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeedItem } from './feed-item';

interface CategoryListProps {
  feeds: Feed[];
  selectedFeed: Feed | null;
  onSelectFeed: (feed: Feed | null) => void;
  onFeedsUpdate: () => void;
}

// Default categories that feeds can be grouped into
const DEFAULT_CATEGORIES = [
  { name: 'Technology', icon: '💻', color: '#3b82f6' },
  { name: 'Development', icon: '👨‍💻', color: '#8b5cf6' },
  { name: 'AI', icon: '🤖', color: '#ec4899' },
  { name: 'Design', icon: '🎨', color: '#f59e0b' },
  { name: 'Business', icon: '🚀', color: '#10b981' },
  { name: 'Crypto', icon: '₿', color: '#f59e0b' },
  { name: 'News', icon: '🌍', color: '#06b6d4' },
  { name: 'Science', icon: '🔬', color: '#6366f1' },
  { name: 'Culture', icon: '📚', color: '#ec4899' },
  { name: 'Productivity', icon: '⚡', color: '#10b981' },
  { name: 'Entertainment', icon: '😄', color: '#f59e0b' },
  { name: 'Fediverse', icon: '🌐', color: '#8b5cf6' },
];

export function CategoryList({ feeds, selectedFeed, onSelectFeed, onFeedsUpdate }: CategoryListProps) {
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [allFolders, setAllFolders] = useState<any[]>([]);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    const folders = await dbOperations.getAllFolders();
    setAllFolders(folders);
  };

  const toggleCategory = (categoryName: string) => {
    setCollapsedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryName)) {
        next.delete(categoryName);
      } else {
        next.add(categoryName);
      }
      return next;
    });
  };

  // Group feeds by category (feeds can appear in multiple categories)
  const feedsByCategory = feeds.reduce((acc, feed) => {
    // Skip feeds that are in folders
    if (feed.folderId) return acc;
    
    // Support both single category and multiple categories
    const categories = feed.categories || (feed.category ? [feed.category] : ['Uncategorized']);
    
    categories.forEach(category => {
      if (!acc[category]) {
        acc[category] = [];
      }
      // Avoid duplicates
      if (!acc[category].find(f => f.id === feed.id)) {
        acc[category].push(feed);
      }
    });
    
    return acc;
  }, {} as Record<string, Feed[]>);

  // Get categories that have feeds
  const categoriesWithFeeds = DEFAULT_CATEGORIES.filter(cat => 
    feedsByCategory[cat.name] && feedsByCategory[cat.name].length > 0
  );

  // Get uncategorized feeds
  const uncategorizedFeeds = feedsByCategory['Uncategorized'] || [];

  if (categoriesWithFeeds.length === 0 && uncategorizedFeeds.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1">
      {categoriesWithFeeds.map(category => {
        const categoryFeeds = feedsByCategory[category.name] || [];
        const isCollapsed = collapsedCategories.has(category.name);
        const unreadCount = 0; // TODO: Calculate unread count

        return (
          <div key={category.name} className="space-y-0.5">
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-accent group">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleCategory(category.name)}
                className="h-5 w-5 p-0 hover:bg-transparent"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </Button>

              <span className="text-lg" style={{ color: category.color }}>
                {category.icon}
              </span>

              <span className="flex-1 text-sm font-medium truncate">
                {category.name}
              </span>

              <span className="text-xs text-muted-foreground">
                {categoryFeeds.length}
              </span>

              {unreadCount > 0 && (
                <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                  {unreadCount}
                </span>
              )}
            </div>

            {!isCollapsed && (
              <div className="ml-5 space-y-0.5">
                {categoryFeeds.map(feed => (
                  <FeedItem
                    key={feed.id}
                    feed={feed}
                    isSelected={selectedFeed?.id === feed.id}
                    onClick={() => onSelectFeed(feed)}
                    onUpdate={onFeedsUpdate}
                    allFolders={allFolders}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {uncategorizedFeeds.length > 0 && (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-accent group">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleCategory('Uncategorized')}
              className="h-5 w-5 p-0 hover:bg-transparent"
            >
              {collapsedCategories.has('Uncategorized') ? (
                <ChevronRight className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>

            <Tag className="h-4 w-4 text-muted-foreground" />

            <span className="flex-1 text-sm font-medium truncate text-muted-foreground">
              Uncategorized
            </span>

            <span className="text-xs text-muted-foreground">
              {uncategorizedFeeds.length}
            </span>
          </div>

          {!collapsedCategories.has('Uncategorized') && (
            <div className="ml-5 space-y-0.5">
              {uncategorizedFeeds.map(feed => (
                <FeedItem
                  key={feed.id}
                  feed={feed}
                  isSelected={selectedFeed?.id === feed.id}
                  onClick={() => onSelectFeed(feed)}
                  onUpdate={onFeedsUpdate}
                  allFolders={allFolders}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
