'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './sidebar';
import { ArticleList } from '../feed/article-list';
import { ArticleReader } from '../reader/article-reader';
import { AddFeedDialog } from '../add-feed-dialog';
import { SettingsModal } from '../settings-modal';
import { KeyboardShortcutsModal } from '../keyboard-shortcuts-modal';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import type { Article, Feed } from '@/types';

export function MainLayout() {
  const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAddFeedOpen, setIsAddFeedOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'starred' | 'saved'>('all');
  const [articleListKey, setArticleListKey] = useState(0);

  // Handle filter changes from sidebar
  const handleFilterChange = (mode: 'all' | 'starred' | 'saved') => {
    console.log('[MainLayout] Filter changed to:', mode);
    setFilterMode(mode);
    setSelectedFeed(null); // Clear feed selection
    setSelectedArticle(null); // Clear article selection
  };

  // Handle article updates (star/save) from reader
  const handleArticleUpdate = async () => {
    console.log('[MainLayout] Article updated, refreshing list and selected article');
    setArticleListKey(prev => prev + 1); // Force article list to refresh
    
    // Refresh the selected article from database
    if (selectedArticle) {
      const { dbOperations } = await import('@/lib/db/schema');
      const articles = await dbOperations.getAllArticles();
      const updatedArticle = articles.find(a => a.id === selectedArticle.id);
      if (updatedArticle) {
        setSelectedArticle(updatedArticle);
      }
    }
  };

  // Listen for custom events from sidebar
  useEffect(() => {
    const handleOpenAddFeed = () => setIsAddFeedOpen(true);
    const handleOpenSettings = () => setIsSettingsOpen(true);
    const handleRefreshFeeds = () => {
      console.log('[MainLayout] Refresh feeds event received');
      setArticleListKey(prev => prev + 1); // Refresh article list
    };

    window.addEventListener('openAddFeed', handleOpenAddFeed);
    window.addEventListener('openSettings', handleOpenSettings);
    window.addEventListener('refreshFeeds', handleRefreshFeeds);

    return () => {
      window.removeEventListener('openAddFeed', handleOpenAddFeed);
      window.removeEventListener('openSettings', handleOpenSettings);
      window.removeEventListener('refreshFeeds', handleRefreshFeeds);
    };
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: '?',
      shift: true,
      action: () => setIsShortcutsOpen(true),
      description: 'Show shortcuts',
    },
    {
      key: 'a',
      action: () => setIsAddFeedOpen(true),
      description: 'Add feed',
    },
    {
      key: ',',
      action: () => setIsSettingsOpen(true),
      description: 'Settings',
    },
  ], !selectedArticle); // Disable when reading article

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          selectedFeed={selectedFeed}
          onSelectFeed={(feed) => {
            setSelectedFeed(feed);
            setFilterMode('all'); // Reset filter when selecting a feed
          }}
          onFilterChange={handleFilterChange}
          currentFilter={filterMode}
        />

        {/* Article List */}
        <ArticleList
          key={articleListKey}
          feed={selectedFeed}
          selectedArticle={selectedArticle}
          onSelectArticle={setSelectedArticle}
          filterMode={filterMode}
        />

        {/* Article Reader */}
        {selectedArticle && (
          <ArticleReader
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
            onArticleUpdate={handleArticleUpdate}
          />
        )}
      </div>

      {/* Modals */}
      <AddFeedDialog
        open={isAddFeedOpen}
        onOpenChange={setIsAddFeedOpen}
        onSuccess={() => window.location.reload()}
      />
      <SettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
      <KeyboardShortcutsModal
        open={isShortcutsOpen}
        onOpenChange={setIsShortcutsOpen}
      />
    </>
  );
}
