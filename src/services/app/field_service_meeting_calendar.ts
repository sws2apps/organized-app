import { createEvent, EventAttributes } from 'ics';
import { saveAs } from 'file-saver';
import {
  FieldServiceMeetingFormattedType,
  FIELD_SERVICE_MEETING_CATEGORY_TRANSLATION_KEYS,
} from '@definition/field_service_meetings';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
export const fieldServiceMeetingCalendarExport = (
  meeting: FieldServiceMeetingFormattedType,
  t: (key: string) => string
) => {
  const summary = t(
    FIELD_SERVICE_MEETING_CATEGORY_TRANSLATION_KEYS[meeting.category]
  );

  const descriptionParts: string[] = [];
  if (meeting.conductor) {
    descriptionParts.push(`${t('tr_conductor')}: ${meeting.conductor}`);
  }
  if (meeting.additionalInfo) descriptionParts.push(meeting.additionalInfo);

  const startDate = new Date(meeting.startISO);
  const endDate = new Date(meeting.endISO);

  const eventDetails: EventAttributes = {
    title: summary,
    description: descriptionParts.join('\n'),
    location: meeting.address,
    start: [
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      startDate.getDate(),
      startDate.getHours(),
      startDate.getMinutes(),
    ],
    end: [
      endDate.getFullYear(),
      endDate.getMonth() + 1,
      endDate.getDate(),
      endDate.getHours(),
      endDate.getMinutes(),
    ],
  };

  createEvent(eventDetails, (error, value) => {
    if (error) {
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });

      return;
    }

    const blob = new Blob([value], { type: 'text/calendar' });
    saveAs(blob, 'field-service-meeting.ics');
  });
};
