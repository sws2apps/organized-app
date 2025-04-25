import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useAtomValue } from 'jotai';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { currentReportMonth } from '@utils/date';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { personsState } from '@states/persons';
import { JWLangLocaleState } from '@states/settings';
import usePublisherCard from '@features/reports/hooks/usePublisherCard';
import TemplateS21Doc2in1 from '@views/reports/S21/2in1';

const useExportS21 = () => {
  const { id } = useParams();

  const { getCardsData } = usePublisherCard();

  const persons = useAtomValue(personsState);
  const sourceLocale = useAtomValue(JWLangLocaleState);

  const [isProcessing, setIsProcessing] = useState(false);

  const years = useMemo(() => {
    const result: string[] = [];
    const currentMonth = currentReportMonth();
    const year = currentMonth.split('/')[0];
    const prevYear = String(+year - 1).toString();

    result.push(prevYear, year);

    return result;
  }, []);

  const person = useMemo(() => {
    return persons.find((record) => record.person_uid === id);
  }, [persons, id]);

  const handleExport = async () => {
    if (!person) return;

    try {
      setIsProcessing(true);

      const data = getCardsData(id);

      const blob = await pdf(
        <TemplateS21Doc2in1 data={data} lang={sourceLocale} />
      ).toBlob();

      const filename = `S-21_${data.at(0).name}.pdf`;

      saveAs(blob, filename);

      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);

      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return { years, handleExport, isProcessing };
};

export default useExportS21;
