import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
  midweekMeetingAssigFSGState,
  midweekMeetingAuxCounselorDefaultEnabledState,
  midweekMeetingAuxCounselorDefaultState,
  midweekMeetingClassCountState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { personsActiveState } from '@states/persons';
import { AssignmentCode } from '@definition/assignment';
import { personGetDisplayName } from '@utils/common';

const useMidweekSettings = () => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const persons = useAtomValue(personsActiveState);
  const useDisplayName = useAtomValue(displayNameMeetingsEnableState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const classCount = useAtomValue(midweekMeetingClassCountState);
  const defaultAuxPerson = useAtomValue(midweekMeetingAuxCounselorDefaultState);
  const assignFSGInitial = useAtomValue(midweekMeetingAssigFSGState);
  const defaultAuxEnabled = useAtomValue(
    midweekMeetingAuxCounselorDefaultEnabledState
  );

  const [auxClassEnabled, setAuxClassEnabled] = useState(false);
  const [auxCounselorMainEnabled, setAuxCounselorMainEnabled] = useState(false);
  const [auxCounselorMainPerson, setAuxCounselorMainPerson] = useState('');
  const [auxClassAssignFSG, setAuxClassAssignFSG] = useState(false);

  const personsAuxCounselorList = useMemo(() => {
    const elligiblePersons = persons.filter((record) => {
      const assignments =
        record.person_data.assignments.find((a) => a.type === dataView)
          ?.values ?? [];

      return assignments.includes(AssignmentCode.MM_AuxiliaryCounselor);
    });

    const result = elligiblePersons.map((person) => {
      return {
        label: personGetDisplayName(person, useDisplayName, fullnameOption),
        value: person.person_uid,
      };
    });

    return result;
  }, [persons, useDisplayName, fullnameOption, dataView]);

  const handleAuxClassToggle = async () => {
    const midweekSettings = structuredClone(
      settings.cong_settings.midweek_meeting
    );

    const current = midweekSettings.find((record) => record.type === dataView);

    current.class_count.value = auxClassEnabled ? 1 : 2;
    current.class_count.updatedAt = new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.midweek_meeting': midweekSettings,
    });
  };

  const handleAuxCounselorMainToggle = async () => {
    const midweekSettings = structuredClone(
      settings.cong_settings.midweek_meeting
    );

    const current = midweekSettings.find((record) => record.type === dataView);

    current.aux_class_counselor_default.enabled.value =
      !auxCounselorMainEnabled;
    current.aux_class_counselor_default.enabled.updatedAt =
      new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.midweek_meeting': midweekSettings,
    });
  };

  const handleAuxCounselorMainPersonChange = async (value: string) => {
    const midweekSettings = structuredClone(
      settings.cong_settings.midweek_meeting
    );

    const current = midweekSettings.find((record) => record.type === dataView);

    current.aux_class_counselor_default.person.value = value;
    current.aux_class_counselor_default.person.updatedAt =
      new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.midweek_meeting': midweekSettings,
    });
  };

  const handleAuxClassAssignFSGToggle = async () => {
    await dbAppSettingsUpdate({
      'cong_settings.aux_class_fsg': {
        value: !auxClassAssignFSG,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  useEffect(() => {
    setAuxClassEnabled(classCount === 2);
    setAuxCounselorMainEnabled(defaultAuxEnabled);
    setAuxCounselorMainPerson(defaultAuxPerson);
    setAuxClassAssignFSG(assignFSGInitial);
  }, [assignFSGInitial, classCount, defaultAuxEnabled, defaultAuxPerson]);

  return {
    auxClassEnabled,
    handleAuxClassToggle,
    auxCounselorMainEnabled,
    handleAuxCounselorMainToggle,
    personsAuxCounselorList,
    auxCounselorMainPerson,
    handleAuxCounselorMainPersonChange,
    auxClassAssignFSG,
    handleAuxClassAssignFSGToggle,
  };
};

export default useMidweekSettings;
