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

const useMidweekSettings = () => {
  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);
  const persons = useRecoilValue(personsActiveState);
  const useDisplayName = useRecoilValue(displayNameMeetingsEnableState);
  const fullnameOption = useRecoilValue(fullnameOptionState);

  const [auxClassEnabled, setAuxClassEnabled] = useState(false);
  const [auxCounselorMainEnabled, setAuxCounselorMainEnabled] = useState(false);
  const [auxCounselorMainPerson, setAuxCounselorMainPerson] = useState('');
  const [auxClassAssignFSG, setAuxClassAssignFSG] = useState(false);

  const personsAuxCounselorList = useMemo(() => {
    const elligiblePersons = persons.filter((record) =>
      record.person_data.assignments.find(
        (item) =>
          item._deleted === false &&
          item.code === AssignmentCode.MM_AuxiliaryCounselor
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
    const midweekSettings = settings.cong_settings.midweek_meeting.find(
      (record) => record.type === dataView
    );

    setAuxClassEnabled(midweekSettings.class_count.value === 2);

    setAuxCounselorMainEnabled(
      midweekSettings.aux_class_counselor_default.enabled.value
    );

    setAuxCounselorMainPerson(
      midweekSettings.aux_class_counselor_default.person.value
    );

    setAuxClassAssignFSG(settings.cong_settings.aux_class_fsg?.value ?? false);
  }, [settings, dataView]);

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
