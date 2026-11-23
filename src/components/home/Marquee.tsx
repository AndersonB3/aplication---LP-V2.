const itens = [
  "Gestão responsável",
  "Humanização",
  "Transparência",
  "Eficiência operacional",
  "Compromisso",
  "Comportamento ético",
  "Fortalecimento do SUS",
];

export function Marquee() {
  const linha = [...itens, ...itens];
  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-ink-900 py-6" aria-label="Nossos valores">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-900 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-900 to-transparent" />
      <ul className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {linha.map((item, i) => (
          <li
            key={i}
            aria-hidden={i >= itens.length}
            className="flex items-center gap-10 font-display text-2xl font-bold tracking-tight text-white/80 sm:text-3xl"
          >
            {item}
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-brand-400" fill="currentColor" aria-hidden>
              <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" />
            </svg>
          </li>
        ))}
      </ul>
    </div>
  );
}
