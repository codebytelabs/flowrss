'use client';

import { useEffect, useState } from 'react';
import { dbOperations } from '@/lib/db/schema';
import type { Article, Feed } from '@/types';
import { TimelineCard } from './timeline-card';
import { cn } from '@/lib/utils';
import { Rss, Plus } from 'lucide-react';

interface ArticleListProps {
  feed: Feed | null;
  selectedArticle: Article | null;
  onSelectArticle: (article: Article) => void;
  filterMode: 'all' | 'starred' | 'saved';
}

export function ArticleList({ feed, selectedArticle, onSelectArticle, filterMode }: ArticleListProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('[ArticleList] Effect triggered - filterMode:', filterMode, 'feed:', feed?.title || 'none');
    loadArticles();
  }, [feed, filterMode]);

  const loadArticles = async () => {
    setIsLoading(true);
    console.log('[ArticleList] Loading articles with filterMode:', filterMode, 'feed:', feed?.title || 'none');
    try {
      let loadedArticles: Article[];
      
      if (filterMode === 'starred') {
        console.log('[ArticleList] Fetching starred articles');
        loadedArticles = await dbOperations.getStarredArticles(50);
      } else if (filterMode === 'saved') {
        console.log('[ArticleList] Fetching saved articles');
        loadedArticles = await dbOperations.getSavedArticles(50);
      } else if (feed) {
        console.log('[ArticleList] Fetching articles for feed:', feed.title);
        loadedArticles = await dbOperations.getArticlesByFeed(feed.id, 50);
      } else {
        console.log('[ArticleList] Fetching all articles');
        loadedArticles = await dbOperations.getAllArticles(50);
      }
      
      console.log('[ArticleList] Loaded', loadedArticles.length, 'articles');
      setArticles(loadedArticles);
    } catch (error) {
      console.error('[ArticleList] Error loading articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStar = async (e: React.MouseEvent, articleId: string) => {
    e.stopPropagation();
    await dbOperations.toggleStar(articleId);
    await loadArticles();
  };

  const handleToggleSave = async (e: React.MouseEvent, articleId: string) => {
    e.stopPropagation();
    await dbOperations.toggleSave(articleId);
    await loadArticles();
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading articles...</p>
        </div>
      </div>
    );
  }

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Rss className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">
        {filterMode === 'starred' ? 'No starred articles yet' :
         filterMode === 'saved' ? 'No saved articles yet' :
         feed ? 'No articles in this feed' : 'No articles yet'}
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-4 max-w-sm">
        {filterMode === 'starred' ? 'Star articles you want to read later.' :
         filterMode === 'saved' ? 'Save articles to your reading list.' :
         feed ? 'This feed doesn\'t have any articles yet.' : 'Subscribe to feeds to start reading.'}
      </p>
      {!feed && (
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Add Feed
        </button>
      )}
    </div>
  );

  if (articles.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-timeline mx-auto py-6 px-4">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* Folo-inspired timeline layout */}
      <div className="max-w-timeline mx-auto py-6 px-4">
        {/* Timeline Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {filterMode === 'starred' ? 'Starred Articles' : 
             filterMode === 'saved' ? 'Saved Articles' :
             feed ? feed.title : 'All Articles'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {articles.length > 0 ? (
              `${articles.length} ${articles.length === 1 ? 'article' : 'articles'}`
            ) : (
              'No articles to show'
            )}
          </p>
        </div>

        {/* Timeline Content */}
        <div className="space-y-4 animate-fade-in">
          {articles.map(article => (
            <TimelineCard
              key={article.id}
              article={article}
              isSelected={selectedArticle?.id === article.id}
              onSelect={() => {
                onSelectArticle(article);
                dbOperations.markAsRead(article.id);
              }}
              onToggleStar={(e) => handleToggleStar(e, article.id)}
              onToggleSave={(e) => handleToggleSave(e, article.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
