import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { reportUserSelectedMonthState } from '@states/user_field_service_reports';

const useServiceTime = () => {
  const reportMonth = useRecoilValue(reportUserSelectedMonthState);

  const [date, setDate] = useState(() => {
    const [year, month] = reportMonth.split('/');

    const selectedYear = +year;
    const selectedMonth = +month - 1;

    const now = new Date();

    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    if (selectedYear === currentYear && selectedMonth === currentMonth) {
      return now;
    }

    return new Date(selectedYear, selectedMonth, 1);
  });

  const minDate = useMemo(() => {
    const [year, month] = reportMonth.split('/');
    const result = new Date(+year, +month - 1, 1);

    return result;
  }, [reportMonth]);

  const maxDate = useMemo(() => {
    const [currentYear, currentMonth] = reportMonth.split('/');

    let year = +currentYear;
    let month = +currentMonth - 1;

    if (month === 11) {
      month = 0;
      year = year + 1;
    } else {
      month = month + 1;
    }

    const result = new Date(year, month, -1);

    return result;
  }, [reportMonth]);

  const handleDateChange = (value: Date) => setDate(value);

  return { date, handleDateChange, minDate, maxDate };
};

export default useServiceTime;
