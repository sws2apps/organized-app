import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  publicTalksSearchKeyState,
  publicTalksState,
} from '@states/public_talks';
import { setPublicTalksSearchKey } from '@services/recoil/publicTalks';
import { assignmentsHistoryState } from '@states/schedules';
import { TalkItemType } from './index.types';
import { personsAllState } from '@states/persons';
import { personGetDisplayName, speakerGetDisplayName } from '@utils/common';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
} from '@states/settings';
import { visitingSpeakersActiveState } from '@states/visiting_speakers';

const usePublicTalks = () => {
  const talksList = useRecoilValue(publicTalksState);
  const txtSearch = useRecoilValue(publicTalksSearchKeyState);
  const assignmentsHistory = useRecoilValue(assignmentsHistoryState);
  const persons = useRecoilValue(personsAllState);
  const useDisplayName = useRecoilValue(displayNameMeetingsEnableState);
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const speakers = useRecoilValue(visitingSpeakersActiveState);

  const [isExpandAll, setIsExpandAll] = useState(false);
  const [labelSearch, setLabelSearch] = useState('tr_countPublicTalks');

  const talks = useMemo(() => {
    const results: TalkItemType[] = [];

    for (const talk of talksList) {
      const history = assignmentsHistory.filter(
        (record) => record.assignment.public_talk === talk.talk_number
      );

      const personsFormatted = history.map((person) => {
        let speakerName = '';

        const findPerson = persons.find(
          (record) => record.person_uid === person.assignment.person
        );

        if (findPerson) {
          speakerName = findPerson
            ? personGetDisplayName(findPerson, useDisplayName, fullnameOption)
            : '';
        }

        const findSpeaker = speakers.find(
          (record) => record.person_uid === person.assignment.person
        );

        if (findSpeaker) {
          speakerName = findSpeaker
            ? `${speakerGetDisplayName(
                findSpeaker,
                useDisplayName,
                fullnameOption
              )} (*)`
            : '';
        }

        return {
          date: person.weekOf,
          person: speakerName,
        };
      });

      if (
        talk.talk_title.toLowerCase().includes(txtSearch.toLowerCase()) ||
        personsFormatted.find((record) =>
          record.person.toLowerCase().includes(txtSearch.toLowerCase())
        )
      ) {
        results.push({
          talk_number: talk.talk_number,
          talk_title: talk.talk_title,
          last_date: personsFormatted.at(0)?.date || '',
          last_speaker: personsFormatted.at(0)?.person || '',
          history: personsFormatted,
        });
      }
    }

    return results;
  }, [
    talksList,
    assignmentsHistory,
    persons,
    fullnameOption,
    useDisplayName,
    txtSearch,
    speakers,
  ]);

  const handleToggleExpandAll = () => {
    setIsExpandAll((prev) => !prev);
  };

  const handleSearch = async (value: string) => {
    await setPublicTalksSearchKey(value);
  };

  useEffect(() => {
    if (txtSearch.length === 0) {
      setLabelSearch('tr_countPublicTalks');
    }

    if (txtSearch.length > 0) {
      setLabelSearch('tr_searchResults');
    }
  }, [txtSearch]);

  return {
    talks,
    isExpandAll,
    handleToggleExpandAll,
    handleSearch,
    labelSearch,
    txtSearch,
  };
};

export default usePublicTalks;
