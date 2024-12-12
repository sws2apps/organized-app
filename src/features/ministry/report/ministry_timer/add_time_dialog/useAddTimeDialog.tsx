import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { AddTimeDialogProps } from './index.types';
import { userFieldServiceDailyReportsState } from '@states/user_field_service_reports';
import { formatDate } from '@services/dateformat';

const useAddTimeDialog = ({ onAdd, onClose }: AddTimeDialogProps) => {
  const reports = useRecoilValue(userFieldServiceDailyReportsState);

  const today = useMemo(() => {
    return formatDate(new Date(), 'yyyy/MM/dd');
  }, []);

  const initialValue = useMemo(() => {
    const report = reports.find((record) => record.report_date === today);

    if (!report) return 0;

    if (report.report_data.hours.field_service.length === 0) return 0;

    const [hours, minutes] = report.report_data.hours.field_service.split(':');
    return +hours * 3600 + +minutes * 60;
  }, [reports, today]);

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
