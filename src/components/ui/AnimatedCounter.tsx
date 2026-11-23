"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
}

export function AnimatedCounter({
  target,
  suffix = "",
  duration = 2000,
  decimals = 0,
  className,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (hasAnimated) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          const startTime = performance.now();

          function animate(currentTime: number) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setCount(target * eased);
            if (progress < 1) requestAnimationFrame(animate);
          }

          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  const formatted =
    decimals > 0
      ? count.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : Math.floor(count).toLocaleString("pt-BR");

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {formatted}
      {suffix}
    </span>
  );
}
