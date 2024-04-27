import { UpdateSpec } from 'dexie';
import appDb from '@db/appDb';
import { dbSpeakersCongregationsCreateLocal } from './speakers_congregations';
import { vistingSpeakerSchema } from './schema';
import { VisitingSpeakerType } from '@definition/visiting_speakers';

export const dbVistingSpeakersLocalCongSpeakerAdd = async () => {
  try {
    const settings = await appDb.app_settings.get(1);
    const cong_number = settings.cong_settings.cong_number;

    const congExist = await appDb.speakers_congregations.get(cong_number);

    if (!congExist) {
      await dbSpeakersCongregationsCreateLocal();
    }

    const newSpeaker = structuredClone(vistingSpeakerSchema);
    newSpeaker.person_uid = crypto.randomUUID();
    newSpeaker.cong_number = cong_number;

    await appDb.visiting_speakers.put(newSpeaker);
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

export const dbVistingSpeakersLocalCongSpeakerDelete = async (person_uid: string) => {
  try {
    const speaker = await appDb.visiting_speakers.get(person_uid);
    speaker._deleted = new Date().toISOString();
    await appDb.visiting_speakers.put(speaker);
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

export const dbVisitingSpeakersLocalCongSpeakerUpdate = async (
  changes: UpdateSpec<VisitingSpeakerType>,
  person_uid: string
) => {
  try {
    await appDb.visiting_speakers.update(person_uid, changes);
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
