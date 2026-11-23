import Image from "next/image";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { TextReveal } from "@/components/ui/TextReveal";
import { FadeIn } from "@/components/ui/FadeIn";

const valores = ["Gestão responsável", "Compromisso", "Humanização", "Transparência", "Eficiência operacional", "Comportamento ético"];

export function AboutSection() {
  return (
    <section id="quem-somos" className="relative bg-[var(--background)] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <FadeIn>
              <Eyebrow>Quem somos</Eyebrow>
              <h2 className="mt-5 text-balance font-display text-3xl font-bold leading-tight tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
                Quase duas décadas fortalecendo o SUS
              </h2>
            </FadeIn>

            <FadeIn delay={0.15}>
              <figure className="mt-10 max-w-sm">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-slate-200">
                  <Image
                    src="/v2/gestor.webp"
                    alt="Profissional de gestão do ISIBA"
                    fill
                    sizes="(max-width: 1024px) 80vw, 380px"
                    className="object-cover object-[65%_center]"
                  />
                </div>
                <figcaption className="mt-4 border-l-2 border-brand-500 pl-4 text-sm text-slate-600">
                  Mais de 19 anos prestando serviços de saúde, educação e assistência social.
                </figcaption>
              </figure>
            </FadeIn>
          </div>

          <div className="lg:col-span-7 lg:pt-20">
            <TextReveal
              className="font-display text-xl font-medium leading-relaxed text-ink-900 sm:text-2xl lg:text-[1.75rem] lg:leading-snug"
              text="O **Instituto de Gestão em Saúde (ISIBA)** é uma organização sem fins lucrativos que, desde sua fundação em 2006, se dedica a fortalecer o **Sistema Único de Saúde** em todo o Brasil. Reconhecido como entidade de **Utilidade Pública** pelo Governo da Bahia, atua na ampliação e melhoria do acesso a serviços de saúde de qualidade, com humanização e eficiência no atendimento à população."
            />

            <FadeIn delay={0.1}>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-600">
                Colaboramos com diferentes esferas de governo e entidades para construir um sistema de saúde
                mais integrado e acessível, promovendo a equidade e o direito à saúde para todos.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Missão · Visão · Valores */}
        <div className="mt-20 grid border-t border-slate-300 md:grid-cols-3 md:divide-x md:divide-slate-300">
          <FadeIn className="py-10 md:pr-10">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Missão</h3>
            <p className="mt-4 leading-relaxed text-slate-700">
              Prestar um serviço de excelência nas áreas de assistência à saúde e educação permanente, garantindo o
              atendimento humanizado e a gestão eficiente dos recursos humanos e financeiros disponíveis, de modo a
              permitir a melhoria contínua dos resultados.
            </p>
          </FadeIn>
          <FadeIn delay={0.1} className="border-t border-slate-300 py-10 md:border-t-0 md:px-10">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Visão</h3>
            <p className="mt-4 leading-relaxed text-slate-700">
              Ser uma entidade reconhecida pela qualidade e eficiência na prestação de serviços na área de saúde,
              satisfazendo com maestria as necessidades dos nossos clientes e os anseios de nossos pacientes.
            </p>
          </FadeIn>
          <FadeIn delay={0.2} className="border-t border-slate-300 py-10 md:border-t-0 md:pl-10">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Valores</h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-slate-700">
              {valores.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
