import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
  settingsState,
  userDataViewState,
  weekendMeetingWTStudyConductorDefaultState,
  weekendMeetingWTSubstituteDisplayedState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { personsByViewState } from '@states/persons';
import { AssignmentCode } from '@definition/assignment';
import { personGetDisplayName } from '@utils/common';

const useStudyConductor = () => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const persons = useAtomValue(personsByViewState);
  const useDisplayName = useAtomValue(displayNameMeetingsEnableState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const substituteInitial = useAtomValue(
    weekendMeetingWTSubstituteDisplayedState
  );
  const defaultInitial = useAtomValue(
    weekendMeetingWTStudyConductorDefaultState
  );

  const [subtituteWTConductorDisplayed, setSubtituteWTConductorDisplayed] =
    useState(false);
  const [wtConductorMainPerson, setWTConductorMainPerson] = useState('');

  const personsWTCondcutorList = useMemo(() => {
    const elligiblePersons = persons.filter((record) => {
      const assignments =
        record.person_data.assignments.find((a) => a.type === dataView)
          ?.values ?? [];

      return assignments.includes(AssignmentCode.WM_WTStudyConductor);
    });

    const result = elligiblePersons.map((person) => {
      return {
        label: personGetDisplayName(person, useDisplayName, fullnameOption),
        value: person.person_uid,
      };
    });

    return result;
  }, [persons, useDisplayName, fullnameOption, dataView]);

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
    setWTConductorMainPerson('');
    setSubtituteWTConductorDisplayed(substituteInitial);
    setWTConductorMainPerson(defaultInitial);
  }, [substituteInitial, defaultInitial]);

  return {
    handleWTConductorMainPersonChange,
    wtConductorMainPerson,
    personsWTCondcutorList,
    handleWTConductorToggle,
    subtituteWTConductorDisplayed,
  };
};

export default useStudyConductor;
