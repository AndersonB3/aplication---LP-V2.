"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

const SRC = "/video/hero-loop.mp4";

/**
 * Vídeo de fundo do hero: cenas reais das unidades geridas pelo ISIBA
 * (extraídas do vídeo institucional). Sem áudio, em loop e pausado fora da tela.
 * Toca mesmo com "reduzir movimento" ativo (é lento e ambiente), mas tem um
 * botão de pausar visível, como pede a WCAG 2.2.2 para vídeos automáticos.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // O React não grava o atributo "muted" no HTML; Safari/iOS exigem que o
    // vídeo esteja mudo *antes* do play para permitir a reprodução automática.
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    let blobUrl: string | null = null;
    let cancelled = false;
    const tryPlay = () => {
      if (!userPaused.current) video.play().catch(() => {});
    };

    // Plano B: se o servidor não entregar o vídeo em partes (sem suporte a
    // "range"), alguns navegadores não iniciam. Baixa o arquivo inteiro e
    // toca a partir da memória.
    const fallback = window.setTimeout(async () => {
      if (cancelled || userPaused.current || video.readyState >= 3) return;
      try {
        const res = await fetch(video.currentSrc || video.src);
        const blob = await res.blob();
        if (cancelled) return;
        blobUrl = URL.createObjectURL(blob);
        video.src = blobUrl;
        video.load();
        tryPlay();
      } catch {
        /* mantém a imagem estática */
      }
    }, 2000);

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) tryPlay();
      else video.pause();
    });
    io.observe(video);
    tryPlay();

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      io.disconnect();
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, []);

  function toggle() {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      video.play().catch(() => {});
      setPaused(false);
    } else {
      userPaused.current = true;
      video.pause();
      setPaused(true);
    }
  }

  return (
    <>
      <div aria-hidden className="absolute inset-0 -z-10">
        <video
          ref={ref}
          className="h-full w-full object-cover"
          src={SRC}
          poster="/video/hero-poster.jpg"
          muted
          loop
          playsInline
          preload="auto"
        />
        {/* Camada no tom da marca: garante leitura do texto e destaque do globo */}
        <div className="absolute inset-0 bg-ink-950/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/75 to-ink-950/20 lg:bg-gradient-to-r lg:from-ink-950/95 lg:via-ink-950/60 lg:to-ink-950/5" />
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-label={paused ? "Reproduzir vídeo de fundo" : "Pausar vídeo de fundo"}
        className="absolute bottom-5 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-md border border-white/25 text-white/80 transition-colors hover:border-white hover:text-white sm:right-6 lg:right-8"
      >
        {paused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
      </button>
    </>
  );
}
