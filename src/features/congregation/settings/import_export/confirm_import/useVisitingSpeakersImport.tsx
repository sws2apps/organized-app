import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { updatedAtOverride } from '@utils/common';
import { SpeakersCongregationsType } from '@definition/speakers_congregations';
import appDb from '@db/appDb';

const useVisitingSpeakersImport = () => {
  const getVisitingSpeakers = async (speakers: VisitingSpeakerType[]) => {
    const result: VisitingSpeakerType[] = [];

    result.push(...speakers);

    const oldSpeakers = await appDb.visiting_speakers.toArray();

    for (const oldSpeaker of oldSpeakers) {
      const newSpeaker = speakers.find(
        (record) => record.person_uid === oldSpeaker.person_uid
      );

      if (!newSpeaker) {
        oldSpeaker._deleted = {
          value: true,
          updatedAt: new Date().toISOString(),
        };

        result.push(oldSpeaker);
      }
    }

    return result.map((record) => {
      const data = updatedAtOverride(record);
      return data;
    });
  };

  const getSpeakersCongregations = async (
    congregations: SpeakersCongregationsType[]
  ) => {
    const result: SpeakersCongregationsType[] = [];

    result.push(...congregations);

    const oldCongregations = await appDb.speakers_congregations.toArray();

    for (const oldCongregation of oldCongregations) {
      const newCongregation = congregations.find(
        (record) => record.id === oldCongregation.id
      );

      if (!newCongregation) {
        oldCongregation._deleted = {
          value: true,
          updatedAt: new Date().toISOString(),
        };

        result.push(oldCongregation);
      }
    }

    return result.map((record) => {
      const data = updatedAtOverride(record);
      return data;
    });
  };

  return { getVisitingSpeakers, getSpeakersCongregations };
};

export default useVisitingSpeakersImport;
