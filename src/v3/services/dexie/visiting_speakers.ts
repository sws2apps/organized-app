import { UpdateSpec } from 'dexie';
import appDb from '@db/appDb';
import { dbSpeakersCongregationsCreateLocal } from './speakers_congregations';
import { vistingSpeakerSchema } from './schema';
import { VisitingSpeakerType } from '@definition/visiting_speakers';

export const dbVistingSpeakersLocalCongSpeakerAdd = async () => {
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

export const dbVistingSpeakersDelete = async (person_uid: string) => {
  try {
    const speaker = await appDb.visiting_speakers.get(person_uid);
    speaker._deleted = { value: true, updatedAt: new Date().toISOString() };
    await appDb.visiting_speakers.put(speaker);
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

export const dbVistingSpeakersUpdate = async (changes: UpdateSpec<VisitingSpeakerType>, person_uid: string) => {
  try {
    await appDb.visiting_speakers.update(person_uid, changes);
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

export const dbVistingSpeakersAdd = async (cong_id: string) => {
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
