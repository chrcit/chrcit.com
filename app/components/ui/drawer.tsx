import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

export const DrawerRoot = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;

export function DrawerContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" />
      <DialogPrimitive.Content
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[70vh] rounded-t-[1.5rem] border border-white/10 bg-[color:var(--color-paper)] p-6 shadow-[0_-30px_80px_-40px_rgba(0,0,0,0.8)] ${className}`}
      >
        <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-white/15" />
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
