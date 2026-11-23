"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Instagram } from "lucide-react";
import { LazyCanvas } from "@/components/three/LazyCanvas";
import { handleAnchorClick, scrollToSection } from "@/lib/utils";
import { totalUnidades, cidades } from "@/data/atuacao";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

const destaques = [
  { valor: "2006", rotulo: "Desde" },
  { valor: `${totalUnidades}`, rotulo: "Unidades geridas" },
  { valor: `${cidades.length}`, rotulo: "Municípios na Bahia" },
  { valor: "97,1%", rotulo: "Atendimento ótimo*" },
];

/** Brilho estático exibido enquanto (ou se não) o WebGL carrega */
function HeroFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-[12%]">
      <div className="h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(62,194,189,0.55),rgba(26,135,132,0.15)_55%,transparent_70%)] blur-xl" />
    </div>
  );
}

export function HeroSection() {
  // Chegando com hash (ex.: /#atuacao), rola com a mesma animação do menu
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const t = setTimeout(() => scrollToSection(hash.slice(1)), 300);
    return () => clearTimeout(t);
  }, []);

  const titulo = ["Gestão", "humanizada", "em saúde", "pública"];

  return (
    <section id="hero" className="noise relative isolate min-h-svh overflow-hidden bg-ink-950 text-white">
      {/* Gradientes de fundo */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -left-40 top-1/4 h-[36rem] w-[36rem] rounded-full bg-brand-600/20 blur-[120px]" />
        <div className="absolute right-0 top-0 h-[40rem] w-[40rem] rounded-full bg-brand-400/10 blur-[140px]" />
        <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      </div>

      {/* Cena 3D */}
      <LazyCanvas eager className="!absolute inset-x-0 top-0 -z-0 h-[52svh] lg:inset-y-0 lg:h-auto" fallback={<HeroFallback />}>
        <HeroScene />
      </LazyCanvas>

      <div className="pointer-events-none relative z-10 mx-auto flex min-h-svh max-w-7xl flex-col justify-end px-4 pb-14 pt-[46svh] sm:px-6 lg:justify-center lg:px-8 lg:pb-24 lg:pt-32">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-brand-100 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-300 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-300" />
            </span>
            Instituto de Gestão em Saúde · Fortalecendo o SUS
          </motion.div>

          <h1 className="mt-7 font-display text-[clamp(2.75rem,8vw,6.25rem)] font-extrabold leading-[0.95] tracking-tight">
            {titulo.map((linha, i) => (
              <span key={linha} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className={i === 1 ? "text-gradient block" : "block"}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, delay: 0.15 + i * 0.09, ease }}
                >
                  {linha}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease }}
            className="mt-7 max-w-lg text-lg leading-relaxed text-slate-300"
          >
            Solução inteligente no gerenciamento de unidades públicas de saúde — com inovação, eficiência
            e cuidado próximo a cada paciente.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.75, ease }}
            className="pointer-events-auto mt-10 flex flex-wrap items-center gap-3"
          >
            <a
              href="#quem-somos"
              onClick={(e) => handleAnchorClick(e, "#quem-somos")}
              className="group inline-flex items-center gap-2 rounded-full bg-brand-400 px-7 py-3.5 text-sm font-semibold text-ink-950 shadow-[0_0_40px_-8px] shadow-brand-400/70 transition-all hover:bg-brand-300 hover:shadow-brand-300/80"
            >
              Conheça o ISIBA
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="https://www.instagram.com/isiba.saude/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:border-white/40 hover:bg-white/10"
            >
              <Instagram className="h-4 w-4" />
              @isiba.saude
            </a>
          </motion.div>
        </div>

        {/* Números rápidos */}
        <motion.dl
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.95, ease }}
          className="mt-14 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md sm:grid-cols-4 lg:mt-20"
        >
          {destaques.map((d) => (
            <div key={d.rotulo} className="bg-ink-950/60 px-5 py-4">
              <dt className="text-[11px] uppercase tracking-[0.14em] text-slate-400">{d.rotulo}</dt>
              <dd className="mt-1 font-display text-2xl font-bold text-white">{d.valor}</dd>
            </div>
          ))}
        </motion.dl>
      </div>

      <a
        href="#quem-somos"
        onClick={(e) => handleAnchorClick(e, "#quem-somos")}
        aria-label="Rolar para a próxima seção"
        className="absolute bottom-6 right-6 z-10 hidden h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/40 hover:text-white lg:flex"
      >
        <ArrowDown className="h-5 w-5 animate-bounce" />
      </a>
    </section>
  );
}
