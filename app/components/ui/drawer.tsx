import { createPortal } from "react-dom";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type DrawerContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

export function DrawerRoot({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);

  return (
    <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
  );
}

export function DrawerTrigger({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(DrawerContext);
  if (!ctx) return null;

  return (
    <button
      type="button"
      className={className}
      onClick={() => ctx.setOpen(true)}
    >
      {children}
    </button>
  );
}

export function DrawerContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(DrawerContext);
  if (!ctx?.open) return null;

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        ctx.setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [ctx]);

  return createPortal(
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        aria-label="Close table of contents"
        className="absolute inset-0 h-full w-full bg-black/60 backdrop-blur-sm"
        onClick={() => ctx.setOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`absolute inset-x-0 bottom-0 z-50 max-h-[70vh] rounded-t-[1.5rem] border border-white/10 bg-[color:var(--color-paper)] p-6 shadow-[0_-30px_80px_-40px_rgba(0,0,0,0.8)] ${className}`}
      >
        <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-white/15" />
        {children}
      </div>
    </div>,
    document.body,
  );
}
