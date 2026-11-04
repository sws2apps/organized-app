import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import type { FieldServiceMeetingType } from '../src/definition/field_service_meetings';

// Load the persistence boundary with isolated tables; no browser database is touched.
const createPersistence = () => {
  let current: FieldServiceMeetingType | undefined;
  let pending = Promise.resolve();
  let transactionCount = 0;
  const metadata = {
    metadata: { field_service_meetings: { send_local: false } },
  };
  const table = {
    get: async () => current && structuredClone(current),
    put: async (meeting: FieldServiceMeetingType) => {
      current = structuredClone(meeting);
    },
  };
  const metadataTable = {
    get: async () => metadata,
    put: async () => undefined,
  };
  const db = {
    field_service_meetings: table,
    metadata: metadataTable,
    transaction: (
      mode: string,
      first: unknown,
      second: unknown,
      action: () => Promise<void>
    ) => {
      assert.equal(mode, 'rw');
      assert.equal(first, table);
      assert.equal(second, metadataTable);
      transactionCount++;
      const result = pending.then(action);
      pending = result.catch(() => undefined);
      return result;
    },
  };
  const module = {
    exports: {} as {
      dbFieldServiceMeetingsSave: (
        meeting: FieldServiceMeetingType,
        expected?: { updatedAt: string | undefined }
      ) => Promise<void>;
    },
  };
  const source = readFileSync(
    new URL('../src/services/dexie/field_service_meetings.ts', import.meta.url),
    'utf8'
  );
  const code = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  runInNewContext(code, {
    exports: module.exports,
    require: (name: string) => {
      if (name === '@db/appDb') return { __esModule: true, default: db };
      if (name === '@services/i18n/translation')
        return { getTranslation: ({ key }: { key: string }) => key };
      if (name === '@definition/field_service_meetings')
        return { FieldServiceMeetingCategory: { RegularMeeting: 0 } };
      throw new Error(`Unexpected import: ${name}`);
    },
  });
  return {
    save: module.exports.dbFieldServiceMeetingsSave,
    seed: (meeting: FieldServiceMeetingType) => {
      current = structuredClone(meeting);
    },
    current: () => current,
    metadata,
    transactions: () => transactionCount,
  };
};
const meeting = (updatedAt: string, deleted = false) =>
  ({
    meeting_uid: 'meeting',
    meeting_data: { updatedAt, _deleted: deleted },
  }) as FieldServiceMeetingType;

test('meeting and upload marker are written in one transaction', async () => {
  const db = createPersistence();
  await db.save(meeting('new'), { updatedAt: undefined });
  assert.equal(db.current()?.meeting_data.updatedAt, 'new');
  assert.equal(db.metadata.metadata.field_service_meetings.send_local, true);
  assert.equal(db.transactions(), 1);
});
test('a revision changed after the app check cannot be overwritten', async () => {
  const db = createPersistence();
  db.seed(meeting('synced'));
  await assert.rejects(
    db.save(meeting('edited'), { updatedAt: 'original' }),
    /tr_fieldServiceMeetingChanged/
  );
  assert.equal(db.current()?.meeting_data.updatedAt, 'synced');
  assert.equal(db.metadata.metadata.field_service_meetings.send_local, false);
});
test('an edit cannot resurrect a meeting deleted during save', async () => {
  const db = createPersistence();
  db.seed(meeting('original', true));
  await assert.rejects(
    db.save(meeting('edited'), { updatedAt: 'original' }),
    /tr_fieldServiceMeetingChanged/
  );
  assert.equal(db.current()?.meeting_data._deleted, true);
});
test('a new draft cannot overwrite an existing record with the same id', async () => {
  const db = createPersistence();
  db.seed(meeting('existing'));
  await assert.rejects(
    db.save(meeting('new'), { updatedAt: undefined }),
    /tr_fieldServiceMeetingChanged/
  );
  assert.equal(db.current()?.meeting_data.updatedAt, 'existing');
});
test('concurrent drafts cannot both save the same revision', async () => {
  const db = createPersistence();
  db.seed(meeting('original'));
  const results = await Promise.allSettled([
    db.save(meeting('first'), { updatedAt: 'original' }),
    db.save(meeting('second'), { updatedAt: 'original' }),
  ]);
  assert.deepEqual(
    results.map((result) => result.status),
    ['fulfilled', 'rejected']
  );
  assert.equal(db.current()?.meeting_data.updatedAt, 'first');
});

test('saving an open form preserves a newer upload receipt from the stored record', async () => {
  const db = createPersistence();
  const original = {
    ...meeting('original'),
    sync_revision: 'r1',
    sync_updatedAt: 'before',
  };
  db.seed({ ...original, sync_revision: 'r2', sync_updatedAt: 'original' });
  await db.save(
    {
      ...original,
      meeting_data: { ...original.meeting_data, updatedAt: 'edited' },
    },
    { updatedAt: 'original' }
  );
  assert.equal(db.current()?.sync_revision, 'r2');
  assert.equal(db.current()?.sync_updatedAt, 'original');
  assert.equal(db.current()?.meeting_data.updatedAt, 'edited');
  assert.equal(db.metadata.metadata.field_service_meetings.send_local, true);
});
