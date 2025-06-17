import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { localSpeakersState } from '@states/visiting_speakers';
import { dbVisitingSpeakersLocalCongSpeakerAdd } from '@services/dexie/visiting_speakers';
import { speakersSortByName } from '@services/app/visiting_speakers';
import { personsActiveState, personsByViewState } from '@states/persons';

const useSeakersLocal = () => {
  const localSpeakers = useAtomValue(localSpeakersState);
  const persons = useAtomValue(personsActiveState);
  const personsByView = useAtomValue(personsByViewState);

  const options = useMemo(() => {
    const data = speakersSortByName(localSpeakers);

    return data.filter((record) => {
      const person = persons.some(
        (person) => person.person_uid === record.person_uid
      );

      if (!person) return true;

      const personInView = personsByView.some(
        (person) => person.person_uid === record.person_uid
      );

      return personInView;
    });
  }, [localSpeakers, personsByView, persons]);

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
