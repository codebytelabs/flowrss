import { useRef, useState } from 'react';

export interface DraggableData {
  id: string;
  type: 'feed' | 'folder';
  data: any;
}

export function useDraggable(data: DraggableData) {
  const [isDragging, setIsDragging] = useState(false);
  const dragImageRef = useRef<HTMLElement | null>(null);

  const dragHandleProps = {
    draggable: true,
    onDragStart: (e: React.DragEvent) => {
      setIsDragging(true);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('application/json', JSON.stringify(data));
      
      // Set custom drag image if ref is available
      if (dragImageRef.current) {
        e.dataTransfer.setDragImage(dragImageRef.current, 0, 0);
      }
    },
    onDragEnd: () => {
      setIsDragging(false);
    },
  };

  return {
    isDragging,
    dragHandleProps,
    dragImageRef,
  };
}
