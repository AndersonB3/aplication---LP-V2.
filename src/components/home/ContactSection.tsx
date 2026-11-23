import { Mail, MessageCircle, Phone, ArrowUpRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";

const canais = [
  {
    icon: MessageCircle,
    titulo: "WhatsApp",
    valor: "(71) 2137-7396",
    href: "https://api.whatsapp.com/send/?phone=557121377396",
    external: true,
  },
  { icon: Phone, titulo: "Central de atendimento", valor: "(71) 2137-7396", href: "tel:+557121377396" },
  { icon: Mail, titulo: "E-mail", valor: "contato@isiba.org.br", href: "mailto:contato@isiba.org.br" },
];

export function ContactSection() {
  return (
    <section id="contato" className="relative overflow-hidden bg-[var(--background)] py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="noise relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 p-8 text-white sm:p-14 lg:p-20">
            <div aria-hidden className="absolute -right-24 -top-24 h-96 w-96 rounded-full border-[48px] border-white/10" />
            <div aria-hidden className="absolute -bottom-32 right-32 h-72 w-72 rounded-full border-[36px] border-white/[0.07]" />

            <div className="relative grid gap-12 lg:grid-cols-2 lg:items-end">
              <div>
                <Eyebrow dark>Fale com a gente</Eyebrow>
                <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
                  Vamos levar essa gestão para a sua cidade?
                </h2>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-brand-50/90">
                  Converse com nossa equipe sobre gestão de UPAs, hospitais e serviços de apoio diagnóstico.
                </p>
              </div>

              <ul className="space-y-3">
                {canais.map((c) => (
                  <li key={c.titulo}>
                    <a
                      href={c.href}
                      {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md transition-all hover:bg-white hover:text-ink-900"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                        <c.icon className="h-5 w-5" />
                      </span>
                      <span className="flex-1">
                        <span className="block text-xs uppercase tracking-widest opacity-70">{c.titulo}</span>
                        <span className="block font-display text-lg font-semibold">{c.valor}</span>
                      </span>
                      <ArrowUpRight className="h-5 w-5 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
