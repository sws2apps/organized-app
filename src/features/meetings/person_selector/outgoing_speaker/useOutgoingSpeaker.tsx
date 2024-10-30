import { useMemo } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { PersonOptionsType, PersonSelectorType } from '../index.types';
import { personsActiveState } from '@states/persons';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
} from '@states/settings';
import {
  outgoingSongSelectorOpenState,
  schedulesState,
} from '@states/schedules';
import { personGetDisplayName } from '@utils/common';
import { schedulesSaveAssignment } from '@services/app/schedules';
import { outgoingSpeakersState } from '@states/visiting_speakers';

const useOutgoingSpeaker = ({
  week,
  assignment,
  talk,
  schedule_id,
}: PersonSelectorType) => {
  const setOutgoingSongSelectorOpen = useSetRecoilState(
    outgoingSongSelectorOpenState
  );

  const persons = useRecoilValue(personsActiveState);
  const displayNameEnabled = useRecoilValue(displayNameMeetingsEnableState);
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const schedules = useRecoilValue(schedulesState);
  const outgoingSpeakers = useRecoilValue(outgoingSpeakersState);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  const options = useMemo(() => {
    const filteredPersons: PersonOptionsType[] = [];

    for (const speaker of outgoingSpeakers) {
      if (talk) {
        const activeTalks = speaker.speaker_data.talks.filter(
          (record) => record._deleted === false && record.talk_number === talk
        );

        if (activeTalks.length === 0) {
          continue;
        }
      }

      const person = persons.find(
        (record) => record.person_uid === speaker.person_uid
      );

      filteredPersons.push(person);
    }

    const newPersons = filteredPersons.map((record) => {
      return {
        ...record,
        person_name: personGetDisplayName(
          record,
          displayNameEnabled,
          fullnameOption
        ),
      };
    });

    return newPersons.sort((a, b) =>
      a.person_name.localeCompare(b.person_name)
    );
  }, [persons, displayNameEnabled, fullnameOption, talk, outgoingSpeakers]);

  const value = useMemo(() => {
    if (week.length === 0) return null;

    const outgoingSchedule = schedule.weekend_meeting.outgoing_talks.find(
      (record) => record.id === schedule_id
    );

    if (!outgoingSchedule || outgoingSchedule?.speaker.length === 0) {
      return null;
    }

    const person = options.find(
      (record) => record.person_uid === outgoingSchedule.speaker
    );

    return person || null;
  }, [week, schedule, options, schedule_id]);

  const handleSaveAssignment = async (value: PersonOptionsType) => {
    await schedulesSaveAssignment(schedule, assignment, value, schedule_id);

    if (assignment === 'WM_Speaker_Outgoing') {
      setOutgoingSongSelectorOpen(true);
    }
  };

  return {
    options,
    handleSaveAssignment,
    value,
  };
};

export default useOutgoingSpeaker;
