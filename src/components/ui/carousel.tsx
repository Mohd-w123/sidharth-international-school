"use client";

import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarouselProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
}

export function Carousel({
  children,
  autoPlay = false,
  interval = 5000,
  showArrows = true,
  showDots = true,
  className,
}: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const total = children.length;

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (!autoPlay || total <= 1) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, next, total]);

  if (total === 0) return null;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {children.map((child, i) => (
          <div key={i} className="w-full flex-none">
            {child}
          </div>
        ))}
      </div>

      {showArrows && total > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={prev}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={next}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="size-5" />
          </Button>
        </>
      )}

      {showDots && total > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {children.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "h-2 rounded-full transition-all",
                i === current
                  ? "w-6 bg-primary"
                  : "w-2 bg-primary/30 hover:bg-primary/50"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
