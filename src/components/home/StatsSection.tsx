import { Users, Hospital, UserCheck, TrendingUp, ExternalLink } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import type { Estatisticas } from "@/types";

interface StatsSectionProps {
  stats: Estatisticas;
}

const icons = [Users, Hospital, UserCheck, TrendingUp];
const colors = [
  { bg: "bg-blue-50", icon: "text-blue-500", border: "border-blue-100" },
  { bg: "bg-emerald-50", icon: "text-emerald-500", border: "border-emerald-100" },
  { bg: "bg-amber-50", icon: "text-amber-500", border: "border-amber-100" },
  { bg: "bg-violet-50", icon: "text-violet-500", border: "border-violet-100" },
];

export function StatsSection({ stats }: StatsSectionProps) {

  const items = [
    { value: stats.atendimentos, label: "Atendimentos Realizados", suffix: "" },
    { value: stats.unidades, label: "Unidades Geridas", suffix: "" },
    { value: stats.profissionais, label: "Profissionais de Saúde", suffix: "" },
    { value: stats.satisfacao, label: "Satisfação dos Usuários", suffix: "%" },
  ];

  return (
    <section id="relatorio" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
              {stats.subtitulo}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display mb-6">
              {stats.titulo}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">{stats.descricao}</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {items.map((item, index) => {
            const Icon = icons[index];
            const color = colors[index];
            return (
              <FadeIn key={item.label} delay={index * 0.1}>
                <div className={`relative bg-white rounded-2xl p-8 border ${color.border} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center`}>
                  <div className={`w-16 h-16 rounded-2xl ${color.bg} flex items-center justify-center mx-auto mb-6`}>
                    <Icon className={`w-8 h-8 ${color.icon}`} />
                  </div>
                  <div className="text-4xl font-bold text-slate-900 font-display mb-2">
                    <AnimatedCounter target={item.value} suffix={item.suffix} />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">{item.label}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={0.4}>
          <div className="text-center">
            <a
              href="https://application-relat-rio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-teal-500 text-white font-semibold text-base shadow-lg shadow-teal-500/25 hover:bg-teal-600 hover:shadow-xl hover:shadow-teal-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Acessar Relatório Completo
              <ExternalLink className="w-4.5 h-4.5" />
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
