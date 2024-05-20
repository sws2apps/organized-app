import { UpdateSpec } from 'dexie';
import appDb from '@db/appDb';
import { dbSpeakersCongregationsCreateLocal } from './speakers_congregations';
import { vistingSpeakerSchema } from './schema';
import { VisitingSpeakerBackupType, VisitingSpeakerType } from '@definition/visiting_speakers';
import { decryptData } from '@services/encryption';

export const dbVisitingSpeakersLocalCongSpeakerAdd = async () => {
  try {
    const settings = await appDb.app_settings.get(1);
    const cong_number = settings.cong_settings.cong_number;
    const congregations = await appDb.speakers_congregations.toArray();

    const congExist = congregations.find((record) => record.cong_data.cong_number.value === cong_number);

    if (!congExist) {
      await dbSpeakersCongregationsCreateLocal();
    }

    const congregationsNew = await appDb.speakers_congregations.toArray();
    const congLocal = congregationsNew.find((record) => record.cong_data.cong_number.value === cong_number);

    const newSpeaker = structuredClone(vistingSpeakerSchema);
    newSpeaker.person_uid = crypto.randomUUID();
    newSpeaker.speaker_data.cong_id = congLocal.id;

    await appDb.visiting_speakers.put(newSpeaker);
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
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

export const dbVisitingSpeakersUpdate = async (changes: UpdateSpec<VisitingSpeakerType>, person_uid: string) => {
  try {
    await appDb.visiting_speakers.update(person_uid, changes);
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
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

export const decryptVisitingSpeakers = (visiting_speakers: VisitingSpeakerBackupType[], masterKey) => {
  const result = visiting_speakers.map((speaker) => {
    const obj = {} as VisitingSpeakerType;

    obj.person_uid = decryptData(speaker.person_uid, masterKey);
    obj._deleted = JSON.parse(decryptData(speaker._deleted, masterKey));

    obj.speaker_data = {} as VisitingSpeakerType['speaker_data'];

    for (const [key, value] of Object.entries(speaker.speaker_data)) {
      obj.speaker_data[key] = JSON.parse(decryptData(value, masterKey));
    }

    return obj;
  });

  return result;
};

export const dbVisitingSpeakersUpdateRemote = async (newSpeakers: VisitingSpeakerType[], cong_id: string) => {
  const speakers = await appDb.visiting_speakers.toArray();

  const oldSpeakers = speakers.filter((record) => record.speaker_data.cong_id === cong_id);

  for await (const speaker of newSpeakers) {
    const speakerAdd = structuredClone(speaker);
    speakerAdd.speaker_data.cong_id = cong_id;

    await appDb.visiting_speakers.put(speakerAdd);
  }

  for await (const speaker of oldSpeakers) {
    const findSpeaker = newSpeakers.find((record) => record.person_uid === speaker.person_uid);

    if (!findSpeaker) {
      await appDb.visiting_speakers.delete(speaker.person_uid);
    }
  }
};

export const dbVisitingSpeakersClearRemote = async (cong_id: string) => {
  const speakers = await appDb.visiting_speakers.toArray();

  const oldSpeakers = speakers.filter((record) => record.speaker_data.cong_id === cong_id);

  for await (const speaker of oldSpeakers) {
    await appDb.visiting_speakers.delete(speaker.person_uid);
  }
};
