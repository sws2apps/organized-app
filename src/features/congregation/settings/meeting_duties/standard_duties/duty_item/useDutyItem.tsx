import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  meetingDutiesState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { DutyItemProps } from './index.types';

const useDutyItem = ({ duty }: DutyItemProps) => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const meetingDuties = useAtomValue(meetingDutiesState);

  const [value, setValue] = useState(0);

  const valueInitial = useMemo(() => {
    if (duty === 'tr_audioVideo') {
      return meetingDuties.av_amount.value;
    }

    if (duty === 'tr_dutiesEntranceAttendant') {
      return meetingDuties.entrance_attendant_amount.value;
    }

    if (duty === 'tr_dutiesMicrophones') {
      return meetingDuties.mic_amount.value;
    }

    if (duty === 'tr_dutiesStage') {
      return meetingDuties.stage_amount.value;
    }

    if (duty === 'tr_hospitality') {
      return meetingDuties.hospitality_amount.value;
    }

    return 0;
  }, [meetingDuties, duty]);

  const handleAmountChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as unknown as number;

    try {
      const meetingDuties = structuredClone(
        settings.cong_settings.meeting_duties
      );

      const duties = meetingDuties.find((duty) => duty.type === dataView);

      if (duty === 'tr_audioVideo') {
        duties.av_amount = { value, updatedAt: new Date().toISOString() };
      }

      if (duty === 'tr_dutiesEntranceAttendant') {
        duties.entrance_attendant_amount = {
          value,
          updatedAt: new Date().toISOString(),
        };
      }

      if (duty === 'tr_dutiesMicrophones') {
        duties.mic_amount = { value, updatedAt: new Date().toISOString() };
      }

      if (duty === 'tr_dutiesStage') {
        duties.stage_amount = { value, updatedAt: new Date().toISOString() };
      }

      if (duty === 'tr_hospitality') {
        duties.hospitality_amount = {
          value,
          updatedAt: new Date().toISOString(),
        };
      }

      await dbAppSettingsUpdate({
        'cong_settings.meeting_duties': meetingDuties,
      });
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => setValue(valueInitial), [valueInitial]);

  return { value, handleAmountChange };
};

export default useDutyItem;
