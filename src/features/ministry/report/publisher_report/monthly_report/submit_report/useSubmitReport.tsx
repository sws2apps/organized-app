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
  userFieldServiceDailyReportSchema,
  userFieldServiceMonthlyReportSchema,
} from '@services/dexie/schema';
import useMinistryMonthlyRecord from '@features/ministry/hooks/useMinistryMonthlyRecord';
import { dbUserFieldServiceReportsSave } from '@services/dexie/user_field_service_reports';
import { apiUserFieldServiceReportPost } from '@services/api/user';

const useSubmitReport = ({ onClose }: SubmitReportProps) => {
  const { t } = useAppTranslation();

  const selectedMonth = useRecoilValue(reportUserSelectedMonthState);
  const dailyReports = useRecoilValue(userFieldServiceDailyReportsState);
  const monthlyReports = useRecoilValue(userFieldServiceMonthlyReportsState);

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

  const handleSubmit = async () => {
    // await apiUserFieldServiceReportPost({
    //   bible_studies,
    //   comments: comments,
    //   hours,
    //   hours_credits: hours_credit,
    //   report_month: selectedMonth,
    //   shared_ministry,
    // });

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
