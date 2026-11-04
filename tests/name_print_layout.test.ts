import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import { renderToBuffer } from '@react-pdf/renderer';

test('both S140 templates render long primary and assistant names', async () => {
  // Bundle Vite's environment constant for Node while retaining the real PDF components.
  const directory = await mkdtemp(resolve('node_modules/.name-layout-'));
  try {
    const outfile = resolve(directory, 'fixture.mjs');
    await build({
      entryPoints: ['tests/fixtures/name_print_layout.tsx'],
      bundle: true,
      platform: 'node',
      format: 'esm',
      packages: 'external',
      define: { 'import.meta.env': '{}' },
      outfile,
    });
    const { nameLayoutDocument } = await import(pathToFileURL(outfile).href);
    const pdf = await renderToBuffer(nameLayoutDocument());
    assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
    assert.ok(pdf.length > 1000);
    if (process.env.NAME_PRINT_PREVIEW)
      await writeFile(process.env.NAME_PRINT_PREVIEW, pdf);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
