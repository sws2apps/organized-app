import assert from 'node:assert/strict';
import { test } from 'node:test';
import type {
  Territory,
  TerritoryAssignment,
  TerritoryCampaign,
} from '@definition/territory';
import {
  campaignEnded,
  campaignOverdue,
  campaignProgress,
  currentCampaign,
  matchesCampaign,
  outForCampaign,
  workedInCampaign,
} from '@features/territories/campaign_filter';

const memorial: TerritoryCampaign = {
  id: 'memorial',
  name: 'Memorial invitations',
  start: '2026-03-01',
  end: '2026-03-21',
};

const trolley: TerritoryCampaign = {
  id: 'trolley',
  name: 'Trolley weekend',
  start: '2026-02-01',
  end: '2026-02-02',
};

const assignment = (
  id: string,
  dates: { assignedOn: string; returnedOn?: string },
  campaign?: string
): TerritoryAssignment => ({
  id,
  publisher: 'Anna Weber',
  serviceYear: 2026,
  months: 1,
  startMonth: 0,
  endMonth: 0,
  ...dates,
  ...(campaign ? { campaign: { id: campaign, name: campaign } } : {}),
});

const territory = (id: string, assignments: TerritoryAssignment[]) =>
  ({ id, assignments }) as Territory;

const territories = [
  // returned for the campaign
  territory('worked', [
    assignment(
      'w1',
      { assignedOn: '02.03.2026', returnedOn: '10.03.2026' },
      'memorial'
    ),
  ]),
  // out for the campaign
  territory('out', [
    assignment('o1', { assignedOn: '05.03.2026' }, 'memorial'),
  ]),
  // out, but not for the campaign
  territory('plain', [assignment('p1', { assignedOn: '01.01.2026' })]),
  // worked for another campaign, nothing for this one
  territory('other', [
    assignment(
      't1',
      { assignedOn: '01.02.2026', returnedOn: '02.02.2026' },
      'trolley'
    ),
  ]),
  territory('idle', []),
];

const ids = (filter?: { id: string; worked: boolean }) =>
  territories
    .filter((item) => matchesCampaign(item, filter))
    .map((item) => item.id);

test('worked is a flagged assignment that came back; out is a flagged one still open', () => {
  assert.equal(workedInCampaign(territories[0], 'memorial'), true);
  assert.equal(workedInCampaign(territories[1], 'memorial'), false);
  assert.equal(outForCampaign(territories[1], 'memorial')?.id, 'o1');
  assert.equal(outForCampaign(territories[2], 'memorial'), undefined);
});

test('no filter keeps every territory', () => {
  assert.deepEqual(ids(), ['worked', 'out', 'plain', 'other', 'idle']);
});

test('"not yet in" leaves out the worked and the out ones', () => {
  assert.deepEqual(ids({ id: 'memorial', worked: false }), [
    'plain',
    'other',
    'idle',
  ]);
});

test('"worked in" keeps only the ones returned for it', () => {
  assert.deepEqual(ids({ id: 'memorial', worked: true }), ['worked']);
  assert.deepEqual(ids({ id: 'trolley', worked: true }), ['other']);
});

test('the progress puts every territory in one bucket', () => {
  assert.deepEqual(campaignProgress(territories, 'memorial'), {
    worked: 1,
    out: 1,
    waiting: 3,
    total: 5,
  });

  // returned once and out again for it counts as worked
  const again = territory('again', [
    assignment(
      'a1',
      { assignedOn: '02.03.2026', returnedOn: '05.03.2026' },
      'memorial'
    ),
    assignment('a2', { assignedOn: '06.03.2026' }, 'memorial'),
  ]);
  assert.deepEqual(campaignProgress([again], 'memorial'), {
    worked: 1,
    out: 0,
    waiting: 0,
    total: 1,
  });
});

test('an open flagged assignment is overdue a week after the campaign ends', () => {
  const out = territories[1];
  const campaigns = [memorial, trolley];

  assert.equal(campaignOverdue(out, campaigns, new Date(2026, 2, 21)), false);
  assert.equal(campaignOverdue(out, campaigns, new Date(2026, 2, 27)), false);
  assert.equal(campaignOverdue(out, campaigns, new Date(2026, 2, 28)), true);
  // an unknown campaign, an unflagged or a returned assignment never counts
  assert.equal(campaignOverdue(out, [], new Date(2026, 3, 30)), false);
  assert.equal(
    campaignOverdue(territories[2], campaigns, new Date(2026, 3, 30)),
    false
  );
  assert.equal(
    campaignOverdue(territories[0], campaigns, new Date(2026, 3, 30)),
    false
  );
});

test('campaignEnded: the day after the last day, for an open assignment only', () => {
  const open = assignment('o1', { assignedOn: '05.03.2026' }, 'memorial');

  assert.equal(campaignEnded(open, [memorial], new Date(2026, 2, 21)), false);
  assert.equal(campaignEnded(open, [memorial], new Date(2026, 2, 22)), true);
  assert.equal(
    campaignEnded(
      { ...open, returnedOn: '22.03.2026' },
      [memorial],
      new Date(2026, 2, 25)
    ),
    false
  );
});

test('currentCampaign: running first, else the last to end within two months', () => {
  const campaigns = [trolley, memorial];

  assert.equal(
    currentCampaign(campaigns, new Date(2026, 2, 10))?.id,
    'memorial'
  );
  assert.equal(
    currentCampaign(campaigns, new Date(2026, 2, 25))?.id,
    'memorial'
  );
  assert.equal(
    currentCampaign(campaigns, new Date(2026, 4, 21))?.id,
    'memorial'
  );
  assert.equal(currentCampaign(campaigns, new Date(2026, 4, 22)), undefined);
  assert.equal(
    currentCampaign(campaigns, new Date(2026, 1, 20))?.id,
    'trolley'
  );
});
