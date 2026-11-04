import { partnerDemoMode } from '@constants/index';
import { useEffect, useMemo, useState } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { PreachingPartnerConfirmProps } from '@features/ministry/preaching_partner/confirm_arrangement/index.types';
import {
  preachingPartnerTimeLabel,
  preachingPartnerTypeLabel,
} from '@services/app/preaching_partner';
import { buildPersonFullname } from '@utils/common';
import { displaySnackNotification } from '@services/states/app';
import { formatLongDateWithShortVars } from '@utils/date';
import {
  hour24FormatState,
  fullnameOptionState,
  userLocalUIDState,
} from '@states/settings';
import { getMessageByCode, getTranslation } from '@services/i18n/translation';
import { personsActiveState } from '@states/persons';
import {
  partnerMutationState,
  myPreachingPartnerRequestsState,
} from '@states/preaching_partner';

const useConfirmArrangement = ({
  open,
  request,
}: PreachingPartnerConfirmProps) => {
  const mutate = useSetAtom(partnerMutationState);
  const [confirmedRequest, setConfirmedRequest] = useState(request);
  useAtomValue(hour24FormatState);
  const persons = useAtomValue(personsActiveState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const userUID = useAtomValue(userLocalUIDState);
  const myRequests = useAtomValue(myPreachingPartnerRequestsState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [removeOwnRequests, setRemoveOwnRequests] = useState(false);

  // once I have a partner for the day, my own open request for it is stale
  const ownRequestsSameDay = myRequests.filter(
    (record) =>
      record.request_data.person_uid === userUID &&
      !record.request_data.partner_uid &&
      record.request_data.date === request.request_data.date
  );

  const typeLabel = preachingPartnerTypeLabel(request.request_data.type);

  const scheduleLabel = `${formatLongDateWithShortVars(
    request.request_data.date
  )}: ${preachingPartnerTimeLabel(request)}`;

  const publisherName = useMemo(() => {
    const person = persons.find(
      (record) => record.person_uid === request.request_data.person_uid
    );

    if (!person) return '';

    return buildPersonFullname(
      person.person_data.person_lastname.value,
      person.person_data.person_firstname.value,
      fullnameOption
    );
  }, [persons, request, fullnameOption]);

  const handleConfirm = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const confirmed = await mutate({
        action: 'join',
        request,
        withdrawRequestIds: removeOwnRequests
          ? ownRequestsSameDay.map((own) => own.request_uid)
          : [],
      });
      setConfirmedRequest(confirmed);

      setIsProcessing(false);

      displaySnackNotification({
        header: getTranslation({
          key: partnerDemoMode
            ? 'tr_arrangementConfirmed'
            : 'tr_partnerLiveConfirmed',
        }),
        message: getTranslation({
          key: 'tr_arrangementWith',
          params: { publisherName },
        }),
        severity: 'success',
      });

      setIsCalendarOpen(true);
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

  useEffect(() => {
    if (!open) setIsCalendarOpen(false);
  }, [open]);

  return {
    confirmedRequest,
    isProcessing,
    isCalendarOpen,
    typeLabel,
    scheduleLabel,
    publisherName,
    ownRequestsSameDay,
    removeOwnRequests,
    setRemoveOwnRequests,
    handleConfirm,
  };
};

export default useConfirmArrangement;
