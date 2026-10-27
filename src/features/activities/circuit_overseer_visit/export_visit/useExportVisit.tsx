import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { pdf } from '@react-pdf/renderer';
import saveAs from 'file-saver';
import {
  UpcomingEventCategory,
  UpcomingEventDuration,
} from '@definition/upcoming_events';
import { CIRCUIT_OVERSEER_EVENT_LABELS } from '@constants/circuit_overseer_visit';
import { useAppTranslation } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import { displaySnackNotification } from '@services/states/app';
import { upcomingEventData } from '@services/app/upcoming_events';
import { congNameState, JWLangLocaleState } from '@states/settings';
import { circuitOverseerVisitDate } from '@utils/circuit_overseer_visit';
import { ExportVisitProps } from './index.types';
import TemplateCircuitOverseerVisit from '@views/activities/circuit_overseer_visit';

const useExportVisit = ({ visit, events }: ExportVisitProps) => {
  const { t } = useAppTranslation();

  const locale = useAtomValue(JWLangLocaleState);
  const congName = useAtomValue(congNameState);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleExport = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const eventsForPDF = events.map((event) => {
        const data = event.event_data;
        const start = circuitOverseerVisitDate(visit.weekOf, data.day);

        if (data.time) {
          const [hours, minutes] = data.time.split(':').map(Number);
          start.setHours(hours, minutes);
        }

        return upcomingEventData({
          event_uid: event.event_uid,
          event_data: {
            _deleted: false,
            updatedAt: data.updatedAt,
            start: start.toISOString(),
            end: start.toISOString(),
            type: 'main',
            category: UpcomingEventCategory.Custom,
            custom: t(CIRCUIT_OVERSEER_EVENT_LABELS[data.category]),
            description: [data.address, data.notes].filter(Boolean).join('\n'),
            duration: UpcomingEventDuration.SingleDay,
            wholeDay: !data.time,
          },
        });
      });

      const title = t('tr_COVisitSchedule');

      const blob = await pdf(
        <TemplateCircuitOverseerVisit
          title={title}
          events={eventsForPDF}
          congregation={congName}
          lang={locale}
        />
      ).toBlob();

      saveAs(blob, `${title}-${visit.weekOf.replaceAll('/', '-')}.pdf`);
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode((error as Error).message),
        severity: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return { isProcessing, handleExport };
};

export default useExportVisit;
