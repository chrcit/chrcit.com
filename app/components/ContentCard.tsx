import { Link } from "react-router";

export type ContentCardProps = {
  to: string;
  title: string;
  description: string;
  eyebrow?: string;
  image?: string;
  index?: number;
};

export function ContentCard({
  to,
  title,
  description,
  eyebrow,
  image,
  index = 0,
}: ContentCardProps) {
  return (
    <Link
      to={to}
      className="group reveal relative flex flex-col gap-4 border-b border-white/10 pb-5 transition duration-200 hover:border-white/30 md:flex-row md:items-center"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {image ? (
        <div className="overflow-hidden rounded-[0.9rem] border border-white/10 bg-white/5 md:w-44">
          <img
            src={image}
            alt={title}
            className="h-36 w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : null}
      <div className="flex-1 space-y-2">
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            {eyebrow}
          </p>
        ) : null}
        <h3 className="font-[var(--font-display)] text-2xl font-semibold text-[color:var(--color-ink)]">
          {title}
        </h3>
        <p className="text-sm text-white/70">{description}</p>
      </div>
      <span className="text-xs uppercase tracking-[0.3em] text-white/40 md:ml-auto">
        Explore /
      </span>
    </Link>
  );
}
