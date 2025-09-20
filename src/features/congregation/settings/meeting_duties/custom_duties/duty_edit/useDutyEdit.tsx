import { ChangeEvent, useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  dutiesCustomState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { DutyEditProps } from './index.types';

const useDutyEdit = ({ id, onClose, type }: DutyEditProps) => {
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const duties = useAtomValue(dutiesCustomState);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as unknown as number;
    setAmount(value);
  };

  const handleSave = async () => {
    const dutyName = name.trim();

    if (dutyName.length === 0) return;

    try {
      const meetingDuties = structuredClone(
        settings.cong_settings.meeting_duties
      );

      const duties = meetingDuties.find((duty) => duty.type === dataView);

      if (type === 'add') {
        duties.custom.push({
          id: crypto.randomUUID(),
          name: dutyName,
          amount,
          _deleted: false,
          updatedAt: new Date().toISOString(),
        });
      }

      if (type === 'edit') {
        const duty = duties.custom.find((duty) => duty.id === id)!;

        duty.name = dutyName;
        duty.amount = amount;
        duty.updatedAt = new Date().toISOString();
      }

      await dbAppSettingsUpdate({
        'cong_settings.meeting_duties': meetingDuties,
      });

      onClose();
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    if (!id) return;

    const duty = duties.find((duty) => duty.id === id);

    if (!duty) return;

    setName(duty.name);
    setAmount(duty.amount);
  }, [id, duties]);

  return { name, amount, handleNameChange, handleAmountChange, handleSave };
};

export default useDutyEdit;
