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
import { congFieldServiceReportsState } from '@states/field_service_reports';
import { userLocalUIDState } from '@states/settings';

const useComments = () => {
  const { t } = useAppTranslation();

  const currentMonth = useRecoilValue(reportUserSelectedMonthState);
  const reports = useRecoilValue(userFieldServiceMonthlyReportsState);
  const congReports = useRecoilValue(congFieldServiceReportsState);
  const userUID = useRecoilValue(userLocalUIDState);

  const { comments, status } = useMinistryMonthlyRecord(currentMonth);

  const [value, setValue] = useState(comments);

  const readOnly = useMemo(() => {
    const findReport = congReports.find(
      (record) =>
        record.report_data.report_date === currentMonth &&
        record.report_data.person_uid === userUID
    );

    return findReport ? true : false;
  }, [congReports, currentMonth, userUID]);

  const userReport = useMemo(() => {
    return reports.find((record) => record.report_date === currentMonth);
  }, [reports, currentMonth]);

  const handleCommentsChange = async (value: string) => {
    if (status !== 'pending') return;

    setValue(value);

    try {
      let report: UserFieldServiceMonthlyReportType;

      if (!userReport) {
        report = structuredClone(userFieldServiceMonthlyReportSchema);
        report.report_date = currentMonth;
      }

      if (userReport) {
        report = structuredClone(userReport);
      }

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
    setValue(comments);
  }, [comments]);

  return { value, handleCommentsChange, status, readOnly };
};

export default useComments;
