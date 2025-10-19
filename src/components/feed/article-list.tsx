'use client';

import { useEffect, useState } from 'react';
import { dbOperations } from '@/lib/db/schema';
import type { Article, Feed } from '@/types';
import { Card } from '@/components/ui/card';
import { formatRelativeTime, truncateText, extractDomain } from '@/lib/utils';
import { Star, Bookmark, ExternalLink, Rss } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  if (articles.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md p-8">
          <div className="text-6xl mb-4">📰</div>
          <h3 className="text-xl font-semibold">No articles yet</h3>
          <p className="text-muted-foreground">
            {feed 
              ? 'Click "Refresh All" in the sidebar to fetch articles from this feed.' 
              : 'Click "Refresh All" in the sidebar to fetch articles from your feeds.'}
          </p>
          <div className="pt-4">
            <p className="text-sm text-muted-foreground">
              💡 Tip: Articles will load automatically when you add new feeds
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            {filterMode === 'starred' ? 'Starred Articles' : 
             filterMode === 'saved' ? 'Saved Articles' :
             feed ? feed.title : 'All Articles'}
          </h2>
          <span className="text-sm text-muted-foreground">
            {articles.length} {articles.length === 1 ? 'article' : 'articles'}
          </span>
        </div>

        <div className="space-y-3">
          {articles.map(article => (
            <Card
              key={article.id}
              className={cn(
                'group cursor-pointer transition-all hover:shadow-md border overflow-hidden',
                selectedArticle?.id === article.id && 'ring-2 ring-primary',
                !article.isRead && 'border-l-4 border-l-primary'
              )}
              onClick={() => {
                onSelectArticle(article);
                dbOperations.markAsRead(article.id);
              }}
            >
              <div className="flex gap-3 p-3">
                {/* Thumbnail - Fixed 120x120 square */}
                {article.imageUrl ? (
                  <div className="flex-shrink-0 w-[120px] h-[120px] rounded-md overflow-hidden bg-muted">
                    <img
                      src={article.imageUrl}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.parentElement!.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-[120px] h-[120px] rounded-md bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    <Rss className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  {/* Top section */}
                  <div className="space-y-1.5">
                    {/* Source and metadata */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${extractDomain(article.link)}&sz=16`}
                        alt=""
                        className="w-3.5 h-3.5"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span className="font-medium truncate">{extractDomain(article.link)}</span>
                      <span>•</span>
                      <span className="whitespace-nowrap">{formatRelativeTime(article.pubDate)}</span>
                      {!article.isRead && (
                        <span className="ml-auto px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded">
                          NEW
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>

                    {/* Description */}
                    {article.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {truncateText(article.description, 150)}
                      </p>
                    )}
                  </div>

                  {/* Bottom section - Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {article.author && (
                        <span className="truncate max-w-[150px]">by {article.author}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={e => handleToggleStar(e, article.id)}
                        className={cn(
                          'p-1.5 rounded hover:bg-accent transition-colors',
                          article.isStarred && 'text-yellow-500'
                        )}
                        title={article.isStarred ? 'Unstar' : 'Star'}
                      >
                        <Star
                          className={cn(
                            'w-4 h-4',
                            article.isStarred && 'fill-current'
                          )}
                        />
                      </button>
                      <button
                        onClick={e => handleToggleSave(e, article.id)}
                        className={cn(
                          'p-1.5 rounded hover:bg-accent transition-colors',
                          article.isSaved && 'text-primary'
                        )}
                        title={article.isSaved ? 'Unsave' : 'Save'}
                      >
                        <Bookmark
                          className={cn(
                            'w-4 h-4',
                            article.isSaved && 'fill-current'
                          )}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
