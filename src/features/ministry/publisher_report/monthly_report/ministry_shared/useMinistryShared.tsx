import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  reportUserSelectedMonthState,
  userFieldServiceReportsState,
} from '@states/user_field_service_reports';
import {
  UserFieldServiceDailyReportType,
  UserFieldServiceMonthlyReportType,
} from '@definition/user_field_service_reports';

const useMinistryShared = () => {
  const currentMonth = useRecoilValue(reportUserSelectedMonthState);
  const reports = useRecoilValue(userFieldServiceReportsState);

  const [checked, setChecked] = useState(false);

  const defaultValue = useMemo(() => {
    if (!currentMonth || currentMonth?.length === 0) return false;

    // check if month reports already exists
    const monthReport = reports.find(
      (record) => record.report_date === currentMonth
    ) as UserFieldServiceMonthlyReportType;
    if (monthReport) {
      return monthReport.report_data.shared_ministry;
    }

    // default to daily reports to determine the shared value
    const dailyReports = reports.filter((record) =>
      record.report_date.includes(currentMonth)
    ) as UserFieldServiceDailyReportType[];

    const hoursMinutes = dailyReports
      .filter((record) => record.report_data.hours.length > 0)
      .map((record) => record.report_data.hours.split(':'));

    const sumHours = hoursMinutes.reduce(
      (prev, current) => prev + +current[0],
      0
    );

    const sumMinutes = hoursMinutes.reduce(
      (prev, current) => prev + +current[1],
      0
    );

    const sumBibleStudies = dailyReports.reduce(
      (prev, current) => prev + current.report_data.bible_studies.value,
      0
    );

    if (sumHours > 0 || sumMinutes > 0 || sumBibleStudies > 0) {
      return true;
    }
  }, [currentMonth, reports]);

  const handleToggleChecked = (value: boolean) => {
    setChecked(value);
  };

  useEffect(() => {
    setChecked(defaultValue);
  }, [defaultValue]);

  return { checked, handleToggleChecked };
};

export default useMinistryShared;
