import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { schedulesState } from '@states/schedules';
import { ScheduleItemProps, TalkScheduleType } from './index.types';
import { personsState } from '@states/persons';
import { publicTalksState } from '@states/public_talks';
import { personGetDisplayName } from '@utils/common';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
} from '@states/settings';

const useScheduleItem = ({ schedule_id, week }: ScheduleItemProps) => {
  const schedules = useRecoilValue(schedulesState);
  const persons = useRecoilValue(personsState);
  const talks = useRecoilValue(publicTalksState);
  const displayNameEnabled = useRecoilValue(displayNameMeetingsEnableState);
  const fullnameOption = useRecoilValue(fullnameOptionState);

  const schedule = useMemo(() => {
    const scheduleItem = schedules.find((record) => record.weekOf === week);

    return scheduleItem?.weekend_meeting.outgoing_talks.find(
      (record) => record.id === schedule_id
    );
  }, [schedules, week, schedule_id]);

  const talkSchedule: TalkScheduleType = useMemo(() => {
    const person = persons.find(
      (record) => record.person_uid === schedule.speaker
    );
    const talk = talks.find(
      (record) => record.talk_number === schedule.public_talk
    );

    return {
      ...schedule,
      name: person
        ? personGetDisplayName(person, displayNameEnabled, fullnameOption)
        : '',
      talk: talk?.talk_title || '',
    };
  }, [schedule, persons, talks, displayNameEnabled, fullnameOption]);

  return { talkSchedule };
};

export default useScheduleItem;
