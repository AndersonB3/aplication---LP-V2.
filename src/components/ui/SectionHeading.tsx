import { cn } from "@/lib/utils";
import { FadeIn } from "./FadeIn";

export function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
        dark ? "border-brand-400/30 bg-brand-400/10 text-brand-300" : "border-brand-500/20 bg-brand-50 text-brand-700"
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dark ? "bg-brand-300" : "bg-brand-500")} />
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
    <FadeIn className={cn(align === "center" && "mx-auto text-center", "max-w-3xl", className)}>
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <h2
        className={cn(
          "mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl",
          dark ? "text-white" : "text-ink-900"
        )}
      >
        {title}
        <span className="text-brand-400">.</span>
      </h2>
      {description && (
        <p className={cn("mt-5 text-lg leading-relaxed", dark ? "text-slate-300" : "text-slate-600")}>{description}</p>
      )}
    </FadeIn>
  );
}
