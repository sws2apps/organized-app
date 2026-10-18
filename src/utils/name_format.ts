import type { PersonType } from '@definition/person';
import {
  FullnameOption,
  NameFormatSelection,
  PrintNameContext,
  PrintNamePolicy,
  PrintNameRecord,
} from '@definition/settings';

// Context keys remain unique under the sync merger's existing `type` identity.
export const printNameRecordKey = (view: string, context: PrintNameContext) =>
  JSON.stringify([view, context]);

export const printNameRecordBelongsToView = (key: string, view: string) =>
  key === view ||
  (['schedule', 'publisher_card', 'group_list'] as const).some(
    (context) => key === printNameRecordKey(view, context)
  );

export const getPrintNameSelection = (
  records: PrintNameRecord[] | undefined,
  view: string,
  context: PrintNameContext
): NameFormatSelection => {
  const scoped = records?.find(
    (record) => record.type === printNameRecordKey(view, context)
  );
  // An explicit reset suppresses the legacy shared override as well.
  const record = scoped ?? records?.find((record) => record.type === view);
  return record && !record._deleted ? record.value : 'inherit';
};

export const resolvePrintNamePolicy = (
  selection: NameFormatSelection,
  appFormat: FullnameOption,
  displayNames: boolean
): PrintNamePolicy => ({
  format: typeof selection === 'number' ? selection : appFormat,
  displayName:
    selection === 'display' || (selection === 'inherit' && displayNames),
});

export const updatePrintNameRecords = (
  records: PrintNameRecord[] | undefined,
  view: string,
  context: PrintNameContext,
  selection: NameFormatSelection,
  updatedAt: string
): PrintNameRecord[] => {
  const result = structuredClone(records ?? []);
  const type = printNameRecordKey(view, context);
  const next: PrintNameRecord = {
    type,
    value:
      selection === 'inherit' ? FullnameOption.FIRST_BEFORE_LAST : selection,
    _deleted: selection === 'inherit',
    updatedAt,
  };
  const index = result.findIndex((record) => record.type === type);
  if (index === -1) result.push(next);
  else result[index] = next;
  return result;
};

export const samePersonName = (
  a: {
    person_firstname: { value: string };
    person_lastname: { value: string };
    person_middlename?: { value: string };
  },
  b: {
    person_firstname: { value: string };
    person_lastname: { value: string };
    person_middlename?: { value: string };
  }
) => {
  const normalize = (value = '') => value.trim().normalize('NFC').toLowerCase();
  return (
    normalize(a.person_firstname.value) ===
      normalize(b.person_firstname.value) &&
    normalize(a.person_lastname.value) === normalize(b.person_lastname.value) &&
    normalize(a.person_middlename?.value) ===
      normalize(b.person_middlename?.value)
  );
};

export const copyNameFields = (source?: {
  person_firstname: { value: string; updatedAt: string };
  person_lastname: { value: string; updatedAt: string };
  person_middlename?: { value: string; updatedAt: string };
}) => ({
  person_firstname: {
    ...(source?.person_firstname ?? { value: '', updatedAt: '' }),
  },
  person_middlename: {
    ...(source?.person_middlename ?? { value: '', updatedAt: '' }),
  },
  person_lastname: {
    ...(source?.person_lastname ?? { value: '', updatedAt: '' }),
  },
});

export const speakerNameKey = (
  congregation: string,
  first: string,
  last: string,
  middle = ''
) =>
  JSON.stringify([
    congregation,
    ...[first, middle, last].map((value) =>
      value.trim().normalize('NFC').toLowerCase()
    ),
  ]);

export const personAccountNames = (person?: PersonType) => ({
  user_firstname: person?.person_data.person_firstname.value ?? '',
  user_lastname: person?.person_data.person_lastname.value ?? '',
  user_middlename: person
    ? (person.person_data.person_middlename?.value ?? '')
    : undefined,
});
