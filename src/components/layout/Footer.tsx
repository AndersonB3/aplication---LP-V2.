import Image from "next/image";
import { Mail, Instagram, MessageCircle } from "lucide-react";

const sociais = [
  { label: "Instagram", href: "https://www.instagram.com/isibasaude", icon: Instagram },
  { label: "WhatsApp", href: "https://api.whatsapp.com/send/?phone=557121377396", icon: MessageCircle },
  { label: "E-mail", href: "mailto:contato@isiba.org.br", icon: Mail },
];

const escritorios = [
  {
    cidade: "Salvador · BA",
    predio: "Edifício Guimarães Trade",
    endereco: "Av. Tancredo Neves, 1189 — Salas 503 a 505, Caminho das Árvores · CEP 41.870-021",
  },
  {
    cidade: "São Paulo · SP",
    predio: "Edifício Palácio das Américas",
    endereco: "Av. Brigadeiro Faria Lima, 1811 — Sala 918 · CEP 01452-001",
  },
];

export function Footer() {
  return (
    <footer id="footer" className="relative overflow-hidden bg-ink-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Image src="/logomarca inferior.png" alt="ISIBA" width={160} height={52} className="h-12 w-auto object-contain" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed">
              Gestão humanizada em saúde pública. Transformando vidas através do cuidado e da eficiência.
            </p>

          </div>

          {escritorios.map((e) => (
            <div key={e.cidade} className="lg:col-span-3">
              <h3 className="font-display text-base font-semibold text-white">{e.cidade}</h3>
              <p className="mt-4 text-sm text-slate-300">{e.predio}</p>
              <p className="mt-2 text-sm leading-relaxed">{e.endereco}</p>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h3 className="font-display text-base font-semibold text-white">Contato</h3>
            <a href="tel:+557121377396" className="mt-4 block text-sm transition-colors hover:text-white">
              (71) 2137-7396
            </a>
            <a href="mailto:contato@isiba.org.br" className="mt-2 block text-sm transition-colors hover:text-white">
              contato@isiba.org.br
            </a>
            <div className="mt-5 flex gap-2">
              {sociais.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 transition-colors hover:border-white hover:text-white"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
              <a
                href="https://www.youtube.com/@midiasisiba"
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 transition-colors hover:border-white hover:text-white"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>
      <div className="border-t border-white/5">
        <p className="mx-auto max-w-7xl px-4 py-6 text-center text-xs sm:px-6 lg:px-8">
          © {new Date().getFullYear()} ISIBA — Instituto de Gestão em Saúde. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
