"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Building2, MapPin } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LazyCanvas } from "@/components/three/LazyCanvas";
import { cidades, totalUnidades } from "@/data/atuacao";
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
    <section id="atuacao" className="noise relative overflow-hidden bg-ink-950 py-28 text-white lg:py-36">
      <div aria-hidden className="absolute left-1/2 top-1/2 h-[50rem] w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/15 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          dark
          eyebrow="Atuação de excelência"
          title="Presentes onde a saúde pública precisa"
          description={
            <>
              <strong className="text-white">{totalUnidades} unidades</strong> em {cidades.length} municípios baianos, em comunidades
              urbanas e rurais — levando gestão humanizada a todos.
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
                    "w-full rounded-2xl border p-5 text-left transition-all duration-300",
                    active === i
                      ? "border-brand-400/50 bg-brand-400/10 shadow-[0_0_60px_-20px] shadow-brand-400/60"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-display text-lg font-bold">
                      <MapPin className={cn("h-4 w-4", active === i ? "text-brand-300" : "text-slate-500")} />
                      {c.nome}
                    </span>
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-brand-100">
                      {c.unidades.length} {c.unidades.length > 1 ? "unidades" : "unidade"}
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
                        <li key={u} className="flex items-center gap-2">
                          <Building2 className="h-3.5 w-3.5 shrink-0 text-brand-400" />
                          {u}
                        </li>
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
              fallback={<div className="h-full w-full rounded-3xl bg-white/[0.02]" />}
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
