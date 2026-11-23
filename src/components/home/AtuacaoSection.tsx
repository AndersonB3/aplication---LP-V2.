"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LazyCanvas } from "@/components/three/LazyCanvas";
import { cidades, totalUpas, totalLaboratorios } from "@/data/atuacao";
import { cn } from "@/lib/utils";

const MapScene = dynamic(() => import("@/components/three/MapScene"), { ssr: false });

export function AtuacaoSection() {
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);

  // Percorre as cidades automaticamente enquanto o usuário não interage
  useEffect(() => {
    if (hovering) return;
    const t = setInterval(() => setActive((a) => (a + 1) % cidades.length), 3500);
    return () => clearInterval(t);
  }, [hovering]);

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
                {totalUpas} UPAs e {totalLaboratorios} laboratórios
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
            {cidades.map((c, i) => (
              <li key={c.nome}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => {
                    setHovering(true);
                    setActive(i);
                  }}
                  onBlur={() => setHovering(false)}
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                  className={cn(
                    "w-full border-l-2 py-4 pl-5 pr-2 text-left transition-colors duration-300",
                    active === i ? "border-brand-400 bg-white/[0.04]" : "border-white/15 hover:border-white/40"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-semibold">{c.nome}</span>
                    <span className="text-sm text-slate-400">
                      UPA + laboratório
                    </span>
                  </div>
                  <div
                    className={cn(
                      "grid transition-all duration-500",
                      active === i ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <ul className="space-y-1.5 overflow-hidden text-sm text-slate-300">
                      {c.unidades.map((u) => (
                        <li key={u.nome}>{u.nome}</li>
                      ))}
                    </ul>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          <div className="order-1 lg:order-2 lg:col-span-8">
            <LazyCanvas
              className="h-[22rem] w-full sm:h-[30rem] lg:h-[38rem]"
              fallback={<div className="h-full w-full" />}
            >
              <MapScene
                active={active}
                onHover={(i) => {
                  setHovering(true);
                  setActive(i);
                }}
              />
            </LazyCanvas>
            <p className="mt-2 text-center text-xs text-slate-500">
              Mapa ilustrativo · posições aproximadas a partir da sede em Salvador
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
