import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { Document, Page, renderToBuffer } from '@react-pdf/renderer';
import {
  CUSTOM_DUTY_ICONS,
  isCustomDutyIcon,
  resolveCustomDutyIcon,
} from '@constants/duty_icons';
import { meetingDutiesDefault } from '@services/dexie/schema';
import { updateObject } from '@utils/common';
import packDuties from '@views/meetings/duties/packDuties';
import IconCustomDuty from '@views/components/icons/IconCustomDuty';
import { CustomDutyIconType } from '@definition/duties';

test('custom-duty palette contains exactly the eight selected choices', () => {
  assert.deepEqual(Object.keys(CUSTOM_DUTY_ICONS), [
    'emergency',
    'keys',
    'timekeeping',
    'welcome',
    'transport',
    'donations',
    'group',
    'devices',
  ]);
  assert.equal(
    new Set(Object.values(CUSTOM_DUTY_ICONS).map((icon) => icon.path)).size,
    8
  );
});

test('legacy, unknown and prototype names fall back safely to the existing icon', () => {
  for (const value of [
    undefined,
    null,
    '',
    'constructor',
    '__proto__',
    'toString',
    'future-icon',
    'meals',
    1,
    {},
  ]) {
    assert.equal(resolveCustomDutyIcon(value), 'default');
    assert.equal(isCustomDutyIcon(value), false);
  }
  for (const value of ['default', ...Object.keys(CUSTOM_DUTY_ICONS)]) {
    assert.equal(resolveCustomDutyIcon(value), value);
    assert.equal(isCustomDutyIcon(value), true);
  }
});

test('icon updates and resets sync without affecting another language group or duty counts', () => {
  const main = meetingDutiesDefault('main');
  const group = meetingDutiesDefault('group');
  main.custom.push({
    id: 'duty',
    name: 'Custom',
    amount: 2,
    _deleted: false,
    updatedAt: '2026-10-01',
    icon: 'keys',
  });
  group.custom.push({ ...main.custom[0], icon: 'welcome' });
  const local = { meeting_duties: [main, group] };
  for (const icon of ['devices', 'default'] as const) {
    const incoming = structuredClone(local);
    incoming.meeting_duties[0].custom[0].icon = icon;
    incoming.meeting_duties[0].custom[0].updatedAt += 'Z';
    const merged = updateObject(local, incoming);
    assert.equal(merged.meeting_duties[0].custom[0].icon, icon);
    assert.equal(merged.meeting_duties[0].custom[0].amount, 2);
    assert.equal(merged.meeting_duties[1].custom[0].icon, 'welcome');
  }
  // An older client that does not know the icon field must not erase it.
  local.meeting_duties[0].custom[0].icon = 'keys';
  const incoming = structuredClone(local);
  delete incoming.meeting_duties[0].custom[0].icon;
  incoming.meeting_duties[0].custom[0].updatedAt += 'Z';
  assert.equal(
    updateObject(local, incoming).meeting_duties[0].custom[0].icon,
    'keys'
  );
});

test('custom icon follows every split PDF card', () => {
  const rows = Array.from({ length: 80 }, (_, i) => ({
    id: String(i),
    date: 'Oct 29',
    persons: [{ id: 'a', name: 'Example person' }],
  }));
  const pages = packDuties(
    [{ id: 'duty', name: 'Custom', icon: 'custom', customIcon: 'keys', rows }],
    14,
    'portrait'
  );
  assert.ok(pages.length > 1);
  for (const placement of pages.flat())
    assert.equal(placement.card.customIcon, 'keys');
});

test('all custom icons and the legacy default render in PDF', async () => {
  const icons = [
    'default',
    ...Object.keys(CUSTOM_DUTY_ICONS),
  ] as CustomDutyIconType[];
  const pdf = await renderToBuffer(
    createElement(
      Document,
      {},
      createElement(
        Page,
        {},
        ...icons.map((icon) =>
          createElement(IconCustomDuty, { key: icon, icon })
        )
      )
    )
  );
  assert.equal(pdf.subarray(0, 4).toString(), '%PDF');
  assert.ok(pdf.length > 1000);
});
