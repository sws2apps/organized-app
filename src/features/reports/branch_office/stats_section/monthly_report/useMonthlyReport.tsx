import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { monthNamesState } from '@states/app';
import { MonthlyReportProps } from './index.types';
import { branchFieldReportsState } from '@states/branch_field_service_reports';

const useMonthlyReport = ({ month }: MonthlyReportProps) => {
  const { t } = useAppTranslation();

  const monthNames = useAtomValue(monthNamesState);
  const reports = useAtomValue(branchFieldReportsState);

  const monthname = useMemo(() => {
    if (!month || month.length === 0) return '';

    const [year, varMonth] = month.split('/');

    const name = monthNames[+varMonth - 1];

    return t('tr_monthYear', { month: name, year: year });
  }, [monthNames, t, month]);

  const report = useMemo(() => {
    return reports.find((record) => record.report_date === month);
  }, [reports, month]);

  const generated = useMemo(() => {
    if (!report) return false;

    return true;
  }, [report]);

  const month_overview = useMemo(() => {
    const result = [
      {
        label: t('tr_activePublishers'),
        value: report?.report_data.publishers_active || 0,
      },
      {
        label: t('tr_averageAttendanceWM'),
        value: report?.report_data.weekend_meeting_average || 0,
      },
    ];

    return result;
  }, [t, report]);

  const field_reports = useMemo(() => {
    const result = [
      {
        section: t('tr_publishers'),
        reports: [
          {
            label: t('tr_numberReports'),
            value: report?.report_data.publishers.report_count || 0,
          },
          {
            label: t('tr_bibleStudies'),
            value: report?.report_data.publishers.bible_studies || 0,
          },
        ],
      },
      {
        section: t('tr_APs'),
        reports: [
          {
            label: t('tr_numberReports'),
            value: report?.report_data.APs.report_count || 0,
          },
          {
            label: t('tr_hours'),
            value: report?.report_data.APs.hours || 0,
          },
          {
            label: t('tr_bibleStudies'),
            value: report?.report_data.APs.bible_studies || 0,
          },
        ],
      },
      {
        section: t('tr_FRs'),
        reports: [
          {
            label: t('tr_numberReports'),
            value: report?.report_data.FRs.report_count || 0,
          },
          {
            label: t('tr_hours'),
            value: report?.report_data.FRs.hours || 0,
          },
          {
            label: t('tr_bibleStudies'),
            value: report?.report_data.FRs.bible_studies || 0,
          },
        ],
      },
    ];

    return result;
  }, [t, report]);

  return { monthname, generated, month_overview, field_reports };
};

export default useMonthlyReport;
