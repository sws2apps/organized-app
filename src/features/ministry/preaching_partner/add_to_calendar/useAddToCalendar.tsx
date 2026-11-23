import { partnerDemoMode } from '@constants/index';
import { useAtomValue } from 'jotai';
import { personsActiveState } from '@states/persons';
import { fullnameOptionState, userLocalUIDState } from '@states/settings';
import { useAppTranslation } from '@hooks/index';
import { buildPersonFullname } from '@utils/common';
import { useState } from 'react';
import { createEvent } from 'ics';
import { saveAs } from 'file-saver';
import { PreachingPartnerCalendarProps } from '@features/ministry/preaching_partner/add_to_calendar/index.types';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { preachingPartnerTypeLabel } from '@services/app/preaching_partner';
import { partnerCalendarEvent } from '@utils/preaching_partner';

const useAddToCalendar = ({
  request,
  onClose,
}: PreachingPartnerCalendarProps) => {
  const { t } = useAppTranslation();
  const persons = useAtomValue(personsActiveState);
  const userUID = useAtomValue(userLocalUIDState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const [isProcessing, setIsProcessing] = useState(false);
  const handleAddToCalendar = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const counterpart =
        request.request_data.person_uid === userUID
          ? request.request_data.partner_uid
          : request.request_data.person_uid;
      const person = persons.find(
        (record) => record.person_uid === counterpart
      );
      const publisherName = person
        ? buildPersonFullname(
            person.person_data.person_lastname.value,
            person.person_data.person_firstname.value,
            fullnameOption
          )
        : t('tr_partnerUnavailable');
      const event = partnerCalendarEvent(
        request,
        t(
          partnerDemoMode
            ? 'tr_partnerCalendarTitle'
            : 'tr_partnerLiveCalendarTitle',
          {
            type: preachingPartnerTypeLabel(request.request_data.type),
            publisherName,
          }
        )
      );
      const { error, value } = createEvent(event);
      if (error || !value) throw error ?? new Error('tr_partnerCalendarFailed');
      saveAs(
        new Blob([value], { type: 'text/calendar;charset=utf-8' }),
        `${request.request_uid}.ics`
      );
      onClose();
    } catch {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode('tr_partnerCalendarFailed'),
        severity: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  return { isProcessing, handleAddToCalendar };
};
export default useAddToCalendar;
