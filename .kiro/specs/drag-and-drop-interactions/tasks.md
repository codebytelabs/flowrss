# Implementation Plan

- [ ] 1. Set up core drag-and-drop infrastructure
  - Create DragDropProvider context with state management for drag operations, multi-select, and undo/redo
  - Implement UndoRedoManager class with 20-action stack limit
  - Add TypeScript interfaces for DraggedItem, DropTarget, and UndoAction
  - _Requirements: 1.1, 1.7, 9.1, 9.4_

- [ ] 1.1 Create DragDropProvider context component
  - Implement context with draggedItem, dropTarget, isDragging, and selectedItems state
  - Add startDrag, updateDragPosition, endDrag, and cancelDrag methods
  - Implement toggleSelection and clearSelection for multi-select support
  - Add undo/redo methods with canUndo/canRedo computed properties
  - _Requirements: 1.1, 8.1, 9.1_

- [ ] 1.2 Implement UndoRedoManager utility class
  - Create class with undoStack and redoStack arrays (max 20 items)
  - Implement push, undo, and redo methods
  - Add execute and executeReverse private methods for database operations
  - Clear redo stack when new action is pushed
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 1.3 Add DragDropProvider to app root
  - Wrap application with DragDropProvider in providers.tsx
  - Ensure context is available to all components
  - _Requirements: 1.1_

- [x] 2. Create reusable drag-and-drop hooks
  - Implement useDraggable hook with mouse and touch event support
  - Implement useDroppable hook with validation and hover states
  - Add drag preview customization with setDragImage
  - Handle long-press detection for touch devices (200ms threshold)
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 6.1, 6.2_

- [x] 2.1 Implement useDraggable hook
  - Create hook that accepts UseDraggableOptions (item, callbacks, disabled)
  - Return isDragging state and dragHandleProps object
  - Implement onDragStart handler to call context.startDrag
  - Implement onDragEnd handler to call context.endDrag
  - Add touch event handlers (touchstart, touchmove, touchend)
  - Detect long-press for touch devices (200ms threshold)
  - Create custom drag preview using setDragImage
  - Apply opacity 0.5 to dragged element
  - _Requirements: 1.1, 2.1, 6.1, 6.2_

- [x] 2.2 Implement useDroppable hook
  - Create hook that accepts UseDroppableOptions (target, callbacks, canDrop)
  - Return isOver, canDrop states and dropProps object
  - Implement onDragOver handler to prevent default and validate drop
  - Implement onDragEnter to set hover state
  - Implement onDragLeave to clear hover state
  - Implement onDrop to trigger database update and undo stack push
  - Call canDrop callback to validate drop operations
  - _Requirements: 1.4, 1.5, 2.3, 10.1, 10.4_

- [x] 2.3 Write unit tests for drag-and-drop hooks
  - Test useDraggable initiates drag on mouse down
  - Test useDraggable initiates drag on long press (touch)
  - Test useDroppable validates drop targets
  - Test useDroppable prevents invalid drops
  - _Requirements: 1.1, 1.4, 10.1_

- [x] 3. Enhance FeedItem component with drag functionality
  - Integrate useDraggable hook into FeedItem component
  - Add multi-select support with Ctrl/Cmd+Click
  - Apply visual feedback during drag (opacity, selection ring)
  - Preserve existing context menu and dropdown functionality
  - _Requirements: 1.1, 1.2, 2.1, 8.1, 8.2_

- [x] 3.1 Add drag functionality to FeedItem
  - Import useDraggable and useDragDropContext hooks
  - Call useDraggable with feed data and source location
  - Spread dragHandleProps onto feed item container
  - Apply opacity-50 class when isDragging is true
  - Add dragPreviewRef to container element
  - _Requirements: 1.1, 2.1_

- [x] 3.2 Implement multi-select in FeedItem
  - Get selectedItems and toggleSelection from context
  - Check if feed is selected with selectedItems.has(feed.id)
  - Modify onClick to call toggleSelection when Ctrl/Cmd is pressed
  - Apply ring-2 ring-primary class when isSelected is true
  - _Requirements: 8.1, 8.2_

- [x] 3.3 Add visual feedback for drag state
  - Apply opacity-50 when isDragging
  - Show selection ring when isSelected
  - Maintain existing hover states
  - _Requirements: 2.1, 2.2_

- [x] 4. Enhance FolderItem component with drop functionality
  - Integrate useDroppable hook into FolderItem component
  - Implement drop validation to prevent circular references
  - Add visual feedback for valid/invalid drop targets
  - Handle feed drop with database update
  - _Requirements: 1.4, 1.5, 2.3, 2.4, 10.1, 10.2_

- [x] 4.1 Add drop functionality to FolderItem
  - Import useDroppable hook
  - Call useDroppable with folder data as target
  - Implement onDrop callback to update feed's folderId
  - Implement canDrop callback to validate drop operations
  - Spread dropProps onto folder container element
  - _Requirements: 1.4, 1.5_

- [x] 4.2 Implement drop validation logic
  - Check if item type is compatible with folder
  - Prevent dropping folder into itself using isDescendant check
  - Prevent dropping feed that's already in the folder
  - Return validation result from canDrop callback
  - _Requirements: 10.1, 10.2, 10.3_

- [x] 4.3 Add visual feedback for drop states
  - Apply bg-accent border-2 border-primary when isOver and canDrop
  - Apply bg-destructive/10 when isOver and !canDrop
  - Show "not-allowed" cursor for invalid drops
  - _Requirements: 2.3, 2.4_

- [x] 4.4 Handle database updates on drop
  - Call dbOperations.updateFeed with new folderId
  - Add operation to undo stack via undoManager.push
  - Show success toast notification
  - Trigger onUpdate callback to refresh UI
  - Handle errors with toast.error and revert UI state
  - _Requirements: 1.5, 1.7, 1.8, 10.4, 10.5_

- [ ] 5. Implement auto-scroll during drag operations
  - Detect when drag is near top or bottom edge (50px threshold)
  - Implement smooth auto-scroll in sidebar
  - Adjust scroll speed based on distance from edge
  - Stop scrolling when drag moves away from edge
  - _Requirements: 2.5_

- [ ] 5.1 Add auto-scroll logic to DragDropProvider
  - Track drag position in updateDragPosition method
  - Calculate distance from top and bottom edges
  - Use requestAnimationFrame for smooth scrolling
  - Implement variable scroll speed (faster near edge)
  - Clean up animation frame on drag end
  - _Requirements: 2.5_

- [ ] 6. Implement keyboard accessibility for drag-and-drop
  - Add keyboard event handlers for Space, Arrow keys, Enter, Escape
  - Implement drag mode navigation between drop targets
  - Add visual focus indicators for keyboard navigation
  - Support Ctrl/Cmd+Z for undo and Ctrl/Cmd+Shift+Z for redo
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 9.2, 9.3_

- [ ] 6.1 Add keyboard navigation to DragDropProvider
  - Implement handleKeyDown method in context
  - Handle Space key to enter drag mode for focused item
  - Handle Arrow keys to navigate between drop targets
  - Handle Enter key to confirm drop operation
  - Handle Escape key to cancel drag operation
  - Track focusedItem and selectedTarget in state
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 6.2 Add undo/redo keyboard shortcuts
  - Listen for Ctrl/Cmd+Z to trigger undo
  - Listen for Ctrl/Cmd+Shift+Z to trigger redo
  - Show toast notification with action description
  - Update UI to reflect undo/redo operation
  - _Requirements: 9.2, 9.3, 9.5_

- [ ] 6.3 Add ARIA attributes for accessibility
  - Add role="button" and aria-label to draggable items
  - Add aria-grabbed attribute to indicate drag state
  - Add aria-dropeffect to drop targets
  - Add tabIndex={0} for keyboard focus
  - Implement live region for screen reader feedback
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 7. Implement multi-feed drag operations
  - Support Ctrl/Cmd+Click to select multiple feeds
  - Show selection count badge during multi-drag
  - Update all selected feeds on drop
  - Clear selection after successful drop
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 7.1 Implement multi-select UI
  - Add selection state to DragDropProvider
  - Show visual indicator (ring) on selected items
  - Display count badge during drag (e.g., "3 items")
  - Update badge position to follow cursor
  - _Requirements: 8.2, 8.3_

- [ ] 7.2 Handle multi-feed drop operations
  - Get all selected feed IDs from context
  - Batch update all feeds in single database transaction
  - Add multi-move action to undo stack
  - Show success toast with count (e.g., "Moved 3 feeds")
  - Clear selection after drop
  - _Requirements: 8.4, 8.5_

- [x] 8. Create PullToRefresh component
  - Implement touch gesture detection for pull-to-refresh
  - Add mouse support for desktop testing
  - Create RefreshIndicator component with logo animation
  - Integrate with ArticleList component
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 8.1 Create PullToRefresh wrapper component
  - Accept onRefresh callback, threshold (80px), and maxPullDistance (120px) props
  - Implement touch event handlers (touchstart, touchmove, touchend)
  - Track pull state (idle, pulling, ready, refreshing)
  - Track pull distance with max limit
  - Prevent default scroll when pulling
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 8.2 Add mouse support for desktop
  - Implement mouse event handlers (mousedown, mousemove, mouseup)
  - Use same pull logic as touch events
  - Add/remove event listeners properly to avoid memory leaks
  - Prevent text selection during drag
  - _Requirements: 6.3, 6.4_

- [x] 8.3 Implement refresh trigger logic
  - Check if pull distance exceeds threshold (80px)
  - Call onRefresh callback when released above threshold
  - Set state to refreshing during operation
  - Reset state and distance after refresh completes
  - Handle refresh errors with try/catch
  - _Requirements: 4.4, 4.7_

- [x] 8.4 Create RefreshIndicator component
  - Accept state (idle, pulling, ready, refreshing) and progress (0-1) props
  - Display FlowRSS logo with rotation based on progress
  - Show appropriate text for each state
  - Animate logo spin during refreshing state
  - Position indicator at top with translateY transform
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 8.5 Integrate PullToRefresh with ArticleList
  - Wrap ArticleList content with PullToRefresh component
  - Pass loadArticles as onRefresh callback
  - Disable pull-to-refresh on desktop (optional)
  - Ensure pull only works when scrolled to top
  - _Requirements: 4.1, 4.6, 6.4_

- [ ] 9. Add error handling and validation
  - Implement DragDropError class for typed errors
  - Add validation for all drop operations
  - Handle database errors with rollback
  - Show user-friendly error messages
  - _Requirements: 1.6, 10.3, 10.4, 10.5_

- [ ] 9.1 Create DragDropError class
  - Extend Error with code property (INVALID_DROP, CIRCULAR_REFERENCE, DATABASE_ERROR)
  - Add details property for debugging
  - Use in all drag-and-drop error scenarios
  - _Requirements: 10.3_

- [ ] 9.2 Implement drop validation
  - Validate item and target exist
  - Check for circular references in folder drops
  - Verify item is not already in target location
  - Return validation errors with specific codes
  - _Requirements: 10.1, 10.2, 10.4_

- [ ] 9.3 Add error handling to drop operations
  - Wrap drop handler in try/catch block
  - Show toast.error for user-facing errors
  - Log detailed errors to console
  - Revert UI state on error (call cancelDrag)
  - _Requirements: 1.6, 10.5_

- [ ] 9.4 Add timeout handling for refresh
  - Implement 30-second timeout for pull-to-refresh
  - Show timeout error message to user
  - Ensure state is reset even on timeout
  - _Requirements: 4.7_

- [ ] 10. Optimize performance
  - Debounce drag position updates to 16ms (60fps)
  - Use CSS transforms for animations (GPU acceleration)
  - Batch database writes in transactions
  - Implement virtual scrolling for large lists (optional)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 10.1 Add debouncing to drag updates
  - Use useMemo to create debounced updatePosition function
  - Set debounce delay to 16ms (~60fps)
  - Clean up debounce on unmount
  - _Requirements: 7.2_

- [ ] 10.2 Use GPU-accelerated animations
  - Replace top/left positioning with transform: translate3d
  - Add will-change: transform to dragged elements
  - Use CSS transitions for smooth animations
  - _Requirements: 7.3_

- [ ] 10.3 Batch database operations
  - Use Dexie transaction for multi-feed updates
  - Group all updates in single transaction
  - Commit transaction atomically
  - _Requirements: 7.4_

- [ ] 11. Add visual polish and animations
  - Implement smooth transitions for drag operations
  - Add spring animations for snap-back on cancel
  - Create ghost image for drag preview
  - Add haptic feedback for mobile (optional)
  - _Requirements: 1.6, 2.1, 2.2, 5.5_

- [ ] 11.1 Create custom drag preview
  - Generate ghost image with feed icon and title
  - Apply semi-transparent styling
  - Position preview at cursor/touch point
  - Update preview position during drag
  - _Requirements: 2.2_

- [ ] 11.2 Add snap-back animation
  - Animate dragged item back to original position on cancel
  - Use CSS transition with ease-out timing
  - Complete animation within 200ms
  - _Requirements: 1.6_

- [ ] 11.3 Add success animations
  - Animate item into new position on successful drop
  - Show checkmark or success indicator briefly
  - Fade out old position, fade in new position
  - _Requirements: 1.8, 5.5_

- [ ] 12. Testing and bug fixes
  - Test drag-and-drop on desktop (Chrome, Firefox, Safari)
  - Test touch gestures on mobile devices (iOS, Android)
  - Test keyboard navigation and accessibility
  - Test pull-to-refresh on various screen sizes
  - Fix any bugs discovered during testing
  - _Requirements: All_

- [ ] 12.1 Manual testing on desktop
  - Test drag feed between folders
  - Test multi-select with Ctrl/Cmd+Click
  - Test undo/redo with keyboard shortcuts
  - Test keyboard navigation (Space, Arrow keys, Enter, Escape)
  - Test invalid drop scenarios
  - _Requirements: 1.1-1.8, 3.1-3.5, 8.1-8.5, 9.1-9.5_

- [ ] 12.2 Manual testing on mobile
  - Test long-press to initiate drag
  - Test pull-to-refresh gesture
  - Test touch scrolling doesn't interfere with drag
  - Test pull-to-refresh only works at top of list
  - Test on iOS Safari and Android Chrome
  - _Requirements: 4.1-4.7, 5.1-5.5, 6.2, 6.5_

- [ ] 12.3 Accessibility testing
  - Test with keyboard only (no mouse)
  - Test with screen reader (VoiceOver, NVDA)
  - Verify ARIA attributes are correct
  - Test focus indicators are visible
  - Verify live regions announce drag state
  - _Requirements: 3.1-3.5_

- [ ] 12.4 Performance testing
  - Measure frame rate during drag (should be 60fps)
  - Measure time to complete drop (<300ms)
  - Test with 100+ feeds in sidebar
  - Check for memory leaks
  - _Requirements: 7.1-7.5_

- [ ] 12.5 Fix bugs and polish
  - Address any issues found during testing
  - Refine animations and transitions
  - Improve error messages
  - Optimize performance bottlenecks
  - _Requirements: All_
