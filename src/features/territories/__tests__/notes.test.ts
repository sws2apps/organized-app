import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Territory, TerritoryAssignment } from '@definition/territory';
import {
  appendNote,
  hasNewNote,
  latestReturnNote,
  noteLine,
} from '@features/territories/notes';

const assignment = (
  id: string,
  publisher: string,
  returnedOn: string | undefined,
  note?: string
) =>
  ({
    id,
    publisher,
    assignedOn: '01.01.2025',
    returnedOn,
    note,
  }) as TerritoryAssignment;

const assignments = [
  assignment('a', 'Peter Novak', '03.03.2025', 'Many dogs'),
  assignment('b', 'Anna Weber', '10.11.2025', '5 Russian-speaking households'),
  assignment('c', 'Julia Brandt', '20.01.2026', '   '),
  assignment('d', 'Mike Wallenter', '15.02.2026'),
  assignment('e', 'Lena Koch', undefined, 'Not returned yet'),
];

test('the newest return that carries a note, later returns without one aside', () => {
  assert.equal(latestReturnNote(assignments)?.id, 'b');
});

test('nothing without a noted return', () => {
  assert.equal(latestReturnNote([assignments[3], assignments[4]]), undefined);
  assert.equal(latestReturnNote([]), undefined);
});

test('a note reads on one line', () => {
  assert.equal(
    noteLine(' 5 Russian\n\n3 Ukrainian \n'),
    '5 Russian · 3 Ukrainian'
  );
  assert.equal(noteLine('one line'), 'one line');
});

test('a finding joins the notes a blank line apart', () => {
  assert.equal(
    appendNote('Gate code 1234', ' Many dogs '),
    'Gate code 1234\n\nMany dogs'
  );
  assert.equal(appendNote(undefined, 'Many dogs'), 'Many dogs');
  assert.equal(appendNote('  ', 'Many dogs'), 'Many dogs');
});

test('a new note is a flagged territory whose last return brought one', () => {
  const territory = (reviewNeeded: boolean, list: TerritoryAssignment[]) =>
    ({ reviewNeeded, assignments: list }) as Territory;

  assert.equal(hasNewNote(territory(true, assignments)), true);
  assert.equal(hasNewNote(territory(false, assignments)), false);
  assert.equal(hasNewNote(territory(true, [assignments[3]])), false);
});

test('single-line notes collapse CRLF and blank lines without changing inline spacing', () => {
  assert.equal(
    noteLine('  Front  entrance  \r\n \t\n  Side gate  '),
    'Front  entrance · Side gate'
  );
  assert.equal(noteLine(' '.repeat(100000) + '\nGate'), 'Gate');
});
