import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { AssignmentFieldType } from '@definition/assignment';
import {
  closingPrayerLinkedAssigmentState,
  openingPrayerLinkedAssigmentState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import useLinkedPartsOptions from './useLinkedPartsOptions';
import { LinkedPartID } from './index.types';

const DEFAULT_LINKED_PART_OPTION = 'Do_Not_Link';

const useLinkedParts = () => {
  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);
  const openingPrayerLinkedAssigment = useRecoilValue<AssignmentFieldType | ''>(
    openingPrayerLinkedAssigmentState
  );
  const closingPrayerLinkedAssigment = useRecoilValue<AssignmentFieldType | ''>(
    closingPrayerLinkedAssigmentState
  );

  const [openingPrayerAssignment, setOpeningPrayerAssignment] =
    useState<LinkedPartID>(
      openingPrayerLinkedAssigment || DEFAULT_LINKED_PART_OPTION
    );
  const [closingPrayerAssignment, setClosingPrayerAssignment] =
    useState<LinkedPartID>(
      closingPrayerLinkedAssigment || DEFAULT_LINKED_PART_OPTION
    );

  const options = useLinkedPartsOptions();

  const handleOpeningPrayerAssignmentChange = async (
    value: AssignmentFieldType
  ) => {
    const midweekSettings = structuredClone(
      settings.cong_settings.midweek_meeting
    );

    const current = midweekSettings.find((record) => record.type === dataView);

    current.opening_prayer_linked_assignment.value = value;
    current.opening_prayer_linked_assignment.updatedAt =
      new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.midweek_meeting': midweekSettings,
    });
  };

  const handleClosingPrayerAssignmentChange = async (value: LinkedPartID) => {
    const midweekSettings = structuredClone(
      settings.cong_settings.midweek_meeting
    );

    const current = midweekSettings.find((record) => record.type === dataView);

    current.closing_prayer_linked_assignment.value =
      value === DEFAULT_LINKED_PART_OPTION ? '' : value;
    current.closing_prayer_linked_assignment.updatedAt =
      new Date().toISOString();

    await dbAppSettingsUpdate({
      'cong_settings.midweek_meeting': midweekSettings,
    });
  };

  useEffect(() => {
    setOpeningPrayerAssignment(
      openingPrayerLinkedAssigment || DEFAULT_LINKED_PART_OPTION
    );
    setClosingPrayerAssignment(
      closingPrayerLinkedAssigment || DEFAULT_LINKED_PART_OPTION
    );
  }, [openingPrayerLinkedAssigment, closingPrayerLinkedAssigment]);

  return {
    options,
    openingPrayerAssignment,
    closingPrayerAssignment,
    handleOpeningPrayerAssignmentChange,
    handleClosingPrayerAssignmentChange,
  };
};

export default useLinkedParts;
