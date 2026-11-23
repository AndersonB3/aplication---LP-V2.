"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn, handleAnchorClick } from "@/lib/utils";

// Itens desativados no v1 a pedido do cliente (manter comentados até liberação):
// { href: "#relatorio", label: "Relatório Anual" },
// { href: "https://trabalhe-conosco-alpha.vercel.app/", label: "Trabalhe Conosco", external: true },
// { href: "/noticias", label: "Notícias" },
const navLinks = [
  { href: "#quem-somos", label: "Quem somos" },
  { href: "#pilares", label: "Pilares" },
  { href: "#resultados", label: "Resultados" },
  { href: "#servicos", label: "Serviços" },
  { href: "#atuacao", label: "Atuação" },
  { href: "#apresentacao", label: "Apresentação" },
];

const webmail = "http://webmail.isiba.org.br/";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // Esconde ao rolar para baixo, reaparece ao subir
      setHidden(y > 400 && y > last);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkProps = (href: string) =>
    isHome
      ? { href, onClick: (e: React.MouseEvent) => handleAnchorClick(e, href, 80, () => setOpen(false)) }
      : { href: `/${href}` };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 sm:px-6",
        hidden && !open ? "-translate-y-[120%]" : "translate-y-0"
      )}
    >
      <nav
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-6 rounded-lg px-4 py-2.5 transition-all duration-500 sm:px-5",
          scrolled || open || !isHome
            ? "border border-white/10 bg-ink-950/95 shadow-lg shadow-black/20"
            : "border border-transparent"
        )}
      >
        <Link href="/" className="flex shrink-0 items-center" aria-label="ISIBA — página inicial">
          <Image src="/logomarca superior.png" alt="ISIBA" width={160} height={30} className="h-8 w-auto object-contain" priority />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                {...linkProps(l.href)}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={webmail}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-md border border-white/30 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/5 sm:inline-flex"
          >
            Webmail
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-lg border border-white/10 bg-ink-950 p-3 lg:hidden"
          >
            <ul>
              {navLinks.map((l, i) => (
                <motion.li key={l.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <a
                    {...linkProps(l.href)}
                    className="block rounded-xl px-4 py-3 font-display text-lg font-semibold text-white transition-colors hover:bg-white/5"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <a
              href={webmail}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center rounded-md border border-white/30 px-4 py-3 text-sm font-semibold text-white"
            >
              Webmail
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
