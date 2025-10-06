import { useMemo, useState, ChangeEvent } from 'react';
import { useAppTranslation } from '@hooks/index';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import useCSVImport from './useCSVImport';
import usePersonsImportConfig from './usePersonsImportConfig';
import { ConfirmImportProps } from './index.types';

const useConfirmImport = (props: ConfirmImportProps) => {
  const { t } = useAppTranslation();
  const {
    parseCsvToPersonsAndGroups,
    getCSVHeaders,
    addPersonsToDB,
    addGroupsToDB,
  } = useCSVImport();
  const personsContents = props.filedata?.contents || '';
  const csvHeaders = useMemo(
    () => getCSVHeaders(personsContents),
    [personsContents, getCSVHeaders]
  );
  const { PERSON_FIELD_META } = usePersonsImportConfig();

  // Fallback for group initialization
  const initialGroups = Array.from(
    new Set(PERSON_FIELD_META.map((field) => field.group))
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
    const field = PERSON_FIELD_META.find((f) => f.key === fieldKey);
    if (field) {
      const groupFields = PERSON_FIELD_META.filter(
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
    const availableFields = PERSON_FIELD_META.filter((f) =>
      csvHeaders.includes(f.key)
    );

    return (
      availableFields.length > 0 &&
      availableFields.every((field) => selectedFields[field.key])
    );
  }, [selectedFields, PERSON_FIELD_META, csvHeaders]);

  const inderterminate = useMemo(() => {
    const availableFields = PERSON_FIELD_META.filter((f) =>
      csvHeaders.includes(f.key)
    );

    const selectedCount = availableFields.filter(
      (field) => selectedFields[field.key]
    ).length;
    return selectedCount > 0 && selectedCount < availableFields.length;
  }, [selectedFields, csvHeaders, PERSON_FIELD_META]);

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;

    const newSelected: Record<string, boolean> = { ...selected };
    const groups = [...new Set(PERSON_FIELD_META.map((f) => f.group))];

    groups.forEach((group) => {
      const hasFields = PERSON_FIELD_META.filter((f) => f.group === group).some(
        (f) => csvHeaders.includes(f.key)
      );
      if (hasFields) {
        newSelected[group] = checked;
      }
    });

    setSelected(newSelected);

    const newFieldSelections: Record<string, boolean> = {};
    PERSON_FIELD_META.filter((f) => csvHeaders.includes(f.key)).forEach(
      (field) => {
        newFieldSelections[field.key] = checked;
      }
    );

    setSelectedFields(newFieldSelections);
  };
  const handleSelectData = (groupKey: string, checked: boolean) => {
    setSelected((prev) => ({
      ...prev,
      [groupKey]: checked,
    }));

    const groupFields = PERSON_FIELD_META.filter((f) => f.group === groupKey);
    const availableGroupFields = groupFields.filter((f) =>
      csvHeaders.includes(f.key)
    );

    const newFieldSelections: Record<string, boolean> = {};
    availableGroupFields.forEach((field) => {
      newFieldSelections[field.key] = checked;
    });

    setSelectedFields((prev) => ({
      ...prev,
      ...newFieldSelections,
    }));
  };

  const handleImportData = async () => {
    if (isProcessing) return;

    if (Object.values(selected).every((value) => !value)) return;
    const personsAndGroupsImport = parseCsvToPersonsAndGroups(
      personsContents,
      selectedFields
    );
    if (!personsAndGroupsImport) return;
    try {
      setIsProcessing(true);
      const importResult = await addPersonsToDB(personsAndGroupsImport[0]);
      const { successCount, totalCount, errorReason } = importResult;

      const importGroupsResult =
        successCount !== 0
          ? await addGroupsToDB(personsAndGroupsImport[1])
          : null;

      const {
        successMembersCount = 0,
        successCountGroups = 0,
        totalCountGroups = 0,
        errorReasonGroups = '',
      } = importGroupsResult ?? {};

      const severity = successCount === 0 ? 'error' : 'success';
      const header =
        severity === 'error'
          ? t('tr_importFailed')
          : t('tr_importDataCompleted');
      const personsMessage =
        (successCount === 0
          ? t('tr_importFailedDesc')
          : t('tr_importPersonsDataCompletedDesc', {
              NewCount: successCount,
              TotalCount: totalCount,
            })) +
        (errorReason
          ? ` ` + t('tr_errorReasons') + ` ` + `${errorReason}`
          : '');
      const groupsMessage =
        successCountGroups === 0 && totalCountGroups > 0
          ? t('tr_importGroupsFailedDesc')
          : t('tr_importGroupsDataCompletedDesc', {
              successMembersCount: successMembersCount,
              successCountGroups: successCountGroups,
            }) +
            (errorReasonGroups
              ? ` ` + t('tr_errorReasons') + ` ` + `${errorReasonGroups}`
              : '');
      const finalMessage =
        personsMessage +
        ' ' +
        //only show groups message if there were groups to import and there were successfully imported persons
        (successCount > 0 && personsAndGroupsImport[1].length > 0
          ? groupsMessage
          : '');
      displaySnackNotification({
        severity: severity,
        header: header,
        message: finalMessage,
      });

      setTimeout(() => {}, 2000);

      setIsProcessing(false);
      props.onClose();
    } catch (error) {
      setIsProcessing(false);

      console.error(error);

      displaySnackNotification({
        severity: 'error',
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
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
    personsContents,
    handleSelectField,
    selectedFields,
  };
};

export default useConfirmImport;
