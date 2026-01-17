import { runSync } from "@mdx-js/mdx";
import { useMemo } from "react";
import type { ComponentType } from "react";
import * as runtime from "react/jsx-runtime";

export function useMdxComponent(code: string) {
  return useMemo(() => {
    if (!code) {
      return () => null;
    }

    const module = runSync(code, {
      ...runtime,
      baseUrl: import.meta.url,
    }) as { default?: ComponentType };

    return module.default ?? (() => null);
  }, [code]);
}
