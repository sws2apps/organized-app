import { useAtomValue } from 'jotai';
import { fullnameOptionState } from '@states/settings';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { buildPersonFullname } from '@utils/common';
import { dbVisitingSpeakersDelete } from '@services/dexie/visiting_speakers';

const useEditRow = (speaker: VisitingSpeakerType) => {
  const fullnameOption = useAtomValue(fullnameOptionState);

  const name = buildPersonFullname(
    speaker.speaker_data.person_lastname.value,
    speaker.speaker_data.person_firstname.value,
    fullnameOption
  );

  const talks = speaker.speaker_data.talks
    .filter((record) => record._deleted === false)
    .map((record) => record.talk_number)
    .join(', ');

  const handleDeleteSpeaker = async () => {
    await dbVisitingSpeakersDelete(speaker.person_uid);
  };

  return { name, talks, handleDeleteSpeaker };
};

export default useEditRow;
