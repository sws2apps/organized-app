import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { WeekendExportType } from './index.types';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { schedulesState } from '@states/schedules';
import { WeekendMeetingDataType } from '@definition/schedules';
import { schedulesWeekendData } from '@services/app/schedules';
import {
  congNameState,
  JWLangLocaleState,
  userDataViewState,
} from '@states/settings';
import { TemplateWeekendMeeting } from '@views/index';

const useWeekendExport = (onClose: WeekendExportType['onClose']) => {
  const schedules = useRecoilValue(schedulesState);
  const dataView = useRecoilValue(userDataViewState);
  const congName = useRecoilValue(congNameState);
  const sourceLang = useRecoilValue(JWLangLocaleState);

  const [startWeek, setStartWeek] = useState('');
  const [endWeek, setEndWeek] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSetStartWeek = (value: string) => setStartWeek(value);

  const handleSetEndWeek = (value: string) => setEndWeek(value);

  const handleExportSchedule = async () => {
    if (startWeek.length === 0 || endWeek.length === 0) return;

    try {
      setIsProcessing(true);

      const weeksList = schedules.filter(
        (record) => record.weekOf >= startWeek && record.weekOf <= endWeek
      );

      const meetingData: WeekendMeetingDataType[] = [];

      for await (const schedule of weeksList) {
        const data = await schedulesWeekendData(schedule, dataView);
        meetingData.push(data);
      }

      const firstWeek = meetingData.at(0).weekOf.replaceAll('/', '');
      const lastWeek = meetingData.at(-1).weekOf.replaceAll('/', '');

      const blob = await pdf(
        <TemplateWeekendMeeting
          data={meetingData}
          cong_name={congName}
          lang={sourceLang}
        />
      ).toBlob();

      const filename = `WM_${firstWeek}-${lastWeek}.pdf`;

      saveAs(blob, filename);

      setIsProcessing(false);
      onClose?.();
    } catch (error) {
      console.error(error);

      setIsProcessing(false);
      onClose?.();

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return {
    isProcessing,
    handleSetStartWeek,
    handleSetEndWeek,
    handleExportSchedule,
  };
};

export default useWeekendExport;
