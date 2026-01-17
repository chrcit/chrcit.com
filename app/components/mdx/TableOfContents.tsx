import { useEffect, useRef, useState } from "react";
import { DrawerContent, DrawerRoot, DrawerTrigger } from "~/components/ui/drawer";

export type TocHeading = {
  depth: number;
  value: string;
  id: string;
};

function useActiveHeading(headings: TocHeading[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!headings.length) return;
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0]?.target) {
          setActiveId((visible[0].target as HTMLElement).id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0.1 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  return activeId;
}

function TocList({
  headings,
  activeId,
  className = "",
}: {
  headings: TocHeading[];
  activeId: string | null;
  className?: string;
}) {
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (!activeId || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(
      `[data-toc-item="${activeId}"]`,
    );
    if (el) {
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [activeId]);

  return (
    <div
      className={`rounded-[1.25rem] border border-white/10 bg-black/60 p-4 text-sm shadow-[var(--shadow-soft)] ${className}`}
    >
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">
        On this page
      </p>
      <ul ref={listRef} className="mt-4 max-h-[45vh] space-y-2 overflow-auto">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;
          return (
            <li
              key={heading.id}
              style={{ paddingLeft: `${heading.depth * 0.5}rem` }}
            >
              <a
                href={`#${heading.id}`}
                data-toc-item={heading.id}
                className={`block rounded-md px-2 py-1 text-sm transition ${
                  isActive
                    ? "bg-white/10 text-[color:var(--color-ink)]"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {heading.value}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const activeId = useActiveHeading(headings);
  if (!headings.length) return null;

  return (
    <div className="sticky top-24">
      <TocList headings={headings} activeId={activeId} />
    </div>
  );
}

export function TableOfContentsDrawer({ headings }: { headings: TocHeading[] }) {
  const activeId = useActiveHeading(headings);

  if (!headings.length) return null;

  return (
    <DrawerRoot>
      <DrawerTrigger className="pressable inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/70 transition hover:border-white/30 hover:bg-white/10 hover:text-white">
        Contents
        <span aria-hidden="true">↘</span>
      </DrawerTrigger>
      <DrawerContent>
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Navigate the page
          </p>
          <TocList headings={headings} activeId={activeId} />
        </div>
      </DrawerContent>
    </DrawerRoot>
  );
}
