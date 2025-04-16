import { useAppTranslation } from '@hooks/index';
import { AddToCalendarButtonProps } from './index.types';
import * as ics from 'ics';
import { saveAs } from 'file-saver';
import { decorationsForEvent } from '../decorations_for_event';
import { UpcomingEventCategory } from '@definition/upcoming_events';

const useAddToCalendarButton = ({ event }: AddToCalendarButtonProps) => {
  const { t } = useAppTranslation();

  const parseDate = (date: string) => {
    const dateTime = new Date(date);
    return [
      dateTime.getUTCFullYear(),
      dateTime.getUTCMonth() + 1,
      dateTime.getUTCDate(),
    ];
  };

  const parseTime = (time: string) => {
    const dateTime = new Date(time);
    return [dateTime.getUTCHours(), dateTime.getUTCMinutes()];
  };

  const eventDate = parseDate(event.event_data.date);
  const eventTime = parseTime(event.event_data.time);
  const eventDateTime = [...eventDate, ...eventTime];

  const eventType = event.event_data.type;

  const eventTitle =
    eventType === UpcomingEventCategory.Custom
      ? event.event_data.custom ||
        t(decorationsForEvent[eventType].translationKey)
      : t(decorationsForEvent[eventType].translationKey);

  const formattedDate = `${eventDate[0]}-${String(eventDate[1]).padStart(2, '0')}-${String(eventDate[2]).padStart(2, '0')}`;
  const formattedTime = `${String(eventTime[0]).padStart(2, '0')}-${String(eventTime[1]).padStart(2, '0')}`;
  const eventFileName = `${formattedDate}_${formattedTime}__${eventTitle}.ics`;

  const eventForGenerateICS: ics.EventAttributes = {
    start: eventDateTime as [number, number, number, number, number],
    title: eventTitle,
    description: event.event_data.additional,
    duration: { days: 1 },
  };

  const onAddToCalendarButtonClick = () => {
    ics.createEvent(eventForGenerateICS, (error, value) => {
      if (error) {
        console.error(error);
        return;
      }

      saveAs(new Blob([value], { type: 'text/calendar' }), eventFileName);
    });
  };

  return { onAddToCalendarButtonClick };
};

export default useAddToCalendarButton;
