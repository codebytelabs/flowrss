'use client';

import { Card } from '@/components/ui/card';
import { formatRelativeTime, truncateText, extractDomain } from '@/lib/utils';
import { Star, Bookmark, Rss } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Article } from '@/types';

interface ArticleCardProps {
  article: Article;
  isSelected: boolean;
  onSelect: () => void;
  onToggleStar: (e: React.MouseEvent) => void;
  onToggleSave: (e: React.MouseEvent) => void;
}

export function ArticleCard({
  article,
  isSelected,
  onSelect,
  onToggleStar,
  onToggleSave,
}: ArticleCardProps) {
  return (
    <Card
      className={cn(
        'group relative overflow-hidden rounded-xl cursor-pointer',
        'bg-white/80 dark:bg-black/80 backdrop-blur-md',
        'shadow-lg hover:shadow-2xl',
        'hover:scale-[1.02] transition-all duration-300',
        'border border-white/20 dark:border-black/20',
        isSelected && 'ring-2 ring-primary shadow-2xl scale-[1.02]'
      )}
      onClick={onSelect}
    >
      {/* Image Section */}
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-muted to-muted/50">
        {article.imageUrl ? (
          <>
            <img
              src={article.imageUrl}
              alt=""
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Rss className="w-16 h-16 text-muted-foreground/20" />
          </div>
        )}
        
        {/* NEW Badge */}
        {!article.isRead && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-primary/90 backdrop-blur-sm text-white text-xs font-medium rounded-full shadow-lg">
            NEW
          </div>
        )}
        
        {/* Unread Indicator */}
        {!article.isRead && (
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-3">
        {/* Metadata */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <img
            src={`https://www.google.com/s2/favicons?domain=${extractDomain(article.link)}&sz=16`}
            alt=""
            className="w-4 h-4 rounded"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="font-medium truncate">{extractDomain(article.link)}</span>
          <span>•</span>
          <span className="whitespace-nowrap">{formatRelativeTime(article.pubDate)}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {article.title}
        </h3>

        {/* Description */}
        {article.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {truncateText(article.description, 120)}
          </p>
        )}

        {/* Author */}
        {article.author && (
          <p className="text-xs text-muted-foreground truncate">
            by {article.author}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex gap-1">
            <button
              onClick={onToggleStar}
              className={cn(
                'p-2 rounded-lg hover:bg-accent hover:scale-110 transition-all duration-200',
                article.isStarred && 'text-yellow-500 bg-yellow-500/10'
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
              onClick={onToggleSave}
              className={cn(
                'p-2 rounded-lg hover:bg-accent hover:scale-110 transition-all duration-200',
                article.isSaved && 'text-primary bg-primary/10'
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
          
          {/* Read status indicator */}
          <div className="text-xs text-muted-foreground">
            {article.isRead ? (
              <span className="opacity-50">Read</span>
            ) : (
              <span className="font-medium text-primary">Unread</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
