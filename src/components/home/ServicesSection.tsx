import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";

const destaques = [
  {
    area: "Medicina diagnóstica",
    titulo: "Laboratório LAMAC",
    texto:
      "Laboratório próprio de análises clínicas e citopatologia, com equipe qualificada e equipamentos de última geração. Afiliado ao PNCQ e à SBAC, foi reconhecido por seis anos consecutivos como laboratório de excelência pelos órgãos de controle.",
    img: "/v2/lab.webp",
    alt: "Profissionais do laboratório LAMAC",
  },
  {
    area: "Controle rigoroso",
    titulo: "Gestão de suprimentos",
    texto:
      "Medicamentos e insumos disponíveis sempre que necessário, sem excessos ou faltas que comprometam o serviço. Um controle bem estruturado garante agilidade e qualidade no cuidado aos pacientes.",
    img: "/v2/suprimentos.webp",
    alt: "Farmacêuticos organizando o estoque de medicamentos",
  },
];

const servicos = [
  {
    titulo: "Engenharia clínica",
    texto: "Manutenção preventiva e corretiva de equipamentos hospitalares, com monitoramento em tempo real pelo Programa NEOVERO.",
  },
  {
    titulo: "Atenção integral",
    texto: "Atuação na atenção primária e na média e alta complexidade, garantindo cuidado integral à população.",
  },
  {
    titulo: "Capacitação contínua",
    texto: "Educação permanente para que as equipes ofereçam um atendimento de alta qualidade.",
  },
  {
    titulo: "Inovação nos processos",
    texto: "Prontuários eletrônicos e ferramentas administrativas que tornam o atendimento mais rápido e eficiente.",
  },
];

export function ServicesSection() {
  return (
    <section id="servicos" className="relative bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Serviços"
          title="Uma estrutura completa para cada unidade"
          description="Do laboratório à farmácia, cuidamos de toda a operação que mantém uma unidade de saúde funcionando com qualidade."
        />

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {destaques.map((d, i) => (
            <FadeIn key={d.titulo} delay={i * 0.1}>
              <article className="grid h-full grid-cols-[minmax(0,1fr)_7.5rem] gap-6 rounded-lg border border-slate-200 bg-[var(--background)] p-6 sm:grid-cols-[minmax(0,1fr)_10rem] sm:p-8">
                <div className="flex min-w-0 flex-col">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">{d.area}</p>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-ink-900">{d.titulo}</h3>
                  <p className="mt-4 leading-relaxed text-slate-600">{d.texto}</p>
                </div>
                <div className="relative overflow-hidden rounded-md bg-slate-200">
                  <Image src={d.img} alt={d.alt} fill sizes="160px" className="object-cover" />
                </div>
              </article>
            </FadeIn>
          ))}
        </div>

        <div className="mt-8 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {servicos.map((s, i) => (
            <FadeIn key={s.titulo} delay={i * 0.06}>
              <article className="h-full border-t border-slate-300 py-6">
                <h3 className="font-display text-lg font-semibold text-ink-900">{s.titulo}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{s.texto}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
