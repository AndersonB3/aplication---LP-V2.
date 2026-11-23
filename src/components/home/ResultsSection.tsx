"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { FadeIn } from "@/components/ui/FadeIn";

const ease = [0.22, 1, 0.36, 1] as const;

// Protocolo de Manchester — limite do protocolo × tempo praticado pelo ISIBA (minutos)
const manchester = [
  { cor: "Vermelho", nivel: "Emergência", hex: "#ef4444", limite: 0, isiba: 0, nota: "Atendimento imediato" },
  { cor: "Laranja", nivel: "Muito urgente", hex: "#f59e0b", limite: 10, isiba: null, nota: "Até 10 min pelo protocolo" },
  { cor: "Amarelo", nivel: "Urgente", hex: "#eab308", limite: 60, isiba: 40 },
  { cor: "Verde", nivel: "Pouco urgente", hex: "#22c55e", limite: 120, isiba: 40 },
  { cor: "Azul", nivel: "Não urgente", hex: "#0ea5e9", limite: 240, isiba: 50 },
];
const MAX = 240;

function Ring({ value }: { value: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 120 120" className="h-40 w-40 -rotate-90">
      <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor" strokeWidth="10" className="text-white/10" />
      <motion.circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="#3ec2bd"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        whileInView={{ strokeDashoffset: c * (1 - value / 100) }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease }}
      />
    </svg>
  );
}

export function ResultsSection() {
  return (
    <section id="resultados" className="relative overflow-hidden bg-[var(--background)] py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Resultados"
            title="Gestão que se mede em vidas atendidas"
            description="Dados extraídos da gestão ISIBA na UPA de Dias d'Ávila, unidade assumida em 10 de janeiro de 2024."
          />
          <FadeIn>
            <a
              href="https://application-relat-rio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center rounded-md border border-ink-900/20 px-6 py-3 text-sm font-semibold text-ink-900 transition-colors hover:border-brand-500 hover:bg-brand-50"
            >
              Relatório de atendimento
            </a>
          </FadeIn>
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-12">
          {/* Atendimentos */}
          <FadeIn className="lg:col-span-7">
            <div className="relative h-full overflow-hidden rounded-lg border border-slate-200 bg-white p-8 sm:p-10">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                Atendimentos · janeiro a setembro de 2024
              </div>
              <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-2">
                <p className="font-display text-6xl font-bold tracking-tight text-ink-900 sm:text-7xl">
                  +<AnimatedCounter target={41.5} decimals={1} suffix="%" />
                </p>
                <p className="max-w-[14rem] pb-3 text-slate-500">de aumento nos atendimentos mensais durante o período</p>
              </div>

              <div className="mt-10 flex h-56 items-end gap-6 sm:gap-10">
                {[
                  { mes: "Janeiro", valor: 3411 },
                  { mes: "Setembro", valor: 4828 },
                ].map((b, i) => (
                  <div key={b.mes} className="flex h-full flex-1 flex-col justify-end">
                    <p className="mb-2 font-display text-xl font-bold text-ink-900">
                      <AnimatedCounter target={b.valor} />
                    </p>
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: `${(b.valor / 4828) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.6, delay: i * 0.25, ease }}
                      className={
                        i === 0
                          ? "rounded-t-md bg-slate-200"
                          : "rounded-t-md bg-brand-500"
                      }
                    />
                    <p className="mt-3 text-sm font-medium text-slate-500">{b.mes}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Satisfação */}
          <FadeIn delay={0.1} className="lg:col-span-5">
            <div className="relative h-full overflow-hidden rounded-lg bg-ink-900 p-8 text-white sm:p-10">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
                Pesquisa de satisfação
              </div>
              <div className="relative mt-6 flex items-center gap-6">
                <div className="relative">
                  <Ring value={97.1} />
                  <p className="absolute inset-0 flex items-center justify-center font-display text-3xl font-extrabold">
                    <AnimatedCounter target={97.1} decimals={1} suffix="%" />
                  </p>
                </div>
                <p className="text-slate-300">dos pacientes avaliaram o atendimento como <strong className="text-white">ótimo</strong> em outubro</p>
              </div>
              <dl className="relative mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-md border border-white/15 p-4">
                  <dt className="text-xs uppercase tracking-widest text-slate-400">Fevereiro</dt>
                  <dd className="mt-1 font-display text-3xl font-bold">179</dd>
                  <dd className="text-sm text-slate-400">participantes · 91,1% ótimo</dd>
                </div>
                <div className="rounded-md border border-brand-400/40 p-4">
                  <dt className="text-xs uppercase tracking-widest text-brand-200">Outubro</dt>
                  <dd className="mt-1 font-display text-3xl font-bold">347</dd>
                  <dd className="text-sm text-brand-100/80">participantes · 337 ótimo</dd>
                </div>
              </dl>
            </div>
          </FadeIn>

          {/* Manchester */}
          <FadeIn className="lg:col-span-12">
            <div className="rounded-lg border border-slate-200 bg-white p-8 sm:p-10">
              <div className="grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                    Tempo de espera
                  </div>
                  <h3 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink-900">
                    Abaixo dos limites do Protocolo de Manchester
                  </h3>
                  <p className="mt-4 leading-relaxed text-slate-600">
                    Triagem e priorização eficazes garantem que todos os grupos sejam atendidos dentro — e bem
                    abaixo — dos padrões estabelecidos.
                  </p>
                  <div className="mt-6 flex items-center gap-5 text-xs text-slate-500">
                    <span className="flex items-center gap-2"><span className="h-2.5 w-6 rounded-full bg-slate-200" /> Limite do protocolo</span>
                    <span className="flex items-center gap-2"><span className="h-2.5 w-6 rounded-full bg-brand-500" /> ISIBA</span>
                  </div>
                </div>

                <ul className="space-y-5 lg:col-span-8">
                  {manchester.map((m, i) => (
                    <li key={m.cor} className="grid grid-cols-[7.5rem_1fr] items-center gap-4 sm:grid-cols-[10rem_1fr]">
                      <div className="flex items-center gap-3">
                        <span className="h-3.5 w-3.5 shrink-0 rounded-full ring-4 ring-offset-0" style={{ background: m.hex, ["--tw-ring-color" as string]: `${m.hex}33` }} />
                        <div>
                          <p className="text-sm font-bold text-ink-900">{m.cor}</p>
                          <p className="text-xs text-slate-500">{m.nivel}</p>
                        </div>
                      </div>
                      {m.limite === 0 || m.isiba === null ? (
                        <p className="text-sm font-medium text-slate-500">{m.nota}</p>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="relative h-3 overflow-hidden rounded-full bg-slate-100">
                            <motion.div
                              className="h-full rounded-full bg-slate-200"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${(m.limite / MAX) * 100}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.2, delay: i * 0.08, ease }}
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                              <motion.div
                                className="h-full rounded-full bg-brand-500"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${(m.isiba / MAX) * 100}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, delay: 0.3 + i * 0.08, ease }}
                              />
                            </div>
                            <p className="w-40 shrink-0 text-right text-xs text-slate-500 sm:text-sm">
                              <strong className="text-ink-900">até {m.isiba} min</strong> · limite {m.limite >= 60 ? `${m.limite / 60} h` : `${m.limite} min`}
                            </p>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
