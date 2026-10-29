import assert from 'node:assert/strict';
import process from 'node:process';
import http from 'node:http';
import { Buffer } from 'node:buffer';
import { createRequire } from 'node:module';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
const app = process.cwd();
const astro = true;
const require = createRequire(path.join(app, 'package.json'));
const { unstable_dev } = require('wrangler');
const configPath = path.join(app, astro ? 'dist/server/wrangler.json' : 'build/server/wrangler.json');
const config = JSON.parse(await readFile(configPath, 'utf8'));
const dir = path.resolve(path.dirname(configPath), config.assets.directory);
const script = path.resolve(path.dirname(configPath), config.main);
const server = await unstable_dev(script, {
  config: configPath, ip: '127.0.0.1', port: 0, inspectorPort: 0,
  local: true, logLevel: 'error', persist: false,
  experimental: { disableExperimentalWarning: true, disableDevRegistry: true },
});
const requestLocal = (input, init = {}) => new Promise((resolve, reject) => {
  const url = new URL(input);
  const request = http.request({
    hostname: server.address, port: server.port, path: url.pathname + url.search,
    method: init.method ?? 'GET', headers: init.headers, agent: false,
  }, (response) => {
    const chunks = [];
    response.on('data', (chunk) => chunks.push(chunk));
    response.on('error', reject);
    response.on('end', () => {
      const headers = new Headers();
      for (const [key, value] of Object.entries(response.headers)) {
        if (value !== undefined) headers.set(key, Array.isArray(value) ? value.join(', ') : value);
      }
      resolve(new Response([204, 304].includes(response.statusCode) ? null : Buffer.concat(chunks), { status: response.statusCode, headers }));
    });
  });
  request.setTimeout(30000, () => request.destroy(new Error('Local HTTP check timed out')));
  request.on('error', reject);
  request.end();
});
const results = [];
try {
  const prefix = astro ? '_astro' : 'assets';
  const files = [];
  async function visit(relative) {
    for (const entry of await readdir(path.join(dir, relative), { withFileTypes: true })) {
      const file = `${relative}/${entry.name}`;
      if (entry.isDirectory()) await visit(file);
      else files.push(file);
    }
  }
  await visit(prefix);
  const policy = await readFile(path.join(dir, '_headers'), 'utf8');
  const pathsInPolicy = policy.split('\n').filter((line) => line.startsWith('/')).map((line) => line.slice(1));
  const covered = (file) => pathsInPolicy.some((pattern) => pattern.endsWith('*') ? file.startsWith(pattern.slice(0, -1)) : file === pattern);
  const immutableFiles = files.filter((file) => /\.(js|css)$/.test(file) && !/\/manifest-/.test(file) && (astro || covered(file)));
  assert.ok(immutableFiles.length > 1);
  if (!astro) {
    const manifestPath = files.find((file) => /\/manifest-/.test(file));
    assert.ok(manifestPath, 'React Router runtime manifest exists');
    const raw = await readFile(path.join(dir, manifestPath), 'utf8');
    const manifest = JSON.parse(raw.slice(raw.indexOf('=') + 1).replace(/;\s*$/, ''));
    const visitReferences = (value) => {
      if (typeof value === 'string' && value.startsWith('/assets/') && /\.(js|css)$/.test(value) && !value.includes('/manifest-')) {
        assert.ok(files.includes(value.slice(1)), `missing route/chunk reference ${value}`);
        assert.ok(covered(value.slice(1)), `uncached route/chunk reference ${value}`);
      } else if (value && typeof value === 'object') {
        for (const child of Object.values(value)) visitReferences(child);
      }
    };
    visitReferences(manifest);
    results.push({ kind: 'route-and-lazy-references', status: 'passed' });
  }
  for (const file of immutableFiles) {
    const response = await requestLocal(`http://localhost/${file}`);
    const cc = response.headers.get('cache-control') ?? '';
    assert.equal(response.status, 200, file);
    // Some unused SSR CSS is copied after the client build. Only files in the
    // header policy's emitted client inventory are subject to this assertion.
    assert.match(cc, /max-age=31536000.*immutable/, file);
    await response.arrayBuffer();
  }
  results.push({ kind: 'positive-assets', count: immutableFiles.length, status: 'passed' });
  if (astro) {
    const image = files.find((file) => /\.(webp|avif|png|jpg)$/.test(file));
    assert.ok(image, 'an emitted image must retain existing immutable caching');
    const response = await requestLocal(`http://localhost/${image}`);
    assert.equal(response.status, 200);assert.match(response.headers.get('cache-control'), /immutable/);
    await response.arrayBuffer();results.push({ kind: 'image-policy-preserved', path: image, status: 'passed' });
  }
  const paths = [`/${prefix}/__missing-00000000.js`, `/${prefix}/immutable/stable.js`, `/${prefix}/immutable/removed-00000000.js`, '/favicon.ico', '/site.webmanifest'];
  const manifest = files.find((file) => /\/manifest-/.test(file));
  if (manifest && !astro) paths.push('/'+manifest);
  for (const pathname of paths) {
    for (const navigate of [false, true]) {
      const response = await requestLocal(`http://localhost${pathname}`, { headers: navigate ? { 'Sec-Fetch-Mode': 'navigate' } : {} });
      const cc = response.headers.get('cache-control') ?? '';
      assert.doesNotMatch(cc, /immutable|max-age=31536000/, `${pathname} must not receive immutable policy`);
      if (astro && pathname.startsWith('/_astro/') && pathname.includes('00000000')) assert.equal(response.status, 404);
      results.push({ kind: 'control', path: pathname, navigate, status: response.status, cacheControl: cc, mime: response.headers.get('content-type') });
      await response.arrayBuffer();
    }
  }
  console.log(JSON.stringify({ app, checks: results }, null, 2));
} finally {
  await server.stop();
}
