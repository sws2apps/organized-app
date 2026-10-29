import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import { format, startOfWeek } from 'date-fns';
import ts from 'typescript';
import type { SettingsType } from '../src/definition/settings';

// Isolate date prefilling from browser-only state dependencies.
const source = readFileSync(
  new URL(
    '../src/features/congregation/field_service_meetings/recurring_prefill.ts',
    import.meta.url
  ),
  'utf8'
);
const module = {
  exports: {} as {
    getGroupRecurringStart: (
      settings: SettingsType,
      group: string,
      reference: Date
    ) => { start: Date; end: Date } | null;
  },
};
runInNewContext(
  ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText,
  {
    exports: module.exports,
    require: (name: string) => {
      if (name === '@constants/index')
        return { FIELD_SERVICE_MEETING_DURATION_MINUTES: 60 };
      if (name === '@utils/date')
        return {
          formatDate: format,
          getWeekDate: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
        };
      throw new Error(`Unexpected import: ${name}`);
    },
  }
);
const { getGroupRecurringStart } = module.exports;
const settings = (weekday: number, time: string) =>
  ({
    cong_settings: {
      field_service_meeting_times: [
        { type: 'group', weekday: { value: weekday }, time: { value: time } },
      ],
    },
  }) as SettingsType;

for (const [weekday, time] of [
  [-1, '09:30'],
  [7, '09:30'],
  [1.5, '09:30'],
  [0, '24:00'],
  [0, '09:99'],
  [0, 'invalid'],
] as const) {
  test(`malformed recurring settings skip prefilling: ${weekday}/${time}`, () => {
    assert.equal(
      getGroupRecurringStart(
        settings(weekday, time),
        'group',
        new Date(2026, 9, 19)
      ),
      null
    );
  });
}
test('recurring Sunday stays in the selected year-boundary week', () => {
  const result = getGroupRecurringStart(
    settings(6, '10:30'),
    'group',
    new Date(2026, 11, 28)
  );
  assert.ok(result);
  assert.equal(format(result.start, 'yyyy/MM/dd HH:mm'), '2027/01/03 10:30');
  assert.equal(result.end.getTime() - result.start.getTime(), 3_600_000);
});
test('invalid selected date skips recurring prefilling', () => {
  assert.equal(
    getGroupRecurringStart(settings(0, '09:30'), 'group', new Date('invalid')),
    null
  );
});
test('missing recurring fields skip prefilling', () => {
  const incomplete = {
    cong_settings: { field_service_meeting_times: [{ type: 'group' }] },
  } as SettingsType;
  assert.equal(getGroupRecurringStart(incomplete, 'group', new Date()), null);
});
