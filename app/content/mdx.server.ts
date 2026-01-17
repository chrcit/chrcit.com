import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export type Heading = { depth: number; value: string; id: string };

function sanitizeMdx(source: string) {
  const lines = source.split("\n");
  const sanitized: string[] = [];
  let skipping = false;

  for (const line of lines) {
    if (!skipping && /^\s*(import|export)\b/.test(line)) {
      skipping = !line.includes(";");
      continue;
    }

    if (skipping) {
      if (line.includes(";")) {
        skipping = false;
      }
      continue;
    }

    sanitized.push(line);
  }

  return sanitized
    .join("\n")
    .replace(/\sstyle=(\"[^\"]*\"|'[^']*')/g, "")
    .trim();
}

function extractHeadings(source: string): Heading[] {
  const tree = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .parse(source);
  const headings: Heading[] = [];

  visit(tree, "heading", (node: any) => {
    const text = node.children
      ?.filter((child: any) => child.type === "text")
      ?.map((child: any) => child.value)
      ?.join("")
      ?.trim();

    if (!text) return;

    headings.push({
      depth: node.depth,
      value: text,
      id: text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-"),
    });
  });

  return headings;
}

export async function compileMdx(source: string) {
  const sanitized = sanitizeMdx(source);
  const headings = extractHeadings(sanitized);

  if (!sanitized) {
    return {
      code: "",
      headings,
    };
  }

  const compiled = await compile(sanitized, {
    outputFormat: "function-body",
    development: false,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
  });

  return { code: String(compiled), headings };
}
