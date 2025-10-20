"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  threshold?: number;
  maxPullDistance?: number;
  disabled?: boolean;
  children: ReactNode;
}

export function PullToRefresh({
  onRefresh,
  threshold = 80,
  maxPullDistance = 120,
  disabled = false,
  children,
}: PullToRefreshProps) {
  const [pullState, setPullState] = useState<
    "idle" | "pulling" | "ready" | "refreshing"
  >("idle");
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const isTouchDevice = useRef(false);

  // Touch handlers for mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
        isTouchDevice.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (
        !isTouchDevice.current ||
        pullState === "refreshing" ||
        startY.current === 0
      )
        return;

      const currentY = e.touches[0].clientY;
      const distance = Math.min(currentY - startY.current, maxPullDistance);

      if (distance > 0 && container.scrollTop === 0) {
        e.preventDefault();
        setPullDistance(distance);
        setPullState(distance >= threshold ? "ready" : "pulling");
      }
    };

    const handleTouchEnd = async () => {
      if (pullState === "ready") {
        setPullState("refreshing");
        try {
          await onRefresh();
        } catch (error) {
          console.error("[PullToRefresh] Error:", error);
        } finally {
          setPullState("idle");
          setPullDistance(0);
        }
      } else {
        setPullState("idle");
        setPullDistance(0);
      }
      startY.current = 0;
      isTouchDevice.current = false;
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [disabled, pullState, threshold, maxPullDistance, onRefresh]);

  // Mouse handlers for desktop testing
  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    let isMouseDown = false;

    const handleMouseDown = (e: MouseEvent) => {
      if (container.scrollTop === 0) {
        startY.current = e.clientY;
        isMouseDown = true;
        e.preventDefault();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown || pullState === "refreshing" || startY.current === 0)
        return;

      const currentY = e.clientY;
      const distance = Math.min(currentY - startY.current, maxPullDistance);

      if (distance > 0 && container.scrollTop === 0) {
        e.preventDefault();
        setPullDistance(distance);
        setPullState(distance >= threshold ? "ready" : "pulling");
      }
    };

    const handleMouseUp = async () => {
      if (!isMouseDown) return;
      isMouseDown = false;

      if (pullState === "ready") {
        setPullState("refreshing");
        try {
          await onRefresh();
        } catch (error) {
          console.error("[PullToRefresh] Error:", error);
        } finally {
          setPullState("idle");
          setPullDistance(0);
        }
      } else {
        setPullState("idle");
        setPullDistance(0);
      }
      startY.current = 0;
    };

    container.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [disabled, pullState, threshold, maxPullDistance, onRefresh]);

  const progress = Math.min(pullDistance / threshold, 1);

  return (
    <div ref={containerRef} className="relative overflow-auto flex-1">
      {/* Pull indicator */}
      {(pullState !== "idle" || pullDistance > 0) && (
        <div
          className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center transition-all duration-200"
          style={{
            transform: `translateY(${Math.max(pullDistance - 60, 0)}px)`,
            opacity: Math.min(progress, 1),
          }}
        >
          <div className="flex items-center gap-3 py-4 px-6 bg-background/95 backdrop-blur-sm rounded-lg shadow-lg border border-border">
            {/* Logo with rotation */}
            <div
              className={cn(
                "w-10 h-10 transition-transform duration-200",
                pullState === "refreshing" && "animate-spin"
              )}
              style={{
                transform:
                  pullState === "refreshing"
                    ? undefined
                    : `rotate(${progress * 360}deg)`,
              }}
            >
              <img
                src="/logo-small.png"
                alt="FlowRSS"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Status text */}
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {pullState === "pulling" && "Pull to refresh"}
                {pullState === "ready" && "Release to refresh"}
                {pullState === "refreshing" && "Refreshing..."}
              </span>
              {pullState === "refreshing" && (
                <span className="text-xs text-muted-foreground">
                  Fetching latest articles
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
