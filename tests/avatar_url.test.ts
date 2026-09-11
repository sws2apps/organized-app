import assert from 'node:assert/strict';
import { test } from 'node:test';
import { acquireAvatarUrl } from '../src/utils/avatar_url';

test('shares a photo until the last consumer releases it', async () => {
  const buffer = new Uint8Array([1, 2, 3]).buffer;
  const header = acquireAvatarUrl(buffer);
  const picker = acquireAvatarUrl(buffer);
  assert.equal(header.url, picker.url);
  header.release();
  header.release();
  assert.deepEqual(
    new Uint8Array(await (await fetch(picker.url)).arrayBuffer()),
    new Uint8Array(buffer)
  );
  picker.release();
  await assert.rejects(fetch(picker.url));
});

test('replacing one photo does not revoke another consumer’s photo', async () => {
  const original = new Uint8Array([1]).buffer;
  const header = acquireAvatarUrl(original);
  const picker = acquireAvatarUrl(original);
  const replacement = acquireAvatarUrl(new Uint8Array([2]).buffer);
  header.release();
  assert.equal((await fetch(picker.url)).ok, true);
  assert.notEqual(picker.url, replacement.url);
  replacement.release();
  picker.release();
  await assert.rejects(fetch(replacement.url));
  await assert.rejects(fetch(picker.url));
});

test('effect cleanup and remount create a fresh valid URL', async () => {
  const buffer = new Uint8Array([3]).buffer;
  const first = acquireAvatarUrl(buffer);
  first.release();
  const remounted = acquireAvatarUrl(buffer);
  assert.notEqual(first.url, remounted.url);
  assert.equal((await fetch(remounted.url)).ok, true);
  remounted.release();
  await assert.rejects(fetch(remounted.url));
});
