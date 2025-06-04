import { useAppTranslation } from '@hooks/index';
import { pdf } from '@react-pdf/renderer';
import { getMessageByCode } from '@services/i18n/translation';
import { displaySnackNotification } from '@services/states/app';
import {
  congNameState,
  JWLangLocaleState,
  shortDateFormatState,
} from '@states/settings';
import { upcomingEventsState } from '@states/upcoming_events';
import TemplateUpcomingEvents from '@views/congregation/upcoming_events';
import saveAs from 'file-saver';
import { useAtomValue } from 'jotai';
import { useState } from 'react';

const useExportUpcomingEvents = () => {
  const { t } = useAppTranslation();
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
          shortDateFormat={shortDateFormat}
          lang={locale}
          congregation={congName}
        />
      ).toBlob();

      const filename = `${t('tr_upcomingEvents').replaceAll(' ', '_')}.pdf`;

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
