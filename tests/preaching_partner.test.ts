import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createEvent } from 'ics';
import {
  PreachingPartnerMinistryType,
  PreachingPartnerRequestType,
} from '../src/definition/preaching_partner';
import { applyPartnerMutation } from '../src/services/app/preaching_partner_actions';
import {
  partnerCalendarEvent,
  partnerDateIsValid,
  partnerRequestIsValid,
} from '../src/utils/preaching_partner';

const request = (
  id = 'request',
  owner = 'alice'
): PreachingPartnerRequestType => ({
  request_uid: id,
  request_data: {
    _deleted: false,
    updatedAt: '2026-01-01T00:00:00.000Z',
    person_uid: owner,
    date: '2099/12/31',
    flexible: true,
    type: PreachingPartnerMinistryType.Flexible,
    comment: '  A demo  ',
  },
});
const people = ['alice', 'bob', 'carol'];

test('validates dates, required times, and strictly increasing time ranges', () => {
  assert.equal(partnerDateIsValid('2028/02/29'), true);
  for (const date of ['', '2026/02/29', '2026/13/01', '2026/1/1'])
    assert.equal(partnerDateIsValid(date), false);
  const value = request();
  assert.equal(partnerRequestIsValid(value, '2100/01/01'), false);
  value.request_data.flexible = false;
  assert.equal(partnerRequestIsValid(value), false);
  value.request_data.start = '09:00';
  assert.equal(partnerRequestIsValid(value), true);
  for (const end of ['08:00', '09:00', '25:00', '10:99']) {
    value.request_data.end = end;
    assert.equal(partnerRequestIsValid(value), false);
  }
  value.request_data.end = '10:00';
  assert.equal(partnerRequestIsValid(value), true);
});

test('all-day calendar end rolls across months, years and leap days', () => {
  for (const [date, expected] of [
    ['2026/01/31', 'DTEND;VALUE=DATE:20260201'],
    ['2028/02/29', 'DTEND;VALUE=DATE:20280301'],
    ['2099/12/31', 'DTEND;VALUE=DATE:21000101'],
  ]) {
    const value = request();
    value.request_data.date = date;
    const event = createEvent(partnerCalendarEvent(value, 'Demo'));
    assert.equal(event.error, null);
    assert.ok(event.value?.includes(expected));
    assert.ok(event.value?.includes('UID:request'));
  }
});

test('timed calendars preserve local input and support an optional end', () => {
  const value = request();
  Object.assign(value.request_data, { flexible: false, start: '23:30' });
  const event = partnerCalendarEvent(value, 'Demo');
  assert.deepEqual(event.start, [2099, 12, 31, 23, 30]);
  assert.equal(createEvent(event).error, null);
  Object.assign(value.request_data, { start: '09:30', end: '10:30' });
  assert.equal(createEvent(partnerCalendarEvent(value, 'Demo')).error, null);
});

test('creation rejects missing, inactive, or impersonated identities', () => {
  const value = request();
  for (const actor of ['', 'missing', 'bob'])
    assert.throws(() =>
      applyPartnerMutation(
        [],
        { action: 'create', request: value },
        actor,
        people
      )
    );
  const created = applyPartnerMutation(
    [],
    { action: 'create', request: value },
    'alice',
    people
  )[0];
  assert.equal(created.request_data.comment, 'A demo');
  assert.throws(() =>
    applyPartnerMutation(
      [created],
      { action: 'create', request: value },
      'alice',
      people
    )
  );
});

test('joining only withdraws explicitly selected, still-open own requests for that day', () => {
  const target = request();
  const own = request('own', 'bob');
  const arranged = request('arranged', 'bob');
  arranged.request_data.partner_uid = 'carol';
  const otherDay = request('other-day', 'bob');
  otherDay.request_data.date = '2099/12/30';
  const records = [target, own, arranged, otherDay];
  assert.equal(
    applyPartnerMutation(
      records,
      { action: 'join', request: target },
      'bob',
      people
    ).length,
    1
  );
  const changes = applyPartnerMutation(
    records,
    {
      action: 'join',
      request: target,
      withdrawRequestIds: records.map((r) => r.request_uid),
    },
    'bob',
    people
  );
  assert.equal(changes.length, 2);
  assert.equal(changes[0].request_data.partner_uid, 'bob');
  assert.equal(changes[1].request_uid, 'own');
  assert.equal(changes[1].request_data._deleted, true);
  assert.equal(target.request_data.partner_uid, undefined);
  assert.equal(own.request_data._deleted, false);
});

test('stale joins, edits, deletes and cancellations cannot overwrite newer data', () => {
  const original = request();
  const joined = applyPartnerMutation(
    [original],
    { action: 'join', request: original },
    'bob',
    people
  )[0];
  for (const action of ['join', 'edit', 'delete', 'cancel'] as const)
    assert.throws(
      () =>
        applyPartnerMutation(
          [joined],
          { action, request: original },
          'alice',
          people
        ),
      /tr_partnerRequestChanged/
    );
  assert.throws(() =>
    applyPartnerMutation(
      [joined],
      { action: 'join', request: joined },
      'carol',
      people
    )
  );
  assert.throws(() =>
    applyPartnerMutation(
      [joined],
      { action: 'edit', request: joined },
      'alice',
      people
    )
  );
});

test('only the owner or current partner can cancel, reopening the request', () => {
  const original = request();
  original.request_data.partner_uid = 'bob';
  original.request_data.arranged_at = original.request_data.updatedAt;
  assert.throws(() =>
    applyPartnerMutation(
      [original],
      { action: 'cancel', request: original },
      'carol',
      people
    )
  );
  for (const actor of ['alice', 'bob']) {
    const result = applyPartnerMutation(
      [original],
      { action: 'cancel', request: original },
      actor,
      people
    )[0];
    assert.equal(result.request_data.partner_uid, undefined);
    assert.equal(result.request_data.arranged_at, undefined);
    assert.equal(result.request_data._deleted, false);
  }
});

test('deleted, expired and removed-owner requests cannot be joined', () => {
  const original = request();
  const deleted = structuredClone(original);
  deleted.request_data._deleted = true;
  assert.throws(() =>
    applyPartnerMutation(
      [deleted],
      { action: 'join', request: deleted },
      'bob',
      people
    )
  );
  const past = structuredClone(original);
  past.request_data.date = '2000/01/01';
  assert.throws(() =>
    applyPartnerMutation(
      [past],
      { action: 'join', request: past },
      'bob',
      people
    )
  );
  assert.throws(() =>
    applyPartnerMutation(
      [original],
      { action: 'join', request: original },
      'bob',
      ['bob']
    )
  );
});

test('editing only changes editable fields and always advances the revision', () => {
  const original = request();
  const draft = structuredClone(original);
  Object.assign(draft.request_data, {
    comment: 'Changed',
    person_uid: 'carol',
    partner_uid: 'bob',
    _deleted: true,
  });
  const result = applyPartnerMutation(
    [original],
    { action: 'edit', request: draft },
    'alice',
    people,
    original.request_data.updatedAt
  )[0];
  assert.equal(result.request_data.person_uid, 'alice');
  assert.equal(result.request_data.partner_uid, undefined);
  assert.equal(result.request_data._deleted, false);
  assert.equal(result.request_data.comment, 'Changed');
  assert.notEqual(
    result.request_data.updatedAt,
    original.request_data.updatedAt
  );
});
