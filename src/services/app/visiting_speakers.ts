import { FullnameOption } from '@definition/settings';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import { buildPersonFullname } from '@utils/common';

export const speakersSortByName = (
  speakers: VisitingSpeakerType[],
  fullnameOption: FullnameOption
) => {
  return speakers.toSorted((a, b) => {
    const fullnameA = buildPersonFullname(
      a.speaker_data.person_lastname.value,
      a.speaker_data.person_firstname.value,
      fullnameOption
    );

    const fullnameB = buildPersonFullname(
      b.speaker_data.person_lastname.value,
      b.speaker_data.person_firstname.value,
      fullnameOption
    );

    if (fullnameA === '') return 1;
    if (fullnameB === '') return -1;

    return fullnameA.localeCompare(fullnameB, undefined, {
      sensitivity: 'base',
    });
  });
};
