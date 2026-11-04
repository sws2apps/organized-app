import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  upcomingEventTitle,
  eventVisibleInDataView,
  canEditUpcomingEvent,
} from '../src/utils/upcoming_events';
import { isTerritoryCoverage } from '../src/utils/territory_coverage';
import {
  appendNote,
  assignmentNoteUpdate,
} from '../src/features/territories/notes';
import {
  UpcomingEventCategory,
  UpcomingEventDuration,
  type UpcomingEventType,
} from '../src/definition/upcoming_events';
const event = (type = 'main'): UpcomingEventType => ({
  event_uid: 'campaign-1',
  event_data: {
    _deleted: false,
    updatedAt: '',
    category: UpcomingEventCategory.SpecialCampaignWeek,
    duration: UpcomingEventDuration.MultipleDays,
    start: '2026-10-01',
    end: '2026-10-31',
    type,
    custom: 'October campaign',
    description: 'Meet at 9 am',
  },
});
test('campaign name is consistent and separate from its description', () => {
  assert.equal(
    upcomingEventTitle(event().event_data, 'Campaign'),
    'October campaign'
  );
  assert.equal(
    upcomingEventTitle(
      { ...event().event_data, custom: undefined },
      'Campaign'
    ),
    'Meet at 9 am'
  );
  assert.equal(
    upcomingEventTitle(
      { ...event().event_data, custom: ' ', description: ' ' },
      'Campaign'
    ),
    'Campaign'
  );
});
test('campaigns follow the same data-view and deletion visibility as events', () => {
  assert.equal(eventVisibleInDataView(event('main'), 'language-a'), true);
  assert.equal(eventVisibleInDataView(event('language-a'), 'main'), false);
  assert.equal(
    eventVisibleInDataView(event('language-b'), 'language-a'),
    false
  );
  const deleted = event();
  deleted.event_data._deleted = true;
  assert.equal(eventVisibleInDataView(deleted, 'main'), false);
});
test('both campaign entry points require event editing rights and matching scope', () => {
  assert.equal(canEditUpcomingEvent(['publisher'], 'main', event()), false);
  assert.equal(canEditUpcomingEvent(['elder'], 'main', event()), false);
  assert.equal(
    canEditUpcomingEvent(['upcoming_events'], 'main', event()),
    true
  );
  assert.equal(canEditUpcomingEvent(['admin'], 'language-a', event()), false);
  assert.equal(
    canEditUpcomingEvent(
      ['admin'],
      'language-a',
      event('language-a'),
      event('main')
    ),
    false
  );
});
test('regular coverage distinguishes campaign work and incomplete returns', () => {
  const campaign = { id: 'campaign-1', name: 'October campaign' };
  assert.equal(isTerritoryCoverage({}), true);
  assert.equal(isTerritoryCoverage({ completed: false }), false);
  assert.equal(isTerritoryCoverage({ campaign }), false);
  assert.equal(
    isTerritoryCoverage({ campaign: { ...campaign, coverage: true } }),
    true
  );
  assert.equal(
    isTerritoryCoverage({
      completed: false,
      campaign: { ...campaign, coverage: true },
    }),
    false
  );
});
test('omitted notes preserve history while explicit blank notes clear it', () => {
  const saved = { note: 'Keep the gate closed' };
  assert.deepEqual({ ...saved, ...assignmentNoteUpdate() }, saved);
  assert.deepEqual(
    { ...saved, ...assignmentNoteUpdate('  ') },
    { note: undefined }
  );
  assert.deepEqual(assignmentNoteUpdate(' Updated\nnotes '), {
    note: 'Updated\nnotes',
  });
});
test('copying a note preserves both scopes without duplicate paragraphs', () => {
  assert.equal(
    appendNote('Gate is locked', ' Current draft '),
    'Gate is locked\n\nCurrent draft'
  );
  assert.equal(
    appendNote('Gate is locked\n\nCurrent draft', 'Current draft'),
    'Gate is locked\n\nCurrent draft'
  );
  assert.equal(appendNote('Gate is locked', ' '), 'Gate is locked');
});
