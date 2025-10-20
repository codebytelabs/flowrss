'use client';

import { useEffect, useState } from 'react';
import { dbOperations } from '@/lib/db/schema';
import { fetchAllFeeds } from '@/lib/rss/fetcher';
import type { Feed } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Rss,
  Plus,
  RefreshCw,
  Settings,
  Menu,
  X,
  Inbox,
  Star,
  Bookmark,
  FolderOpen,
  Hash,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FolderList } from '../sidebar/folder-list';
import { CategoryList } from '../sidebar/category-list';
import { FolderPlus } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedFeed: Feed | null;
  onSelectFeed: (feed: Feed | null) => void;
  onFilterChange: (mode: 'all' | 'starred' | 'saved') => void;
  currentFilter: 'all' | 'starred' | 'saved';
}

export function Sidebar({ isOpen, onToggle, selectedFeed, onSelectFeed, onFilterChange, currentFilter }: SidebarProps) {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFeeds();
    
    // Listen for auto-fetch event from migration
    const handleAutoFetch = () => {
      console.log('[Sidebar] Auto-fetch triggered by migration');
      handleRefreshAll();
    };
    
    window.addEventListener('autoFetchFeeds', handleAutoFetch);
    
    return () => {
      window.removeEventListener('autoFetchFeeds', handleAutoFetch);
    };
  }, []);

  const loadFeeds = async () => {
    const allFeeds = await dbOperations.getAllFeeds();
    setFeeds(allFeeds);
    
    // Auto-fetch feeds if they haven't been fetched yet
    if (allFeeds.length > 0) {
      const needsFetch = allFeeds.some(feed => !feed.lastFetched);
      if (needsFetch) {
        console.log('[Sidebar] Auto-fetching feeds for the first time...');
        setTimeout(() => handleRefreshAll(), 1000);
      }
    }
  };

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    console.log('[Sidebar] Starting refresh all feeds');
    try {
      await fetchAllFeeds(false);
      await loadFeeds();
      console.log('[Sidebar] Refresh complete, dispatching event');
      // Notify other components that feeds have been refreshed
      window.dispatchEvent(new CustomEvent('refreshFeeds'));
    } catch (error) {
      console.error('[Sidebar] Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredFeeds = feeds.filter(feed =>
    feed.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-card border-r flex flex-col transition-transform duration-200',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header - Folo style with clickable logo */}
        <div className="px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onSelectFeed(null);
                onFilterChange('all');
              }}
              className="flex items-center hover:opacity-80 transition-opacity flex-1 -my-1"
              title="Go to home"
            >
              <img 
                src="/logo-full.png" 
                alt="FlowRSS" 
                className="h-[76px] w-auto object-contain max-w-[300px]"
              />
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="ml-auto lg:hidden flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <Input
            placeholder="Search feeds..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Quick filters - Folo style */}
        <div className="p-2 border-b space-y-1">
          <Button
            variant={currentFilter === 'all' && !selectedFeed ? 'secondary' : 'ghost'}
            className={cn(
              "w-full justify-start transition-all duration-200",
              currentFilter === 'all' && !selectedFeed && "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
            )}
            onClick={() => {
              console.log('[Sidebar] All Articles clicked');
              onFilterChange('all');
            }}
          >
            <Inbox className="w-4 h-4 mr-2" />
            All Articles
          </Button>
          <Button 
            variant={currentFilter === 'starred' ? 'secondary' : 'ghost'}
            className={cn(
              "w-full justify-start transition-all duration-200",
              currentFilter === 'starred' && "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 hover:bg-yellow-500/20"
            )}
            onClick={() => {
              console.log('[Sidebar] Starred clicked');
              onFilterChange('starred');
            }}
          >
            <Star className="w-4 h-4 mr-2" />
            Starred
          </Button>
          <Button 
            variant={currentFilter === 'saved' ? 'secondary' : 'ghost'}
            className={cn(
              "w-full justify-start transition-all duration-200",
              currentFilter === 'saved' && "bg-accent/50 text-accent-foreground border border-accent hover:bg-accent/70"
            )}
            onClick={() => {
              console.log('[Sidebar] Saved clicked');
              onFilterChange('saved');
            }}
          >
            <Bookmark className="w-4 h-4 mr-2" />
            Saved
          </Button>
        </div>

        {/* Feeds list with folders and categories */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {/* User-created folders */}
          <FolderList
            feeds={filteredFeeds}
            selectedFeed={selectedFeed}
            onSelectFeed={onSelectFeed}
            onFeedsUpdate={loadFeeds}
          />

          {/* Auto-categorized feeds */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 py-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Categories
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.dispatchEvent(new CustomEvent('openAddFeed'))}
                className="h-6 w-6 p-0"
                title="Create folder"
              >
                <FolderPlus className="h-3 w-3" />
              </Button>
            </div>
            <CategoryList
              feeds={filteredFeeds}
              selectedFeed={selectedFeed}
              onSelectFeed={onSelectFeed}
              onFeedsUpdate={loadFeeds}
            />
          </div>
        </div>

        {/* Footer actions - Folo style */}
        <div className="p-2 border-t space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start hover:scale-[1.02] transition-all duration-200 font-medium"
            onClick={() => window.dispatchEvent(new CustomEvent('openAddFeed'))}
          >
            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center mr-2">
              <Plus className="w-3 h-3 text-primary" />
            </div>
            Add Feed
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start hover:scale-[1.02] transition-all duration-200"
            onClick={handleRefreshAll}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn('w-4 h-4 mr-2', isRefreshing && 'animate-spin')} />
            {isRefreshing ? 'Refreshing...' : 'Refresh All'}
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start hover:scale-[1.02] transition-all duration-200"
            onClick={() => window.dispatchEvent(new CustomEvent('openSettings'))}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </aside>

      {/* Mobile menu button */}
      {!isOpen && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-40 lg:hidden"
          onClick={onToggle}
        >
          <Menu className="w-4 h-4" />
        </Button>
      )}
    </>
  );
}
