// src/features/persons/speakers_catalog/import_export/confirm_import/useConfirmImport.tsx
import { useMemo, useState, ChangeEvent, useEffect } from 'react';
import { useAppTranslation } from '@hooks/index';
import { displaySnackNotification } from '@services/states/app';
import useCSVImport from './useCSVImport';
import useSpeakersImportConfig from './useSpeakersImportConfig';
import { ConfirmImportProps } from './index.types';

/**
 * Hook backing the confirm step of the speakers CSV import. Manages the
 * field/group checkbox selection and runs the two-phase import (parse,
 * then persist) when the user confirms.
 *
 * Selection rule applied throughout: only fields whose key exists in the
 * CSV header row are selectable; fields missing from the file are disabled.
 */
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

  /**
   * Toggles a single field and derives the checkbox state of its group.
   *
   * The group state is computed inside the `setSelectedFields` updater so it
   * always operates on the freshest field map – reading the closed-over
   * `selectedFields` instead would lag one render behind (stale state).
   *
   * @param {string} fieldKey - The field key to toggle (e.g. "speaker.firstname").
   * @param {boolean} checked - Whether the field is selected.
   */
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

  /**
   * True when every field available in the CSV file is selected.
   * False when the file contains no known fields at all.
   */
  const selectedAll = useMemo(() => {
    const availableFields = SPEAKER_FIELD_META.filter((f) =>
      csvHeaders.includes(f.key)
    );

    return (
      availableFields.length > 0 &&
      availableFields.every((field) => selectedFields[field.key])
    );
  }, [selectedFields, SPEAKER_FIELD_META, csvHeaders]);

  /**
   * True when some – but not all – available fields are selected; drives the
   * indeterminate visual state of the select-all checkbox.
   */
  const indeterminate = useMemo(() => {
    const availableFields = SPEAKER_FIELD_META.filter((f) =>
      csvHeaders.includes(f.key)
    );

    const selectedCount = availableFields.filter(
      (field) => selectedFields[field.key]
    ).length;
    return selectedCount > 0 && selectedCount < availableFields.length;
  }, [selectedFields, csvHeaders, SPEAKER_FIELD_META]);

  /**
   * Selects or deselects all fields available in the CSV file and updates
   * all group checkboxes accordingly. Groups without any available field
   * keep their current state.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - The checkbox change event.
   */
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

  /**
   * Selects or deselects a whole group: all of its fields available in the
   * CSV file are toggled, fields not present in the file stay untouched.
   *
   * @param {string} groupKey - The group to toggle (e.g. "speaker").
   * @param {boolean} checked - Whether the group should be selected.
   */
  const handleSelectGroup = (groupKey: string, checked: boolean) => {
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

  /**
   * Runs the import on confirm: parses the selected fields from the file,
   * persists the valid rows, and shows the outcome (success count plus the
   * aggregated error summary with affected CSV rows) as a snack notification.
   *
   * Closes the dialog after a completed run; it stays open when no valid
   * data was found or an unexpected error occurred. Does nothing while an
   * import is already running or no field is selected.
   */
  const handleImportData = async () => {
    if (isProcessing) return;

    if (Object.values(selectedFields).every((value) => !value)) {
      return;
    }

    try {
      setIsProcessing(true);

      const fileType = 'csv';

      const parsedData = await parseFileToSpeakersAndCongs(
        {
          contents: csvContents,
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
    handleSelectData: handleSelectGroup,
    selected,
    selectedAll,
    inderterminate: indeterminate,
    handleSelectAll,
    csvContents,
    handleSelectField,
    selectedFields,
  };
};

export default useConfirmImport;
