import assert from 'node:assert/strict';
import { test } from 'node:test';
import JSZip from 'jszip';
import Papa from 'papaparse';
import type { PersonType } from '@definition/person';
import type { S89DataType } from '@definition/schedules';
import { createS89Archive } from '@services/app/s89_export';
import { exportCsv, parseCsv } from '@utils/csv';
import { personsToCsv } from '@utils/persons_csv';
import {
  convertToDatabaseSpeaker,
  createEmptySpeaker,
  updateSpeakerFirstname,
  updateSpeakerMiddlename,
  updateSpeakerLastname,
} from '@utils/speakers';

const card = (id: string, student_name = 'S. Alex'): S89DataType => ({
  id,
  student_name,
  weekOf: '2026/10/19',
  assistant_name: '',
  assignment_date: '2026/10/21',
  part_number: '1',
  main_hall: true,
  aux_class_1: false,
});

test('individual S89 archives retain colliding names and repeated student assignments', async () => {
  const cards = [card('smith'), card('stewart'), card('smith')];
  cards[2].part_number = '2';
  const archive = await createS89Archive(
    cards,
    async (data) => new Blob([`${data.id}:${data.part_number}`])
  );
  const zip = await JSZip.loadAsync(await archive.arrayBuffer());
  const entries = Object.values(zip.files);
  assert.equal(entries.length, cards.length);
  assert.deepEqual(
    await Promise.all(entries.map((entry) => entry.async('string'))),
    ['smith:1', 'stewart:1', 'smith:2']
  );
  assert.ok(entries.every((entry) => !entry.dir));
});

test('S89 archive filenames preserve Unicode and cannot create paths or exceed filename limits', async () => {
  const cards = [
    card('unicode', 'María Élodie'),
    card('path', '../a\\b:"?*|<>\nTab\tName'),
    card('long', '😀'.repeat(200)),
    card('blank', ''),
  ];
  const renderedNames: string[] = [];
  const archive = await createS89Archive(cards, async (data) => {
    renderedNames.push(data.student_name);
    return new Blob([data.id]);
  });
  const zip = await JSZip.loadAsync(await archive.arrayBuffer());
  const filenames = Object.keys(zip.files);
  assert.equal(filenames.length, cards.length);
  assert.ok(filenames[0].includes('María_Élodie'));
  for (const filename of filenames) {
    assert.ok(!/[\\/:*?"<>|]/.test(filename));
    assert.ok(
      Array.from(filename).every((character) => character.codePointAt(0)! >= 32)
    );
    assert.ok(new TextEncoder().encode(filename).length <= 255);
    assert.ok(filename.endsWith('.pdf'));
  }
  assert.deepEqual(
    renderedNames,
    cards.map((data) => data.student_name)
  );
});

test('S89 render failures reject instead of returning a partial archive', async () => {
  await assert.rejects(
    createS89Archive([card('one'), card('two')], async (data) => {
      if (data.id === 'two') throw new Error('render failed');
      return new Blob(['one']);
    }),
    /render failed/
  );
});

const field = (value: string) => ({ value, updatedAt: '2026-10-18T00:00:00Z' });

test('person CSV cells are formula-safe and round trip every original character', () => {
  const values = [
    '=1+1',
    '+441234567890',
    '-123',
    '@name',
    '\tname',
    '\rname',
    '\nname',
    '   =1+1',
    '\uFEFF+1',
    "'=1+1",
    "'Original",
    "''Literal",
    "'",
    '',
    'María, "Grace"\nÉlodie',
    '0123',
    '國際名字',
  ];
  const persons = values.map(
    (value) =>
      ({
        person_data: {
          person_firstname: field(value),
          person_middlename: field(value),
          person_lastname: field(value),
          phone: field(value),
          email: field(value),
          address: field(value),
        },
      }) as PersonType
  );
  const csv = personsToCsv(persons);
  const raw = Papa.parse<string[]>(csv).data;
  for (const row of raw.slice(1)) {
    for (const value of row) {
      assert.ok(!/^[=+\-@\t\r\n]/.test(value));
      assert.ok(!/^\s+[=+\-@]/u.test(value));
    }
  }
  assert.ok(raw[1][1].startsWith("'="));
  assert.ok(raw[10][1].startsWith("''"));
  const parsed = parseCsv('\uFEFF' + csv);
  assert.deepEqual(parsed.errors, []);
  assert.equal(parsed.meta.fields?.length, 6);
  assert.equal(parsed.data.length, values.length);
  parsed.data.forEach((row, index) => {
    assert.deepEqual(Object.values(row), Array(6).fill(values[index]));
  });
});

test('speaker CSV labels, delimiters, names and international phones round trip through import decoding', () => {
  const headers = [
    'speaker.firstname',
    'speaker.middlename',
    'speaker.lastname',
    'speaker.phone',
  ];
  const labels = ['First name', 'Middle name', 'Last name', 'Phone'];
  const original = ['=Alex', "'María; Élodie", '@Smith', '+44 1234 567890'];
  const csv = exportCsv(headers, [original], { delimiter: ';', labels });
  const parsed = parseCsv('\uFEFF' + csv);
  assert.equal(parsed.meta.delimiter, ';');
  assert.deepEqual(parsed.meta.fields, headers);
  assert.deepEqual(Object.values(parsed.data[0]), labels);
  assert.deepEqual(Object.values(parsed.data[1]), original);
  assert.deepEqual(parseCsv(csv, 1).meta.fields, headers);
  const draft = createEmptySpeaker();
  const row = parsed.data[1];
  updateSpeakerFirstname(draft, row['speaker.firstname']);
  updateSpeakerMiddlename(draft, row['speaker.middlename']);
  updateSpeakerLastname(draft, row['speaker.lastname']);
  const restored = convertToDatabaseSpeaker(draft, 'congregation');
  assert.deepEqual(
    [
      restored.speaker_data.person_firstname.value,
      restored.speaker_data.person_middlename?.value,
      restored.speaker_data.person_lastname.value,
    ],
    original.slice(0, 3)
  );
});

test('legacy and unknown-version CSVs retain literal apostrophes; malformed marked rows report errors', () => {
  const legacy = Papa.unparse([{ 'personalInfo.middlename': "'=1+1" }]);
  assert.equal(parseCsv(legacy).data[0]['personalInfo.middlename'], "'=1+1");
  const unknown = Papa.unparse([
    {
      name: "'=1+1",
      _organized_csv_encoding: 'future-version',
    },
  ]);
  assert.equal(parseCsv(unknown).data[0].name, "'=1+1");
  const malformed =
    'name,_organized_csv_encoding\n"\'=1+1",apostrophe-v1,extra';
  assert.ok(
    parseCsv(malformed).errors.some((error) => error.code === 'TooManyFields')
  );
  assert.deepEqual(parseCsv(personsToCsv([])).data, []);
});
