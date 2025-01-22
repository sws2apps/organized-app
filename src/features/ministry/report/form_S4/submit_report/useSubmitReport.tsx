import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  userFieldServiceDailyReportsState,
  userFieldServiceMonthlyReportsState,
} from '@states/user_field_service_reports';
import { SubmitReportProps } from './index.types';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import { currentReportMonth } from '@utils/date';
import {
  congFieldServiceReportSchema,
  userFieldServiceDailyReportSchema,
  userFieldServiceMonthlyReportSchema,
} from '@services/dexie/schema';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';
import { dbUserFieldServiceReportsSave } from '@services/dexie/user_field_service_reports';
import {
  apiUserFieldServiceReportPost,
  apiValidateMe,
} from '@services/api/user';
import {
  accountTypeState,
  congAccessCodeState,
  secretaryRoleState,
} from '@states/settings';
import { handleSaveFieldServiceReports } from '@services/app/cong_field_service_reports';
import {
  apiPocketFieldServiceReportPost,
  apiPocketValidateMe,
} from '@services/api/pocket';
import { decryptData, encryptObject } from '@services/encryption';
import { CongFieldServiceReportType } from '@definition/cong_field_service_reports';
import { dbDelegatedFieldServiceReportsSave } from '@services/dexie/delegated_field_service_reports';

const useSubmitReport = ({ onClose, month, person_uid }: SubmitReportProps) => {
  const { t } = useAppTranslation();

  const { isSecretary, isGroupOverseer } = useCurrentUser();

  const dailyReports = useRecoilValue(userFieldServiceDailyReportsState);
  const monthlyReports = useRecoilValue(userFieldServiceMonthlyReportsState);
  const secretary = useRecoilValue(secretaryRoleState);
  const accountType = useRecoilValue(accountTypeState);
  const localAccessCode = useRecoilValue(congAccessCodeState);

  const {
    minutes_remains,
    bible_studies,
    comments,
    shared_ministry,
    hours_credits,
    hours_fields,
    month_name,
    isSelf,
    userReport,
    delegatedReport,
    congReport,
  } = useMinistryMonthlyRecord({ month, person_uid, publisher: true });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleNextMonthUpdate = async (month: string) => {
    if (!userReport) {
      const monthlyReport = structuredClone(
        userFieldServiceMonthlyReportSchema
      );
      monthlyReport.report_date = month;
      monthlyReport.report_data.shared_ministry = true;
      monthlyReport.report_data.updatedAt = new Date().toISOString();

      await dbUserFieldServiceReportsSave(monthlyReport);
    }
  };

  const handleNextDateUpdate = async (date: string) => {
    let dailyReport = dailyReports.find(
      (record) => record.report_date === date
    );

    if (!dailyReport) {
      dailyReport = structuredClone(userFieldServiceDailyReportSchema);
      dailyReport.report_date = date;
    }

    let hours =
      dailyReport.report_data.hours.field_service.split(':').at(0) || '0';

    let minutes =
      dailyReport.report_data.hours.field_service.split(':').at(1) || '0';

    minutes = String(+minutes + minutes_remains).padStart(2, '0');

    if (+minutes >= 60) {
      minutes = String(+minutes - 60).padStart(2, '0');
      hours = String(+hours + 1);
    }

    dailyReport.report_data.hours.field_service = `${hours}:${minutes}`;
    dailyReport.report_data.updatedAt = new Date().toISOString();

    await dbUserFieldServiceReportsSave(dailyReport);
  };

  const handleTransferMinutes = async () => {
    const currentMonth = currentReportMonth();

    let [year, month] = currentMonth.split('/');

    let valid = false;

    do {
      const newMonth = `${year}/${month}`;
      const report = monthlyReports.find(
        (record) => record.report_date === newMonth
      );

      if (report.report_data.status === 'pending') {
        valid = true;
        break;
      }

      month = String(+month + 1).padStart(2, '0');

      if (+month === 13) {
        month = '01';
        year = String(+year + 1);
      }
    } while (!valid);

    if (currentMonth === month) {
      month = String(+month + 1).padStart(2, '0');

      if (+month === 13) {
        month = '01';
        year = String(+year + 1);
      }
    }

    const nextReportMonth = `${year}/${month}`;
    await handleNextMonthUpdate(nextReportMonth);

    const nextReportDate = `${nextReportMonth}/01`;
    await handleNextDateUpdate(nextReportDate);
  };

  const handleSubmitSelf = async () => {
    let report: CongFieldServiceReportType;

    if (congReport) {
      report = structuredClone(congReport);
    }

    if (!congReport) {
      report = structuredClone(congFieldServiceReportSchema);
      report.report_id = crypto.randomUUID();
      report.report_data.report_date = month;
      report.report_data.person_uid = person_uid;
    }

    report.report_data.bible_studies = bible_studies;
    report.report_data.comments = comments;

    report.report_data.hours = {
      credit: { value: +hours_credits.split(':').at(0), approved: 0 },
      field_service: +hours_fields.split(':').at(0),
    };

    report.report_data.shared_ministry = shared_ministry;
    report.report_data.status = secretary ? 'confirmed' : 'received';
    report.report_data.updatedAt = new Date().toISOString();

    await handleSaveFieldServiceReports(report);
  };

  const handleSubmitPublisher = async () => {
    const report = {
      person_uid: person_uid,
      bible_studies,
      comments: comments,
      hours: +hours_fields.split(':').at(0),
      hours_credits: +hours_credits.split(':').at(0),
      report_month: month,
      shared_ministry,
      updatedAt: new Date().toISOString(),
      _deleted: false,
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

  const handleSubmit = async () => {
    // check if current role is secretary or group overseer
    if (isSecretary || isGroupOverseer) {
      await handleSubmitSelf();
    }

    if (!isSecretary && !isGroupOverseer) {
      await handleSubmitPublisher();
    }

    if (isSelf) {
      const report = structuredClone(userReport);
      report.report_data.status = 'submitted';
      report.report_data.updatedAt = new Date().toISOString();

      await dbUserFieldServiceReportsSave(report);
    }

    if (!isSelf) {
      const report = structuredClone(delegatedReport);
      report.report_data.status = 'submitted';
      report.report_data.updatedAt = new Date().toISOString();

      await dbDelegatedFieldServiceReportsSave(report);
    }
  };

  const handleTransferAndSubmit = async () => {
    if (isSelf && minutes_remains > 0) {
      await handleTransferMinutes();
    }

    try {
      setIsProcessing(true);

      await handleSubmit();

      await displaySnackNotification({
        header: t('tr_done'),
        message: t('tr_reportSubmittedDesc', { month: month_name }),
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

  const handleKeepMinutesOrClose = async () => {
    if (minutes_remains === 0) return onClose?.();

    try {
      setIsProcessing(true);

      await handleSubmit();

      await displaySnackNotification({
        header: t('tr_done'),
        message: t('tr_reportSubmittedDesc', { month: month_name }),
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

  return {
    minutes_remains,
    handleKeepMinutesOrClose,
    isProcessing,
    handleTransferAndSubmit,
  };
};

export default useSubmitReport;
