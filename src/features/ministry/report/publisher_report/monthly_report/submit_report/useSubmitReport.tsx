import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  reportUserSelectedMonthState,
  userFieldServiceDailyReportsState,
  userFieldServiceMonthlyReportsState,
} from '@states/user_field_service_reports';
import { SubmitReportProps } from './index.types';
import { displaySnackNotification } from '@services/recoil/app';
import { useAppTranslation } from '@hooks/index';
import { getMessageByCode } from '@services/i18n/translation';
import { currentReportMonth } from '@utils/date';
import {
  congFieldServiceReportSchema,
  userFieldServiceDailyReportSchema,
  userFieldServiceMonthlyReportSchema,
} from '@services/dexie/schema';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';
import { dbUserFieldServiceReportsSave } from '@services/dexie/user_field_service_reports';
import { apiUserFieldServiceReportPost } from '@services/api/user';
import { secretaryRoleState, userLocalUIDState } from '@states/settings';
import { congFieldServiceReportsState } from '@states/field_service_reports';
import { handleSaveFieldServiceReports } from '@services/app/cong_field_service_reports';

const useSubmitReport = ({ onClose }: SubmitReportProps) => {
  const { t } = useAppTranslation();

  const selectedMonth = useRecoilValue(reportUserSelectedMonthState);
  const dailyReports = useRecoilValue(userFieldServiceDailyReportsState);
  const monthlyReports = useRecoilValue(userFieldServiceMonthlyReportsState);
  const secretary = useRecoilValue(secretaryRoleState);
  const congReports = useRecoilValue(congFieldServiceReportsState);
  const userUID = useRecoilValue(userLocalUIDState);

  const {
    minutes_remains,
    monthname,
    hours,
    bible_studies,
    comments,
    shared_ministry,
    hours_credit,
  } = useMinistryMonthlyRecord(selectedMonth);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleNextMonthUpdate = async (month: string) => {
    let monthlyReport = monthlyReports.find(
      (record) => record.report_date === month
    );

    if (!monthlyReport) {
      monthlyReport = structuredClone(userFieldServiceMonthlyReportSchema);
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

    if (currentMonth === selectedMonth) {
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
    let report = congReports.find(
      (record) =>
        record.report_data.person_uid === userUID &&
        record.report_data.report_date === selectedMonth
    );

    if (!report) {
      report = structuredClone(congFieldServiceReportSchema);
      report.report_id = crypto.randomUUID();
      report.report_data.report_date = selectedMonth;
      report.report_data.person_uid = userUID;
    }

    report.report_data.bible_studies = bible_studies;
    report.report_data.comments = comments;
    report.report_data.hours = {
      credit: { value: hours_credit, approved: 0 },
      field_service: hours,
    };
    report.report_data.shared_ministry = shared_ministry;
    report.report_data.status = 'received';
    report.report_data.updatedAt = new Date().toISOString();

    await handleSaveFieldServiceReports(report);
  };

  const handleSubmitPublisher = async () => {
    await apiUserFieldServiceReportPost({
      bible_studies,
      comments: comments,
      hours,
      hours_credits: hours_credit,
      report_month: selectedMonth,
      shared_ministry,
    });
  };

  const handleSubmit = async () => {
    // check if current role is secretary
    if (secretary) {
      await handleSubmitSelf();
    }

    if (!secretary) {
      await handleSubmitPublisher();
    }

    let report = monthlyReports.find(
      (record) => record.report_date === selectedMonth
    );

    report = structuredClone(report);
    report.report_data.status = 'submitted';

    await dbUserFieldServiceReportsSave(report);
  };

  const handleTransferAndSubmit = async () => {
    if (minutes_remains > 0) {
      await handleTransferMinutes();
    }

    try {
      setIsProcessing(true);

      await handleSubmit();

      await displaySnackNotification({
        header: t('tr_done'),
        message: t('tr_reportSubmittedDesc', { month: monthname }),
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

  const handleKeepMinutesOrClose = async () => {
    if (minutes_remains === 0) return onClose?.();

    try {
      setIsProcessing(true);

      await handleSubmit();

      await displaySnackNotification({
        header: t('tr_done'),
        message: t('tr_reportSubmittedDesc', { month: monthname }),
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
    minutes_remains,
    handleKeepMinutesOrClose,
    isProcessing,
    handleTransferAndSubmit,
  };
};

export default useSubmitReport;
