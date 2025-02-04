import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { localSpeakersState } from '@states/visiting_speakers';
import { fullnameOptionState } from '@states/settings';
import { buildPersonFullname } from '@utils/common';
import { dbVisitingSpeakersLocalCongSpeakerAdd } from '@services/dexie/visiting_speakers';

const useSeakersLocal = () => {
  const localSpeakers = useRecoilValue(localSpeakersState);
  const fullnameOption = useRecoilValue(fullnameOptionState);

  const options = useMemo(() => {
    return localSpeakers.toSorted((a, b) => {
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

      return fullnameA.localeCompare(fullnameB);
    });
  }, [localSpeakers, fullnameOption]);

  const [speakers, setSpeakers] = useState(options);

  const handleSpeakerAdd = async () => {
    await dbVisitingSpeakersLocalCongSpeakerAdd(true);
  };

  useEffect(() => {
    setSpeakers((prev) => {
      const data = prev.filter((record) =>
        options.some((s) => s.person_uid === record.person_uid)
      );

      for (const speaker of options) {
        const index = data.findIndex(
          (record) => record.person_uid === speaker.person_uid
        );

        if (index !== -1) {
          data[index] = speaker;
        }

        if (index === -1) {
          data.push(speaker);
        }
      }

      return data;
    });
  }, [options]);

  return { speakers, handleSpeakerAdd };
};

export default useSeakersLocal;
