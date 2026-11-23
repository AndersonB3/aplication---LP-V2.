"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eyebrow } from "@/components/ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const pilares = [
  {
    titulo: "Eficiência operacional",
    texto: "Processos otimizados que reduzem esperas e ampliam a capacidade de atendimento.",
  },
  {
    titulo: "Humanização",
    texto: "Cuidado acolhedor e próximo, valorizando cada paciente e sua família.",
  },
  {
    titulo: "Transparência",
    texto: "Ações claras e prestação de contas que fortalecem a confiança da sociedade.",
  },
  {
    titulo: "Compromisso",
    texto: "Dedicação permanente em entregar resultados que transformam vidas.",
  },
  {
    titulo: "Referência em gestão",
    texto: "Estruturação e execução de um método de gestão e assistência moderno e completo, abrangendo todas as etapas.",
  },
  {
    titulo: "Corpo técnico",
    texto: "Doutores em Gestão Hospitalar e profissionais altamente qualificados no âmbito da saúde.",
  },
];

export function PillarsSection() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section.current;
    const tr = track.current;
    if (!el || !tr) return;

    const mm = gsap.matchMedia();
    // Scroll horizontal "preso" apenas em telas largas e sem preferência por menos movimento
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => tr.scrollWidth - window.innerWidth;
      gsap.to(tr, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progress.current) progress.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="pilares" ref={section} className="relative overflow-hidden bg-ink-950 text-white">
      <div className="relative flex min-h-svh flex-col justify-center py-24 lg:py-0">
        <div
          ref={track}
          className="flex flex-col gap-5 px-4 sm:px-6 lg:w-max lg:flex-row lg:items-stretch lg:gap-6 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-[10vw]"
        >
          {/* Intro */}
          <div className="flex shrink-0 flex-col justify-center pb-6 lg:w-[28rem] lg:pb-0 lg:pr-12">
            <Eyebrow dark>Por que o ISIBA</Eyebrow>
            <h2 className="mt-5 text-balance font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Os pilares da nossa gestão
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-300">
              O ISIBA existe para transformar a saúde pública e garantir que todos tenham acesso a serviços de
              saúde de qualidade.
            </p>
          </div>

          {pilares.map((p) => (
            <article
              key={p.titulo}
              className="flex shrink-0 flex-col justify-end border-t-2 border-brand-400 bg-ink-900 p-8 lg:h-[26rem] lg:w-[22rem]"
            >
              <h3 className="font-display text-2xl font-semibold">{p.titulo}</h3>
              <p className="mt-4 leading-relaxed text-slate-300">{p.texto}</p>
            </article>
          ))}
        </div>

        {/* Progresso do scroll horizontal */}
        <div className="absolute inset-x-0 bottom-10 mx-auto hidden h-px max-w-xs bg-white/15 lg:block">
          <div ref={progress} className="h-full origin-left scale-x-0 bg-brand-400" />
        </div>
      </div>
    </section>
  );
}
