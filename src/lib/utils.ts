export function formatarNumero(n: number): string {
  return n.toLocaleString('pt-BR');
}

export const MESES_CURTOS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

export const MESES_COMPLETOS = [
  'Janeiro','Fevereiro','Marco','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
];

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

type LenisLike = { scrollTo: (target: HTMLElement, opts: { offset?: number; duration?: number }) => void };
let lenisInstance: LenisLike | null = null;

/** Registrado pelo provider de smooth scroll (Lenis) */
export function registerLenis(instance: LenisLike | null) {
  lenisInstance = instance;
}

export function scrollToSection(id: string, offset = 80, duration = 700) {
  const el = document.getElementById(id);
  if (!el) return;

  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset: -offset, duration: 1.4 });
    return;
  }

  const startY = window.scrollY;
  const targetY = el.getBoundingClientRect().top + startY - offset;
  const distance = targetY - startY;

  if (distance === 0) return;

  const startTime = performance.now();

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    // behavior: "instant" evita que o scroll-behavior: smooth global (CSS)
    // dispute com a nossa animacao via rAF a cada frame.
    window.scrollTo({ top: startY + distance * eased, behavior: "instant" });
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

export function handleAnchorClick(
  e: MouseEvent | { preventDefault: () => void },
  href: string,
  offset = 80,
  onDone?: () => void
) {
  if (!href.startsWith("#")) return;
  e.preventDefault();
  scrollToSection(href.slice(1), offset);
  onDone?.();
}

const YOUTUBE_ID_PATTERNS = [
  /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
];

export function getYouTubeEmbedId(url: string): string | null {
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  for (const pattern of YOUTUBE_ID_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }
  return null;
}
