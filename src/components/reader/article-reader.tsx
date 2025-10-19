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
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleToggleStar}
              title={isStarred ? 'Unstar' : 'Star'}
            >
              <Star
                className={cn(
                  'w-4 h-4',
                  isStarred && 'fill-yellow-500 text-yellow-500'
                )}
              />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleToggleSave}
              title={isSaved ? 'Unsave' : 'Save'}
            >
              <Bookmark 
                className={cn(
                  'w-4 h-4',
                  isSaved && 'fill-primary text-primary'
                )}
              />
            </Button>
            <Button variant="ghost" size="icon" title="Share">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(article.link, '_blank')}
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 py-8">
        <header className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold leading-tight">{article.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{extractDomain(article.link)}</span>
            <span>•</span>
            <span>{formatDate(article.pubDate)}</span>
            {article.author && (
              <>
                <span>•</span>
                <span>By {article.author}</span>
              </>
            )}
          </div>
        </header>

        {isLoadingContent && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        <div
          className={cn(
            'reader-content prose prose-slate dark:prose-invert max-w-none',
            fontSize === 'small' && 'text-size-small',
            fontSize === 'medium' && 'text-size-medium',
            fontSize === 'large' && 'text-size-large'
          )}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </div>
  );
}
