import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  FullnameOption as F,
  SettingsType,
  PrintNameContext,
} from '@definition/settings';
import { UserLoginResponseType } from '@definition/api';
import { PersonType } from '@definition/person';
import {
  buildPersonFullname,
  personGetDisplayName,
  speakerGetDisplayName,
} from '@utils/common';
import {
  copyNameFields,
  getPrintNameSelection,
  printNameRecordBelongsToView,
  resolvePrintNamePolicy,
  samePersonName,
  speakerNameKey,
  updatePrintNameRecords,
} from '@utils/name_format';
import { loginMiddleName } from '@utils/login_names';
import { createNameSettingsWriter } from '@services/app/name_settings_writer';
import {
  convertToDatabaseSpeaker,
  createEmptySpeaker,
  speakerNameCells,
  updateSpeakerFirstname,
  updateSpeakerMiddlename,
  updateSpeakerLastname,
} from '@utils/speakers';
import { personsToCsv } from '@utils/persons_csv';
import {
  changeFirstname,
  changeMiddlename,
  changeLastname,
} from '@utils/person';
import Papa from 'papaparse';
import { encryptObject, decryptObject } from '@services/encryption';

const field = (value: string, updatedAt = '2026-01-01') => ({
  value,
  updatedAt,
});
const names = (middle = 'Marie') => ({
  person_firstname: field('Alice'),
  person_middlename: field(middle),
  person_lastname: field('Jones'),
});
const settingsFixture = () =>
  ({
    user_settings: {
      id: 'alice',
      firstname: field('Alice'),
      lastname: field('Jones'),
      middlename: field('Marie'),
      user_local_uid: 'person-alice',
    },
    cong_settings: {
      cong_id: 'cong',
      fullname_option: [
        {
          type: 'main',
          value: F.FIRST_BEFORE_LAST,
          updatedAt: '',
          _deleted: false,
        },
      ],
      circuit_overseer: {
        firstname: field('Alice'),
        middlename: field(''),
        lastname: field('Jones'),
        display_name: field('J. Alice'),
      },
    },
  }) as unknown as SettingsType;
const responseFixture = () =>
  ({
    id: 'alice',
    app_settings: {
      user_settings: {
        firstname: field('Alice'),
        lastname: field('Jones'),
        user_local_uid: 'person-alice',
      },
      cong_settings: { id: 'cong' },
    },
  }) as UserLoginResponseType;

test('all six name formats; middle-name whitespace; empty parts; old names stay identical', () => {
  const expected = [
    'Alice Jones',
    'Jones Alice',
    'Alice Marie Jones',
    'Jones Alice Marie',
    'Jones, Alice',
    'Jones, Alice Marie',
  ];
  expected.forEach((name, index) =>
    assert.equal(
      buildPersonFullname('Jones', 'Alice', index + 1, ' Marie '),
      name
    )
  );
  for (const option of [1, 2, 3, 4, 5, 6]) {
    assert.equal(buildPersonFullname('', 'Alice', option, ''), 'Alice');
    assert.equal(buildPersonFullname('Jones', '', option, ''), 'Jones');
    assert.equal(buildPersonFullname('', '', option, ''), '');
  }
  for (const first of ['', 'Alice', ' Alice '])
    for (const last of ['', 'Jones', ' Jones '])
      for (const middle of [undefined, '', 'Marie', '  '])
        for (const option of [1, 2]) {
          const expected = !last
            ? first
            : !first
              ? last
              : option === 1
                ? `${first} ${last}`
                : `${last} ${first}`;
          assert.equal(
            buildPersonFullname(last, first, option, middle),
            expected
          );
        }
});

test('explicit print settings override screen abbreviations; inheritance preserves legacy policy', () => {
  assert.deepEqual(
    resolvePrintNamePolicy(F.FIRST_MIDDLE_LAST, F.LAST_BEFORE_FIRST, true),
    { format: F.FIRST_MIDDLE_LAST, displayName: false }
  );
  assert.deepEqual(
    resolvePrintNamePolicy('inherit', F.LAST_BEFORE_FIRST, true),
    { format: F.LAST_BEFORE_FIRST, displayName: true }
  );
  assert.equal(
    resolvePrintNamePolicy('inherit', F.FIRST_BEFORE_LAST, false).displayName,
    false
  );
  assert.equal(
    resolvePrintNamePolicy('display', F.FIRST_MIDDLE_LAST, false).displayName,
    true
  );
});

test('schedule, card, group and language-group preferences are independent and resettable', () => {
  let records = [
    {
      type: 'main',
      value: F.LAST_FIRST_MIDDLE,
      updatedAt: '1',
      _deleted: false,
    },
  ];
  assert.equal(
    getPrintNameSelection(records, 'main', 'schedule'),
    F.LAST_FIRST_MIDDLE
  );
  records = updatePrintNameRecords(
    records,
    'main',
    'schedule',
    F.FIRST_BEFORE_LAST,
    '2'
  );
  records = updatePrintNameRecords(
    records,
    'main',
    'publisher_card',
    F.FIRST_MIDDLE_LAST,
    '3'
  );
  assert.equal(
    getPrintNameSelection(records, 'main', 'schedule'),
    F.FIRST_BEFORE_LAST
  );
  assert.equal(
    getPrintNameSelection(records, 'main', 'publisher_card'),
    F.FIRST_MIDDLE_LAST
  );
  assert.equal(
    getPrintNameSelection(records, 'group', 'publisher_card'),
    'inherit'
  );
  records = updatePrintNameRecords(
    records,
    'main',
    'publisher_card',
    'inherit',
    '4'
  );
  assert.equal(
    getPrintNameSelection(records, 'main', 'publisher_card'),
    'inherit'
  );
  records = updatePrintNameRecords(
    records,
    'main',
    'publisher_card',
    F.LAST_COMMA_FIRST_MIDDLE,
    '5'
  );
  assert.equal(
    getPrintNameSelection(records, 'main', 'publisher_card'),
    F.LAST_COMMA_FIRST_MIDDLE
  );
  assert.equal(records.length, 3);
  assert.equal(
    records.filter((r) => printNameRecordBelongsToView(r.type, 'main')).length,
    3
  );
  assert.equal(
    records.some((r) => printNameRecordBelongsToView(r.type, 'group')),
    false
  );
});

test('authentication distinguishes omitted fields, explicit clears, stale data and different accounts', () => {
  const local = settingsFixture();
  const response = responseFixture();
  assert.equal(loginMiddleName(local, response, '2026-05-01').value, 'Marie');
  response.app_settings.user_settings.middlename = field('', '2026-02-01');
  assert.equal(loginMiddleName(local, response, '2026-05-01').value, '');
  response.app_settings.user_settings.middlename = field('', '2025-01-01');
  assert.equal(loginMiddleName(local, response, '2026-05-01').value, 'Marie');
  response.id = 'bob';
  delete response.app_settings.user_settings.middlename;
  assert.equal(loginMiddleName(local, response, '2026-05-01').value, '');
  delete local.user_settings.id;
  response.id = 'alice';
  assert.equal(loginMiddleName(local, response, '2026-05-01').value, 'Marie');
  response.app_settings.cong_settings!.id = 'different';
  assert.equal(loginMiddleName(local, response, '2026-05-01').value, '');
});

test('all speaker name parts survive projections and fall back safely on legacy records', () => {
  const source = names();
  const copy = copyNameFields(source);
  assert.equal(copy.person_middlename.value, 'Marie');
  copy.person_middlename.value = 'Changed';
  assert.equal(source.person_middlename.value, 'Marie');
  assert.equal(
    copyNameFields({
      person_firstname: field('Alice'),
      person_lastname: field('Jones'),
    }).person_middlename.value,
    ''
  );
  assert.equal(copyNameFields().person_firstname.value, '');
  const speaker = convertToDatabaseSpeaker(
    {
      ...createEmptySpeaker(),
      firstname: 'Alice',
      middlename: 'Marie',
      lastname: 'Jones',
    },
    'cong'
  );
  assert.equal(
    speakerGetDisplayName(speaker, false, F.FIRST_MIDDLE_LAST),
    'Alice Marie Jones'
  );
  const person = {
    person_data: {
      ...copyNameFields(speaker.speaker_data),
      person_display_name: field(''),
    },
  } as PersonType;
  assert.equal(
    personGetDisplayName(person, true, F.FIRST_MIDDLE_LAST),
    'Alice Marie Jones'
  );
});

test('middle names distinguish people and speaker duplicate identities', () => {
  assert.equal(samePersonName(names('Anne'), names('Marie')), false);
  assert.equal(samePersonName(names(' Marie '), names('marie')), true);
  const legacy = {
    person_firstname: field('Alice'),
    person_lastname: field('Jones'),
  };
  assert.equal(samePersonName(legacy, names('')), true);
  assert.notEqual(
    speakerNameKey('cong', 'Alice', 'Jones', 'Marie'),
    speakerNameKey('cong', 'Alice', 'Jones', 'Anne')
  );
  assert.notEqual(
    speakerNameKey('cong', 'a|b', 'c'),
    speakerNameKey('cong', 'a', 'b|c')
  );
});

test('speaker CSV names round trip through production import setters and database conversion', () => {
  const original = convertToDatabaseSpeaker(
    {
      ...createEmptySpeaker(),
      firstname: 'Alice',
      middlename: 'María, "Grace"',
      lastname: 'Jones',
    },
    'cong'
  );
  const csv = Papa.unparse([speakerNameCells(original)]);
  const row = Papa.parse<Record<string, string>>(csv, { header: true }).data[0];
  const incoming = createEmptySpeaker();
  updateSpeakerFirstname(incoming, row['speaker.firstname']);
  updateSpeakerMiddlename(incoming, row['speaker.middlename']);
  updateSpeakerLastname(incoming, row['speaker.lastname']);
  assert.deepEqual(
    speakerNameCells(convertToDatabaseSpeaker(incoming, 'cong')),
    speakerNameCells(original)
  );
});

test('person CSV names round trip with machine headers, Unicode and delimiters', () => {
  const person = {
    person_data: {
      ...names('María, "Grace"'),
      person_display_name: field(''),
      phone: field('0123'),
      email: field('a@example.test'),
      address: field('Line 1\nLine 2'),
    },
  } as PersonType;
  const row = Papa.parse<Record<string, string>>(personsToCsv([person]), {
    header: true,
  }).data[0];
  const restored = structuredClone(person);
  restored.person_data.person_middlename = field('');
  changeFirstname(restored, row['personalInfo.firstname']);
  changeMiddlename(restored, row['personalInfo.middlename']);
  changeLastname(restored, row['personalInfo.lastname']);
  assert.equal(
    restored.person_data.person_middlename.value,
    person.person_data.person_middlename!.value
  );
  assert.equal(row['contactInfo.phoneNumber'], '0123');
  assert.equal(row['contactInfo.address'], 'Line 1\nLine 2');
});

const memoryWriter = () => {
  const state = settingsFixture();
  let fail = false;
  const writer = createNameSettingsWriter(
    async () => structuredClone(state),
    async (changes) => {
      await Promise.resolve();
      if (fail) {
        fail = false;
        throw new Error('storage failure');
      }
      for (const [path, value] of Object.entries(changes)) {
        const keys = path.split('.');
        let object: any = state;
        for (const key of keys.slice(0, -1)) object = object[key];
        object[keys.at(-1)!] = value;
      }
    }
  );
  return {
    state,
    writer,
    failNext: () => {
      fail = true;
    },
  };
};

test('rapid print choices do not lose unrelated contexts', async () => {
  const { state, writer } = memoryWriter();
  await Promise.all(
    (['schedule', 'publisher_card', 'group_list'] as PrintNameContext[]).map(
      (context, index) =>
        writer.saveNameFormat({
          field: 'print_fullname_option',
          view: 'main',
          context,
          selection: index + 1,
        })
    )
  );
  assert.equal(state.cong_settings.print_fullname_option!.length, 3);
});

test('CO input writes immediately without keyboard events; queued edits survive caller teardown', async () => {
  const { state, writer } = memoryWriter();
  await Promise.all([
    writer.saveCOName('firstname', 'Bob'),
    writer.saveCOName('middlename', 'Robert'),
    writer.saveCOName('lastname', 'Smith'),
  ]);
  assert.equal(
    state.cong_settings.circuit_overseer.middlename!.value,
    'Robert'
  );
  assert.equal(
    state.cong_settings.circuit_overseer.display_name.value,
    'S. Bob'
  );
});

test('a failed write rejects visibly but does not prevent later saves', async () => {
  const { state, writer, failNext } = memoryWriter();
  failNext();
  await assert.rejects(
    writer.saveCOName('middlename', 'Marie'),
    /storage failure/
  );
  await writer.saveCOName('middlename', 'Grace');
  assert.equal(state.cong_settings.circuit_overseer.middlename!.value, 'Grace');
});

test('middle names and context-specific print settings survive encrypted round trips', () => {
  const settings = settingsFixture();
  settings.cong_settings.print_fullname_option = updatePrintNameRecords(
    undefined,
    'main',
    'publisher_card',
    F.FIRST_MIDDLE_LAST,
    '2026'
  );
  for (const [table, original] of [
    ['persons', { person_data: names() }],
    ['app_settings', settings],
    ['visiting_speakers', { speaker_data: names() }],
  ] as const) {
    const data = structuredClone(original);
    encryptObject({
      data,
      table,
      accessCode: 'test-shared',
      masterKey: 'test-private',
    });
    decryptObject({
      data,
      table,
      accessCode: 'test-shared',
      masterKey: 'test-private',
    });
    assert.deepEqual(data, original);
  }
});

test('account creation includes middle names and distinguishes an unlinked account from a blank middle name', async () => {
  const { personAccountNames } = await import('@utils/name_format');
  const person = { person_data: names('María Jean') } as PersonType;
  assert.deepEqual(personAccountNames(person), {
    user_firstname: 'Alice',
    user_lastname: 'Jones',
    user_middlename: 'María Jean',
  });
  delete person.person_data.person_middlename;
  assert.equal(personAccountNames(person).user_middlename, '');
  assert.equal(personAccountNames().user_middlename, undefined);
});

test('relinking the same account cannot retain the previous person middle name', () => {
  const local = settingsFixture();
  const response = responseFixture();
  response.app_settings.user_settings.user_local_uid = 'different-person';
  assert.equal(loginMiddleName(local, response, 'now').value, '');
  response.app_settings.user_settings.middlename = field(
    'New person',
    '2020-01-01'
  );
  assert.equal(loginMiddleName(local, response, 'now').value, 'New person');
});

test('account names use all six selected formats and accept legacy profiles', async () => {
  const { accountProfileFullname } = await import('@utils/name_format');
  const profile = {
    firstname: field('Alexandria'),
    middlename: field('María Élodie'),
    lastname: field('Westhuizen'),
  } as import('@definition/api').CongregationUserType['profile'];
  for (const format of [
    F.FIRST_BEFORE_LAST,
    F.LAST_BEFORE_FIRST,
    F.FIRST_MIDDLE_LAST,
    F.LAST_FIRST_MIDDLE,
    F.LAST_COMMA_FIRST,
    F.LAST_COMMA_FIRST_MIDDLE,
  ]) {
    assert.equal(
      accountProfileFullname(profile, format),
      buildPersonFullname('Westhuizen', 'Alexandria', format, 'María Élodie')
    );
  }
  assert.equal(
    accountProfileFullname(profile, F.FIRST_MIDDLE_LAST),
    'Alexandria María Élodie Westhuizen'
  );
  delete profile.middlename;
  assert.equal(
    accountProfileFullname(profile, F.LAST_COMMA_FIRST_MIDDLE),
    'Westhuizen, Alexandria'
  );
});
