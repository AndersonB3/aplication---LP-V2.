"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/**
 * Parágrafo que "acende" palavra por palavra conforme o scroll.
 * Palavras entre **asteriscos** ganham destaque na cor da marca.
 */
export function TextReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  const tokens = text.split(/(\*\*[^*]+\*\*)/g).flatMap((chunk) => {
    const highlight = chunk.startsWith("**");
    const clean = highlight ? chunk.slice(2, -2) : chunk;
    return clean
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => ({ w, highlight }));
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".reveal-word"),
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <p ref={ref} className={cn("text-balance", className)}>
      {tokens.map((t, i) => (
        <span key={i} className={cn("reveal-word", t.highlight && "text-brand-400")}>
          {t.w}
          {i < tokens.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
