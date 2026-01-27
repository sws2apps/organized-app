import { useState } from 'react';
import { createEvent, EventAttributes } from 'ics';
import { AddToCalendarProps } from './index.types';
import {
  UpcomingEventCategory,
  UpcomingEventDuration,
} from '@definition/upcoming_events';
import { useAppTranslation } from '@hooks/index';
import { decorationsForEvent } from '../decorations_for_event';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { saveAs } from 'file-saver';

const useAddToCalendar = ({ event }: AddToCalendarProps) => {
  const { t } = useAppTranslation();
  const [isProcessing, setIsProcessing] = useState(false);

  const eventDecoration =
    event.event_data.category !== undefined &&
    event.event_data.category < decorationsForEvent.length
      ? decorationsForEvent[event.event_data.category]
      : decorationsForEvent[decorationsForEvent.length - 1];

  const handleAddToCalendar = () => {
    if (isProcessing) return;

    setIsProcessing(true);

    const startDate = new Date(event.event_data.start);
    const endDate = new Date(event.event_data.end);

    const eventTitle =
      event.event_data.category !== UpcomingEventCategory.Custom
        ? t(eventDecoration.translationKey)
        : event.event_data.custom;

    const eventDetails: EventAttributes = {
      title: eventTitle,
      description: event.event_data.description,
      start:
        event.event_data.duration === UpcomingEventDuration.SingleDay
          ? [
              startDate.getFullYear(),
              startDate.getMonth() + 1,
              startDate.getDate(),
              startDate.getHours(),
              startDate.getMinutes(),
            ]
          : [
              startDate.getFullYear(),
              startDate.getMonth() + 1,
              startDate.getDate(),
            ],
      end:
        event.event_data.duration === UpcomingEventDuration.SingleDay
          ? [
              endDate.getFullYear(),
              endDate.getMonth() + 1,
              endDate.getDate(),
              endDate.getHours(),
              endDate.getMinutes(),
            ]
          : [
              endDate.getFullYear(),
              endDate.getMonth() + 1,
              endDate.getDate() + 1,
            ],
    };

    createEvent(eventDetails, (error, value) => {
      if (error) {
        console.error(error);

        setIsProcessing(false);

        displaySnackNotification({
          header: getMessageByCode('error_app_generic-title'),
          message: getMessageByCode(error.message),
          severity: 'error',
        });
      } else {
        const blob = new Blob([value], { type: 'text/calendar' });

        const filename = `${event.event_uid}.ics`;

        saveAs(blob, filename);
      }
      setIsProcessing(false);
    });
  };

  return {
    isProcessing,
    handleAddToCalendar,
  };
};

export default useAddToCalendar;
