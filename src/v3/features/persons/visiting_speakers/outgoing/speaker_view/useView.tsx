import { VisitingSpeakerType } from '@definition/visiting_speakers';

const useView = (speaker: VisitingSpeakerType) => {
  const talks = speaker.talks
    .filter((record) => record._deleted === null)
    .map((record) => record.talk_number)
    .join(', ');

  return { talks };
};

export default useView;
