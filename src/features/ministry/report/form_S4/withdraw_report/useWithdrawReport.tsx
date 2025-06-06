import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { WithdrawReportProps } from './index.types';
import { displaySnackNotification } from '@services/states/app';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import { dbUserFieldServiceReportsSave } from '@services/dexie/user_field_service_reports';
import { accountTypeState, congAccessCodeState } from '@states/settings';
import {
  apiUserFieldServiceReportPost,
  apiValidateMe,
} from '@services/api/user';
import { decryptData, encryptObject } from '@services/encryption';
import {
  apiPocketFieldServiceReportPost,
  apiPocketValidateMe,
} from '@services/api/pocket';
import { UserFieldServiceMonthlyReportType } from '@definition/user_field_service_reports';
import {
  delegatedFieldServiceReportSchema,
  userFieldServiceMonthlyReportSchema,
} from '@services/dexie/schema';
import { DelegatedFieldServiceReportType } from '@definition/delegated_field_service_reports';
import { dbDelegatedFieldServiceReportsSave } from '@services/dexie/delegated_field_service_reports';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';
import { dbFieldServiceReportsSave } from '@services/dexie/cong_field_service_reports';

const useWithdrawReport = ({
  onClose,
  month,
  person_uid,
}: WithdrawReportProps) => {
  const { t } = useAppTranslation();

  const { isSecretary, isGroupOverseer, isLanguageGroupOverseer } =
    useCurrentUser();

  const accountType = useAtomValue(accountTypeState);
  const localAccessCode = useAtomValue(congAccessCodeState);

  const { userReport, delegatedReport, isSelf, congReport } =
    useMinistryMonthlyRecord({ month, person_uid, publisher: true });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleAPI = async () => {
    const report = {
      person_uid: person_uid,
      report_month: month,
      updatedAt: new Date().toISOString(),
      _deleted: true,
    };

    if (accountType === 'vip') {
      const whoami = await apiValidateMe();
      const data = whoami.result;
      const remoteCode = data.cong_access_code;

      const accessCode = decryptData(
        remoteCode,
        localAccessCode,
        'access_code'
      );

      encryptObject({ data: report, table: 'incoming_reports', accessCode });

      await apiUserFieldServiceReportPost(report);
    }

    if (accountType === 'pocket') {
      const whoami = await apiPocketValidateMe();
      const data = whoami.result;
      const remoteCode = data.app_settings.cong_settings.cong_access_code;

      const accessCode = decryptData(
        remoteCode,
        localAccessCode,
        'access_code'
      );

      encryptObject({ data: report, table: 'incoming_reports', accessCode });

      await apiPocketFieldServiceReportPost(report);
    }
  };

  const handleWithdrawal = async () => {
    try {
      setIsProcessing(true);

      if (!isSecretary && !isGroupOverseer && !isLanguageGroupOverseer) {
        await handleAPI();
      }

      if (isSelf) {
        let report: UserFieldServiceMonthlyReportType;

        if (!userReport && congReport) {
          report = structuredClone(userFieldServiceMonthlyReportSchema);

          report.report_date = month;
          report.report_data.bible_studies.monthly =
            congReport.report_data.bible_studies;
          report.report_data.comments = congReport.report_data.comments;
          report.report_data.hours.field_service.monthly = `${congReport.report_data.hours.field_service}:00`;
          report.report_data.hours.credit.monthly = `${congReport.report_data.hours.credit.approved}:00`;
          report.report_data.shared_ministry =
            congReport.report_data.shared_ministry;
          report.report_data.status = 'pending';
          report.report_data.updatedAt = congReport.report_data.updatedAt;
        }

        if (userReport) {
          report = structuredClone(userReport);
          report.report_data.status = 'pending';
          report.report_data.updatedAt = new Date().toISOString();
        }

        await dbUserFieldServiceReportsSave(report);
      }

      if (!isSelf) {
        let report: DelegatedFieldServiceReportType;

        if (!delegatedReport && congReport) {
          report = structuredClone(delegatedFieldServiceReportSchema);

          report.report_id = crypto.randomUUID();
          report.report_data.report_date = month;
          report.report_data.person_uid = person_uid;
          report.report_data.bible_studies.monthly =
            congReport.report_data.bible_studies;
          report.report_data.comments = congReport.report_data.comments;
          report.report_data.hours.field_service.monthly = `${congReport.report_data.hours.field_service}:00`;
          report.report_data.hours.credit.monthly = `${congReport.report_data.hours.credit.approved}:00`;
          report.report_data.shared_ministry =
            congReport.report_data.shared_ministry;
          report.report_data.status = 'pending';
          report.report_data.updatedAt = congReport.report_data.updatedAt;
        }

        if (delegatedReport) {
          report = structuredClone(delegatedReport);
          report.report_data.status = 'pending';
          report.report_data.updatedAt = new Date().toISOString();
        }

        await dbDelegatedFieldServiceReportsSave(report);
      }

      if (congReport) {
        const report = structuredClone(congReport);
        report.report_data._deleted = true;

        if (isSecretary || isGroupOverseer || isLanguageGroupOverseer) {
          report.report_data.updatedAt = new Date().toISOString();
        }

        await dbFieldServiceReportsSave(report);
      }

      displaySnackNotification({
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

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return { handleWithdrawal, isProcessing };
};

export default useWithdrawReport;
