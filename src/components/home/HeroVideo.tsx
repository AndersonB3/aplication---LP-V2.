"use client";

import { useEffect, useRef } from "react";

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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.removeAttribute("autoplay");
      video.pause();
      return;
    }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      <video
        ref={ref}
        className="h-full w-full object-cover"
        src="/video/hero-loop.mp4"
        poster="/video/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      {/* Camada no tom da marca: garante leitura do texto e destaque do globo */}
      <div className="absolute inset-0 bg-ink-950/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/75 to-ink-950/20 lg:bg-gradient-to-r lg:from-ink-950/95 lg:via-ink-950/60 lg:to-ink-950/5" />
    </div>
  );
}
