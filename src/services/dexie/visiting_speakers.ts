import { UpdateSpec } from 'dexie';
import { dbSpeakersCongregationsCreateLocal } from './speakers_congregations';
import { vistingSpeakerSchema } from './schema';
import {
  VisitingSpeakerBackupType,
  VisitingSpeakerType,
} from '@definition/visiting_speakers';
import { decryptData } from '@services/encryption';
import appDb from '@db/appDb';
import { AssignmentCode } from '@definition/assignment';
import { generateDisplayName } from '@utils/common';

const dbUpdateVisitingSpeakersMetadata = async () => {
  const metadata = await appDb.metadata.get(1);

  if (!metadata) return;

  metadata.metadata.visiting_speakers = {
    ...metadata.metadata.visiting_speakers,
    send_local: true,
  };

  await appDb.metadata.put(metadata);
};

export const dbVisitingSpeakersLocalCongSpeakerAdd = async (local: boolean) => {
  const settings = await appDb.app_settings.get(1);
  if (!settings) {
    throw new Error('App settings not found.');
  }
  try {
    const congName = settings.cong_settings.cong_name;

    const congregations = await appDb.speakers_congregations.toArray();

    const congExist = congregations.find(
      (record) => record.cong_data.cong_name.value === congName
    );

    if (!congExist) {
      await dbSpeakersCongregationsCreateLocal();
    }

    const congregationsNew = await appDb.speakers_congregations.toArray();

    // 2. Search for the exact ID again
    const congLocal = congregationsNew.find(
      (record) => record.cong_data.cong_name.value === congName
    );

    if (!congLocal) {
      throw new Error('Active own congregation not found in the database.');
    }

    const newSpeaker = structuredClone(vistingSpeakerSchema);
    newSpeaker.person_uid = crypto.randomUUID();
    const congId = congLocal.id;
    if (!congId) {
      throw new Error(
        'Local congregation record has no id — cannot assign speaker.cong_id.'
      );
    }
    newSpeaker.speaker_data.cong_id = congId;
    newSpeaker.speaker_data.local = {
      value: local,
      updatedAt: new Date().toISOString(),
    };

    await appDb.visiting_speakers.put(newSpeaker);
    await dbUpdateVisitingSpeakersMetadata();
  } catch (err) {
    console.error('[DB] dbVisitingSpeakersLocalCongSpeakerAdd failed:', err);
    throw err;
  }
};

export const dbVisitingSpeakersDelete = async (person_uid: string) => {
  try {
    const speaker = await appDb.visiting_speakers.get(person_uid);

    if (!speaker) {
      throw new Error(
        `Visiting speaker not found for person_uid: ${person_uid}`
      );
    }

    // Idempotent: skip the write if the record is already soft-deleted
    if (speaker._deleted.value) return;

    await appDb.visiting_speakers.update(person_uid, {
      _deleted: { value: true, updatedAt: new Date().toISOString() },
    });
    await dbUpdateVisitingSpeakersMetadata();
  } catch (err) {
    console.error('[DB] dbVisitingSpeakersDelete failed:', err);
    throw err;
  }
};

export const dbVisitingSpeakersUpdate = async (
  changes: UpdateSpec<VisitingSpeakerType>,
  person_uid: string
) => {
  try {
    // A deleted speaker is being restored: re-link it to the temp record's
    // `person_uid` so the UI keeps pointing at a single, consistent entry.
    const speaker = changes.person_uid
      ? await appDb.visiting_speakers.get(changes.person_uid)
      : undefined;

    if (speaker) {
      // Single shared timestamp keeps the restore + soft-delete coherent.
      const now = new Date().toISOString();

      // Restore the previously deleted speaker and reset its talks.
      speaker._deleted = { value: false, updatedAt: now };
      speaker.speaker_data.talks = [];

      // Soft-delete the temporary record that held the in-progress edits.
      const temp = await appDb.visiting_speakers.get(person_uid);
      if (!temp) {
        throw new Error(
          `Temp visiting speaker not found for person_uid: ${person_uid}`
        );
      }
      temp._deleted = { value: true, updatedAt: now };

      await appDb.transaction('rw', appDb.visiting_speakers, async () => {
        await appDb.visiting_speakers.bulkPut([temp, speaker]);
        await appDb.visiting_speakers.update(speaker.person_uid, changes);
      });
    } else {
      await appDb.visiting_speakers.update(person_uid, changes);
    }

    await dbUpdateVisitingSpeakersMetadata();
  } catch (err) {
    console.error('[DB] dbVisitingSpeakersUpdate failed:', err);
    throw err;
  }
};

export const dbVisitingSpeakersAdd = async (cong_id: string) => {
  try {
    const newSpeaker = structuredClone(vistingSpeakerSchema);
    newSpeaker.person_uid = crypto.randomUUID();
    newSpeaker.speaker_data.cong_id = cong_id;

    await appDb.visiting_speakers.put(newSpeaker);
    await dbUpdateVisitingSpeakersMetadata();
  } catch (err) {
    console.error('[DB] dbVisitingSpeakersAdd failed:', err);
    throw err;
  }
};

export const decryptVisitingSpeakers = (
  visiting_speakers: VisitingSpeakerBackupType[],
  masterKey: string
) => {
  const result = visiting_speakers.map((speaker) => {
    const obj = {} as VisitingSpeakerType;

    obj.person_uid = JSON.parse(
      decryptData(speaker.person_uid, masterKey, 'speaker_person_uid')
    );

    obj._deleted = JSON.parse(
      decryptData(speaker._deleted, masterKey, 'speaker_deleted')
    );

    obj.speaker_data = JSON.parse(
      decryptData(speaker.speaker_data, masterKey, 'speaker_data')
    ) as VisitingSpeakerType['speaker_data'];

    return obj;
  });

  return result;
};

export const dbVisitingSpeakersUpdateRemote = async (
  newSpeakers: VisitingSpeakerType[],
  cong_id: string
) => {
  const speakers = await appDb.visiting_speakers.toArray();

  const oldSpeakers = speakers.filter(
    (record) => record.speaker_data.cong_id === cong_id
  );

  for await (const speaker of newSpeakers) {
    const speakerAdd = structuredClone(speaker);
    speakerAdd.speaker_data.cong_id = cong_id;

    await appDb.visiting_speakers.put(speakerAdd);
    await dbUpdateVisitingSpeakersMetadata();
  }

  for await (const speaker of oldSpeakers) {
    const findSpeaker = newSpeakers.find(
      (record) => record.person_uid === speaker.person_uid
    );

    if (!findSpeaker) {
      await appDb.visiting_speakers.delete(speaker.person_uid);
      await dbUpdateVisitingSpeakersMetadata();
    }
  }
};

export const dbVisitingSpeakersClearRemote = async (cong_id: string) => {
  const speakers = await appDb.visiting_speakers.toArray();

  const oldSpeakers = speakers.filter(
    (record) => record.speaker_data.cong_id === cong_id
  );

  for await (const speaker of oldSpeakers) {
    await appDb.visiting_speakers.delete(speaker.person_uid);
    await dbUpdateVisitingSpeakersMetadata();
  }
};

export const dbVisitingSpeakersDummy = async () => {
  const settings = await appDb.app_settings.get(1);
  const congregations = await appDb.speakers_congregations.toArray();
  const persons = await appDb.persons.toArray();

  const elligiblePersons = persons.filter(
    (record) =>
      record.person_data.assignments
        .at(0)
        ?.values.includes(AssignmentCode.WM_Speaker) ?? false
  );

  // need at least two eligible WM speakers to generate dummy records
  if (elligiblePersons.length < 2) return;

  // add outgoing speakers
  const localCong = congregations.find(
    (record) =>
      record.cong_data.cong_name.value === settings?.cong_settings.cong_name
  );

  if (!localCong?.id) return;

  const speaker1 = structuredClone(vistingSpeakerSchema);
  speaker1.person_uid = elligiblePersons[0]!.person_uid;
  speaker1._deleted = { value: false, updatedAt: new Date().toISOString() };
  speaker1.speaker_data.cong_id = localCong.id;
  speaker1.speaker_data.talks = [
    {
      _deleted: false,
      talk_number: 6,
      talk_songs: [44, 131],
      updatedAt: new Date().toISOString(),
    },
    {
      _deleted: false,
      talk_number: 26,
      talk_songs: [20, 34, 99],
      updatedAt: new Date().toISOString(),
    },
  ];

  const speaker2 = structuredClone(vistingSpeakerSchema);
  speaker2.person_uid = elligiblePersons[1]!.person_uid;
  speaker2._deleted = { value: false, updatedAt: new Date().toISOString() };
  speaker2.speaker_data.cong_id = localCong.id;
  speaker2.speaker_data.talks = [
    {
      _deleted: false,
      talk_number: 36,
      talk_songs: [1, 144],
      updatedAt: new Date().toISOString(),
    },
    {
      _deleted: false,
      talk_number: 150,
      talk_songs: [45, 120],
      updatedAt: new Date().toISOString(),
    },
  ];

  await appDb.visiting_speakers.bulkAdd([speaker1, speaker2]);

  // add incoming speakers
  const incomingCongs = congregations.filter(
    (record) =>
      record.cong_data.cong_name.value !== settings?.cong_settings.cong_name
  );

  if (incomingCongs.length < 2) return;

  const incomingCong0 = incomingCongs[0]!;
  const incomingCong1 = incomingCongs[1]!;

  if (!incomingCong0.id || !incomingCong1.id) return;

  const speaker1Cong1 = structuredClone(vistingSpeakerSchema);
  speaker1Cong1.person_uid = crypto.randomUUID();
  speaker1Cong1._deleted = {
    value: false,
    updatedAt: new Date().toISOString(),
  };
  speaker1Cong1.speaker_data = {
    cong_id: incomingCong0.id,
    elder: { value: true, updatedAt: new Date().toISOString() },
    ministerial_servant: {
      value: false,
      updatedAt: new Date().toISOString(),
    },
    person_firstname: {
      value: 'Ribeiro',
      updatedAt: new Date().toISOString(),
    },
    person_lastname: {
      value: 'Gonzaga',
      updatedAt: new Date().toISOString(),
    },
    person_display_name: {
      value: generateDisplayName('Gonzaga', 'Ribeiro'),
      updatedAt: new Date().toISOString(),
    },
    person_email: {
      value: 'ribeiro-gonzaga@fakemail.com',
      updatedAt: new Date().toISOString(),
    },
    person_notes: { value: '', updatedAt: new Date().toISOString() },
    person_phone: {
      value: '+61 929-572-140',
      updatedAt: new Date().toISOString(),
    },
    local: { value: false, updatedAt: new Date().toISOString() },
    talks: [
      {
        _deleted: false,
        talk_number: 40,
        talk_songs: [8, 16],
        updatedAt: new Date().toISOString(),
      },
      {
        _deleted: false,
        talk_number: 77,
        talk_songs: [20, 34, 99],
        updatedAt: new Date().toISOString(),
      },
    ],
  };

  const speaker2Cong1 = structuredClone(vistingSpeakerSchema);
  speaker2Cong1.person_uid = crypto.randomUUID();
  speaker2Cong1._deleted = {
    value: false,
    updatedAt: new Date().toISOString(),
  };
  speaker2Cong1.speaker_data = {
    cong_id: incomingCong0.id,
    elder: { value: false, updatedAt: new Date().toISOString() },
    ministerial_servant: { value: true, updatedAt: new Date().toISOString() },
    person_firstname: {
      value: 'Konsta',
      updatedAt: new Date().toISOString(),
    },
    person_lastname: {
      value: 'Manninen',
      updatedAt: new Date().toISOString(),
    },
    person_display_name: {
      value: generateDisplayName('Manninen', 'Konsta'),
      updatedAt: new Date().toISOString(),
    },
    person_email: {
      value: 'konsta-manninen@fakemail.com',
      updatedAt: new Date().toISOString(),
    },
    person_notes: {
      value: 'Note about speaker',
      updatedAt: new Date().toISOString(),
    },
    person_phone: {
      value: '+92 378-326-3439',
      updatedAt: new Date().toISOString(),
    },
    local: { value: false, updatedAt: new Date().toISOString() },
    talks: [
      {
        _deleted: false,
        talk_number: 52,
        talk_songs: [123, 151],
        updatedAt: new Date().toISOString(),
      },
      {
        _deleted: false,
        talk_number: 85,
        talk_songs: [11, 38],
        updatedAt: new Date().toISOString(),
      },
    ],
  };

  const speaker1Cong2 = structuredClone(vistingSpeakerSchema);
  speaker1Cong2.person_uid = crypto.randomUUID();
  speaker1Cong2._deleted = {
    value: false,
    updatedAt: new Date().toISOString(),
  };
  speaker1Cong2.speaker_data = {
    cong_id: incomingCong1.id,
    elder: { value: true, updatedAt: new Date().toISOString() },
    ministerial_servant: {
      value: false,
      updatedAt: new Date().toISOString(),
    },
    person_firstname: {
      value: 'Gary',
      updatedAt: new Date().toISOString(),
    },
    person_lastname: {
      value: 'Simpson',
      updatedAt: new Date().toISOString(),
    },
    person_display_name: {
      value: generateDisplayName('Simpson', 'Gary'),
      updatedAt: new Date().toISOString(),
    },
    person_email: {
      value: 'gary-simpson@fakemail.com',
      updatedAt: new Date().toISOString(),
    },
    person_notes: { value: '', updatedAt: new Date().toISOString() },
    person_phone: {
      value: '+61 929-572-140',
      updatedAt: new Date().toISOString(),
    },
    local: { value: false, updatedAt: new Date().toISOString() },
    talks: [
      {
        _deleted: false,
        talk_number: 40,
        talk_songs: [8, 16],
        updatedAt: new Date().toISOString(),
      },
      {
        _deleted: false,
        talk_number: 77,
        talk_songs: [20, 34, 99],
        updatedAt: new Date().toISOString(),
      },
    ],
  };

  const speaker2Cong2 = structuredClone(vistingSpeakerSchema);
  speaker2Cong2.person_uid = crypto.randomUUID();
  speaker2Cong2._deleted = {
    value: false,
    updatedAt: new Date().toISOString(),
  };
  speaker2Cong2.speaker_data = {
    cong_id: incomingCong1.id,
    elder: { value: false, updatedAt: new Date().toISOString() },
    ministerial_servant: { value: true, updatedAt: new Date().toISOString() },
    person_firstname: {
      value: 'Sylas',
      updatedAt: new Date().toISOString(),
    },
    person_lastname: {
      value: 'Holmes',
      updatedAt: new Date().toISOString(),
    },
    person_display_name: {
      value: generateDisplayName('Holmes', 'Sylas'),
      updatedAt: new Date().toISOString(),
    },
    person_email: {
      value: 'sylas-holmes@fakemail.com',
      updatedAt: new Date().toISOString(),
    },
    person_notes: {
      value: 'Note about speaker',
      updatedAt: new Date().toISOString(),
    },
    person_phone: {
      value: '+92 378-326-3439',
      updatedAt: new Date().toISOString(),
    },
    local: { value: false, updatedAt: new Date().toISOString() },
    talks: [
      {
        _deleted: false,
        talk_number: 52,
        talk_songs: [123, 151],
        updatedAt: new Date().toISOString(),
      },
      {
        _deleted: false,
        talk_number: 85,
        talk_songs: [11, 38],
        updatedAt: new Date().toISOString(),
      },
    ],
  };

  await appDb.visiting_speakers.bulkAdd([
    speaker1Cong1,
    speaker2Cong1,
    speaker1Cong2,
    speaker2Cong2,
  ]);
};

export const dbVisitingSpeakersClear = async () => {
  const records = await appDb.visiting_speakers.toArray();

  if (records.length === 0) return;

  for (const record of records) {
    record._deleted = { value: true, updatedAt: new Date().toISOString() };
  }

  await appDb.visiting_speakers.bulkPut(records);
};
