import { useMemo, useState } from "react";
import { ditherFor } from "../utils/dither";

export type SampleItem = {
  id: string;
  title: string;
  meta?: string;
  rating?: number | null;
  url?: string | null;
  image?: string | null;
  kind: "book" | "tool";
};

function pick(pool: SampleItem[], n: number, exclude: string[]): SampleItem[] {
  const rest = pool.filter((i) => !exclude.includes(i.id));
  const src = rest.length >= n ? rest : pool;
  return [...src].sort(() => Math.random() - 0.5).slice(0, n);
}

function ShuffleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <path d="M21 12a9 9 0 0 0-15.5-6.36L4 7" />
      <path d="M4 3v4h4" />
      <path d="M3 12a9 9 0 0 0 15.5 6.36L20 17" />
      <path d="M20 21v-4h-4" />
    </svg>
  );
}

export default function SampleList({
  items,
  initial,
  moreHref,
  moreLabel,
  label,
}: {
  items: SampleItem[];
  initial: SampleItem[];
  moreHref: string;
  moreLabel: string;
  label: string;
}) {
  const [shown, setShown] = useState(initial);
  const [spin, setSpin] = useState(false);
  const kind = items[0]?.kind ?? "book";
  const tip = kind === "book" ? "Show another three books" : "Show another three tools";

  const reshuffle = () => {
    setShown((cur) => pick(items, 3, cur.map((i) => i.id)));
    setSpin(true);
  };

  const rows = useMemo(() => shown, [shown]);

  return (
    <>
      <div className="tile-label is-section">
        <span>{label}</span>
        <button
          type="button"
          className={`shuffle${spin ? " is-spin" : ""}`}
          data-tip={tip}
          aria-label={tip}
          onClick={reshuffle}
          onAnimationEnd={() => setSpin(false)}
        >
          <ShuffleIcon />
        </button>
      </div>
      <ul className="items">
        {rows.map((item) => {
          const Tag = item.url ? "a" : "div";
          const linkProps = item.url
            ? { href: item.url, target: "_blank" as const, rel: "noopener" }
            : {};
          return (
            <li key={item.id}>
              <Tag className="item-row dot-hover" {...linkProps}>
                <span
                  className={`i-thumb ${item.kind === "book" ? "is-cover" : "is-icon"} ${ditherFor(item.title)}`}
                  aria-hidden="true"
                >
                  {item.title.charAt(0)}
                  {item.image && (
                    <img
                      src={item.image}
                      alt=""
                      className={item.kind === "tool" ? "icon" : undefined}
                      loading="lazy"
                    />
                  )}
                </span>
                <span>
                  <span className="i-title">{item.title}</span>
                  {item.meta && (
                    <span className={`i-meta${item.kind === "tool" ? " i-cat" : ""}`}>
                      {item.meta}
                    </span>
                  )}
                </span>
                {item.kind === "book" && item.rating != null ? (
                  <span className="i-right">{item.rating}/10</span>
                ) : item.url ? (
                  <span className="i-right link">→</span>
                ) : (
                  <span className="i-right" />
                )}
              </Tag>
            </li>
          );
        })}
      </ul>
      <a className="tile-more" href={moreHref}>
        {moreLabel}
      </a>
    </>
  );
}
