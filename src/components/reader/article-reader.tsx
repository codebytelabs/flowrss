'use client';

import { useState, useEffect } from 'react';
import type { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { dbOperations } from '@/lib/db/schema';
import {
  X,
  ExternalLink,
  Star,
  Bookmark,
  Share2,
  Type,
  Loader2,
} from 'lucide-react';
import { cn, formatDate, extractDomain } from '@/lib/utils';

interface ArticleReaderProps {
  article: Article;
  onClose: () => void;
  onArticleUpdate?: () => void; // Callback to refresh article list
}

export function ArticleReader({ article, onClose, onArticleUpdate }: ArticleReaderProps) {
  const [fullContent, setFullContent] = useState<string | null>(
    article.fullContent || null
  );
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  useEffect(() => {
    if (!article.fullContent && article.link) {
      loadFullContent();
    }
  }, [article.id]);

  const loadFullContent = async () => {
    setIsLoadingContent(true);
    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: article.link }),
      });
      
      const result = await response.json();
      
      if (result.success && result.content) {
        setFullContent(result.content);
        await dbOperations.updateArticle(article.id, {
          fullContent: result.content,
        });
      }
    } catch (error) {
      console.error('Error loading full content:', error);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const [isStarred, setIsStarred] = useState(article.isStarred);
  const [isSaved, setIsSaved] = useState(article.isSaved);

  // Sync local state when article prop changes
  useEffect(() => {
    setIsStarred(article.isStarred);
    setIsSaved(article.isSaved);
  }, [article.isStarred, article.isSaved]);

  const handleToggleStar = async () => {
    await dbOperations.toggleStar(article.id);
    setIsStarred(!isStarred);
    // Notify parent to refresh article list
    if (onArticleUpdate) {
      onArticleUpdate();
    }
  };

  const handleToggleSave = async () => {
    await dbOperations.toggleSave(article.id);
    setIsSaved(!isSaved);
    // Notify parent to refresh article list
    if (onArticleUpdate) {
      onArticleUpdate();
    }
  };

  const content = fullContent || article.content || article.description || '';

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40 md:hidden" 
        onClick={onClose}
      />
      
      {/* Slide-in Reader Panel - Folo style */}
      <div className="fixed inset-y-0 right-0 w-full md:w-2/3 lg:w-1/2 xl:w-2/5 bg-background border-l border-border shadow-2xl z-50 animate-slide-in-right overflow-y-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0 flex-1">
            <img
              src={`https://www.google.com/s2/favicons?domain=${extractDomain(article.link)}&sz=16`}
              alt=""
              className="w-4 h-4 flex-shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="truncate">{extractDomain(article.link)}</span>
            <span>•</span>
            <span className="whitespace-nowrap">{formatDate(article.pubDate)}</span>
          </div>
          
          <div className="flex items-center gap-1 ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleStar}
              className={cn(
                'hover:scale-110 transition-all duration-200',
                isStarred && 'text-yellow-500 bg-yellow-500/10'
              )}
              title={isStarred ? 'Unstar' : 'Star'}
            >
              <Star className={cn('w-4 h-4', isStarred && 'fill-current')} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleSave}
              className={cn(
                'hover:scale-110 transition-all duration-200',
                isSaved && 'text-primary bg-primary/10'
              )}
              title={isSaved ? 'Unsave' : 'Save'}
            >
              <Bookmark className={cn('w-4 h-4', isSaved && 'fill-current')} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(article.link, '_blank')}
              className="hover:scale-110 transition-all duration-200"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:scale-110 transition-all duration-200"
              title="Close"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <article className="p-6 lg:p-8 pb-20">
          {/* Title */}
          <h1 className="text-2xl lg:text-3xl font-bold leading-tight mb-4">
            {article.title}
          </h1>
          
          {/* Author */}
          {article.author && (
            <p className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
              <span>by</span>
              <span className="font-medium">{article.author}</span>
            </p>
          )}
          
          {/* Featured Image */}
          {article.imageUrl && (
            <div className="mb-8">
              <img
                src={article.imageUrl}
                alt=""
                className="w-full rounded-xl shadow-sm"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {isLoadingContent && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
          
          {/* Content */}
          <div
            className={cn(
              'reader-content prose prose-lg dark:prose-invert max-w-none',
              fontSize === 'small' && 'text-size-small',
              fontSize === 'medium' && 'text-size-medium',
              fontSize === 'large' && 'text-size-large'
            )}
          >
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: content }} className="leading-relaxed" />
            ) : (
              <div className="p-4 bg-muted/50 rounded-lg border border-dashed border-border">
                <p className="text-sm text-muted-foreground mb-3">
                  Content not available. Read the full article on the original site:
                </p>
                <a 
                  href={article.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Read Full Article
                </a>
              </div>
            )}
          </div>
        </article>
      </div>
    </>
  );
}
