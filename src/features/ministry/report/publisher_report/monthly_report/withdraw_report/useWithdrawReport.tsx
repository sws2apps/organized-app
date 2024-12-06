import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  reportUserSelectedMonthState,
  userFieldServiceMonthlyReportsState,
} from '@states/user_field_service_reports';
import { WithdrawReportProps } from './index.types';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import { dbUserFieldServiceReportsSave } from '@services/dexie/user_field_service_reports';
import {
  accountTypeState,
  congAccessCodeState,
  userLocalUIDState,
} from '@states/settings';
import {
  apiUserFieldServiceReportPost,
  apiValidateMe,
} from '@services/api/user';
import { decryptData, encryptObject } from '@services/encryption';
import {
  apiPocketFieldServiceReportPost,
  apiPocketValidateMe,
} from '@services/api/pocket';

const useWithdrawReport = ({ onClose }: WithdrawReportProps) => {
  const { t } = useAppTranslation();

  const { isSecretary, isGroupOverseer } = useCurrentUser();

  const selectedMonth = useRecoilValue(reportUserSelectedMonthState);
  const monthlyReports = useRecoilValue(userFieldServiceMonthlyReportsState);
  const accountType = useRecoilValue(accountTypeState);
  const userUID = useRecoilValue(userLocalUIDState);
  const localAccessCode = useRecoilValue(congAccessCodeState);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleAPI = async () => {
    const report = {
      person_uid: userUID,
      report_month: selectedMonth,
      updatedAt: new Date().toISOString(),
      _deleted: true,
    };

    if (accountType === 'vip') {
      const whoami = await apiValidateMe();
      const data = whoami.result;
      const remoteCode = data.cong_access_code;
      const accessCode = decryptData(remoteCode, localAccessCode);

      encryptObject({ data: report, table: 'incoming_reports', accessCode });

      await apiUserFieldServiceReportPost(report);
    }

    if (accountType === 'pocket') {
      const whoami = await apiPocketValidateMe();
      const data = whoami.result;
      const remoteCode = data.app_settings.cong_settings.cong_access_code;
      const accessCode = decryptData(remoteCode, localAccessCode);

      encryptObject({ data: report, table: 'incoming_reports', accessCode });

      await apiPocketFieldServiceReportPost(report);
    }
  };

  const handleWithdrawal = async () => {
    try {
      setIsProcessing(true);

      if (!isSecretary && !isGroupOverseer) {
        await handleAPI();
      }

      const findReport = monthlyReports.find(
        (record) => record.report_date === selectedMonth
      );

      const report = structuredClone(findReport);
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
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return { handleWithdrawal, isProcessing };
};

export default useWithdrawReport;
