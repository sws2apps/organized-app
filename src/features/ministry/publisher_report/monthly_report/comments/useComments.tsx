import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  reportUserSelectedMonthState,
  userFieldServiceMonthlyReportsState,
} from '@states/user_field_service_reports';
import { UserFieldServiceMonthlyReportType } from '@definition/user_field_service_reports';
import { userFieldServiceMonthlyReportSchema } from '@services/dexie/schema';
import { debounceUserFieldServiceSave } from '@services/app/user_field_service_reports';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { useAppTranslation } from '@hooks/index';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';

const useComments = () => {
  const { t } = useAppTranslation();

  const currentMonth = useRecoilValue(reportUserSelectedMonthState);
  const reports = useRecoilValue(userFieldServiceMonthlyReportsState);

  const stats = useMinistryMonthlyRecord(currentMonth);

  const [comments, setComments] = useState(stats.comments);

  const monthReport = useMemo(() => {
    return reports.find((record) => record.report_date === currentMonth);
  }, [reports, currentMonth]);

  const handleCommentsChange = async (value: string) => {
    setComments(value);

    try {
      let report: UserFieldServiceMonthlyReportType;

      if (!monthReport) {
        report = structuredClone(userFieldServiceMonthlyReportSchema);
        report.report_date = currentMonth;
      }

      if (monthReport) {
        report = structuredClone(monthReport);
      }

      report.report_data.shared_ministry = stats.shared_ministry;
      report.report_data.bible_studies = stats.bible_studies;
      report.report_data.hours = stats.hours;
      report.report_data.hours_credits = {
        approved_assignments: stats.approved_assignments,
        events: stats.hours_credits,
      };
      report.report_data.comments = value;
      report.report_data.updatedAt = new Date().toISOString();

      debounceUserFieldServiceSave(report);
    } catch (error) {
      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    setComments(stats.comments);
  }, [stats.comments]);

  return { comments, handleCommentsChange };
};

export default useComments;
