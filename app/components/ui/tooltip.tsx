import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className = "", sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={`z-50 rounded-full border border-white/10 bg-black/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white shadow-[0_15px_40px_-20px_rgba(0,0,0,0.8)] ${className}`}
    {...props}
  />
));
TooltipContent.displayName = "TooltipContent";
