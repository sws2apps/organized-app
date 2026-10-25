import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { useAtomValue } from 'jotai';
import {
  meetingDutiesState,
  userDataViewState,
  JWLangState,
} from '@states/settings';
import { schedulesState } from '@states/schedules';
import { sourcesState } from '@states/sources';
import {
  schedulesDutiesMeetingParts,
  schedulesDutiesSections,
} from '@services/app/schedules';
import { dutiesSectionAdd, dutiesSectionUpdate } from '@services/app/duties';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { useAppTranslation } from '@hooks/index';
import { validateDutyName, uniqueDutyName } from '@utils/duties_sections';
import { SectionEditProps } from '@features/meetings/duties_schedule/mic_sections/index.types';

const useSectionEdit = ({
  id,
  meeting,
  onClose,
  type,
  week,
  availableSections,
  availableParts,
  onSave,
}: SectionEditProps) => {
  const { t } = useAppTranslation();
  const config = useAtomValue(meetingDutiesState);
  const schedules = useAtomValue(schedulesState);
  const sources = useAtomValue(sourcesState);
  const dataView = useAtomValue(userDataViewState);
  const lang = useAtomValue(JWLangState);
  const sections = useMemo(
    () => availableSections ?? schedulesDutiesSections(week, meeting, dataView),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      week,
      meeting,
      dataView,
      schedules,
      config,
      sources,
      lang,
      availableSections,
    ]
  );
  const parts = useMemo(
    () => availableParts ?? schedulesDutiesMeetingParts(week, meeting),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [week, meeting, schedules, sources, dataView, lang, availableParts]
  );
  const section =
    type === 'edit' && id
      ? sections.find((record) => record.id === id || record.legacyId === id)
      : undefined;
  const initialUpdatedAt = useRef(section?.updatedAt);
  const changed =
    type === 'edit' &&
    section &&
    section.updatedAt !== initialUpdatedAt.current;
  const [name, setName] = useState(() => {
    if (section) return section.name;
    let index = 1;
    while (
      validateDutyName(t('tr_sectionDefaultName', { index }), sections) ===
      'tr_sectionNameTaken'
    )
      index++;
    return uniqueDutyName(t('tr_sectionDefaultName', { index }), sections);
  });
  const [amount, setAmount] = useState(
    section?.amount ?? (config?.mic_amount.value || 2)
  );
  const [selectedParts, setSelectedParts] = useState<string[]>(
    section?.parts ?? []
  );
  const [nameError, setNameError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);
  const saving = useRef(false);
  const missingParts = selectedParts.filter(
    (key) => !parts.some((part) => part.key === key)
  );
  const unavailable = type === 'edit' && !section;
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNameError(undefined);
    setName(event.target.value);
  };
  const handleAmountChange = (event: SelectChangeEvent<unknown>) =>
    setAmount(Number(event.target.value));
  const handleTogglePart = (key: string) =>
    setSelectedParts((previous) =>
      previous.includes(key)
        ? previous.filter((part) => part !== key)
        : [...previous, key]
    );
  const handleSave = async () => {
    if (saving.current || unavailable || changed || missingParts.length) return;
    const error = validateDutyName(name, sections, section?.id);
    setNameError(error);
    if (error) return;
    saving.current = true;
    setIsSaving(true);
    try {
      const values = {
        name: name.trim(),
        amount,
        parts: parts
          .map((part) => part.key)
          .filter((key) => selectedParts.includes(key)),
      };
      if (onSave) await onSave(values);
      else if (type === 'add') await dutiesSectionAdd(week, meeting, values);
      else if (id)
        await dutiesSectionUpdate(
          week,
          meeting,
          id,
          values,
          initialUpdatedAt.current
        );
      onClose();
    } catch (error) {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: t(
          error instanceof Error ? error.message : 'error_app_generic-title'
        ),
        severity: 'error',
      });
    } finally {
      saving.current = false;
      setIsSaving(false);
    }
  };
  return {
    name,
    amount,
    parts,
    selectedParts,
    missingParts,
    unavailable,
    changed,
    nameError,
    isSaving,
    handleNameChange,
    handleAmountChange,
    handleTogglePart,
    handleSave,
  };
};
export default useSectionEdit;
