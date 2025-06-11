import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { AddTimeDialogProps } from './index.types';
import { userFieldServiceDailyReportsState } from '@states/user_field_service_reports';
import { formatDate } from '@utils/date';

const useAddTimeDialog = ({ time, onAdd, onClose }: AddTimeDialogProps) => {
  const reports = useAtomValue(userFieldServiceDailyReportsState);

  const today = useMemo(() => {
    return formatDate(new Date(), 'yyyy/MM/dd');
  }, []);

  const initialValue = useMemo(() => {
    const report = reports.find((record) => record.report_date === today);

    if (!report) return time;

    return report.report_data.timer.value;
  }, [reports, today, time]);

  const [value, setValue] = useState(initialValue);

  const handleValueChange = (value: number) => {
    setValue(value);
  };

  const handleAddTime = () => {
    onAdd?.(value);
    onClose();
  };

  return { handleValueChange, handleAddTime, value };
};

export default useAddTimeDialog;
