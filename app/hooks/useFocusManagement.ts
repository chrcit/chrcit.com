import { useEffect, useRef } from "react";
import { useLocation } from "@remix-run/react";

export function useFocusManagement() {
  const location = useLocation();
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Save the currently focused element before route change
    lastFocusedElement.current = document.activeElement as HTMLElement;

    // Focus the main content after route change
    const mainContent = document.querySelector("main");
    if (mainContent) {
      // Set tabindex to make the element focusable
      mainContent.setAttribute("tabindex", "-1");
      mainContent.focus();
      // Remove tabindex after focus to prevent keyboard navigation issues
      mainContent.removeAttribute("tabindex");
    }

    // Restore focus when component unmounts
    return () => {
      if (lastFocusedElement.current) {
        lastFocusedElement.current.focus();
      }
    };
  }, [location.pathname]);

  // Handle modal focus trap
  const trapFocus = (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    function handleTabKey(e: KeyboardEvent) {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }

    element.addEventListener("keydown", handleTabKey);
    firstFocusable.focus();

    return () => {
      element.removeEventListener("keydown", handleTabKey);
    };
  };

  return { trapFocus };
}
