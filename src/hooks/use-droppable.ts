import { useState } from 'react';
import type { DraggableData } from './use-draggable';

export interface DroppableOptions {
  onDrop: (data: DraggableData) => void | Promise<void>;
  canDrop?: (data: DraggableData) => boolean;
}

export function useDroppable({ onDrop, canDrop }: DroppableOptions) {
  const [isOver, setIsOver] = useState(false);
  const [canDropHere, setCanDropHere] = useState(true);

  const dropProps = {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = canDropHere ? 'move' : 'none';
    },
    onDragEnter: (e: React.DragEvent) => {
      e.preventDefault();
      setIsOver(true);
      // Note: We can't access drag data in onDragEnter, only in onDrop
      // So we assume drop is valid until proven otherwise in onDrop
      setCanDropHere(true);
    },
    onDragLeave: () => {
      setIsOver(false);
      setCanDropHere(true);
    },
    onDrop: async (e: React.DragEvent) => {
      e.preventDefault();
      setIsOver(false);
      setCanDropHere(true);
      
      try {
        const dataStr = e.dataTransfer.getData('application/json');
        if (!dataStr) return;
        
        const data = JSON.parse(dataStr) as DraggableData;
        
        // Check if drop is allowed
        if (canDrop && !canDrop(data)) {
          return;
        }
        
        await onDrop(data);
      } catch (error) {
        console.error('[useDroppable] Error handling drop:', error);
      }
    },
  };

  return {
    isOver,
    canDrop: canDropHere,
    dropProps,
  };
}
