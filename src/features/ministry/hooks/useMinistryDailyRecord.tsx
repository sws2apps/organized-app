import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { UserFieldServiceDailyReportType } from '@definition/user_field_service_reports';
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

  const hours = useMemo(() => {
    return report.report_data.hours || '';
  }, [report]);

  const approved_assignments = useMemo(() => {
    return report.report_data.approved_assignments || '';
  }, [report]);

  const total_hours = useMemo(() => {
    let tHours = 0;
    let tMinutes = 0;

    if (hours.length > 0) {
      tHours = +hours.split(':')[0];
      tMinutes = +hours.split(':')[1];
    }

    if (approved_assignments.length > 0) {
      tHours += +approved_assignments.split(':')[0];
      tMinutes += +approved_assignments.split(':')[1];
    }

    const remain = tMinutes % 60;
    tHours += (tMinutes - remain) / 60;
    tMinutes = remain;

    if (tHours === 0 && tMinutes === 0) return '';

    const value = `${tHours}:${String(tMinutes).padStart(2, '0')}`;

    return value;
  }, [hours, approved_assignments]);

  const bibleStudies = useMemo(() => {
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

  return { hours, approved_assignments, bibleStudies, fullDate, total_hours };
};

export default useMinistryDailyRecord;
