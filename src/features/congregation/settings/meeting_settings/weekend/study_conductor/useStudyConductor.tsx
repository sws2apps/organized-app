import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { personsActiveState } from '@states/persons';
import { AssignmentCode } from '@definition/assignment';
import { personGetDisplayName } from '@utils/common';

const useStudyConductor = () => {
  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);
  const persons = useRecoilValue(personsActiveState);
  const useDisplayName = useRecoilValue(displayNameMeetingsEnableState);
  const fullnameOption = useRecoilValue(fullnameOptionState);

  const [subtituteWTConductorDisplayed, setSubtituteWTConductorDisplayed] =
    useState(true);
  const [wtConductorMainPerson, setWTConductorMainPerson] = useState('');

  const personsWTCondcutorList = useMemo(() => {
    const elligiblePersons = persons.filter((record) =>
      record.person_data.assignments.find(
        (item) =>
          item._deleted === false &&
          item.code === AssignmentCode.WM_WTStudyConductor
      )
    );

    const result = elligiblePersons.map((person) => {
      return {
        label: personGetDisplayName(person, useDisplayName, fullnameOption),
        value: person.person_uid,
      };
    });

    return result;
  }, [persons, useDisplayName, fullnameOption]);

  const handleWTConductorToggle = async () => {
    const weekendSettings = structuredClone(
      settings.cong_settings.weekend_meeting
    );

    const current = weekendSettings.find((record) => record.type === dataView);

    current.substitute_w_study_conductor_displayed.value =
      !subtituteWTConductorDisplayed;
    current.substitute_w_study_conductor_displayed.updatedAt =
      new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.weekend_meeting': weekendSettings,
    });
  };

  const handleWTConductorMainPersonChange = async (value: string) => {
    const weekendSettings = structuredClone(
      settings.cong_settings.weekend_meeting
    );

    const current = weekendSettings.find((record) => record.type === dataView);

    current.w_study_conductor_default.value = value;
    current.w_study_conductor_default.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.weekend_meeting': weekendSettings,
    });
  };

  useEffect(() => {
    const weekendSettings = settings.cong_settings.weekend_meeting.find(
      (record) => record.type === dataView
    );

    setSubtituteWTConductorDisplayed(
      weekendSettings.substitute_w_study_conductor_displayed.value
    );
    setWTConductorMainPerson(weekendSettings.w_study_conductor_default.value);
  }, [settings, dataView]);

  return {
    handleWTConductorMainPersonChange,
    wtConductorMainPerson,
    personsWTCondcutorList,
    handleWTConductorToggle,
    subtituteWTConductorDisplayed,
  };
};

export default useStudyConductor;
