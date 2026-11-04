import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Territory, TerritoryCampaign } from '@definition/territory';
import {
  campaignSections,
  campaignStartsIn,
  campaignStatus,
} from '@features/territories/campaign_view';
import { campaignProgress } from '@features/territories/campaign_filter';
import { forTab, territoryTabGroups } from '@features/territories/tabs';

const campaign = (
  id: string,
  start: string,
  end: string
): TerritoryCampaign => ({ id, name: id, start, end });
const current = campaign('current', '2026-10-01', '2026-10-31');
const upcoming = campaign('next', '2026-11-01', '2026-11-30');
const past = campaign('past', '2026-09-01', '2026-09-30');
const today = new Date(2026, 9, 26);
test('current campaigns precede upcoming ones, and the next upcoming becomes featured when none is active', () => {
  assert.deepEqual(
    campaignSections([upcoming, past, current], today).active.map(
      (item) => item.id
    ),
    ['current', 'next']
  );
  assert.deepEqual(campaignSections([upcoming, past], today).active, [
    upcoming,
  ]);
  assert.deepEqual(campaignSections([upcoming, past], today).past, [past]);
  assert.deepEqual(campaignSections([], today), { active: [], past: [] });
});
test('campaign end day remains active and countdown uses calendar days', () => {
  assert.equal(
    campaignSections([current], new Date(2026, 9, 31, 23, 59)).active.length,
    1
  );
  assert.equal(
    campaignSections([current], new Date(2026, 10, 1)).past.length,
    1
  );
  assert.equal(campaignStartsIn(upcoming, new Date(2026, 9, 31, 23, 59)), 1);
  assert.equal(campaignStartsIn(current, today), 0);
});
test('campaign completion counts territories once and unfinished returns remain not started', () => {
  const base = {
    campaign: { id: 'current', name: 'Current' },
    assignedOn: '01.10.2026',
  };
  const territories = [
    {
      id: 'done',
      assignments: [
        { ...base, returnedOn: '02.10.2026' },
        { ...base, returnedOn: '03.10.2026' },
      ],
    },
    { id: 'out', assignments: [base] },
    {
      id: 'unfinished',
      assignments: [{ ...base, returnedOn: '03.10.2026', completed: false }],
    },
    { id: 'regular', assignments: [{ assignedOn: '01.10.2026' }] },
  ] as Territory[];
  assert.deepEqual(
    territories.map((item) => campaignStatus(item, 'current')),
    ['completed', 'assigned', 'waiting', 'waiting']
  );
  assert.deepEqual(campaignProgress(territories, 'current'), {
    worked: 1,
    out: 1,
    waiting: 2,
    total: 4,
  });
});
test('campaign browsing does not expose another publisher or restricted available territories', () => {
  const territories = [
    {
      id: 'mine',
      holderId: 'p1',
      status: 'in_work',
      categories: [],
      type: 'door_to_door',
    },
    {
      id: 'other',
      holderId: 'p2',
      status: 'in_work',
      categories: [],
      type: 'door_to_door',
    },
    {
      id: 'available',
      status: 'available',
      categories: [],
      type: 'door_to_door',
    },
    {
      id: 'restricted',
      status: 'available',
      categories: ['restricted'],
      type: 'door_to_door',
    },
  ] as Territory[];
  assert.deepEqual(
    forTab(
      territories,
      'campaign',
      'Publisher',
      false,
      undefined,
      { categories: ['restricted'], types: [] },
      { identity: { publisherId: 'p1' } }
    ).map((item) => item.id),
    ['mine', 'available']
  );
  assert.ok(
    !territoryTabGroups(
      {
        editor: false,
        access: 'own',
        publisher: 'Publisher',
        eligiblePublisher: true,
        restricted: { categories: [], types: [] },
      },
      false,
      false,
      true
    )
      .flat()
      .includes('campaign')
  );
});
