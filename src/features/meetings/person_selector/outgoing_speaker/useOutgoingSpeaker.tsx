import { useMemo } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { IconError } from '@components/icons';
import { PersonOptionsType, PersonSelectorType } from '../index.types';
import { personsByViewState } from '@states/persons';
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
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';

const useOutgoingSpeaker = ({
  week,
  assignment,
  talk,
  schedule_id,
}: PersonSelectorType) => {
  const setOutgoingSongSelectorOpen = useSetAtom(outgoingSongSelectorOpenState);

  const persons = useAtomValue(personsByViewState);
  const displayNameEnabled = useAtomValue(displayNameMeetingsEnableState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const schedules = useAtomValue(schedulesState);
  const outgoingSpeakers = useAtomValue(outgoingSpeakersState);

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

      if (!person) {
        continue;
      }

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

    if (!outgoingSchedule || outgoingSchedule?.value?.length === 0) {
      return null;
    }

    const person = options.find(
      (record) => record.person_uid === outgoingSchedule.value
    );

    return person || null;
  }, [week, schedule, options, schedule_id]);

  const handleSaveAssignment = async (value: PersonOptionsType) => {
    try {
      await schedulesSaveAssignment(schedule, assignment, value, schedule_id);

      if (assignment === 'WM_Speaker_Outgoing') {
        setOutgoingSongSelectorOpen(true);
      }
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: error.message,
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
    }
  };

  return {
    options,
    handleSaveAssignment,
    value,
  };
};

export default useOutgoingSpeaker;
