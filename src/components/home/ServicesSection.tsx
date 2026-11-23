import Image from "next/image";
import { Cpu, FlaskConical, PackageCheck, GraduationCap, Layers, MonitorSmartphone } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { TiltCard } from "@/components/ui/TiltCard";
import { cn } from "@/lib/utils";

const servicos = [
  {
    icon: FlaskConical,
    tag: "Medicina diagnóstica",
    titulo: "Laboratório LAMAC",
    texto:
      "Laboratório próprio de análises clínicas e citopatologia. Afiliado ao PNCQ e à SBAC, reconhecido por seis anos consecutivos como laboratório de excelência.",
    img: "/v2/lab.webp",
    span: "md:col-span-2 md:row-span-2",
    dark: true,
  },
  {
    icon: Cpu,
    tag: "Serviço de saúde",
    titulo: "Engenharia clínica",
    texto:
      "Manutenção preventiva e corretiva de equipamentos hospitalares, com monitoramento em tempo real pelo Programa NEOVERO.",
    span: "md:col-span-2",
  },
  {
    icon: PackageCheck,
    tag: "Controle rigoroso",
    titulo: "Gestão de suprimentos",
    texto: "Medicamentos e insumos sempre disponíveis, sem excessos nem faltas que comprometam o cuidado.",
    img: "/v2/suprimentos.webp",
    span: "md:col-span-1 md:row-span-2",
  },
  {
    icon: Layers,
    tag: "Expertise",
    titulo: "Atenção integral",
    texto: "Atenção primária, média e alta complexidade.",
    span: "md:col-span-1",
  },
  {
    icon: GraduationCap,
    tag: "Pessoas",
    titulo: "Capacitação contínua",
    texto: "Educação permanente para equipes que oferecem o melhor cuidado.",
    span: "md:col-span-1",
  },
  {
    icon: MonitorSmartphone,
    tag: "Inovação",
    titulo: "Tecnologia nos processos",
    texto: "Prontuários eletrônicos e ferramentas que agilizam o atendimento.",
    span: "md:col-span-2",
  },
];

export function ServicesSection() {
  return (
    <section id="servicos" className="relative bg-white py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Serviços"
          title="Uma estrutura completa para cada unidade"
          description="Da bancada do laboratório à farmácia, cuidamos de toda a engrenagem que mantém uma unidade de saúde funcionando com qualidade."
        />

        <div className="mt-16 grid auto-rows-[minmax(15rem,auto)] gap-5 md:grid-cols-4">
          {servicos.map((s, i) => (
            <FadeIn key={s.titulo} delay={(i % 3) * 0.08} className={s.span}>
              <TiltCard
                max={5}
                className={cn(
                  "flex flex-col rounded-[2rem] p-7",
                  s.dark ? "bg-ink-900 text-white" : "border border-slate-200 bg-[var(--background)]"
                )}
              >
                {s.img && s.dark && (
                  <div className="absolute inset-y-0 right-0 w-[42%] overflow-hidden">
                    <Image src={s.img} alt="" fill sizes="260px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/40 to-transparent" />
                  </div>
                )}
                {s.img && !s.dark && (
                  <>
                    <Image
                      src={s.img}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={cn(
"object-cover object-top transition-transform duration-700 group-hover:scale-105")}
                    />
                    <div
                      className={cn(
                        "absolute inset-0",
"bg-gradient-to-t from-white via-white/90 to-white/0"
                      )}
                    />
                  </>
                )}
                <div className="relative flex h-full flex-col" style={{ transform: "translateZ(30px)" }}>
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl",
                      s.dark ? "bg-brand-400/20 text-brand-300" : "bg-brand-500 text-white"
                    )}
                  >
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div className="mt-auto pt-10">
                    <p className={cn("text-xs font-semibold uppercase tracking-[0.16em]", s.dark ? "text-brand-300" : "text-brand-600")}>
                      {s.tag}
                    </p>
                    <h3 className={cn("mt-2 font-display font-bold tracking-tight", s.dark ? "text-3xl sm:text-4xl" : "text-2xl", !s.dark && "text-ink-900")}>
                      {s.titulo}
                    </h3>
                    <p className={cn("mt-3 leading-relaxed", s.dark ? "max-w-[55%]" : "max-w-md", s.dark ? "text-slate-300" : "text-slate-600")}>{s.texto}</p>
                  </div>
                </div>
              </TiltCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
