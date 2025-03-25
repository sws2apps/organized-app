import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { AssignmentFieldType } from '@definition/assignment';
import {
  midweekMeetingClosingPrayerLinkedState,
  midweekMeetingOpeningPrayerLinkedState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { LinkedPartID } from './index.types';
import useLinkedPartsOptions from './useLinkedPartsOptions';

const DEFAULT_LINKED_PART_OPTION = 'Do_Not_Link';

const useLinkedParts = () => {
  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);

  const openingPrayerLinkedAssignment = useRecoilValue(
    midweekMeetingOpeningPrayerLinkedState
  );

  const closingPrayerLinkedAssignment = useRecoilValue(
    midweekMeetingClosingPrayerLinkedState
  );

  const [openingPrayerAssignment, setOpeningPrayerAssignment] =
    useState<LinkedPartID>(
      openingPrayerLinkedAssignment || DEFAULT_LINKED_PART_OPTION
    );

  const [closingPrayerAssignment, setClosingPrayerAssignment] =
    useState<LinkedPartID>(
      closingPrayerLinkedAssignment || DEFAULT_LINKED_PART_OPTION
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
      openingPrayerLinkedAssignment || DEFAULT_LINKED_PART_OPTION
    );

    setClosingPrayerAssignment(
      closingPrayerLinkedAssignment || DEFAULT_LINKED_PART_OPTION
    );
  }, [openingPrayerLinkedAssignment, closingPrayerLinkedAssignment]);

  return {
    options,
    openingPrayerAssignment,
    closingPrayerAssignment,
    handleOpeningPrayerAssignmentChange,
    handleClosingPrayerAssignmentChange,
  };
};

export default useLinkedParts;
