"use client";

import { useEffect, useRef } from "react";

const SRC = "/video/hero-loop.mp4";

/**
 * Vídeo de fundo do hero: cenas reais das unidades geridas pelo ISIBA
 * (extraídas do vídeo institucional). Sem áudio, em loop, pausado fora da
 * tela e substituído pela imagem estática para quem prefere menos movimento.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // O React não grava o atributo "muted" no HTML; Safari/iOS exigem que o
    // vídeo esteja mudo *antes* do play para permitir a reprodução automática.
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    let blobUrl: string | null = null;
    let cancelled = false;
    const tryPlay = () => video.play().catch(() => {});

    // Plano B: se o servidor não entregar o vídeo em partes (sem suporte a
    // "range"), alguns navegadores não iniciam. Baixa o arquivo inteiro e
    // toca a partir da memória.
    const fallback = window.setTimeout(async () => {
      if (cancelled || video.readyState >= 3) return;
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

  return (
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
  );
}
