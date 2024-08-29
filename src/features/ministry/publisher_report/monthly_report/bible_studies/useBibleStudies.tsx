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

const useBibleStudies = () => {
  const currentMonth = useRecoilValue(reportUserSelectedMonthState);
  const reports = useRecoilValue(userFieldServiceReportsState);

  const [value, setValue] = useState(0);

  const defaultValue = useMemo(() => {
    if (!currentMonth || currentMonth?.length === 0) return 0;

    // check if month reports already exists
    const monthReport = reports.find(
      (record) => record.report_date === currentMonth
    ) as UserFieldServiceMonthlyReportType;
    if (monthReport) {
      return monthReport.report_data.bible_studies;
    }

    // default to daily reports to determine the shared value
    const dailyReports = reports.filter((record) =>
      record.report_date.includes(currentMonth)
    ) as UserFieldServiceDailyReportType[];

    // check for named records
    const bibleStudiesWithNames = dailyReports
      .filter((record) => record.report_data.bible_studies.records.length > 0)
      .reduce((names: string[], current) => {
        for (const name of current.report_data.bible_studies.records) {
          const found = names.find((record) => record === name);

          if (!found) {
            names.push(name);
          }
        }

        return names;
      }, []);

    if (bibleStudiesWithNames.length > 0) {
      return bibleStudiesWithNames.length;
    }

    // make an average of the total count
    const values = dailyReports
      .filter((record) => record.report_data.bible_studies.value > 0)
      .map((record) => record.report_data.bible_studies.value);

    if (values.length > 0) {
      const sumValues = values.reduce((total, current) => total + current, 0);

      return Math.round(sumValues / values.length);
    }

    return 0;
  }, [currentMonth, reports]);

  const handleValueChange = (value: number) => {
    setValue(value);
  };

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return { value, handleValueChange };
};

export default useBibleStudies;
