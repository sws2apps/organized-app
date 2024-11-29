import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  reportUserSelectedMonthState,
  userFieldServiceMonthlyReportsState,
} from '@states/user_field_service_reports';
import { UserFieldServiceMonthlyReportType } from '@definition/user_field_service_reports';
import { userFieldServiceMonthlyReportSchema } from '@services/dexie/schema';
import { dbUserFieldServiceReportsSave } from '@services/dexie/user_field_service_reports';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';
import { congFieldServiceReportsState } from '@states/field_service_reports';
import { userLocalUIDState } from '@states/settings';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';

const useMinistryShared = () => {
  const currentMonth = useRecoilValue(reportUserSelectedMonthState);
  const reports = useRecoilValue(userFieldServiceMonthlyReportsState);
  const congReports = useRecoilValue(congFieldServiceReportsState);
  const userUID = useRecoilValue(userLocalUIDState);

  const { shared_ministry, status } = useMinistryMonthlyRecord(currentMonth);

  const [checked, setChecked] = useState(shared_ministry);

  const readOnly = useMemo(() => {
    const findReport = congReports.find(
      (record) =>
        record.report_data.report_date === currentMonth &&
        record.report_data.person_uid === userUID
    );

    return findReport ? true : false;
  }, [congReports, currentMonth, userUID]);

  const monthReport = useMemo(() => {
    return reports.find((record) => record.report_date === currentMonth);
  }, [reports, currentMonth]);

  const handleToggleChecked = async (value: boolean) => {
    if (status !== 'pending') return;

    try {
      let report: UserFieldServiceMonthlyReportType;

      if (!monthReport) {
        report = structuredClone(userFieldServiceMonthlyReportSchema);
        report.report_date = currentMonth;
      }

      if (monthReport) {
        report = structuredClone(monthReport);
      }

      report.report_data.shared_ministry = value;
      report.report_data.updatedAt = new Date().toISOString();

      await dbUserFieldServiceReportsSave(report);
    } catch (error) {
      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    setChecked(shared_ministry);
  }, [shared_ministry]);

  return { checked, handleToggleChecked, status, readOnly };
};

export default useMinistryShared;
