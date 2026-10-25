import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  assignmentIssues,
  olderOpenAssignments,
  parseHouseholds,
  startsBeforeOpen,
} from '@features/territories/assignment_issues';

const today = new Date(2026, 8, 27, 15, 30);

test('past dates in order have no issues', () => {
  assert.deepEqual(
    assignmentIssues(
      { assignedOn: '01.03.2026', returnedOn: '20.06.2026' },
      today
    ),
    []
  );
});

test('today is not the future, whatever the time', () => {
  assert.deepEqual(
    assignmentIssues(
      { assignedOn: '27.09.2026', returnedOn: '27.09.2026' },
      today
    ),
    []
  );
});

test('an assigned date after today', () => {
  assert.deepEqual(assignmentIssues({ assignedOn: '28.09.2026' }, today), [
    'assigned_future',
  ]);
});

test('a returned date after today', () => {
  assert.deepEqual(
    assignmentIssues(
      { assignedOn: '01.09.2026', returnedOn: '01.01.2027' },
      today
    ),
    ['returned_future']
  );
});

test('returned before it was assigned', () => {
  assert.deepEqual(
    assignmentIssues(
      { assignedOn: '10.05.2026', returnedOn: '09.05.2026' },
      today
    ),
    ['returned_before_assigned']
  );
});

test('several issues at once', () => {
  assert.deepEqual(
    assignmentIssues(
      { assignedOn: '10.12.2026', returnedOn: '01.12.2026' },
      today
    ),
    ['assigned_future', 'returned_future', 'returned_before_assigned']
  );
});

test('missing or unreadable dates are not flagged', () => {
  assert.deepEqual(assignmentIssues({ assignedOn: '' }, today), []);
  assert.deepEqual(
    assignmentIssues({ assignedOn: 'soon', returnedOn: '' }, today),
    []
  );
});

test('one open assignment has no older ones', () => {
  assert.deepEqual(
    olderOpenAssignments([
      { assignedOn: '01.03.2026', returnedOn: '20.06.2026' },
      { assignedOn: '01.07.2026' },
    ]),
    []
  );
});

test('two open assignments after a sync: the older one is flagged', () => {
  const anna = { assignedOn: '01.07.2026', publisher: 'Anna' };
  const carla = { assignedOn: '02.07.2026', publisher: 'Carla' };

  assert.deepEqual(olderOpenAssignments([carla, anna]), [anna]);
  assert.deepEqual(olderOpenAssignments([anna, carla]), [anna]);
});

test('on the same day the later entry counts as the newer one', () => {
  const first = { assignedOn: '01.07.2026', publisher: 'First' };
  const second = { assignedOn: '01.07.2026', publisher: 'Second' };

  assert.deepEqual(olderOpenAssignments([first, second]), [first]);
});

test('a new start before the open assignment would return it before it was assigned', () => {
  const assignments = [
    { assignedOn: '01.01.2026', returnedOn: '01.03.2026' },
    { assignedOn: '10.06.2026' },
  ];

  assert.equal(startsBeforeOpen(assignments, '09.06.2026'), true);
  assert.equal(startsBeforeOpen(assignments, '10.06.2026'), false);
  assert.equal(startsBeforeOpen(assignments, '01.07.2026'), false);
  assert.equal(startsBeforeOpen(assignments.slice(0, 1), '01.01.2025'), false);
});

test('households take 0, keep the old count when blank and refuse the rest', () => {
  assert.equal(parseHouseholds('0', 40), 0);
  assert.equal(parseHouseholds('35', 40), 35);
  assert.equal(parseHouseholds(' ', 40), 40);
  assert.equal(parseHouseholds('-3', 40), null);
  assert.equal(parseHouseholds('2.5', 40), null);
  assert.equal(parseHouseholds('abc', 40), null);
});
