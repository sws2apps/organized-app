import { CustomDutyIconType } from '@definition/duties';
import { resolveCustomDutyIcon } from '@constants/duty_icons';
import { validateDutyName } from '@utils/duties_sections';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { ChangeEvent, useRef, useState } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { useAtomValue } from 'jotai';
import {
  dutiesCustomState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { dutiesSaveSettings } from '@services/app/duties';
import { DutyEditProps } from './index.types';

const useDutyEdit = ({ id, onClose, type }: DutyEditProps) => {
  const { t } = useAppTranslation();
  const { isDutiesEditor } = useCurrentUser();
  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const duties = useAtomValue(dutiesCustomState);

  const duty = duties.find((item) => item.id === id);
  const [icon, setIcon] = useState<CustomDutyIconType>(
    resolveCustomDutyIcon(duty?.icon)
  );
  const [name, setName] = useState(duty?.name ?? '');
  const [amount, setAmount] = useState(duty?.amount ?? 1);
  const [nameError, setNameError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);
  const saving = useRef(false);
  const unavailable = !isDutiesEditor || (type === 'edit' && !duty);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNameError(undefined);
    setName(value);
  };

  const handleAmountChange = (e: SelectChangeEvent<unknown>) => {
    setAmount(Number(e.target.value));
  };

  const handleSave = async () => {
    const dutyName = name.trim();

    if (saving.current || unavailable) return;
    const error = validateDutyName(dutyName, duties, id);
    setNameError(error);
    if (error) return;
    saving.current = true;
    setIsSaving(true);

    try {
      const meetingDuties = structuredClone(
        settings.cong_settings.meeting_duties
      );

      const duties = meetingDuties.find((duty) => duty.type === dataView);

      if (!duties) return;

      if (type === 'add') {
        duties.custom.push({
          id: crypto.randomUUID(),
          name: dutyName,
          amount,
          icon,
          _deleted: false,
          updatedAt: new Date().toISOString(),
        });
      }

      if (type === 'edit') {
        const duty = duties.custom.find((duty) => duty.id === id)!;

        // keep an icon from a newer app version unless the user picked another
        if (icon !== resolveCustomDutyIcon(duty.icon)) duty.icon = icon;
        duty.name = dutyName;
        duty.amount = amount;
        duty.updatedAt = new Date().toISOString();
      }

      await dutiesSaveSettings(meetingDuties);

      onClose();
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: t(error instanceof Error ? error.message : String(error)),
        severity: 'error',
      });
    } finally {
      saving.current = false;
      setIsSaving(false);
    }
  };

  return {
    icon,
    handleIconChange: setIcon,
    name,
    amount,
    nameError,
    isSaving,
    unavailable,
    handleNameChange,
    handleAmountChange,
    handleSave,
  };
};

export default useDutyEdit;
