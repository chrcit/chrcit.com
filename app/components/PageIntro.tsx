export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">
        {eyebrow}
      </p>
      <h1 className="font-[var(--font-display)] text-[clamp(2.5rem,4vw,3.7rem)] font-semibold text-[color:var(--color-ink)]">
        {title}
      </h1>
      <p className="max-w-2xl text-sm text-white/70">{description}</p>
    </div>
  );
}
