"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/utils";

interface VideoDef {
  id: string;
  title: string;
  vertical: boolean;
}

const videos: VideoDef[] = [
  { id: "kkHpWnONjCo", title: "Vídeo institucional ISIBA", vertical: false },
  { id: "h0cbuRoNQr4", title: "ISIBA em movimento", vertical: true },
];

const slides = Array.from({ length: 18 }, (_, i) => ({
  src: `/apresentacao/slide-${i + 1}.png`,
  alt: `Apresentação institucional ISIBA — slide ${i + 1}`,
}));

/* ---------------- Vídeos ---------------- */

function VideoModal({ video, onClose }: { video: VideoDef; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !dialogRef.current) return;
      const f = dialogRef.current.querySelectorAll<HTMLElement>("button, iframe");
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/90 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      data-lenis-prevent
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={video.title}
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative overflow-hidden rounded-3xl bg-black shadow-2xl",
          video.vertical ? "aspect-[9/16] max-h-[85vh] w-full max-w-sm" : "aspect-video w-full max-w-5xl"
        )}
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Fechar vídeo"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
        >
          <X className="h-5 w-5" />
        </button>
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </motion.div>
    </motion.div>
  );
}

/* ---------------- Slides em coverflow 3D ---------------- */

function SlideDeck() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const n = slides.length;

  const go = useCallback((d: number) => setCurrent((c) => (c + d + n) % n), [n]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(1), 5000);
    return () => clearInterval(t);
  }, [paused, go]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const diff = touchX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) go(diff > 0 ? 1 : -1);
        touchX.current = null;
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
      role="region"
      aria-roledescription="carrossel"
      aria-label="Apresentação institucional"
      tabIndex={0}
    >
      <div className="relative mx-auto aspect-video w-full max-w-4xl" style={{ perspective: 1600 }}>
        {slides.map((s, i) => {
          let offset = i - current;
          if (offset > n / 2) offset -= n;
          if (offset < -n / 2) offset += n;
          const abs = Math.abs(offset);
          if (abs > 2) return null; // só monta o slide atual e vizinhos

          return (
            <motion.button
              key={s.src}
              type="button"
              onClick={() => offset !== 0 && go(offset)}
              aria-hidden={offset !== 0}
              tabIndex={offset === 0 ? -1 : -1}
              className="absolute inset-0 overflow-hidden rounded-2xl bg-ink-800 shadow-2xl shadow-black/50"
              initial={false}
              animate={{
                x: `${offset * 62}%`,
                rotateY: offset * -32,
                scale: 1 - abs * 0.16,
                z: -abs * 120,
                opacity: abs === 2 ? 0 : 1 - abs * 0.35,
                filter: `brightness(${1 - abs * 0.4})`,
              }}
              style={{ zIndex: 10 - abs, transformStyle: "preserve-3d" }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
            >
              <Image src={s.src} alt={s.alt} fill sizes="(max-width: 1024px) 90vw, 900px" className="object-cover" priority={i === 0} />
            </motion.button>
          );
        })}
      </div>

      <div className="mt-10 flex items-center justify-center gap-4">
        <button
          onClick={() => go(-1)}
          aria-label="Slide anterior"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-brand-400 hover:bg-brand-400 hover:text-ink-950"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="w-32 text-center font-mono text-sm text-slate-400" aria-live="polite">
          <span className="text-white">{String(current + 1).padStart(2, "0")}</span> / {n}
        </div>
        <button
          onClick={() => go(1)}
          aria-label="Próximo slide"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-brand-400 hover:bg-brand-400 hover:text-ink-950"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="mx-auto mt-5 h-px max-w-xs overflow-hidden bg-white/10">
        <motion.div className="h-full bg-brand-400" animate={{ width: `${((current + 1) / n) * 100}%` }} />
      </div>
    </div>
  );
}

export function MediaSection() {
  const [active, setActive] = useState<VideoDef | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setActive(null);
    trigger.current?.focus();
  }, []);

  return (
    <section id="apresentacao" className="relative overflow-hidden bg-ink-900 py-28 text-white lg:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          dark
          align="center"
          eyebrow="Apresentação institucional"
          title="Conheça o ISIBA"
          description="Nossa trajetória, missão e os impactos positivos que geramos na saúde pública."
        />

        {/* Vídeos */}
        <div className="mt-16 grid gap-5 md:grid-cols-[1fr_auto]">
          {videos.map((v, i) => (
            <FadeIn key={v.id} delay={i * 0.1}>
              <button
                type="button"
                onClick={(e) => {
                  trigger.current = e.currentTarget;
                  setActive(v);
                }}
                aria-label={`Assistir: ${v.title}`}
                className={cn(
                  "group relative block w-full overflow-hidden rounded-[2rem] bg-ink-800",
                  v.vertical ? "aspect-[9/16] md:h-full md:w-auto md:max-h-[28rem]" : "aspect-video"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = i === 0 ? "/apresentacao/slide-1.png" : "/apresentacao/slide-3.png";
                  }}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="relative flex h-20 w-20 items-center justify-center">
                    <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-400/40" />
                    <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand-400 text-ink-950 transition-transform duration-300 group-hover:scale-110">
                      <Play className="ml-1 h-7 w-7 fill-current" />
                    </span>
                  </span>
                </div>
                <p className="absolute bottom-5 left-6 text-left font-display text-lg font-semibold">{v.title}</p>
              </button>
            </FadeIn>
          ))}
        </div>

        <div className="mt-28">
          <SlideDeck />
        </div>
      </div>

      <AnimatePresence>{active && <VideoModal video={active} onClose={close} />}</AnimatePresence>
    </section>
  );
}
