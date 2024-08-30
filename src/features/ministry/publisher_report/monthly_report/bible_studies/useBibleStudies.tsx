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
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';
import { userBibleStudiesState } from '@states/user_bible_studies';

const useBibleStudies = () => {
  const { t } = useAppTranslation();

  const currentMonth = useRecoilValue(reportUserSelectedMonthState);
  const reports = useRecoilValue(userFieldServiceReportsState);
  const bibleStudies = useRecoilValue(userBibleStudiesState);

  const [value, setValue] = useState(0);

  const namedRecords = useMemo(() => {
    const dailyReports = reports.filter(
      (record) =>
        record.report_date !== currentMonth &&
        record.report_date.includes(currentMonth)
    ) as UserFieldServiceDailyReportType[];

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

    return bibleStudiesWithNames.map((record) => {
      const person = bibleStudies.find((study) => study.person_uid === record);

      return person?.person_data.person_name || '';
    });
  }, [reports, currentMonth, bibleStudies]);

  const namedRecordsCount = useMemo(() => {
    return namedRecords.length;
  }, [namedRecords]);

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
    if (namedRecordsCount > 0) {
      return namedRecordsCount;
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
  }, [currentMonth, reports, namedRecordsCount]);

  const handleValueChange = (value: number) => {
    setValue(value);
  };

  const bibleStudiesValidator = async (value: number) => {
    if (value >= namedRecordsCount) return true;

    await displaySnackNotification({
      header: t('tr_cantDeductStudiesTitle'),
      message: t('tr_cantDeductStudiesDesc'),
      severity: 'error',
    });

    return false;
  };

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return { value, handleValueChange, bibleStudiesValidator, namedRecords };
};

export default useBibleStudies;
