import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import {
  TimerRecordType,
  UserFieldServiceDailyReportType,
} from '@definition/user_field_service_reports';
import { userBibleStudiesState } from '@states/user_bible_studies';
import { UserBibleStudyType } from '@definition/user_bible_studies';
import { dayNamesState, monthNamesState } from '@states/app';
import { useAppTranslation } from '@hooks/index';

const useMinistryDailyRecord = (report: UserFieldServiceDailyReportType) => {
  const { t } = useAppTranslation();

  const bibleStudiesRecords = useRecoilValue(userBibleStudiesState);
  const monthNames = useRecoilValue(monthNamesState);
  const dayNames = useRecoilValue(dayNamesState);

  const fullDate = useMemo(() => {
    if (!report) return '';

    const reportDate = new Date(report.report_date);

    const year = reportDate.getFullYear();
    const month = reportDate.getMonth();
    const date = reportDate.getDate();
    const day = reportDate.getDay();

    const monthName = monthNames[month];
    const dayName = dayNames[day];

    return t('tr_longDateWithYearAndDayLocale', {
      year,
      month: monthName,
      date,
      day: dayName,
    });
  }, [report, monthNames, dayNames, t]);

  const hours_field = useMemo(() => {
    if (!report) return '';

    const hours = report.report_data.hours.field_service;

    if (hours === '' || hours === '0:00') return '';

    return hours;
  }, [report]);

  const hours_credit = useMemo(() => {
    if (!report) return '';

    const hours = report.report_data.hours.credit;

    if (hours === '' || hours === '0:00') return '';

    return hours;
  }, [report]);

  const bibleStudies = useMemo(() => {
    if (!report) return { value: 0, records: [] };

    const studies: UserBibleStudyType[] = [];

    for (const study of report.report_data.bible_studies.records) {
      const found = bibleStudiesRecords.find(
        (record) => record.person_uid === study
      );

      if (found) studies.push(found);
    }

    return {
      value: report.report_data.bible_studies.value || 0,
      records: studies,
    };
  }, [report, bibleStudiesRecords]);

  const timer: TimerRecordType = useMemo(() => {
    if (!report) {
      return { state: 'not_started', value: 0, start: 0 };
    }

    return report.report_data.timer;
  }, [report]);

  return { hours_field, hours_credit, bibleStudies, fullDate, timer };
};

export default useMinistryDailyRecord;
