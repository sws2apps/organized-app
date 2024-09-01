import { ReactElement, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { IconCheck, IconReportNotSent } from '@components/icons';
import { buildPublisherReportMonths, currentReportMonth } from '@utils/date';
import {
  reportUserSelectedMonthState,
  userFieldServiceMonthlyReportsState,
} from '@states/user_field_service_reports';
import { personIsEnrollmentActive } from '@services/app/persons';
import { useCurrentUser } from '@hooks/index';

const useMonthlyReport = () => {
  const { person } = useCurrentUser();

  const [selectedMonth, setSelectedMonth] = useRecoilState(
    reportUserSelectedMonthState
  );

  const reports = useRecoilValue(userFieldServiceMonthlyReportsState);

  const [initialValue, setInitialValue] = useState<number | boolean>(false);

  const isHourEnabled = useMemo(() => {
    if (!person) return false;

    const isAP = personIsEnrollmentActive(person, 'AP', selectedMonth);
    const isFMF = personIsEnrollmentActive(person, 'FMF', selectedMonth);
    const isFR = personIsEnrollmentActive(person, 'FR', selectedMonth);
    const isFS = personIsEnrollmentActive(person, 'FS', selectedMonth);

    return isAP || isFMF || isFR || isFS;
  }, [person, selectedMonth]);

  const monthsList = useMemo(() => {
    const firstMonthReport = person.person_data.first_month_report.value;
    const date = new Date(firstMonthReport);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const miniMonth = `${year}/${String(month).padStart(2, '0')}`;

    const results = buildPublisherReportMonths();
    return results.filter((record) => record.value >= miniMonth);
  }, [person]);

  const monthsTab = useMemo(() => {
    const currentMonth = currentReportMonth();

    return monthsList.map((month) => {
      let icon: ReactElement;

      const monthInReport = reports.find(
        (record) => record.report_date === month.value
      );

      if (monthInReport) {
        if (monthInReport.report_data.status !== 'pending') {
          icon = <IconCheck height={20} width={20} color="var(--accent-400)" />;
        }

        if (
          monthInReport.report_data.status === 'pending' &&
          month.value < currentMonth
        ) {
          icon = (
            <IconReportNotSent
              height={20}
              width={20}
              color="var(--red-main) !important"
            />
          );
        }
      }

      return {
        label: month.label,
        icon,
      };
    });
  }, [monthsList, reports]);

  const handleMonthChange = (value: number) => {
    setSelectedMonth(monthsList.at(value).value);
  };

  useEffect(() => {
    setSelectedMonth('');

    setTimeout(() => {
      const current = currentReportMonth();

      const value = monthsList.findIndex((record) => record.value === current);
      setSelectedMonth(monthsList.at(value).value);

      setInitialValue(value);
    }, 500);
  }, [monthsList, setSelectedMonth]);

  return {
    monthsTab,
    initialValue,
    handleMonthChange,
    selectedMonth,
    isHourEnabled,
  };
};

export default useMonthlyReport;
