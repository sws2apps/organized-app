import { useCallback, useEffect, useRef, useState } from 'react';
import { isValid as isValidDate } from 'date-fns';
import { partnerDate, partnerRequestIsValid } from '@utils/preaching_partner';
import {
  partnerCanCreateState,
  partnerMutationState,
  partnerTodayState,
} from '@states/preaching_partner';
import { useSetAtom, useAtomValue } from 'jotai';
import { PreachingPartnerEditorProps } from '@features/ministry/preaching_partner/request_editor/index.types';
import {
  PreachingPartnerMinistryType,
  PreachingPartnerRequestType,
} from '@definition/preaching_partner';
import {
  preachingPartnerBuildRequest,
  preachingPartnerTypeLabel,
} from '@services/app/preaching_partner';
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
  onSaved,
  request,
}: PreachingPartnerEditorProps) => {
  const mutate = useSetAtom(partnerMutationState);
  const canCreate = useAtomValue(partnerCanCreateState);
  const today = useAtomValue(partnerTodayState);
  const userUID = useAtomValue(userLocalUIDState);
  const hour24 = useAtomValue(hour24FormatState);

  const [value, setValue] = useState<PreachingPartnerRequestType>(() =>
    preachingPartnerBuildRequest(userUID)
  );
  const original = useRef(value);
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const [dateInputError, setDateInputError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const typeOptions = MINISTRY_TYPES.map((type) => ({
    value: type,
    label: preachingPartnerTypeLabel(type),
  }));

  const date = value.request_data.date
    ? partnerDate(value.request_data.date)
    : null;

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
  const isValid =
    canCreate && !dateInputError && partnerRequestIsValid(value, today);
  const dateError =
    !!dateInputError ||
    !date ||
    !isValidDate(date) ||
    value.request_data.date < today;

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
    updateData({
      date: value && isValidDate(value) ? formatDate(value, 'yyyy/MM/dd') : '',
    });
  };

  const handleFlexibleChange = (flexible: boolean) => {
    updateData(
      flexible
        ? { flexible, start: undefined, end: undefined }
        : { flexible, start: formatDate(new Date(), 'HH:00') }
    );
  };

  const handleStartChange = (value: Date | null) => {
    updateData({
      start:
        value && isValidDate(value) ? formatDate(value, 'HH:mm') : undefined,
    });
  };

  const handleEndChange = (value: Date | null) => {
    updateData({
      end: value && isValidDate(value) ? formatDate(value, 'HH:mm') : undefined,
    });
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

      await mutate({ action: request ? 'edit' : 'create', request: value });

      setIsProcessing(false);
      onClose();
      onSaved?.();
    } catch (error) {
      setIsProcessing(false);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(
          error instanceof Error && error.message.startsWith('tr_partner')
            ? error.message
            : 'tr_partnerActionFailed'
        ),
        severity: 'error',
      });
    }
  };

  const handleClose = () => {
    if (isProcessing) return;
    if (
      JSON.stringify(value.request_data) !==
      JSON.stringify(original.current.request_data)
    )
      setIsDiscardOpen(true);
    else onClose();
  };

  const handleOpenDelete = () => setIsDeleteOpen(true);

  const handleCloseDelete = () => setIsDeleteOpen(false);

  const handleConfirmDelete = async () => {
    if (!request) return;

    await mutate({ action: 'delete', request });

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

    setIsDeleteOpen(false);
    setIsDiscardOpen(false);
    setDateInputError(null);
    original.current = request
      ? structuredClone(request)
      : preachingPartnerBuildRequest(userUID);
    setValue(original.current);
  }, [open, request, userUID]);

  return {
    value,
    isDiscardOpen,
    handleClose,
    handleCloseDiscard: () => setIsDiscardOpen(false),
    handleDiscard: () => {
      setIsDiscardOpen(false);
      onClose();
    },
    dateError,
    handleDateError: setDateInputError,
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
