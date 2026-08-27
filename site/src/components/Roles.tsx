import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type Role = {
  id: string;
  title: string;
  favicon?: string;
  mark?: "pen";
  body: React.ReactNode;
  links?: { href: string; label: string; external?: boolean }[];
};

const ROLES: Role[] = [
  {
    id: "arthouse",
    title: "Director, Strategist & Product Engineer at Arthouse",
    favicon: "/images/favicons/arthouse.png",
    body: "Arthouse is a creative engineering studio. We create great (digital) experiences and work across software, design, strategy and creative production.",
    links: [{ href: "https://madebyarthouse.com", label: "madebyarthouse.com →", external: true }],
  },
  {
    id: "hausgemacht",
    title: "Member of the technical staff & board at hausgemacht",
    favicon: "/images/favicons/hausgemacht.png",
    body: "hausgemacht is a non-profit techno collective based in Vienna, Austria. We host raves and s+ parties with a focus on creating safeR space for FLINTA*, queer and all people.",
    links: [{ href: "https://hausgemacht.org", label: "hausgemacht.org →", external: true }],
  },
  {
    id: "rebased",
    title: "Co-Organizer of rebased.wtf meetup",
    favicon: "/images/favicons/rebased.png",
    body: "rebased is a meetup in Vienna about having fun with tech.",
    links: [{ href: "https://rebased.wtf", label: "rebased.wtf →", external: true }],
  },
  {
    id: "writer",
    title: "Sometimes writer",
    mark: "pen",
    body: (
      <>
        Trying to get back into it but I once wrote a{" "}
        <a href="/articles/2023-year-in-review">2023 year in review</a> and used to be more
        active on{" "}
        <a href="https://x.com/chrcit" target="_blank" rel="noopener">
          Twitter
        </a>
        .
      </>
    ),
  },
];

function Summary({
  role,
  isOpen,
  onToggle,
}: {
  role: Role;
  isOpen: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className="role-summary"
      aria-expanded={isOpen}
      onClick={() => onToggle(role.id)}
    >
      <span className="r-brand">
        {role.favicon && (
          <img className="r-favicon" src={role.favicon} alt="" width={64} height={64} />
        )}
        {role.mark === "pen" && (
          <span className="r-favicon r-mark" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="square"
              strokeLinejoin="miter"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </span>
        )}
        <span className="r-title">{role.title}</span>
      </span>
      <span className="r-plus" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M8 2.5v11M2.5 8h11" />
        </svg>
      </span>
    </button>
  );
}

export default function Roles() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [rowH, setRowH] = useState(0);
  const [fromY, setFromY] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const toggle = (id: string) => {
    if (open === id) {
      setOpen(null);
      return;
    }
    const wrap = wrapRef.current;
    const row = wrap?.querySelector<HTMLElement>(`[data-role="${id}"]`);
    if (wrap && row) {
      const wr = wrap.getBoundingClientRect();
      const rr = row.getBoundingClientRect();
      setFromY(rr.top - wr.top);
      setRowH(rr.height);
    }
    setOpen(id);
  };

  const active = ROLES.find((r) => r.id === open) ?? null;

  return (
    <div
      ref={wrapRef}
      className={`roles${open ? " is-open" : ""}`}
      style={
        {
          ...(rowH ? { "--row-h": `${rowH}px` } : {}),
          "--from-y": `${fromY}px`,
        } as React.CSSProperties
      }
    >
      {ROLES.map((role) => (
        <div
          key={role.id}
          data-role={role.id}
          className="role"
          aria-hidden={open ? true : undefined}
          style={open === role.id ? { visibility: "hidden" } : undefined}
        >
          <Summary role={role} isOpen={false} onToggle={toggle} />
        </div>
      ))}

      {active && (
        <div className="role role-pin is-open">
          <Summary role={active} isOpen onToggle={toggle} />
        </div>
      )}

      <AnimatePresence>
        {active && (
          <motion.div
            key={`panel-${active.id}`}
            className="role-panel"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.18 }}
          >
            <p>{active.body}</p>
            {active.links && active.links.length > 0 && (
              <p className="role-links">
                {active.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    {...(link.external ? { target: "_blank", rel: "noopener" } : {})}
                  >
                    {link.label}
                  </a>
                ))}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
