import Image from "next/image";
import { Compass, Target, Gem } from "lucide-react";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { TextReveal } from "@/components/ui/TextReveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { FadeIn } from "@/components/ui/FadeIn";

const mvv = [
  {
    icon: Target,
    titulo: "Missão",
    texto:
      "Prestar um serviço de excelência nas áreas de assistência à saúde e educação permanente, garantindo o atendimento humanizado e a gestão eficiente dos recursos humanos e financeiros disponíveis, de modo a permitir a melhoria contínua dos resultados.",
  },
  {
    icon: Compass,
    titulo: "Visão",
    texto:
      "Ser uma entidade reconhecida pela qualidade e eficiência na prestação de serviços na área de saúde, satisfazendo com maestria as necessidades dos nossos clientes e os anseios de nossos pacientes.",
  },
  {
    icon: Gem,
    titulo: "Valores",
    lista: ["Gestão responsável", "Compromisso", "Humanização", "Transparência", "Eficiência operacional", "Comportamento ético"],
  },
];

export function AboutSection() {
  return (
    <section id="quem-somos" className="relative overflow-hidden bg-[var(--background)] py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <FadeIn>
              <Eyebrow>Quem somos</Eyebrow>
              <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
                Quase duas décadas fortalecendo o SUS<span className="text-brand-500">.</span>
              </h2>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="relative mt-10 aspect-[4/5] max-w-sm overflow-hidden rounded-[2rem] bg-brand-100 shadow-2xl shadow-brand-900/20">
                <Image
                  src="/v2/gestor.webp"
                  alt="Gestor do ISIBA com tablet"
                  fill
                  sizes="(max-width: 1024px) 80vw, 380px"
                  className="object-cover object-[65%_center]"
                />
                <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/40 bg-white/70 p-4 backdrop-blur-xl">
                  <p className="font-display text-3xl font-extrabold text-ink-900">19+ anos</p>
                  <p className="text-sm text-slate-600">em saúde, educação e assistência social</p>
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-7 lg:pt-24">
            <TextReveal
              className="font-display text-2xl font-semibold leading-snug tracking-tight text-ink-900 sm:text-3xl lg:text-[2.1rem]"
              text="O **Instituto de Gestão em Saúde (ISIBA)** é uma organização sem fins lucrativos que, desde sua fundação em 2006, se dedica a fortalecer o **Sistema Único de Saúde** em todo o Brasil. Reconhecido como entidade de **Utilidade Pública** pelo Governo da Bahia, atua na ampliação e melhoria do acesso a serviços de saúde de qualidade — com humanização e eficiência no atendimento à população."
            />

            <FadeIn delay={0.1}>
              <p className="mt-10 max-w-2xl text-lg leading-relaxed text-slate-600">
                Colaboramos com diferentes esferas de governo e entidades para construir um sistema de saúde
                mais integrado e acessível, promovendo a equidade e o direito à saúde para todos — da atenção
                primária à média e alta complexidade.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Missão · Visão · Valores */}
        <div className="mt-24 grid gap-5 md:grid-cols-3">
          {mvv.map((item, i) => (
            <FadeIn key={item.titulo} delay={i * 0.1} className="h-full">
              <TiltCard
                max={6}
                className={
                  i === 1
                    ? "rounded-3xl bg-ink-900 p-8 text-white shadow-2xl shadow-ink-900/30"
                    : "rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm"
                }
              >
                <div style={{ transform: "translateZ(40px)" }}>
                  <div
                    className={
                      i === 1
                        ? "flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-400/15 text-brand-300"
                        : "flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"
                    }
                  >
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-bold">{item.titulo}</h3>
                  {item.texto && (
                    <p className={i === 1 ? "mt-3 leading-relaxed text-slate-300" : "mt-3 leading-relaxed text-slate-600"}>
                      {item.texto}
                    </p>
                  )}
                  {item.lista && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {item.lista.map((v) => (
                        <li key={v} className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-sm font-medium text-brand-800">
                          {v}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </TiltCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
