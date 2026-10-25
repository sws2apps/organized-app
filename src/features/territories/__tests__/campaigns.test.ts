import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { TerritoryCampaign } from '@definition/territory';
import {
  campaignChoices,
  campaignFor,
  campaignLabel,
  campaignOverlaps,
  campaignSnapshot,
  campaignsOn,
  dateOf,
  dayOf,
} from '@features/territories/campaign_dates';

const year = new Date().getFullYear();

const campaign = (
  id: string,
  start: string,
  end: string,
  name = id
): TerritoryCampaign => ({ id, name, start, end });

const ids = (list: TerritoryCampaign[]) => list.map((item) => item.id);

// yyyy-mm-dd in the current year, so the labels carry no year
const day = (month: number, date: number, y = year) =>
  `${y}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

test('a day and a date round-trip in local time', () => {
  assert.equal(dayOf(new Date(2026, 2, 1)), '2026-03-01');
  assert.equal(dayOf(new Date(2026, 11, 31, 23, 59)), '2026-12-31');
  assert.deepEqual(dateOf('2026-03-01'), new Date(2026, 2, 1));
});

test('campaignsOn includes the first and the last day', () => {
  const memorial = campaign('memorial', '2026-03-01', '2026-03-21');

  assert.deepEqual(ids(campaignsOn([memorial], new Date(2026, 1, 28))), []);
  assert.deepEqual(ids(campaignsOn([memorial], new Date(2026, 2, 1))), [
    'memorial',
  ]);
  assert.deepEqual(ids(campaignsOn([memorial], new Date(2026, 2, 21, 18))), [
    'memorial',
  ]);
  assert.deepEqual(ids(campaignsOn([memorial], new Date(2026, 2, 22))), []);
});

test('campaignsOn lists the latest start first', () => {
  const campaigns = [
    campaign('long', '2026-03-01', '2026-04-30'),
    campaign('short', '2026-03-10', '2026-03-20'),
  ];

  assert.deepEqual(ids(campaignsOn(campaigns, new Date(2026, 2, 15))), [
    'short',
    'long',
  ]);
});

test('campaignFor pre-selects the campaign running on the assigned day', () => {
  const memorial = campaign('memorial', '2026-03-01', '2026-03-21');
  const convention = campaign('convention', '2026-03-15', '2026-04-15');

  // inside one campaign: that one
  assert.equal(campaignFor([memorial], new Date(2026, 2, 10))?.id, 'memorial');
  // inside two: the latest start
  assert.equal(
    campaignFor([memorial, convention], new Date(2026, 2, 18))?.id,
    'convention'
  );
  // ended, or not yet started: none, whatever else is on the list
  assert.equal(campaignFor([memorial], new Date(2026, 2, 22)), undefined);
  assert.equal(campaignFor([memorial], new Date(2026, 1, 28)), undefined);
  assert.equal(campaignFor([], new Date(2026, 2, 10)), undefined);
});

test('campaignSnapshot keeps the id and the name, coverage only when set', () => {
  const memorial = campaign('memorial', '2026-03-01', '2026-03-21', 'Memorial');

  assert.deepEqual(campaignSnapshot(memorial), {
    id: 'memorial',
    name: 'Memorial',
  });
  assert.deepEqual(campaignSnapshot(memorial, true), {
    id: 'memorial',
    name: 'Memorial',
    coverage: true,
  });
});

test('campaignChoices: running, then upcoming, then recently ended', () => {
  const today = new Date(2026, 8, 29);
  const campaigns = [
    campaign('old', '2025-08-01', '2025-08-31'),
    campaign('recent', '2026-03-01', '2026-03-21'),
    campaign('later', '2026-08-01', '2026-08-15'),
    campaign('next', '2026-12-01', '2026-12-31'),
    campaign('soon', '2026-10-01', '2026-10-15'),
    campaign('now', '2026-09-20', '2026-10-05'),
    campaign('too old', '2025-08-01', '2025-08-28'),
  ];

  // ended within 12 months: 29 Sep 2025 or later; the newest ended first
  assert.deepEqual(ids(campaignChoices(campaigns, today)), [
    'now',
    'soon',
    'next',
    'later',
    'recent',
  ]);
});

test('campaignChoices keeps one that ended 12 months ago to the day', () => {
  const today = new Date(2026, 8, 29);
  const edge = campaign('edge', '2025-09-01', '2025-09-29');
  const gone = campaign('gone', '2025-09-01', '2025-09-28');

  assert.deepEqual(ids(campaignChoices([edge, gone], today)), ['edge']);
});

test('campaignLabel joins the name and the days', () => {
  const memorial = campaign(
    'memorial',
    day(3, 1),
    day(3, 21),
    'Gedächtnismahl-Einladungen'
  );

  assert.equal(
    campaignLabel(memorial, 'de-DE'),
    'Gedächtnismahl-Einladungen · 1.–21. März'
  );
  // ICU sets thin spaces around the dash
  assert.match(
    campaignLabel({ ...memorial, name: 'Memorial invitations' }, 'en-US'),
    /^Memorial invitations · March 1\s–\s21$/
  );
});

test('campaignLabel shows the year when it is not this one', () => {
  const last = campaign('last', day(11, 1, year - 1), day(11, 21, year - 1));

  assert.equal(
    campaignLabel(last, 'de-DE'),
    `last · 1.–21. November ${year - 1}`
  );
});

test('campaignOverlaps shares at least a day', () => {
  const memorial = campaign('memorial', '2026-03-01', '2026-03-21');

  assert.equal(
    campaignOverlaps(memorial, new Date(2026, 1, 1), new Date(2026, 1, 28)),
    false
  );
  assert.equal(
    campaignOverlaps(memorial, new Date(2026, 1, 1), new Date(2026, 2, 1)),
    true
  );
  assert.equal(
    campaignOverlaps(memorial, new Date(2026, 2, 21), new Date(2026, 3, 30)),
    true
  );
  assert.equal(
    campaignOverlaps(memorial, new Date(2026, 2, 22), new Date(2026, 3, 30)),
    false
  );
  // an assignment still open today: from its start until now
  assert.equal(
    campaignOverlaps(memorial, new Date(2026, 0, 1), new Date(2026, 8, 29)),
    true
  );
});
