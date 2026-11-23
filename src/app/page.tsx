import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { InstitutionalBar } from "@/components/home/InstitutionalBar";
import { AboutSection } from "@/components/home/AboutSection";
import { PillarsSection } from "@/components/home/PillarsSection";
import { ResultsSection } from "@/components/home/ResultsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { AtuacaoSection } from "@/components/home/AtuacaoSection";
import { MediaSection } from "@/components/home/MediaSection";
import { ContactSection } from "@/components/home/ContactSection";
import { StatsSection } from "@/components/home/StatsSection";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { estatisticasFallback } from "@/data/fallback";
import type { Estatisticas } from "@/types";

async function getEstatisticas(): Promise<Estatisticas> {
  if (!isSupabaseConfigured || !supabase) return estatisticasFallback;

  try {
    const { data, error } = await supabase.from("configuracoes_site").select("id, valor");

    if (error || !data?.length) return estatisticasFallback;

    const map = new Map(data.map((d) => [d.id, d.valor]));

    return {
      atendimentos: parseInt(map.get("stat_atendimentos") ?? "250000"),
      unidades: parseInt(map.get("stat_unidades") ?? "12"),
      profissionais: parseInt(map.get("stat_profissionais") ?? "850"),
      satisfacao: parseInt(map.get("stat_satisfacao") ?? "98"),
      subtitulo: map.get("relatorio_subtitulo") ?? "Transparência",
      titulo: map.get("relatorio_titulo") ?? "Relatório Anual de Atendimentos",
      descricao: map.get("relatorio_descricao") ?? estatisticasFallback.descricao,
    };
  } catch {
    return estatisticasFallback;
  }
}

// Seção "Relatório Anual / Transparência" (dados do Supabase) segue desativada
// a pedido do cliente, como no v1. Reativar trocando para true.
const SHOW_RELATORIO_ANUAL = false;

export default async function Home() {
  const stats = SHOW_RELATORIO_ANUAL ? await getEstatisticas() : estatisticasFallback;

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <InstitutionalBar />
        <AboutSection />
        <PillarsSection />
        <ResultsSection />
        <ServicesSection />
        <AtuacaoSection />
        <MediaSection />
        {SHOW_RELATORIO_ANUAL && <StatsSection stats={stats} />}
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
