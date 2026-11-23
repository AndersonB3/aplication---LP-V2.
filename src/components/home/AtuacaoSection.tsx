"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LazyCanvas } from "@/components/three/LazyCanvas";
import { cidades, linkMapa, totalUpas, totalLaboratorios } from "@/data/atuacao";
import { cn } from "@/lib/utils";

const MapScene = dynamic(() => import("@/components/three/MapScene"), { ssr: false });

const rotuloTipo = { upa: "UPA", laboratorio: "Laboratório", sede: "Sede" } as const;

export function AtuacaoSection() {
  const [active, setActive] = useState(0);
  const [focus, setFocus] = useState<number | null>(null);
  const [hovering, setHovering] = useState(false);

  // Destaca as cidades em sequência enquanto o usuário não interage
  useEffect(() => {
    if (hovering || focus !== null) return;
    const t = setInterval(() => setActive((a) => (a + 1) % cidades.length), 3500);
    return () => clearInterval(t);
  }, [hovering, focus]);

  function select(i: number) {
    setActive(i);
    setFocus((f) => (f === i ? null : i));
  }

  return (
    <section id="atuacao" className="relative overflow-hidden bg-ink-950 py-24 text-white lg:py-32">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          dark
          eyebrow="Atuação de excelência"
          title="Presentes onde a saúde pública precisa"
          description={
            <>
              <strong className="text-white">
                {totalUpas} UPAs e {totalLaboratorios} laboratórios do Grupo ISIBA
              </strong>{" "}
              em Camaçari e Dias d&apos;Ávila, na Região Metropolitana de Salvador, levando gestão humanizada à
              população.
            </>
          }
        />

        <div className="mt-14 grid items-center gap-8 lg:grid-cols-12">
          <ul
            className="order-2 space-y-3 lg:order-1 lg:col-span-4"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            {cidades.map((c, i) => {
              const open = active === i;
              return (
                <li
                  key={c.nome}
                  className={cn(
                    "border-l-2 transition-colors duration-300",
                    open ? "border-brand-400 bg-white/[0.04]" : "border-white/15 hover:border-white/40"
                  )}
                >
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => select(i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between py-4 pl-5 pr-3 text-left"
                  >
                    <span className="font-display text-lg font-semibold">{c.nome}</span>
                    <span className="text-sm text-slate-400">{focus === i ? "Ver região" : "Aproximar"}</span>
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-500",
                      open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <ul className="space-y-3 overflow-hidden px-5 text-sm">
                      {c.unidades.map((u, k) => (
                        <li key={u.nome} className={cn("flex items-start justify-between gap-3", k === c.unidades.length - 1 && "pb-4")}>
                          <span>
                            <span className="block text-[11px] uppercase tracking-[0.16em] text-brand-300">{rotuloTipo[u.tipo]}</span>
                            <span className="text-slate-200">{u.nome}</span>
                          </span>
                          <a
                            href={linkMapa(u)}
                            target="_blank"
                            rel="noopener noreferrer"
                            tabIndex={open ? 0 : -1}
                            className="shrink-0 rounded border border-white/20 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:border-white"
                          >
                            Como chegar
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="order-1 lg:order-2 lg:col-span-8">
            <div className="relative">
              <LazyCanvas className="h-[22rem] w-full sm:h-[30rem] lg:h-[38rem]" fallback={<div className="h-full w-full" />}>
                <MapScene active={active} focus={focus} onSelect={select} />
              </LazyCanvas>
              {focus !== null && (
                <button
                  type="button"
                  onClick={() => setFocus(null)}
                  className="absolute right-3 top-3 z-20 rounded-md border border-white/25 bg-ink-950/80 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:border-white"
                >
                  Ver região inteira
                </button>
              )}
            </div>
            <p className="mt-2 text-center text-xs text-slate-500">
              Clique numa cidade para aproximar · Divisas: IBGE · Litoral: © OpenStreetMap contributors · Posição das
              unidades aproximada
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
