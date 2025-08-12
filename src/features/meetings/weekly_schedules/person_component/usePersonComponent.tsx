import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { PersonComponentProps, PersonDataType } from './index.types';
import { schedulesState } from '@states/schedules';
import { ASSIGNMENT_PATH } from '@constants/index';
import { schedulesGetData } from '@services/app/schedules';
import {
  CODisplayNameState,
  COFullnameState,
  displayNameMeetingsEnableState,
  fullnameOptionState,
  settingsState,
  userLocalUIDState,
} from '@states/settings';
import { AssignmentCongregation } from '@definition/schedules';
import { personsState } from '@states/persons';
import { personGetDisplayName, speakerGetDisplayName } from '@utils/common';
import { incomingSpeakersState } from '@states/visiting_speakers';

const usePersonComponent = ({
  week,
  assignment,
  schedule_id,
  dataView,
}: PersonComponentProps) => {
  const schedules = useAtomValue(schedulesState);
  const persons = useAtomValue(personsState);
  const displayNameEnabled = useAtomValue(displayNameMeetingsEnableState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const userUID = useAtomValue(userLocalUIDState);
  const coDisplayName = useAtomValue(CODisplayNameState);
  const coFullname = useAtomValue(COFullnameState);
  const incomingSpeakers = useAtomValue(incomingSpeakersState);
  const settings = useAtomValue(settingsState);

  const mmAuxCounselorDefaultEnabled = useMemo(() => {
    return (
      settings.cong_settings.midweek_meeting.find(
        (record) => record.type === dataView
      )?.aux_class_counselor_default.enabled.value ?? false
    );
  }, [settings, dataView]);

  const mmAuxCounselorDefault = useMemo(() => {
    return (
      settings.cong_settings.midweek_meeting.find(
        (record) => record.type === dataView
      )?.aux_class_counselor_default.person.value ?? ''
    );
  }, [settings, dataView]);

  const wsConductor = useMemo(() => {
    return (
      settings.cong_settings.weekend_meeting.find(
        (record) => record.type === dataView
      )?.w_study_conductor_default.value ?? ''
    );
  }, [settings, dataView]);

  const personData = useMemo(() => {
    const result: PersonDataType = {
      name: undefined,
      active: undefined,
      female: undefined,
    };

    const schedule = schedules.find((record) => record.weekOf === week);

    if (!schedule) return result;

    if (!schedule_id) {
      const path = ASSIGNMENT_PATH[assignment];

      const assigned = schedulesGetData(
        schedule,
        path,
        dataView
      ) as AssignmentCongregation;

      // circuit overseer field
      if (
        (assignment === 'MM_CircuitOverseer' ||
          assignment === 'WM_CircuitOverseer') &&
        assigned?.value?.length === 0
      ) {
        return {
          name: displayNameEnabled ? coDisplayName : coFullname,
          female: false,
          active: false,
        };
      }

      // return immediately if solo value
      if (assigned?.solo) {
        return {
          name: assigned.value,
          female: false,
          active: false,
        };
      }

      // speaker 1 field to accomodate incoming speakers
      const talkType = schedule.weekend_meeting?.public_talk_type.find(
        (record) => record.type === dataView
      );

      if (
        assignment === 'WM_Speaker_Part1' &&
        talkType?.value === 'visitingSpeaker'
      ) {
        const speaker = incomingSpeakers.find(
          (record) => record.person_uid === assigned?.value
        );

        if (speaker) {
          return {
            name: speakerGetDisplayName(
              speaker,
              displayNameEnabled,
              fullnameOption
            ),
            female: false,
            active: false,
          };
        }
      }

      const person = persons.find(
        (record) => record.person_uid === assigned?.value
      );

      if (person) {
        result.name = personGetDisplayName(
          person,
          displayNameEnabled,
          fullnameOption
        );
        result.female = person.person_data.female.value;
        result.active = assigned.value === userUID;
      }

      // get default values for some field if blank
      if (
        assignment === 'MM_Chairman_B' &&
        !result?.name &&
        mmAuxCounselorDefaultEnabled
      ) {
        const person = persons.find(
          (record) => record.person_uid === mmAuxCounselorDefault
        );

        if (person) {
          result.name = personGetDisplayName(
            person,
            displayNameEnabled,
            fullnameOption
          );
          result.female = false;
          result.active = assigned.value === userUID;
        }
      }

      if (assignment === 'WM_WTStudy_Conductor' && !result?.name) {
        const person = persons.find(
          (record) => record.person_uid === wsConductor
        );

        if (person) {
          result.name = personGetDisplayName(
            person,
            displayNameEnabled,
            fullnameOption
          );

          result.female = false;
          result.active = assigned?.value === userUID;
        }
      }

      if (assignment === 'WM_ClosingPrayer' && !result?.name) {
        const path = ASSIGNMENT_PATH['WM_Speaker_Part1'];
        const assigned = schedulesGetData(
          schedule,
          path,
          dataView
        ) as AssignmentCongregation;

        if (talkType?.value !== 'visitingSpeaker') {
          const person = persons.find(
            (record) => record.person_uid === assigned?.value
          );

          if (person) {
            result.name = personGetDisplayName(
              person,
              displayNameEnabled,
              fullnameOption
            );

            result.female = false;
            result.active = assigned?.value === userUID;
          }
        }

        if (talkType?.value === 'visitingSpeaker') {
          const speaker = incomingSpeakers.find(
            (record) => record.person_uid === assigned?.value
          );

          if (speaker) {
            result.name = speakerGetDisplayName(
              speaker,
              displayNameEnabled,
              fullnameOption
            );
            result.female = false;
            result.active = false;
          }
        }
      }
    }

    if (schedule_id) {
      const talkSchedule = schedule.weekend_meeting?.outgoing_talks.find(
        (record) => record.id === schedule_id && !record._deleted
      );

      const person = persons.find(
        (record) => record.person_uid === talkSchedule?.value
      );

      if (person) {
        result.name = personGetDisplayName(
          person,
          displayNameEnabled,
          fullnameOption
        );

        result.female = person.person_data.female.value;
        result.active = talkSchedule.value === userUID;
      }
    }

    return result;
  }, [
    dataView,
    assignment,
    schedules,
    week,
    displayNameEnabled,
    fullnameOption,
    persons,
    userUID,
    coDisplayName,
    coFullname,
    wsConductor,
    incomingSpeakers,
    mmAuxCounselorDefaultEnabled,
    mmAuxCounselorDefault,
    schedule_id,
  ]);

  return { personData };
};

export default usePersonComponent;
