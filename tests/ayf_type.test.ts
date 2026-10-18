import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AssignmentCode, AssignmentType } from '@definition/assignment';
import {
  buildAYFLookup,
  getAssType,
  getAYFAssignmentTypes,
  matchAYFType,
} from '@services/app/ayf_type';

const assignments: AssignmentType[] = [
  {
    code: AssignmentCode.MM_AssistantOnly,
    assignment_type_name: { E: 'Assistant only', S: 'Solo asistente' },
    type: 'ayf',
    assignable: true,
    maleOnly: true,
  },
  {
    code: AssignmentCode.MM_Discussion,
    assignment_type_name: { E: 'Discussion', S: 'Análisis con el auditorio' },
    type: 'ayf',
    assignable: true,
    maleOnly: true,
  },
  {
    code: AssignmentCode.MM_StartingConversation,
    assignment_type_name: {
      E: 'Starting a Conversation',
      S: 'Empiece conversaciones',
    },
    type: 'ayf',
    assignable: true,
    maleOnly: false,
  },
];

const spanishLookup = buildAYFLookup(getAYFAssignmentTypes(assignments, 's'));
const week = '2026/11/02';

test('distinguishes an unknown label from a recognized Discussion', () => {
  for (const label of [
    undefined,
    null,
    '',
    '   ',
    '\u200B',
    '???',
    'Unknown',
  ]) {
    assert.equal(matchAYFType(spanishLookup, label, week), undefined);
  }
  assert.equal(
    matchAYFType(spanishLookup, 'Análisis con el auditorio', week),
    AssignmentCode.MM_Discussion
  );
  assert.equal(
    getAssType(spanishLookup, 'Unknown', week),
    AssignmentCode.MM_Discussion
  );
});

test('recognizes assistant-only and workbook aliases in the source language', () => {
  assert.equal(
    matchAYFType(spanishLookup, 'Solo asistente', week),
    AssignmentCode.MM_AssistantOnly
  );
  for (const label of ['Empiece conversaciones', 'Empecemos conversaciones']) {
    assert.equal(
      matchAYFType(spanishLookup, label, week),
      AssignmentCode.MM_StartingConversation
    );
  }
});

test('normalizes spacing, case, punctuation and parenthetical notes', () => {
  for (const label of [
    '\u200BSOLO ASISTENTE\u200B',
    'Solo   asistente (5 min.)',
    'Solo asistente: ejercicio',
  ]) {
    assert.equal(
      matchAYFType(spanishLookup, label, week),
      AssignmentCode.MM_AssistantOnly
    );
  }
});

test('uses the longest recognized prefix', () => {
  const lookup = buildAYFLookup([
    { label: 'Discussion', value: AssignmentCode.MM_Discussion },
    {
      label: 'Discussion with an assistant',
      value: AssignmentCode.MM_AssistantOnly,
    },
  ]);
  assert.equal(
    matchAYFType(lookup, 'Discussion with an assistant: example', week),
    AssignmentCode.MM_AssistantOnly
  );
});

test('splits translation variations and retains the English catalog fallback', () => {
  const lookup = buildAYFLookup(
    getAYFAssignmentTypes(
      [
        {
          ...assignments[0],
          assignment_type_name: { E: 'Assistant only|Another label' },
        },
      ],
      'ZZ'
    )
  );
  assert.equal(
    matchAYFType(lookup, 'Another label', week),
    AssignmentCode.MM_AssistantOnly
  );
  assert.equal(
    matchAYFType(lookup, 'Assistant only', week),
    AssignmentCode.MM_AssistantOnly
  );
});

test('keeps matching isolated between source languages', () => {
  const englishLookup = buildAYFLookup(getAYFAssignmentTypes(assignments, 'E'));
  assert.equal(matchAYFType(englishLookup, 'Solo asistente', week), undefined);
  assert.equal(matchAYFType(spanishLookup, 'Assistant only', week), undefined);
  assert.equal(
    matchAYFType(englishLookup, 'Assistant only', week),
    AssignmentCode.MM_AssistantOnly
  );
});

test('remaps legacy codes only from 2024 onward', () => {
  for (const [previous, current] of [
    [101, 123],
    [102, 124],
    [103, 125],
  ]) {
    const lookup = buildAYFLookup([{ label: 'Legacy', value: previous }]);
    assert.equal(getAssType(lookup, 'Legacy', '2023/12/25'), previous);
    assert.equal(getAssType(lookup, 'Legacy', '2024/01/01'), current);
  }
});

test('an empty catalog never claims an unknown label is Discussion', () => {
  assert.equal(matchAYFType(buildAYFLookup([]), 'Discussion', week), undefined);
});
