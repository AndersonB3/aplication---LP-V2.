import { cn } from "@/lib/utils";
import { FadeIn } from "./FadeIn";

/** Rótulo de seção: texto em caixa alta precedido de um traço fino */
export function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={cn(
        "flex w-fit items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em]",
        dark ? "text-brand-300" : "text-brand-700"
      )}
    >
      <span className="h-px w-8 bg-current" aria-hidden />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  dark?: boolean;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <FadeIn className={cn(align === "center" && "mx-auto flex flex-col items-center text-center", "max-w-3xl", className)}>
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <h2
        className={cn(
          "mt-5 text-balance font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl",
          dark ? "text-white" : "text-ink-900"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-5 text-lg leading-relaxed", dark ? "text-slate-300" : "text-slate-600")}>{description}</p>
      )}
    </FadeIn>
  );
}
