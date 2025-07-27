import { pdf } from '@react-pdf/renderer';
import { getMessageByCode } from '@services/i18n/translation';
import { displaySnackNotification } from '@services/states/app';
import {
  congNameState,
  JWLangLocaleState,
  shortDateFormatState,
} from '@states/settings';
import { upcomingEventsState } from '@states/upcoming_events';
import { TemplateUpcomingEvents } from '@views/index';
import saveAs from 'file-saver';
import { useAtomValue } from 'jotai';
import { useState } from 'react';

const useExportUpcomingEvents = () => {
  const locale = useAtomValue(JWLangLocaleState);
  const congName = useAtomValue(congNameState);
  const shortDateFormat = useAtomValue(shortDateFormatState);
  const [isProcessing, setIsProcessing] = useState(false);
  const events = useAtomValue(upcomingEventsState);

  const handleExport = async () => {
    if (isProcessing) return;
    try {
      setIsProcessing(true);

      const blob = await pdf(
        <TemplateUpcomingEvents
          events={events}
          congregation={congName}
          lang={locale}
          shortDateFormat={shortDateFormat}
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
