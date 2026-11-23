"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { LazyCanvas } from "@/components/three/LazyCanvas";
import { HeroVideo } from "@/components/home/HeroVideo";
import { handleAnchorClick, scrollToSection } from "@/lib/utils";
import { totalUpas, totalLaboratorios } from "@/data/atuacao";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

const destaques = [
  { valor: "2006", rotulo: "Ano de fundação" },
  { valor: `${totalUpas}`, rotulo: "UPAs sob gestão" },
  { valor: `${totalLaboratorios}`, rotulo: "Laboratórios" },
  { valor: "97,1%", rotulo: "Avaliações “ótimo”*" },
];

export function HeroSection() {
  // Chegando com hash (ex.: /#atuacao), rola com a mesma animação do menu
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const t = setTimeout(() => scrollToSection(hash.slice(1)), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="hero" className="relative isolate overflow-hidden bg-ink-950 text-white">
      <HeroVideo />

      {/* Cena 3D */}
      <LazyCanvas eager className="!absolute inset-x-0 top-0 -z-0 h-[52svh] lg:inset-y-0 lg:h-auto">
        <HeroScene />
      </LazyCanvas>

      <div className="pointer-events-none relative z-10 mx-auto flex min-h-svh max-w-7xl flex-col justify-end px-4 pb-12 pt-[46svh] sm:px-6 lg:justify-center lg:px-8 lg:pb-16 lg:pt-32">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-300"
          >
            <span className="h-px w-8 bg-current" aria-hidden />
            Instituto de Gestão em Saúde
          </motion.p>

          <h1 className="mt-6 font-display text-[clamp(2.5rem,6vw,4.75rem)] font-bold leading-[1.05] tracking-tight">
            {["Gestão humanizada", "em saúde pública"].map((linha, i) => (
              <span key={linha} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.15 + i * 0.1, ease }}
                >
                  {i === 0 ? (
                    <>
                      Gestão <span className="text-brand-300">humanizada</span>
                    </>
                  ) : (
                    linha
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300"
          >
            Organização sem fins lucrativos que, desde 2006, fortalece o Sistema Único de Saúde com a gestão
            de UPAs e laboratórios públicos, pautada pela eficiência, pela transparência e pelo cuidado humanizado.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65, ease }}
            className="pointer-events-auto mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href="#quem-somos"
              onClick={(e) => handleAnchorClick(e, "#quem-somos")}
              className="rounded-md bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Conheça o ISIBA
            </a>
            <a
              href="#contato"
              onClick={(e) => handleAnchorClick(e, "#contato")}
              className="rounded-md border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/5"
            >
              Fale conosco
            </a>
          </motion.div>
        </div>

        {/* Números institucionais */}
        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.85 }}
          className="mt-14 grid max-w-3xl grid-cols-2 gap-y-6 border-t border-white/15 pt-6 sm:grid-cols-4 lg:mt-20"
        >
          {destaques.map((d) => (
            <div key={d.rotulo} className="pr-4">
              <dd className="font-display text-3xl font-bold text-white">{d.valor}</dd>
              <dt className="mt-1 text-sm text-slate-400">{d.rotulo}</dt>
            </div>
          ))}
        </motion.dl>
        <p className="mt-4 text-xs text-slate-500">*Pesquisa de satisfação, UPA de Dias d&apos;Ávila, outubro de 2024.</p>
      </div>
    </section>
  );
}
