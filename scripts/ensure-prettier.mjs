import fs from "node:fs/promises";
import path from "node:path";

const prettierDir = path.resolve("node_modules/prettier");
const indexMjs = path.join(prettierDir, "index.mjs");
const standaloneMjs = path.join(prettierDir, "standalone.mjs");

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

const indexStub = `import prettier from "./index.cjs";

export default prettier;
export const format = prettier.format;
export const formatWithCursor = prettier.formatWithCursor;
export const check = prettier.check;
export const resolveConfig = prettier.resolveConfig;
export const resolveConfigFile = prettier.resolveConfigFile;
export const getFileInfo = prettier.getFileInfo;
export const clearConfigCache = prettier.clearConfigCache;
export const getSupportInfo = prettier.getSupportInfo;
export const formatAST = prettier.formatAST;
export const doc = prettier.doc;
export const util = prettier.util;
export const version = prettier.version;
export const __debug = prettier.__debug;
`;

const standaloneStub = `import prettier from "./standalone.js";

export default prettier;
export const format = prettier.format;
export const formatWithCursor = prettier.formatWithCursor;
export const check = prettier.check;
export const resolveConfig = prettier.resolveConfig;
export const resolveConfigFile = prettier.resolveConfigFile;
export const getFileInfo = prettier.getFileInfo;
export const clearConfigCache = prettier.clearConfigCache;
export const getSupportInfo = prettier.getSupportInfo;
export const formatAST = prettier.formatAST;
export const doc = prettier.doc;
export const util = prettier.util;
export const version = prettier.version;
export const __debug = prettier.__debug;
`;

async function ensureFile(filePath, contents) {
  if (await fileExists(filePath)) return false;
  await fs.writeFile(filePath, contents, "utf8");
  return true;
}

async function run() {
  const hasPrettier = await fileExists(prettierDir);
  if (!hasPrettier) return;

  await ensureFile(indexMjs, indexStub);
  await ensureFile(standaloneMjs, standaloneStub);
}

run().catch((error) => {
  console.error("Failed to ensure Prettier ESM stubs", error);
  process.exitCode = 1;
});
