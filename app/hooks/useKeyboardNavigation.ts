import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";

export function useKeyboardNavigation() {
  const navigate = useNavigate();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Only handle keyboard shortcuts when not in an input or textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Handle keyboard shortcuts
      switch (event.key) {
        case "h":
          if (event.metaKey || event.ctrlKey) {
            event.preventDefault();
            navigate("/");
          }
          break;
        case "a":
          if (event.metaKey || event.ctrlKey) {
            event.preventDefault();
            navigate("/articles");
          }
          break;
        case "p":
          if (event.metaKey || event.ctrlKey) {
            event.preventDefault();
            navigate("/projects");
          }
          break;
        case "b":
          if (event.metaKey || event.ctrlKey) {
            event.preventDefault();
            navigate("/books");
          }
          break;
        case "ArrowLeft":
          if (event.altKey) {
            event.preventDefault();
            window.history.back();
          }
          break;
        case "ArrowRight":
          if (event.altKey) {
            event.preventDefault();
            window.history.forward();
          }
          break;
        case "/":
          event.preventDefault();
          // Focus search input if it exists
          const searchInput = document.querySelector(
            'input[type="search"]',
          ) as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);
}
