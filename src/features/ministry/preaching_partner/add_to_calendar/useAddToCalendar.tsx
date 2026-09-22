import { useState } from 'react';
import { createEvent, EventAttributes } from 'ics';
import { saveAs } from 'file-saver';
import { PreachingPartnerCalendarProps } from './index.types';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { preachingPartnerTypeLabel } from '@services/app/preaching_partner';

const DEFAULT_DURATION_MINUTES = 60;

const parseTime = (time?: string) => {
  if (!time) return null;

  const [hours, minutes] = time.split(':').map(Number);

  return { hours, minutes };
};

const useAddToCalendar = ({
  request,
  onClose,
}: PreachingPartnerCalendarProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddToCalendar = () => {
    if (isProcessing) return;

    setIsProcessing(true);

    const { date, flexible, start, end, type } = request.request_data;
    const day = new Date(date);

    const startTime = parseTime(start);
    const endTime = parseTime(end);

    const eventDetails: EventAttributes = {
      title: preachingPartnerTypeLabel(type),
      description: request.request_data.comment,
      // an anytime request lands as a whole-day event
      start:
        flexible || !startTime
          ? [day.getFullYear(), day.getMonth() + 1, day.getDate()]
          : [
              day.getFullYear(),
              day.getMonth() + 1,
              day.getDate(),
              startTime.hours,
              startTime.minutes,
            ],
      ...(flexible || !startTime
        ? { end: [day.getFullYear(), day.getMonth() + 1, day.getDate() + 1] }
        : endTime
          ? {
              end: [
                day.getFullYear(),
                day.getMonth() + 1,
                day.getDate(),
                endTime.hours,
                endTime.minutes,
              ],
            }
          : { duration: { minutes: DEFAULT_DURATION_MINUTES } }),
    };

    createEvent(eventDetails, (error, value) => {
      setIsProcessing(false);

      if (error) {
        console.error(error);

        displaySnackNotification({
          header: getMessageByCode('error_app_generic-title'),
          message: getMessageByCode(error.message),
          severity: 'error',
        });

        return;
      }

      const blob = new Blob([value], { type: 'text/calendar' });

      saveAs(blob, `${request.request_uid}.ics`);

      onClose();
    });
  };

  return { isProcessing, handleAddToCalendar };
};

export default useAddToCalendar;
