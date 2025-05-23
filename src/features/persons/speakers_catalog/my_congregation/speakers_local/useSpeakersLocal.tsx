import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { localSpeakersState } from '@states/visiting_speakers';
import { dbVisitingSpeakersLocalCongSpeakerAdd } from '@services/dexie/visiting_speakers';
import { speakersSortByName } from '@services/app/visiting_speakers';

const useSeakersLocal = () => {
  const localSpeakers = useAtomValue(localSpeakersState);

  const options = useMemo(() => {
    return speakersSortByName(localSpeakers);
  }, [localSpeakers]);

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
