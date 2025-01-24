import { ReactElement, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { IconCheck, IconClose } from '@components/icons';
import { useCurrentUser } from '@hooks/index';
import {
  buildPublisherReportMonths,
  currentMonthServiceYear,
} from '@utils/date';
import {
  reportUserSelectedMonthState,
  userFieldServiceMonthlyReportsState,
} from '@states/user_field_service_reports';
import { congFieldServiceReportsState } from '@states/field_service_reports';
import { userLocalUIDState } from '@states/settings';
import usePerson from '@features/persons/hooks/usePerson';

const useMonthlyReport = () => {
  const { person, first_report } = useCurrentUser();

  const { personIsEnrollmentActive } = usePerson();

  const [selectedMonth, setSelectedMonth] = useRecoilState(
    reportUserSelectedMonthState
  );

  const reports = useRecoilValue(userFieldServiceMonthlyReportsState);
  const congReports = useRecoilValue(congFieldServiceReportsState);
  const userUID = useRecoilValue(userLocalUIDState);

  const [initialValue, setInitialValue] = useState<number | boolean>(false);

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

      const congReport = congReports.find(
        (record) =>
          record.report_data.report_date === month.value &&
          record.report_data.person_uid === userUID
      );

      const userReport = reports.find(
        (record) => record.report_date === month.value
      );

      if (congReport) {
        if (congReport.report_data.shared_ministry) {
          icon = <IconCheck height={20} width={20} />;
        }

        if (!congReport.report_data.shared_ministry) {
          icon = <IconClose height={20} width={20} />;
        }
      }

      if (!congReport && userReport) {
        if (userReport.report_data.status !== 'pending') {
          icon = <IconCheck height={20} width={20} />;
        }

        if (
          userReport.report_data.status === 'pending' &&
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
  }, [monthsList, reports, congReports, userUID]);

  const initialMonthReport = useMemo(() => {
    return currentMonthServiceYear();
  }, []);

  const handleMonthChange = (value: number) => {
    setSelectedMonth(monthsList.at(value).value);
  };

  useEffect(() => {
    setSelectedMonth(initialMonthReport);

    setTimeout(() => {
      const value = monthsList.findIndex(
        (record) => record.value === initialMonthReport
      );

      setInitialValue(value);
    }, 1000);
  }, [setSelectedMonth, initialMonthReport, monthsList]);

  return {
    monthsTab,
    handleMonthChange,
    selectedMonth,
    isHourEnabled,
    initialValue,
    userUID,
  };
};

export default useMonthlyReport;
