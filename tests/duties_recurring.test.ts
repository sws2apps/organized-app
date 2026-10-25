import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  DutiesMeetingType,
  DutiesSectionTemplateType,
} from '@definition/schedules';
import {
  resolveRecurringSections,
  snapshotRecurringSections,
  currentSectionTemplate,
} from '@utils/duties_recurring';
import { filterScheduleByDataView } from '@utils/schedule_publish';
const template: DutiesSectionTemplateType = {
  id: 'midweek-r1',
  meeting: 'midweek',
  updatedAt: '2026-10-25',
  sections: [
    { id: 'gems', name: 'Spiritual gems', amount: 2, parts: ['tgw_gems'] },
    {
      id: 'living',
      name: 'Living as Christians',
      amount: 2,
      parts: ['lc_all'],
    },
    { id: 'study', name: 'Bible study', amount: 2, parts: ['lc_cbs'] },
  ],
};
const empty = { sections: [], dynamic: [] } as unknown as DutiesMeetingType;
const resolve = (
  changes: Partial<Parameters<typeof resolveRecurringSections>[0]> = {}
) =>
  resolveRecurringSections({
    duties: empty,
    templates: [template],
    meeting: 'midweek',
    dataView: 'main',
    partKeys: ['tgw_gems', 'lc_part1', 'lc_part2', 'lc_cbs'],
    ...changes,
  });
test('recurring defaults appear in successive weeks without copying or assigning people', () => {
  const first = resolve();
  const next = resolve();
  assert.deepEqual(first, next);
  assert.equal(first.length, 3);
  assert.deepEqual(empty, { sections: [], dynamic: [] });
});
test('Living sections follow available parts and exclude Bible study', () => {
  assert.deepEqual(resolve()[1].parts, ['lc_part1', 'lc_part2']);
  assert.deepEqual(
    resolve({ partKeys: ['tgw_gems', 'lc_part1', 'lc_cbs'] })[1].parts,
    ['lc_part1']
  );
});
test('a missing linked part is skipped instead of becoming a whole-meeting shift', () => {
  const sections = resolve({ partKeys: ['tgw_gems', 'lc_cbs'] });
  assert.deepEqual(
    sections.map((s) => s.name),
    ['Spiritual gems', 'Bible study']
  );
  assert.deepEqual(resolve({ partKeys: [] }), []);
});
test('freely named recurring sections remain meaningful without part links', () => {
  assert.equal(
    resolve({
      templates: [
        {
          ...template,
          sections: [{ id: 'rear', name: 'Rear hall', amount: 1, parts: [] }],
        },
      ],
      partKeys: [],
    })[0].name,
    'Rear hall'
  );
});
test('one current setup is independent of selected weeks and separate for each meeting', () => {
  assert.deepEqual(resolve({ meeting: 'weekend' }), []);
  const latest = {
    ...template,
    updatedAt: '2026-10-27',
    sections: [{ ...template.sections[0], amount: 1 }],
  };
  assert.equal(currentSectionTemplate([latest, template], 'midweek'), latest);
  assert.equal(resolve({ templates: [template, latest] })[0].amount, 1);
  assert.equal(
    resolve({ templates: [template, latest] })[0].id,
    resolve()[0].id
  );
});
test('linked defaults follow meeting order regardless of creation order', () => {
  const shuffled = { ...template, sections: [...template.sections].reverse() };
  assert.deepEqual(
    resolve({ templates: [shuffled] }).map((s) => s.name),
    ['Spiritual gems', 'Living as Christians', 'Bible study']
  );
});
test('saved sections follow actual meeting order and unlinked sections remain stable', () => {
  const sections = resolve().reverse();
  sections.push({ ...sections[0], id: 'free1', name: 'Rear hall', parts: [] });
  sections.push({ ...sections[0], id: 'free2', name: 'Front hall', parts: [] });
  assert.deepEqual(
    resolve({ duties: { ...empty, sections } }).map((s) => s.name),
    [
      'Spiritual gems',
      'Living as Christians',
      'Bible study',
      'Rear hall',
      'Front hall',
    ]
  );
});
test('first assignment snapshot survives changes to defaults and material', () => {
  const snapshot = snapshotRecurringSections(empty, resolve(), 'main', 'now');
  const changed = { ...template, updatedAt: 'later', sections: [] };
  assert.deepEqual(
    resolve({ duties: snapshot, templates: [changed], partKeys: [] }),
    resolve()
  );
  assert.equal(
    snapshotRecurringSections(snapshot, [], 'main', 'later'),
    snapshot
  );
});
test('an explicitly empty week stays empty when defaults change', () => {
  const snapshot = snapshotRecurringSections(empty, [], 'main', 'now');
  assert.deepEqual(resolve({ duties: snapshot }), []);
});
test('deleting every section never brings inherited defaults back', () => {
  const duties = {
    ...empty,
    sections: resolve().map((s) => ({ ...s, _deleted: true })),
  };
  assert.deepEqual(resolve({ duties }), []);
});
test('host snapshots and language-group defaults are isolated', () => {
  const host = snapshotRecurringSections(empty, resolve(), 'main', 'now');
  const group = resolve({
    duties: host,
    dataView: 'group',
    templates: [{ ...template, id: 'group-r1' }],
  });
  assert.equal(group.length, 3);
  assert.ok(group.every((s) => s.dataView === 'group'));
  const both = snapshotRecurringSections(host, group, 'group', 'now');
  assert.deepEqual(resolve({ duties: both }), resolve());
  assert.deepEqual(resolve({ duties: both, dataView: 'group' }), group);
});
test('pre-existing assigned weeks are not silently given new sections', () => {
  const duties = {
    ...empty,
    dynamic: [
      { type: 'main', id: 'custom_1', value: 'person', updatedAt: 'old' },
    ],
  };
  assert.deepEqual(resolve({ duties }), []);
  assert.equal(resolve({ duties, dataView: 'group' }).length, 3);
});
test('legacy shared sections keep their previous layout', () => {
  const section = { ...resolve()[0], id: 'legacy', dataView: undefined };
  assert.deepEqual(resolve({ duties: { ...empty, sections: [section] } }), [
    section,
  ]);
});
test('publishing a snapshot includes only its group and keeps linked part keys', () => {
  const host = snapshotRecurringSections(empty, resolve(), 'main', 'now');
  const group = resolve({
    dataView: 'group',
    templates: [{ ...template, id: 'group-r1' }],
  });
  const published = filterScheduleByDataView(
    snapshotRecurringSections(host, group, 'group', 'now'),
    'group'
  );
  assert.equal(published.sections.length, 3);
  assert.deepEqual(published.sections[1].parts, ['lc_part1', 'lc_part2']);
  assert.deepEqual(published.section_overrides, [
    { type: 'group', updatedAt: 'now' },
  ]);
});
