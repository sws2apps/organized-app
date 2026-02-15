import { useMemo, useState, ChangeEvent } from 'react';
import { useAppTranslation } from '@hooks/index';
import { displaySnackNotification } from '@services/states/app';
import useCSVImport from './useCSVImport';
import useSpeakersImportConfig from './useSpeakersImportConfig';
import { ConfirmImportProps } from './index.types';

const useConfirmImport = (props: ConfirmImportProps) => {
  const { t } = useAppTranslation();

  // 1. Neue Import-Funktionen nutzen
  const { parseCsvToSpeakersAndCongs, getCSVHeaders, addSpeakersToDB } =
    useCSVImport();

  const csvContents = props.filedata?.contents || '';

  const csvHeaders = useMemo(
    () => getCSVHeaders(csvContents),
    [csvContents, getCSVHeaders]
  );

  // 2. Speaker Config nutzen
  const { SPEAKER_FIELD_META } = useSpeakersImportConfig();

  // Fallback for group initialization
  const initialGroups = Array.from(
    new Set(SPEAKER_FIELD_META.map((field) => field.group))
  );
  const initialSelected = Object.fromEntries(
    initialGroups.map((group) => [group, false])
  );

  // State with props values or fallback
  const [selectedFields, setSelectedFields] = useState(
    props.filedata?.selectedFields || {}
  );
  const [selected, setSelected] = useState(
    props.filedata?.selected || initialSelected
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectField = (fieldKey: string, checked: boolean) => {
    setSelectedFields((prev) => ({
      ...prev,
      [fieldKey]: checked,
    }));

    // Then update the group selection
    const field = SPEAKER_FIELD_META.find((f) => f.key === fieldKey);
    if (field) {
      const groupFields = SPEAKER_FIELD_META.filter(
        (f) => f.group === field.group
      );
      const availableGroupFields = groupFields.filter((f) =>
        csvHeaders.includes(f.key)
      );

      const newSelectedFields = { ...selectedFields, [fieldKey]: checked };
      const allGroupFieldsSelected = availableGroupFields.every(
        (f) => newSelectedFields[f.key]
      );

      setSelected((prev) => ({
        ...prev,
        [field.group]: allGroupFieldsSelected,
      }));
    }
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

    // Prüfen, ob überhaupt etwas ausgewählt wurde
    if (Object.values(selectedFields).every((value) => !value)) {
      return;
    }

    // 3. Neue Parse-Funktion aufrufen
    const parsedData = parseCsvToSpeakersAndCongs(csvContents, selectedFields);

    // Wenn keine Speaker gefunden wurden, abbrechen
    if (!parsedData || parsedData.speakers.length === 0) return;

    try {
      setIsProcessing(true);

      // 4. Neue DB-Speicherfunktion aufrufen
      const importResult = await addSpeakersToDB(parsedData);
      const { successCount, totalCount, errorReason } = importResult;

      const severity = successCount === 0 ? 'error' : 'success';

      const header =
        severity === 'error'
          ? t('tr_importFailed')
          : t('tr_importDataCompleted');

      // 5. Angepasste Nachrichten für Redner
      const speakersMessage =
        (successCount === 0
          ? t('tr_importFailedDesc')
          : t('tr_importPersonsDataCompletedDesc', {
              // Ggf. eigenen Key 'tr_importSpeakersDataCompletedDesc' anlegen
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

      setTimeout(() => {}, 2000);

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
    csvContents, // Umbenannt von personsContents für Klarheit
    handleSelectField,
    selectedFields,
  };
};

export default useConfirmImport;
