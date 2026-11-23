import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { estatisticasFallback } from "@/data/fallback";

// Rate limiting simples em memória (por IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30;       // máximo de requisições
const RATE_WINDOW = 60_000;  // janela de 1 minuto em ms

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT) return true;
  return false;
}

// Evita crescimento indefinido do Map em processos de longa duração
function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}

if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimitMap, RATE_WINDOW).unref?.();
}

export async function GET(request: NextRequest) {
  // Extrai IP real (considera proxies como Vercel/Nginx)
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Muitas requisições. Tente novamente em instantes." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  if (!isSupabaseConfigured || !supabase) {
    return NextResponse.json(estatisticasFallback);
  }

  try {
    const { data, error } = await supabase
      .from("configuracoes_site")
      .select("id, valor");

    if (error || !data?.length) {
      return NextResponse.json(estatisticasFallback);
    }

    const map = new Map(data.map((d) => [d.id, d.valor]));

    return NextResponse.json({
      atendimentos: parseInt(map.get("stat_atendimentos") ?? "250000"),
      unidades: parseInt(map.get("stat_unidades") ?? "12"),
      profissionais: parseInt(map.get("stat_profissionais") ?? "850"),
      satisfacao: parseInt(map.get("stat_satisfacao") ?? "98"),
      subtitulo: map.get("relatorio_subtitulo") ?? "Transparencia",
      titulo: map.get("relatorio_titulo") ?? "Relatorio Anual de Atendimentos",
      descricao: map.get("relatorio_descricao") ?? estatisticasFallback.descricao,
    });
  } catch {
    return NextResponse.json(estatisticasFallback);
  }
}

