import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NoticiasGrid } from "@/components/noticias/NoticiasGrid";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { noticiasFallback } from "@/data/fallback";
import type { Noticia } from "@/types";

export const metadata: Metadata = {
  title: "Notícias | ISIBA",
  description: "Informativos, novidades e acontecimentos do ISIBA - Gestão Humanizada em Saúde Pública.",
};

async function getNoticias(): Promise<Noticia[]> {
  if (!isSupabaseConfigured || !supabase) return noticiasFallback;

  try {
    const { data, error } = await supabase
      .from("noticias")
      .select("id, titulo, resumo, conteudo, imagem_url, video_url, categoria, publicado_em")
      .order("publicado_em", { ascending: false });

    if (error || !data?.length) return noticiasFallback;

    return data;
  } catch {
    return noticiasFallback;
  }
}

export default async function NoticiasPage() {
  const noticias = await getNoticias();

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal-50 text-teal-600 text-sm font-medium mb-4">
              Notícias
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display mb-6">
              Fique por dentro do ISIBA
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Informativos, novidades e acontecimentos da nossa instituição.
            </p>
          </div>

          <NoticiasGrid noticias={noticias} />
        </div>
      </main>
      <Footer />
    </>
  );
}
