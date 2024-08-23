import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { PersonComponentProps, PersonDataType } from './index.types';
import { schedulesState } from '@states/schedules';
import { ASSIGNMENT_PATH } from '@constants/index';
import { schedulesGetData } from '@services/app/schedules';
import {
  CODisplayNameState,
  COFullnameState,
  displayNameMeetingsEnableState,
  fullnameOptionState,
  userDataViewState,
  userLocalUIDState,
} from '@states/settings';
import { AssignmentCongregation } from '@definition/schedules';
import { personsState } from '@states/persons';
import { personGetDisplayName } from '@utils/common';

const usePersonComponent = ({ week, assignment }: PersonComponentProps) => {
  const schedules = useRecoilValue(schedulesState);
  const dataView = useRecoilValue(userDataViewState);
  const persons = useRecoilValue(personsState);
  const displayNameEnabled = useRecoilValue(displayNameMeetingsEnableState);
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const userUID = useRecoilValue(userLocalUIDState);
  const coDisplayName = useRecoilValue(CODisplayNameState);
  const coFullname = useRecoilValue(COFullnameState);

  const personData = useMemo(() => {
    const result = {} as PersonDataType;

    const schedule = schedules.find((record) => record.weekOf === week);
    if (!schedule) return result;

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

    if (!assigned || assigned.value.length === 0) return result;

    // return immediately if solo value
    if (assigned.solo) {
      return {
        name: assigned.value,
        female: false,
        active: false,
      };
    }

    // speaker 1 field to accomodate incoming speakers
    const talkType = schedule.weekend_meeting.public_talk_type.find(
      (record) => record.type === dataView
    );

    if (
      assignment === 'WM_Speaker_Part1' &&
      talkType?.value === 'visitingSpeaker'
    ) {
      return result;
    }

    const person = persons.find(
      (record) => record.person_uid === assigned.value
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
  ]);

  return { personData };
};

export default usePersonComponent;
