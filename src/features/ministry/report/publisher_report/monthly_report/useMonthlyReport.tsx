import { ReactElement, useEffect, useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { IconCheck, IconClose } from '@components/icons';
import {
  buildPublisherReportMonths,
  currentMonthServiceYear,
} from '@utils/date';
import {
  reportUserSelectedMonthState,
  userFieldServiceMonthlyReportsState,
} from '@states/user_field_service_reports';
import { useCurrentUser } from '@hooks/index';
import usePerson from '@features/persons/hooks/usePerson';

const useMonthlyReport = () => {
  const { person, first_report } = useCurrentUser();

  const { personIsEnrollmentActive } = usePerson();

  const [selectedMonth, setSelectedMonth] = useRecoilState(
    reportUserSelectedMonthState
  );

  const reports = useRecoilValue(userFieldServiceMonthlyReportsState);

  const isHourEnabled = useMemo(() => {
    if (!person) return false;

    const isAP = personIsEnrollmentActive(person, 'AP', selectedMonth);
    const isFMF = personIsEnrollmentActive(person, 'FMF', selectedMonth);
    const isFR = personIsEnrollmentActive(person, 'FR', selectedMonth);
    const isFS = personIsEnrollmentActive(person, 'FS', selectedMonth);

    return isAP || isFMF || isFR || isFS;
  }, [person, selectedMonth, personIsEnrollmentActive]);

  const monthsList = useMemo(() => {
    if (!person) return [];

    const firstMonthReport = first_report;
    const date = new Date(firstMonthReport);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const miniMonth = `${year}/${String(month).padStart(2, '0')}`;

    const results = buildPublisherReportMonths();
    return results.filter((record) => record.value >= miniMonth);
  }, [person, first_report]);

  const monthsTab = useMemo(() => {
    const currentMonth = currentMonthServiceYear();

    return monthsList.map((month) => {
      let icon: ReactElement;

      const monthInReport = reports.find(
        (record) => record.report_date === month.value
      );

      if (monthInReport) {
        if (monthInReport.report_data.status !== 'pending') {
          icon = <IconCheck height={20} width={20} />;
        }

        if (
          monthInReport.report_data.status === 'pending' &&
          month.value < currentMonth
        ) {
          icon = <IconClose height={20} width={20} />;
        }
      }

      return {
        label: month.label,
        icon,
      };
    });
  }, [monthsList, reports]);

  const initialValue = useMemo(() => {
    const current = currentMonthServiceYear();
    const value = monthsList.findIndex((record) => record.value === current);
    return value;
  }, [monthsList]);

  const initialMonthReport = useMemo(() => {
    return currentMonthServiceYear();
  }, []);

  const handleMonthChange = (value: number) => {
    setSelectedMonth(monthsList.at(value).value);
  };

  useEffect(() => {
    setSelectedMonth(initialMonthReport);
  }, [setSelectedMonth, initialMonthReport]);

  return {
    monthsTab,
    handleMonthChange,
    selectedMonth,
    isHourEnabled,
    initialValue,
  };
};

export default useMonthlyReport;
