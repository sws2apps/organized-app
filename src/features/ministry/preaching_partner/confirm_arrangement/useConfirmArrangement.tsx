import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { PreachingPartnerConfirmProps } from './index.types';
import {
  preachingPartnerTimeLabel,
  preachingPartnerTypeLabel,
} from '@services/app/preaching_partner';
import { buildPersonFullname } from '@utils/common';
import {
  dbPreachingPartnerRequestDelete,
  dbPreachingPartnerRequestUpdate,
} from '@services/dexie/preaching_partner';
import { displaySnackNotification } from '@services/states/app';
import { formatLongDateWithShortVars } from '@utils/date';
import { fullnameOptionState, userLocalUIDState } from '@states/settings';
import { getMessageByCode, getTranslation } from '@services/i18n/translation';
import { personsActiveState } from '@states/persons';
import { myPreachingPartnerRequestsState } from '@states/preaching_partner';

const useConfirmArrangement = ({
  open,
  request,
}: PreachingPartnerConfirmProps) => {
  const persons = useAtomValue(personsActiveState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const userUID = useAtomValue(userLocalUIDState);
  const myRequests = useAtomValue(myPreachingPartnerRequestsState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [removeOwnRequests, setRemoveOwnRequests] = useState(true);

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

      await dbPreachingPartnerRequestUpdate(request.request_uid, {
        partner_uid: userUID,
        arranged_at: new Date().toISOString(),
      });

      if (removeOwnRequests) {
        for (const own of ownRequestsSameDay) {
          await dbPreachingPartnerRequestDelete(own.request_uid);
        }
      }

      setIsProcessing(false);

      displaySnackNotification({
        header: getTranslation({ key: 'tr_arrangementConfirmed' }),
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
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    if (!open) setIsCalendarOpen(false);
  }, [open]);

  return {
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
