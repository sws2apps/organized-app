// src/features/persons/speakers_catalog/import_export/confirm_import/useConfirmImport.tsx
import { useMemo, useState, ChangeEvent, useEffect } from 'react';
import { useAppTranslation } from '@hooks/index';
import { displaySnackNotification } from '@services/states/app';
import useCSVImport from './useCSVImport';
import useSpeakersImportConfig from './useSpeakersImportConfig';
import { ConfirmImportProps } from './index.types';

const useConfirmImport = (props: ConfirmImportProps) => {
  const { t } = useAppTranslation();

  const { parseFileToSpeakersAndCongs, addSpeakersToDB } = useCSVImport();

  const csvContents = props.filedata?.contents || '';

  const csvHeaders = useMemo(
    () => props.filedata?.headers ?? [],
    [props.filedata?.headers]
  );

  const { SPEAKER_FIELD_META } = useSpeakersImportConfig();

  const initialSelected = useMemo(() => {
    const initialGroups = Array.from(
      new Set(SPEAKER_FIELD_META.map((field) => field.group))
    );
    return Object.fromEntries(initialGroups.map((group) => [group, false]));
  }, [SPEAKER_FIELD_META]);

  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>(
    props.filedata?.selectedFields || {}
  );
  const [selected, setSelected] = useState<Record<string, boolean>>(
    props.filedata?.selected || initialSelected
  );
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (props.filedata) {
      setSelectedFields(props.filedata.selectedFields || {});
      setSelected(props.filedata.selected || initialSelected);
    }
  }, [props.filedata, initialSelected]);

  const handleSelectField = (fieldKey: string, checked: boolean) => {
    const field = SPEAKER_FIELD_META.find((f) => f.key === fieldKey);

    setSelectedFields((prev) => {
      const next = { ...prev, [fieldKey]: checked };

      if (field) {
        const groupFields = SPEAKER_FIELD_META.filter(
          (f) => f.group === field.group
        );
        const availableGroupFields = groupFields.filter((f) =>
          csvHeaders.includes(f.key)
        );
        const allGroupFieldsSelected = availableGroupFields.every(
          (f) => next[f.key]
        );

        setSelected((prevSelected) => ({
          ...prevSelected,
          [field.group]: allGroupFieldsSelected,
        }));
      }

      return next;
    });
  };

  const selectedAll = useMemo(() => {
    const availableFields = SPEAKER_FIELD_META.filter((f) =>
      csvHeaders.includes(f.key)
    );

    return (
      availableFields.length > 0 &&
      availableFields.every((field) => selectedFields[field.key])
    );
  }, [selectedFields, SPEAKER_FIELD_META, csvHeaders]);

  const inderterminate = useMemo(() => {
    const availableFields = SPEAKER_FIELD_META.filter((f) =>
      csvHeaders.includes(f.key)
    );

    const selectedCount = availableFields.filter(
      (field) => selectedFields[field.key]
    ).length;
    return selectedCount > 0 && selectedCount < availableFields.length;
  }, [selectedFields, csvHeaders, SPEAKER_FIELD_META]);

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;

    const newSelected: Record<string, boolean> = { ...selected };
    const groups = [...new Set(SPEAKER_FIELD_META.map((f) => f.group))];

    for (const group of groups) {
      const hasFields = SPEAKER_FIELD_META.filter(
        (f) => f.group === group
      ).some((f) => csvHeaders.includes(f.key));
      if (hasFields) {
        newSelected[group] = checked;
      }
    }

    setSelected(newSelected);

    const newFieldSelections: Record<string, boolean> = {};
    for (const field of SPEAKER_FIELD_META.filter((f) =>
      csvHeaders.includes(f.key)
    )) {
      newFieldSelections[field.key] = checked;
    }

    setSelectedFields(newFieldSelections);
  };

  const handleSelectData = (groupKey: string, checked: boolean) => {
    setSelected((prev) => ({
      ...prev,
      [groupKey]: checked,
    }));

    const groupFields = SPEAKER_FIELD_META.filter((f) => f.group === groupKey);
    const availableGroupFields = groupFields.filter((f) =>
      csvHeaders.includes(f.key)
    );

    const newFieldSelections: Record<string, boolean> = {};
    for (const field of availableGroupFields) {
      newFieldSelections[field.key] = checked;
    }

    setSelectedFields((prev) => ({
      ...prev,
      ...newFieldSelections,
    }));
  };

  const handleImportData = async () => {
    if (isProcessing) return;

    if (Object.values(selectedFields).every((value) => !value)) {
      return;
    }

    try {
      setIsProcessing(true);

      const fileName = props.filedata?.file?.name ?? '';
      const fileType: 'xlsx' | 'csv' = fileName.toLowerCase().endsWith('.xlsx')
        ? 'xlsx'
        : 'csv';

      const parsedData = await parseFileToSpeakersAndCongs(
        {
          contents: fileType === 'xlsx' ? props.filedata!.file : csvContents,
          type: fileType,
        },
        selectedFields
      );

      if (!parsedData || parsedData.speakers.length === 0) {
        displaySnackNotification({
          severity: 'error',
          header: t('tr_importFailed'),
          message: t('tr_error_app_data_no_valid_data_found'),
        });
        setIsProcessing(false);
        return;
      }

      const importResult = await addSpeakersToDB(parsedData);
      const { successCount, totalCount, errorReason } = importResult;

      const severity = successCount === 0 ? 'error' : 'success';

      const header =
        severity === 'error'
          ? t('tr_importFailed')
          : t('tr_importDataCompleted');

      const speakersMessage =
        (successCount === 0
          ? t('tr_importFailedDesc')
          : t('tr_importSpeakersDataCompletedDesc', {
              NewCount: successCount,
              TotalCount: totalCount,
            })) +
        (errorReason
          ? ` ` + t('tr_errorReasons') + ` ` + `${errorReason}`
          : '');

      displaySnackNotification({
        severity: severity,
        header: header,
        message: speakersMessage,
      });

      setIsProcessing(false);
      props.onClose();
    } catch (error) {
      setIsProcessing(false);
      console.error(error);
      displaySnackNotification({
        severity: 'error',
        header: t('tr_importFailed'),
        message: String(error),
      });
    }
  };

  return {
    isProcessing,
    handleImportData,
    handleSelectData,
    selected,
    selectedAll,
    inderterminate,
    handleSelectAll,
    csvContents,
    handleSelectField,
    selectedFields,
  };
};

export default useConfirmImport;
