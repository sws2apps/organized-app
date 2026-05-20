import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
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
  const options = useLinkedPartsOptions();

  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);

  const openingPrayerLinkedAssignment = useAtomValue(
    midweekMeetingOpeningPrayerLinkedState
  );

  const closingPrayerLinkedAssignment = useAtomValue(
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

  const handleOpeningPrayerAssignmentChange = async (value: LinkedPartID) => {
    const midweekSettings = structuredClone(
      settings.cong_settings.midweek_meeting
    );

    const current = midweekSettings.find((record) => record.type === dataView);

    current.opening_prayer_linked_assignment = {
      value: value === DEFAULT_LINKED_PART_OPTION ? '' : value,
      updatedAt: new Date().toISOString(),
    };

    await dbAppSettingsUpdate({
      'cong_settings.midweek_meeting': midweekSettings,
    });
  };

  const handleClosingPrayerAssignmentChange = async (value: LinkedPartID) => {
    const midweekSettings = structuredClone(
      settings.cong_settings.midweek_meeting
    );

    const current = midweekSettings.find((record) => record.type === dataView);

    current.closing_prayer_linked_assignment = {
      value: value === DEFAULT_LINKED_PART_OPTION ? '' : value,
      updatedAt: new Date().toISOString(),
    };

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
