import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { HoursEditorProps } from './index.types';
import { userFieldServiceReportsState } from '@states/user_field_service_reports';
import { formatDate } from '@services/dateformat';
import { UserFieldServiceDailyReportType } from '@definition/user_field_service_reports';

const useHoursEditor = ({ date }: HoursEditorProps) => {
  const reports = useRecoilValue(userFieldServiceReportsState);

  const [value, setValue] = useState('');

  const handleValueChange = (value: string) => {
    setValue(value);
  };

  const handleIncrement = () => {
    if (value.length === 0) {
      setValue('0:01');
      return;
    }

    const [hours, minutes] = value.split(':');

    const newHours = +hours + 1;
    const newMinutes = +minutes;

    setValue(`${newHours}:${String(newMinutes).padStart(2, '0')}`);
  };

  const handleDecrement = () => {
    if (value.length === 0) {
      setValue('0:00');
      return;
    }

    const [hours, minutes] = value.split(':');

    let newHours = +hours - 1;
    let newMinutes = +minutes;

    if (newHours === -1) {
      newMinutes = 0;
      newHours = 0;
    }

    setValue(`${newHours}:${String(newMinutes).padStart(2, '0')}`);
  };

  useEffect(() => {
    const reportDate = formatDate(date, 'yyyy/MM/dd');
    const report = reports.find(
      (record) => record.report_date === reportDate
    ) as UserFieldServiceDailyReportType;

    if (report) {
      setValue(report.report_data.hours);
    }
  }, [date, reports]);

  return { value, handleIncrement, handleDecrement, handleValueChange };
};

export default useHoursEditor;
