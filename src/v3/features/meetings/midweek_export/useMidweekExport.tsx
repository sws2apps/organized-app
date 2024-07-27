import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { useAppTranslation } from '@hooks/index';
import { MidweekExportType } from './index.types';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { useRecoilValue } from 'recoil';
import { schedulesState } from '@states/schedules';
import {
  MidweekMeetingDataType,
  S89DataType,
  SchedWeekType,
} from '@definition/schedules';
import {
  schedulesMidweekData,
  schedulesS89Data,
} from '@services/app/schedules';
import { userDataViewState } from '@states/settings';
import { TemplateS89 } from '@views/index';
import { JWLangState } from '@states/app';

const useMidweekExport = (onClose: MidweekExportType['onClose']) => {
  const { t } = useAppTranslation();

  const schedules = useRecoilValue(schedulesState);
  const dataView = useRecoilValue(userDataViewState);
  const lang = useRecoilValue(JWLangState);

  const [startMonth, setStartMonth] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [exportS140, setExportS140] = useState(false);
  const [exportS89, setExportS89] = useState(false);

  const handleSetStartMonth = (value: string) => setStartMonth(value);

  const handleSetEndMonth = (value: string) => setEndMonth(value);

  const handleToggleS140 = () => setExportS140((prev) => !prev);

  const handleToggleS89 = () => setExportS89((prev) => !prev);

  const handleExportS89 = async (weeks: SchedWeekType[]) => {
    const S89: S89DataType[] = [];

    for await (const schedule of weeks) {
      const data = await schedulesS89Data(schedule, dataView);
      S89.push(...data);
    }

    if (S89.length > 0) {
      const blob = await pdf(
        <TemplateS89 s89Data={S89} lang={lang} />
      ).toBlob();

      saveAs(blob, 'S89.pdf');
    }
  };

  const handleExportS140 = async (weeks: SchedWeekType[]) => {
    const S140: MidweekMeetingDataType[] = [];

    for await (const schedule of weeks) {
      const data = await schedulesMidweekData(schedule, dataView, lang);
      S140.push(data);
    }

    console.log(S140);
  };

  const handleExportSchedule = async () => {
    if (startMonth.length === 0 || endMonth.length === 0) return;
    if (!exportS140 && !exportS89) return;

    try {
      setIsProcessing(true);

      // get affected weeks list
      const weeksList = schedules.filter((schedule) => {
        const [yearStart, monthStart] = startMonth.split('/');
        const [yearEnd, monthEnd] = endMonth.split('/');

        const [yearCurrent, monthCurrent] = schedule.weekOf.split('/');

        return (
          (yearCurrent === yearStart && monthCurrent === monthStart) ||
          (yearCurrent === yearEnd && monthCurrent === monthEnd)
        );
      });

      if (exportS89) {
        await handleExportS89(weeksList);
      }

      if (exportS140) {
        await handleExportS140(weeksList);
      }

      setIsProcessing(false);
      // onClose?.();
    } catch (error) {
      console.error(error);

      setIsProcessing(false);
      onClose?.();

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return {
    handleSetStartMonth,
    handleSetEndMonth,
    isProcessing,
    handleExportSchedule,
    exportS140,
    exportS89,
    handleToggleS140,
    handleToggleS89,
  };
};

export default useMidweekExport;
