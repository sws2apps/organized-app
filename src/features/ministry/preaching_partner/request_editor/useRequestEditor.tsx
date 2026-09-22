import { useCallback, useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { PreachingPartnerEditorProps } from './index.types';
import {
  PreachingPartnerMinistryType,
  PreachingPartnerRequestType,
} from '@definition/preaching_partner';
import {
  preachingPartnerBuildRequest,
  preachingPartnerTypeLabel,
} from '@services/app/preaching_partner';
import {
  dbPreachingPartnerRequestDelete,
  dbPreachingPartnerRequestSave,
} from '@services/dexie/preaching_partner';
import { displaySnackNotification } from '@services/states/app';
import { formatDate, generateDateFromTime } from '@utils/date';
import { getMessageByCode, getTranslation } from '@services/i18n/translation';
import { hour24FormatState, userLocalUIDState } from '@states/settings';

const MINISTRY_TYPES = [
  PreachingPartnerMinistryType.DoorToDoor,
  PreachingPartnerMinistryType.BibleStudy,
  PreachingPartnerMinistryType.PublicWitnessing,
  PreachingPartnerMinistryType.Zoom,
  PreachingPartnerMinistryType.Phone,
  PreachingPartnerMinistryType.Flexible,
];

const useRequestEditor = ({
  open,
  onClose,
  request,
}: PreachingPartnerEditorProps) => {
  const userUID = useAtomValue(userLocalUIDState);
  const hour24 = useAtomValue(hour24FormatState);

  const [value, setValue] = useState<PreachingPartnerRequestType>(() =>
    preachingPartnerBuildRequest(userUID)
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const typeOptions = MINISTRY_TYPES.map((type) => ({
    value: type,
    label: preachingPartnerTypeLabel(type),
  }));

  const date = new Date(value.request_data.date);

  const start = value.request_data.start
    ? generateDateFromTime(value.request_data.start)
    : null;

  const end = value.request_data.end
    ? generateDateFromTime(value.request_data.end)
    : null;

  const { flexible, start: startTime, end: endTime } = value.request_data;

  const endBeforeStart =
    !flexible && !!startTime && !!endTime && endTime <= startTime;

  // a specific time needs a start; the end stays optional
  const isValid = (flexible || !!startTime) && !endBeforeStart;

  const updateData = useCallback(
    (data: Partial<PreachingPartnerRequestType['request_data']>) => {
      setValue((prev) => ({
        ...prev,
        request_data: { ...prev.request_data, ...data },
      }));
    },
    []
  );

  const handleDateChange = (value: Date | null) => {
    if (!value) return;

    updateData({ date: formatDate(value, 'yyyy/MM/dd') });
  };

  const handleFlexibleChange = (flexible: boolean) => {
    updateData(
      flexible
        ? { flexible, start: undefined, end: undefined }
        : { flexible, start: formatDate(new Date(), 'HH:00') }
    );
  };

  const handleStartChange = (value: Date) => {
    updateData({ start: formatDate(value, 'HH:mm') });
  };

  const handleEndChange = (value: Date) => {
    updateData({ end: formatDate(value, 'HH:mm') });
  };

  const handleTypeChange = (type: PreachingPartnerMinistryType) => {
    updateData({ type });
  };

  const handleCommentChange = (comment: string) => {
    updateData({ comment });
  };

  const handleSave = async () => {
    if (isProcessing || !isValid) return;

    try {
      setIsProcessing(true);

      await dbPreachingPartnerRequestSave({
        ...value,
        request_data: {
          ...value.request_data,
          updatedAt: new Date().toISOString(),
        },
      });

      setIsProcessing(false);
      onClose();
    } catch (error) {
      setIsProcessing(false);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  const handleOpenDelete = () => setIsDeleteOpen(true);

  const handleCloseDelete = () => setIsDeleteOpen(false);

  const handleConfirmDelete = async () => {
    if (!request) return;

    await dbPreachingPartnerRequestDelete(request.request_uid);

    setIsDeleteOpen(false);
    onClose();

    displaySnackNotification({
      header: getTranslation({ key: 'tr_partnerRequestDeleted' }),
      message: getTranslation({ key: 'tr_partnerRequestDeletedDesc' }),
      severity: 'success',
    });
  };

  useEffect(() => {
    if (!open) return;

    setValue(
      request ? structuredClone(request) : preachingPartnerBuildRequest(userUID)
    );
  }, [open, request, userUID]);

  return {
    value,
    date,
    start,
    end,
    hour24,
    isValid,
    endBeforeStart,
    isProcessing,
    isDeleteOpen,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,
    typeOptions,
    handleDateChange,
    handleFlexibleChange,
    handleStartChange,
    handleEndChange,
    handleTypeChange,
    handleCommentChange,
    handleSave,
  };
};

export default useRequestEditor;
