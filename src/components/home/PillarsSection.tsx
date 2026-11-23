"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Gauge, HeartPulse, Handshake, Eye, Award, Stethoscope } from "lucide-react";
import { Eyebrow } from "@/components/ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const pilares = [
  {
    n: "01",
    icon: Gauge,
    titulo: "Eficiência operacional",
    texto: "Processos otimizados que reduzem esperas e ampliam a capacidade de atendimento.",
  },
  {
    n: "02",
    icon: HeartPulse,
    titulo: "Humanização",
    texto: "Cuidado acolhedor e próximo, valorizando cada paciente e sua família.",
  },
  {
    n: "03",
    icon: Eye,
    titulo: "Transparência",
    texto: "Ações claras e prestação de contas que fortalecem a confiança da sociedade.",
  },
  {
    n: "04",
    icon: Handshake,
    titulo: "Compromisso",
    texto: "Dedicação permanente em entregar resultados que transformam vidas.",
  },
  {
    n: "05",
    icon: Award,
    titulo: "Referência",
    texto: "Estruturação e execução de um método de gestão e assistência moderno e completo, abrangendo todas as etapas.",
  },
  {
    n: "06",
    icon: Stethoscope,
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
      const tween = gsap.to(tr, {
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

      // Parallax interno das imagens dentro de cada painel
      tr.querySelectorAll<HTMLElement>("[data-parallax]").forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: 30 },
          {
            xPercent: -30,
            ease: "none",
            scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
          }
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="pilares" ref={section} className="noise relative overflow-hidden bg-ink-950 text-white">
      <div aria-hidden className="grid-lines absolute inset-0 opacity-60" />
      <div className="relative flex min-h-svh flex-col justify-center py-24 lg:py-0">
        <div
          ref={track}
          className="flex flex-col gap-6 px-4 sm:px-6 lg:w-max lg:flex-row lg:items-stretch lg:gap-8 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:pr-[10vw]"
        >
          {/* Intro */}
          <div className="flex shrink-0 flex-col justify-center lg:w-[30rem] lg:pr-10">
            <Eyebrow dark>Por que o ISIBA</Eyebrow>
            <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
              Pilares que <span className="text-gradient">transformam</span> a saúde pública<span className="text-brand-400">.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-300">
              Uma organização social sem fins lucrativos que existe para garantir que todos tenham acesso a
              serviços de saúde de qualidade.
            </p>
            <p className="mt-8 hidden items-center gap-3 text-sm text-slate-400 lg:flex">
              <span className="h-px w-10 bg-brand-400" /> role para explorar
            </p>
          </div>

          {pilares.map((p) => (
            <article
              key={p.n}
              className="group relative flex shrink-0 flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-ink-800/90 to-ink-900/90 p-8 backdrop-blur-sm transition-colors hover:border-brand-400/40 lg:h-[34rem] lg:w-[26rem]"
            >
              <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-400/0 blur-3xl transition-colors duration-700 group-hover:bg-brand-400/20" />
              <div className="relative mb-8 flex h-24 items-start justify-between lg:h-64">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-400/20 bg-brand-400/10 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-6deg] lg:h-20 lg:w-20">
                  <p.icon className="h-8 w-8 text-brand-300 lg:h-10 lg:w-10" strokeWidth={1.4} />
                </span>
                <span data-parallax className="font-display text-[5rem] font-extrabold leading-none text-white/[0.05] lg:text-[9rem]">{p.n}</span>
              </div>
              <div className="mt-auto">
                <span className="font-mono text-xs text-brand-300">{p.n}</span>
                <h3 className="mt-2 font-display text-2xl font-bold">{p.titulo}</h3>
                <p className="mt-3 leading-relaxed text-slate-300">{p.texto}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Barra de progresso do scroll horizontal */}
        <div className="absolute inset-x-0 bottom-10 mx-auto hidden h-px max-w-xs bg-white/10 lg:block">
          <div ref={progress} className="h-full origin-left scale-x-0 bg-brand-400" />
        </div>
      </div>
    </section>
  );
}
