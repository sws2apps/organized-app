import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  reportUserSelectedMonthState,
  userFieldServiceReportsState,
} from '@states/user_field_service_reports';
import { UserFieldServiceMonthlyReportType } from '@definition/user_field_service_reports';
import { userFieldServiceMonthlyReportSchema } from '@services/dexie/schema';
import { dbUserFieldServiceReportsSave } from '@services/dexie/user_field_service_reports';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';

const useMinistryShared = () => {
  const { t } = useAppTranslation();

  const currentMonth = useRecoilValue(reportUserSelectedMonthState);
  const reports = useRecoilValue(userFieldServiceReportsState);

  const stats = useMinistryMonthlyRecord(currentMonth);

  const [checked, setChecked] = useState(stats.shared_ministry);

  const monthReport = useMemo(() => {
    return reports.find(
      (record) => record.report_date === currentMonth
    ) as UserFieldServiceMonthlyReportType;
  }, [reports, currentMonth]);

  const handleToggleChecked = async (value: boolean) => {
    try {
      let report: UserFieldServiceMonthlyReportType;

      if (!monthReport) {
        report = structuredClone(userFieldServiceMonthlyReportSchema);
        report.report_date = currentMonth;
      }

      if (monthReport) {
        report = structuredClone(monthReport);
      }

      report.report_data.comments = stats.comments;
      report.report_data.bible_studies = stats.bible_studies;
      report.report_data.hours = stats.hours;
      report.report_data.hours_credits = {
        approved_assignments: stats.approved_assignments,
        events: stats.hours_credits,
      };
      report.report_data.shared_ministry = value;
      report.report_data.updatedAt = new Date().toISOString();

      await dbUserFieldServiceReportsSave(report);
    } catch (error) {
      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    setChecked(stats.shared_ministry);
  }, [stats.shared_ministry]);

  return { checked, handleToggleChecked };
};

export default useMinistryShared;
