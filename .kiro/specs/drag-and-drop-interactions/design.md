# Design Document

## Overview

This document outlines the technical design for implementing drag-and-drop feed organization and pull-to-refresh functionality in FlowRSS. The implementation will use modern web APIs and React patterns to provide smooth, accessible interactions across desktop and mobile devices.

## Architecture

### High-Level Component Structure

```
┌─────────────────────────────────────────┐
│         DragDropProvider                │
│  (Context for drag state management)    │
└────────────┬────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼────────┐   ┌───▼──────────┐
│  Sidebar   │   │ ArticleList  │
│            │   │              │
│ ┌────────┐ │   │ ┌──────────┐ │
│ │Folder  │ │   │ │Pull-to-  │ │
│ │Item    │ │   │ │Refresh   │ │
│ └────────┘ │   │ │Component │ │
│            │   │ └──────────┘ │
│ ┌────────┐ │   │              │
│ │Feed    │ │   │ ┌──────────┐ │
│ │Item    │ │   │ │Timeline  │ │
│ │(Dragg.)│ │   │ │Cards     │ │
│ └────────┘ │   │ └──────────┘ │
└────────────┘   └──────────────┘
```

## Components and Interfaces

### 1. DragDropProvider (New Component)

**Purpose:** Centralized state management for drag-and-drop operations

**Location:** `src/components/providers/drag-drop-provider.tsx`

**Interface:**
```typescript
interface DragDropContextValue {
  // Current drag state
  draggedItem: DraggedItem | null;
  draggedItems: DraggedItem[]; // For multi-select
  dropTarget: DropTarget | null;
  isDragging: boolean;
  
  // Drag operations
  startDrag: (item: DraggedItem, event: DragEvent) => void;
  updateDragPosition: (x: number, y: number) => void;
  endDrag: (target: DropTarget | null) => void;
  cancelDrag: () => void;
  
  // Multi-select
  toggleSelection: (itemId: string) => void;
  clearSelection: () => void;
  selectedItems: Set<string>;
  
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

interface DraggedItem {
  id: string;
  type: 'feed' | 'folder';
  data: Feed | FeedFolder;
  sourceLocation: {
    folderId?: string;
    categoryId?: string;
  };
}

interface DropTarget {
  id: string;
  type: 'folder' | 'category' | 'root';
  isValid: boolean;
  data?: FeedFolder | FeedCategory;
}
```

**Key Features:**
- Uses React Context API for global state
- Manages drag state, multi-selection, and undo/redo stack
- Validates drop targets in real-time
- Handles keyboard navigation for accessibility

### 2. useDraggable Hook

**Purpose:** Makes any component draggable

**Location:** `src/hooks/use-draggable.ts`

**Interface:**
```typescript
interface UseDraggableOptions {
  item: DraggedItem;
  onDragStart?: (event: DragEvent) => void;
  onDragEnd?: (event: DragEvent) => void;
  disabled?: boolean;
}

interface UseDraggableReturn {
  isDragging: boolean;
  dragHandleProps: {
    draggable: boolean;
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: (e: React.DragEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
  };
  dragPreviewRef: React.RefObject<HTMLElement>;
}

function useDraggable(options: UseDraggableOptions): UseDraggableReturn;
```

**Implementation Details:**
- Supports both mouse (drag events) and touch (touch events)
- Creates custom drag preview using `setDragImage`
- Handles long-press detection for touch devices (200ms threshold)
- Applies visual feedback (opacity, transform) during drag

### 3. useDroppable Hook

**Purpose:** Makes any component a valid drop target

**Location:** `src/hooks/use-droppable.ts`

**Interface:**
```typescript
interface UseDroppableOptions {
  target: DropTarget;
  onDrop?: (item: DraggedItem) => void;
  canDrop?: (item: DraggedItem) => boolean;
  disabled?: boolean;
}

interface UseDroppableReturn {
  isOver: boolean;
  canDrop: boolean;
  dropProps: {
    onDragOver: (e: React.DragEvent) => void;
    onDragEnter: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
}

function useDroppable(options: UseDroppableOptions): UseDroppableReturn;
```

**Implementation Details:**
- Validates drop operations using `canDrop` callback
- Provides hover state for visual feedback
- Prevents default browser drag behavior
- Handles drop event and triggers database updates

### 4. Enhanced FeedItem Component

**Location:** `src/components/sidebar/feed-item.tsx` (modify existing)

**Changes:**
```typescript
// Add drag functionality
const { isDragging, dragHandleProps, dragPreviewRef } = useDraggable({
  item: {
    id: feed.id,
    type: 'feed',
    data: feed,
    sourceLocation: {
      folderId: feed.folderId,
      categoryId: feed.category,
    },
  },
  disabled: false,
});

// Add selection support
const { selectedItems, toggleSelection } = useDragDropContext();
const isSelected = selectedItems.has(feed.id);

// Render with drag props
return (
  <div
    ref={dragPreviewRef}
    {...dragHandleProps}
    className={cn(
      "feed-item",
      isDragging && "opacity-50",
      isSelected && "ring-2 ring-primary"
    )}
    onClick={(e) => {
      if (e.ctrlKey || e.metaKey) {
        toggleSelection(feed.id);
      } else {
        onClick();
      }
    }}
  >
    {/* Existing content */}
  </div>
);
```

### 5. Enhanced FolderItem Component

**Location:** `src/components/sidebar/folder-item.tsx` (modify existing)

**Changes:**
```typescript
// Add drop functionality
const { isOver, canDrop, dropProps } = useDroppable({
  target: {
    id: folder.id,
    type: 'folder',
    isValid: true,
    data: folder,
  },
  onDrop: async (item) => {
    if (item.type === 'feed') {
      await handleFeedDrop(item.data as Feed);
    }
  },
  canDrop: (item) => {
    // Prevent dropping folder into itself or descendants
    if (item.type === 'folder') {
      return !isDescendant(item.id, folder.id);
    }
    return true;
  },
});

// Render with drop props
return (
  <div
    {...dropProps}
    className={cn(
      "folder-item",
      isOver && canDrop && "bg-accent border-2 border-primary",
      isOver && !canDrop && "bg-destructive/10"
    )}
  >
    {/* Existing content */}
  </div>
);
```

### 6. PullToRefresh Component

**Purpose:** Implements pull-to-refresh gesture for article list

**Location:** `src/components/feed/pull-to-refresh.tsx` (new)

**Interface:**
```typescript
interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  threshold?: number; // Default: 80px
  maxPullDistance?: number; // Default: 120px
  disabled?: boolean;
  children: React.ReactNode;
}

function PullToRefresh(props: PullToRefreshProps): JSX.Element;
```

**Implementation:**
```typescript
export function PullToRefresh({
  onRefresh,
  threshold = 80,
  maxPullDistance = 120,
  disabled = false,
  children,
}: PullToRefreshProps) {
  const [pullState, setPullState] = useState<'idle' | 'pulling' | 'ready' | 'refreshing'>('idle');
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isTouchDevice = useRef(false);

  // Touch handlers
  const handleTouchStart = (e: TouchEvent) => {
    if (disabled || containerRef.current?.scrollTop !== 0) return;
    startY.current = e.touches[0].clientY;
    isTouchDevice.current = true;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isTouchDevice.current || pullState === 'refreshing') return;
    
    const currentY = e.touches[0].clientY;
    const distance = Math.min(currentY - startY.current, maxPullDistance);
    
    if (distance > 0) {
      e.preventDefault(); // Prevent scroll
      setPullDistance(distance);
      setPullState(distance >= threshold ? 'ready' : 'pulling');
    }
  };

  const handleTouchEnd = async () => {
    if (pullState === 'ready') {
      setPullState('refreshing');
      try {
        await onRefresh();
      } finally {
        setPullState('idle');
        setPullDistance(0);
      }
    } else {
      setPullState('idle');
      setPullDistance(0);
    }
    startY.current = 0;
    isTouchDevice.current = false;
  };

  // Similar handlers for mouse events (desktop)
  // ...

  return (
    <div ref={containerRef} className="relative overflow-auto">
      {/* Pull indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-transform"
        style={{
          transform: `translateY(${pullDistance - 60}px)`,
          opacity: pullDistance / threshold,
        }}
      >
        <RefreshIndicator state={pullState} progress={pullDistance / threshold} />
      </div>
      
      {children}
    </div>
  );
}
```

### 7. RefreshIndicator Component

**Purpose:** Visual feedback for pull-to-refresh

**Location:** `src/components/feed/refresh-indicator.tsx` (new)

**Interface:**
```typescript
interface RefreshIndicatorProps {
  state: 'idle' | 'pulling' | 'ready' | 'refreshing';
  progress: number; // 0-1
}

function RefreshIndicator({ state, progress }: RefreshIndicatorProps): JSX.Element {
  return (
    <div className="flex items-center gap-3 py-4">
      {/* Logo with rotation based on progress */}
      <div
        className="w-12 h-12 transition-transform"
        style={{
          transform: `rotate(${progress * 360}deg)`,
        }}
      >
        <img
          src="/logo-small.png"
          alt="FlowRSS"
          className={cn(
            "w-full h-full object-contain",
            state === 'refreshing' && "animate-spin"
          )}
        />
      </div>
      
      {/* Status text */}
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {state === 'pulling' && 'Pull to refresh'}
          {state === 'ready' && 'Release to refresh'}
          {state === 'refreshing' && 'Refreshing...'}
        </span>
        {state === 'refreshing' && (
          <span className="text-xs text-muted-foreground">
            Fetching latest articles
          </span>
        )}
      </div>
    </div>
  );
}
```

## Data Models

### Undo/Redo Stack

```typescript
interface UndoAction {
  type: 'move_feed' | 'move_folder' | 'multi_move';
  timestamp: Date;
  data: {
    itemIds: string[];
    fromLocation: {
      folderId?: string;
      categoryId?: string;
    };
    toLocation: {
      folderId?: string;
      categoryId?: string;
    };
  };
}

class UndoRedoManager {
  private undoStack: UndoAction[] = [];
  private redoStack: UndoAction[] = [];
  private maxStackSize = 20;

  push(action: UndoAction): void {
    this.undoStack.push(action);
    if (this.undoStack.length > this.maxStackSize) {
      this.undoStack.shift();
    }
    this.redoStack = []; // Clear redo stack on new action
  }

  async undo(): Promise<void> {
    const action = this.undoStack.pop();
    if (!action) return;

    // Reverse the action
    await this.executeReverse(action);
    this.redoStack.push(action);
  }

  async redo(): Promise<void> {
    const action = this.redoStack.pop();
    if (!action) return;

    // Re-execute the action
    await this.execute(action);
    this.undoStack.push(action);
  }

  private async execute(action: UndoAction): Promise<void> {
    // Move items to toLocation
    for (const itemId of action.data.itemIds) {
      await dbOperations.updateFeed(itemId, {
        folderId: action.data.toLocation.folderId,
        category: action.data.toLocation.categoryId,
      });
    }
  }

  private async executeReverse(action: UndoAction): Promise<void> {
    // Move items back to fromLocation
    for (const itemId of action.data.itemIds) {
      await dbOperations.updateFeed(itemId, {
        folderId: action.data.fromLocation.folderId,
        category: action.data.fromLocation.categoryId,
      });
    }
  }
}
```

## Error Handling

### Drag-and-Drop Errors

```typescript
class DragDropError extends Error {
  constructor(
    message: string,
    public code: 'INVALID_DROP' | 'CIRCULAR_REFERENCE' | 'DATABASE_ERROR',
    public details?: any
  ) {
    super(message);
    this.name = 'DragDropError';
  }
}

// Error handling in drop handler
async function handleDrop(item: DraggedItem, target: DropTarget) {
  try {
    // Validate drop
    if (!validateDrop(item, target)) {
      throw new DragDropError(
        'Invalid drop target',
        'INVALID_DROP',
        { item, target }
      );
    }

    // Check for circular references (folder into itself)
    if (item.type === 'folder' && isDescendant(item.id, target.id)) {
      throw new DragDropError(
        'Cannot move folder into itself or its descendants',
        'CIRCULAR_REFERENCE'
      );
    }

    // Perform database update
    await dbOperations.updateFeed(item.id, {
      folderId: target.type === 'folder' ? target.id : undefined,
    });

    // Add to undo stack
    undoManager.push({
      type: 'move_feed',
      timestamp: new Date(),
      data: {
        itemIds: [item.id],
        fromLocation: item.sourceLocation,
        toLocation: { folderId: target.id },
      },
    });

    // Show success notification
    toast.success(`Moved to ${target.data?.name || 'root'}`);
  } catch (error) {
    if (error instanceof DragDropError) {
      toast.error(error.message);
      console.error('[DragDrop]', error.code, error.details);
    } else {
      toast.error('Failed to move item');
      console.error('[DragDrop] Unexpected error:', error);
    }
    
    // Revert UI state
    cancelDrag();
  }
}
```

### Pull-to-Refresh Errors

```typescript
async function handleRefresh() {
  try {
    setPullState('refreshing');
    
    // Fetch feeds with timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Refresh timeout')), 30000)
    );
    
    await Promise.race([
      refreshAllFeeds(),
      timeoutPromise,
    ]);
    
    toast.success('Feeds refreshed');
  } catch (error) {
    if (error.message === 'Refresh timeout') {
      toast.error('Refresh timed out. Please try again.');
    } else {
      toast.error('Failed to refresh feeds');
    }
    console.error('[PullToRefresh]', error);
  } finally {
    setPullState('idle');
    setPullDistance(0);
  }
}
```

## Testing Strategy

### Unit Tests

**Test Files:**
- `src/hooks/__tests__/use-draggable.test.ts`
- `src/hooks/__tests__/use-droppable.test.ts`
- `src/components/providers/__tests__/drag-drop-provider.test.tsx`
- `src/lib/__tests__/undo-redo-manager.test.ts`

**Test Cases:**
```typescript
describe('useDraggable', () => {
  it('should initiate drag on mouse down', () => {});
  it('should initiate drag on long press (touch)', () => {});
  it('should apply opacity during drag', () => {});
  it('should cleanup on unmount', () => {});
});

describe('useDroppable', () => {
  it('should validate drop targets', () => {});
  it('should prevent invalid drops', () => {});
  it('should trigger onDrop callback', () => {});
  it('should show hover state', () => {});
});

describe('UndoRedoManager', () => {
  it('should push actions to undo stack', () => {});
  it('should undo last action', () => {});
  it('should redo undone action', () => {});
  it('should limit stack size to 20', () => {});
  it('should clear redo stack on new action', () => {});
});
```

### Integration Tests

**Test Scenarios:**
1. Drag feed from one folder to another
2. Drag multiple selected feeds
3. Undo/redo drag operations
4. Pull-to-refresh on article list
5. Keyboard navigation for drag-and-drop
6. Touch gestures on mobile

### Performance Tests

**Metrics to Track:**
- Frame rate during drag (target: 60fps)
- Time to complete drop operation (target: <300ms)
- Database write time (target: <500ms)
- Pull-to-refresh animation smoothness

## Accessibility

### Keyboard Support

**Keyboard Shortcuts:**
- `Space`: Enter drag mode for focused item
- `Arrow Keys`: Navigate between drop targets
- `Enter`: Confirm drop
- `Escape`: Cancel drag
- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Shift + Z`: Redo
- `Ctrl/Cmd + Click`: Multi-select

**Implementation:**
```typescript
function handleKeyDown(e: KeyboardEvent) {
  const { dragMode, focusedItem, selectedTarget } = dragDropState;

  if (e.key === ' ' && focusedItem && !dragMode) {
    e.preventDefault();
    enterDragMode(focusedItem);
  }

  if (dragMode) {
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        e.preventDefault();
        navigateTargets(e.key === 'ArrowUp' ? -1 : 1);
        break;
      case 'Enter':
        e.preventDefault();
        confirmDrop(selectedTarget);
        break;
      case 'Escape':
        e.preventDefault();
        cancelDrag();
        break;
    }
  }

  // Undo/Redo
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault();
    if (e.shiftKey) {
      redo();
    } else {
      undo();
    }
  }
}
```

### Screen Reader Support

**ARIA Attributes:**
```typescript
<div
  role="button"
  aria-label={`${feed.title}, draggable feed item`}
  aria-grabbed={isDragging}
  aria-dropeffect={canDrop ? 'move' : 'none'}
  tabIndex={0}
>
  {/* Feed content */}
</div>

<div
  role="region"
  aria-label={`${folder.name}, drop target`}
  aria-dropeffect="move"
>
  {/* Folder content */}
</div>
```

**Live Regions for Feedback:**
```typescript
<div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
  {dragState === 'dragging' && `Dragging ${draggedItem.data.title}`}
  {dragState === 'dropped' && `Moved to ${dropTarget.data.name}`}
  {dragState === 'cancelled' && 'Drag cancelled'}
</div>
```

## Performance Optimizations

### 1. Debounced Drag Updates

```typescript
const debouncedUpdatePosition = useMemo(
  () =>
    debounce((x: number, y: number) => {
      updateDragPosition(x, y);
    }, 16), // ~60fps
  []
);
```

### 2. GPU-Accelerated Animations

```typescript
// Use CSS transforms instead of top/left
const dragStyle = {
  transform: `translate3d(${x}px, ${y}px, 0)`,
  willChange: 'transform',
};
```

### 3. Batch Database Writes

```typescript
async function handleMultiDrop(items: DraggedItem[], target: DropTarget) {
  // Batch all updates into single transaction
  await dbOperations.transaction('rw', dbOperations.feeds, async () => {
    for (const item of items) {
      await dbOperations.feeds.update(item.id, {
        folderId: target.id,
      });
    }
  });
}
```

### 4. Virtual Scrolling for Large Lists

```typescript
// Use react-window for large feed lists
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={feeds.length}
  itemSize={48}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <FeedItem feed={feeds[index]} />
    </div>
  )}
</FixedSizeList>
```

## Design Decisions

### Why React Context for Drag State?

- Centralized state management across components
- Avoids prop drilling
- Easy to access from any component
- Supports global keyboard shortcuts

### Why Custom Hooks Instead of Library?

- Full control over behavior
- Smaller bundle size
- No external dependencies
- Tailored to FlowRSS needs
- Better TypeScript integration

### Why Separate Pull-to-Refresh Component?

- Reusable across different lists
- Encapsulates gesture logic
- Easy to test in isolation
- Can be disabled on desktop

### Why Undo/Redo Stack?

- User-friendly error recovery
- Familiar pattern from other apps
- Low implementation complexity
- Enhances user confidence

## Migration Plan

### Phase 1: Core Infrastructure (Week 1)
- Implement DragDropProvider
- Create useDraggable and useDroppable hooks
- Add basic drag-and-drop to FeedItem

### Phase 2: Enhanced Features (Week 2)
- Add multi-select support
- Implement undo/redo
- Add keyboard navigation
- Enhance visual feedback

### Phase 3: Pull-to-Refresh (Week 3)
- Implement PullToRefresh component
- Add RefreshIndicator
- Integrate with ArticleList
- Test on mobile devices

### Phase 4: Polish & Testing (Week 4)
- Performance optimization
- Accessibility audit
- Cross-browser testing
- User acceptance testing

## Dependencies

### New Dependencies

```json
{
  "dependencies": {
    // No new dependencies needed!
    // Using native browser APIs and React
  },
  "devDependencies": {
    "@testing-library/user-event": "^14.5.1" // For testing drag events
  }
}
```

### Browser API Support

- **Drag and Drop API**: Supported in all modern browsers
- **Touch Events**: Supported on all mobile devices
- **Pointer Events**: Fallback for older browsers
- **CSS Transforms**: Universal support

## Security Considerations

### XSS Prevention

```typescript
// Sanitize folder names and feed titles
function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .slice(0, 100); // Limit length
}
```

### Validation

```typescript
// Validate all drop operations
function validateDrop(item: DraggedItem, target: DropTarget): boolean {
  // Check item exists
  if (!item || !item.id) return false;
  
  // Check target exists
  if (!target || !target.id) return false;
  
  // Prevent circular references
  if (item.type === 'folder' && isDescendant(item.id, target.id)) {
    return false;
  }
  
  // Check permissions (future: multi-user)
  // if (!hasPermission(user, 'move', item)) return false;
  
  return true;
}
```

## Future Enhancements

### V2 Features
- Drag-and-drop between browser windows
- Drag feeds from external sources (URLs)
- Animated transitions between folders
- Gesture customization (sensitivity, threshold)

### V3 Features
- Collaborative drag-and-drop (multi-user)
- Drag-and-drop for article organization
- Custom drag previews with thumbnails
- Advanced undo/redo with branching history
