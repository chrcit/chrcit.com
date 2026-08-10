import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import groq, { defineQuery } from 'groq';
import sanityCli from 'sanity/cli';

type UnknownRecord = Record<string, unknown>;
type NormalizedHighlight = {
  id: string;
  externalId?: string;
  text: string;
  note?: string;
  location?: string;
  locationType?: string;
  url?: string;
  readwiseUrl?: string;
  color?: string;
  highlightedAt?: string;
  updatedAt?: string;
  tags: string[];
  archived: boolean;
};
type NormalizedSource = {
  id: string;
  externalId?: string;
  title: string;
  creator?: string;
  category?: string;
  source?: string;
  sourceUrl?: string;
  readwiseUrl?: string;
  coverImageUrl?: string;
  summary?: string;
  archived: boolean;
  highlights: NormalizedHighlight[];
};

const client = sanityCli.getCliClient({ apiVersion: '2026-08-10' });
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const fileIndex = args.indexOf('--file');
const sinceIndex = args.indexOf('--since');
const inputFile = fileIndex >= 0 ? args[fileIndex + 1] : undefined;
const updatedAfter = sinceIndex >= 0 ? args[sinceIndex + 1] : undefined;
const syncedAt = new Date().toISOString();

const READWISE_SOURCE_BY_ID_QUERY = defineQuery(groq`
  *[_type == "thing" && readwise.userBookId == $sourceId][0]{_id}
`);
const READING_SOURCE_BY_TITLE_QUERY = defineQuery(groq`
  *[
    _type == "thing" &&
    title == $title &&
    kind == $kind &&
    ($creator == null || creator == $creator)
  ][0]{_id}
`);
const READWISE_QUOTE_BY_ID_QUERY = defineQuery(groq`
  *[_type == "quote" && readwise.highlightId == $highlightId][0]{_id}
`);

function string(value: unknown) {
  if (typeof value === 'string') return value.trim() || undefined;
  if (typeof value === 'number') return String(value);
  return undefined;
}

function boolean(value: unknown) {
  return value === true || value === 'true' || value === 1 || value === '1';
}

function record(value: unknown): UnknownRecord {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};
}

function array(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function compact<T extends UnknownRecord>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined)
  ) as T;
}

function fingerprint(parts: Array<string | undefined>) {
  return createHash('sha256')
    .update(parts.filter(Boolean).join('\u001f'))
    .digest('hex')
    .slice(0, 32);
}

function tags(value: unknown): string[] {
  if (Array.isArray(value))
    return value
      .map((item) => string(record(item).name) || string(item))
      .filter((item): item is string => Boolean(item));
  return (string(value) || '')
    .split(/[,|]/)
    .map((item) => item.trim().replace(/^#/, ''))
    .filter(Boolean);
}

function normalizeApiSource(input: unknown): NormalizedSource | null {
  const item = record(input);
  const title =
    string(item.readable_title) ||
    string(item.title) ||
    'Untitled reading item';
  const creator = string(item.author);
  const sourceId =
    string(item.user_book_id) ||
    string(item.external_id) ||
    `generated:${fingerprint([title, creator])}`;
  const highlights = array(item.highlights)
    .map((raw): NormalizedHighlight | null => {
      const highlight = record(raw);
      const text = string(highlight.text);
      if (!text) return null;
      const location = string(highlight.location);
      const id =
        string(highlight.id) ||
        string(highlight.external_id) ||
        `generated:${fingerprint([sourceId, text, location])}`;
      return {
        id,
        externalId: string(highlight.external_id),
        text,
        note: string(highlight.note),
        location,
        locationType: string(highlight.location_type),
        url: string(highlight.url),
        readwiseUrl: string(highlight.readwise_url),
        color: string(highlight.color),
        highlightedAt: string(highlight.highlighted_at),
        updatedAt: string(highlight.updated_at) || string(highlight.updated),
        tags: tags(highlight.tags),
        archived:
          boolean(highlight.is_deleted) || boolean(highlight.is_discard),
      };
    })
    .filter((item): item is NormalizedHighlight => Boolean(item));

  return {
    id: sourceId,
    externalId: string(item.external_id),
    title,
    creator,
    category: string(item.category),
    source: string(item.source),
    sourceUrl: string(item.source_url) || string(item.unique_url),
    readwiseUrl: string(item.readwise_url),
    coverImageUrl: string(item.cover_image_url),
    summary: string(item.summary) || string(item.document_note),
    archived: boolean(item.is_deleted),
    highlights,
  };
}

function parseCsv(source: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (char === '"') {
      if (quoted && source[index + 1] === '"') {
        field += '"';
        index += 1;
      } else quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(field);
      field = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && source[index + 1] === '\n') index += 1;
      row.push(field);
      if (row.some((cell) => cell.length)) rows.push(row);
      row = [];
      field = '';
    } else field += char;
  }
  row.push(field);
  if (row.some((cell) => cell.length)) rows.push(row);
  if (!rows.length) return [];
  const headers = rows[0].map((header) => header.trim().toLowerCase());
  return rows
    .slice(1)
    .map((cells) =>
      Object.fromEntries(
        headers.map((header, index) => [header, cells[index] || ''])
      )
    );
}

function value(row: Record<string, string>, aliases: string[]) {
  for (const alias of aliases) {
    const found = row[alias.toLowerCase()]?.trim();
    if (found) return found;
  }
  return undefined;
}

function normalizeCsv(source: string): NormalizedSource[] {
  const grouped = new Map<string, NormalizedSource>();
  for (const row of parseCsv(source)) {
    const title = value(row, ['Book Title', 'Title', 'Document Title']);
    const text = value(row, ['Highlight', 'Text', 'Highlight Text']);
    if (!title || !text) continue;
    const creator = value(row, ['Book Author', 'Author']);
    const explicitSourceId = value(row, [
      'User Book ID',
      'Book ID',
      'Document ID',
      'External ID',
    ]);
    const sourceId = explicitSourceId || `csv:${fingerprint([title, creator])}`;
    let item = grouped.get(sourceId);
    if (!item) {
      item = {
        id: sourceId,
        title,
        creator,
        category: value(row, ['Category', 'Source Type']),
        source: value(row, ['Source']),
        sourceUrl: value(row, ['Source URL', 'URL']),
        readwiseUrl: value(row, ['Readwise URL', 'Book Review URL']),
        coverImageUrl: value(row, ['Cover Image URL', 'Image URL']),
        archived: false,
        highlights: [],
      };
      grouped.set(sourceId, item);
    }
    const location = value(row, ['Location', 'Page']);
    const explicitHighlightId = value(row, ['Highlight ID', 'ID']);
    item.highlights.push({
      id:
        explicitHighlightId || `csv:${fingerprint([sourceId, text, location])}`,
      text,
      note: value(row, ['Note']),
      location,
      locationType: value(row, ['Location Type']),
      url: value(row, ['Highlight URL']),
      readwiseUrl: value(row, ['Readwise URL']),
      color: value(row, ['Color']),
      highlightedAt: value(row, ['Highlighted At', 'Highlighted at']),
      updatedAt: value(row, ['Updated At', 'Updated']),
      tags: tags(value(row, ['Tags', 'Highlight Tags'])),
      archived: false,
    });
  }
  return [...grouped.values()];
}

function normalizeJson(value: unknown): NormalizedSource[] {
  const root = record(value);
  const raw = Array.isArray(value)
    ? value
    : Array.isArray(root.results)
      ? root.results
      : [value];
  return raw
    .map(normalizeApiSource)
    .filter((item): item is NormalizedSource => Boolean(item));
}

async function loadFromFile(file: string) {
  const path = resolve(file);
  const contents = await readFile(path, 'utf8');
  return extname(path).toLowerCase() === '.csv'
    ? normalizeCsv(contents)
    : normalizeJson(JSON.parse(contents));
}

async function loadFromApi() {
  const token = process.env.READWISE_ACCESS_TOKEN;
  if (!token)
    throw new Error(
      'Set READWISE_ACCESS_TOKEN or pass --file with a Readwise JSON/CSV export.'
    );
  const sources: NormalizedSource[] = [];
  let cursor: string | undefined;
  do {
    const url = new URL('https://readwise.io/api/v2/export/');
    if (updatedAfter) url.searchParams.set('updatedAfter', updatedAfter);
    if (cursor) url.searchParams.set('pageCursor', cursor);
    url.searchParams.set('includeDeleted', 'true');
    const response = await fetch(url, {
      headers: { Authorization: `Token ${token}` },
    });
    if (!response.ok)
      throw new Error(`Readwise export failed with HTTP ${response.status}.`);
    const body = record(await response.json());
    sources.push(...normalizeJson(body));
    cursor = string(body.nextPageCursor);
  } while (cursor);
  return sources;
}

function kindFor(category?: string) {
  const normalized = category?.toLowerCase() || '';
  if (normalized.includes('book')) return 'book';
  if (
    ['article', 'email', 'rss', 'tweet', 'pdf'].some((kind) =>
      normalized.includes(kind)
    )
  )
    return 'article';
  return 'other';
}

async function upsertSource(source: NormalizedSource) {
  const kind = kindFor(source.category);
  const byExternalId = await client.fetch(READWISE_SOURCE_BY_ID_QUERY, {
    sourceId: source.id,
  });
  const byTitle = byExternalId
    ? null
    : await client.fetch(READING_SOURCE_BY_TITLE_QUERY, {
        title: source.title,
        creator: source.creator || null,
        kind,
      });
  const existingId = byExternalId?._id || byTitle?._id;
  if (dryRun) return existingId || `dry-source-${fingerprint([source.id])}`;

  const readwise = compact({
    userBookId: source.id,
    externalId: source.externalId,
    source: source.source,
    sourceUrl: source.sourceUrl,
    readwiseUrl: source.readwiseUrl,
    coverImageUrl: source.coverImageUrl,
    syncedAt,
  });
  if (existingId) {
    await client
      .patch(existingId)
      .set({ readwise })
      .setIfMissing(
        compact({
          creator: source.creator,
          url: source.sourceUrl,
          summary: source.summary,
        })
      )
      .commit();
    return existingId;
  }
  const created = await client.create(
    compact({
      _type: 'thing',
      title: source.title,
      kind,
      creator: source.creator,
      url: source.sourceUrl,
      summary: source.summary,
      featured: false,
      readwise,
      meta: {
        _type: 'meta',
        visibility: 'public',
        description: source.summary,
      },
    })
  );
  return created._id;
}

async function upsertHighlight(
  highlight: NormalizedHighlight,
  sourceItemId: string
) {
  const existing = await client.fetch(READWISE_QUOTE_BY_ID_QUERY, {
    highlightId: highlight.id,
  });
  if (dryRun) return existing?._id ? 'updated' : 'created';
  const fields = compact({
    text: highlight.text,
    sourceItem: { _type: 'reference', _ref: sourceItemId },
    origin: 'readwise',
    location: highlight.location,
    locationType: highlight.locationType,
    sourceUrl: highlight.url,
    sourceNote: highlight.note,
    tags: highlight.tags.length ? highlight.tags : undefined,
    sourceState: highlight.archived ? 'archived' : 'active',
    readwise: compact({
      highlightId: highlight.id,
      externalId: highlight.externalId,
      readwiseUrl: highlight.readwiseUrl,
      color: highlight.color,
      highlightedAt: highlight.highlightedAt,
      sourceUpdatedAt: highlight.updatedAt,
      syncedAt,
    }),
  });
  if (existing?._id) {
    await client.patch(existing._id).set(fields).commit();
    return 'updated';
  }
  await client.create({
    _type: 'quote',
    ...fields,
    featured: false,
  });
  return 'created';
}

async function main() {
  const sources = inputFile
    ? await loadFromFile(inputFile)
    : await loadFromApi();
  let created = 0;
  let updated = 0;
  let quoteCount = 0;
  for (const source of sources) {
    const sourceItemId = await upsertSource(source);
    for (const highlight of source.highlights) {
      const result = await upsertHighlight(highlight, sourceItemId);
      if (result === 'created') created += 1;
      else updated += 1;
      quoteCount += 1;
    }
  }
  console.log(
    `${dryRun ? 'Would sync' : 'Synced'} ${sources.length} reading items and ${quoteCount} quotes (${created} new, ${updated} updated).`
  );
}

await main();
