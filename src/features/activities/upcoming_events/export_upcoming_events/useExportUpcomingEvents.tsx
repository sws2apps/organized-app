import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { pdf } from '@react-pdf/renderer';
import saveAs from 'file-saver';
import { getMessageByCode } from '@services/i18n/translation';
import { displaySnackNotification } from '@services/states/app';
import { congNameState, JWLangLocaleState } from '@states/settings';
import { upcomingEventsByDataViewState } from '@states/upcoming_events';
import {
  groupEventsByYear,
  upcomingEventData,
} from '@services/app/upcoming_events';
import TemplateUpcomingEvents from '@views/activities/upcoming_events';

const useExportUpcomingEvents = () => {
  const locale = useAtomValue(JWLangLocaleState);
  const congName = useAtomValue(congNameState);
  const events = useAtomValue(upcomingEventsByDataViewState);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleExport = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const rawSortedEvents = groupEventsByYear(events);

      const eventsForPDF = rawSortedEvents.map((rawEventsGroup) => {
        return rawEventsGroup.map((eventForPDF) => {
          return upcomingEventData(eventForPDF);
        });
      });

      if (eventsForPDF.length === 0) {
        setIsProcessing(false);
        return;
      }

      const blob = await pdf(
        <TemplateUpcomingEvents
          events={eventsForPDF}
          congregation={congName}
          lang={locale}
        />
      ).toBlob();

      const filename = 'UpcomingEvents.pdf';

      saveAs(blob, filename);
      setIsProcessing(false);
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return { isProcessing, handleExport };
};

export default useExportUpcomingEvents;
