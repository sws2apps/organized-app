import { pdf } from '@react-pdf/renderer';
import { getMessageByCode } from '@services/i18n/translation';
import { displaySnackNotification } from '@services/recoil/app';
import {
  congNameState,
  JWLangLocaleState,
  settingsState,
  userDataViewState,
} from '@states/settings';
import { upcomingEventsState } from '@states/upcoming_events';
import TemplateUpcomingEvents from '@views/upcoming_events';
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

const useExportUpcomingEvents = () => {
  const upcomingEvents = useRecoilValue(upcomingEventsState);
  const congName = useRecoilValue(congNameState);
  const locale = useRecoilValue(JWLangLocaleState);
  const settings = useRecoilValue(settingsState);
  const dataView = useRecoilValue(userDataViewState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showExportButton, setShowExportButton] = useState(false);

  useEffect(() => {
    setShowExportButton(upcomingEvents.length != 0);
  }, [upcomingEvents.length]);

  const timeFormat = settings.cong_settings.format_24h_enabled.find(
    (record) => record.type === dataView
  ).value;

  const handleExport = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const blob = await pdf(
        <TemplateUpcomingEvents
          events={upcomingEvents}
          congregation={congName}
          lang={locale}
          use24={timeFormat}
        />
      ).toBlob();

      const filename = 'Upcoming_Events.pdf';

      saveAs(blob, filename);
    } catch (error) {
      console.error(error);

      setIsProcessing(false);

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return {
    handleExport,
    isProcessing,
    showExportButton,
  };
};

export default useExportUpcomingEvents;
