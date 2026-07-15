import { ChangeEvent, useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  dutiesSectionsState,
  meetingDutiesState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { useAppTranslation } from '@hooks/index';
import { SectionEditProps } from '../index.types';

const useSectionEdit = ({ id, onClose, type }: SectionEditProps) => {
  const { t } = useAppTranslation();

  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);
  const sections = useAtomValue(dutiesSectionsState);
  const dutiesConfig = useAtomValue(meetingDutiesState);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState(2);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value as unknown as number);
  };

  const handleSave = async () => {
    const sectionName = name.trim();

    if (sectionName.length === 0) return;

    try {
      const meetingDuties = structuredClone(
        settings.cong_settings.meeting_duties
      );

      const duties = meetingDuties.find((duty) => duty.type === dataView);

      duties.sections ??= [];

      if (type === 'add') {
        duties.sections.push({
          id: crypto.randomUUID(),
          name: sectionName,
          amount,
          _deleted: false,
          updatedAt: new Date().toISOString(),
        });
      }

      if (type === 'edit') {
        const section = duties.sections.find((section) => section.id === id)!;

        section.name = sectionName;
        section.amount = amount;
        section.updatedAt = new Date().toISOString();
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
    if (type === 'add') {
      setName(t('tr_sectionDefaultName', { index: sections.length + 1 }));

      // mic amount = default persons per section
      setAmount(dutiesConfig?.mic_amount.value || 2);
      return;
    }

    const section = sections.find((section) => section.id === id);

    if (!section) return;

    setName(section.name);
    setAmount(section.amount);
  }, [id, type, sections, t, dutiesConfig]);

  return { name, amount, handleNameChange, handleAmountChange, handleSave };
};

export default useSectionEdit;
