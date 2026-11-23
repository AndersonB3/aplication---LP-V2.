# ISIBA — Landing Page v2

> Nova versão do site institucional da ISIBA, com cenas 3D em tempo real, scroll cinematográfico e todo o conteúdo da apresentação institucional.

## ✨ O que há de novo em relação ao v1

| Área | v1 | v2 |
|------|----|----|
| Hero | Imagem estática | **Globo 3D helicoidal** inspirado no símbolo da ISIBA (WebGL), reagindo ao mouse e ao scroll |
| Scroll | Nativo | **Lenis** (smooth scroll) sincronizado com **GSAP ScrollTrigger** |
| Quem somos | Texto + 4 cards | Texto que "acende" palavra a palavra + Missão/Visão/Valores em cards com **tilt 3D** |
| Pilares | Grid | **Scroll horizontal fixado** (desktop) com 6 pilares |
| Resultados | — (desativado) | +41,5% atendimentos, pesquisa de satisfação 97,1%, tempos do **Protocolo de Manchester** com gráficos animados |
| Serviços | — | Bento grid: LAMAC, engenharia clínica, suprimentos, atenção integral… |
| Atuação | — | **Mapa 3D interativo** das unidades na Bahia, com arcos partindo da sede |
| Apresentação | Carrossel simples | Vídeos + slides em **coverflow 3D** |
| Visual | Tema claro | Dark/teal da marca, tipografia Montserrat (mesma da apresentação) |

## 🚀 Tecnologias

- [Next.js 16](https://nextjs.org/) (App Router, React Compiler) + React 19
- [Tailwind CSS v4](https://tailwindcss.com/) — design tokens em `src/app/globals.css`
- [Three.js](https://threejs.org/) + [React Three Fiber](https://r3f.docs.pmnd.rs/) + [Drei](https://drei.docs.pmnd.rs/) — cenas 3D
- [GSAP + ScrollTrigger](https://gsap.com/) — animações atreladas ao scroll
- [Lenis](https://lenis.darkroom.engineering/) — smooth scroll
- [Framer Motion](https://motion.dev/) — micro-interações e entradas
- [Supabase](https://supabase.com/) — estatísticas (seção ainda desativada, como no v1)
- [Lucide](https://lucide.dev/) — ícones

## ⚙️ Como rodar

```bash
npm install
npm run dev
```

Acesse http://localhost:3000. Variáveis opcionais em `.env.local` (iguais ao v1):

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=https://isiba.org.br
```

## ⚡ Performance e acessibilidade

- Cenas 3D carregadas sob demanda (`next/dynamic`, `ssr: false`) e montadas só quando próximas da viewport (`LazyCanvas`); desmontadas fora de vista.
- Fallback visual quando o navegador não suporta WebGL.
- `prefers-reduced-motion`: desliga smooth scroll, scroll horizontal fixado e revelação de texto.
- DPR limitado a 1,75 nas cenas 3D.
- Navegação por teclado no carrossel de slides e modal de vídeo com foco preso.

## 📁 Estrutura

```
src/
├── app/                    # layout, página, API /api/stats, notícias, SEO
├── components/
│   ├── home/               # Hero, Marquee, About, Pillars, Results, Services, Atuacao, Media, Contact
│   ├── layout/             # Header (glass, esconde ao rolar), Footer
│   ├── providers/          # SmoothScroll (Lenis + GSAP)
│   ├── three/              # HeroScene, MapScene, LazyCanvas
│   └── ui/                 # TextReveal, TiltCard, SectionHeading, AnimatedCounter, FadeIn
├── data/                   # atuacao.ts (unidades), fallback.ts
└── lib/                    # supabase, utils
public/
├── apresentacao/           # 18 slides institucionais
└── v2/                     # fotos recortadas da apresentação
```

## ✏️ Editando conteúdo

- **Unidades / cidades do mapa:** `src/data/atuacao.ts`
- **Números de resultados:** `src/components/home/ResultsSection.tsx`
- **Itens ocultos a pedido do cliente** (Relatório Anual, Trabalhe Conosco, Notícias): continuam comentados em `Header.tsx` e com a flag `SHOW_RELATORIO_ANUAL` em `page.tsx`.

## 🔒 Segurança

Mantidos do v1: headers HTTP (CSP, HSTS, X-Frame-Options…), rate limiting na API, RLS no Supabase.
