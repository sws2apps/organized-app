import { useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { SpeakersCatalogType, TalkOptionType } from './index.types';
import {
  incomingSpeakersState,
  myCongSpeakersState,
} from '@states/visiting_speakers';
import { publicTalksState } from '@states/public_talks';
import { VisitingSpeakerType } from '@definition/visiting_speakers';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
} from '@states/settings';
import { speakerGetDisplayName } from '@utils/common';
import { personsState } from '@states/persons';
import { PublicTalkType } from '@definition/public_talks';
import { schedulesSaveAssignment } from '@services/app/schedules';
import {
  outgoingSongSelectorOpenState,
  schedulesState,
  weekendSongSelectorOpenState,
} from '@states/schedules';
import usePublicTalkSelector from '../public_talk_selector/usePublicTalkSelector';

const useSpeakersCatalog = ({
  type,
  week,
  onClose,
  schedule_id,
}: SpeakersCatalogType) => {
  const { handleTalkChange } = usePublicTalkSelector(week, schedule_id);

  const setLocalSongSelectorOpen = useSetRecoilState(
    weekendSongSelectorOpenState
  );
  const setOutgoingSongSelectorOpen = useSetRecoilState(
    outgoingSongSelectorOpenState
  );

  const incomingSpeakers = useRecoilValue(incomingSpeakersState);
  const localSpeakers = useRecoilValue(myCongSpeakersState);
  const talksData = useRecoilValue(publicTalksState);
  const useDisplayName = useRecoilValue(displayNameMeetingsEnableState);
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const persons = useRecoilValue(personsState);
  const schedules = useRecoilValue(schedulesState);

  const [search, setSearch] = useState('');

  const speakers = useMemo(() => {
    const records: VisitingSpeakerType[] = [];

    if (type === 'localSpeaker') {
      const validSpeakers = localSpeakers.filter(
        (record) =>
          record.speaker_data.talks.filter(
            (record) => record._deleted === false
          ).length > 0
      );

      const formattedSpeakers = validSpeakers.map((speaker) => {
        const person = persons.find(
          (record) => record.person_uid === speaker.person_uid
        );

        const newSpeaker = structuredClone(speaker);

        newSpeaker.speaker_data.person_display_name =
          person.person_data.person_display_name;
        newSpeaker.speaker_data.person_firstname =
          person.person_data.person_firstname;
        newSpeaker.speaker_data.person_lastname =
          person.person_data.person_lastname;

        return newSpeaker;
      });

      records.push(...formattedSpeakers);
    }

    if (type === 'visitingSpeaker') {
      const validSpeakers = incomingSpeakers.filter(
        (record) =>
          record.speaker_data.talks.filter(
            (record) => record._deleted === false
          ).length > 0
      );

      records.push(...validSpeakers);
    }

    return records.sort((a, b) =>
      speakerGetDisplayName(a, useDisplayName, fullnameOption).localeCompare(
        speakerGetDisplayName(b, useDisplayName, fullnameOption)
      )
    );
  }, [
    incomingSpeakers,
    localSpeakers,
    type,
    fullnameOption,
    useDisplayName,
    persons,
  ]);

  const talks = useMemo(() => {
    const options: TalkOptionType[] = [];

    for (const talk of talksData) {
      const talkSpeakers = speakers.filter(
        (record) =>
          (talk.talk_title.toLowerCase().includes(search.toLowerCase()) ||
            record.speaker_data.person_display_name.value
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            record.speaker_data.person_lastname.value
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            record.speaker_data.person_firstname.value
              .toLowerCase()
              .includes(search.toLowerCase())) &&
          record.speaker_data.talks.find(
            (item) => item.talk_number === talk.talk_number
          )
      );

      if (talkSpeakers.length > 0) {
        options.push({
          ...talk,
          speakers: talkSpeakers,
        });
      }
    }

    return options;
  }, [speakers, talksData, search]);

  const handleSearchChange = (value: string) => setSearch(value);

  const handleSelectSpeaker = async (
    talk: PublicTalkType,
    speaker: VisitingSpeakerType
  ) => {
    const schedule = schedules.find((record) => record.weekOf === week);

    await handleTalkChange(talk);

    if (!schedule_id) {
      await schedulesSaveAssignment(schedule, 'WM_Speaker_Part1', speaker);

      setLocalSongSelectorOpen(true);
    }

    if (schedule_id) {
      await schedulesSaveAssignment(
        schedule,
        'WM_Speaker_Outgoing',
        speaker,
        schedule_id
      );

      setOutgoingSongSelectorOpen(true);
    }

    onClose();
  };

  return {
    talks,
    count: speakers.length,
    useDisplayName,
    fullnameOption,
    handleSelectSpeaker,
    handleSearchChange,
    search,
  };
};

export default useSpeakersCatalog;
