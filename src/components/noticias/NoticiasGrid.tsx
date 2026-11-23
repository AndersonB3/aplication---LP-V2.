"use client";

import { Calendar, Newspaper, Play, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn, getYouTubeEmbedId } from "@/lib/utils";
import type { Noticia } from "@/types";

interface NoticiasGridProps {
  noticias: Noticia[];
}

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function NoticiasGrid({ noticias }: NoticiasGridProps) {
  const [activeNoticia, setActiveNoticia] = useState<Noticia | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const openNoticia = useCallback((noticia: Noticia, e: React.MouseEvent<HTMLButtonElement>) => {
    lastTriggerRef.current = e.currentTarget;
    setActiveNoticia(noticia);
  }, []);

  const closeModal = useCallback(() => {
    setActiveNoticia(null);
    lastTriggerRef.current?.focus();
  }, []);

  // Foco inicial, Esc para fechar e trap de Tab dentro do modal
  useEffect(() => {
    if (!activeNoticia) return;

    closeButtonRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeModal();
        return;
      }
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], iframe, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeNoticia, closeModal]);

  const activeVideoId = activeNoticia?.video_url ? getYouTubeEmbedId(activeNoticia.video_url) : null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {noticias.map((noticia) => {
          const videoId = noticia.video_url ? getYouTubeEmbedId(noticia.video_url) : null;
          const capa = noticia.imagem_url ?? (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null);

          return (
            <button
              key={noticia.id}
              onClick={(e) => openNoticia(noticia, e)}
              aria-label={`Abrir noticia: ${noticia.titulo}`}
              className="group text-left bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
            >
              <div className="relative w-full aspect-video bg-slate-100 overflow-hidden">
                {capa ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={capa}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Newspaper className="w-10 h-10" />
                  </div>
                )}
                {videoId && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-5 h-5 text-slate-900 fill-slate-900 ml-0.5" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col gap-3 flex-1">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  {noticia.categoria && (
                    <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-600 font-medium">
                      {noticia.categoria}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatarData(noticia.publicado_em)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{noticia.titulo}</h3>
                {noticia.resumo && (
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{noticia.resumo}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Modal */}
      {activeNoticia && (
        <div
          className="fixed inset-0 z-100 bg-black/90 flex items-center justify-center p-4 overflow-y-auto"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={activeNoticia.titulo}
            className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              onClick={closeModal}
              aria-label="Fechar noticia"
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {activeVideoId ? (
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideoId}?rel=0&modestbranding=1`}
                  title={activeNoticia.titulo}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : activeNoticia.imagem_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={activeNoticia.imagem_url} alt="" className="w-full max-h-96 object-cover" />
            ) : null}

            <div className="p-8">
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                {activeNoticia.categoria && (
                  <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-600 font-medium">
                    {activeNoticia.categoria}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatarData(activeNoticia.publicado_em)}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 font-display mb-4">
                {activeNoticia.titulo}
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                {activeNoticia.conteudo.split(/\n\s*\n/).map((paragrafo, i) => (
                  <p key={i} className={cn(paragrafo.trim() === "" && "hidden")}>
                    {paragrafo}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
