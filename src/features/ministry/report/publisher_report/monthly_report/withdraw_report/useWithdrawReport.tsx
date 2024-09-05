import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  reportUserSelectedMonthState,
  userFieldServiceMonthlyReportsState,
} from '@states/user_field_service_reports';
import { WithdrawReportProps } from './index.types';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import { dbUserFieldServiceReportsSave } from '@services/dexie/user_field_service_reports';
import { apiUserFieldServiceReportDelete } from '@services/api/user';
import { secretaryRoleState } from '@states/settings';

const useWithdrawReport = ({ onClose }: WithdrawReportProps) => {
  const { t } = useAppTranslation();

  const selectedMonth = useRecoilValue(reportUserSelectedMonthState);
  const monthlyReports = useRecoilValue(userFieldServiceMonthlyReportsState);
  const secretary = useRecoilValue(secretaryRoleState);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleWithdrawal = async () => {
    try {
      setIsProcessing(true);

      if (!secretary) {
        await apiUserFieldServiceReportDelete({ report_month: selectedMonth });
      }

      let report = monthlyReports.find(
        (record) => record.report_date === selectedMonth
      );

      report = structuredClone(report);

      report.report_data.status = 'pending';

      await dbUserFieldServiceReportsSave(report);

      await displaySnackNotification({
        header: t('tr_done'),
        message: t('tr_undoSubmissionDone'),
        severity: 'success',
      });

      setIsProcessing(false);

      onClose?.();
    } catch (error) {
      console.error(error);

      setIsProcessing(false);

      onClose?.();

      await displaySnackNotification({
        header: t('tr_errorTitle'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return {
    handleWithdrawal,
    isProcessing,
  };
};

export default useWithdrawReport;
