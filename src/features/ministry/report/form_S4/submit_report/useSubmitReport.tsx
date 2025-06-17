import { useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  userFieldServiceDailyReportsState,
  userFieldServiceMonthlyReportsState,
} from '@states/user_field_service_reports';
import { SubmitReportProps } from './index.types';
import { displaySnackNotification } from '@services/states/app';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import { addMonths, formatDate } from '@utils/date';
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
import { handleSaveDailyFieldServiceReport } from '@services/app/user_field_service_reports';

const useSubmitReport = ({ onClose, month, person_uid }: SubmitReportProps) => {
  const { t } = useAppTranslation();

  const { isSecretary, isGroupOverseer, isLanguageGroupOverseer } =
    useCurrentUser();

  const dailyReports = useAtomValue(userFieldServiceDailyReportsState);
  const monthlyReports = useAtomValue(userFieldServiceMonthlyReportsState);
  const secretary = useAtomValue(secretaryRoleState);
  const accountType = useAtomValue(accountTypeState);
  const localAccessCode = useAtomValue(congAccessCodeState);

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
    const findReport = monthlyReports.find(
      (record) => record.report_date === month
    );

    if (!findReport) {
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

    await handleSaveDailyFieldServiceReport(dailyReport);
  };

  const handleTransferMinutes = async () => {
    const nextMonth = formatDate(addMonths(`${month}/01`, 1), 'yyyy/MM');

    let [varYear, varMonth] = nextMonth.split('/');

    let valid = false;

    do {
      const newMonth = `${varYear}/${varMonth}`;

      const report = monthlyReports.find(
        (record) => record.report_date === newMonth
      );

      if (!report) {
        valid = true;
      }

      if (report?.report_data.status === 'pending') {
        valid = true;
      }

      if (!valid) {
        varMonth = String(+varMonth + 1).padStart(2, '0');

        if (+varMonth === 13) {
          varMonth = '01';
          varYear = String(+varYear + 1);
        }
      }
    } while (!valid);

    const nextReportMonth = `${varYear}/${varMonth}`;
    await handleNextMonthUpdate(nextReportMonth);

    const nextReportDate = `${nextReportMonth}/01`;
    await handleNextDateUpdate(nextReportDate);
  };

  const handleSubmitSelf = async (round: boolean) => {
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

    let fieldHours = +hours_fields.split(':').at(0);

    if (round) {
      const fieldMinutes = +hours_fields.split(':').at(1);
      fieldHours = fieldHours + (fieldMinutes >= 30 ? 1 : 0);
    }

    let creditHours = +hours_credits.split(':').at(0);
    const creditMinutes = +hours_credits.split(':').at(1);

    creditHours = creditHours + (creditMinutes >= 30 ? 1 : 0);

    report.report_data.hours = {
      credit: { value: creditHours, approved: 0 },
      field_service: fieldHours,
    };

    report.report_data.shared_ministry = shared_ministry;
    report.report_data.status = secretary ? 'confirmed' : 'received';
    report.report_data.updatedAt = new Date().toISOString();

    await handleSaveFieldServiceReports(report);
  };

  const handleSubmitPublisher = async (round: boolean) => {
    let fieldHours = +hours_fields.split(':').at(0);

    if (round) {
      const fieldMinutes = +hours_fields.split(':').at(1);
      fieldHours = fieldHours + (fieldMinutes >= 30 ? 1 : 0);
    }

    let creditHours = +hours_credits.split(':').at(0);
    const creditMinutes = +hours_credits.split(':').at(1);
    creditHours = creditHours + (creditMinutes >= 30 ? 1 : 0);

    const report = {
      person_uid: person_uid,
      bible_studies,
      comments: comments,
      hours: fieldHours,
      hours_credits: creditHours,
      report_month: month,
      shared_ministry,
      updatedAt: new Date().toISOString(),
      _deleted: false,
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

  const handleSubmit = async (round = false) => {
    // check if current role is secretary or group overseer
    if (isSecretary || isGroupOverseer || isLanguageGroupOverseer) {
      await handleSubmitSelf(round);
    }

    if (!isSecretary && !isGroupOverseer && !isLanguageGroupOverseer) {
      await handleSubmitPublisher(round);
    }

    if (isSelf) {
      const report = structuredClone(userReport);

      if (round) {
        const fieldDaily = report.report_data.hours.field_service.daily
          .split(':')
          .map(Number)
          .reduce((acc, current, index) => {
            if (index === 0) acc = acc + current * 60;
            if (index > 0) acc = acc + current;
            return acc;
          }, 0);

        const fieldMonthly = report.report_data.hours.field_service.monthly
          .split(':')
          .map(Number)
          .reduce((acc, current, index) => {
            if (index === 0) acc = acc + current * 60;
            if (index > 0) acc = acc + current;
            return acc;
          }, 0);

        const fieldExcessMinutes = (fieldDaily + fieldMonthly) % 60;
        const fieldMinutes = 60 - fieldExcessMinutes;

        if (fieldExcessMinutes < 30) {
          const totalMinutes = fieldMonthly - fieldExcessMinutes;
          const reportMinute = totalMinutes % 60;
          const reportHour = (totalMinutes - reportMinute) / 60;

          report.report_data.hours.field_service.monthly = `${reportHour}:${String(reportMinute).padStart(2, '0')}`;
        }

        if (fieldExcessMinutes >= 30) {
          const totalMinutes = fieldMonthly + fieldMinutes;
          const reportMinute = totalMinutes % 60;
          const reportHour = (totalMinutes - reportMinute) / 60;

          report.report_data.hours.field_service.monthly = `${reportHour}:${String(reportMinute).padStart(2, '0')}`;
        }
      }

      const creditDaily = report.report_data.hours.credit.daily
        .split(':')
        .map(Number)
        .reduce((acc, current, index) => {
          if (index === 0) acc = acc + current * 60;
          if (index > 0) acc = acc + current;
          return acc;
        }, 0);

      const creditMonthly = report.report_data.hours.credit.monthly
        .split(':')
        .map(Number)
        .reduce((acc, current, index) => {
          if (index === 0) acc = acc + current * 60;
          if (index > 0) acc = acc + current;
          return acc;
        }, 0);

      const creditExcessMinutes = (creditDaily + creditMonthly) % 60;
      const creditMinutes = 60 - creditExcessMinutes;

      if (creditExcessMinutes < 30) {
        const totalMinutes = creditMonthly - creditExcessMinutes;
        const reportMinute = totalMinutes % 60;
        const reportHour = (totalMinutes - reportMinute) / 60;

        report.report_data.hours.credit.monthly = `${reportHour}:${String(reportMinute).padStart(2, '0')}`;
      }

      if (creditExcessMinutes >= 30) {
        const totalMinutes = creditMonthly + creditMinutes;
        const reportMinute = totalMinutes % 60;
        const reportHour = (totalMinutes - reportMinute) / 60;

        report.report_data.hours.credit.monthly = `${reportHour}:${String(reportMinute).padStart(2, '0')}`;
      }

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

      displaySnackNotification({
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

      displaySnackNotification({
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

      await handleSubmit(true);

      displaySnackNotification({
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

      displaySnackNotification({
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
