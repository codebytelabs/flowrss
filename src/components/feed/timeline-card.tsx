'use client';

import { Card } from '@/components/ui/card';
import { formatRelativeTime, truncateText, extractDomain } from '@/lib/utils';
import { Star, Bookmark, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Article } from '@/types';

interface TimelineCardProps {
  article: Article;
  isSelected: boolean;
  onSelect: () => void;
  onToggleStar: (e: React.MouseEvent) => void;
  onToggleSave: (e: React.MouseEvent) => void;
}

export function TimelineCard({
  article,
  isSelected,
  onSelect,
  onToggleStar,
  onToggleSave,
}: TimelineCardProps) {
  return (
    <Card
      className={cn(
        'group relative cursor-pointer transition-all duration-200 timeline-card',
        'bg-card border border-border hover:border-primary/50',
        'rounded-xl overflow-hidden',
        isSelected && 'ring-2 ring-primary border-primary shadow-lg'
      )}
      onClick={onSelect}
    >
      {/* Card Header */}
      <div className="p-4 pb-3">
        {/* Source and metadata */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
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
          <time className="whitespace-nowrap">{formatRelativeTime(article.pubDate)}</time>
          {!article.isRead && (
            <span className="ml-auto px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-medium">
              NEW
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold leading-snug mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {article.title}
        </h2>

        {/* Description */}
        {article.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
            {truncateText(article.description, 150)}
          </p>
        )}

        {/* Author */}
        {article.author && (
          <p className="text-xs text-muted-foreground mb-3">
            by {article.author}
          </p>
        )}
      </div>

      {/* Image (if available) - Folo style at bottom */}
      {article.imageUrl && (
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={article.imageUrl}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>
      )}

      {/* No image fallback */}
      {!article.imageUrl && (
        <div className="px-4 pb-2">
          <div className="h-2 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-full" />
        </div>
      )}

      {/* Actions */}
      <div className="p-4 pt-3 flex items-center justify-between border-t border-border/50">
        <div className="flex items-center gap-1">
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(article.link, '_blank');
            }}
            className="p-2 rounded-lg hover:bg-accent hover:scale-110 transition-all duration-200"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Read more button */}
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1">
          <span>Read more</span>
          <span>→</span>
        </button>
      </div>

      {/* Unread indicator */}
      {!article.isRead && (
        <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-r" />
      )}
    </Card>
  );
}
