import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { ScheduleItemProps, TalkScheduleType } from './index.types';
import { personsState } from '@states/persons';
import { publicTalksLocaleState } from '@states/public_talks';
import { personGetDisplayName } from '@utils/common';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
} from '@states/settings';

const useScheduleItem = ({ schedule }: ScheduleItemProps) => {
  const persons = useAtomValue(personsState);
  const talks = useAtomValue(publicTalksLocaleState);
  const displayNameEnabled = useAtomValue(displayNameMeetingsEnableState);
  const fullnameOption = useAtomValue(fullnameOptionState);

  const talkSchedule: TalkScheduleType = useMemo(() => {
    const person = persons.find(
      (record) => record.person_uid === schedule.speaker
    );

    const talk = talks.find((record) => record.talk_number === schedule.talk);

    return {
      ...schedule,
      name: person
        ? personGetDisplayName(person, displayNameEnabled, fullnameOption)
        : '',
      talk_title: talk?.talk_title,
    };
  }, [schedule, persons, talks, displayNameEnabled, fullnameOption]);

  return { talkSchedule };
};

export default useScheduleItem;
