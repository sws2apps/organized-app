import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { meetingDutiesState } from '@states/settings';
import {
  schedulesDutiesMeetingParts,
  schedulesDutiesSections,
} from '@services/app/schedules';
import { dutiesSectionAdd, dutiesSectionUpdate } from '@services/app/duties';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { useAppTranslation } from '@hooks/index';
import { SectionEditProps } from '../index.types';

const useSectionEdit = ({
  id,
  meeting,
  onClose,
  type,
  week,
}: SectionEditProps) => {
  const { t } = useAppTranslation();

  const dutiesConfig = useAtomValue(meetingDutiesState);

  const sections = useMemo(
    () => schedulesDutiesSections(week, meeting),
    [week, meeting]
  );

  const parts = useMemo(
    () => schedulesDutiesMeetingParts(week, meeting),
    [week, meeting]
  );

  const [name, setName] = useState('');
  const [amount, setAmount] = useState(2);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [nameError, setNameError] = useState(false);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNameError(false);
    setName(e.target.value);
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value as unknown as number);
  };

  const handleTogglePart = (key: string) => {
    setSelectedParts((prev) =>
      prev.includes(key)
        ? prev.filter((record) => record !== key)
        : // keep the order of the meeting, not the order of the clicks
          parts
            .map((part) => part.key)
            .filter((part) => part === key || prev.includes(part))
    );
  };

  const handleSave = async () => {
    const sectionName = name.trim();

    if (sectionName.length === 0) {
      setNameError(true);
      return;
    }

    try {
      if (type === 'add') {
        await dutiesSectionAdd(week, meeting, {
          name: sectionName,
          amount,
          parts: selectedParts,
        });
      }

      if (type === 'edit' && id) {
        await dutiesSectionUpdate(week, meeting, id, {
          name: sectionName,
          amount,
          parts: selectedParts,
        });
      }

      onClose();
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(
          error instanceof Error ? error.message : String(error)
        ),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    if (type === 'add') {
      setName(t('tr_sectionDefaultName', { index: sections.length + 1 }));

      // mic amount = default persons per section
      setAmount(dutiesConfig?.mic_amount.value || 2);
      setSelectedParts([]);
      return;
    }

    const section = sections.find((record) => record.id === id);

    if (!section) return;

    setName(section.name);
    setAmount(section.amount);
    setSelectedParts(section.parts ?? []);
  }, [id, type, sections, t, dutiesConfig]);

  return {
    name,
    amount,
    parts,
    selectedParts,
    nameError,
    handleNameChange,
    handleAmountChange,
    handleTogglePart,
    handleSave,
  };
};

export default useSectionEdit;
