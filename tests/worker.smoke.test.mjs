import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const fixture = JSON.parse(
  await readFile(new URL('./fixtures/sanity.json', import.meta.url), 'utf8')
);
const sanityRequests = [];

globalThis.fetch = async (input) => {
  const url = new URL(
    typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
  );
  const query = url.searchParams.get('query') ?? '';
  sanityRequests.push(query);

  assert.equal(
    url.hostname,
    'ci-smoke-project.apicdn.sanity.io',
    'the smoke suite must not contact a real Sanity project'
  );

  let result = null;
  if (query.includes('_type == "page" && _id == "homepage"')) {
    result = fixture.homepage;
  } else if (query.includes('_type == "header"')) {
    result = fixture.header;
  } else if (query.includes('_type == "footer"')) {
    result = fixture.footer;
  } else if (query.includes('_type == "siteSettings"')) {
    result = fixture.siteSettings;
  } else if (query.includes('_type == "themeSettings"')) {
    result = fixture.themeSettings;
  } else {
    throw new Error(`Unexpected Sanity query in smoke test: ${query}`);
  }

  return Response.json({ result });
};

const worker = (await import('../build/server/index.js')).default;

function assertNoRenderError(html) {
  assert.doesNotMatch(html, /Unexpected Application Error|Oops!|Element type is invalid/);
}

test('homepage renders the CI sample-dataset fixture through the Worker', async () => {
  const response = await worker.fetch(new Request('https://ci.example.test/'));
  const html = await response.text();

  assert.equal(response.status, 200);
  assertNoRenderError(html);
  assert.match(html, />CI Sample Dataset Homepage<\/h1>/);
  assert.match(html, /Rendered from the CI sample dataset\./);
  assert.match(html, /<title>CI Sample Dataset Homepage<\/title>/);
  assert.ok(
    sanityRequests.some((query) =>
      query.includes('_type == "page" && _id == "homepage"')
    )
  );
});

test('configured Studio route server-renders without an error', async () => {
  const response = await worker.fetch(new Request('https://ci.example.test/studio/'));
  const html = await response.text();

  assert.equal(response.status, 200);
  assertNoRenderError(html);
  assert.match(html, /<title>Sanity Studio<\/title>/);
  assert.match(html, /Loading Studio…/);
  assert.ok(
    html.includes(
      '"VITE_SANITY_STUDIO_URL":"https://ci.example.test/studio"'
    )
  );
  assert.ok(
    html.includes(
      '"VITE_SANITY_STUDIO_PREVIEW_ORIGIN":"https://ci.example.test"'
    )
  );
});
