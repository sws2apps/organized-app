import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { YearlyReportProps } from './index.types';
import { branchCongAnalysisState } from '@states/branch_cong_analysis';
import { congFullnameState } from '@states/settings';

const useYearlyReport = ({ year }: YearlyReportProps) => {
  const { t } = useAppTranslation();

  const reports = useAtomValue(branchCongAnalysisState);
  const congregation = useAtomValue(congFullnameState);

  const analysis = useMemo(() => {
    return reports.find((record) => record.report_date === year);
  }, [reports, year]);

  const generated = useMemo(() => {
    if (!analysis) return false;

    return true;
  }, [analysis]);

  const analysis_reports = useMemo(() => {
    const result = [
      {
        section: t('tr_meetingAttendance'),
        reports: [
          {
            label: t('tr_averageAttendanceMM'),
            value: analysis?.report_data.meeting_average.midweek || 0,
          },
          {
            label: t('tr_averageAttendanceWM'),
            value: analysis?.report_data.meeting_average.weekend || 0,
          },
        ],
      },
      {
        section: t('tr_publishers'),
        reports: [
          {
            label: t('tr_activePublishers'),
            value: analysis?.report_data.publishers.active || 0,
          },
          {
            label: t('tr_inactivePublishers'),
            value: analysis?.report_data.publishers.inactive || 0,
          },
          {
            label: t('tr_reactivatedPublishers'),
            value: analysis?.report_data.publishers.reactivated || 0,
          },
        ],
      },
    ];

    return result;
  }, [t, analysis]);

  return { generated, analysis_reports, congregation };
};

export default useYearlyReport;
