import type { AnchorHTMLAttributes } from "react";

export function ExternalLink({ children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      className={`inline-flex items-center gap-1 font-semibold text-[color:var(--color-brand-strong)] underline underline-offset-4 transition hover:text-[color:var(--color-ink)] ${
        props.className ?? ""
      }`}
      rel={props.rel ?? "noreferrer"}
      target={props.target ?? "_blank"}
    >
      {children}
    </a>
  );
}
