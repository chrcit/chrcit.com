import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ora from "ora";
import chalk from "chalk";
import prompts from "prompts";
import {
  fetchFilmsFromSources,
  type FetchMode,
} from "../app/data/films.server";

const DEFAULT_OUTPUT = new URL("../app/data/films.generated.json", import.meta.url);

const MODE_CHOICES: Array<{ title: string; value: FetchMode; description: string }> = [
  {
    title: "Letterboxd + IMDb",
    value: "letterboxd-imdb",
    description: "Ratings from Letterboxd + posters/genres/directors from IMDb",
  },
  {
    title: "Letterboxd only",
    value: "letterboxd-only",
    description: "Just ratings + titles from Letterboxd",
  },
  {
    title: "IMDb only",
    value: "imdb-only",
    description: "Use fallback seeds and refresh IMDb metadata",
  },
];

function outputPathToFileUrl(outputPath: string) {
  const absolute = path.isAbsolute(outputPath)
    ? outputPath
    : path.resolve(process.cwd(), outputPath);
  return new URL(`file://${absolute}`);
}

async function ensureDir(fileUrl: URL) {
  const dir = path.dirname(fileURLToPath(fileUrl));
  await fs.mkdir(dir, { recursive: true });
}

async function run() {
  const response = await prompts([
    {
      type: "select",
      name: "mode",
      message: "What data should I fetch?",
      choices: MODE_CHOICES.map((choice) => ({
        title: choice.title,
        value: choice.value,
        description: choice.description,
      })),
      initial: 0,
    },
    {
      type: (prev: FetchMode) => (prev === "imdb-only" ? null : "text"),
      name: "username",
      message: "Letterboxd username",
      initial: "chrcit",
    },
    {
      type: (prev: FetchMode) => (prev === "imdb-only" ? null : "confirm"),
      name: "includeUnrated",
      message: "Include unrated entries?",
      initial: false,
    },
    {
      type: "text",
      name: "outputPath",
      message: "Where should I write the structured data?",
      initial: fileURLToPath(DEFAULT_OUTPUT),
    },
  ]);

  if (!response.mode) return;

  const mode = response.mode as FetchMode;
  const username = response.username as string | undefined;
  const includeUnrated = Boolean(response.includeUnrated);
  const outputPath = response.outputPath as string;
  const outputUrl = outputPathToFileUrl(outputPath);

  const spinner = ora("Fetching films").start();
  const films = await fetchFilmsFromSources({
    mode,
    letterboxdUser: username,
    includeUnrated,
    onProgress: (step, detail) => {
      const label = step === "imdb" ? "IMDb" : "Letterboxd";
      spinner.text = `${label}: ${detail ?? "working"}`;
    },
  });
  spinner.succeed(`Fetched ${films.length} films`);

  const writeSpinner = ora("Writing structured data").start();
  await ensureDir(outputUrl);
  await fs.writeFile(outputUrl, `${JSON.stringify(films, null, 2)}\n`, "utf8");
  writeSpinner.succeed(
    `Saved to ${chalk.cyan(path.relative(process.cwd(), outputPath))}`,
  );

  console.log(
    chalk.dim(
      "Tip: run the dev server and refresh /films to see the cached dataset.",
    ),
  );
}

run().catch((error) => {
  console.error(chalk.red("Failed to fetch films."));
  console.error(error);
  process.exitCode = 1;
});
