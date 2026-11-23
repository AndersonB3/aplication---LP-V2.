"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Monta a cena 3D só quando ela se aproxima da viewport e a desmonta
 * quando sai de vista há bastante tempo — economiza GPU/bateria.
 * Sem WebGL, mostra o fallback.
 */
export function LazyCanvas({
  children,
  fallback = null,
  className,
  rootMargin = "200px",
  eager = false,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  rootMargin?: string;
  eager?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(eager);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- detecção só existe no cliente
    if (!hasWebGL()) setSupported(false);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {supported ? (visible ? children : fallback) : fallback}
    </div>
  );
}
