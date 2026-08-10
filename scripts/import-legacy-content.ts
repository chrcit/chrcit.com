import { execFileSync } from 'node:child_process';
import { extname, posix } from 'node:path';
import sanityCli from 'sanity/cli';
import { markdownToPortableText } from '@portabletext/markdown';

type Frontmatter = Record<string, string | number | boolean | string[]>;
type DocumentInput = { _id: string; _type: string; [key: string]: unknown };
type PortableObject = { _type?: string; _key?: string; [key: string]: unknown };

const client = sanityCli.getCliClient({ apiVersion: '2026-08-10' });
const dryRun = process.argv.includes('--dry-run');
const imageCache = new Map<string, string>();

function gitText(file: string) {
  return execFileSync('git', ['show', `origin/main:${file}`], {
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
}

function gitBuffer(file: string) {
  return execFileSync('git', ['show', `origin/main:${file}`], {
    maxBuffer: 30 * 1024 * 1024,
  });
}

function listFiles(directory: string, extensions = /\.(md|mdx)$/) {
  const output = execFileSync(
    'git',
    ['ls-tree', '-r', '--name-only', 'origin/main', directory],
    { encoding: 'utf8' }
  );
  return output.split('\n').filter((file) => extensions.test(file));
}

function scalar(raw: string): string | number | boolean | string[] {
  const value = raw.trim();
  if (value.startsWith('[') && value.endsWith(']'))
    return value
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean);
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  if (value === 'true' || value === 'false') return value === 'true';
  return value.replace(/^['"]|['"]$/g, '');
}

function parseFile(source: string) {
  if (!source.startsWith('---'))
    return { data: {} as Frontmatter, body: source };
  const end = source.indexOf('\n---', 3);
  if (end < 0) return { data: {} as Frontmatter, body: source };
  const data: Frontmatter = {};
  for (const line of source.slice(4, end).split('\n')) {
    const colon = line.indexOf(':');
    if (colon > 0)
      data[line.slice(0, colon).trim()] = scalar(line.slice(colon + 1));
  }
  return { data, body: source.slice(end + 4).trim() };
}

function slugFrom(file: string) {
  return posix.basename(file).replace(/\.mdx?$/, '');
}
function key(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 90) || 'item'
  );
}
function ref(id: string, suffix = '') {
  return { _type: 'reference', _ref: id, _key: key(`${id}-${suffix}`) };
}
function meta(description?: unknown) {
  return {
    _type: 'meta',
    description: typeof description === 'string' ? description : undefined,
    visibility: 'public',
  };
}

function cleanMdx(body: string) {
  return body
    .replace(/^import\s.+$/gm, '')
    .replace(
      /<ExternalLink[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/ExternalLink>/gi,
      (_all, href, label) =>
        `[${String(label)
          .replace(/<[^>]+>/g, '')
          .replace(/\s+/g, ' ')
          .trim()}](${href})`
    )
    .replace(
      /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
      (_all, href, label) =>
        `[${String(label)
          .replace(/<[^>]+>/g, '')
          .replace(/\s+/g, ' ')
          .trim()}](${href})`
    )
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<(Tweet|YouTube|AndererseitsInstagram)[\s\S]*?\/>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function contentType(file: string) {
  const ext = extname(file).toLowerCase();
  return ext === '.png'
    ? 'image/png'
    : ext === '.gif'
      ? 'image/gif'
      : ext === '.webp'
        ? 'image/webp'
        : 'image/jpeg';
}

async function uploadImage(file: string) {
  const normalized = posix.normalize(file);
  const cached = imageCache.get(normalized);
  if (cached) return cached;
  if (dryRun) {
    const fake = `image-dry-run-${key(normalized)}-100x100-jpg`;
    imageCache.set(normalized, fake);
    return fake;
  }
  const asset = await client.assets.upload('image', gitBuffer(normalized), {
    filename: posix.basename(normalized),
    contentType: contentType(normalized),
  });
  imageCache.set(normalized, asset._id);
  return asset._id;
}

async function complexImage(file: string, alt: string) {
  const assetId = await uploadImage(file);
  return {
    _type: 'complexImage',
    asset: { _type: 'image', asset: { _type: 'reference', _ref: assetId } },
    alt,
  };
}

async function portableText(markdown: string, sourceFile: string) {
  const converted = markdownToPortableText(
    cleanMdx(markdown)
  ) as PortableObject[];
  const output: PortableObject[] = [];
  for (const block of converted) {
    if (block._type === 'html') continue;
    if (block._type === 'horizontal-rule') {
      output.push({
        _type: 'separator',
        _key: block._key || key(`separator-${output.length}`),
      });
      continue;
    }
    if (block._type === 'image' && typeof block.src === 'string') {
      if (/^https?:/.test(block.src)) continue;
      const imagePath = posix.normalize(
        posix.join(posix.dirname(sourceFile), block.src)
      );
      output.push({
        ...(await complexImage(
          imagePath,
          typeof block.alt === 'string' ? block.alt : 'Imported image'
        )),
        _key: block._key || key(imagePath),
      });
      continue;
    }
    if (block._type === 'code') {
      output.push({
        _type: 'block',
        _key: block._key || key(`code-${output.length}`),
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'code',
            marks: ['code'],
            text: String(block.code || ''),
          },
        ],
      });
      continue;
    }
    if (block._type === 'block') {
      if (['h4', 'h5', 'h6'].includes(String(block.style))) block.style = 'h3';
      if (Array.isArray(block.markDefs))
        block.markDefs = block.markDefs.map((mark) => {
          const item = mark as PortableObject;
          if (item._type !== 'link') return item;
          const href = String(item.href || '');
          if (href.startsWith('mailto:'))
            return {
              _type: 'markExternalLink',
              _key: item._key,
              type: 'email',
              email: href.slice(7),
            };
          if (href.startsWith('tel:'))
            return {
              _type: 'markExternalLink',
              _key: item._key,
              type: 'phone',
              phone: href.slice(4),
            };
          const projectMatch = href.match(/^\/projects\/([^/?#]+)/);
          if (projectMatch)
            return {
              _type: 'markInternalLink',
              _key: item._key,
              link: ref(`legacy-project-${projectMatch[1]}`),
            };
          const articleMatch = href.match(/^\/(?:articles|writing)\/([^/?#]+)/);
          if (articleMatch)
            return {
              _type: 'markInternalLink',
              _key: item._key,
              link: ref(`legacy-article-${articleMatch[1]}`),
            };
          const pageMatch = href.match(/^\/([^/?#]+)$/);
          if (pageMatch)
            return {
              _type: 'markInternalLink',
              _key: item._key,
              link: ref(`page-${pageMatch[1]}`),
            };
          if (href.startsWith('/'))
            return {
              _type: 'markExternalLink',
              _key: item._key,
              type: 'url',
              url: `https://chrcit.com${href}`,
            };
          return {
            _type: 'markExternalLink',
            _key: item._key,
            type: 'url',
            url: href,
          };
        });
    }
    output.push(block);
  }
  return output;
}

function internalLink(title: string, pageId: string, suffix: string) {
  return {
    _type: 'navLink',
    _key: key(`${title}-${suffix}`),
    type: 'internal',
    title,
    reference: ref(pageId),
  };
}
function externalLink(title: string, url: string, suffix: string) {
  return {
    _type: 'navLink',
    _key: key(`${title}-${suffix}`),
    type: 'external',
    title,
    externalLink: { _type: 'markExternalLink', type: 'url', url },
  };
}
function emailLink(title: string, email: string, suffix: string) {
  return {
    _type: 'navLink',
    _key: key(`${title}-${suffix}`),
    type: 'external',
    title,
    externalLink: { _type: 'markExternalLink', type: 'email', email },
  };
}

async function buildDocuments() {
  const documents: DocumentInput[] = [];

  for (const file of listFiles('src/content/books')) {
    const { data, body } = parseFile(gitText(file));
    const slug = slugFrom(file);
    const coverPath =
      typeof data.cover === 'string'
        ? posix.normalize(posix.join(posix.dirname(file), data.cover))
        : undefined;
    documents.push({
      _id: `legacy-thing-book-${slug}`,
      _type: 'thing',
      title: String(data.title || slug),
      kind: 'book',
      creator: data.author,
      summary: data.description,
      url: data.url,
      year: data.year,
      rating: data.rating,
      category: data.category,
      tags: data.tags,
      image: coverPath
        ? await complexImage(coverPath, `${data.title || slug} cover`)
        : undefined,
      notes: body ? await portableText(body, file) : undefined,
      sortOrder: documents.length,
      featured: Number(data.rating || 0) >= 9,
      meta: meta(data.description),
    });
  }

  const extraKinds = [
    ['src/content/films', 'film'],
    ['src/content/shows', 'film'],
    ['src/content/musicians', 'music'],
  ] as const;
  for (const [directory, kind] of extraKinds)
    for (const file of listFiles(directory)) {
      const { data, body } = parseFile(gitText(file));
      const slug = slugFrom(file);
      documents.push({
        _id: `legacy-thing-${kind}-${slug}`,
        _type: 'thing',
        title: String(data.title || data.name || data.text || slug),
        kind,
        creator: data.author,
        summary: data.text || undefined,
        url: data.url,
        rating: data.rating,
        notes: body ? await portableText(body, file) : undefined,
        meta: meta(data.text),
      });
    }

  for (const file of listFiles('src/content/quotes')) {
    const { data, body } = parseFile(gitText(file));
    const slug = slugFrom(file);
    documents.push({
      _id: `legacy-quote-${slug}`,
      _type: 'quote',
      text: String(data.text || body || slug),
      attribution: data.author,
      origin: 'manual',
      sourceState: 'active',
      featured: false,
    });
  }

  for (const file of listFiles('src/content/projects')) {
    const { data, body } = parseFile(gitText(file));
    const slug = slugFrom(file);
    const id = `legacy-project-${slug}`;
    const imagePath =
      typeof data.image === 'string'
        ? posix.normalize(posix.join(posix.dirname(file), data.image))
        : undefined;
    const firstUrl = body.match(/href=["'](https?:\/\/[^"']+)/)?.[1];
    documents.push({
      _id: id,
      _type: 'project',
      title: String(data.title || slug),
      slug: { _type: 'slug', current: slug },
      summary: data.description,
      cover: imagePath
        ? await complexImage(imagePath, `${data.title || slug} screenshot`)
        : undefined,
      body: await portableText(body, file),
      url: firstUrl,
      historical: true,
      featured: Number(data.order) === 0,
      meta: meta(data.description),
    });
  }

  for (const file of listFiles('src/content/articles')) {
    const { data, body } = parseFile(gitText(file));
    const slug = slugFrom(file);
    const id = `legacy-article-${slug}`;
    const imagePath =
      typeof data.image === 'string'
        ? posix.normalize(posix.join(posix.dirname(file), data.image))
        : undefined;
    documents.push({
      _id: id,
      _type: 'article',
      title: String(data.title || slug),
      slug: { _type: 'slug', current: slug },
      excerpt: data.description,
      cover: imagePath
        ? await complexImage(imagePath, `${data.title || slug} cover`)
        : undefined,
      body: await portableText(body, file),
      publishedAt: data.publishedAt
        ? `${data.publishedAt}T12:00:00.000Z`
        : undefined,
      featured: true,
      meta: meta(data.description),
    });
  }

  for (const file of listFiles('src/content/pages')) {
    const { data, body } = parseFile(gitText(file));
    const slug = slugFrom(file);
    documents.push({
      _id: `page-${slug}`,
      _type: 'page',
      title: String(data.title || slug),
      slug: { _type: 'slug', current: slug },
      contentMode: 'richText',
      richText: await portableText(body, file),
      showTableOfContents: slug === 'uses',
      meta: meta(data.description),
    });
  }

  documents.push({
    _id: 'page-reading',
    _type: 'page',
    title: 'Reading',
    slug: { _type: 'slug', current: 'reading' },
    contentMode: 'pageBuilder',
    showTableOfContents: true,
    components: [
      {
        _type: 'richTextBlock',
        _key: 'intro',
        label: 'Reading',
        body: await portableText(
          '## Books and articles\n\nA working shelf of material I return to. Highlights live separately, linked to their source, and can be pulled into pages when they add something.',
          'seed.md'
        ),
      },
      {
        _type: 'referenceCollection',
        _key: 'books',
        title: 'Shelf',
        source: 'filter',
        filter: {
          contentTypes: ['thing'],
          kinds: ['book', 'article'],
          limit: 250,
          order: 'title',
        },
        presentation: 'mediaList',
        showNotes: false,
      },
    ],
    meta: {
      ...meta(
        "Books, articles, and referenceable highlights from Christian Cito's working library."
      ),
      title: 'Reading',
    },
  });

  const nowItems = [
    {
      _id: 'profile-arthouse',
      title: 'Arthouse',
      creator: 'Digital product studio',
      url: 'https://madebyarthouse.com',
      summary:
        'I direct a creative engineering studio working across strategy, software engineering, design, and creative production from Creative Cluster in Vienna.',
    },
    {
      _id: 'profile-hausgemacht',
      title: 'hausgemacht',
      creator: 'Feminist techno collective',
      url: 'https://hausgemacht.org',
      summary:
        'I support the software, systems, and digital operations behind a feminist techno collective and safer nightlife in Vienna.',
    },
    {
      _id: 'profile-rebased',
      title: 'rebased.wtf',
      creator: 'Vienna tech meetup',
      url: 'https://rebased.wtf',
      summary:
        'A meetup where tech feels human again: talks, drinks, curious minds, side projects, and no corporate networking theatre.',
    },
  ];
  for (const [index, item] of nowItems.entries())
    documents.push({
      ...item,
      _type: 'thing',
      kind: 'website',
      featured: true,
      sortOrder: index,
      meta: meta(item.summary),
    });

  const profile = await complexImage(
    'src/images/cut-out.png',
    'Christian Cito looking to the side'
  );
  documents.push({
    _id: 'homepage',
    _type: 'page',
    title: 'Home',
    contentMode: 'pageBuilder',
    showTableOfContents: false,
    components: [
      {
        _type: 'heroBlock',
        _key: 'hero',
        heading: 'Christian Cito',
        body: await portableText(
          'I work where software, design, culture, and self-organised systems overlap.',
          'seed.md'
        ),
        image: profile,
      },
      {
        _type: 'richTextBlock',
        _key: 'bio',
        label: 'Linked biography',
        body: await portableText(
          `At [Arthouse](https://www.madebyarthouse.com), I direct a creative engineering studio based at [Creative Cluster](https://creativecluster.cc/) in Vienna. We work across strategy, software engineering, design, and creative production.

I also build the digital systems behind [hausgemacht](https://hausgemacht.org), a feminist art and culture collective that creates safer spaces around techno, and co-organise [rebased.wtf](https://rebased.wtf), a meetup for developers, tinkerers, and people crossing into technology from other fields. My work combines rigorous product engineering, collective cultural infrastructure, and independent experiments.

The [2023 year in review](/writing/2023-year-in-review) is the clearest account of how those threads came together. [Reading](/reading) holds books, articles, and quotes I keep returning to. Older side projects stay linked from the article when they add context.`,
          'seed.md'
        ),
      },
      {
        _type: 'linkListBlock',
        _key: 'elsewhere',
        links: [
          emailLink('Email', 'christian.cito@arthouse.is', 'home'),
          externalLink('GitHub', 'https://github.com/chrcit', 'home'),
          externalLink(
            'LinkedIn',
            'https://www.linkedin.com/in/christian-cito-9b72a117b/',
            'home'
          ),
          externalLink('Instagram', 'https://instagram.com/chrcit', 'home'),
        ],
      },
      {
        _type: 'newsletterBlock',
        _key: 'newsletter',
        heading: 'Newsletter',
        body: 'Occasional notes on software, design, culture, and current experiments.',
        buttonLabel: 'Subscribe',
        successMessage: 'You are on the list. Thank you.',
      },
    ],
    meta: {
      ...meta(
        'Christian Cito works across software, design, and cultural infrastructure through Arthouse, hausgemacht, and rebased.wtf in Vienna.'
      ),
      title: 'Christian Cito · Software, design, and culture',
    },
  });

  documents.push(
    {
      _id: 'themeSettings',
      _type: 'themeSettings',
      brandColor: '#1843d8',
      textColor: '#101211',
      backgroundColor: '#eef0f0',
    },
    {
      _id: 'siteSettings',
      _type: 'siteSettings',
      metaSettings: {
        _type: 'metaSettings',
        siteTitle: 'Christian Cito',
        titleTemplate: '%s · Christian Cito',
        defaultDescription:
          'Christian Cito works across software, design, and cultural infrastructure.',
      },
      socials: [
        {
          _type: 'socialLink',
          _key: 'github',
          platform: 'other',
          url: 'https://github.com/chrcit',
        },
        {
          _type: 'socialLink',
          _key: 'twitter',
          platform: 'twitter',
          url: 'https://twitter.com/chrcit',
        },
        {
          _type: 'socialLink',
          _key: 'instagram',
          platform: 'instagram',
          url: 'https://instagram.com/chrcit',
        },
        {
          _type: 'socialLink',
          _key: 'linkedin',
          platform: 'linkedin',
          url: 'https://www.linkedin.com/in/christian-cito-9b72a117b/',
        },
      ],
      privacyPolicy: ref('page-privacy-policy'),
      imprint: ref('page-imprint'),
      newsletter: {
        enabled: true,
        privacyNote: 'Unsubscribe at any time.',
      },
    },
    {
      _id: 'header',
      _type: 'header',
      nav: [],
    },
    {
      _id: 'footer',
      _type: 'footer',
      mainNav: [],
      secondaryNav: [
        internalLink('Imprint', 'page-imprint', 'footer'),
        internalLink('Privacy', 'page-privacy-policy', 'footer'),
      ],
      socials: [
        {
          _type: 'socialLink',
          _key: 'github',
          platform: 'other',
          url: 'https://github.com/chrcit',
        },
        {
          _type: 'socialLink',
          _key: 'instagram',
          platform: 'instagram',
          url: 'https://instagram.com/chrcit',
        },
      ],
    }
  );
  return documents;
}

const documents = await buildDocuments();
if (dryRun) {
  console.log(
    `Dry run: ${documents.length} documents, ${imageCache.size} image assets.`
  );
  console.log(
    documents.map((document) => `${document._type}\t${document._id}`).join('\n')
  );
} else {
  let transaction = client.transaction();
  for (const document of documents)
    transaction = transaction.createIfNotExists(document);
  await transaction.commit({ autoGenerateArrayKeys: true });
  console.log(
    `Imported ${documents.length} documents and ${imageCache.size} image assets into ${client.config().projectId}/${client.config().dataset}.`
  );
}
