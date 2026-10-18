import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { JWLangLocaleState, shortDateFormatState } from '@states/settings';
import { territoriesState } from '@states/territories';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { formatDate } from '@utils/date';
import { TemplateS13 } from '@views/index';
import { S13Row } from '@views/territories/S13';
import { Territory } from '@definition/territory';
import { displayDate, parseDate, serviceYear } from '../helpers';

const time = (value?: string) => parseDate(value)?.getTime() ?? 0;

const rowsFor = (
  territory: Territory,
  year: number,
  format: string
): S13Row[] => {
  // service year N runs from 1 September of N-1 to 31 August of N
  const yearStart = new Date(year - 1, 8, 1).getTime();
  const yearEnd = new Date(year, 8, 1).getTime() - 1;

  const inYear = territory.assignments
    .filter(
      (item) =>
        time(item.assignedOn) <= yearEnd &&
        (item.returnedOn ? time(item.returnedOn) : Date.now()) >= yearStart
    )
    .sort((a, b) => time(a.assignedOn) - time(b.assignedOn));

  const lastCompleted = territory.assignments
    .filter((item) => item.returnedOn && time(item.returnedOn) < yearStart)
    .sort((a, b) => time(b.returnedOn) - time(a.returnedOn))[0]?.returnedOn;

  const entries = inYear.map((item) => ({
    publisher: item.publisher,
    assignedOn: displayDate(item.assignedOn, format),
    completedOn: item.returnedOn && displayDate(item.returnedOn, format),
  }));

  const lines = Math.max(1, Math.ceil(entries.length / 4));

  return Array.from({ length: lines }, (_, index) => ({
    number: index === 0 ? territory.number : '',
    lastCompleted:
      index === 0 && lastCompleted
        ? displayDate(lastCompleted, format)
        : undefined,
    entries: entries.slice(index * 4, index * 4 + 4),
  }));
};

const useExportS13 = () => {
  const territories = useAtomValue(territoriesState);
  const lang = useAtomValue(JWLangLocaleState);
  const dateFormat = useAtomValue(shortDateFormatState);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleExport = async (year = serviceYear()) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const rows = [...territories]
        .sort((a, b) =>
          a.number.localeCompare(b.number, undefined, { numeric: true })
        )
        .flatMap((territory) => rowsFor(territory, year, dateFormat));

      const blob = await pdf(
        <TemplateS13
          serviceYear={year}
          createdOn={formatDate(new Date(), dateFormat)}
          rows={rows}
          lang={lang}
        />
      ).toBlob();

      saveAs(blob, `S-13_${year}.pdf`);
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

  return { handleExport, isProcessing };
};

export default useExportS13;
