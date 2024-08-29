import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { bibleStudyEditorOpenState } from '@states/user_bible_studies';
import {
  reportUserDraftState,
  reportUserSelectedMonthState,
  userFieldServiceReportsState,
} from '@states/user_field_service_reports';
import { formatDate } from '@services/dateformat';
import { ReportDailyProps } from './index.types';
import { UserFieldServiceDailyReportSchema } from '@services/dexie/schema';
import { UserFieldServiceDailyReportType } from '@definition/user_field_service_reports';

const useReportDaily = ({ isEdit, date }: ReportDailyProps) => {
  const reportMonth = useRecoilValue(reportUserSelectedMonthState);
  const bibleStudyOpen = useRecoilValue(bibleStudyEditorOpenState);
  const reports = useRecoilValue(userFieldServiceReportsState);

  const setDraftReport = useSetRecoilState(reportUserDraftState);

  const [dateValue, setDateValue] = useState(() => {
    if (date?.length > 0) return date;

    const [year, month] = reportMonth.split('/');

    const selectedYear = +year;
    const selectedMonth = +month - 1;

    const now = new Date();

    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    if (selectedYear === currentYear && selectedMonth === currentMonth) {
      return formatDate(now, 'yyyy/MM/dd');
    }

    return `${reportMonth}/01`;
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

  const currentReport = useMemo(() => {
    if (!isEdit) {
      const report = structuredClone(UserFieldServiceDailyReportSchema);
      report.report_date = dateValue;

      return report;
    }

    const report = reports.find((record) => record.report_date === dateValue);
    if (report) {
      return report as UserFieldServiceDailyReportType;
    }
  }, [isEdit, dateValue, reports]);

  const handleDateChange = (value: Date) => {
    setDateValue(formatDate(value, 'yyyy/MM/dd'));
  };

  useEffect(() => {
    if (date) {
      setDateValue(date);
    }
  }, [date]);

  useEffect(() => {
    setDraftReport(currentReport);
  }, [currentReport, setDraftReport]);

  return {
    bibleStudyOpen,
    dateValue,
    minDate,
    maxDate,
    handleDateChange,
  };
};

export default useReportDaily;
