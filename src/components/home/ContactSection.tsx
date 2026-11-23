import { Eyebrow } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";

const canais = [
  { titulo: "Central de atendimento", valor: "(71) 2137-7396", href: "tel:+557121377396" },
  { titulo: "WhatsApp", valor: "(71) 2137-7396", href: "https://api.whatsapp.com/send/?phone=557121377396", external: true },
  { titulo: "E-mail", valor: "contato@isiba.org.br", href: "mailto:contato@isiba.org.br" },
];

export function ContactSection() {
  return (
    <section id="contato" className="bg-brand-700 py-20 text-white lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-end lg:px-8">
        <FadeIn>
          <Eyebrow dark>Contato</Eyebrow>
          <h2 className="mt-5 text-balance font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Leve a gestão do ISIBA para o seu município
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-brand-50/90">
            Converse com nossa equipe sobre a gestão de UPAs, hospitais e serviços de apoio diagnóstico.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <dl className="divide-y divide-white/20 border-y border-white/20">
            {canais.map((c) => (
              <div key={c.titulo} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-5">
                <dt className="text-sm text-brand-100">{c.titulo}</dt>
                <dd>
                  <a
                    href={c.href}
                    {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="font-display text-xl font-semibold underline-offset-4 hover:underline"
                  >
                    {c.valor}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </div>
    </section>
  );
}
