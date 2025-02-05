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
  try {
    const settings = await appDb.app_settings.get(1);
    const cong_number = settings.cong_settings.cong_number;
    const congregations = await appDb.speakers_congregations.toArray();

    const congExist = congregations.find(
      (record) => record.cong_data.cong_number.value === cong_number
    );

    if (!congExist) {
      await dbSpeakersCongregationsCreateLocal();
    }

    const congregationsNew = await appDb.speakers_congregations.toArray();
    const congLocal = congregationsNew.find(
      (record) => record.cong_data.cong_number.value === cong_number
    );

    const newSpeaker = structuredClone(vistingSpeakerSchema);
    newSpeaker.person_uid = crypto.randomUUID();
    newSpeaker.speaker_data.cong_id = congLocal.id;
    newSpeaker.speaker_data.local = {
      value: local,
      updatedAt: new Date().toISOString(),
    };

    await appDb.visiting_speakers.put(newSpeaker);
    await dbUpdateVisitingSpeakersMetadata();
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

export const dbVisitingSpeakersDelete = async (person_uid: string) => {
  try {
    const speaker = await appDb.visiting_speakers.get(person_uid);
    speaker._deleted = { value: true, updatedAt: new Date().toISOString() };
    await appDb.visiting_speakers.put(speaker);
    await dbUpdateVisitingSpeakersMetadata();
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

export const dbVisitingSpeakersUpdate = async (
  changes: UpdateSpec<VisitingSpeakerType>,
  person_uid: string
) => {
  try {
    // check if deleted speaker
    const speaker = changes.person_uid
      ? await appDb.visiting_speakers.get(changes.person_uid)
      : undefined;

    if (speaker) {
      // restore deleted
      speaker._deleted = { value: false, updatedAt: new Date().toISOString() };
      speaker.speaker_data.talks = [];

      // delete temp record
      const temp = await appDb.visiting_speakers.get(person_uid);
      temp._deleted = { value: true, updatedAt: new Date().toISOString() };

      await appDb.visiting_speakers.bulkPut([temp, speaker]);
    }

    if (!speaker) {
      await appDb.visiting_speakers.update(person_uid, changes);
    }

    await dbUpdateVisitingSpeakersMetadata();
  } catch (err) {
    console.error(err);
    throw new Error(err);
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
    console.error(err);
    throw new Error(err);
  }
};

export const decryptVisitingSpeakers = (
  visiting_speakers: VisitingSpeakerBackupType[],
  masterKey
) => {
  const result = visiting_speakers.map((speaker) => {
    const obj = {} as VisitingSpeakerType;

    obj.person_uid = JSON.parse(decryptData(speaker.person_uid, masterKey));
    obj._deleted = JSON.parse(decryptData(speaker._deleted, masterKey));

    obj.speaker_data = JSON.parse(
      decryptData(speaker.speaker_data, masterKey)
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

  const elligiblePersons = persons.filter((record) =>
    record.person_data.assignments.find(
      (assignment) => assignment.code === AssignmentCode.WM_Speaker
    )
  );

  // add outgoing speakers
  const localCong = congregations.find(
    (record) =>
      record.cong_data.cong_number.value === settings.cong_settings.cong_number
  );

  const speaker1 = structuredClone(vistingSpeakerSchema);
  speaker1.person_uid = elligiblePersons[0].person_uid;
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
  speaker2.person_uid = elligiblePersons[1].person_uid;
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
      record.cong_data.cong_number.value !== settings.cong_settings.cong_number
  );

  const speaker1Cong1 = structuredClone(vistingSpeakerSchema);
  speaker1Cong1.person_uid = crypto.randomUUID();
  speaker1Cong1._deleted = {
    value: false,
    updatedAt: new Date().toISOString(),
  };
  speaker1Cong1.speaker_data = {
    cong_id: incomingCongs.at(0).id,
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
    cong_id: incomingCongs.at(0).id,
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
    cong_id: incomingCongs.at(1).id,
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
    cong_id: incomingCongs.at(1).id,
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
