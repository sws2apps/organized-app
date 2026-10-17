import { useAtomValue } from 'jotai';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { publicTalksLocaleState } from '@states/public_talks';

const useTalksSongs = (speaker: VisitingSpeakerType) => {
  const publicTalks = useAtomValue(publicTalksLocaleState);

  const talks = speaker.speaker_data.talks
    .filter((record) => record._deleted === false)
    .flatMap((record) => {
      const talk = publicTalks.find(
        (item) => item.talk_number === record.talk_number
      );

      if (!talk) return [];

      const songs = structuredClone(record.talk_songs).sort((a, b) =>
        a < b ? -1 : 1
      );

      return [{ talk, songs }];
    });

  return { talks };
};

export default useTalksSongs;
