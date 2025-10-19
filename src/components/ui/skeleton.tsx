import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

// Timeline Card Skeleton
function TimelineCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 pb-3">
        {/* Source and metadata */}
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="w-4 h-4 rounded" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-1 rounded-full" />
          <Skeleton className="h-3 w-12" />
        </div>

        {/* Title */}
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-3/4 mb-2" />

        {/* Description */}
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-3" />
      </div>

      {/* Image placeholder */}
      <Skeleton className="aspect-video w-full" />

      {/* Actions */}
      <div className="p-4 pt-3 flex items-center justify-between border-t border-border/50">
        <div className="flex items-center gap-1">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

// Timeline Loading State
function TimelineLoading() {
  return (
    <div className="max-w-timeline mx-auto py-6 px-4">
      {/* Header skeleton */}
      <div className="mb-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Cards skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <TimelineCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export { Skeleton, TimelineCardSkeleton, TimelineLoading };
