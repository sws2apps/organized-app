import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { MonthsRecordProps } from './index.types';
import { formatDate } from '@services/dateformat';
import { addMonths } from '@utils/date';
import { congSpecialMonthsState } from '@states/settings';
import { SpecialMonthType } from '@definition/settings';
import { dbAppSettingsUpdate } from '@services/dexie/settings';

const useMonthsRecord = ({ month }: MonthsRecordProps) => {
  const specialMonths = useRecoilValue(congSpecialMonthsState);

  const [startMonth, setStartMonth] = useState<Date>(null);
  const [endMonth, setEndMonth] = useState<Date>(null);

  const startMinDate = useMemo(() => {
    const lastMonth = addMonths(new Date(), -1);
    lastMonth.setDate(1);

    return lastMonth;
  }, []);

  const handleUpdateMonths = async (month: SpecialMonthType) => {
    const newMonths = structuredClone(specialMonths);

    const foundMonth = newMonths.find((record) => record.id === month.id);
    if (!foundMonth) {
      month.updatedAt = new Date().toISOString();
      newMonths.push(month);
    }

    if (foundMonth) {
      for (const [key, value] of Object.entries(month)) {
        foundMonth[key] = value;
      }
      foundMonth.updatedAt = new Date().toISOString();
    }

    await dbAppSettingsUpdate({ 'cong_settings.special_months': newMonths });
  };

  const handleStartDateChange = async (value: Date) => {
    if (value === null) {
      setStartMonth(value);
    }

    if (value) {
      const newMonth = structuredClone(month);

      value.setDate(1);
      setStartMonth(value);
      newMonth.month_start = formatDate(value, 'yyyy/MM/dd');

      if (endMonth !== null) {
        newMonth.month_end = formatDate(endMonth, 'yyyy/MM/dd');
      }

      if (endMonth === null || endMonth < value) {
        const year = value.getFullYear();
        const month = value.getMonth() + 1;
        const endDate = new Date(year, month, 0);
        setEndMonth(endDate);

        newMonth.month_end = formatDate(endDate, 'yyyy/MM/dd');
      }

      await handleUpdateMonths(newMonth);
    }
  };

  const handleEndDateChange = async (value: Date) => {
    if (value === null) {
      setStartMonth(value);
    }

    if (value) {
      const newMonth = structuredClone(month);

      const year = value.getFullYear();
      const monthEnd = value.getMonth() + 1;
      const date = new Date(year, monthEnd, 0);
      setEndMonth(date);

      newMonth.month_start = formatDate(startMonth, 'yyyy/MM/dd');
      newMonth.month_end = formatDate(date, 'yyyy/MM/dd');

      await handleUpdateMonths(newMonth);
    }
  };

  useEffect(() => {
    if (month.month_start !== null) {
      setStartMonth(new Date(month.month_start));
    }

    if (month.month_end !== null) {
      setEndMonth(new Date(month.month_end));
    }
  }, [month]);

  return {
    startMonth,
    endMonth,
    handleStartDateChange,
    handleEndDateChange,
    startMinDate,
  };
};

export default useMonthsRecord;
