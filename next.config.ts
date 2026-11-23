import type { NextConfig } from "next";

const securityHeaders = [
  // Impede que o site seja carregado em iframes de outros domínios (clickjacking)
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  // Impede sniffing de MIME type
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Controla informações de referrer enviadas em requisições
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Força HTTPS por 1 ano (habilitar apenas em produção com HTTPS)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // Restringe APIs do browser que podem ser usadas
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Content Security Policy — controla de onde recursos podem ser carregados
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: permite next.js inline scripts e scripts do próprio domínio
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Estilos: permite inline styles (necessário para Tailwind/Next.js)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fontes: Google Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Imagens: próprio domínio + Supabase Storage (se usar) + thumbnails do YouTube + data URIs
      "img-src 'self' data: blob: https://ynerhiikzfjyljhymdtl.supabase.co https://i.ytimg.com https://img.youtube.com",
      // Conexões de rede: Supabase API
      "connect-src 'self' https://ynerhiikzfjyljhymdtl.supabase.co wss://ynerhiikzfjyljhymdtl.supabase.co",
      // Frames: permite apenas iframes do YouTube
      "frame-src https://www.youtube.com",
      // Objetos (Flash etc.): bloqueado
      "object-src 'none'",
      // Base URI: apenas próprio domínio
      "base-uri 'self'",
      // Form action: apenas próprio domínio
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Remove o header "X-Powered-By: Next.js" — evita expor a tecnologia usada
  poweredByHeader: false,

  async headers() {
    return [
      {
        // Aplica headers de segurança em todas as rotas
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;